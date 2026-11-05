# Umbrella Corp — Free API Radar (Android)

**Official app name:** Umbrella Corp  
**Project edition:** Free API Radar v2.0 — Complete Release  
**Package ID:** `com.example.freeapiradar`

Kompletny projekt aplikacji Android stworzony zgodnie ze specyfikacją graficzną i techniczną Umbrella Corporation Free API Radar.

---

## Główne Funkcje Aplikacji

1. **4-Etapowa Animacja Startowa (Splash Screen + Audio)**
   - **0 - 1.5s (Rozpoczęcie):** Matryca radarowa, cyfrowa siatka, wskaźnik `SECURE NETWORK SCANNER // INITIALIZING...`.
   - **1.5 - 3.0s (Formowanie logo):** Wektorowa animacja składania oktagonu Umbrella.
   - **3.0 - 5.0s (Logo + powitanie):** Trójwymiarowe logo Umbrella, hasło korporacji *"OUR BUSINESS IS LIFE ITSELF"* i napis *"WELCOME TO UMBRELLA CORPORATION"*.
   - **5.0 - 6.5s (Scena finałowa):** Wieżowiec kwatery głównej Umbrella (`umbrella_building.png`), helikoptery, status radaru oraz synteza mowy/dźwięk `umbrella_intro.mp3`.
   - Możliwość natychmiastowego pominięcia tapnięciem w ekran.

2. **Główny Radar i Wyszukiwarka**
   - Belka nagłówka z emblematem Umbrella, tytułem `Free API Radar / UMBRELLA CORPORATION` oraz przyciskiem menu i radaru.
   - Pasek wyszukiwania w czerwonej ramce: `"Search free APIs..."` z filtrowaniem w czasie rzeczywistym.
   - 6 głównych kategorii AI (zgodnie z projektem):
     1. **AI & Machine Learning** (*"Find free AI APIs"*)
     2. **Text & Language** (*"Translation, NLP, etc."*)
     3. **Image & Vision** (*"Image generation, OCR, etc."*)
     4. **Audio & Speech** (*"TTS, STT, voice tools"*)
     5. **Developer Tools** (*"Utilities, data, etc."*)
     6. **18+ / Adult AI** (*"Uncensored models, adult AI"*) — zabezpieczone bramką weryfikacji wieku 18+.

3. **Ekran Szczegółów API (Details Screen)**
   - Logo dostawcy, nazwa modelu/narzędzia, chipy tagów (`AI`, `Text`, `Chat`, itp.).
   - Pełny opis możliwości.
   - Kafelki metryk:
     - `Rate Limit` (np. *3 500 req/day*, *Free tier credits*)
     - `Auth` (*API Key* lub *No key*)
     - `Docs` (*View*)
   - Główny czerwony przycisk akcji: **"Open in Browser"** (bezpieczne otwieranie w Chrome lub domyślnej przeglądarce).
   - Akcje ulubionych i kopiowania linku.
   - Kontener **"Response Example"** z podświetlonym kodem JSON przykładowej odpowiedzi modelu.

4. **Nawigacja Boczna (Navigation Drawer)**
   - Logo korporacji, menu: *Home*, *Search*, *Favorites*, *History*, *Settings*, *About*, *Exit*.
   - Stylizowana siatka radarowa mapy świata z węzłami sieci i hasłem korporacji:  
     `— OUR BUSINESS IS LIFE ITSELF —`

5. **Dolny Pasek Nawigacji (Bottom Navigation Bar)**
   - *Home* (Kategorie i katalog)
   - *Favorites* (Zapisane w ulubionych)
   - *History* (Historia otwieranych API)
   - *Settings* (Ustawienia skanera i źródeł)

6. **Automatyczny Skaner Sieci (WorkManager Daemon)**
   - Zgodnie z wymaganiami skanuje sieć **co 15 minut** w poszukiwaniu nowych darmowych kluczy, modeli i punktów końcowych.
   - Dedykowane powiadomienia Android z ikoną `notification_icon` i tytułem:
     `New free API available! ... has been added to the database.`
   - Możliwość dodawania własnych źródeł HTTPS (pliki Markdown, listy publicznych repozytoriów API).

---

## Budowanie przez GitHub Actions

Projekt posiada gotowy plik `.github/workflows/android.yml`.

1. Wystarczy wypchnąć (`git push`) repozytorium na GitHub (gałąź `main`).
2. GitHub Actions automatycznie uruchomi zadanie **Build Umbrella Corp APK** (JDK 17, Android SDK Platform 35, Gradle 8.9).
3. Gotowy plik `app-debug.apk` będzie do pobrania w zakładce **Actions -> Artifacts** (plik `Umbrella-Corp-debug-apk`).

---

## Budowanie Lokalne

W katalogu projektu:
```bash
gradle assembleDebug
```
Wynikowy plik APK znajdzie się w:
`app/build/outputs/apk/debug/app-debug.apk`.
