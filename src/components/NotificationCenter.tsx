import React from 'react';
import { UmbrellaLogo } from './UmbrellaLogo';
import { RadarNotification } from '../types/radar';
import { playUiBeep } from '../audio/umbrellaSound';
import { Bell, Check, Trash2, X, Radio } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: RadarNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectApi?: (apiId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectApi
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-6 bg-black/70 backdrop-blur-sm font-['Rajdhani']">
      <div className="w-full max-w-sm sm:max-w-md bg-zinc-950 border border-red-500/50 rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.3)] overflow-hidden flex flex-col max-h-[85vh] animate-fadeIn mt-12 sm:mt-14 mr-0 sm:mr-2">
        {/* Header matching Section 4 */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-red-950/80 bg-gradient-to-r from-red-950/50 via-zinc-950 to-zinc-950">
          <div className="flex items-center gap-2.5">
            <UmbrellaLogo size={22} animationState="pulse" showGlow={true} />
            <div>
              <h3 className="text-sm font-bold tracking-wider text-white">
                4. POWIADOMIENIA (RADAR ALERTS)
              </h3>
              <p className="text-[10px] font-mono text-red-400">
                Satelitarny monitoring darmowych kluczy API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2 bg-black/40 border-b border-zinc-900 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">
            {notifications.filter(n => !n.read).length} nowych powiadomień
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playUiBeep(1100, 0.03);
                onMarkAllAsRead();
              }}
              className="text-red-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Check size={12} />
              <span>Przeczytane</span>
            </button>
            <button
              onClick={() => {
                playUiBeep(800, 0.03);
                onClearAll();
              }}
              className="text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} />
              <span>Wyczyść</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              <Radio size={24} className="mx-auto mb-2 opacity-40 text-red-500 animate-pulse" />
              <span>Brak nowych powiadomień. Radar w trybie czuwania.</span>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.apiId && onSelectApi) {
                    playUiBeep(1200, 0.03);
                    onSelectApi(item.apiId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  !item.read
                    ? 'bg-red-950/30 border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                    : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Header row exactly like Section 4 */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <UmbrellaLogo size={16} animationState="ready" />
                    <span className="text-xs font-bold text-white font-mono">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {item.timeAgo}
                  </span>
                </div>

                {/* Notification body */}
                <p className="text-xs text-zinc-300 font-sans mt-1 leading-snug">
                  {item.message}
                </p>

                {item.apiId && (
                  <div className="mt-2 text-[10px] font-mono text-red-400 flex items-center gap-1">
                    <span>Zobacz szczegóły klucza API →</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
