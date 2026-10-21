const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

export function readPrompt(value: unknown, maxLength = 2000): string | null {
  if (typeof value !== 'string') return null;
  const prompt = value.trim();
  return prompt.length > 0 && prompt.length <= maxLength ? prompt : null;
}

export function readImageDataUrl(value: unknown): { mimeType: string; imageBytes: string } | null {
  if (typeof value !== 'string') return null;
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match || !ALLOWED_IMAGE_TYPES.has(match[1])) return null;

  const bytes = Buffer.from(match[2], 'base64');
  if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES || bytes.toString('base64') !== match[2]) {
    return null;
  }

  return { mimeType: match[1], imageBytes: match[2] };
}

export function isValidOperationName(value: unknown): value is string {
  return typeof value === 'string' && /^operations\/[A-Za-z0-9_-]+$/.test(value);
}

export function isValidAspectRatio(value: unknown): value is '16:9' | '9:16' {
  return value === '16:9' || value === '9:16';
}

export function isSafeRegisteredEndpoint(
  value: unknown,
  registeredEndpoint: string | undefined,
): value is string {
  if (typeof value !== 'string' || !registeredEndpoint || value !== registeredEndpoint || value.includes('{')) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && (!url.port || url.port === '443');
  } catch {
    return false;
  }
}

export function normalizeGeneratedAudio(audio: Buffer, mimeType: string): { audio: Buffer; mimeType: string } {
  if (!/^audio\/(?:pcm|l16)(?:;|$)/i.test(mimeType)) return { audio, mimeType };

  const sampleRate = Number(/(?:^|;)rate=(\d+)/i.exec(mimeType)?.[1] || 24000);
  const channels = Number(/(?:^|;)channels=(\d+)/i.exec(mimeType)?.[1] || 1);
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  if (!Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 192000 ||
      ![1, 2].includes(channels) || audio.length === 0 || audio.length % blockAlign !== 0) {
    throw new Error('The audio provider returned unsupported PCM audio.');
  }

  const pcm = Buffer.from(audio);
  if (/^audio\/l16/i.test(mimeType)) pcm.swap16();

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * blockAlign, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);

  return { audio: Buffer.concat([header, pcm]), mimeType: 'audio/wav' };
}
