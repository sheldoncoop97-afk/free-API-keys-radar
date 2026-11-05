# Umbrella Corporation — Visual Refresh (non-final checkpoint)

This ZIP is a working visual-refresh iteration of the existing Android project. It is **not the final release**.

## Applied visual changes
- Separate custom red/white Umbrella emblem for the launcher/app icon (not reused as the splash photograph).
- Portrait startup artwork resized to 1080×1920 for modern phone screens and displayed with crop-to-fill.
- Separate dark laboratory background at 1080×1920 for the app interior, dimmed in the UI so text/cards remain readable.
- Small red monospaced boot text appears at the upper-left and types character-by-character during startup:
  `Whit our corporation you can fell safe and secure your life is our business .`
- Existing startup music resource `app/src/main/res/raw/umbrella_intro.mp3` is retained; the startup music remains attached to launch, not to the background image.
- Updated adaptive launcher foreground to a red/white segmented Umbrella emblem.
- Existing scanning, periodic scan scheduling, custom HTTPS sources, website opening/status checks, API repository/database and worker code have not intentionally been removed.

## Asset dimensions
- App icon master: 512×512 PNG.
- Additional icon sizes: 192, 144, 96, 72, 48, 36 and 24 px.
- Splash artwork: 1080×1920 JPEG (portrait 9:16).
- Interior background: 1080×1920 JPEG (separate image, darker for legibility).
- Transparent emblem: 512×512 PNG.

## Important status
- This package has not been confirmed by a successful Android build or GitHub Actions run in this step.
- The phrase in the startup animation preserves the spelling supplied in the request; it can be corrected in a later non-final iteration if desired.
- No API functionality or workflow success is claimed solely from editing these files.


## Added — result management (working checkpoint)
- Each result card has **SAVE URL** and **REMOVE RESULT** actions.
- Saved website URLs are stored locally and remain available after restarting the app; the **SAVED URLS** dialog can open or delete a saved address.
- Removing a result asks for confirmation and stores its ID in local preferences, filtering it out in later scans on this device.
- Existing categories, key filters, scanning, website checks, custom source management, intro music, and startup visual effects remain in the project.
- This checkpoint still requires a successful Android build/run to confirm compilation and runtime behavior.


## Final package audit — 2026-10-18

### Point 1 — app background and interface
- Increased interior background visibility and retained a dark overlay for legibility.
- Existing header emblem, dark panels, red accents, startup artwork and startup music remain present.

### Point 2 — separate categories page
- Added a dedicated `CATEGORIES` view with category counts and click-through to filtered results.
- The results/catalog view remains available through navigation.

### Point 3 — 18+ / Porn AI
- Added a separate `18+ / Porn AI` category and an explicit 18+ confirmation dialog.
- Public catalog metadata is classified into this category when adult/NSFW AI keywords are found. The category can be empty until matching public entries are discovered or a public HTTPS Markdown source is added.

### Point 4 — launcher icon
- Left the existing launcher icon assets unchanged, as requested.

### Package verification status
- ZIP integrity checked after packaging.
- Confirmed required Gradle project files, Android manifest, app source, background/splash images, icon resources, and GitHub Actions workflow are present.
- Saved URL bookmarks and hidden-result persistence remain implemented in `ApiRepository.kt` and `MainActivity.kt`.
- Android APK compilation and on-device UI behavior have NOT been verified here; no local Android SDK/Gradle installation was available. Do not treat this checkpoint as a successful APK build.
