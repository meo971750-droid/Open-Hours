import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, ExternalLink, RotateCcw, Phone, Info } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

interface PinData {
  id: string;
  name: string;
  rating: string;
  reviews: string;
  category: string;
  hasWebsite: boolean;
  x: number; // percentage
  y: number; // percentage
  note?: string;
}

export default function Scene1Searches({ progress, isActive, isMobile, onInteract }: SceneProps) {
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';
  const sampleTrade = config.wayOfWorking.sampleTrade || 'roofers';

  const pins: PinData[] = [
    {
      id: 'co-a',
      name: 'Sample Roofing Co. A',
      rating: '5.0',
      reviews: '24',
      category: 'Roofing contractor',
      hasWebsite: true,
      x: 35,
      y: 28,
    },
    {
      id: 'co-b',
      name: 'Sample Roofing Co. B',
      rating: '4.9',
      reviews: '19',
      category: 'Roofing & guttering',
      hasWebsite: true,
      x: 72,
      y: 38,
    },
    {
      id: 'co-c',
      name: 'Sample Roofing Co. C',
      rating: '4.8',
      reviews: '15',
      category: 'Roof repairs specialist',
      hasWebsite: true,
      x: 52,
      y: 72,
    },
    {
      id: 'your-biz',
      name: 'Your business',
      rating: '—',
      reviews: '0',
      category: 'Phone listing only',
      hasWebsite: false,
      x: 22,
      y: 70,
      note: "People can't check you out before calling, so they choose someone else.",
    },
  ];

  // Timing: 20% entrance, 45% main animation (0.20 to 0.65), 20% HOLD (0.65 to 0.85), 15% exit (0.85 to 1.0)
  const enterProgress = Math.min(1, Math.max(0, progress / 0.2));
  const exitProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.15));

  const xOffset = isMobile ? 0 : (1 - enterProgress) * -40 + exitProgress * 40;
  const opacity = isMobile ? 1 : Math.min(enterProgress, 1 - exitProgress);

  // Animation phase progression (0.20 to 0.65)
  const animProgress = isMobile ? 1 : Math.min(1, Math.max(0, (progress - 0.2) / 0.45));

  // Three traveller person dots traveling to pins A, B, C along curved paths
  // Traveller 1: to Co. A (arrives ~0.35)
  // Traveller 2: to Co. B (arrives ~0.50)
  // Traveller 3: to Co. C (arrives ~0.65)
  // Note: NO dot travels to "Your business"!

  const handlePinClick = (id: string) => {
    setSelectedPinId(id);
    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteract) onInteract();
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPinId(null);
    setReplayKey((k) => k + 1);
  };

  const activePin = pins.find((p) => p.id === selectedPinId);

  return (
    <div
      key={replayKey}
      style={{
        transform: `translateX(${xOffset}px)`,
        opacity,
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease-out',
      }}
      className="w-full max-w-4xl mx-auto flex flex-col gap-4 select-none"
    >
      {/* Top Status Bar: Chip "Before" + Clock + Replay Button */}
      <div className="flex items-center justify-between text-xs text-white/70">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold uppercase text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>Before Open Hours</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-[#E3B896]" />
            <span>8:45 PM · Homeowners searching after work</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Micro-label indicator */}
          {!hasInteracted && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E3B896]/20 border border-[#E3B896]/40 text-[#E3B896] text-[11px] font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E3B896]" />
              <span>Tap a pin to explore</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay scene animation"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Simulated Search Bar */}
      <div className="w-full bg-[#162C36] rounded-2xl p-3 border border-white/15 shadow-lg flex items-center gap-3">
        <Search className="w-5 h-5 text-[#E3B896] shrink-0" />
        <div className="flex-1 font-mono text-sm sm:text-base text-white/90 truncate flex items-center">
          <span>{sampleTrade} in {sampleTown}</span>
          <span className="w-2 h-4 bg-[#E3B896] ml-1.5 animate-pulse" />
        </div>
        <span className="text-xs text-white/40 hidden sm:inline-block">Google Maps View</span>
      </div>

      {/* Map & Interactive Split Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Map Area */}
        <div className="md:col-span-7 relative bg-[#13242C] rounded-2xl border border-white/10 overflow-hidden p-4 min-h-[320px] flex flex-col justify-between">
          {/* Background Street Grid & Curved Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pathGradientA" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E3B896" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2E9E6B" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Faint road grid */}
            <line x1="20%" y1="0" x2="20%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <line x1="80%" y1="0" x2="80%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="35%" x2="100%" y2="35%" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Travel Path 1 to Co. A (x: 35%, y: 28%) */}
            <path
              d="M 10 90 Q 80 50 140 90 T 230 90"
              fill="none"
              stroke="rgba(227,184,150,0.25)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Map Header */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/60">
            <span className="font-semibold text-white/80">Local Search Map</span>
            <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded font-mono">{sampleTown} Area</span>
          </div>

          {/* Interactive Pins on the Map */}
          <div className="relative z-10 w-full h-[220px]">
            {pins.map((pin) => {
              const isSelected = selectedPinId === pin.id;
              const isYourBiz = pin.id === 'your-biz';

              return (
                <div
                  key={pin.id}
                  style={{
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <button
                    type="button"
                    onClick={() => handlePinClick(pin.id)}
                    aria-label={`View details for ${pin.name}`}
                    className={`group min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3B896] rounded-full`}
                  >
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] shadow-lg border transition-all ${
                        isYourBiz
                          ? isSelected
                            ? 'bg-rose-500/30 border-rose-400 text-rose-200 ring-2 ring-rose-400'
                            : 'bg-[#18262E] border-dashed border-rose-400/80 text-rose-300'
                          : isSelected
                          ? 'bg-[#2E9E6B] text-white border-white ring-2 ring-[#2E9E6B]'
                          : 'bg-[#18313D] text-white/90 border-white/20 hover:border-white/50'
                      }`}
                    >
                      <MapPin
                        className={`w-3.5 h-3.5 ${
                          isYourBiz
                            ? 'text-rose-400'
                            : 'text-[#2E9E6B] fill-[#2E9E6B]'
                        }`}
                      />
                      <span className="font-medium whitespace-nowrap">{pin.name}</span>
                    </div>
                  </button>

                  {/* Red dashed tag on Your business */}
                  {isYourBiz && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-dashed border-rose-400/60 text-[9px] font-medium whitespace-nowrap">
                      No website link
                    </div>
                  )}
                </div>
              );
            })}

            {/* Search-person dots traveling to competitor pins */}
            {/* Person 1 -> arrives at Co. A */}
            <div
              style={{
                left: `${Math.min(35, 5 + animProgress * 30)}%`,
                top: `${Math.min(28, 55 - animProgress * 27)}%`,
                opacity: animProgress > 0.1 ? 1 : 0,
                transition: 'all 0.4s ease-out',
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div className="w-5 h-5 rounded-full bg-[#E3B896] text-[#0F2A35] flex items-center justify-center shadow-md ring-2 ring-white/30 text-[10px] font-bold">
                👤
              </div>
            </div>

            {/* Person 2 -> arrives at Co. B */}
            <div
              style={{
                left: `${Math.min(72, 5 + animProgress * 67)}%`,
                top: `${Math.min(38, 70 - animProgress * 32)}%`,
                opacity: animProgress > 0.25 ? 1 : 0,
                transition: 'all 0.5s ease-out',
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div className="w-5 h-5 rounded-full bg-[#E3B896] text-[#0F2A35] flex items-center justify-center shadow-md ring-2 ring-white/30 text-[10px] font-bold">
                👤
              </div>
            </div>

            {/* Person 3 -> arrives at Co. C */}
            <div
              style={{
                left: `${Math.min(52, 5 + animProgress * 47)}%`,
                top: `${Math.min(72, 40 + animProgress * 32)}%`,
                opacity: animProgress > 0.4 ? 1 : 0,
                transition: 'all 0.4s ease-out',
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div className="w-5 h-5 rounded-full bg-[#E3B896] text-[#0F2A35] flex items-center justify-center shadow-md ring-2 ring-white/30 text-[10px] font-bold">
                👤
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-white/50 text-right">
            Homeowner searchers bypass listings without website links
          </div>
        </div>

        {/* Right Side: Explanatory Detail Card upon tapping any pin */}
        <div className="md:col-span-5 bg-[#172D38] rounded-2xl border border-white/10 p-5 sm:p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Listing Preview
              </span>
              <span className="text-[11px] text-[#E3B896]">
                {activePin ? 'Selected Pin' : 'Select a pin on the map'}
              </span>
            </div>

            {activePin ? (
              <div className="flex flex-col gap-3 animate-in fade-in duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{activePin.name}</h4>
                    <p className="text-xs text-white/60 mt-0.5">{activePin.category}</p>
                  </div>
                  {activePin.hasWebsite ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Website active
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Missing link
                    </span>
                  )}
                </div>

                {activePin.hasWebsite ? (
                  <>
                    <div className="bg-[#10222A] rounded-xl p-3 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 text-sm">★ {activePin.rating}</span>
                        <span className="text-xs text-white/60">({activePin.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#2E9E6B] text-white text-xs font-semibold">
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-white/80 text-xs">
                          <Phone className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 leading-relaxed">
                      Homeowners can view recent job photos, check insurance, and tap a quote button. They choose this contractor.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="bg-rose-500/10 rounded-xl p-3.5 border border-rose-500/30">
                      <span className="text-xs font-bold text-rose-300 block mb-1">
                        Why nobody chooses this listing:
                      </span>
                      <p className="text-xs text-rose-200 leading-relaxed">
                        {activePin.note}
                      </p>
                    </div>
                    <div className="text-xs text-white/60 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                      Phone numbers without an online presence look unverified to modern homeowners.
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center text-white/60 gap-2">
                <Info className="w-8 h-8 text-[#E3B896]/60" />
                <p className="text-xs max-w-[200px]">
                  Click or tap any pin on the map to see what homeowners see when they search.
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-white/40 pt-3 border-t border-white/10 mt-4">
            Cause &amp; effect: Searchers require proof before calling.
          </div>
        </div>
      </div>
    </div>
  );
}
