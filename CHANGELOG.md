# Changelog — Umbrella Corp (Free API Radar)

## [1.5.0] - Visual Concept & Full Radar Implementation
### Added
- **4-Phase Animated Splash Screen:**
  - Phase 1 (0-1.5s): Cyber radar initializing sequence and digital CRT grid.
  - Phase 2 (1.5-3.0s): Vector assembly of Umbrella octagon emblem.
  - Phase 3 (3.0-5.0s): Solid 3D glowing Umbrella logo, corporation title, and motto *"OUR BUSINESS IS LIFE ITSELF"*.
  - Phase 4 (5.0-6.5s): Final skyscraper background scene (`umbrella_building.png`), intro audio playback, and TTS announcement.
  - Tap-to-skip functionality.
- **Top Bar & Navigation Drawer:**
  - Custom top bar with Umbrella emblem, radar refresh button, and drawer toggle.
  - Modal Navigation Drawer with items: *Home*, *Search*, *Favorites*, *History*, *Settings*, *About*, *Exit*.
  - Bottom drawer world map vector graphic with global nodes and corporation motto.
- **Visual Category Structure (Concept 3):**
  - *AI & Machine Learning*
  - *Text & Language*
  - *Image & Vision*
  - *Audio & Speech*
  - *Developer Tools*
  - *18+ / Adult AI* (guarded by explicit 18+ confirmation dialog).
- **Red-Bordered Search Bar:**
  - Real-time search across names, descriptions, categories, and tags.
- **Details Screen (Concept 3 Middle Phone):**
  - Provider badge, model name, tag chips (`AI`, `Text`, `Chat`, etc.).
  - 3-column stats row: `Rate Limit`, `Auth`, `Docs`.
  - Prominent red button: `"Open in Browser"` (supports Chrome direct launch and fallback).
  - Formatted `Response Example` with syntax-highlighted JSON rendering.
- **Bottom Navigation Bar:**
  - 4 tabs: *Home*, *Favorites*, *History*, *Settings*.
- **Favorites & History Management:**
  - Persistent favorite APIs and chronological access history.
- **WorkManager Auto-Scan:**
  - Configured for 15-minute background discovery cycle.
  - Notifications using `notification_icon.png` and concept wording: *"New free API available!"*.
- **Room Database Upgrade:**
  - Version 2 with tags, rate limits, response examples, and fallback migrations.
