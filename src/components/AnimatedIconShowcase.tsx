import React, { useState } from 'react';
import { UmbrellaLogo } from './UmbrellaLogo';
import { IconAnimationState } from '../types/radar';
import { playUiBeep } from '../audio/umbrellaSound';
import { X, Smartphone, Sparkles, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';

interface AnimatedIconShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnimatedIconShowcase: React.FC<AnimatedIconShowcaseProps> = ({ isOpen, onClose }) => {
  const [activeState, setActiveState] = useState<IconAnimationState>('idle');

  if (!isOpen) return null;

  const states: { id: IconAnimationState; number: number; label: string; sub: string; icon: any }[] = [
    { id: 'idle', number: 1, label: 'Spoczynek', sub: 'Bez ruchu', icon: Sparkles },
    { id: 'pulse', number: 2, label: 'Pulsowanie', sub: 'Czerwone światło', icon: Zap },
    { id: 'rotate', number: 3, label: 'Obrót', sub: '3D efekt rotacji', icon: RefreshCw },
    { id: 'flare', number: 4, label: 'Blask', sub: 'Neonowe przejście', icon: Sparkles },
    { id: 'ready', number: 5, label: 'Gotowa', sub: 'Finalna ikona ze statusem', icon: CheckCircle2 }
  ];

  const handleSelectState = (state: IconAnimationState) => {
    setActiveState(state);
    playUiBeep(state === 'flare' ? 1400 : 980, 0.05);

    // Haptic feedback vibration (Android / Mobile)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (state === 'pulse') navigator.vibrate([40, 30, 40]);
        else if (state === 'rotate') navigator.vibrate(50);
        else if (state === 'flare') navigator.vibrate([80, 40, 80]);
        else navigator.vibrate(25);
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-['Rajdhani']">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-red-500/50 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.35)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-950 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950">
          <div className="flex items-center gap-3">
            <UmbrellaLogo size={28} animationState={activeState} />
            <div>
              <h3 className="text-base font-bold tracking-wider text-white">
                6. ANIMOWANA IKONA (SEKCJA KONCEPCYJNA)
              </h3>
              <p className="text-xs font-mono text-red-400">
                Opcjonalnie - krótkie wibracje dotykowe (Haptics)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Big Preview Area */}
        <div className="relative py-12 flex flex-col items-center justify-center bg-radial from-red-950/30 via-zinc-950 to-black overflow-hidden border-b border-red-950/60">
          {/* Subtle Grid */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative">
            <UmbrellaLogo size={140} animationState={activeState} showGlow={true} />
          </div>

          <div className="mt-6 flex flex-col items-center">
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
              STATUS AKTYWNY
            </span>
            <span className="text-lg font-bold tracking-wider text-white capitalize mt-0.5">
              {states.find(s => s.id === activeState)?.label} ({states.find(s => s.id === activeState)?.sub})
            </span>
          </div>
        </div>

        {/* 5 States Selector (Section 6 buttons) */}
        <div className="p-6 bg-zinc-950">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3 block">
            Wybierz stan animacji:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {states.map((s) => {
              const isSelected = activeState === s.id;
              const IconComp = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectState(s.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.7)] scale-102'
                      : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-red-900 hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-[10px] font-mono opacity-70 mb-1">
                    {s.number}. Stan
                  </span>
                  <div className="my-1">
                    <UmbrellaLogo size={28} animationState={s.id} showGlow={isSelected} />
                  </div>
                  <span className="text-xs font-bold mt-1 leading-tight">{s.label}</span>
                  <span className="text-[10px] opacity-75 font-mono leading-tight">{s.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Section 1 APK Icons sizes reminder */}
          <div className="mt-5 p-3.5 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone size={18} className="text-red-400" />
              <div>
                <div className="text-xs font-bold text-white tracking-wide">
                  1. IKONY APLIKACJI W PACZCE (APK / PLAY STORE)
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  512x512, 192x192, 72x72, 48x48, 36x36, 24x24 px wygenerowane
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-zinc-900 border border-red-500/40 flex items-center justify-center text-[9px] font-mono text-zinc-300">
                512
              </div>
              <div className="w-5 h-5 rounded bg-zinc-900 border border-red-500/40 flex items-center justify-center text-[8px] font-mono text-zinc-300">
                192
              </div>
              <div className="w-4 h-4 rounded bg-zinc-900 border border-red-500/40 flex items-center justify-center text-[7px] font-mono text-zinc-300">
                48
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
