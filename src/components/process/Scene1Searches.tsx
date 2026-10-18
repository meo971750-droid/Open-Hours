import React from 'react';
import { Search, MapPin, Globe, Phone, ExternalLink, HelpCircle } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene1Searches({ progress, isMobile, palette }: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';
  const sampleTrade = config.wayOfWorking.sampleTrade || 'roofers';

  // Autoplay Timeline Stages (0.0 to 1.0)
  // 1: Streets draw: 0.05 - 0.25
  // 2: Search bar types: 0.20 - 0.42
  // 3: 3 Competitor pins drop & cards slide in: 0.38 - 0.62
  // 4: People dots travel to competitors: 0.55 - 0.76
  // 5: "Your business" appears in list & map: 0.70 - 0.85
  // 6: Hesitating dot veers off: 0.82 - 0.93 -> Hold 0.93 - 1.0

  const streetsProgress = Math.min(1, Math.max(0, (progress - 0.05) / 0.20));
  const searchProgress = Math.min(1, Math.max(0, (progress - 0.20) / 0.22));
  const competitorsProgress = Math.min(1, Math.max(0, (progress - 0.38) / 0.24));
  const dotsProgress = Math.min(1, Math.max(0, (progress - 0.55) / 0.21));
  const yourBizProgress = Math.min(1, Math.max(0, (progress - 0.70) / 0.15));
  const veerProgress = Math.min(1, Math.max(0, (progress - 0.82) / 0.11));

  const searchText = `${sampleTrade} in ${sampleTown}`;
  const typedCount = Math.floor(searchProgress * searchText.length);
  const currentTypedText = searchText.slice(0, typedCount);

  const competitors = [
    { name: 'Sample Roofing Co. A', rating: '5.0 (24)', x: 480, y: 180, tag: 'Roofing contractor' },
    { name: 'Sample Roofing Co. B', rating: '4.9 (19)', x: 620, y: 270, tag: 'Roofing & guttering' },
    { name: 'Sample Roofing Co. C', rating: '4.8 (15)', x: 530, y: 390, tag: 'Specialist roofer' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Illustrative tag */}
      <div className="absolute top-2 right-4 text-[10px] uppercase tracking-wider text-white/40 px-2 py-0.5 rounded bg-black/20 border border-white/10 z-20">
        Illustrative example
      </div>

      {/* Main Visual Stage */}
      <div className="relative w-full max-w-6xl mx-auto flex-1 flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-2">
        {/* Left Side: Search Bar + Results List */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col gap-2.5 z-10 shrink-0">
          {/* Simulated Google Maps Search Bar */}
          <div
            style={{
              opacity: Math.min(1, searchProgress * 2),
              transform: `translateY(${(1 - Math.min(1, searchProgress * 2)) * 12}px)`,
            }}
            className="w-full bg-white text-[#1B2B34] rounded-2xl px-3.5 py-2.5 shadow-lg flex items-center gap-2.5 border border-white/20 transition-all duration-300"
          >
            <Search className="w-4 h-4 text-[#2A5A6B] shrink-0" />
            <div className="flex-1 text-xs sm:text-sm font-medium tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
              <span>{currentTypedText}</span>
              {searchProgress < 1 && (
                <span className="inline-block w-1.5 h-3.5 bg-[#2A5A6B] ml-0.5 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-semibold text-white bg-[#2A5A6B] px-2 py-0.5 rounded-full">
              Maps
            </span>
          </div>

          {/* Cards List */}
          <div className="flex flex-col gap-2">
            {competitors.map((comp, idx) => {
              const cardReveal = Math.min(1, Math.max(0, (competitorsProgress - idx * 0.28) / 0.4));
              if (cardReveal <= 0) return null;
              return (
                <div
                  key={comp.name}
                  style={{
                    opacity: cardReveal,
                    transform: `translateX(${(1 - cardReveal) * -20}px)`,
                  }}
                  className="bg-white/95 backdrop-blur-sm text-[#1B2B34] rounded-xl p-2.5 sm:p-3 shadow-md border border-white/20 flex items-center justify-between gap-2 transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#2A5A6B]/15 text-[#2A5A6B] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate text-[#0B1B2B]">{comp.name}</p>
                      <p className="text-[11px] text-emerald-600 font-medium">★ {comp.rating}</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="px-2 py-1 bg-[#12303D] text-white text-[10px] font-medium rounded-md flex items-center gap-1 shadow-sm">
                      <Globe className="w-3 h-3 text-[#F4B860]" />
                      Website
                    </span>
                  </div>
                </div>
              );
            })}

            {/* "Your business" Card */}
            {yourBizProgress > 0 && (
              <div
                style={{
                  opacity: yourBizProgress,
                  transform: `translateX(${(1 - yourBizProgress) * -20}px)`,
                }}
                className="relative bg-[#1A3342] text-white rounded-xl p-2.5 sm:p-3 shadow-md border-2 border-dashed border-[#E5484D]/70 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-white/50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-[#F4B860] truncate">Your business</p>
                        <span className="text-[9px] bg-white/10 text-white/70 px-1.5 py-0.5 rounded">Phone only</span>
                      </div>
                      <p className="text-[11px] text-white/50 font-normal">No customer reviews yet</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="px-2 py-1 bg-[#E5484D]/20 text-[#FF8585] border border-[#E5484D]/40 text-[10px] font-semibold rounded-md flex items-center gap-1">
                      No website link
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Map Canvas with Street Vector & Traveling People */}
        <div className="relative flex-1 w-full h-[260px] sm:h-[320px] md:h-[380px] bg-[#0E2333]/80 rounded-3xl border border-[#2A5A6B]/40 overflow-hidden shadow-2xl flex items-center justify-center">
          <svg
            className="w-full h-full"
            viewBox="0 0 800 480"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid & Street Network */}
            <g stroke="#2A5A6B" strokeWidth="2" strokeOpacity={0.4 + streetsProgress * 0.4} fill="none">
              <path
                d="M 50 120 Q 250 80, 480 180 T 750 200"
                strokeDasharray="900"
                strokeDashoffset={(1 - streetsProgress) * 900}
              />
              <path
                d="M 80 380 Q 300 320, 530 390 T 760 360"
                strokeDasharray="900"
                strokeDashoffset={(1 - streetsProgress) * 900}
              />
              <path
                d="M 280 40 Q 360 220, 620 270 T 720 460"
                strokeDasharray="800"
                strokeDashoffset={(1 - streetsProgress) * 800}
              />
              <path
                d="M 160 450 Q 280 260, 450 120"
                strokeDasharray="600"
                strokeDashoffset={(1 - streetsProgress) * 600}
              />
            </g>

            {/* Competitor Pins & Pulse Rings */}
            {competitors.map((comp, idx) => {
              const pinReveal = Math.min(1, Math.max(0, (competitorsProgress - idx * 0.28) / 0.4));
              if (pinReveal <= 0) return null;
              const hasArrived = dotsProgress > 0.4 + idx * 0.2;
              return (
                <g key={comp.name} transform={`translate(${comp.x}, ${comp.y})`}>
                  {hasArrived && (
                    <circle r="22" fill="#F4B860" opacity="0.2" className="animate-ping" />
                  )}
                  <circle r="14" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
                  <circle r="7" fill="#2A5A6B" />
                  <text
                    y="-20"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="600"
                    opacity={pinReveal}
                  >
                    {comp.name}
                  </text>
                </g>
              );
            })}

            {/* People Dots travelling from left to competitors */}
            {dotsProgress > 0 && (
              <g>
                {/* Person 1 -> Comp A */}
                <circle
                  cx={80 + dotsProgress * (480 - 80)}
                  cy={120 + Math.sin(dotsProgress * Math.PI) * -30 + dotsProgress * (180 - 120)}
                  r="6"
                  fill="#F4B860"
                  filter="drop-shadow(0 0 6px #F4B860)"
                />
                {/* Person 2 -> Comp B */}
                {dotsProgress > 0.2 && (
                  <circle
                    cx={60 + (dotsProgress - 0.2) * 1.25 * (620 - 60)}
                    cy={240 + Math.sin((dotsProgress - 0.2) * Math.PI) * 40 + (dotsProgress - 0.2) * 1.25 * (270 - 240)}
                    r="6"
                    fill="#F4B860"
                    filter="drop-shadow(0 0 6px #F4B860)"
                  />
                )}
                {/* Person 3 -> Comp C */}
                {dotsProgress > 0.35 && (
                  <circle
                    cx={100 + (dotsProgress - 0.35) * 1.5 * (530 - 100)}
                    cy={380 + Math.sin((dotsProgress - 0.35) * Math.PI) * -20 + (dotsProgress - 0.35) * 1.5 * (390 - 380)}
                    r="6"
                    fill="#F4B860"
                    filter="drop-shadow(0 0 6px #F4B860)"
                  />
                )}
              </g>
            )}

            {/* "Your Business" Map Pin (Hollow & Grey) */}
            {yourBizProgress > 0 && (
              <g transform="translate(320, 310)">
                <circle r="14" fill="#1A3342" stroke="#E5484D" strokeWidth="2.5" strokeDasharray="4 2" />
                <circle r="5" fill="#718096" />
                <text
                  y="-20"
                  textAnchor="middle"
                  fill="#F4B860"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Your business
                </text>
                <text
                  y="28"
                  textAnchor="middle"
                  fill="#FF8585"
                  fontSize="10"
                  fontWeight="500"
                >
                  (No website link)
                </text>
              </g>
            )}

            {/* Last Person Dot approaching Your Business, hesitating, then veering to Comp B */}
            {veerProgress > 0 && (
              <g>
                {/* Before 0.5: moves towards Your Business (320, 310). After 0.5: veers to Comp B (620, 270) */}
                {veerProgress <= 0.5 ? (
                  <g>
                    <circle
                      cx={140 + (veerProgress / 0.5) * (280 - 140)}
                      cy={310 + Math.sin((veerProgress / 0.5) * Math.PI) * -15}
                      r="6.5"
                      fill="#F4B860"
                      filter="drop-shadow(0 0 8px #F4B860)"
                    />
                    {veerProgress > 0.35 && (
                      <g transform={`translate(${140 + (veerProgress / 0.5) * (280 - 140)}, ${290})`}>
                        <rect x="-10" y="-18" width="20" height="15" rx="4" fill="#E5484D" />
                        <text x="0" y="-7" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">?</text>
                      </g>
                    )}
                  </g>
                ) : (
                  <g>
                    <circle
                      cx={280 + ((veerProgress - 0.5) / 0.5) * (620 - 280)}
                      cy={310 + ((veerProgress - 0.5) / 0.5) * (270 - 310) + Math.sin(((veerProgress - 0.5) / 0.5) * Math.PI) * -35}
                      r="6.5"
                      fill="#F4B860"
                      filter="drop-shadow(0 0 8px #F4B860)"
                    />
                    <g transform={`translate(${280 + ((veerProgress - 0.5) / 0.5) * (620 - 280)}, ${275})`}>
                      <rect x="-35" y="-18" width="70" height="16" rx="4" fill="#12303D" stroke="#FFFFFF" strokeWidth="0.5" />
                      <text x="0" y="-6" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="500">Choosing Co. B</text>
                    </g>
                  </g>
                )}
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
