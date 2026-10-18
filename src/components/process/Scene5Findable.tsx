import React from 'react';
import { MapPin, Globe, Zap, MessageSquare, CheckCircle2, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene5Findable({ progress, isMobile, palette }: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';

  // Autoplay Timeline (0.0 to 1.0)
  // 1: Central map hub appears: 0.05 - 0.22
  // 2: Satellite 1 (GBP): 0.22 - 0.38
  // 3: Satellite 2 (Service-area pages): 0.38 - 0.54
  // 4: Satellite 3 (Fast on mobile): 0.54 - 0.70
  // 5: Satellite 4 (Review requests): 0.70 - 0.86
  // 6: Center glows & "Clear signals for Google" badge: 0.86 - 1.0

  const centerProgress = Math.min(1, Math.max(0, (progress - 0.05) / 0.17));
  const sat1Progress = Math.min(1, Math.max(0, (progress - 0.22) / 0.16));
  const sat2Progress = Math.min(1, Math.max(0, (progress - 0.38) / 0.16));
  const sat3Progress = Math.min(1, Math.max(0, (progress - 0.54) / 0.16));
  const sat4Progress = Math.min(1, Math.max(0, (progress - 0.70) / 0.16));
  const glowProgress = Math.min(1, Math.max(0, (progress - 0.84) / 0.16));

  const satellites = [
    {
      id: 'gbp',
      progress: sat1Progress,
      title: 'Google Business Profile',
      subtitle: 'Complete verified setup',
      icon: MapPin,
      renderContent: () => (
        <div className="space-y-1 text-[11px] text-[#0F2A4A]/80">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#0F2A4A]">Sample Roofing {sampleTown}</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">Verified</span>
          </div>
          <p className="text-[10px] text-[#0F2A4A]/60">Mon–Sat: 8am – 6pm · Verified address</p>
        </div>
      ),
    },
    {
      id: 'service-areas',
      progress: sat2Progress,
      title: 'Service-Area Pages',
      subtitle: 'Town and county coverage',
      icon: Globe,
      renderContent: () => (
        <div className="space-y-1 text-[11px] text-[#0F2A4A]/80">
          <div className="flex flex-wrap gap-1">
            {[`${sampleTown} City`, 'Salthill', 'Oranmore', 'Barna'].map((place) => (
              <span key={place} className="text-[9px] bg-blue-50 text-[#2F6BFF] font-medium px-1.5 py-0.5 rounded border border-blue-200">
                {place}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-[#0F2A4A]/60">Local indexing for surrounding areas</p>
        </div>
      ),
    },
    {
      id: 'fast-mobile',
      progress: sat3Progress,
      title: 'Fast on Mobile',
      subtitle: 'Instant lightweight load',
      icon: Zap,
      renderContent: () => (
        <div className="space-y-1.5">
          <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#2F6BFF] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, sat3Progress * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#0F2A4A]/70 font-medium">
            <span>Core Web Vitals passed</span>
            <span className="text-emerald-600 font-bold">✓ Smooth</span>
          </div>
        </div>
      ),
    },
    {
      id: 'reviews',
      progress: sat4Progress,
      title: 'Review System',
      subtitle: 'Automatic follow-up flow',
      icon: MessageSquare,
      renderContent: () => (
        <div className="space-y-1 text-[11px] text-[#0F2A4A]/80">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px]">
            <p className="text-[#0F2A4A]/70">"Hi Tom, thanks for choosing us today! If you're happy with the repair..."</p>
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold">✓ Review link sent automatically</p>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      <div className="absolute top-2 right-4 text-[10px] uppercase tracking-wider text-[#0F2A4A]/50 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 z-20">
        Illustrative example
      </div>

      <div className="relative w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center px-4 py-2">
        <div className="relative w-full max-w-3xl flex items-center justify-center">
          {/* Central Hub */}
          <div
            style={{
              opacity: centerProgress,
              transform: `scale(${0.85 + centerProgress * 0.15})`,
            }}
            className={`relative z-10 w-44 sm:w-52 h-44 sm:h-52 rounded-full bg-white border-2 flex flex-col items-center justify-center text-center p-3 transition-all duration-500 ${
              glowProgress > 0.5
                ? 'border-[#2F6BFF] shadow-[0_0_36px_rgba(47,107,255,0.35)] ring-4 ring-[#2F6BFF]/20'
                : 'border-blue-200 shadow-xl'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#2F6BFF]/10 text-[#2F6BFF] flex items-center justify-center mb-1.5">
              <MapPin className="w-6 h-6 fill-[#2F6BFF]/20" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#0F2A4A]">Sample Roofing</p>
            <p className="text-[10px] text-[#0F2A4A]/60 font-medium">{sampleTown}</p>

            {glowProgress > 0.3 && (
              <div
                style={{ opacity: glowProgress }}
                className="mt-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-[#2F6BFF]/40 text-[#2F6BFF] text-[9.5px] font-bold flex items-center gap-1 shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-[#2F6BFF]" />
                Clear signals for Google
              </div>
            )}
          </div>

          {/* SVG Connector Lines from Center to Satellites */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-200 -200 400 400">
            {sat1Progress > 0.5 && <line x1="0" y1="0" x2="-140" y2="-90" stroke="#2F6BFF" strokeWidth="2" strokeDasharray="4 4" />}
            {sat2Progress > 0.5 && <line x1="0" y1="0" x2="140" y2="-90" stroke="#2F6BFF" strokeWidth="2" strokeDasharray="4 4" />}
            {sat3Progress > 0.5 && <line x1="0" y1="0" x2="-140" y2="90" stroke="#2F6BFF" strokeWidth="2" strokeDasharray="4 4" />}
            {sat4Progress > 0.5 && <line x1="0" y1="0" x2="140" y2="90" stroke="#2F6BFF" strokeWidth="2" strokeDasharray="4 4" />}
          </svg>
        </div>

        {/* 4 Satellite Cards (Desktop 2x2 grid, Mobile stack) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 z-10">
          {satellites.map((sat) => {
            if (sat.progress <= 0) return null;
            return (
              <div
                key={sat.id}
                style={{
                  opacity: sat.progress,
                  transform: `translateY(${(1 - sat.progress) * 16}px)`,
                }}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-blue-100 shadow-[0_8px_20px_rgba(47,107,255,0.08)] flex flex-col gap-2 transition-all duration-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#2F6BFF]/10 text-[#2F6BFF] flex items-center justify-center shrink-0">
                    <sat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#0F2A4A]">{sat.title}</h5>
                    <p className="text-[10px] text-[#0F2A4A]/60">{sat.subtitle}</p>
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
