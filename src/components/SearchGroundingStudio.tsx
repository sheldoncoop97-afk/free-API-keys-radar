import React, { useState } from 'react';
import { UmbrellaLogo } from './UmbrellaLogo';
import { playUiBeep } from '../audio/umbrellaSound';
import { Search, Globe, Sparkles, RefreshCw, ExternalLink, CheckCircle2 } from 'lucide-react';

interface SearchGroundingStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchGroundingStudio: React.FC<SearchGroundingStudioProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('newest free AI APIs released recently with free tiers');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!query.trim()) {
      setErrorMessage('Wpisz nazwę API lub dostawcy, którego oficjalne strony chcesz znaleźć.');
      return;
    }
    setIsSearching(true);
    setResults(null);
    setErrorMessage(null);
    setSources([]);
    playUiBeep(1200, 0.05);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : `Wyszukiwanie nie powiodło się (HTTP ${res.status}).`);
      setResults(data.text);
      if (Array.isArray(data.sources)) {
        setSources(data.sources.filter((source: { url?: unknown }) =>
          typeof source.url === 'string' && source.url.startsWith('https://')
        ));
      }
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Nie udało się wykonać wyszukiwania.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-['Rajdhani']">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-red-500/50 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-950 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wider text-white">
                GOOGLE SEARCH GROUNDING RADAR
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Wyszukuj oficjalne strony rejestracji kluczy i dokumentację API
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

        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-300">
              Zapytanie o oficjalne strony API i rejestrację klucza
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-red-500 font-sans"
                placeholder="np. Groq API key signup, Gemini API key..."
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {isSearching ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
                <span>Skanuj</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div role="alert" className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          {results && (
            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3 font-sans text-xs text-zinc-200 leading-relaxed">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                <CheckCircle2 size={14} />
                <span>Wyniki wyszukiwania na żywo</span>
              </div>
              <div className="whitespace-pre-wrap">{results}</div>

              {sources.length > 0 && (
                <div className="pt-2 border-t border-zinc-800 font-mono text-[11px] text-zinc-400">
                  <span className="block mb-1 text-zinc-500 uppercase">Zweryfikowane źródła:</span>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-red-400 hover:text-white flex items-center gap-1"
                      >
                        <span>{s.title || 'Źródło'}</span>
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
