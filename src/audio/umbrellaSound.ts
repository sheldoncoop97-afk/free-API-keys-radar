// Umbrella Corporation Audio & Cyber Synthesis Engine

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let splashTimers: number[] = [];

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  if (!enabled) {
    splashTimers.forEach(window.clearTimeout);
    splashTimers = [];
    window.speechSynthesis?.cancel();
  }
};

export const isSoundEnabled = () => soundEnabled;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// 1. Krótki, niski dźwięk startu (Sub-bass impact / cinematic thud)
export const playSubBassStart = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.6);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.85);
  } catch (e) {
    console.warn('Audio sub-bass error', e);
  }
};

// 2. Mechaniczny szum i przester (Industrial mechanical hum & white noise burst)
export const playMechanicalHum = (duration = 1.2) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  } catch (e) {
    console.warn('Audio mechanical hum error', e);
  }
};

// 3. Efekt "cyfrowego" wczytywania (Cyber telemetry beeps, deciphering sequence)
export const playDigitalScanBeeps = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const frequencies = [880, 1174, 1320, 1760, 2093, 2637];

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gain.gain.setValueAtTime(0.04, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.07);
    });
  } catch (e) {
    console.warn('Audio scan beeps error', e);
  }
};

// 4. Komputerowy głos powitalny
export const speakUmbrellaVoice = (text = "Welcome to Umbrella Corporation.") => {
  if (!soundEnabled) return;
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    utterance.pitch = 1.12;
    utterance.volume = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'));
    const femaleVoice = englishVoices.find((voice) =>
      /female|samantha|ava|zira|aria|jenny|sonia|karen|susan|victoria/i.test(voice.name)
    );
    if (femaleVoice || englishVoices[0]) utterance.voice = femaleVoice || englishVoices[0];

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error', e);
  }
};

// Complete Startup Sequence: Combines sub-bass, hum, telemetry, and speech
export const triggerFullSplashAudio = () => {
  if (!soundEnabled) return;
  splashTimers.forEach(window.clearTimeout);
  splashTimers = [];
  playSubBassStart();
  splashTimers.push(window.setTimeout(() => {
    playMechanicalHum(5.6);
    speakUmbrellaVoice("Welcome to Umbrella Corporation.");
  }, 400));
  splashTimers.push(window.setTimeout(() => {
    playDigitalScanBeeps();
  }, 1400));
};

// UI Click / Radar Feedback
export const playUiBeep = (freq = 900, duration = 0.04) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    // ignore
  }
};

// Red Alert Warning sound (for Adult 18+ Classified Space)
export const playRedAlertSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const startT = now + i * 0.25;
      osc.frequency.setValueAtTime(420, startT);
      osc.frequency.linearRampToValueAtTime(750, startT + 0.18);

      gain.gain.setValueAtTime(0.08, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.24);
    }
  } catch (e) {
    // ignore
  }
};
