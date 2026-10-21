import React, { useState } from 'react';
import { FreeApiItem } from '../types/radar';
import { UmbrellaLogo } from './UmbrellaLogo';
import { playUiBeep } from '../audio/umbrellaSound';
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Key,
  BookOpen,
  Code2,
  Terminal,
  Play,
  Star,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface ApiDetailsModalProps {
  api: FreeApiItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ApiDetailsModal: React.FC<ApiDetailsModalProps> = ({
  api,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite
}) => {
  const [selectedLang, setSelectedLang] = useState<'curl' | 'javascript' | 'python'>('curl');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [testHttpStatus, setTestHttpStatus] = useState<number | null>(null);

  if (!isOpen || !api) return null;

  const handleCopy = (text: string, type: 'snippet' | 'response') => {
    navigator.clipboard.writeText(text);
    playUiBeep(1400, 0.04);
    if (type === 'snippet') {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleLiveTest = async () => {
    setTestStatus('testing');
    playUiBeep(1100, 0.05);

    try {
      // Test via backend proxy or mock
      const res = await fetch('/api/test-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: api.endpointUrl,
          method: api.method || 'GET',
          apiId: api.id
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : `Test failed (HTTP ${res.status}).`);
      setTestHttpStatus(typeof data.status === 'number' ? data.status : null);
      setTestOutput(JSON.stringify(data, null, 2));
      setTestStatus(typeof data.status === 'number' && data.status >= 200 && data.status < 300 ? 'success' : 'error');
    } catch (e) {
      setTestHttpStatus(null);
      setTestOutput(e instanceof Error ? e.message : 'The endpoint could not be reached.');
      setTestStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md font-['Rajdhani'] overflow-y-auto">
      {/* Mobile-sized shell matching Section 3 Details Screen */}
      <div className="relative w-full max-w-lg bg-[#0b0c10] border border-red-500/40 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.3)] overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Bar with Back Arrow */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-[#090a0f]/95 backdrop-blur-md border-b border-red-950/70">
          <button
            onClick={() => {
              playUiBeep(850, 0.04);
              onClose();
            }}
            className="flex items-center gap-2 text-zinc-300 hover:text-white group transition-colors"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform text-red-500" />
            <span className="text-sm font-bold tracking-wider uppercase font-mono">Details</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(api.id)}
              className={`p-2 rounded-lg border transition-all ${
                isFavorite
                  ? 'bg-red-950/80 border-red-500 text-yellow-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={16} className={isFavorite ? "fill-yellow-400" : ""} />
            </button>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          {/* Header Card with Logo and Tags */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-950/70 border border-red-950/80 relative overflow-hidden">
            <div className="relative shrink-0">
              <UmbrellaLogo size={46} animationState="ready" showGlow={true} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-xl font-bold tracking-wide text-white truncate">
                  {api.name}
                </h2>
                {api.isAdult && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-400 border border-red-600/60 font-bold uppercase">
                    18+ RESTRICTED
                  </span>
                )}
              </div>

              {/* Tag Pills matching Section 3 */}
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                {api.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
            {api.shortDescription}
          </p>

          {/* 3 Metric Tiles (Rate Limit, Auth, Docs) matching Section 3 */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Rate Limit */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-center">
              <Clock size={16} className="text-red-400 mb-1" />
              <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Rate Limit
              </span>
              <span className="text-xs font-bold text-white mt-0.5 font-mono">
                {api.rateLimit}
              </span>
            </div>

            {/* Auth */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-center">
              <Key size={16} className="text-red-400 mb-1" />
              <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Auth
              </span>
              <span className="text-xs font-bold text-white mt-0.5 font-mono">
                {api.authType}
              </span>
            </div>

            {/* Docs */}
            <a
              href={api.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playUiBeep(1100, 0.03)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-red-600 transition-colors text-center group cursor-pointer"
            >
              <BookOpen size={16} className="text-red-400 group-hover:text-red-300 mb-1" />
              <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Docs
              </span>
              <span className="text-xs font-bold text-red-400 group-hover:text-red-300 mt-0.5 font-mono flex items-center gap-1">
                <span>View</span>
                <ExternalLink size={10} />
              </span>
            </a>
          </div>

          {/* Official provider page where developers can sign up and create a key. */}
          <a
            href={api.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playUiBeep(1200, 0.05)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(239,68,68,0.7)] active:scale-98 transition-all flex items-center justify-center gap-2 text-sm font-mono border border-red-400 cursor-pointer text-center"
          >
            <span>Oficjalna strona dostawcy / uzyskaj klucz</span>
            <ExternalLink size={16} />
          </a>
          <p className="text-[11px] text-zinc-500 font-sans text-center -mt-3">
            Otwiera publiczną stronę dostawcy. W szczegółach poniżej znajdziesz instrukcję i dokumentację.
          </p>

          {/* Interactive Live Playground / Tester */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-red-950/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal size={14} className="text-red-400" />
                <span>Live API Radar Test</span>
              </span>

              <button
                onClick={handleLiveTest}
                disabled={testStatus === 'testing'}
                className="px-3 py-1 rounded bg-red-900/40 hover:bg-red-800 text-red-200 border border-red-500/40 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <Play size={12} className={testStatus === 'testing' ? 'animate-spin' : ''} />
                <span>{testStatus === 'testing' ? 'Testing...' : 'Send Test Ping'}</span>
              </button>
            </div>

            {testOutput && (
            <div className={`mt-2 text-[11px] font-mono bg-zinc-950 p-2.5 rounded border max-h-36 overflow-y-auto ${
              testStatus === 'success' ? 'border-emerald-900/50 text-emerald-400' : 'border-red-900/50 text-red-300'
            }`}>
              <div className="text-[10px] text-zinc-500 mb-1">
                {testHttpStatus === null ? '// Endpoint probe failed' : `// HTTP ${testHttpStatus} ${testStatus === 'success' ? 'OK' : 'response received'}`}
              </div>
              <pre>{testOutput}</pre>
            </div>
            )}
          </div>

          {/* Response Example Section (Direct Match to Section 3) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Response Example
              </span>
              <button
                onClick={() => handleCopy(JSON.stringify(api.responseExample, null, 2), 'response')}
                className="text-[11px] font-mono text-red-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedResponse ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedResponse ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            {/* Dark Code Container matching Section 3 with syntax highlighting */}
            <div className="relative rounded-xl bg-[#07080a] border border-zinc-800/80 p-4 font-mono text-[11px] text-zinc-300 overflow-x-auto shadow-inner">
              <pre className="text-emerald-400/90 whitespace-pre leading-relaxed">
                {JSON.stringify(api.responseExample, null, 2)}
              </pre>
            </div>
          </div>

          {/* Code Snippets Section (cURL / JS / Python) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
                {(['curl', 'javascript', 'python'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      playUiBeep(900, 0.02);
                      setSelectedLang(lang);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-all ${
                      selectedLang === lang
                        ? 'bg-red-600 text-white font-bold shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleCopy(api.codeSnippets[selectedLang], 'snippet')}
                className="text-[11px] font-mono text-red-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedSnippet ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedSnippet ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>

            <div className="rounded-xl bg-[#07080a] border border-zinc-800/80 p-4 font-mono text-[11px] text-amber-200/90 overflow-x-auto">
              <pre className="whitespace-pre leading-relaxed">
                {api.codeSnippets[selectedLang]}
              </pre>
            </div>
          </div>

          {/* How to get free key in 30 seconds */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-red-400" />
              <span>Instrukcja zdobycia darmowego dostępu</span>
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-400 font-sans">
              {api.keySteps.map((step, idx) => (
                <li key={idx} className="leading-snug">
                  <span className="text-zinc-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
