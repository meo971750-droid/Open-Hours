import React from 'react';
import { MapPin, Globe, MessageSquare, Sparkles } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene5Findable({
  progress,
  stepIndex,
  stepProgress,
  activeHighlight,
  isMobile,
  palette,
}: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';

  // 4 Steps mapping:
  // Step 0: 'hub': Google needs clear signals
  // Step 1: 'gbp': Google Business Profile
  // Step 2: 'service-areas': Pages for each area you serve
  // Step 3: 'reviews': Easy review requests from happy customers

  const satellites = [
    {
      id: 'gbp',
      highlightId: 'gbp',
      stepNum: 1,
      title: 'Google Business Profile',
      subtitle: 'Complete verified setup',
      icon: MapPin,
      renderContent: () => (
        <div className="space-y-0.5 text-[10px] text-[#0F2A4A]/80">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#0F2A4A]">Sample Roofing {sampleTown}</span>
            <span className="text-[8.5px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">Verified</span>
          </div>
          <p className="text-[9.5px] text-[#0F2A4A]/60">Mon–Sat: 8am – 6pm · Verified address</p>
        </div>
      ),
    },
    {
      id: 'service-areas',
      highlightId: 'service-areas',
      stepNum: 2,
      title: 'Service-Area Pages',
      subtitle: 'Town and county coverage',
      icon: Globe,
      renderContent: () => (
        <div className="space-y-0.5 text-[10px] text-[#0F2A4A]/80">
          <div className="flex flex-wrap gap-1">
            {[`${sampleTown} City`, 'Salthill', 'Oranmore'].map((place) => (
              <span key={place} className="text-[8.5px] bg-blue-50 text-[#2F6BFF] font-medium px-1.5 py-0.2 rounded border border-blue-200">
                {place}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'reviews',
      highlightId: 'reviews',
      stepNum: 3,
      title: 'Review Requests',
      subtitle: 'Automatic follow-up flow',
      icon: MessageSquare,
      renderContent: () => (
        <div className="space-y-0.5 text-[10px] text-[#0F2A4A]/80">
          <p className="text-[9.5px] text-[#0F2A4A]/70">"Hi Tom, thanks for choosing us today! If you're happy with the roof..."</p>
          <p className="text-[9px] text-emerald-700 font-semibold">✓ Review link sent automatically</p>
        </div>
      ),
    },
  ];

  const isHubActive = activeHighlight === 'hub' || stepIndex === 0;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none px-2">
      <div className="absolute top-1 right-2 text-[10px] uppercase tracking-wider text-[#0F2A4A]/50 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 z-20">
        Illustrative example
      </div>

      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-1">
        {/* Central Hub */}
        <div
          className={`relative z-10 w-36 sm:w-40 h-28 sm:h-32 rounded-3xl bg-white border-2 flex flex-col items-center justify-center text-center p-2.5 transition-all duration-300 ${
            isHubActive
              ? 'border-[#2F6BFF] shadow-[0_0_28px_rgba(47,107,255,0.3)] ring-4 ring-[#2F6BFF]/20'
              : 'border-blue-200 shadow-md'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-[#2F6BFF]/10 text-[#2F6BFF] flex items-center justify-center mb-1">
            <MapPin className="w-4 h-4 fill-[#2F6BFF]/20" />
          </div>
          <p className="text-xs font-bold text-[#0F2A4A]">Sample Roofing</p>
          <p className="text-[9.5px] text-[#0F2A4A]/60 font-medium">{sampleTown}</p>

          <div className="mt-1 px-2 py-0.5 rounded-full bg-blue-50 border border-[#2F6BFF]/40 text-[#2F6BFF] text-[8.5px] font-bold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-[#2F6BFF]" />
            Clear signals for Google
          </div>
        </div>

        {/* 3 Satellite Cards in a balanced row */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-4 z-10">
          {satellites.map((sat) => {
            const isHighlighted = activeHighlight === sat.highlightId;
            const isRevealed = stepIndex >= sat.stepNum;
            return (
              <div
                key={sat.id}
                className={`bg-white rounded-xl p-2.5 border shadow-sm flex flex-col gap-1.5 transition-all duration-300 ${
                  isHighlighted
                    ? 'border-[#2F6BFF] ring-2 ring-[#2F6BFF]/30 shadow-[0_0_16px_rgba(47,107,255,0.18)] opacity-100'
                    : isRevealed
                    ? 'border-blue-100 opacity-90'
                    : 'border-slate-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isHighlighted ? 'bg-[#2F6BFF] text-white' : 'bg-[#2F6BFF]/10 text-[#2F6BFF]'}`}>
                    <sat.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-bold text-[#0F2A4A] truncate">{sat.title}</h5>
                    <p className="text-[9px] text-[#0F2A4A]/60 truncate">{sat.subtitle}</p>
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-100">{sat.renderContent()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
