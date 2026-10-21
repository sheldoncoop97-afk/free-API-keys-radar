import React from 'react';
import { FreeApiItem } from '../types/radar';
import { UmbrellaLogo } from './UmbrellaLogo';
import { playUiBeep } from '../audio/umbrellaSound';
import { Star, Clock, Key, ExternalLink, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ApiCardProps {
  api: FreeApiItem;
  onSelect: (api: FreeApiItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ApiCard: React.FC<ApiCardProps> = ({
  api,
  onSelect,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div
      onClick={() => {
        playUiBeep(1100, 0.03);
        onSelect(api);
      }}
      className="group relative p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 hover:border-red-500/70 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] transition-all cursor-pointer flex flex-col justify-between font-['Rajdhani']"
    >
      <div>
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <UmbrellaLogo size={34} animationState="ready" showGlow={false} />
            <div className="min-w-0">
              <h4 className="text-base font-bold text-white tracking-wide truncate group-hover:text-red-400 transition-colors">
                {api.name}
              </h4>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                {api.provider}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              playUiBeep(1200, 0.03);
              onToggleFavorite(api.id);
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              isFavorite
                ? 'bg-red-950/80 border-red-500 text-yellow-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
            }`}
            title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          >
            <Star size={14} className={isFavorite ? "fill-yellow-400" : ""} />
          </button>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          {api.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300"
            >
              {tag}
            </span>
          ))}
          {api.isAdult && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-950 text-red-400 border border-red-700 font-bold">
              18+
            </span>
          )}
        </div>

        {/* Short description */}
        <p className="text-xs text-zinc-400 line-clamp-2 font-sans mb-3 leading-relaxed">
          {api.shortDescription}
        </p>
      </div>

      {/* Footer Stats matching Section 3 */}
      <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-zinc-400" title="Limit zapytań">
            <Clock size={12} className="text-red-400" />
            <span className="text-[11px] text-zinc-300 font-semibold">{api.rateLimit}</span>
          </div>

          <div className="flex items-center gap-1 text-zinc-400" title="Metoda autoryzacji">
            <Key size={12} className="text-red-400" />
            <span className="text-[11px] text-zinc-300">{api.authType}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-red-400 group-hover:text-red-300 font-bold text-xs">
          <span>Details</span>
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
