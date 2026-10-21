import React from 'react';
import { UmbrellaLogo } from './UmbrellaLogo';
import { playUiBeep, isSoundEnabled, setSoundEnabled } from '../audio/umbrellaSound';
import {
  Menu,
  Bell,
  Volume2,
  VolumeX,
  ShieldAlert,
  FolderArchive,
  Film
} from 'lucide-react';

interface HeaderProps {
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  isAdultSpace: boolean;
  onToggleAdultSpace: () => void;
  onOpenDownloadApk: () => void;
  onOpenVideoStudio: () => void;
  onOpenIconShowcase: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDrawer,
  onOpenNotifications,
  unreadNotificationsCount,
  isAdultSpace,
  onToggleAdultSpace,
  onOpenDownloadApk,
  onOpenVideoStudio,
  onOpenIconShowcase
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    playUiBeep(next ? 1200 : 600, 0.04);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090c]/90 backdrop-blur-md border-b border-red-950/80 font-['Rajdhani'] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity matching Section 3 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playUiBeep(1100, 0.03);
              onOpenIconShowcase();
            }}
            className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title="Kliknij, aby przetestować stany animowanej ikony"
          >
            <UmbrellaLogo size={36} animationState={isAdultSpace ? "pulse" : "ready"} showGlow={true} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-wider text-white leading-tight">
                Free API Radar
              </h1>
              {isAdultSpace && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-600 text-white font-bold animate-pulse">
                  18+ SPACE
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-red-500 uppercase leading-none">
              UMBRELLA CORPORATION
            </p>
          </div>
        </div>

        {/* Center: Space Switcher Pill ("Druga Przestrzeń") */}
        <div className="hidden md:flex items-center p-1 rounded-full bg-zinc-950 border border-zinc-800">
          <button
            onClick={() => {
              if (isAdultSpace) {
                playUiBeep(1000, 0.03);
                onToggleAdultSpace();
              }
            }}
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-all ${
              !isAdultSpace
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Standard Radar
          </button>

          <button
            onClick={() => {
              if (!isAdultSpace) {
                playUiBeep(1300, 0.04);
                onToggleAdultSpace();
              }
            }}
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isAdultSpace
                ? 'bg-gradient-to-r from-red-700 to-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.8)]'
                : 'text-zinc-400 hover:text-red-400'
            }`}
          >
            <ShieldAlert size={12} className={isAdultSpace ? "text-white" : "text-red-500"} />
            <span>Druga Przestrzeń (18+)</span>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Image-to-Video Studio Button */}
          <button
            onClick={() => {
              playUiBeep(1100, 0.03);
              onOpenVideoStudio();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white text-xs font-mono transition-all font-semibold"
            title="Image to Video Generator (Veo 3.1)"
          >
            <Film size={14} className="text-amber-400" />
            <span>Image to Video</span>
          </button>

          {/* Download ZIP + YAML button */}
          <button
            onClick={() => {
              playUiBeep(1100, 0.03);
              onOpenDownloadApk();
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-all"
            title="Pobierz archiwum źródeł"
          >
            <FolderArchive size={14} className="text-emerald-400" />
            <span>Pobierz ZIP źródeł</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title={soundOn ? "Wycisz dźwięki cybernetyczne" : "Włącz dźwięki cybernetyczne"}
          >
            {soundOn ? <Volume2 size={18} className="text-red-400" /> : <VolumeX size={18} />}
          </button>

          {/* Notification Bell matching Section 4 */}
          <button
            onClick={() => {
              playUiBeep(1100, 0.03);
              onOpenNotifications();
            }}
            className="relative p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Powiadomienia radaru"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-pulse border border-black">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu Button matching Section 3 */}
          <button
            onClick={() => {
              playUiBeep(1100, 0.03);
              onOpenDrawer();
            }}
            className="p-2 rounded-lg bg-zinc-900/80 border border-red-500/40 text-red-400 hover:text-white hover:bg-red-950 transition-colors"
            title="Otwórz menu boczne"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
