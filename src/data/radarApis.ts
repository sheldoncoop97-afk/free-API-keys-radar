import { FreeApiItem } from '../types/radar';

export const RADAR_APIS: FreeApiItem[] = [
  // --- AI & Machine Learning ---
  {
    id: 'openai-free-tier',
    name: 'OpenAI (Free Tier)',
    provider: 'OpenAI',
    category: 'ai-ml',
    tags: ['AI', 'Text', 'Chat', 'LLM'],
    shortDescription: 'Free access to OpenAI models (gpt-3.5-turbo, text-embedding, playground credits)',
    fullDescription: 'OpenAI provides free initial credits and free evaluation access to flagship language models including GPT-3.5-Turbo and text embeddings for prototyping and developer testing.',
    rateLimit: '3 500 req/day',
    authType: 'API Key',
    costType: 'Free Tier',
    requiresCreditCard: false,
    websiteUrl: 'https://platform.openai.com',
    docsUrl: 'https://platform.openai.com/docs',
    endpointUrl: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    responseExample: {
      id: "chatcmpl-123",
      object: "chat.completion",
      created: 1700000000,
      model: "gpt-3.5-turbo",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "Umbrella Corporation Free API Radar online. All systems nominal."
          },
          finish_reason: "stop"
        }
      ],
      usage: {
        prompt_tokens: 9,
        completion_tokens: 12,
        total_tokens: 21
      }
    },
    codeSnippets: {
      curl: `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Status report"}]
  }'`,
      javascript: `const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + API_KEY
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Status report' }]
  })
});
const data = await res.json();`,
      python: `import requests

response = requests.post(
    "https://api.openai.com/v1/chat/completions",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Status report"}]}
)
print(response.json())`
    },
    keySteps: [
      'Register at platform.openai.com',
      'Navigate to API Keys in dashboard',
      'Click "Create new secret key" and copy immediately',
      'Enjoy free trial credits and developer playground'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-18'
  },
  {
    id: 'google-gemini-api',
    name: 'Google Gemini 3.8 API',
    provider: 'Google DeepMind',
    category: 'ai-ml',
    tags: ['AI', 'Multimodal', 'Search Grounding', 'Free 15 RPM'],
    shortDescription: 'Free 15 RPM multimodal LLM with native Google Search Grounding and 1M token window',
    fullDescription: 'Google Gemini provides a free tier with 15 requests per minute, 1 million token context window, vision, audio comprehension, and built-in search grounding without entering a credit card.',
    rateLimit: '15 RPM / 1M TPM',
    authType: 'API Key',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://aistudio.google.com',
    docsUrl: 'https://ai.google.dev/docs',
    endpointUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
    method: 'POST',
    responseExample: {
      candidates: [
        {
          content: {
            parts: [{ text: "Umbrella Bio-Radar node verified. Gemini 3.8 operational." }],
            role: "model"
          },
          finishReason: "STOP"
        }
      ],
      usageMetadata: { promptTokenCount: 14, candidatesTokenCount: 11, totalTokenCount: 25 }
    },
    codeSnippets: {
      curl: `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=YOUR_API_KEY" \\
  -H 'Content-Type: application/json' \\
  -d '{"contents": [{"parts":[{"text": "Radar scan initialized"}]}]}'`,
      javascript: `import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: "gemini-3.8-flash",
  contents: "Radar scan initialized"
});
console.log(response.text);`,
      python: `from google import genai
client = genai.Client(api_key="YOUR_API_KEY")
response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="Radar scan initialized"
)
print(response.text)`
    },
    keySteps: [
      'Visit aistudio.google.com and sign in with Google account',
      'Click "Get API key" on the top left',
      'Select or create project — instant key generation without billing setup'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-19'
  },
  {
    id: 'groq-cloud',
    name: 'Groq Cloud LPU',
    provider: 'Groq Inc.',
    category: 'ai-ml',
    tags: ['AI', 'Speed', 'Llama 3', 'Mixtral', 'Ultra-Fast'],
    shortDescription: 'World-fastest inference speed (500+ tokens/s) for open source models on custom LPUs',
    fullDescription: 'Groq provides ultra-fast LLM inference using proprietary Language Processing Units (LPUs). Free tier includes 30 requests/minute for Meta Llama 3, Mixtral 8x7B, and Gemma with zero latency.',
    rateLimit: '30 RPM / 14 400 req/day',
    authType: 'API Key',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://console.groq.com',
    docsUrl: 'https://console.groq.com/docs/quickstart',
    endpointUrl: 'https://api.groq.com/openai/v1/chat/completions',
    method: 'POST',
    responseExample: {
      id: "chatcmpl-groq-09",
      object: "chat.completion",
      created: 1700100000,
      model: "llama-3.1-70b-versatile",
      choices: [{ message: { role: "assistant", content: "Lightning-fast telemetry response from Groq." } }],
      usage: { total_time: 0.12, queue_time: 0.002, prompt_tokens: 15, completion_tokens: 10 }
    },
    codeSnippets: {
      curl: `curl https://api.groq.com/openai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_GROQ_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "llama-3.1-8b-instant", "messages": [{"role": "user", "content": "Ping"}]}'`,
      javascript: `const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  headers: { 'Authorization': 'Bearer ' + GROQ_KEY, 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'user', content: 'Ping' }] })
});`,
      python: `import requests
res = requests.post('https://api.groq.com/openai/v1/chat/completions',
    headers={'Authorization': f'Bearer {GROQ_KEY}'},
    json={'model': 'llama-3.1-8b-instant', 'messages': [{'role': 'user', 'content': 'Ping'}]})`
    },
    keySteps: [
      'Sign in with GitHub or Google at console.groq.com',
      'Go to API Keys section and click "Create API Key"',
      'Drop-in replacement for OpenAI SDK (just change base_url to api.groq.com)'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-15'
  },
  {
    id: 'mistral-ai',
    name: 'Mistral AI API',
    provider: 'Mistral AI',
    category: 'ai-ml',
    tags: ['AI', 'Open Source', 'Mistral-Small', 'Codestral'],
    shortDescription: 'Free developer tier for European flagship models Mistral 7B, Mistral Small, and Codestral',
    fullDescription: 'Mistral AI delivers state of the art lightweight and frontier open models. Free experimental tier grants immediate access to chat, embeddings, and coding completions.',
    rateLimit: '1 req/sec / 1 000 req/day',
    authType: 'API Key',
    costType: 'Free Tier',
    requiresCreditCard: false,
    websiteUrl: 'https://console.mistral.ai',
    docsUrl: 'https://docs.mistral.ai',
    endpointUrl: 'https://api.mistral.ai/v1/chat/completions',
    method: 'POST',
    responseExample: {
      id: "mistral-gen-44",
      model: "mistral-small-latest",
      choices: [{ message: { role: "assistant", content: "Mistral node online with bio-containment protocol." } }]
    },
    codeSnippets: {
      curl: `curl https://api.mistral.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_MISTRAL_KEY" \\
  -d '{"model": "mistral-small-latest", "messages": [{"role": "user", "content": "Analyze"}]}'`,
      javascript: `const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
  headers: { Authorization: 'Bearer ' + MISTRAL_KEY, 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({ model: 'mistral-small-latest', messages: [{ role: 'user', content: 'Analyze' }] })
});`,
      python: `import requests
res = requests.post("https://api.mistral.ai/v1/chat/completions",
    headers={"Authorization": f"Bearer {MISTRAL_KEY}"},
    json={"model": "mistral-small-latest", "messages": [{"role": "user", "content": "Analyze"}]})`
    },
    keySteps: [
      'Create account on console.mistral.ai',
      'Go to API Keys tab and generate your free developer key'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-12'
  },

  // --- Image to Video (USER REQUESTED CATEGORY) ---
  {
    id: 'veo-video-ai',
    name: 'Google Veo 3.1 Video API',
    provider: 'Google DeepMind',
    category: 'image-to-video',
    tags: ['Video', 'Image to Video', 'Veo 3.1', '16:9 & 9:16', 'HD Motion'],
    shortDescription: 'State-of-the-art cinematic image-to-video and text-to-video generation preview',
    fullDescription: 'Google Veo 3.1 Fast Generate Preview produces cinematic high-definition video from uploaded still photos or descriptive prompts. Supports landscape (16:9) and mobile portrait (9:16) aspect ratios with realistic camera motion, fluid physics, and lighting.',
    rateLimit: '5 videos/hour free quota',
    authType: 'API Key',
    costType: 'Free Tier',
    requiresCreditCard: false,
    websiteUrl: 'https://deepmind.google/technologies/veo',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/video',
    endpointUrl: 'https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-fast-generate-preview:generateVideos',
    method: 'POST',
    responseExample: {
      name: "models/veo-3.1-fast-generate-preview/operations/op-981240192",
      metadata: {
        status: "PROCESSING",
        progressPercentage: 100,
        aspectRatio: "16:9",
        resolution: "720p"
      },
      done: true,
      response: {
        generatedVideos: [
          {
            video: {
              uri: "https://generativelanguage.googleapis.com/v1beta/files/veo-out-981.mp4",
              mimeType: "video/mp4"
            }
          }
        ]
      }
    },
    codeSnippets: {
      curl: `curl https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-fast-generate-preview:generateVideos?key=YOUR_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Cinematic camera orbiting Umbrella headquarters at night in heavy rain",
    "config": { "aspectRatio": "16:9", "resolution": "720p" }
  }'`,
      javascript: `import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const operation = await ai.models.generateVideos({
  model: 'veo-3.1-fast-generate-preview',
  prompt: 'Drone flying through dark cyberpunk city',
  image: { imageBytes: base64Photo, mimeType: 'image/png' },
  config: { aspectRatio: '16:9', resolution: '720p' }
});`,
      python: `from google import genai
client = genai.Client(api_key="YOUR_API_KEY")
op = client.models.generate_videos(
    model="veo-3.1-fast-generate-preview",
    prompt="Cinematic camera zoom on subject",
    config={"aspect_ratio": "16:9", "resolution": "720p"}
)`
    },
    keySteps: [
      'Enable Veo model preview in Google AI Studio',
      'Upload image or describe motion trajectory',
      'Poll operation name until done: true then stream MP4'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'LEVEL 2',
    addedDate: '2026-10-19'
  },
  {
    id: 'luma-dream-machine',
    name: 'Luma Dream Machine API',
    provider: 'Luma AI',
    category: 'image-to-video',
    tags: ['Video', 'Image to Video', '30 Free/Mo', 'Photorealistic'],
    shortDescription: 'Free monthly generations for photorealistic 5-second video clips from reference images',
    fullDescription: 'Luma Dream Machine provides free monthly credits allowing creators to transform photos into 5-second videos with consistent characters, realistic physics, and camera pans.',
    rateLimit: '30 videos/month free tier',
    authType: 'Bearer Token',
    costType: 'Free Tier',
    requiresCreditCard: false,
    websiteUrl: 'https://lumalabs.ai/dream-machine',
    docsUrl: 'https://lumalabs.ai/docs',
    endpointUrl: 'https://api.lumalabs.ai/dream-machine/v1/generations',
    method: 'POST',
    responseExample: {
      id: "luma-gen-883",
      state: "completed",
      prompt: "Wind blowing through leaves at sunset",
      assets: {
        video: "https://storage.cdn.lumalabs.ai/gen-883.mp4"
      }
    },
    codeSnippets: {
      curl: `curl https://api.lumalabs.ai/dream-machine/v1/generations \\
  -H "Authorization: Bearer YOUR_LUMA_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Gentle camera push-in", "keyframes": {"frame0": {"type": "image", "url": "https://..."}}}'`,
      javascript: `const res = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + LUMA_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Dynamic motion', keyframes: { frame0: { type: 'image', url: imgUrl } } })
});`,
      python: `import requests
res = requests.post("https://api.lumalabs.ai/dream-machine/v1/generations",
    headers={"Authorization": f"Bearer {LUMA_KEY}"},
    json={"prompt": "Dynamic motion", "keyframes": {"frame0": {"type": "image", "url": img_url}}})`
    },
    keySteps: [
      'Sign up at lumalabs.ai',
      'Go to developer portal to grab API token',
      'Submit keyframes and prompt for image-to-video inference'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-16'
  },
  {
    id: 'kling-ai-video',
    name: 'Kling AI Image to Video',
    provider: 'Kuaishou Technology',
    category: 'image-to-video',
    tags: ['Video', 'Image to Video', 'High Motion', 'Daily Credits'],
    shortDescription: 'Free daily credits for generating up to 1080p 10-second videos from reference pictures',
    fullDescription: 'Kling AI delivers motion quality capable of complex human acrobatics and dramatic cinematic scenes. Free users receive 66 daily credits replenished every 24 hours.',
    rateLimit: '66 credits/day free',
    authType: 'API Key',
    costType: 'Free Credits / Mo',
    requiresCreditCard: false,
    websiteUrl: 'https://klingai.com',
    docsUrl: 'https://klingai.com/api-docs',
    endpointUrl: 'https://api.klingai.com/v1/videos/image2video',
    method: 'POST',
    responseExample: {
      code: 0,
      message: "SUCCESS",
      data: {
        task_id: "kling_task_55910",
        task_status: "submitted",
        created_at: 1700200000
      }
    },
    codeSnippets: {
      curl: `curl https://api.klingai.com/v1/videos/image2video \\
  -H "Authorization: Bearer YOUR_KLING_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"image": "BASE64_IMAGE_STR", "prompt": "Camera tracking shot", "mode": "std"}'`,
      javascript: `const res = await fetch('https://api.klingai.com/v1/videos/image2video', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + KLING_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ image: base64, prompt: 'Dramatic lighting' })
});`,
      python: `import requests
res = requests.post("https://api.klingai.com/v1/videos/image2video",
    headers={"Authorization": f"Bearer {KLING_KEY}"},
    json={"image": base64_str, "prompt": "Dramatic lighting"})`
    },
    keySteps: [
      'Register at klingai.com',
      'Daily 66 free points claimable in dashboard',
      'Use image2video endpoint with standard mode'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-17'
  },
  {
    id: 'runway-gen2',
    name: 'Runway Gen-2 & Gen-3 API',
    provider: 'RunwayML',
    category: 'image-to-video',
    tags: ['Video', 'Gen-2', 'Gen-3 Alpha', 'Motion Brush', 'Free Credits'],
    shortDescription: 'Free initial creative credits for image-to-video synthesis and camera control brush',
    fullDescription: 'Runway provides creative AI tools for cinema and VFX. New developer accounts receive free trial credits to test Gen-2 and Gen-3 Alpha image-to-video pipelines with motion brush parameters.',
    rateLimit: '125 free starter credits',
    authType: 'Bearer Token',
    costType: 'Free Tier',
    requiresCreditCard: false,
    websiteUrl: 'https://runwayml.com',
    docsUrl: 'https://docs.dev.runwayml.com',
    endpointUrl: 'https://api.dev.runwayml.com/v1/image_to_video',
    method: 'POST',
    responseExample: {
      id: "runway_task_1002",
      status: "PENDING",
      createdAt: "2026-10-20T12:00:00Z"
    },
    codeSnippets: {
      curl: `curl https://api.dev.runwayml.com/v1/image_to_video \\
  -H "Authorization: Bearer YOUR_RUNWAY_KEY" \\
  -H "X-Runway-Version: 2024-09-13" \\
  -d '{"promptImage": "https://...", "promptText": "Zoom in slowly", "model": "gen3a_turbo"}'`,
      javascript: `const res = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + RUNWAY_KEY, 'X-Runway-Version': '2024-09-13', 'Content-Type': 'application/json' },
  body: JSON.stringify({ promptImage: imgUrl, promptText: 'Slow zoom' })
});`,
      python: `import requests
res = requests.post("https://api.dev.runwayml.com/v1/image_to_video",
    headers={"Authorization": f"Bearer {RUNWAY_KEY}", "X-Runway-Version": "2024-09-13"},
    json={"promptImage": img_url, "promptText": "Slow zoom"})`
    },
    keySteps: [
      'Create account on runwayml.com',
      'Access developer portal at dev.runwayml.com',
      'Create API secret key with initial free credits'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-14'
  },
  {
    id: 'svd-replicate',
    name: 'Stable Video Diffusion (SVD)',
    provider: 'Stability AI / Replicate Space',
    category: 'image-to-video',
    tags: ['Video', 'Open Source', 'SVD-XT', 'Community Endpoints'],
    shortDescription: 'Free tier open-source 25-frame video generation model from single still images',
    fullDescription: 'Stable Video Diffusion XT converts any still 576x1024 or 1024x576 image into a smooth 25-frame MP4 video clip with configurable motion bucket IDs and augmentation levels.',
    rateLimit: 'Free community quota / 1 req at a time',
    authType: 'API Key',
    costType: 'Free Tier',
    requiresCreditCard: false,
    websiteUrl: 'https://stability.ai',
    docsUrl: 'https://huggingface.co/docs/diffusers/main/en/api/pipelines/stable_video_diffusion',
    endpointUrl: 'https://api.replicate.com/v1/predictions',
    method: 'POST',
    responseExample: {
      id: "svd-prediction-99",
      status: "succeeded",
      output: "https://replicate.delivery/pbxt/svd-out.mp4"
    },
    codeSnippets: {
      curl: `curl -X POST https://api.replicate.com/v1/predictions \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -d '{"version": "3f0457e4619da201af", "input": {"input_image": "https://..."}}'`,
      javascript: `const res = await fetch('https://api.replicate.com/v1/predictions', {
  headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({ version: '3f0457e4619da201af', input: { input_image: imgUrl } })
});`,
      python: `import replicate
output = replicate.run(
    "stability-ai/stable-video-diffusion:3f0457e4619da201af0bf0ff560b97162bb04d4fc6e04a6f74c7b26b45cece28",
    input={"input_image": open("photo.jpg", "rb")}
)`
    },
    keySteps: [
      'Sign in via GitHub at replicate.com or huggingface.co',
      'Use the free monthly testing quota for SVD-XT'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-11'
  },

  // --- Text & Language ---
  {
    id: 'deepl-api-free',
    name: 'DeepL API Free',
    provider: 'DeepL SE',
    category: 'text-language',
    tags: ['Translation', 'NLP', '500k chars/mo', 'Human Quality'],
    shortDescription: 'World-leading neural machine translation for 30+ languages, 500 000 chars/month free',
    fullDescription: 'DeepL Free API provides 500,000 characters per month of translation quality that outclasses standard translators, maintaining tone, formal/informal register, and technical jargon.',
    rateLimit: '500 000 chars/month',
    authType: 'API Key',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://www.deepl.com/pro-api',
    docsUrl: 'https://developers.deepl.com/docs',
    endpointUrl: 'https://api-free.deepl.com/v2/translate',
    method: 'POST',
    responseExample: {
      translations: [
        {
          detected_source_language: "EN",
          text: "Radar darmowych kluczy API korporacji Umbrella online."
        }
      ]
    },
    codeSnippets: {
      curl: `curl https://api-free.deepl.com/v2/translate \\
  -H "Authorization: DeepL-Auth-Key YOUR_KEY" \\
  -d "text=Hello World" \\
  -d "target_lang=PL"`,
      javascript: `const res = await fetch('https://api-free.deepl.com/v2/translate', {
  method: 'POST',
  headers: {
    'Authorization': 'DeepL-Auth-Key ' + DEEPL_KEY,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'text=Hello%20World&target_lang=PL'
});
const data = await res.json();`,
      python: `import requests
res = requests.post("https://api-free.deepl.com/v2/translate",
    headers={"Authorization": f"DeepL-Auth-Key {DEEPL_KEY}"},
    data={"text": "Hello World", "target_lang": "PL"})
print(res.json())`
    },
    keySteps: [
      'Register for "DeepL API Free Plan" on deepl.com/pro-api',
      'Copy your authentication key ending with :fx',
      'Send POST requests to api-free.deepl.com'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-14'
  },
  {
    id: 'libretranslate',
    name: 'LibreTranslate',
    provider: 'LibreTranslate / Community',
    category: 'text-language',
    tags: ['Translation', 'Open Source', 'Self-Hostable', 'No Key'],
    shortDescription: 'Free open source translation engine powered by Argos Translate with public instances',
    fullDescription: 'LibreTranslate is a 100% free open-source neural machine translation API. Multiple public mirrors allow free queries without registration, or you can self-host locally via Docker.',
    rateLimit: '100 req/hour on public mirrors',
    authType: 'No Auth',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://libretranslate.com',
    docsUrl: 'https://libretranslate.com/docs',
    endpointUrl: 'https://translate.terraprint.co/translate',
    method: 'POST',
    responseExample: {
      translatedText: "Inicjalizacja radaru Umbrella."
    },
    codeSnippets: {
      curl: `curl -X POST https://translate.terraprint.co/translate \\
  -H "Content-Type: application/json" \\
  -d '{"q": "Hello Umbrella", "source": "en", "target": "pl", "format": "text"}'`,
      javascript: `const res = await fetch('https://translate.terraprint.co/translate', {
  method: 'POST',
  body: JSON.stringify({ q: 'Hello Umbrella', source: 'en', target: 'pl' }),
  headers: { 'Content-Type': 'application/json' }
});`,
      python: `import requests
res = requests.post("https://translate.terraprint.co/translate",
    json={"q": "Hello Umbrella", "source": "en", "target": "pl"})`
    },
    keySteps: [
      'Directly send POST request to public endpoint or run docker run -ti --rm -p 5000:5000 libretranslate/libretranslate',
      'Zero API key required on open mirrors'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-10'
  },
  {
    id: 'languagetool-api',
    name: 'LanguageTool Grammar API',
    provider: 'LanguageTool',
    category: 'text-language',
    tags: ['Grammar', 'Spellcheck', 'Style', 'Multi-Language'],
    shortDescription: 'Free grammar, spelling, and style analysis API supporting 30+ languages',
    fullDescription: 'LanguageTool finds errors that a simple spellchecker cannot detect, including false friends, comma splices, word repetition, and formal tone recommendations.',
    rateLimit: '20 req/minute free',
    authType: 'No Auth',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://languagetool.org',
    docsUrl: 'https://languagetool.org/http-api/swagger-ui/',
    endpointUrl: 'https://api.languagetool.org/v2/check',
    method: 'POST',
    responseExample: {
      software: { name: "LanguageTool", version: "6.4" },
      matches: [
        {
          message: "Possible typo: 'aple' -> 'apple'",
          shortMessage: "Spelling mistake",
          offset: 10,
          length: 4,
          replacements: [{ value: "apple" }]
        }
      ]
    },
    codeSnippets: {
      curl: `curl -X POST https://api.languagetool.org/v2/check \\
  -d "text=This is a aple" \\
  -d "language=en-US"`,
      javascript: `const res = await fetch('https://api.languagetool.org/v2/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'text=This%20is%20a%20aple&language=en-US'
});`,
      python: `import requests
res = requests.post("https://api.languagetool.org/v2/check",
    data={"text": "This is a aple", "language": "en-US"})`
    },
    keySteps: [
      'No registration needed for basic free tier',
      'Directly post text string to api.languagetool.org/v2/check'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-09'
  },

  // --- Image & Vision ---
  {
    id: 'pollinations-ai',
    name: 'Pollinations.ai Free Image API',
    provider: 'Pollinations AI',
    category: 'image-vision',
    tags: ['Image Generation', 'No Key', 'Flux', 'SDXL', 'Unlimited'],
    shortDescription: '100% free, instant image generation with FLUX and SDXL via simple GET URLs',
    fullDescription: 'Pollinations.ai offers genuinely free image generation without signups, tokens, or credit cards. Simply fetch an image URL with your prompt in the path.',
    rateLimit: 'Unlimited / Community supported',
    authType: 'No Auth',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://pollinations.ai',
    docsUrl: 'https://github.com/pollinations/pollinations',
    endpointUrl: 'https://image.pollinations.ai/prompt/{prompt}',
    method: 'GET',
    responseExample: {
      status: "200 OK",
      contentType: "image/jpeg",
      info: "Direct binary image stream returned instantly"
    },
    codeSnippets: {
      curl: `curl -o umbrella_agent.jpg "https://image.pollinations.ai/prompt/cyberpunk%20umbrella%20agent%20in%20rain%20neon?width=1024&height=1024&model=flux"`,
      javascript: `const imageUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent('cyberpunk umbrella agent') + '?width=1024&height=1024&model=flux';
const img = new Image();
img.src = imageUrl;`,
      python: `import requests
res = requests.get("https://image.pollinations.ai/prompt/cyberpunk%20umbrella%20agent?model=flux")
with open("agent.jpg", "wb") as f:
    f.write(res.content)`
    },
    keySteps: [
      'No signup, zero setup',
      'Format prompt into the URL path and display directly in an <img src="..."> element'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-18'
  },
  {
    id: 'gemini-nano-banana-image',
    name: 'Gemini Image Studio API',
    provider: 'Google DeepMind',
    category: 'image-vision',
    tags: ['Image Gen', 'Nano Banana 2.1', 'Flash Image', '4K Support'],
    shortDescription: 'High quality text-to-image and multimodal image editing supporting up to 4K resolution',
    fullDescription: 'Generate and edit high fidelity images using Google Gemini image models. Supports precise text editing, style transfer, aspect ratios (1:1, 16:9, 9:16), and search grounding.',
    rateLimit: '60 req/min',
    authType: 'API Key',
    costType: 'Free Tier',
    requiresCreditCard: false,
    websiteUrl: 'https://ai.google.dev',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    endpointUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-image:generateContent',
    method: 'POST',
    responseExample: {
      candidates: [{
        content: {
          parts: [{
            inlineData: { mimeType: "image/png", data: "iVBORw0KGgoAAAANSUhEUgAA..." }
          }]
        }
      }]
    },
    codeSnippets: {
      curl: `curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-image:generateContent?key=YOUR_KEY \\
  -H "Content-Type: application/json" \\
  -d '{"contents": [{"parts": [{"text": "Red glowing umbrella insignia in dark rain"}]}]}'`,
      javascript: `import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-3.1-flash-lite-image',
  contents: { parts: [{ text: 'Umbrella biohazard shield' }] }
});`,
      python: `from google import genai
client = genai.Client(api_key="YOUR_KEY")
res = client.models.generate_content(
    model="gemini-3.1-flash-lite-image",
    contents="Umbrella biohazard shield"
)`
    },
    keySteps: [
      'Get API key from Google AI Studio',
      'Call generateContent with image prompt',
      'Render base64 image data directly'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-19'
  },
  {
    id: 'cloudinary-api',
    name: 'Cloudinary Media API',
    provider: 'Cloudinary',
    category: 'image-vision',
    tags: ['CDN', 'Transformations', 'Free 25 Credits', 'Video & Image'],
    shortDescription: 'Free tier with 25 monthly credits (25 GB managed storage or 25,000 transformations)',
    fullDescription: 'Cloudinary is the industry standard cloud service for uploading, storing, transforming, and delivering images and videos with AI background removal, auto-cropping, and CDN delivery.',
    rateLimit: '25 credits/month free (~25k transforms)',
    authType: 'API Key',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://cloudinary.com',
    docsUrl: 'https://cloudinary.com/documentation',
    endpointUrl: 'https://api.cloudinary.com/v1_1/{cloud_name}/image/upload',
    method: 'POST',
    responseExample: {
      asset_id: "c9834bba",
      public_id: "umbrella_asset",
      format: "jpg",
      secure_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    },
    codeSnippets: {
      curl: `curl https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload \\
  -F "file=@photo.jpg" \\
  -F "upload_preset=YOUR_PRESET"`,
      javascript: `const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', 'my_preset');
const res = await fetch('https://api.cloudinary.com/v1_1/demo/image/upload', {
  method: 'POST',
  body: formData
});`,
      python: `import cloudinary.uploader
res = cloudinary.uploader.upload("photo.jpg", upload_preset="my_preset")`
    },
    keySteps: [
      'Sign up at cloudinary.com free tier',
      'Enable "unsigned upload preset" for direct frontend uploads',
      'Transform images on the fly via URL params (e.g. /w_500,h_500,c_fill/)'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-12'
  },

  // --- Audio & Speech ---
  {
    id: 'lyria-music-ai',
    name: 'Google Lyria 3 Music API',
    provider: 'Google DeepMind',
    category: 'audio-speech',
    tags: ['Music', 'Lyria Clip', 'Audio Synthesis', '30s & Full Track'],
    shortDescription: 'Generate cinematic music tracks and short 30-second clips from descriptive prompts',
    fullDescription: 'Google Lyria 3 generates high-fidelity music spanning orchestral soundtracks, electronic cyberpunk synths, ambient drones, and vocal arrangements. Supports lyria-3-clip-preview (up to 30s) and lyria-3-pro-preview for complete tracks.',
    rateLimit: '10 tracks/day free preview',
    authType: 'API Key',
    costType: 'Free Tier',
    requiresCreditCard: false,
    websiteUrl: 'https://deepmind.google/technologies/lyria',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/music',
    endpointUrl: 'https://generativelanguage.googleapis.com/v1beta/models/lyria-3-clip-preview:streamGenerateContent',
    method: 'POST',
    responseExample: {
      candidates: [{
        content: {
          parts: [{
            inlineData: { mimeType: "audio/wav", data: "UklGRi4AAABXQVZFZm10..." }
          }]
        }
      }]
    },
    codeSnippets: {
      curl: `curl https://generativelanguage.googleapis.com/v1beta/models/lyria-3-clip-preview:streamGenerateContent?key=YOUR_KEY \\
  -H "Content-Type: application/json" \\
  -d '{"contents": "Dark cyberpunk electronic industrial beat with atmospheric bass"}'`,
      javascript: `import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContentStream({
  model: 'lyria-3-clip-preview',
  contents: 'Cinematic orchestral theme for Umbrella Corporation'
});`,
      python: `from google import genai
client = genai.Client(api_key="YOUR_KEY")
res = client.models.generate_content_stream(
    model="lyria-3-clip-preview",
    contents="Cinematic orchestral theme for Umbrella Corporation"
)`
    },
    keySteps: [
      'Obtain API Key from Google AI Studio',
      'Stream audio bytes from lyria-3-clip-preview',
      'Decode base64 chunk into audio/wav Blob'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'LEVEL 1',
    addedDate: '2026-10-18'
  },
  {
    id: 'elevenlabs-voice',
    name: 'ElevenLabs Voice AI',
    provider: 'ElevenLabs',
    category: 'audio-speech',
    tags: ['Voice', 'TTS', 'Voice Cloning', '10k Chars/Mo'],
    shortDescription: 'Free 10,000 characters/month of hyper-realistic AI speech and voice cloning',
    fullDescription: 'ElevenLabs provides premier voice synthesis with emotional inflection, pacing, and multi-lingual voice cloning. Free tier grants 10,000 characters every month.',
    rateLimit: '10 000 chars/month',
    authType: 'API Key',
    costType: 'Free Credits / Mo',
    requiresCreditCard: false,
    websiteUrl: 'https://elevenlabs.io',
    docsUrl: 'https://elevenlabs.io/docs/api-reference',
    endpointUrl: 'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}',
    method: 'POST',
    responseExample: {
      status: "200 OK",
      contentType: "audio/mpeg",
      info: "Direct binary MP3 audio stream returned"
    },
    codeSnippets: {
      curl: `curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM" \\
  -H "xi-api-key: YOUR_ELEVENLABS_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Welcome to Umbrella Corporation. System secure.", "model_id": "eleven_monolingual_v1"}' \\
  --output welcome.mp3`,
      javascript: `const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
  method: 'POST',
  headers: { 'xi-api-key': ELEVEN_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Welcome to Umbrella Corporation.' })
});
const audioBlob = await res.blob();`,
      python: `import requests
res = requests.post("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
    headers={"xi-api-key": ELEVEN_KEY},
    json={"text": "Welcome to Umbrella Corporation."})
with open("welcome.mp3", "wb") as f:
    f.write(res.content)`
    },
    keySteps: [
      'Sign up at elevenlabs.io',
      'Find your API key in Profile settings',
      'Use pre-made voice IDs (e.g. Adam, Rachel, Antoni)'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-13'
  },
  {
    id: 'gemini-flash-lite-tts',
    name: 'Gemini 3.8 Flash TTS',
    provider: 'Google DeepMind',
    category: 'audio-speech',
    tags: ['TTS', 'Low Latency', 'WAV Output', 'Custom Voice'],
    shortDescription: 'Ultra low-latency text-to-speech returning direct RIFF 24kHz WAV streams',
    fullDescription: 'High-speed audio generation model designed for assistant voices, narration, and system alerts. Voices include Puck, Charon, Kore, Fenrir, and Zephyr.',
    rateLimit: '100 req/min',
    authType: 'API Key',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://ai.google.dev',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/speech',
    endpointUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-lite-tts:generateContent',
    method: 'POST',
    responseExample: {
      candidates: [{
        content: {
          parts: [{
            inlineData: { mimeType: "audio/wav", data: "UklGR..." }
          }]
        }
      }]
    },
    codeSnippets: {
      curl: `curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-lite-tts:generateContent?key=YOUR_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [{"parts": [{"text": "Umbrella system diagnostics complete."}]}],
    "config": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Fenrir"}}}}
  }'`,
      javascript: `import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-3.8-flash-lite-tts',
  contents: 'All bio-containment seals active.',
  config: { responseModalities: ['AUDIO'] }
});`,
      python: `from google import genai
client = genai.Client(api_key="YOUR_KEY")
res = client.models.generate_content(
    model="gemini-3.8-flash-lite-tts",
    contents="All bio-containment seals active.",
    config={"response_modalities": ["AUDIO"]}
)`
    },
    keySteps: [
      'Free key via Google AI Studio',
      'Config responseModalities: ["AUDIO"]',
      'Play WAV buffer directly in browser'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-18'
  },

  // --- Developer Tools ---
  {
    id: 'github-rest-api',
    name: 'GitHub REST & GraphQL API',
    provider: 'GitHub Inc.',
    category: 'developer-tools',
    tags: ['Dev Tools', 'Git', '5 000 req/hr', 'Octokit'],
    shortDescription: 'Free 5,000 req/hour for authenticated calls and 60 req/hour without authentication',
    fullDescription: 'Comprehensive developer API for repos, commits, issues, GitHub Actions CI/CD workflows, pull requests, releases, and user profiles.',
    rateLimit: '5 000 req/hr (authenticated)',
    authType: 'Bearer Token',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://github.com',
    docsUrl: 'https://docs.github.com/en/rest',
    endpointUrl: 'https://api.github.com/user',
    method: 'GET',
    responseExample: {
      login: "umbrella-researcher",
      id: 994012,
      public_repos: 42,
      followers: 1337
    },
    codeSnippets: {
      curl: `curl -H "Authorization: Bearer YOUR_GITHUB_PAT" https://api.github.com/user`,
      javascript: `const res = await fetch('https://api.github.com/user', {
  headers: { Authorization: 'Bearer ' + GITHUB_TOKEN }
});`,
      python: `import requests
res = requests.get("https://api.github.com/user", headers={"Authorization": f"Bearer {GITHUB_TOKEN}"})`
    },
    keySteps: [
      'GitHub Settings -> Developer Settings -> Personal Access Tokens',
      'Generate Classic or Fine-grained token',
      'Pass in Authorization header'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-11'
  },
  {
    id: 'supabase-free-tier',
    name: 'Supabase BaaS Free Tier',
    provider: 'Supabase',
    category: 'developer-tools',
    tags: ['PostgreSQL', 'Auth', 'Realtime', 'Storage', 'Free Cloud'],
    shortDescription: 'Free hosted PostgreSQL database, Auth, 1GB Storage, and Realtime WebSocket subscriptions',
    fullDescription: 'Supabase is the open-source Firebase alternative. Free tier includes two active cloud PostgreSQL databases, 500MB database space, 1GB file storage, and 50,000 monthly active users.',
    rateLimit: '50 000 MAU / 2 projects free',
    authType: 'API Key',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://supabase.com',
    docsUrl: 'https://supabase.com/docs',
    endpointUrl: 'https://{project_ref}.supabase.co/rest/v1/',
    method: 'GET',
    responseExample: {
      data: [{ id: 1, name: "Biohazard Protocol Beta", created_at: "2026-10-20" }],
      status: 200
    },
    codeSnippets: {
      curl: `curl "https://YOUR_PROJECT.supabase.co/rest/v1/posts?select=*" \\
  -H "apikey: YOUR_ANON_KEY" \\
  -H "Authorization: Bearer YOUR_ANON_KEY"`,
      javascript: `import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://xyz.supabase.co', 'YOUR_ANON_KEY');
const { data, error } = await supabase.from('radar_items').select('*');`,
      python: `from supabase import create_client
supabase = create_client("https://xyz.supabase.co", "YOUR_ANON_KEY")
data = supabase.table("radar_items").select("*").execute()`
    },
    keySteps: [
      'Sign in with GitHub on supabase.com',
      'Create new project (takes ~60s to provision)',
      'Copy Project URL and anon public API key'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-15'
  },
  {
    id: 'jsonplaceholder',
    name: 'JSONPlaceholder Fake REST API',
    provider: 'Typicode',
    category: 'developer-tools',
    tags: ['Mock Data', 'No Auth', 'REST Prototyping', 'CORS Enabled'],
    shortDescription: 'Free mock REST API with fake posts, users, comments, and todos for rapid testing',
    fullDescription: 'Zero configuration fake online REST API ready for quick tests, UI prototyping, tutorials, and mock responses. Supports GET, POST, PUT, PATCH, DELETE with CORS headers.',
    rateLimit: 'Unlimited',
    authType: 'No Auth',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://jsonplaceholder.typicode.com',
    docsUrl: 'https://jsonplaceholder.typicode.com/guide/',
    endpointUrl: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'GET',
    responseExample: {
      userId: 1,
      id: 1,
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit suscipit recusandae consequuntur expedita et cum..."
    },
    codeSnippets: {
      curl: `curl https://jsonplaceholder.typicode.com/posts/1`,
      javascript: `const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
const data = await res.json();`,
      python: `import requests
res = requests.get('https://jsonplaceholder.typicode.com/posts/1').json()`
    },
    keySteps: [
      'No registration or API key required',
      'Immediate access to /posts, /comments, /albums, /photos, /todos, /users'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'PUBLIC',
    addedDate: '2026-10-08'
  },

  // =========================================================================
  // SECOND SPACE / DRUGA PRZESTRZEŃ: ADULT & UNCENSORED APIS (18+ CLASSIFIED)
  // User requested: "druga przestrzeń, czyli second tab dla API dla dorosłych"
  // =========================================================================
  {
    id: 'venice-ai-unfiltered',
    name: 'Venice.ai Unfiltered API',
    provider: 'Venice AI',
    category: 'adult-uncensored',
    isAdult: true,
    tags: ['Adult 18+', 'Uncensored LLM', 'Privacy First', 'Zero Logging', 'NSFW Image'],
    shortDescription: 'Zero censorship LLM and NSFW image generation with cryptographic privacy and no logging',
    fullDescription: 'Venice AI provides unfiltered access to state-of-the-art open models (Llama 3 Uncensored, Dolphin, Flux Uncensored) with zero corporate censorship, zero prompt logging, and cryptographic anonymity.',
    rateLimit: 'Free daily trial tier / 1 000 tokens/day',
    authType: 'API Key',
    costType: 'Free Tier',
    requiresCreditCard: false,
    websiteUrl: 'https://venice.ai',
    docsUrl: 'https://docs.venice.ai',
    endpointUrl: 'https://api.venice.ai/api/v1/chat/completions',
    method: 'POST',
    responseExample: {
      id: "venice-unfiltered-88",
      model: "llama-3.3-70b-uncensored",
      choices: [
        {
          message: {
            role: "assistant",
            content: "Venice Unfiltered node online. All safety filters removed per user clearance."
          }
        }
      ]
    },
    codeSnippets: {
      curl: `curl https://api.venice.ai/api/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_VENICE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "llama-3.3-70b-uncensored", "messages": [{"role": "user", "content": "Tell an unfiltered story"}]}'`,
      javascript: `const res = await fetch('https://api.venice.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + VENICE_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'llama-3.3-70b-uncensored', messages: [{ role: 'user', content: '...' }] })
});`,
      python: `import requests
res = requests.post("https://api.venice.ai/api/v1/chat/completions",
    headers={"Authorization": f"Bearer {VENICE_KEY}"},
    json={"model": "llama-3.3-70b-uncensored", "messages": [{"role": "user", "content": "..."}]})`
    },
    keySteps: [
      'Register on venice.ai with anonymous email or Web3 wallet',
      'Generate API key in Settings -> API Access',
      'Supports OpenAI client compatibility'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'LEVEL 4 BIO-RESTRICTED',
    addedDate: '2026-10-19'
  },
  {
    id: 'civitai-nsfw-api',
    name: 'Civitai NSFW Model & Gen API',
    provider: 'Civitai',
    category: 'adult-uncensored',
    isAdult: true,
    tags: ['Adult 18+', 'NSFW Models', 'LoRA', 'Checkpoints', 'Free Generation Buzz'],
    shortDescription: 'Free daily Buzz credits for running adult Stable Diffusion models, LoRAs, and character checkpoints',
    fullDescription: 'Civitai is the largest repository of community generative AI models. Their API enables querying over 50,000 adult/NSFW checkpoints and LoRAs, as well as server-side generation using free daily Buzz bonus credits.',
    rateLimit: 'Free daily Buzz allocation (~25 free gens/day)',
    authType: 'API Key',
    costType: 'Free Credits / Mo',
    requiresCreditCard: false,
    websiteUrl: 'https://civitai.com',
    docsUrl: 'https://github.com/civitai/civitai/wiki/REST-API-Reference',
    endpointUrl: 'https://civitai.com/api/v1/models?nsfw=true',
    method: 'GET',
    responseExample: {
      items: [
        {
          id: 43801,
          name: "Cyber Erotic Fusion XL",
          type: "Checkpoint",
          nsfw: true,
          tags: ["erotic", "scifi", "unfiltered", "detailed"]
        }
      ],
      metadata: { totalItems: 12500, currentPage: 1 }
    },
    codeSnippets: {
      curl: `curl "https://civitai.com/api/v1/models?types=Checkpoint&nsfw=true" \\
  -H "Authorization: Bearer YOUR_CIVITAI_KEY"`,
      javascript: `const res = await fetch('https://civitai.com/api/v1/models?types=Checkpoint&nsfw=true', {
  headers: { Authorization: 'Bearer ' + CIVITAI_KEY }
});
const data = await res.json();`,
      python: `import requests
res = requests.get("https://civitai.com/api/v1/models?types=Checkpoint&nsfw=true",
    headers={"Authorization": f"Bearer {CIVITAI_KEY}"})`
    },
    keySteps: [
      'Create account on civitai.com and toggle 18+ content in account settings',
      'Go to Account Settings -> API Keys -> Add API Key',
      'Query models or trigger cloud generation tasks'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'LEVEL 4 BIO-RESTRICTED',
    addedDate: '2026-10-17'
  },
  {
    id: 'mage-space-uncensored',
    name: 'Mage.space Uncensored Studio',
    provider: 'Mage.space',
    category: 'adult-uncensored',
    isAdult: true,
    tags: ['Adult 18+', 'Flux NSFW', 'SDXL', 'Uncensored Image & Video', 'Free Tier'],
    shortDescription: 'Free unlimited standard generations for uncensored artistic and adult creative prompts',
    fullDescription: 'Mage.space provides access to unfiltered Stable Diffusion models without censorship. Standard resolution generations are free without token limits.',
    rateLimit: 'Unlimited standard speed free tier',
    authType: 'Bearer Token',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://www.mage.space',
    docsUrl: 'https://www.mage.space/docs',
    endpointUrl: 'https://api.mage.space/v1/generate',
    method: 'POST',
    responseExample: {
      id: "mage-job-901",
      status: "completed",
      imageUrl: "https://media.mage.space/generated/adult-render-901.png"
    },
    codeSnippets: {
      curl: `curl https://api.mage.space/v1/generate \\
  -H "Authorization: Bearer YOUR_MAGE_KEY" \\
  -d '{"prompt": "Artistic sensuous oil painting", "nsfw": true, "model": "sdxl_unfiltered"}'`,
      javascript: `const res = await fetch('https://api.mage.space/v1/generate', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + MAGE_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: '...', nsfw: true, model: 'sdxl_unfiltered' })
});`,
      python: `import requests
res = requests.post("https://api.mage.space/v1/generate",
    headers={"Authorization": f"Bearer {MAGE_KEY}"},
    json={"prompt": "...", "nsfw": True})`
    },
    keySteps: [
      'Sign in at mage.space with Google or email',
      'Turn on NSFW toggle in the top bar',
      'Use free standard generation mode'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'LEVEL 4 BIO-RESTRICTED',
    addedDate: '2026-10-16'
  },
  {
    id: 'openrouter-uncensored',
    name: 'OpenRouter Uncensored Matrix',
    provider: 'OpenRouter',
    category: 'adult-uncensored',
    isAdult: true,
    tags: ['Adult 18+', 'Dolphin 3.0', 'Gryphe Mythomax', 'Free Endpoints', 'RP & Fiction'],
    shortDescription: 'Gateway to dozens of free and uncensored models (Dolphin, Mythomax, WizardLM Uncensored)',
    fullDescription: 'OpenRouter indexes hundreds of AI models with transparent moderation tags. Filtering for unmoderated models provides access to free roleplay, romance, and uncensored story completion endpoints.',
    rateLimit: '20 RPM on free endpoints',
    authType: 'Bearer Token',
    costType: '100% Free',
    requiresCreditCard: false,
    websiteUrl: 'https://openrouter.ai',
    docsUrl: 'https://openrouter.ai/docs',
    endpointUrl: 'https://openrouter.ai/api/v1/chat/completions',
    method: 'POST',
    responseExample: {
      id: "gen-or-3921",
      model: "cognitivecomputations/dolphin-mixtral-8x7b",
      choices: [{ message: { role: "assistant", content: "Uncensored assistant responding freely without guardrails." } }]
    },
    codeSnippets: {
      curl: `curl https://openrouter.ai/api/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_OPENROUTER_KEY" \\
  -H "HTTP-Referer: https://umbrellacorp.local" \\
  -d '{"model": "gryphe/mythomax-l2-13b:free", "messages": [{"role": "user", "content": "Creative story"}]}'`,
      javascript: `const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + OPENROUTER_KEY,
    'HTTP-Referer': 'https://umbrellacorp.local',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gryphe/mythomax-l2-13b:free',
    messages: [{ role: 'user', content: 'Story' }]
  })
});`,
      python: `import requests
res = requests.post("https://openrouter.ai/api/v1/chat/completions",
    headers={"Authorization": f"Bearer {OPENROUTER_KEY}"},
    json={"model": "gryphe/mythomax-l2-13b:free", "messages": [{"role": "user", "content": "Story"}]})`
    },
    keySteps: [
      'Create free key on openrouter.ai/keys',
      'Select any model ending with :free (e.g., gryphe/mythomax-l2-13b:free or meta-llama/llama-3-8b-instruct:free)',
      'Enjoy unmoderated conversational endpoints'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'LEVEL 4 BIO-RESTRICTED',
    addedDate: '2026-10-18'
  },
  {
    id: 'novelai-story-api',
    name: 'NovelAI Storytelling & Text RP',
    provider: 'Anlatan NovelAI',
    category: 'adult-uncensored',
    isAdult: true,
    tags: ['Adult 18+', 'Erotic Fiction', 'Kayra', 'Clio', 'Free Trial Tokens'],
    shortDescription: 'Specialized language models trained specifically for romance, adult fantasy, and fiction writing',
    fullDescription: 'NovelAI models (Kayra and Clio) are custom trained from scratch on literature, novels, and creative stories with zero prudish content restrictions or moralizing refusal triggers.',
    rateLimit: 'Free trial generation tokens upon signup',
    authType: 'Bearer Token',
    costType: 'Free Tier',
    requiresCreditCard: false,
    websiteUrl: 'https://novelai.net',
    docsUrl: 'https://novelai.net/stories',
    endpointUrl: 'https://api.novelai.net/ai/generate',
    method: 'POST',
    responseExample: {
      output: "The rain pounded heavily on the glass of the high-rise penthouse as she stepped closer...",
      tokens: 48
    },
    codeSnippets: {
      curl: `curl https://api.novelai.net/ai/generate \\
  -H "Authorization: Bearer YOUR_NOVELAI_TOKEN" \\
  -d '{"input": "The night began with an unexpected visitor...", "model": "kayra-v1", "parameters": {"max_length": 60}}'`,
      javascript: `const res = await fetch('https://api.novelai.net/ai/generate', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: '...', model: 'kayra-v1' })
});`,
      python: `import requests
res = requests.post("https://api.novelai.net/ai/generate",
    headers={"Authorization": f"Bearer {TOKEN}"},
    json={"input": "...", "model": "kayra-v1"})`
    },
    keySteps: [
      'Sign up at novelai.net',
      'Test in the free trial interactive story generator',
      'Export authorization token from developer console'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'LEVEL 4 BIO-RESTRICTED',
    addedDate: '2026-10-14'
  },
  {
    id: 'seaart-nsfw-api',
    name: 'SeaArt AI Unrestricted Art',
    provider: 'SeaArt',
    category: 'adult-uncensored',
    isAdult: true,
    tags: ['Adult 18+', 'Daily Free Stamina', 'Anime & Realistic', 'NSFW Filter Toggle'],
    shortDescription: 'Free daily stamina for adult anime, photorealistic character rendering and pose control',
    fullDescription: 'SeaArt provides generous daily stamina (replenished every 24h) for running community adult models, ControlNet pose transfer, face restoration, and unrestricted image synthesis.',
    rateLimit: '150 daily free stamina points (~30 gens/day)',
    authType: 'API Key',
    costType: 'Free Credits / Mo',
    requiresCreditCard: false,
    websiteUrl: 'https://www.seaart.ai',
    docsUrl: 'https://www.seaart.ai/docs',
    endpointUrl: 'https://api.seaart.ai/v1/task/create',
    method: 'POST',
    responseExample: {
      code: 10000,
      msg: "success",
      data: { id: "seaart_task_4410", status: "created" }
    },
    codeSnippets: {
      curl: `curl https://api.seaart.ai/v1/task/create \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -d '{"prompt": "Photorealistic beauty in rain, cinematic", "model_id": "seaart_xl_nsfw"}'`,
      javascript: `const res = await fetch('https://api.seaart.ai/v1/task/create', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: '...', model_id: 'seaart_xl_nsfw' })
});`,
      python: `import requests
res = requests.post("https://api.seaart.ai/v1/task/create",
    headers={"Authorization": f"Bearer {KEY}"},
    json={"prompt": "...", "model_id": "seaart_xl_nsfw"})`
    },
    keySteps: [
      'Register on seaart.ai',
      'Enable 18+ filter switch in preferences',
      'Use daily replenished stamina points for free creations'
    ],
    status: 'ONLINE',
    umbrellaSecurityLevel: 'LEVEL 4 BIO-RESTRICTED',
    addedDate: '2026-10-18'
  }
];

export const CATEGORY_DEFINITIONS = [
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    subtitle: 'Find free AI APIs',
    iconName: 'Brain',
    count: 4,
    color: 'from-red-600/30 to-red-900/20'
  },
  {
    id: 'image-to-video',
    title: 'Image to Video',
    subtitle: 'AI video generation, animation, motion',
    iconName: 'Film',
    count: 5,
    color: 'from-amber-600/30 to-red-900/20'
  },
  {
    id: 'text-language',
    title: 'Text & Language',
    subtitle: 'Translation, NLP, grammar, etc.',
    iconName: 'MessageSquare',
    count: 3,
    color: 'from-rose-600/30 to-red-900/20'
  },
  {
    id: 'image-vision',
    title: 'Image & Vision',
    subtitle: 'Image generation, OCR, hosting',
    iconName: 'Camera',
    count: 3,
    color: 'from-red-700/30 to-zinc-900/20'
  },
  {
    id: 'audio-speech',
    title: 'Audio & Speech',
    subtitle: 'TTS, STT, Lyria music, voice tools',
    iconName: 'Volume2',
    count: 3,
    color: 'from-orange-600/30 to-red-900/20'
  },
  {
    id: 'developer-tools',
    title: 'Developer Tools',
    subtitle: 'Utilities, databases, mock data',
    iconName: 'Wrench',
    count: 3,
    color: 'from-red-800/30 to-neutral-900/20'
  },
  {
    id: 'adult-uncensored',
    title: 'Adult / Uncensored 18+',
    subtitle: 'Unrestricted LLMs, NSFW image & video',
    iconName: 'ShieldAlert',
    count: 6,
    color: 'from-red-950/60 to-black',
    isAdult: true
  }
];
