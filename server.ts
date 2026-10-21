import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import JSZip from 'jszip';
import { RADAR_APIS } from './src/data/radarApis';
import {
  isSafeRegisteredEndpoint,
  isValidAspectRatio,
  isValidOperationName,
  normalizeGeneratedAudio,
  readImageDataUrl,
  readPrompt,
} from './server-utils';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: { headers: { 'User-Agent': 'umbrella-free-api-radar' } },
});

app.use(express.json({ limit: '15mb' }));

function requireApiKey(res: express.Response): boolean {
  if (apiKey) return true;
  res.status(503).json({ error: 'Generation is unavailable: configure GEMINI_API_KEY on the server.' });
  return false;
}

function videoOperation(name: string): GenerateVideosOperation {
  const operation = new GenerateVideosOperation();
  operation.name = name;
  return operation;
}

app.post('/api/search-grounding', async (req, res) => {
  const query = readPrompt(req.body?.query, 500);
  if (!query) return res.status(400).json({ error: 'Enter a search query of 1–500 characters.' });
  if (!requireApiKey(res)) return;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find official pages for: ${query}. Focus on developer documentation and public API-key registration or console pages. Summarize in Polish and do not invent pricing or limits.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    const text = response.text?.trim();
    if (!text) return res.status(502).json({ error: 'The search provider returned no report. Try again later.' });
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((chunk: any) => typeof chunk.web?.uri === 'string' && chunk.web.uri.startsWith('https://'))
      .map((chunk: any) => ({ title: chunk.web.title || chunk.web.uri, url: chunk.web.uri }));

    return res.json({ text, sources });
  } catch (error) {
    console.error('Search grounding request failed:', error);
    return res.status(502).json({ error: 'Live search failed. Check the server API key and model access, then retry.' });
  }
});

app.post('/api/generate-video', async (req, res) => {
  const prompt = readPrompt(req.body?.prompt);
  const image = readImageDataUrl(req.body?.imageData);
  const aspectRatio = req.body?.aspectRatio;

  if (!prompt) return res.status(400).json({ error: 'Enter a prompt of 1–2,000 characters.' });
  if (!image) return res.status(400).json({ error: 'Upload a PNG, JPEG, or WebP reference image (maximum 10 MB).' });
  if (!isValidAspectRatio(aspectRatio)) return res.status(400).json({ error: 'Choose a supported video ratio: 16:9 or 9:16.' });
  if (!requireApiKey(res)) return;

  try {
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      image: { imageBytes: image.imageBytes, mimeType: image.mimeType },
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio },
    });
    if (!operation.name || !isValidOperationName(operation.name)) {
      return res.status(502).json({ error: 'The video provider did not return a valid operation identifier.' });
    }
    return res.status(202).json({ operationName: operation.name });
  } catch (error) {
    console.error('Video generation request failed:', error);
    return res.status(502).json({ error: 'Video generation failed. Check GEMINI_API_KEY, Veo access, and the prompt.' });
  }
});

app.post('/api/video-status', async (req, res) => {
  const operationName = req.body?.operationName;
  if (!isValidOperationName(operationName)) return res.status(400).json({ error: 'Invalid video operation identifier.' });
  if (!requireApiKey(res)) return;

  try {
    const operation = await ai.operations.getVideosOperation({ operation: videoOperation(operationName) });
    if (operation.error) return res.status(502).json({ error: 'Video generation failed at the provider.' });
    return res.json({ done: Boolean(operation.done) });
  } catch (error) {
    console.error('Video status request failed:', error);
    return res.status(502).json({ error: 'Could not check video generation status.' });
  }
});

app.get('/api/video-download', async (req, res) => {
  const operationName = req.query.operationName;
  if (!isValidOperationName(operationName)) return res.status(400).json({ error: 'Invalid video operation identifier.' });
  if (!requireApiKey(res)) return;

  try {
    const operation = await ai.operations.getVideosOperation({ operation: videoOperation(operationName) });
    if (!operation.done) return res.status(409).json({ error: 'Video generation is still in progress.' });
    if (operation.error) return res.status(502).json({ error: 'Video generation failed at the provider.' });
    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) return res.status(502).json({ error: 'The provider completed the request without a video file.' });

    const videoResponse = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
      redirect: 'error',
    });
    if (!videoResponse.ok) return res.status(502).json({ error: 'Could not download the generated video from the provider.' });
    res.setHeader('Content-Type', videoResponse.headers.get('content-type') || 'video/mp4');
    return res.send(Buffer.from(await videoResponse.arrayBuffer()));
  } catch (error) {
    console.error('Video download request failed:', error);
    return res.status(502).json({ error: 'Could not download the generated video.' });
  }
});

app.post('/api/generate-music', async (req, res) => {
  const prompt = readPrompt(req.body?.prompt);
  const model = req.body?.model;
  const supportedModels = new Set(['lyria-3-clip-preview', 'lyria-3-pro-preview']);
  if (!prompt) return res.status(400).json({ error: 'Enter a music prompt of 1–2,000 characters.' });
  if (typeof model !== 'string' || !supportedModels.has(model)) {
    return res.status(400).json({ error: 'Choose a supported Lyria model.' });
  }
  if (!requireApiKey(res)) return;

  try {
    const stream = await ai.models.generateContentStream({
      model,
      contents: prompt,
      config: { responseModalities: ['AUDIO'] },
    });
    const audioChunks: Buffer[] = [];
    let mimeType = '';

    for await (const chunk of stream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
          mimeType ||= part.inlineData.mimeType || '';
        }
      }
    }

    if (audioChunks.length === 0 || !mimeType?.startsWith('audio/')) {
      return res.status(502).json({ error: 'The music provider returned no playable audio.' });
    }
    const normalized = normalizeGeneratedAudio(Buffer.concat(audioChunks), mimeType);
    const audioBase64 = normalized.audio.toString('base64');
    return res.json({ audioUrl: `data:${normalized.mimeType};base64,${audioBase64}`, mimeType: normalized.mimeType });
  } catch (error) {
    console.error('Music generation request failed:', error);
    return res.status(502).json({ error: 'Music generation failed. Check GEMINI_API_KEY, Lyria access, and the prompt.' });
  }
});

app.post('/api/test-endpoint', async (req, res) => {
  const api = RADAR_APIS.find((item) => item.id === req.body?.apiId);
  const method = req.body?.method;
  if (!api || !isSafeRegisteredEndpoint(req.body?.url, api.endpointUrl)) {
    return res.status(400).json({ error: 'This endpoint is not a registered public HTTPS URL or requires template values.' });
  }
  if (method !== 'GET' && method !== 'POST') {
    return res.status(400).json({ error: 'Only GET and POST endpoint checks are supported.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(api.endpointUrl, {
      method,
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      redirect: 'manual',
    });
    const body = (await response.text()).slice(0, 64 * 1024);
    let parsedBody: unknown = body;
    if ((response.headers.get('content-type') || '').includes('application/json')) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        parsedBody = body;
      }
    }
    return res.json({
      status: response.status,
      statusText: response.statusText,
      body: parsedBody,
    });
  } catch (error) {
    console.error(`API endpoint check failed for ${api.id}:`, error);
    return res.status(502).json({ error: 'The endpoint could not be reached. It may require authentication or be temporarily unavailable.' });
  } finally {
    clearTimeout(timeout);
  }
});

app.get('/api/download-zip', async (_req, res) => {
  try {
    const zip = new JSZip();
    const root = zip.folder('free-api-radar-source')!;
    const rootFiles = [
      '.env.example',
      'capacitor.config.json',
      'index.html',
      'package.json',
      'package-lock.json',
      'README.md',
      'server-utils.ts',
      'server-utils.test.ts',
      'server.ts',
      'tsconfig.json',
      'vite.config.ts',
    ];
    for (const file of rootFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        root.file(file, fs.readFileSync(filePath));
      }
    }

    const addDirectory = (directory: string, zipPath: string) => {
      const absolutePath = path.join(__dirname, directory);
      if (!fs.existsSync(absolutePath)) return;
      for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
        const childPath = path.join(absolutePath, entry.name);
        const childZipPath = `${zipPath}/${entry.name}`;
        if (entry.isDirectory()) addDirectory(path.relative(__dirname, childPath), childZipPath);
        else if (entry.isFile()) root.file(childZipPath, fs.readFileSync(childPath));
      }
    };
    addDirectory('src', 'src');
    addDirectory('public', 'public');
    addDirectory('android', 'android');
    for (const workflow of ['android.yml', 'build-web.yml']) {
      const workflowFile = path.join(__dirname, '.github/workflows', workflow);
      if (fs.existsSync(workflowFile)) {
        root.file(`.github/workflows/${workflow}`, fs.readFileSync(workflowFile));
      }
    }

    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="free-api-radar-source.zip"');
    return res.send(buffer);
  } catch (error) {
    console.error('Source archive generation failed:', error);
    return res.status(500).json({ error: 'Could not create the source archive.' });
  }
});

app.use((error: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body must be valid JSON.' });
  }
  console.error('Unhandled request error:', error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ error: 'The server could not complete the request.' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'dist/index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Umbrella Radar Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
