import React, { useState, useRef } from 'react';
import { UmbrellaLogo } from './UmbrellaLogo';
import { playUiBeep } from '../audio/umbrellaSound';
import {
  Film,
  Upload,
  Sparkles,
  Play,
  Download,
  AlertCircle,
  RefreshCw,
  Video,
  ExternalLink,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';

interface ImageToVideoStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageToVideoStudio: React.FC<ImageToVideoStudioProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState(
    'Cinematic camera pan across Umbrella Corporation skyscraper during a thunderstorm, red searchlights scanning'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [selectedImage, setSelectedImage] = useState<string | null>('/assets/umbrella/splash_scene.png');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
        setErrorMsg('Wybierz zdjęcie PNG, JPEG lub WebP o rozmiarze do 10 MB.');
        e.target.value = '';
        return;
      }
      setErrorMsg(null);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        playUiBeep(1200, 0.04);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageAsDataUrl = async (image: string): Promise<string> => {
    if (image.startsWith('data:')) return image;
    const response = await fetch(image);
    if (!response.ok) throw new Error('Nie udało się wczytać zdjęcia referencyjnego.');
    const blob = await response.blob();
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(blob.type) || blob.size > 10 * 1024 * 1024) {
      throw new Error('Zdjęcie musi być w formacie PNG, JPEG lub WebP i mieć maksymalnie 10 MB.');
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Nie udało się odczytać zdjęcia.'));
      reader.onerror = () => reject(new Error('Nie udało się odczytać zdjęcia.'));
      reader.readAsDataURL(blob);
    });
  };

  const responseError = async (response: Response) => {
    try {
      const data = await response.json();
      return typeof data.error === 'string' ? data.error : `Żądanie nie powiodło się (HTTP ${response.status}).`;
    } catch {
      return `Żądanie nie powiodło się (HTTP ${response.status}).`;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Wpisz opis sceny przed rozpoczęciem generowania.');
      return;
    }
    if (!selectedImage) {
      setErrorMsg('Wybierz lub wgraj zdjęcie referencyjne.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedVideoUrl(null);
    playUiBeep(1400, 0.05);

    const stages = [
      'Initializing Veo 3.1 Fast Generate Preview Engine...',
      'Synthesizing temporal latent frames from reference image...',
      'Calculating camera velocity and fluid dynamics...',
      'Rendering cinematic lighting and red neon dispersion...',
      'Finalizing high-definition MP4 stream...'
    ];

    let stageIdx = 0;
    setProgressText(stages[0]);
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setProgressText(stages[stageIdx]);
      }
    }, 1800);

    try {
      const imageData = await imageAsDataUrl(selectedImage);
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          imageData
        })
      });

      clearInterval(interval);

      if (!res.ok) throw new Error(await responseError(res));
      const data = await res.json();
      if (!data.operationName) throw new Error('Serwer nie zwrócił identyfikatora generowania.');
      setProgressText('Trwa renderowanie klatek wideo...');
      await pollVideoOperation(data.operationName);
    } catch (e) {
      clearInterval(interval);
      setErrorMsg(e instanceof Error ? e.message : 'Nie udało się wygenerować wideo.');
      setIsGenerating(false);
      setProgressText('');
      return;
    } finally {
      clearInterval(interval);
    }
  };

  const pollVideoOperation = async (opName: string) => {
    try {
      for (let attempt = 0; attempt < 100; attempt++) {
        const pollRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: opName })
        });
        if (!pollRes.ok) throw new Error(await responseError(pollRes));
        const data = await pollRes.json();
        if (data.done) {
          const downloadUrl = `/api/video-download?operationName=${encodeURIComponent(opName)}`;
          setGeneratedVideoUrl(downloadUrl);
          setIsGenerating(false);
          setProgressText('');
          return;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 3000));
      }
      throw new Error('Generowanie trwa dłużej niż oczekiwano. Sprawdź ponownie później.');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Nie udało się sprawdzić stanu generowania.');
      setIsGenerating(false);
      setProgressText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md font-['Rajdhani'] overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-red-500/50 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.35)] overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-950 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400">
              <Film size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wider text-white flex items-center gap-2">
                <span>IMAGE TO VIDEO GENERATOR (VEO 3.1)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-600 text-white font-bold">
                  LIVE AI TOOL
                </span>
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Przekształcaj zdjęcia w wideo (Model: veo-3.1-fast-generate-preview)
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

        {/* Studio Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Reference Photo Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-red-400" />
                <span>Zdjęcie referencyjne (Starting Image)</span>
              </label>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Upload size={12} />
                <span>Wgraj z dysku</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Image Preview & Preset Thumbnails */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="relative w-44 h-28 rounded-lg overflow-hidden border border-red-500/40 bg-black flex items-center justify-center shrink-0">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Reference"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-mono text-zinc-500">Brak zdjęcia</span>
                )}
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 text-white border border-zinc-700">
                  {aspectRatio}
                </div>
              </div>

              <div className="flex-1 space-y-2 w-full">
                <span className="text-[11px] font-mono text-zinc-400 block">
                  Wybierz próbkę z bazy Umbrella lub wgraj własne zdjęcie:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: 'Umbrella Tower', path: '/assets/umbrella/splash_scene.png' },
                    { label: 'Raccoon City', path: '/assets/umbrella/background.png' },
                    { label: 'Biohazard Badge', path: '/assets/umbrella/app_icon_512.png' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setSelectedImage(preset.path);
                        playUiBeep(1000, 0.03);
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                        selectedImage === preset.path
                          ? 'bg-red-950 border-red-500 text-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Aspect Ratio Toggle (16:9 Landscape vs 9:16 Portrait) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-1.5">
              <Sliders size={14} className="text-red-400" />
              <span>Format wideo (Aspect Ratio)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAspectRatio('16:9');
                  playUiBeep(900, 0.02);
                }}
                className={`py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all ${
                  aspectRatio === '16:9'
                    ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="w-5 h-3 border-2 border-current rounded-xs" />
                <span>16:9 Panoramiczny (Landscape)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAspectRatio('9:16');
                  playUiBeep(900, 0.02);
                }}
                className={`py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="w-3 h-5 border-2 border-current rounded-xs" />
                <span>9:16 Pionowy (Portrait / Shorts / Reels)</span>
              </button>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-red-400" />
              <span>Prompt trajektorii ruchu kamery i animacji</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 p-3 text-xs md:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-red-500 font-sans custom-scrollbar"
              placeholder="Opisz ruch kamery, wiatr, światła lub dynamikę sceny..."
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(239,68,68,0.6)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm font-mono border border-red-400 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                <span>GENEROWANIE WIDEO W TOKU...</span>
              </>
            ) : (
              <>
                <Video size={18} />
                <span>WYGENERUJ WIDEO (VEO 3.1 FAST PREVIEW)</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div role="alert" className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          {/* Progress Banner */}
          {isGenerating && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-3 animate-pulse">
              <UmbrellaLogo size={32} animationState="rotate" showGlow={true} />
              <div className="flex-1">
                <div className="text-xs font-mono text-red-400 font-bold uppercase">
                  RADAR VIDEO SYNTHESIS PIPELINE
                </div>
                <div className="text-xs font-sans text-white mt-0.5">
                  {progressText || 'Trwa renderowanie klatek wideo...'}
                </div>
              </div>
            </div>
          )}

          {/* Output Video Player */}
          {generatedVideoUrl && (
            <div className="p-4 rounded-xl bg-black border border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.3)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                  <Play size={14} />
                  <span>Wideo wygenerowane pomyślnie</span>
                </span>
                <a
                  href={generatedVideoUrl}
                  download="umbrella-veo-video.mp4"
                  className="px-3 py-1 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Download size={12} />
                  <span>Pobierz MP4</span>
                </a>
              </div>

              <div className="relative rounded-lg overflow-hidden bg-zinc-950 flex items-center justify-center border border-zinc-800">
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  onError={() => {
                    setGeneratedVideoUrl(null);
                    setErrorMsg('Nie udało się odtworzyć wygenerowanego pliku wideo.');
                  }}
                  className={`max-h-72 object-contain ${aspectRatio === '9:16' ? 'w-48' : 'w-full'}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
