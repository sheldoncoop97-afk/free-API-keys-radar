# Free API Radar — Umbrella Corporation

React/Vite API directory with an Express server for live search, image-to-video, and text-to-music generation. The UI uses a black-and-red Umbrella theme and includes a separately gated 18+ API space.

## Run locally

1. Install Node.js 22.
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` if you want to use Google Search Grounding, Veo, or Lyria. The key stays on the server and is never sent to the browser.
3. Install the exact dependencies and start the app:

   ```sh
   npm ci
   npm run dev
   ```

4. Open `http://localhost:3000`.

The API directory and official provider links can be searched without a Gemini key. Live AI features return a clear error until the server has a valid key and the account has access to the requested model.

## Verify and build

```sh
npm ci
npm run lint
npm test
npm run build
```

The `.github/workflows/build-web.yml` workflow runs these same checks and uploads `dist/` as the **FreeApiRadar-web-dist** artifact. It does not label a ZIP of web files as an APK. The separate Android workflow builds the native project from the checked-in Android source archive.

## API key links

Search the main radar by provider, API name, documentation URL, endpoint, or the API's key-acquisition steps. Open an API card to visit its public provider page and follow the listed registration steps. Confirm current access, pricing, and limits with each provider.

## Server features

- `/api/search-grounding`: live web search for official API documentation and registration pages.
- `/api/generate-video`, `/api/video-status`, `/api/video-download`: image-to-video generation and polling through Veo.
- `/api/generate-music`: text-to-music generation through Lyria.
- `/api/test-endpoint`: a bounded live probe for registered public API endpoints.
- `/api/download-zip`: downloads a source archive, not an APK.
