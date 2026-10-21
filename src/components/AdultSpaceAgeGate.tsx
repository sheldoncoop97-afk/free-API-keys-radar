import React, { useState } from 'react';
import { UmbrellaLogo } from './UmbrellaLogo';
import { playRedAlertSound, playUiBeep } from '../audio/umbrellaSound';
import { ShieldAlert, Lock, AlertTriangle, ArrowLeft, Check } from 'lucide-react';

interface AdultSpaceAgeGateProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdultSpaceAgeGate: React.FC<AdultSpaceAgeGateProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  const [scanning, setScanning] = useState(false);

  if (!isOpen) return null;

  const handleVerify = () => {
    setScanning(true);
    playRedAlertSound();
    setTimeout(() => {
      setScanning(false);
      playUiBeep(1500, 0.08);
      onConfirm();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl font-['Rajdhani']">
      <div className="relative w-full max-w-lg bg-zinc-950 border-2 border-red-600 rounded-2xl shadow-[0_0_60px_rgba(220,38,38,0.5)] overflow-hidden">
        {/* Red Warning Hazard Stripes Header */}
        <div
          className="h-3 w-full"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #dc2626, #dc2626 12px, #09090b 12px, #09090b 24px)'
          }}
        />

        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute -inset-4 bg-red-600/30 rounded-full blur-xl animate-pulse" />
            <UmbrellaLogo size={80} animationState="pulse" showGlow={true} />
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-red-600 border border-white text-white">
              <ShieldAlert size={18} />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-mono font-bold tracking-widest mb-3">
            <AlertTriangle size={14} />
            <span>POTWIERDZENIE PEŁNOLETNOŚCI WYMAGANE (18+)</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-wider text-white">
            DRUGA PRZESTRZEŃ: API DLA DOROSŁYCH
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-2 max-w-sm leading-relaxed">
            Oddzielna strefa API przeznaczona dla osób pełnoletnich. Przed wejściem wymagamy potwierdzenia ukończenia 18 lat.
          </p>

          <div className="w-full my-5 p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-left font-mono text-xs text-red-200/90 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <Lock size={14} />
              <span>POTWIERDZENIE WIEKU:</span>
            </div>
            <p className="text-[11px] leading-normal text-zinc-300">
              Ta aplikacja zapisuje wyłącznie Twoje samodzielne potwierdzenie — nie weryfikuje dokumentu ani tożsamości. Przechodząc dalej, oświadczasz, że masz ukończone 18 lat.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <button
              onClick={handleVerify}
              disabled={scanning}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(239,68,68,0.7)] transition-all flex items-center justify-center gap-2 border border-red-400 disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <ShieldAlert className="animate-pulse text-white" size={20} />
                  <span>ZAPISYWANIE POTWIERDZENIA...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>POTWIERDZAM, ŻE MAM UKOŃCZONE 18 LAT</span>
                </>
              )}
            </button>

            <button
              onClick={onCancel}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-mono flex items-center justify-center gap-2 border border-zinc-800"
            >
              <ArrowLeft size={14} />
              <span>POWRÓT DO PUBLICZNEGO RADARU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
