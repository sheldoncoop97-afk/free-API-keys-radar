import React, { useState } from 'react';
import { playUiBeep } from '../audio/umbrellaSound';
import { Music, Play, Pause, Download, Sparkles, RefreshCw } from 'lucide-react';

interface MusicStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MusicStudio: React.FC<MusicStudioProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('Dark cyberpunk cinematic industrial theme with deep sub-bass and tension');
  const [modelType, setModelType] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Wpisz opis muzyki przed rozpoczęciem generowania.');
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);
    setErrorMsg(null);
    playUiBeep(1300, 0.05);

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: modelType })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : `Żądanie nie powiodło się (HTTP ${res.status}).`);
      if (typeof data.audioUrl !== 'string' || !data.audioUrl.startsWith('data:audio/')) {
        throw new Error('Usługa nie zwróciła poprawnego pliku audio.');
      }
      setAudioUrl(data.audioUrl);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Nie udało się wygenerować muzyki.');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      void audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setErrorMsg('Nie udało się rozpocząć odtwarzania audio.'));
    }
  };

  const audioMimeType = audioUrl?.match(/^data:([^;,]+)/)?.[1].toLowerCase();
  const audioExtension = audioMimeType === 'audio/mpeg' ? 'mp3'
    : audioMimeType === 'audio/ogg' ? 'ogg'
      : audioMimeType === 'audio/wav' || audioMimeType === 'audio/wave' ? 'wav'
        : 'audio';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-['Rajdhani']">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-red-500/50 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.35)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-950 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400">
              <Music size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wider text-white">
                UMBRELLA MUSIC STUDIO (LYRIA 3)
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Komponuj ścieżki dźwiękowe z promptu tekstowego
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

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-300">
              Model kompozycji
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setModelType('lyria-3-clip-preview')}
                className={`py-2 px-3 rounded-lg text-xs font-mono border transition-all ${
                  modelType === 'lyria-3-clip-preview'
                    ? 'bg-red-600 text-white border-red-400 shadow'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Lyria Clip (do 30 sek.)
              </button>
              <button
                onClick={() => setModelType('lyria-3-pro-preview')}
                className={`py-2 px-3 rounded-lg text-xs font-mono border transition-all ${
                  modelType === 'lyria-3-pro-preview'
                    ? 'bg-red-600 text-white border-red-400 shadow'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Lyria Pro (Pełny Utwór)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-red-400" />
              <span>Opis muzyczny (Prompt)</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 p-3 text-xs md:text-sm text-zinc-200 focus:outline-hidden focus:border-red-500 font-sans"
              placeholder="Opisz nastrój, tempo, instrumenty..."
            />
          </div>

          <button
            onClick={handleGenerateMusic}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm font-mono border border-red-400 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                <span>KOMPONOWANIE UTWORU...</span>
              </>
            ) : (
              <>
                <Music size={16} />
                <span>WYGENERUJ MUZYKĘ (LYRIA)</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div role="alert" className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          {audioUrl && (
            <div className="p-4 rounded-xl bg-black border border-emerald-500/60 flex items-center justify-between gap-4">
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                onError={() => {
                  setAudioUrl(null);
                  setIsPlaying(false);
                  setErrorMsg('Nie udało się odtworzyć wygenerowanego pliku audio.');
                }}
                className="hidden"
              />
              <button
                onClick={togglePlayback}
                className="p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-white" />}
              </button>
              <div className="flex-1">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  ŚCIEŻKA GOTOWA DO ODSŁUCHU
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  Format {audioMimeType?.replace('audio/', '').toUpperCase() || 'audio'} • Lyria
                </div>
              </div>
              <a
                href={audioUrl}
                download={`umbrella-lyria-track.${audioExtension}`}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5"
              >
                <Download size={12} />
                <span>Zapisz</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
