import React from 'react';
import { UmbrellaLogo } from './UmbrellaLogo';
import { playUiBeep } from '../audio/umbrellaSound';
import {
  Home,
  Search,
  Star,
  Clock,
  Settings,
  Info,
  LogOut,
  X,
  Globe,
  Film,
  Music,
  Download,
  ShieldAlert,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  favoritesCount: number;
  historyCount: number;
  isAdultSpace: boolean;
  onToggleAdultSpace: () => void;
  onOpenVideoStudio: () => void;
  onOpenMusicStudio: () => void;
  onOpenSearchGrounding: () => void;
  onOpenDownloadApk: () => void;
  onOpenIconShowcase: () => void;
  onReplaySplash: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  favoritesCount,
  historyCount,
  isAdultSpace,
  onToggleAdultSpace,
  onOpenVideoStudio,
  onOpenMusicStudio,
  onOpenSearchGrounding,
  onOpenDownloadApk,
  onOpenIconShowcase,
  onReplaySplash
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'favorites', label: 'Favorites', icon: Star, badge: favoritesCount },
    { id: 'history', label: 'History', icon: Clock, badge: historyCount },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About', icon: Info },
    { id: 'exit', label: 'Exit', icon: LogOut }
  ];

  return (
    <div className="fixed inset-0 z-50 flex font-['Rajdhani']">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Shell matching Section 3 Drawer Screen */}
      <div className="relative w-72 sm:w-80 max-w-[85vw] h-full bg-[#0a0a0d] border-r border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.25)] flex flex-col z-10 overflow-y-auto custom-scrollbar">
        {/* Header matching Section 3 */}
        <div className="p-6 border-b border-red-950/80 bg-gradient-to-b from-red-950/30 to-transparent flex flex-col items-center text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>

          <UmbrellaLogo size={60} animationState="pulse" showGlow={true} />

          <h2 className="text-xl font-black tracking-[0.2em] text-white mt-3">
            Free API Radar
          </h2>
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-red-500 uppercase mt-0.5">
            UMBRELLA CORPORATION
          </span>
        </div>

        {/* Space Switcher Banner */}
        <div className="p-3 mx-4 my-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className={isAdultSpace ? "text-red-500" : "text-zinc-500"} />
            <div>
              <div className="text-xs font-bold text-white font-mono">
                {isAdultSpace ? 'PRZESTRZEŃ 18+ (DOROSŁE)' : 'PUBLICZNY RADAR'}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {isAdultSpace ? 'Strefa 18+ • potwierdzenie wieku' : 'Standardowa baza'}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              playUiBeep(1200, 0.04);
              onToggleAdultSpace();
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
              isAdultSpace
                ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.7)]'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            Zmień
          </button>
        </div>

        {/* Main Nav Items matching Section 3 */}
        <div className="px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playUiBeep(1100, 0.03);
                  if (item.id === 'exit') {
                    onReplaySplash();
                  } else {
                    onSelectTab(item.id);
                  }
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] font-bold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp size={18} className={isSelected ? 'text-white' : 'text-red-500'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-950 text-red-300 border border-red-700 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Special AI Tools Section */}
        <div className="px-3 pt-3 pb-1 border-t border-zinc-900 mt-2">
          <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1.5">
            Specjalne Narzędzia AI
          </span>
          <div className="space-y-1">
            <button
              onClick={() => {
                onOpenVideoStudio();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all text-left"
            >
              <Film size={16} className="text-amber-500" />
              <span>Image-to-Video Studio (Veo)</span>
            </button>

            <button
              onClick={() => {
                onOpenMusicStudio();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all text-left"
            >
              <Music size={16} className="text-rose-400" />
              <span>Music Generator (Lyria 3)</span>
            </button>

            <button
              onClick={() => {
                onOpenSearchGrounding();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all text-left"
            >
              <Globe size={16} className="text-cyan-400" />
              <span>Google Search Grounding</span>
            </button>

            <button
              onClick={() => {
                onOpenIconShowcase();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all text-left"
            >
              <Smartphone size={16} className="text-red-400" />
              <span>Animowana Ikona (5 Stanów)</span>
            </button>

            <button
              onClick={() => {
                onOpenDownloadApk();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 hover:bg-emerald-900/40 hover:text-white transition-all text-left font-bold"
            >
              <Download size={16} />
              <span>Pobierz ZIP źródeł</span>
            </button>
          </div>
        </div>

        {/* Bottom Banner & World Map graphic matching Section 3 */}
        <div className="mt-auto p-4 border-t border-red-950/80 bg-black/60 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-red-500 mb-2 uppercase font-semibold">
            <span>-- OUR BUSINESS IS LIFE ITSELF --</span>
          </div>

          {/* World map representation with glowing Umbrella Node */}
          <div className="relative w-full h-24 rounded-xl overflow-hidden bg-zinc-950 border border-red-950/80 flex items-center justify-center p-2">
            {/* SVG stylized world silhouette */}
            <svg viewBox="0 0 400 180" className="w-full h-full opacity-40">
              <path
                d="M 40 40 Q 90 20 140 45 Q 160 80 130 110 Q 90 140 50 110 Z M 200 30 Q 260 25 320 50 Q 340 90 310 130 Q 250 140 210 110 Z M 160 110 Q 180 150 160 170 Z M 320 120 Q 360 130 350 160 Z"
                fill="#b91c1c"
              />
            </svg>

            {/* Glowing Umbrella coordinates ping */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-red-600/30 animate-ping absolute" />
              <UmbrellaLogo size={20} animationState="pulse" showGlow={true} />
            </div>

            <div className="absolute bottom-1 right-2 text-[9px] font-mono text-zinc-500">
              RACCOON CITY HQ // ONLINE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
