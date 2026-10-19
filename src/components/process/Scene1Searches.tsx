import React from 'react';
import { Search, MapPin, Globe, Phone, ExternalLink } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene1Searches({
  progress,
  stepIndex,
  stepProgress,
  activeHighlight,
  isMobile,
  palette,
}: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';
  const sampleTrade = config.wayOfWorking.sampleTrade || 'roofers';

  // 4 Steps mapping:
  // Step 0 ('search'): search bar types ("A homeowner searches for a roofer.")
  // Step 1 ('competitors'): competitor pins & cards appear ("Local roofers appear, each with a website.")
  // Step 2 ('your-biz'): your business card & pin appear ("Your business is listed, but with no website.")
  // Step 3 ('veer'): hesitant dot veers off to competitor ("The customer picks a competitor instead.")

  const searchProgress = stepIndex > 0 ? 1 : stepProgress;
  const competitorsProgress = stepIndex > 1 ? 1 : stepIndex === 1 ? stepProgress : 0;
  const yourBizProgress = stepIndex > 2 ? 1 : stepIndex === 2 ? stepProgress : 0;
  const veerProgress = stepIndex === 3 ? stepProgress : stepIndex > 3 ? 1 : 0;

  const searchText = `${sampleTrade} in ${sampleTown}`;
  const typedCount = Math.floor(searchProgress * searchText.length);
  const currentTypedText = searchText.slice(0, typedCount);

  const competitors = [
    { name: 'Sample Roofing Co. A', rating: '5.0 (24)', x: 480, y: 150, tag: 'Roofing contractor' },
    { name: 'Sample Roofing Co. B', rating: '4.9 (19)', x: 620, y: 230, tag: 'Roofing & guttering' },
    { name: 'Sample Roofing Co. C', rating: '4.8 (15)', x: 530, y: 320, tag: 'Specialist roofer' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none px-2">
      {/* Illustrative tag */}
      <div className="absolute top-1 right-2 text-[10px] uppercase tracking-wider text-white/40 px-2 py-0.5 rounded bg-black/20 border border-white/10 z-20">
        Illustrative example
      </div>

      {/* Main Visual Stage */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 py-1">
        {/* Left Side: Search Bar + Results List */}
        <div className="w-full md:w-72 lg:w-80 flex flex-col gap-2 z-10 shrink-0">
          {/* Simulated Google Maps Search Bar */}
          <div
            className={`w-full bg-white text-[#1B2B34] rounded-2xl px-3 py-2 shadow-md flex items-center gap-2 border transition-all duration-300 ${
              activeHighlight === 'search'
                ? 'ring-4 ring-[#F4B860] border-[#F4B860] shadow-[0_0_18px_rgba(244,184,96,0.3)]'
                : 'border-white/20'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#2A5A6B] shrink-0" />
            <div className="flex-1 text-xs font-medium tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
              <span>{currentTypedText || (stepIndex > 0 ? searchText : '')}</span>
              {stepIndex === 0 && searchProgress < 1 && (
                <span className="inline-block w-1.5 h-3 bg-[#2A5A6B] ml-0.5 animate-pulse" />
              )}
            </div>
            <span className="text-[9px] font-semibold text-white bg-[#2A5A6B] px-1.5 py-0.5 rounded-full">
              Maps
            </span>
          </div>

          {/* Cards List */}
          <div className="flex flex-col gap-1.5">
            {competitors.map((comp, idx) => {
              const cardReveal = stepIndex > 1 ? 1 : stepIndex === 1 ? Math.min(1, Math.max(0, (competitorsProgress - idx * 0.25) / 0.4)) : 0;
              if (cardReveal <= 0) return null;
              const isHighlighted = activeHighlight === 'competitors';

              return (
                <div
                  key={comp.name}
                  style={{
                    opacity: isHighlighted ? 1 : activeHighlight === 'your-biz' || activeHighlight === 'veer' ? 0.75 : cardReveal,
                    transform: `translateX(${(1 - cardReveal) * -16}px)`,
                  }}
                  className={`bg-white/95 backdrop-blur-sm text-[#1B2B34] rounded-xl p-2 shadow-sm border flex items-center justify-between gap-2 transition-all duration-300 ${
                    isHighlighted
                      ? 'ring-2 ring-[#F4B860] border-[#F4B860] shadow-[0_0_12px_rgba(244,184,96,0.2)]'
                      : 'border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#2A5A6B]/15 text-[#2A5A6B] flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-[#0B1B2B]">{comp.name}</p>
                      <p className="text-[10px] text-emerald-600 font-medium">★ {comp.rating}</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-[#12303D] text-white text-[9.5px] font-medium rounded flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5 text-[#F4B860]" />
                      Website
                    </span>
                  </div>
                </div>
              );
            })}

            {/* "Your business" Card */}
            {stepIndex >= 2 && (
              <div
                style={{
                  opacity: Math.max(yourBizProgress, 1),
                  transform: `translateX(${(1 - Math.max(yourBizProgress, 1)) * -16}px)`,
                }}
                className={`relative bg-[#1A3342] text-white rounded-xl p-2 shadow-sm border-2 transition-all duration-300 ${
                  activeHighlight === 'your-biz' || activeHighlight === 'veer'
                    ? 'border-[#E5484D] ring-4 ring-[#E5484D]/40 shadow-[0_0_20px_rgba(229,72,77,0.35)]'
                    : 'border-dashed border-[#E5484D]/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white/10 text-white/50 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-[#F4B860] truncate">Your business</p>
                        <span className="text-[8.5px] bg-white/10 text-white/70 px-1 py-0.2 rounded">Phone only</span>
                      </div>
                      <p className="text-[10px] text-white/50 font-normal">No customer reviews yet</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="px-1.5 py-0.5 bg-[#E5484D]/20 text-[#FF8585] border border-[#E5484D]/40 text-[9px] font-semibold rounded">
                      No website
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Map Canvas */}
        <div
          className={`relative flex-1 w-full h-[220px] sm:h-[260px] md:h-[290px] bg-[#0E2333]/80 rounded-2xl border overflow-hidden shadow-xl flex items-center justify-center transition-all duration-300 ${
            activeHighlight === 'search'
              ? 'border-[#F4B860]/60 ring-2 ring-[#F4B860]/20'
              : 'border-[#2A5A6B]/40'
          }`}
        >
          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* Street Vectors */}
            <g stroke="#2A5A6B" strokeWidth="2.5" strokeOpacity="0.75" fill="none">
              <path d="M 50 100 Q 250 60, 480 150 T 750 170" />
              <path d="M 80 320 Q 300 270, 530 320 T 760 300" />
              <path d="M 280 30 Q 360 180, 620 230 T 720 380" />
              <path d="M 160 380 Q 280 220, 450 100" />
            </g>

            {/* Competitor Pins & Pulse Rings */}
            {stepIndex >= 1 &&
              competitors.map((comp) => (
                <g key={comp.name} transform={`translate(${comp.x}, ${comp.y})`}>
                  <circle r="18" fill="#F4B860" opacity="0.25" className="animate-ping" />
                  <circle r="12" fill="#FFFFFF" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.3))" />
                  <circle r="6" fill="#2A5A6B" />
                  <text y="-16" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="600">
                    {comp.name}
                  </text>
                </g>
              ))}

            {/* "Your Business" Map Pin (Hollow & Grey) */}
            {stepIndex >= 2 && (
              <g transform="translate(300, 250)">
                <circle r="13" fill="#1A3342" stroke="#E5484D" strokeWidth="2.5" strokeDasharray="4 2" />
                <circle r="4" fill="#718096" />
                {activeHighlight === 'your-biz' && (
                  <circle r="22" fill="none" stroke="#E5484D" strokeWidth="1.5" className="animate-ping" opacity="0.4" />
                )}
                <text y="-18" textAnchor="middle" fill="#F4B860" fontSize="11" fontWeight="bold">
                  Your business
                </text>
                <text y="24" textAnchor="middle" fill="#FF8585" fontSize="9" fontWeight="500">
                  (No website)
                </text>
              </g>
            )}

            {/* Person Dot approaching Your Business, hesitating, then veering to Comp B */}
            {stepIndex >= 3 && (
              <g>
                {veerProgress <= 0.5 ? (
                  <g>
                    <circle
                      cx={140 + (veerProgress / 0.5) * (260 - 140)}
                      cy={250 + Math.sin((veerProgress / 0.5) * Math.PI) * -15}
                      r="6.5"
                      fill="#F4B860"
                      filter="drop-shadow(0 0 8px #F4B860)"
                    />
                    {veerProgress > 0.3 && (
                      <g transform={`translate(${140 + (veerProgress / 0.5) * (260 - 140)}, ${232})`}>
                        <rect x="-9" y="-16" width="18" height="14" rx="4" fill="#E5484D" />
                        <text x="0" y="-6" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">?</text>
                      </g>
                    )}
                  </g>
                ) : (
                  <g>
                    <circle
                      cx={260 + ((veerProgress - 0.5) / 0.5) * (620 - 260)}
                      cy={250 + ((veerProgress - 0.5) / 0.5) * (230 - 250) + Math.sin(((veerProgress - 0.5) / 0.5) * Math.PI) * -30}
                      r="6.5"
                      fill="#F4B860"
                      filter="drop-shadow(0 0 8px #F4B860)"
                    />
                    <g transform={`translate(${260 + ((veerProgress - 0.5) / 0.5) * (620 - 260)}, ${235})`}>
                      <rect x="-35" y="-16" width="70" height="15" rx="4" fill="#12303D" stroke="#FFFFFF" strokeWidth="0.8" />
                      <text x="0" y="-5" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="600">Choosing Co. B</text>
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
