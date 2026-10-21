import React from 'react';
import { IconAnimationState } from '../types/radar';

interface UmbrellaLogoProps {
  size?: number;
  className?: string;
  animationState?: IconAnimationState;
  showGlow?: boolean;
  onClick?: () => void;
}

export const UmbrellaLogo: React.FC<UmbrellaLogoProps> = ({
  size = 48,
  className = '',
  animationState = 'idle',
  showGlow = true,
  onClick
}) => {
  // 8 segments alternating Red and White
  // Center is (100, 100), Radius is 85
  const center = 100;
  const radius = 88;
  const numSegments = 8;
  const angleStep = (2 * Math.PI) / numSegments;

  // Colors: 4 Red, 4 White/Silver
  // Segment 0: Top-Right (Red)
  const segments = Array.from({ length: numSegments }).map((_, i) => {
    const startAngle = i * angleStep - Math.PI / 2;
    const endAngle = (i + 1) * angleStep - Math.PI / 2;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const isRed = i % 2 === 0;
    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

    return {
      index: i,
      path,
      isRed,
      color: isRed ? 'url(#umbrellaRedGradient)' : 'url(#umbrellaWhiteGradient)',
      stroke: isRed ? '#7f1d1d' : '#94a3b8'
    };
  });

  const getAnimationClass = () => {
    switch (animationState) {
      case 'pulse':
        return 'animate-pulse drop-shadow-[0_0_24px_rgba(239,68,68,0.9)]';
      case 'rotate':
        return 'animate-spin [animation-duration:6s] drop-shadow-[0_0_18px_rgba(239,68,68,0.7)]';
      case 'flare':
        return 'brightness-150 contrast-125 drop-shadow-[0_0_32px_rgba(255,255,255,1)] transition-all duration-300';
      case 'ready':
        return 'drop-shadow-[0_0_15px_rgba(220,38,38,0.7)] scale-105 transition-transform';
      case 'idle':
      default:
        return 'hover:drop-shadow-[0_0_16px_rgba(239,68,68,0.6)] transition-all';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${getAnimationClass()} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Metallic Outer Ring */}
          <radialGradient id="umbrellaRingGradient" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#27272a" />
            <stop offset="85%" stopColor="#71717a" />
            <stop offset="94%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#3f3f46" />
          </radialGradient>

          {/* Deep Blood Crimson Red Gradient */}
          <radialGradient id="umbrellaRedGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#b91c1c" />
            <stop offset="95%" stopColor="#450a0a" />
            <stop offset="100%" stopColor="#1a0404" />
          </radialGradient>

          {/* Chrome / Pearl Silver White Gradient */}
          <radialGradient id="umbrellaWhiteGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="90%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </radialGradient>

          {/* Bevel Glow Filter */}
          <filter id="umbrellaBevelGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feOffset in="blur" dx="2" dy="2" result="offset" />
            <feComponentTransfer in="offset" result="shadow">
              <feFuncA type="linear" slope="0.6" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Dark Octagon / Circular Bezel */}
        <circle
          cx="100"
          cy="100"
          r="96"
          fill="url(#umbrellaRingGradient)"
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeOpacity={showGlow ? "0.8" : "0.3"}
        />

        {/* Rivets / Bolts around border */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const bx = 100 + 92 * Math.cos(rad);
          const by = 100 + 92 * Math.sin(rad);
          return (
            <circle
              key={i}
              cx={bx}
              cy={by}
              r="2"
              fill="#cbd5e1"
              stroke="#09090b"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Inner Shadow Circle */}
        <circle cx="100" cy="100" r="88" fill="#09090b" />

        {/* The 8 Alternating Segments */}
        <g filter="url(#umbrellaBevelGlow)">
          {segments.map((seg) => (
            <path
              key={seg.index}
              d={seg.path}
              fill={seg.color}
              stroke={seg.stroke}
              strokeWidth="1.5"
              className="transition-colors duration-200"
            />
          ))}
        </g>

        {/* Metallic Center Pivot Ring */}
        <circle cx="100" cy="100" r="14" fill="#18181b" stroke="#71717a" strokeWidth="2" />
        <circle cx="100" cy="100" r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
        <circle cx="100" cy="100" r="3" fill="#ffffff" />
      </svg>
    </div>
  );
};
