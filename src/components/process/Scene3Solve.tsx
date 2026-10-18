import React from 'react';
import { Search, MousePointer, Globe, PhoneCall, CheckCircle2, Home, Sparkles, Check } from 'lucide-react';
import { SceneProps } from './types';
import { getActiveFrictionPairs } from './Scene2Journey';

export { getActiveFrictionPairs };

export default function Scene3Solve({ progress, isMobile, palette }: SceneProps) {
  // Timeline (0.0 to 1.0)
  // 0.00 - 0.20: Initial state with red markers in place
  // 0.20 - 0.70: Fixes land one by one from left to right:
  //              Red markers dissolve -> emerald checkmarks, white fix cards slide in,
  //              dashed segments turn solid emerald #1E9E6A
  // 0.70 - 0.88: Homeowner dot travels smoothly all the way to Node 5 (Enquiry received)
  // 0.88 - 1.00: Calm label "From search to enquiry, with fewer drop-offs." Hold 2s

  const fixesProgress = Math.min(1, Math.max(0, (progress - 0.18) / 0.50));
  const finalTravelProgress = Math.min(1, Math.max(0, (progress - 0.68) / 0.20));
  const summaryProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.12));

  const activePairs = getActiveFrictionPairs();
  const pairsCount = activePairs.length;

  const nodes = [
    {
      id: 'search',
      numeral: '1',
      title: 'Search',
      desc: 'Local discovery',
      icon: Search,
      x: 120,
      y: 200,
      isTop: false,
      pairIdx: activePairs.findIndex((p) => p.nodeId === 'search'),
    },
    {
      id: 'click',
      numeral: '2',
      title: 'Click',
      desc: 'Mobile-first design',
      icon: MousePointer,
      x: 360,
      y: 120,
      isTop: true,
      pairIdx: activePairs.findIndex((p) => p.nodeId === 'click'),
    },
    {
      id: 'website',
      numeral: '3',
      title: 'Website',
      desc: 'Clear next steps',
      icon: Globe,
      x: 600,
      y: 240,
      isTop: false,
      pairIdx: -1,
    },
    {
      id: 'call',
      numeral: '4',
      title: 'Call or form',
      desc: 'Fast contact options',
      icon: PhoneCall,
      x: 840,
      y: 130,
      isTop: true,
      pairIdx: activePairs.findIndex((p) => p.nodeId === 'call'),
    },
    {
      id: 'followup',
      numeral: '5',
      title: 'Follow-up',
      desc: 'Logged & confirmed',
      icon: CheckCircle2,
      x: 1080,
      y: 220,
      isTop: false,
      pairIdx: activePairs.findIndex((p) => p.nodeId === 'followup'),
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      <div className="absolute top-2 right-4 text-[10px] uppercase tracking-wider text-[#143828]/50 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 z-20">
        Illustrative example
      </div>

      <div className="relative w-full max-w-6xl mx-auto flex-1 flex flex-col items-center justify-center px-4 py-2">
        <svg
          className="w-full h-auto max-h-[460px]"
          viewBox="0 0 1200 420"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Base Wavy Journey Line */}
          <path
            d="M 60 210 Q 240 70, 360 120 T 600 240 T 840 130 T 1140 230"
            fill="none"
            stroke="#1E9E6A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* 5 Nodes with Numeral, White Cards, and Emerald Fix Cards */}
          {nodes.map((node) => {
            const pair = node.pairIdx >= 0 ? activePairs[node.pairIdx] : null;
            const fixReveal = pair
              ? Math.min(1, Math.max(0, (fixesProgress - node.pairIdx / pairsCount) * pairsCount))
              : 1;

            const isFixed = fixReveal >= 0.8;

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                {/* Big Faint Numeral */}
                <text
                  x="0"
                  y={node.isTop ? 28 : -22}
                  textAnchor="middle"
                  fill="#D5ECE0"
                  fontSize="76"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  {node.numeral}
                </text>

                {/* White Rounded-2xl Card */}
                <g filter="drop-shadow(0 8px 20px rgba(30, 158, 106, 0.12))">
                  <rect
                    x="-26"
                    y="-26"
                    width="52"
                    height="52"
                    rx="18"
                    fill="#FFFFFF"
                    stroke={isFixed ? '#1E9E6A' : '#D64545'}
                    strokeWidth="2"
                    className="transition-colors duration-500"
                  />
                  <foreignObject x="-16" y="-16" width="32" height="32">
                    <div className="w-full h-full flex items-center justify-center">
                      <node.icon className={`w-5 h-5 ${isFixed ? 'text-[#1E9E6A]' : 'text-[#C8642E]'}`} />
                    </div>
                  </foreignObject>
                </g>

                {/* Node Title & Description */}
                <g transform={`translate(0, ${node.isTop ? -45 : 48})`}>
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fill="#143828"
                    fontSize="13"
                    fontWeight="700"
                  >
                    {node.title}
                  </text>
                  <text
                    x="0"
                    y="16"
                    textAnchor="middle"
                    fill="#143828"
                    opacity="0.65"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {node.desc}
                  </text>
                </g>

                {/* Status Indicator / Fix Card */}
                {pair && (
                  <g transform={`translate(0, ${node.isTop ? 44 : -50})`}>
                    {!isFixed ? (
                      /* Red Problem Chip */
                      <g opacity={1 - fixReveal * 1.5}>
                        <rect
                          x="-65"
                          y="-12"
                          width="130"
                          height="24"
                          rx="6"
                          fill="#D64545"
                          filter="drop-shadow(0 3px 8px rgba(214, 69, 69, 0.25))"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="9.5"
                          fontWeight="700"
                        >
                          {pair.problem}
                        </text>
                      </g>
                    ) : (
                      /* Emerald Fix Card with Checkmark & Soft Shadow */
                      <g
                        opacity={fixReveal}
                        transform={`translate(0, ${(1 - fixReveal) * 8})`}
                        filter="drop-shadow(0 6px 14px rgba(30, 158, 106, 0.2))"
                      >
                        <rect
                          x="-85"
                          y="-14"
                          width="170"
                          height="28"
                          rx="8"
                          fill="#FFFFFF"
                          stroke="#1E9E6A"
                          strokeWidth="1.5"
                        />
                        <foreignObject x="-78" y="-10" width="20" height="20">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-[#1E9E6A]" />
                          </div>
                        </foreignObject>
                        <text
                          x="-50"
                          y="4"
                          textAnchor="start"
                          fill="#143828"
                          fontSize="9.5"
                          fontWeight="700"
                        >
                          {pair.fix}
                        </text>
                      </g>
                    )}
                  </g>
                )}
              </g>
            );
          })}

          {/* Smooth Travel of Homeowner Dot along the solid green journey line */}
          {finalTravelProgress > 0 && (
            <g
              transform={`translate(${120 + finalTravelProgress * (1080 - 120)}, ${
                200 + Math.sin(finalTravelProgress * Math.PI * 3.5) * -50
              })`}
            >
              <circle r="16" fill="#1E9E6A" opacity="0.25" className="animate-ping" />
              <circle r="8" fill="#1E9E6A" stroke="#FFFFFF" strokeWidth="2.5" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.15))" />
            </g>
          )}

          {/* End of line: "Enquiry received" badge */}
          {finalTravelProgress > 0.85 && (
            <g transform="translate(1120, 160)" filter="drop-shadow(0 8px 18px rgba(30, 158, 106, 0.25))">
              <rect x="-65" y="-16" width="130" height="32" rx="10" fill="#1E9E6A" />
              <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                ✓ Enquiry received
              </text>
            </g>
          )}
        </svg>

        {/* Calm Summary Label */}
        {summaryProgress > 0 && (
          <div
            style={{
              opacity: summaryProgress,
              transform: `translateY(${(1 - summaryProgress) * 10}px)`,
            }}
            className="mt-3 px-4 py-1.5 rounded-full bg-white text-[#143828] border border-emerald-500/30 shadow-md text-xs sm:text-sm font-semibold tracking-tight transition-all duration-300 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#1E9E6A]" />
            From search to enquiry, with fewer drop-offs.
          </div>
        )}
      </div>
    </div>
  );
}
