import React, { useState, useEffect } from 'react';
import { UmbrellaLogo } from './UmbrellaLogo';
import { triggerFullSplashAudio, playUiBeep, isSoundEnabled, setSoundEnabled } from '../audio/umbrellaSound';
import { Volume2, VolumeX, FastForward, Play, ShieldAlert } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  autoStartAudio?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, autoStartAudio = true }) => {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  useEffect(() => {
    // Phase 1 logs (0 - 1.5s)
    const logs = [
      "BIOS VER 4.09.22 UMBRELLA MAINFRAME",
      "SEC_CLEARANCE: PROTOCOL OMEGA ACTIVE",
      "INITIALIZING FREE API RADAR SUBSYSTEM...",
      "CONNECTING TO RACCOON CITY CENTRAL DATABASE...",
      "DECRYPTING PUBLIC & CLASSIFIED FREQUENCIES..."
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logs.length) {
        const text = logs[logIndex];
        setTerminalLogs(prev => [...prev, text]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 280);

    // Phase 1 -> Phase 2 (1.5s)
    const t1 = setTimeout(() => {
      setPhase(2);
      playUiBeep(1200, 0.08);
    }, 1500);

    // Phase 2 -> Phase 3 (3.0s)
    const t2 = setTimeout(() => {
      setPhase(3);
    }, 3000);

    // Phase 3 -> Phase 4 (5.0s)
    const t3 = setTimeout(() => {
      setPhase(4);
    }, 5000);

    // Auto complete at 7.2s
    const t4 = setTimeout(() => {
      onComplete();
    }, 7200);

    return () => {
      clearInterval(logInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const handleStartWithAudio = () => {
    setHasInteracted(true);
    triggerFullSplashAudio();
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070709] text-white overflow-hidden font-['Rajdhani'] select-none">
      {/* Background Matrix & Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Animated Red Cyber Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(239, 68, 68, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(239, 68, 68, 0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(45deg) translateY(-50px) scale(2)',
          transformOrigin: 'top center'
        }}
      />

      {/* Vignette & Ambient Red Pulsing Fog */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#070709]/70 to-[#050507] pointer-events-none" />
      <div className="absolute inset-0 bg-red-950/10 pointer-events-none animate-pulse" />

      {/* Top Header Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-red-500/80">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
          <span>PHASE 0{phase} // SYSTEM BOOT</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-zinc-900/80 border border-red-500/30 text-red-400 hover:text-white hover:border-red-500 transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Toggle Sound"
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundOn ? 'AUDIO ON' : 'MUTED'}</span>
          </button>

          <button
            onClick={() => {
              playUiBeep(1400, 0.05);
              onComplete();
            }}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1.5 tracking-wider"
          >
            <span>SKIP INTRO</span>
            <FastForward size={14} />
          </button>
        </div>
      </div>

      {/* Audio Ignition Prompt if user has not interacted */}
      {!hasInteracted && (
        <div className="absolute bottom-6 z-30 flex flex-col items-center">
          <button
            onClick={handleStartWithAudio}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-700 to-red-600 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(239,68,68,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-red-400/50"
          >
            <Play size={16} className="fill-white" />
            <span>Engage Audio Systems</span>
          </button>
          <span className="text-[11px] font-mono text-zinc-500 mt-2">
            Click to activate mechanical soundscape & voice synthesis
          </span>
        </div>
      )}

      {/* PHASE 1: Rozpoczęcie (0-1.5s) */}
      {phase === 1 && (
        <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center animate-fadeIn">
          <div className="w-20 h-20 mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping" />
            <div className="w-16 h-16 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
            <ShieldAlert size={28} className="text-red-500" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-[0.3em] text-red-500 mb-4 animate-pulse">
            INITIALIZING...
          </h2>

          {/* Scrolling Terminal Code Matrix */}
          <div className="w-full bg-black/70 border border-red-950/80 rounded-lg p-3 text-left font-mono text-[11px] text-red-400/90 space-y-1 h-32 overflow-hidden shadow-[inset_0_0_15px_rgba(220,38,38,0.1)]">
            {terminalLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-red-600 select-none">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
            <div className="w-2 h-4 bg-red-500 animate-pulse inline-block" />
          </div>

          <div className="mt-6 text-xs text-zinc-500 font-mono tracking-widest">
            STEP 1: PROTOCOL INITIALIZATION (0 - 1.5s)
          </div>
        </div>
      )}

      {/* PHASE 2: Formowanie Logo (1.5 - 3.0s) */}
      {phase === 2 && (
        <div className="relative z-10 flex flex-col items-center px-6 text-center animate-fadeIn">
          {/* Holographic Wireframe Umbrella forming */}
          <div className="relative mb-8">
            <div className="absolute -inset-8 bg-red-600/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative">
              <UmbrellaLogo size={140} animationState="rotate" showGlow={true} />

              {/* Holographic scanning horizontal laser */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-red-400 shadow-[0_0_12px_#ef4444] animate-bounce"
                style={{ top: '50%' }}
              />
            </div>
          </div>

          <div className="space-y-1 font-mono">
            <p className="text-xs uppercase tracking-[0.3em] text-red-400">
              SYNTHESIZING HOLOGRAPHIC BIO-SHIELD
            </p>
            <p className="text-sm font-bold text-white tracking-widest">
              ASSEMBLING UMBRELLA INSIGNIA...
            </p>
          </div>

          <div className="mt-8 w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 animate-[progress_1.5s_ease-in-out_infinite]" />
          </div>

          <div className="mt-4 text-xs text-zinc-500 font-mono tracking-widest">
            STEP 2: FORMOWANIE LOGO (1.5 - 3s)
          </div>
        </div>
      )}

      {/* PHASE 3: Logo + Tekst (3.0 - 5.0s) */}
      {phase === 3 && (
        <div className="relative z-10 flex flex-col items-center px-6 text-center animate-fadeIn">
          {/* Finished Chrome Logo */}
          <div className="relative mb-6">
            <div className="absolute -inset-10 bg-red-600/30 rounded-full blur-3xl animate-pulse" />
            <UmbrellaLogo size={160} animationState="pulse" showGlow={true} />
          </div>

          <h3 className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-zinc-400 mb-1">
            WELCOME TO
          </h3>
          <h1 className="text-3xl md:text-5xl font-black tracking-[0.25em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            UMBRELLA
          </h1>
          <h2 className="text-lg md:text-2xl font-bold tracking-[0.35em] text-red-500 mt-1">
            CORPORATION
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-red-600" />
            <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-red-400 uppercase">
              OUR BUSINESS IS LIFE ITSELF
            </span>
            <span className="w-8 h-[1px] bg-red-600" />
          </div>

          <div className="mt-8 text-xs text-zinc-500 font-mono tracking-widest">
            STEP 3: LOGO + TEKST (3 - 5s)
          </div>
        </div>
      )}

      {/* PHASE 4: Finalna scena (5.0 - 7.2s) */}
      {phase === 4 && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 text-center animate-fadeIn">
          {/* Background Raccoon City Umbrella Tower Asset */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url('/assets/umbrella/background.png')` }}
          />

          <div className="relative z-20 flex flex-col items-center bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-red-500/40 shadow-[0_0_50px_rgba(220,38,38,0.3)] max-w-md w-full">
            <UmbrellaLogo size={96} animationState="ready" showGlow={true} />

            <h4 className="text-[10px] font-mono font-semibold uppercase tracking-[0.5em] text-zinc-400 mt-4">
              WELCOME TO
            </h4>
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.25em] text-white">
              UMBRELLA
            </h1>
            <h2 className="text-base font-bold tracking-[0.3em] text-red-500">
              CORPORATION
            </h2>

            <p className="text-xs font-mono text-red-400 tracking-[0.2em] mt-1 italic">
              "OUR BUSINESS IS LIFE ITSELF"
            </p>

            <div className="w-full my-4 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            <div className="text-xs font-mono text-zinc-300 space-y-1 mb-5">
              <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                <span>RADAR SATELLITES SYNCHRONIZED</span>
              </div>
              <div className="text-[11px] text-zinc-400">
                25+ Free API Frequencies Online • Adult 18+ Second Space Ready
              </div>
            </div>

            <button
              onClick={() => {
                playUiBeep(1600, 0.08);
                onComplete();
              }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(239,68,68,0.7)] hover:brightness-125 transition-all text-xs font-mono border border-red-400 flex items-center justify-center gap-2"
            >
              <span>ACCESS RADAR TERMINAL</span>
              <FastForward size={14} />
            </button>
          </div>

          <div className="absolute bottom-6 text-xs text-zinc-500 font-mono tracking-widest z-20">
            STEP 4: FINALNA SCENA (5 - 7s)
          </div>
        </div>
      )}
    </div>
  );
};
