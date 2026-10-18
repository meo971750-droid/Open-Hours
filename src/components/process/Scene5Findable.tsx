import React, { useState } from 'react';
import { MapPin, Globe, Zap, MessageSquare, ChevronDown, CheckCircle2, RotateCcw } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene5Findable({ progress, isActive, isMobile, onInteract }: SceneProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>('gbp');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';

  // Timing: 20% entrance, 45% main animation (0.20 to 0.65), 20% HOLD (0.65 to 0.85), 15% exit (0.85 to 1.0)
  const enterProgress = Math.min(1, Math.max(0, progress / 0.2));
  const exitProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.15));

  const xOffset = isMobile ? 0 : (1 - enterProgress) * -40 + exitProgress * 40;
  const opacity = isMobile ? 1 : Math.min(enterProgress, 1 - exitProgress);

  // During scrolling (0.20 to 0.65), cards auto-expand in sequence if visitor has not manually interacted
  const animProgress = isMobile ? 1 : Math.min(1, Math.max(0, (progress - 0.2) / 0.45));

  const cards = [
    {
      id: 'gbp',
      enabled: config.features.googleBusinessProfile !== false,
      title: 'Google Business Profile',
      subtitle: 'Complete profile verification',
      icon: MapPin,
      renderMiniAnimation: () => (
        <div className="bg-[#10222A] rounded-xl p-3 border border-white/10 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">Sample Roofing {sampleTown}</span>
            <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">Verified</span>
          </div>
          <div className="space-y-1 text-white/70 text-[11px]">
            <div>🕒 Hours: Mon–Sat 8:00 AM – 6:00 PM</div>
            <div>📍 Region: {sampleTown} &amp; Surrounding County</div>
            <div>📸 12 Verified Jobsite Photos uploaded</div>
          </div>
        </div>
      ),
    },
    {
      id: 'areas',
      enabled: config.features.serviceAreaPages !== false,
      title: 'Service-Area Pages',
      subtitle: 'Dedicated local radius coverage',
      icon: Globe,
      renderMiniAnimation: () => (
        <div className="bg-[#10222A] rounded-xl p-3 border border-white/10 flex flex-col gap-2 text-xs">
          <span className="text-[11px] text-white/60">Expanding search footprint:</span>
          <div className="flex flex-wrap gap-1.5">
            {[`${sampleTown} City`, 'Salthill', 'Oranmore', 'Barna', 'Athenry'].map((town) => (
              <span key={town} className="px-2 py-1 rounded bg-[#18313D] border border-white/15 text-white/90 text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E3B896]" />
                <span>{town}</span>
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'speed',
      enabled: true,
      title: 'Fast on Mobile',
      subtitle: 'Sub-second lightweight performance',
      icon: Zap,
      renderMiniAnimation: () => (
        <div className="bg-[#10222A] rounded-xl p-3 border border-white/10 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/70">Mobile Load Time</span>
            <span className="text-emerald-300 font-bold">Fast · Optimized</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#2E9E6B] rounded-full w-[95%] animate-in slide-in-from-left duration-700" />
          </div>
          <span className="text-[10px] text-white/50">Zero lag, immediate rendering for homeowners on the move.</span>
        </div>
      ),
    },
    {
      id: 'reviews',
      enabled: config.features.reviewRequests !== false,
      title: 'Review Requests',
      subtitle: 'Automated feedback collection',
      icon: MessageSquare,
      renderMiniAnimation: () => (
        <div className="bg-[#10222A] rounded-xl p-3 border border-white/10 flex flex-col gap-2 text-xs">
          <div className="bg-white/10 p-2 rounded-lg text-white/90 text-[11px]">
            💬 "Hi John! Thanks for choosing Sample Roofing. Could you leave a quick review of our work?"
          </div>
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-200 text-[11px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Customer review logged on Google profile</span>
          </div>
        </div>
      ),
    },
  ].filter((c) => c.enabled);

  const activeCardId = hasInteracted
    ? expandedCard
    : cards[Math.min(cards.length - 1, Math.floor(animProgress * cards.length))]?.id || 'gbp';

  const handleCardClick = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteract) onInteract();
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(false);
    setExpandedCard('gbp');
    setReplayKey((k) => k + 1);
  };

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
      {/* Top Banner with Replay & Hotspot micro-label */}
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="font-semibold text-[#E3B896] uppercase tracking-wider text-[11px]">
          Google Discovery Foundations
        </span>

        <div className="flex items-center gap-2">
          {!hasInteracted && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E3B896]/20 border border-[#E3B896]/40 text-[#E3B896] text-[11px] font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E3B896]" />
              <span>Tap a card to expand</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay animation"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* 4 Expandable Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
        {cards.map((card) => {
          const Icon = card.icon;
          const isExpanded = activeCardId === card.id;

          return (
            <div
              key={card.id}
              className={`rounded-2xl border transition-all duration-300 p-4 flex flex-col gap-3 shadow-lg ${
                isExpanded
                  ? 'bg-[#18313D] border-[#E3B896]/50 ring-1 ring-[#E3B896]/30'
                  : 'bg-[#13242C] border-white/10 hover:border-white/25'
              }`}
            >
              <button
                type="button"
                onClick={() => handleCardClick(card.id)}
                aria-expanded={isExpanded}
                className="w-full flex items-center justify-between text-left cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isExpanded ? 'bg-[#E3B896] text-[#0F2A35]' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{card.title}</h4>
                    <span className="text-xs text-white/60">{card.subtitle}</span>
                  </div>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-white/60 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-[#E3B896]' : ''
                  }`}
                />
              </button>

              {/* Expandable Animation Canvas */}
              {isExpanded && (
                <div className="pt-2 border-t border-white/10 animate-in fade-in duration-300">
                  {card.renderMiniAnimation()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-white/50 pt-2 border-t border-white/10">
        Cause &amp; effect: Clean, verifiable signals help search engines understand who you are, what you build, and where you work.
      </div>
    </div>
  );
}
