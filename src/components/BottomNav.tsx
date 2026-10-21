import React from 'react';
import { playUiBeep } from '../audio/umbrellaSound';
import { Home, Star, Clock, Settings, ShieldAlert, Film } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  favoritesCount: number;
  historyCount: number;
  isAdultSpace: boolean;
  onToggleAdultSpace: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  historyCount,
  isAdultSpace,
  onToggleAdultSpace
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'favorites', label: 'Favorites', icon: Star, badge: favoritesCount },
    { id: 'history', label: 'History', icon: Clock, badge: historyCount },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'adult', label: '18+', icon: ShieldAlert }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#08090c]/95 backdrop-blur-lg border-t border-red-950/80 font-['Rajdhani'] safe-area-pb">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isSelected = tab.id === 'adult' ? isAdultSpace : activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playUiBeep(1000, 0.03);
                if (tab.id === 'adult') onToggleAdultSpace();
                else onSelectTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 transition-all ${
                isSelected
                  ? 'text-red-500 scale-105'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <IconComp size={20} className={isSelected ? 'stroke-[2.5]' : 'stroke-2'} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-mono bg-red-600 text-white font-bold leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-mono tracking-wider mt-0.5 ${isSelected ? 'font-bold text-white' : ''}`}>
                {tab.label}
              </span>
              {isSelected && (
                <span className="w-1 h-1 rounded-full bg-red-500 mt-0.5 shadow-[0_0_6px_#ef4444]" />
              )}
            </button>
          );
        })}

      </div>
    </nav>
  );
};
