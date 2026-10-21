import React, { useState } from 'react';
import { UmbrellaLogo } from './UmbrellaLogo';
import { playUiBeep, isSoundEnabled, setSoundEnabled, playSubBassStart } from '../audio/umbrellaSound';
import {
  Settings,
  Volume2,
  VolumeX,
  Play,
  Trash2,
  Download,
  Shield,
  Smartphone,
  Info,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplaySplash: () => void;
  onOpenIconShowcase: () => void;
  onOpenDownloadApk: () => void;
  isAdultSpace: boolean;
  onToggleAdultSpace: () => void;
  onClearHistory: () => void;
  onClearFavorites: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onReplaySplash,
  onOpenIconShowcase,
  onOpenDownloadApk,
  isAdultSpace,
  onToggleAdultSpace,
  onClearHistory,
  onClearFavorites
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [scanlines, setScanlines] = useState(true);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playSubBassStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-['Rajdhani']">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-red-500/50 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-950 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wider text-white">
                USTAWIENIA I SYSTEM UMBRELLA
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Konfiguracja dźwięku, motywu i uprawnień radaru
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Audio Section matching Section 2 */}
          <div className="space-y-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-2">
              <Volume2 size={16} className="text-red-400" />
              <span>Efekty Dźwiękowe & Głos Lektora</span>
            </span>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Cybernetyczne Dźwięki i Lektor</div>
                <div className="text-xs text-zinc-400 font-sans">
                  Niski start, szum mechaniczny, piknięcia telemetrii oraz synteza mowy
                </div>
              </div>
              <button
                onClick={handleToggleSound}
                className={`p-2.5 rounded-xl border transition-all ${
                  soundOn
                    ? 'bg-red-600 text-white border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                }`}
              >
                {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
              <button
                onClick={() => {
                  onReplaySplash();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <Play size={12} />
                <span>Odtwórz Animację Startową (Splash Screen)</span>
              </button>
            </div>
          </div>

          {/* Icon Showcase trigger */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UmbrellaLogo size={36} animationState="pulse" />
              <div>
                <div className="text-sm font-bold text-white">6. Animowana Ikona Aplikacji</div>
                <div className="text-xs text-zinc-400 font-sans">
                  Testuj 5 stanów: Spoczynek, Pulsowanie, Obrót 3D, Blask, Gotowa
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenIconShowcase();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono transition-colors border border-zinc-700"
            >
              Testuj Ikony
            </button>
          </div>

          {/* Source archive and web build workflow */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download size={22} className="text-emerald-400" />
              <div>
                <div className="text-sm font-bold text-white">Paczka ZIP z GitHub Actions (YAML)</div>
                <div className="text-xs text-zinc-400 font-sans">
                  Kod źródłowy i workflow budujący webową dystrybucję
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenDownloadApk();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-bold transition-colors border border-emerald-500 shadow"
            >
              Pobierz ZIP
            </button>
          </div>

          {/* Data Cleanup */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 block">
              Zarządzanie Pamięcią Lokalną
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  playUiBeep(900, 0.03);
                  onClearFavorites();
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={12} />
                <span>Wyczyść Ulubione</span>
              </button>
              <button
                onClick={() => {
                  playUiBeep(900, 0.03);
                  onClearHistory();
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={12} />
                <span>Wyczyść Historię</span>
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="p-4 rounded-xl bg-black/60 border border-zinc-900 text-center font-mono text-[11px] text-zinc-500 space-y-1">
            <div className="text-red-500 font-bold uppercase tracking-widest">
              UMBRELLA CORPORATION RADAR BIOS V4.09.22
            </div>
            <div>STATUS: WSZYSTKIE WĘZŁY CYBER-WYWIADU AKTYWNE (100% ONLINE)</div>
            <div>"OUR BUSINESS IS LIFE ITSELF"</div>
          </div>
        </div>
      </div>
    </div>
  );
};
