import React from 'react';
import { ApiCategory } from '../types/radar';
import { playUiBeep } from '../audio/umbrellaSound';
import {
  Brain,
  Film,
  MessageSquare,
  Camera,
  Volume2,
  Wrench,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface CategoryListProps {
  selectedCategory: ApiCategory | 'all';
  onSelectCategory: (cat: ApiCategory | 'all') => void;
  isAdultSpace: boolean;
  onOpenVideoStudio: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategory,
  onSelectCategory,
  isAdultSpace,
  onOpenVideoStudio
}) => {
  const categories = [
    {
      id: 'ai-ml' as ApiCategory,
      title: 'AI & Machine Learning',
      subtitle: 'Find free AI APIs',
      icon: Brain,
      badge: 'POPULAR'
    },
    {
      id: 'image-to-video' as ApiCategory,
      title: 'Image to Video',
      subtitle: 'Image generation, video, motion (Veo 3.1, Runway)',
      icon: Film,
      badge: 'NOWOŚĆ',
      highlight: true
    },
    {
      id: 'text-language' as ApiCategory,
      title: 'Text & Language',
      subtitle: 'Translation, NLP, etc.',
      icon: MessageSquare
    },
    {
      id: 'image-vision' as ApiCategory,
      title: 'Image & Vision',
      subtitle: 'Image generation, OCR, etc.',
      icon: Camera
    },
    {
      id: 'audio-speech' as ApiCategory,
      title: 'Audio & Speech',
      subtitle: 'TTS, STT, voice tools',
      icon: Volume2
    },
    {
      id: 'developer-tools' as ApiCategory,
      title: 'Developer Tools',
      subtitle: 'Utilities, data, etc.',
      icon: Wrench
    }
  ];

  if (isAdultSpace) {
    categories.unshift({
      id: 'adult-uncensored' as ApiCategory,
      title: 'Strefa dla Dorosłych (18+)',
      subtitle: 'Uncensored LLMs, NSFW image/video APIs',
      icon: ShieldAlert,
      badge: 'LEVEL 4',
      highlight: true
    });
  }

  return (
    <div className="space-y-2.5 font-['Rajdhani']">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          Kategorie API (Koncepcja Umbrella)
        </span>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => {
              playUiBeep(900, 0.02);
              onSelectCategory('all');
            }}
            className="text-[11px] font-mono text-red-400 hover:text-white transition-colors"
          >
            Pokaż wszystkie
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {categories.map((cat) => {
          const IconComp = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => {
                playUiBeep(1100, 0.03);
                onSelectCategory(isSelected ? 'all' : cat.id);
              }}
              className={`group relative p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)] scale-[1.01]'
                  : cat.highlight
                  ? 'bg-gradient-to-r from-red-950/20 to-zinc-950/80 border-red-500/40 hover:border-red-500 hover:bg-zinc-900/60'
                  : 'bg-zinc-950/70 border-zinc-900 hover:border-red-900/60 hover:bg-zinc-900/40'
              }`}
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                {/* Red Frame Square Icon Container matching Section 3 */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                    isSelected
                      ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                      : cat.highlight
                      ? 'bg-red-950/80 border-red-500/60 text-red-400 group-hover:border-red-400 group-hover:text-red-300'
                      : 'bg-zinc-900/90 border-red-950/80 text-red-500 group-hover:border-red-500/50 group-hover:text-red-400'
                  }`}
                >
                  <IconComp size={22} />
                </div>

                {/* Texts matching Section 3 */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold tracking-wide text-white truncate group-hover:text-red-400 transition-colors">
                      {cat.title}
                    </h3>
                    {cat.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-950 border border-red-500 text-red-300 font-bold uppercase">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-sans truncate">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {cat.id === 'image-to-video' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playUiBeep(1200, 0.04);
                      onOpenVideoStudio();
                    }}
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-red-900/40 border border-red-500/50 text-red-300 hover:bg-red-600 hover:text-white text-[11px] font-mono transition-all font-semibold"
                  >
                    <Sparkles size={11} />
                    <span>Uruchom Generator</span>
                  </button>
                )}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : 'text-zinc-600 group-hover:text-red-400 group-hover:translate-x-0.5'
                  }`}
                >
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
