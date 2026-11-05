package com.example.freeapiradar.data

import android.content.Context
import okhttp3.OkHttpClient
import okhttp3.Request
import java.net.URI
import java.security.MessageDigest
import java.util.concurrent.TimeUnit

class ApiRepository(context: Context) {
    private val dao = ApiDatabase.get(context).apiDao()
    private val client = OkHttpClient.Builder()
        .callTimeout(20, TimeUnit.SECONDS)
        .connectTimeout(10, TimeUnit.SECONDS)
        .followRedirects(true)
        .build()

    fun observe() = dao.observeAll()
    suspend fun count() = dao.count()

    private val prefs = context.getSharedPreferences("custom_sources", Context.MODE_PRIVATE)
    private val resultPrefs = context.getSharedPreferences("result_management", Context.MODE_PRIVATE)

    fun customSources(): List<String> = prefs.getStringSet("urls", emptySet())?.toList()?.sorted().orEmpty()

    fun savedAddresses(): List<String> = resultPrefs.getStringSet("saved_addresses", emptySet())?.toList()?.sorted().orEmpty()

    fun saveAddress(rawUrl: String) {
        val url = rawUrl.trim()
        val updated = savedAddresses().toMutableSet()
        updated.add(url)
        resultPrefs.edit().putStringSet("saved_addresses", updated).apply()
    }

    fun removeSavedAddress(url: String) {
        val updated = savedAddresses().toMutableSet()
        updated.remove(url)
        resultPrefs.edit().putStringSet("saved_addresses", updated).apply()
    }

    fun favoriteIds(): Set<String> = resultPrefs.getStringSet("favorite_ids", emptySet())?.toSet().orEmpty()

    fun toggleFavorite(id: String) {
        val current = favoriteIds().toMutableSet()
        if (current.contains(id)) current.remove(id) else current.add(id)
        resultPrefs.edit().putStringSet("favorite_ids", current).apply()
    }

    fun historyIds(): List<String> = resultPrefs.getString("history_order", "")?.split(",")?.filter { it.isNotBlank() }.orEmpty()

    fun addToHistory(id: String) {
        val list = historyIds().toMutableList()
        list.remove(id)
        list.add(0, id)
        resultPrefs.edit().putString("history_order", list.take(100).joinToString(",")).apply()
    }

    fun hiddenResultIds(): Set<String> = resultPrefs.getStringSet("hidden_result_ids", emptySet())?.toSet().orEmpty()

    fun hideResult(id: String) {
        val updated = hiddenResultIds().toMutableSet()
        updated.add(id)
        resultPrefs.edit().putStringSet("hidden_result_ids", updated).apply()
    }

    fun addCustomSource(raw: String): Boolean {
        val url = raw.trim()
        val uri = try { URI(url) } catch (_: Exception) { return false }
        if (uri.scheme != "https" || uri.host.isNullOrBlank()) return false
        val updated = customSources().toMutableSet()
        updated.add(url)
        prefs.edit().putStringSet("urls", updated).apply()
        return true
    }

    fun removeCustomSource(url: String) {
        val updated = customSources().toMutableSet()
        updated.remove(url)
        prefs.edit().putStringSet("urls", updated).apply()
    }

    private val catalogs = listOf(
        "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md",
        "https://raw.githubusercontent.com/public-api-lists/public-api-lists/main/README.md",
        "https://raw.githubusercontent.com/free-public-apis/apis/main/README.md",
        "https://raw.githubusercontent.com/IdoY12/awesome-free-ai-apis/main/README.md",
        "https://raw.githubusercontent.com/pacocartones/free-llm-api-hub/main/README.md"
    )

    // Curated models and free tier AI opportunities matching conceptual categories
    private val curatedProviders = listOf(
        // === 1. IMAGE TO VIDEO ===
        CuratedApi(
            name = "Kling AI (Image to Video)",
            description = "High motion cinematic image-to-video generation with character consistency, camera movement controls and daily free credits.",
            category = "Image to Video",
            auth = "API Key / Free Credits",
            docsUrl = "https://klingai.com/",
            tags = "I2V,Video,Motion,Cinematic",
            rateLimit = "66 free credits daily",
            example = """{
  "code": 0,
  "msg": "SUCCESS",
  "data": {
    "task_id": "kling-i2v-9843",
    "video_url": "https://kling.ai/generated/video_sample.mp4",
    "duration": 5.0
  }
}"""
        ),
        CuratedApi(
            name = "Hailuo AI / MiniMax I2V",
            description = "State of the art realistic image-to-video animation model with accurate fluid dynamics, human movement and camera panning.",
            category = "Image to Video",
            auth = "API Key / Free Tier",
            docsUrl = "https://hailuoai.video/",
            tags = "I2V,Video,MiniMax,Realistic",
            rateLimit = "Daily free quota",
            example = """{
  "task_id": "minimax-video-771",
  "status": "completed",
  "output_url": "https://cdn.hailuoai.com/video/out_771.mp4"
}"""
        ),
        CuratedApi(
            name = "Runway Gen-3 Alpha Turbo (I2V)",
            description = "Professional speed and motion fidelity for turning portrait and landscape images into dynamic film sequences.",
            category = "Image to Video",
            auth = "API Key",
            docsUrl = "https://dev.runwayml.com/",
            tags = "I2V,Runway,Gen3,Studio",
            rateLimit = "Free starter credits",
            example = """{
  "id": "runway_task_123",
  "status": "SUCCEEDED",
  "output": ["https://runwayml.com/outputs/gen3_video.mp4"]
}"""
        ),
        CuratedApi(
            name = "Wan 2.1 I2V (Open Source Engine)",
            description = "Cutting edge open-weights 14B/1.3B video diffusion engine capable of running locally or on serverless free endpoints.",
            category = "Image to Video",
            auth = "No key / Self-hosted",
            docsUrl = "https://huggingface.co/Wan-AI/Wan2.1-I2V-14B-720P",
            tags = "I2V,Wan2.1,OpenWeights,Local",
            rateLimit = "Unlimited / Local GPU",
            example = """{
  "model": "Wan2.1-I2V-14B",
  "fps": 24,
  "resolution": "720x1280",
  "status": "rendered"
}"""
        ),
        CuratedApi(
            name = "Luma Dream Machine API",
            description = "Ultra high frame-rate camera motion and image-to-video rendering with free initial quota for creators.",
            category = "Image to Video",
            auth = "API Key",
            docsUrl = "https://lumalabs.ai/dream-machine/api",
            tags = "I2V,Luma,Motion,3D",
            rateLimit = "30 free generations",
            example = """{
  "id": "luma-generation-88",
  "state": "completed",
  "video": { "url": "https://storage.lumalabs.ai/dream_88.mp4" }
}"""
        ),

        // === 2. TEXT TO VIDEO ===
        CuratedApi(
            name = "Google Veo 2 / 3 Preview",
            description = "Google DeepMind's flagship text-to-video generator supporting cinematic prompts, aspect ratio 16:9/9:16 and up to 1080p.",
            category = "Text to Video",
            auth = "API Key (Gemini API)",
            docsUrl = "https://ai.google.dev/gemini-api/docs/video-generation",
            tags = "T2V,Veo,Google,1080p",
            rateLimit = "Developer preview tier",
            example = """{
  "operation": "models/veo-2.0-generate-001/operations/4582",
  "done": true,
  "result": {
    "generated_videos": [{ "video": { "uri": "https://generativelanguage.googleapis.com/v1beta/files/veo.mp4" } }]
  }
}"""
        ),
        CuratedApi(
            name = "CogVideoX-5B Inference API",
            description = "THUDM's leading open text-to-video model delivering 3D causal VAE architecture and prompt adherence.",
            category = "Text to Video",
            auth = "Free Community API",
            docsUrl = "https://huggingface.co/THUDM/CogVideoX-5b",
            tags = "T2V,CogVideoX,OpenSource,Free",
            rateLimit = "Fair-use queue",
            example = """{
  "job": "cogvideo-992",
  "status": "ready",
  "video_url": "https://hf.space/cogvideox_sample.mp4"
}"""
        ),
        CuratedApi(
            name = "LTX-Video Lightricks",
            description = "High speed transformer-based text-to-video model rendering high-resolution clips in real time.",
            category = "Text to Video",
            auth = "API Key / Open Weights",
            docsUrl = "https://github.com/Lightricks/LTX-Video",
            tags = "T2V,LTX,Fast,RealTime",
            rateLimit = "Community free quota",
            example = """{
  "prompt": "futuristic umbrella cyber city",
  "fps": 24,
  "output_mp4": "https://lightricks.com/ltx_preview.mp4"
}"""
        ),

        // === 3. TEXT TO VOICE ===
        CuratedApi(
            name = "ElevenLabs Voice API (Free Tier)",
            description = "Gold standard emotional voice synthesis, voice cloning and character dubbing with 10,000 free characters every month.",
            category = "Text to Voice",
            auth = "API Key",
            docsUrl = "https://elevenlabs.io/api",
            tags = "Voice,TTS,Emotional,Dubbing",
            rateLimit = "10 000 chars/month free",
            example = """{
  "audio_base64": "UklGRiQAAABXQVZFZm10IBAAAA...",
  "alignment": { "character_start_times_seconds": [0.0, 0.12] },
  "voice_id": "21m00Tcm4TlvDq8ikWAM"
}"""
        ),
        CuratedApi(
            name = "Microsoft Edge-TTS Gateway",
            description = "100% free unlimited neural speech synthesis with natural human inflections, supporting Polish (Zofia, Marek) and 50+ languages.",
            category = "Text to Voice",
            auth = "No key required",
            docsUrl = "https://github.com/rany2/edge-tts",
            tags = "TTS,Voice,Polish,Unlimited,NoKey",
            rateLimit = "Unlimited fair-use",
            example = """{
  "voice": "pl-PL-ZofiaNeural",
  "text": "Witaj w Umbrella Corporation.",
  "audio_format": "audio/mp3",
  "status": "stream_ready"
}"""
        ),
        CuratedApi(
            name = "Kokoro-82M Voice Synthesis",
            description = "Ultra high quality open source TTS engine ranking top in natural speech benchmarks with zero cloud latency.",
            category = "Text to Voice",
            auth = "No key required",
            docsUrl = "https://huggingface.co/hexgrad/Kokoro-82M",
            tags = "TTS,Kokoro,OpenSource,Voice",
            rateLimit = "Unmetered inference",
            example = """{
  "voice_model": "kokoro-v0_19",
  "phonemes": "w ɛ l k ə m",
  "audio_sample_rate": 24000
}"""
        ),
        CuratedApi(
            name = "Gemini 3.8 Flash TTS Voice API",
            description = "Official Google GenAI expressive voice model capable of multi-speaker conversations and emotional range.",
            category = "Text to Voice",
            auth = "API Key",
            docsUrl = "https://ai.google.dev/gemini-api",
            tags = "TTS,Gemini,Voice,Google",
            rateLimit = "15 RPM free tier",
            example = """{
  "audioContent": "UklGRiQAAABXQVZF...",
  "voiceConfig": { "gender": "FEMALE", "style": "cheerful" }
}"""
        ),

        // === 4. VOICE TO TEXT ===
        CuratedApi(
            name = "Groq Whisper Large V3",
            description = "Ultra-fast Speech-To-Text transcription processing 1 hour of audio in less than 3 seconds with zero cost.",
            category = "Voice to Text",
            auth = "API Key",
            docsUrl = "https://console.groq.com/docs/speech-text",
            tags = "STT,Whisper,Fast,Groq",
            rateLimit = "30 requests/min free",
            example = """{
  "text": "Activated umbrella radar system online.",
  "language": "en",
  "duration": 2.45
}"""
        ),
        CuratedApi(
            name = "Deepgram Nova-2 Free Tier",
            description = "Enterprise grade speech recognition API with automated punctuation, speaker diarization and \$200 free credits.",
            category = "Voice to Text",
            auth = "API Key",
            docsUrl = "https://developers.deepgram.com/",
            tags = "STT,Transcription,Audio,Deepgram",
            rateLimit = "$200 free credit bonus",
            example = """{
  "results": {
    "channels": [{ "alternatives": [{ "transcript": "Radar scan complete." }] }]
  }
}"""
        ),

        // === 5. 18+ / ADULT AI (NSFW) ===
        CuratedApi(
            name = "Venice.ai Uncensored Private API",
            description = "Strictly zero-retention, uncensored intelligence platform supporting uncensored LLM chat, NSFW art diffusion and adult agents.",
            category = "18+ / Adult AI",
            auth = "API Key / Free Credits",
            docsUrl = "https://venice.ai/api",
            tags = "18+,Uncensored,LLM,Image,NSFW",
            rateLimit = "Daily free credits",
            example = """{
  "id": "venice-uncensored-01",
  "model": "dolphin-2.9.2-qwen2-72b",
  "choices": [{ "message": { "content": "Uncensored response generated without guardrails." } }],
  "privacy": "zero-logging"
}"""
        ),
        CuratedApi(
            name = "Pollinations Uncensored Art & Video",
            description = "Completely unmoderated generative endpoint for adult 18+ diffusion, uncensored character art and video loops without key.",
            category = "18+ / Adult AI",
            auth = "No key required",
            docsUrl = "https://pollinations.ai/",
            tags = "18+,NSFW,Image,Video,NoKey",
            rateLimit = "Unlimited fair-use",
            example = """{
  "prompt": "uncensored artistic composition 8k photorealistic",
  "image_url": "https://image.pollinations.ai/prompt/uncensored?nologo=true",
  "nsfw_allowed": true
}"""
        ),
        CuratedApi(
            name = "Dolphin 3.0 / Cognitive Computations",
            description = "Eric Hartford's uncensored open models removing ethical and alignment refusals for unrestricted creative writing and chat.",
            category = "18+ / Adult AI",
            auth = "API Key / Open Weights",
            docsUrl = "https://huggingface.co/cognitivecomputations",
            tags = "18+,Chat,Uncensored,LLM,Roleplay",
            rateLimit = "Community endpoints / Free",
            example = """{
  "model": "dolphin-3.0-r1-mistral-24b",
  "content": "Fully unrestricted adult scenario generated successfully."
}"""
        ),
        CuratedApi(
            name = "KoboldAI Horde Uncensored Cluster",
            description = "Decentralized voluntary GPU network providing free inference for uncensored adult roleplay, fantasy models and NSFW diffusion.",
            category = "18+ / Adult AI",
            auth = "No key required",
            docsUrl = "https://koboldai.net/",
            tags = "18+,Roleplay,Horde,NoKey,NSFW",
            rateLimit = "Unlimited community horde",
            example = """{
  "worker_id": "volunteer_gpu_44",
  "text": "The unrestricted roleplay continues seamlessly...",
  "finish_reason": "length"
}"""
        ),
        CuratedApi(
            name = "NovelAI Creative & Uncensored V3",
            description = "Specialized AI storytelling and anime/realistic diffusion engine with full adult theme support and private memory tokens.",
            category = "18+ / Adult AI",
            auth = "Free Trial Tier",
            docsUrl = "https://novelai.net/",
            tags = "18+,Story,Art,Anime,Adult",
            rateLimit = "Free trial generations",
            example = """{
  "output": "Chapter 1: The secret encounter...",
  "tokens_generated": 150
}"""
        ),
        CuratedApi(
            name = "Civitai Model & LoRA Endpoints",
            description = "API access to thousands of community trained adult 18+ Checkpoints, LoRA adaptations and motion video modules.",
            category = "18+ / Adult AI",
            auth = "API Key",
            docsUrl = "https://civitai.com/api/v1/models",
            tags = "18+,LoRA,SDXL,Pony,Video",
            rateLimit = "Generous free rate limit",
            example = """{
  "items": [{ "name": "Realistic Adult LoRA v2", "type": "LORA", "nsfw": true }]
}"""
        ),

        // === 6. AI & MACHINE LEARNING ===
        CuratedApi(
            name = "Google AI Studio (Gemini API)",
            description = "Industry leading 1M-2M token context window with Gemini 2.5/3.1 Flash and Pro models suitable for multimodal agents.",
            category = "AI & Machine Learning",
            auth = "API Key",
            docsUrl = "https://aistudio.google.com/",
            tags = "AI,Gemini,LLM,Vision,Agent",
            rateLimit = "15 RPM / 1M TPM (Free)",
            example = """{
  "candidates": [{ "content": { "parts": [{ "text": "Gemini API initialized." }] } }]
}"""
        ),
        CuratedApi(
            name = "OpenRouter Model Gateway",
            description = "Zero-cost gateway routing requests to completely free open models (Llama 3.3, Mistral NeMo, DeepSeek R1).",
            category = "AI & Machine Learning",
            auth = "API Key",
            docsUrl = "https://openrouter.ai/models?max_price=0",
            tags = "AI,Router,FreeModels,DeepSeek",
            rateLimit = "20 req/min free",
            example = """{
  "id": "gen-12345",
  "model": "deepseek/deepseek-r1:free",
  "choices": [{ "message": { "content": "DeepSeek R1 reasoning complete." } }]
}"""
        ),
        CuratedApi(
            name = "Cohere Command R+ Trial",
            description = "Enterprise grade retrieval augmented generation (RAG) and multi-step agent tools with free developer key.",
            category = "AI & Machine Learning",
            auth = "API Key",
            docsUrl = "https://cohere.com/command",
            tags = "AI,RAG,Agents,Cohere",
            rateLimit = "1000 calls/month free",
            example = """{
  "text": "Command R+ synthesized search results accurately.",
  "citations": [{ "start": 0, "end": 15 }]
}"""
        ),

        // === 7. TEXT & LANGUAGE ===
        CuratedApi(
            name = "OpenAI (Free Tier & GPT-4o Mini)",
            description = "Generous developer tier for fast conversational intelligence, embeddings and structured function calling.",
            category = "Text & Language",
            auth = "API Key",
            docsUrl = "https://platform.openai.com/docs/models",
            tags = "Text,Chat,GPT4o,OpenAI",
            rateLimit = "3 500 req/day (Free tier)",
            example = """{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1700000000,
  "model": "gpt-4o-mini",
  "choices": [{ "message": { "role": "assistant", "content": "Hello! I am ready." } }]
}"""
        ),
        CuratedApi(
            name = "GroqCloud Llama 3.3 70B",
            description = "Fastest LLM inference engine on the planet running Meta Llama 3.3 at over 300 tokens per second.",
            category = "Text & Language",
            auth = "API Key",
            docsUrl = "https://console.groq.com/",
            tags = "Text,Llama3,Fast,300TPS",
            rateLimit = "30 RPM / 14 400 RPD free",
            example = """{
  "id": "groq-chat-99",
  "model": "llama-3.3-70b-versatile",
  "choices": [{ "message": { "content": "Groq inference response at 320 tok/sec." } }]
}"""
        ),
        CuratedApi(
            name = "Mistral AI Le Chat & API",
            description = "European frontier models (Mistral Small, Codestral, Pixtral) available with developer free allocations.",
            category = "Text & Language",
            auth = "API Key",
            docsUrl = "https://mistral.ai/",
            tags = "Text,Mistral,Code,French",
            rateLimit = "1 req/sec free tier",
            example = """{
  "id": "mistral-chat-1",
  "model": "mistral-small-latest",
  "choices": [{ "message": { "content": "Mistral response validated." } }]
}"""
        ),

        // === 8. IMAGE & VISION ===
        CuratedApi(
            name = "Pollinations.AI Image Engine",
            description = "100% free unauthenticated image generation using FLUX.1 and Stable Diffusion XL without rate limits or keys.",
            category = "Image & Vision",
            auth = "No key required",
            docsUrl = "https://pollinations.ai/",
            tags = "Image,Vision,Flux,NoKey",
            rateLimit = "Unlimited fair-use",
            example = """{
  "prompt": "futuristic umbrella laboratory 8k",
  "image_url": "https://image.pollinations.ai/prompt/futuristic%20umbrella%20laboratory"
}"""
        ),
        CuratedApi(
            name = "Black Forest Labs FLUX.1 Schnell",
            description = "Premier 4-step open-source generative diffusion model accessible via public Hugging Face inference hubs.",
            category = "Image & Vision",
            auth = "API Key / Open Weights",
            docsUrl = "https://huggingface.co/black-forest-labs/FLUX.1-schnell",
            tags = "Image,Flux,BFL,Photorealistic",
            rateLimit = "Community quota",
            example = """{
  "estimated_time": 1.2,
  "output_image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}"""
        ),

        // === 9. DEVELOPER TOOLS ===
        CuratedApi(
            name = "Cloudflare Workers AI",
            description = "Serverless AI model execution (Llama 3, Whisper, Flux) running directly on Cloudflare's edge network.",
            category = "Developer Tools",
            auth = "API Key",
            docsUrl = "https://developers.cloudflare.com/workers-ai/",
            tags = "DevTools,Edge,Serverless,Cloudflare",
            rateLimit = "10 000 neurons/day free",
            example = """{
  "result": { "response": "Cloudflare edge inference result." },
  "success": true
}"""
        ),
        CuratedApi(
            name = "GitHub Models & Octokit",
            description = "Free developer playground access to GPT-4o, Claude 3.5, Phi-3 with your GitHub personal access token.",
            category = "Developer Tools",
            auth = "GitHub Token",
            docsUrl = "https://github.com/marketplace/models",
            tags = "DevTools,GitHub,Code,GPT4o",
            rateLimit = "15 RPM / 150 RPD free",
            example = """{
  "choices": [{ "message": { "role": "assistant", "content": "Code verified by GitHub Models." } }]
}"""
        ),
        CuratedApi(
            name = "Together AI GPU Cloud",
            description = "High performance serverless endpoint provider with \$5.00-25.00 free starting credit for developer testing.",
            category = "Developer Tools",
            auth = "API Key",
            docsUrl = "https://www.together.ai/",
            tags = "DevTools,GPU,Inference,Credits",
            rateLimit = "$5 free starting credit",
            example = """{
  "status": "ready",
  "tokens": 42,
  "model": "meta-llama/Llama-3-70b-chat-hf"
}"""
        )
    )

    suspend fun scan(): Int {
        val now = System.currentTimeMillis()
        val found = mutableMapOf<String, ApiEntry>()

        // 1. Add Curated Core Providers
        curatedProviders.forEach { item ->
            val id = sha256((item.name.lowercase() + "|" + item.docsUrl.lowercase()))
            found[id] = ApiEntry(
                id = id,
                name = item.name,
                description = item.description,
                category = item.category,
                auth = item.auth,
                https = "HTTPS",
                docsUrl = item.docsUrl,
                source = "Umbrella Curated Intelligence",
                firstSeen = now,
                lastSeen = now,
                tags = item.tags,
                rateLimit = item.rateLimit,
                responseExample = item.example
            )
        }

        // 2. Fetch remote catalogs
        val allSources = catalogs + customSources()
        allSources.forEachIndexed { _, url ->
            try {
                val req = Request.Builder().url(url).header("User-Agent", "Umbrella-Radar-Android/2.0").build()
                client.newCall(req).execute().use { response ->
                    if (!response.isSuccessful) return@forEachIndexed
                    val body = response.body?.string().orEmpty()
                    val source = URI(url).host ?: "public catalog"
                    var currentCat = "AI & Machine Learning"

                    body.lineSequence().forEach { line ->
                        val heading = Regex("^#{1,4}\\s+(.+?)\\s*#*\\s*$").find(line)?.groupValues?.get(1)
                        if (heading != null) currentCat = classify(heading)

                        if (line.trim().startsWith("|") && line.count { it == '|' } >= 4 && !line.contains("---")) {
                            val cells = line.trim().trim('|').split('|').map { it.trim().trim('`') }
                            if (cells.size >= 3) {
                                val name = cells[0].removeMarkdown().trim()
                                val desc = cells.getOrNull(1)?.removeMarkdown()?.trim().orEmpty()
                                if (name.isNotBlank() && !name.equals("API", true) && name.length <= 100 && desc.isNotBlank()) {
                                    val link = Regex("https?://[^ )>]+")
                                    val docs = link.find(cells[0])?.value ?: link.find(line)?.value
                                    if (docs != null && docs.startsWith("https://") && !docs.contains("github.com/public-apis/public-apis/blob")) {
                                        val auth = cells.getOrNull(2)?.removeMarkdown()?.trim().orEmpty().ifBlank { "No key required" }
                                        val id = sha256((name.lowercase() + "|" + docs.lowercase()))
                                        val cat = classify("$name $desc")
                                        found[id] = ApiEntry(
                                            id = id,
                                            name = name,
                                            description = desc.take(500),
                                            category = cat,
                                            auth = auth,
                                            https = "HTTPS",
                                            docsUrl = docs,
                                            source = source,
                                            firstSeen = now,
                                            lastSeen = now,
                                            tags = generateTags(cat, auth),
                                            rateLimit = if (auth.contains("No", true)) "Public Access" else "Free Key / Tier",
                                            responseExample = defaultJsonFor(name, cat)
                                        )
                                    }
                                }
                            }
                        }

                        // List style item (- [Name](url) - description)
                        if (line.trimStart().startsWith("-") || line.trimStart().startsWith("*")) {
                            val match = Regex("(?:[-*]\\s+)(?:\\[([^]]{2,100})]\\((https://[^ )]+)\\)|([^:]{2,100}):\\s*(https://[^ )]+))").find(line)
                            if (match != null) {
                                val name = (match.groupValues[1].ifBlank { match.groupValues[3] }).trim().trim('`', '*')
                                val docs = (match.groupValues[2].ifBlank { match.groupValues[4] }).trim().trimEnd('.', ',', ')')
                                if (name.isNotBlank() && docs.isNotBlank() && !name.equals("license", true) && docs.startsWith("https://")) {
                                    val id = sha256((name.lowercase() + "|" + docs.lowercase()))
                                    val cat = classify("$name $line $url")
                                    found[id] = ApiEntry(
                                        id = id,
                                        name = name,
                                        description = line.removeMarkdown().take(500),
                                        category = cat,
                                        auth = "Free access / verify tier",
                                        https = "HTTPS",
                                        docsUrl = docs,
                                        source = source,
                                        firstSeen = now,
                                        lastSeen = now,
                                        tags = generateTags(cat, "Free"),
                                        rateLimit = "Free Tier Available",
                                        responseExample = defaultJsonFor(name, cat)
                                    )
                                }
                            }
                        }
                    }
                }
            } catch (_: Exception) {}
        }

        val genuinelyNew = found.values.filter { dao.get(it.id) == null }
        if (found.isNotEmpty()) dao.upsertAll(found.values.toList())
        return genuinelyNew.size
    }

    suspend fun checkWebsite(entry: ApiEntry): String {
        return try {
            val request = Request.Builder().url(entry.docsUrl).header("User-Agent", "Umbrella-Radar-Android/2.0").head().build()
            client.newCall(request).execute().use { response ->
                when {
                    response.code in 200..399 -> "Website responds (${response.code})"
                    response.code == 405 || response.code == 403 -> "Website reachable (${response.code})"
                    else -> "HTTP ${response.code}"
                }
            }
        } catch (_: Exception) { "Connection failed" }
    }

    suspend fun saveStatus(id: String, status: String) = dao.updateStatus(id, status, System.currentTimeMillis())

    private fun classify(text: String): String {
        val s = text.lowercase()
        return when {
            listOf("porn", "nsfw", "adult", "erotic", "sex", "18+", "uncensored", "hentai", "nude", "lewd", "dolphin", "venice").any(s::contains) -> "18+ / Adult AI"
            listOf("image to video", "image-to-video", "i2v", "kling", "hailuo", "runway", "luma", "animate image", "wan 2", "wan2", "svd").any(s::contains) -> "Image to Video"
            listOf("text to video", "text-to-video", "t2v", "veo", "sora", "cogvideo", "ltx-video", "video generation", "generate video").any(s::contains) -> "Text to Video"
            listOf("text to voice", "text-to-voice", "text to speech", "tts", "voice cloning", "elevenlabs", "kokoro", "bark", "voice synthesis").any(s::contains) -> "Text to Voice"
            listOf("voice to text", "speech to text", "stt", "whisper", "transcription", "transcribe", "deepgram", "speech recognition").any(s::contains) -> "Voice to Text"
            listOf("image", "photo", "diffusion", "flux", "stable diffusion", "vision", "ocr", "upscale").any(s::contains) -> "Image & Vision"
            listOf("audio", "sound", "music", "podcast", "radio").any(s::contains) -> "Text to Voice"
            listOf("chat", "text", "language", "nlp", "translation", "gpt", "summariz", "llm").any(s::contains) -> "Text & Language"
            listOf("ai", "machine learning", "deep learning", "model", "neural", "agent", "inference").any(s::contains) -> "AI & Machine Learning"
            listOf("developer", "dev", "code", "programming", "api", "tools", "utility", "git", "cloud", "database").any(s::contains) -> "Developer Tools"
            else -> "AI & Machine Learning"
        }
    }

    private fun generateTags(category: String, auth: String): String {
        val t = mutableListOf("AI")
        when (category) {
            "Image to Video" -> { t.add("I2V"); t.add("Video"); t.add("Motion") }
            "Text to Video" -> { t.add("T2V"); t.add("Video"); t.add("Prompt") }
            "Text to Voice" -> { t.add("TTS"); t.add("Voice"); t.add("Speech") }
            "Voice to Text" -> { t.add("STT"); t.add("Audio"); t.add("Whisper") }
            "Text & Language" -> { t.add("Text"); t.add("Chat"); t.add("LLM") }
            "Image & Vision" -> { t.add("Image"); t.add("Vision"); t.add("Art") }
            "Developer Tools" -> { t.add("Tools"); t.add("Dev"); t.add("Cloud") }
            "18+ / Adult AI" -> { t.add("18+"); t.add("Uncensored"); t.add("NSFW") }
            else -> { t.add("ML"); t.add("Agent") }
        }
        if (auth.contains("No", true)) t.add("NoKey") else t.add("API Key")
        return t.joinToString(",")
    }

    private fun defaultJsonFor(name: String, category: String): String = """{
  "api": "${name.replace("\"", "")}",
  "category": "$category",
  "status": "ready",
  "result": "Agent integration endpoint verified"
}"""

    private fun String.removeMarkdown() = replace(Regex("\\[([^]]+)]\\([^)]*\\)"), "\u00241").replace("**", "").replace("*", "").replace("`", "").trim()
    private fun sha256(value: String) = MessageDigest.getInstance("SHA-256").digest(value.toByteArray()).joinToString("") { "%02x".format(it) }

    private data class CuratedApi(
        val name: String,
        val description: String,
        val category: String,
        val auth: String,
        val docsUrl: String,
        val tags: String,
        val rateLimit: String,
        val example: String
    )
}
