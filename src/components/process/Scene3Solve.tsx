import React from 'react';
import { Search, MousePointer, Globe, PhoneCall, CheckCircle2, Check } from 'lucide-react';
import { SceneProps } from './types';
import { getActiveFrictionPairs } from './Scene2Journey';

export { getActiveFrictionPairs };

export default function Scene3Solve({
  progress,
  stepIndex,
  stepProgress,
  activeHighlight,
  isMobile,
  palette,
}: SceneProps) {
  const activePairs = getActiveFrictionPairs();

  const nodes = [
    {
      id: 'search',
      numeral: '1',
      title: 'Search',
      desc: 'Local discovery',
      icon: Search,
      x: 100,
      y: 165,
      isTop: false,
      pairHighlight: 'fix-website',
      fix: 'A clear website with one next step',
    },
    {
      id: 'click',
      numeral: '2',
      title: 'Click',
      desc: 'Mobile-first design',
      icon: MousePointer,
      x: 310,
      y: 100,
      isTop: true,
      pairHighlight: 'fix-mobile',
      fix: 'Call & quote buttons on every page',
    },
    {
      id: 'website',
      numeral: '3',
      title: 'Website',
      desc: 'Clear next steps',
      icon: Globe,
      x: 520,
      y: 185,
      isTop: false,
      pairHighlight: '',
      fix: '',
    },
    {
      id: 'call',
      numeral: '4',
      title: 'Call or form',
      desc: 'After-hours handling',
      icon: PhoneCall,
      x: 730,
      y: 105,
      isTop: true,
      pairHighlight: 'fix-afterhours',
      fix: 'Missed calls get handled',
    },
    {
      id: 'followup',
      numeral: '5',
      title: 'Follow-up',
      desc: 'Logged & confirmed',
      icon: CheckCircle2,
      x: 940,
      y: 175,
      isTop: false,
      pairHighlight: 'fix-followup',
      fix: 'Every enquiry confirmed & logged',
    },
  ];

  const isFix1Active = stepIndex >= 1;
  const isFix2Active = stepIndex >= 2;
  const isFix3Active = stepIndex >= 3;
  const isFix4Active = stepIndex >= 4;
  const isFinished = stepIndex >= 3 && activeHighlight === 'finish';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none px-2">
      <div className="absolute top-1 right-2 text-[10px] uppercase tracking-wider text-[#143828]/50 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 z-20">
        Illustrative example
      </div>

      <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center py-1">
        <svg className="w-full h-auto max-h-[330px]" viewBox="0 0 1060 330" preserveAspectRatio="xMidYMid meet">
          {/* Base Wavy Journey Line */}
          <path
            d="M 40 165 Q 180 65, 310 100 T 520 185 T 730 105 T 1020 175"
            fill="none"
            stroke="#1E9E6A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* 5 Nodes with Numeral and White Cards */}
          {nodes.map((node) => {
            const isNodeHighlighted = node.pairHighlight === activeHighlight;
            let isFixed = false;
            if (node.pairHighlight === 'fix-website' && isFix1Active) isFixed = true;
            if (node.pairHighlight === 'fix-mobile' && isFix2Active) isFixed = true;
            if (node.pairHighlight === 'fix-afterhours' && isFix3Active) isFixed = true;
            if (node.pairHighlight === 'fix-followup' && isFix4Active) isFixed = true;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                opacity={isNodeHighlighted || activeHighlight === 'intro' || isFinished ? 1 : 0.8}
                style={{ transition: 'opacity 0.3s ease' }}
              >
                {/* Big Faint Numeral */}
                <text
                  x="0"
                  y={node.isTop ? 24 : -18}
                  textAnchor="middle"
                  fill="#D5ECE0"
                  fontSize="64"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  {node.numeral}
                </text>

                {/* Soft glow ring */}
                {isNodeHighlighted && (
                  <circle
                    r="30"
                    fill="none"
                    stroke="#1E9E6A"
                    strokeWidth="2"
                    className="animate-pulse"
                    opacity="0.45"
                  />
                )}

                {/* White Rounded-2xl Card */}
                <g filter="drop-shadow(0 6px 16px rgba(30, 158, 106, 0.12))">
                  <rect
                    x="-23"
                    y="-23"
                    width="46"
                    height="46"
                    rx="16"
                    fill="#FFFFFF"
                    stroke={isFixed ? '#1E9E6A' : '#D5ECE0'}
                    strokeWidth={isFixed ? '2.5' : '1'}
                    className="transition-colors duration-300"
                  />
                  <foreignObject x="-14" y="-14" width="28" height="28">
                    <div className="w-full h-full flex items-center justify-center">
                      <node.icon className={`w-4 h-4 ${isFixed ? 'text-[#1E9E6A]' : 'text-[#C8642E]'}`} />
                    </div>
                  </foreignObject>
                </g>

                {/* Node Title & Description */}
                <g transform={`translate(0, ${node.isTop ? -38 : 38})`}>
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fill="#143828"
                    fontSize="12"
                    fontWeight={isNodeHighlighted ? '800' : '700'}
                  >
                    {node.title}
                  </text>
                  <text
                    x="0"
                    y="14"
                    textAnchor="middle"
                    fill="#143828"
                    opacity={isNodeHighlighted ? 0.9 : 0.65}
                    fontSize="9.5"
                    fontWeight="500"
                  >
                    {node.desc}
                  </text>
                </g>

                {/* Status Indicator / Fix Card */}
                {node.fix && (
                  <g transform={`translate(0, ${node.isTop ? 38 : -40})`}>
                    {isFixed ? (
                      <g filter="drop-shadow(0 4px 10px rgba(30, 158, 106, 0.2))">
                        <rect x="-75" y="-12" width="150" height="24" rx="6" fill="#FFFFFF" stroke="#1E9E6A" strokeWidth="1.2" />
                        <foreignObject x="-70" y="-8" width="16" height="16">
                          <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check className="w-3 h-3 text-[#1E9E6A]" />
                          </div>
                        </foreignObject>
                        <text x="-48" y="4" textAnchor="start" fill="#143828" fontSize="8.5" fontWeight="700">
                          {node.fix}
                        </text>
                      </g>
                    ) : (
                      <g opacity="0.5">
                        <rect x="-55" y="-10" width="110" height="20" rx="5" fill="#D64545" />
                        <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="600">
                          Friction point
                        </text>
                      </g>
                    )}
                  </g>
                )}
              </g>
            );
          })}

          {/* End of line: "Enquiry received" badge */}
          {isFinished && (
            <g transform="translate(940, 115)" filter="drop-shadow(0 6px 14px rgba(30, 158, 106, 0.25))">
              <rect x="-60" y="-14" width="120" height="28" rx="8" fill="#1E9E6A" />
              <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                ✓ Customer reached
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
