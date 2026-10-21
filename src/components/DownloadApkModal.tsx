import React, { useState } from 'react';
import { playUiBeep } from '../audio/umbrellaSound';
import { Download, FileCode, Github, CheckCircle2, RefreshCw, FolderArchive, X } from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  const [isBundling, setIsBundling] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadSource = async () => {
    setIsBundling(true);
    setErrorMessage(null);
    playUiBeep(1300, 0.05);

    try {
      const response = await fetch('/api/download-zip');
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(typeof data?.error === 'string' ? data.error : `Download failed (HTTP ${response.status}).`);
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'free-api-radar-source.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setDownloadSuccess(true);
      playUiBeep(1600, 0.08);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not create the source archive.');
    } finally {
      setIsBundling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-['Rajdhani']">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-red-500/50 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.35)] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-950 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400">
              <FolderArchive size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wider text-white">PAKIET ŹRÓDŁOWY + GITHUB ACTIONS</h3>
              <p className="text-xs font-mono text-zinc-400">Pobierz kod aplikacji i workflow budujący webową dystrybucję</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Zamknij"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 font-sans text-xs text-zinc-300">
            <div className="flex items-center gap-2 text-white font-bold font-mono text-xs">
              <Github size={16} className="text-red-400" />
              <span>Archiwum zawiera pełne źródła aplikacji:</span>
            </div>
            <ul className="space-y-2 font-mono text-[11px] text-zinc-400">
              <li className="flex items-center gap-2"><FileCode size={13} className="text-emerald-400 shrink-0" /><span>React/Vite UI, serwer API i grafiki</span></li>
              <li className="flex items-center gap-2"><FileCode size={13} className="text-emerald-400 shrink-0" /><span>npm lockfile, konfiguracja i testy serwera</span></li>
              <li className="flex items-center gap-2"><FileCode size={13} className="text-emerald-400 shrink-0" /><span>GitHub Actions: lint, build i artefakt web dist</span></li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/40 text-xs text-amber-200">
            To archiwum zawiera kod źródłowy, a nie plik APK. APK wymaga osobnego zbudowania natywnego projektu Androida.
          </div>

          {errorMessage && <div role="alert" className="text-sm text-red-300">{errorMessage}</div>}

          <button
            onClick={handleDownloadSource}
            disabled={isBundling}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(239,68,68,0.7)] transition-all flex items-center justify-center gap-2.5 text-sm font-mono border border-red-400 disabled:opacity-50"
          >
            {isBundling ? <><RefreshCw className="animate-spin" size={18} /><span>PAKOWANIE ŹRÓDEŁ...</span></>
              : downloadSuccess ? <><CheckCircle2 size={18} className="text-emerald-400" /><span>POBRANO ARCHIWUM</span></>
                : <><Download size={18} /><span>POBIERZ ŹRÓDŁA (ZIP)</span></>}
          </button>

          <p className="text-[11px] font-mono text-zinc-500 text-center">
            Po wypchnięciu kodu do GitHuba workflow buduje i publikuje webową dystrybucję jako artefakt Actions.
          </p>
        </div>
      </div>
    </div>
  );
};
