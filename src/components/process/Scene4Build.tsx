import React from 'react';
import { Smartphone, Laptop, Phone, CheckCircle2, Inbox, Send, MapPin, Check } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene4Build({ progress, isMobile, palette }: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';
  const sampleTrade = config.wayOfWorking.sampleTrade || 'roofers';

  // Autoplay Timeline (0.0 to 1.0)
  // 1: Grid fades in: 0.05 - 0.18
  // 2: Laptop and phone outlines draw: 0.18 - 0.40
  // 3: Website blocks build inside frames: 0.35 - 0.60
  // 4: Annotation callouts with leader lines: 0.55 - 0.75
  // 5: Form auto-fills, cursor taps send, enquiry card flies to inbox: 0.72 - 0.88
  // 6: Hold: 0.88 - 1.0

  const gridProgress = Math.min(1, Math.max(0, (progress - 0.05) / 0.15));
  const framesProgress = Math.min(1, Math.max(0, (progress - 0.18) / 0.22));
  const blocksProgress = Math.min(1, Math.max(0, (progress - 0.35) / 0.25));
  const calloutsProgress = Math.min(1, Math.max(0, (progress - 0.55) / 0.20));
  const formActionProgress = Math.min(1, Math.max(0, (progress - 0.70) / 0.18));

  const isFormFilled = formActionProgress > 0.25;
  const isFormSent = formActionProgress > 0.55;
  const isInboxReceived = formActionProgress > 0.75;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      <div className="absolute top-2 right-4 text-[10px] uppercase tracking-wider text-white/40 px-2 py-0.5 rounded bg-black/20 border border-white/10 z-20">
        Illustrative example
      </div>

      {/* Blueprint Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: gridProgress * 0.45,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative w-full max-w-6xl mx-auto flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 px-4 py-2 z-10">
        {/* Device Stage: Laptop + Mobile */}
        <div className="flex-1 w-full flex items-center justify-center gap-4 sm:gap-6">
          {/* Laptop Frame */}
          <div
            style={{
              opacity: framesProgress,
              transform: `scale(${0.9 + framesProgress * 0.1})`,
            }}
            className="hidden sm:flex flex-col w-[340px] md:w-[420px] lg:w-[480px] bg-[#0E2235] rounded-xl border border-white/25 shadow-2xl overflow-hidden transition-all duration-300"
          >
            {/* Laptop Header Bar */}
            <div className="h-6 bg-[#091724] border-b border-white/10 flex items-center px-3 gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/70" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <span className="w-2 h-2 rounded-full bg-green-500/70" />
              <span className="text-[10px] text-white/40 ml-2 font-mono">sample-roofing-{sampleTown.toLowerCase()}.com</span>
            </div>

            {/* Laptop Website Body */}
            <div className="p-4 flex flex-col gap-3 min-h-[260px] bg-[#11293F]">
              {/* Block 1: Nav / Header */}
              {blocksProgress > 0.1 && (
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-[#E8B08F]" />
                    <span>Sample Roofing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/70">Roof Repairs</span>
                    <span className="px-2 py-0.5 rounded bg-[#E8B08F] text-[#12304A] font-semibold text-[10px] flex items-center gap-1 shadow-sm">
                      <Phone className="w-2.5 h-2.5" /> Call Now
                    </span>
                  </div>
                </div>
              )}

              {/* Block 2: Hero Headline & Quote Form */}
              <div className="grid grid-cols-2 gap-3 items-center">
                {blocksProgress > 0.3 && (
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#E8B08F] font-bold">Trusted local roofing</span>
                    <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug">
                      Reliable roof repairs in {sampleTown}.
                    </h4>
                    <p className="text-[10px] text-white/60 mt-1">Written estimates, verified insurance.</p>
                  </div>
                )}

                {blocksProgress > 0.5 && (
                  <div className="bg-[#0B1E2E] p-2.5 rounded-lg border border-white/15 text-[10px] text-white space-y-1.5">
                    <div className="font-semibold text-white/90 text-[10px] flex items-center justify-between">
                      <span>Quick Quote</span>
                      {isFormSent && <span className="text-emerald-400 text-[9px]">✓ Sent</span>}
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[9px] text-white/80">
                      {isFormFilled ? 'Tom Murphy' : 'Your name...'}
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[9px] text-white/80">
                      {isFormFilled ? 'Slate repair, storm leak' : 'Job details...'}
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[9px] text-white/80">
                      {isFormFilled ? 'H91 ...' : 'Eircode / Postcode'}
                    </div>
                    <button
                      type="button"
                      className={`w-full py-1 rounded text-[9px] font-bold flex items-center justify-center gap-1 transition-colors duration-300 ${
                        isFormSent ? 'bg-emerald-600 text-white' : 'bg-[#E8B08F] text-[#12304A]'
                      }`}
                    >
                      {isFormSent ? <Check className="w-2.5 h-2.5" /> : <Send className="w-2.5 h-2.5" />}
                      {isFormSent ? 'Enquiry sent' : 'Request Estimate'}
                    </button>
                  </div>
                )}
              </div>

              {/* Block 3: Service-Area Bar */}
              {blocksProgress > 0.7 && (
                <div className="mt-auto pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-white/60">
                  <div className="flex items-center gap-1 text-[#E8B08F]">
                    <MapPin className="w-3 h-3" />
                    <span className="font-semibold text-white/80">Covering: {sampleTown} &amp; 25km radius</span>
                  </div>
                  <span>Response within 24h</span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Frame (Phone) */}
          <div
            style={{
              opacity: framesProgress,
              transform: `scale(${0.9 + framesProgress * 0.1})`,
            }}
            className="relative w-48 sm:w-52 h-[340px] bg-[#0E2235] rounded-3xl border-2 border-white/30 shadow-2xl overflow-hidden p-2 flex flex-col shrink-0"
          >
            {/* Phone Notch */}
            <div className="w-20 h-3 bg-black/40 rounded-full mx-auto mb-2" />

            <div className="flex-1 bg-[#11293F] rounded-2xl p-2.5 flex flex-col justify-between overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="text-[10px] font-bold text-white">Sample Roofing</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-[#E8B08F]/15 border border-[#E8B08F]/30 rounded-lg p-2 text-[10px]">
                  <p className="font-bold text-[#E8B08F]">Storm damage? We're on call.</p>
                  <p className="text-[9px] text-white/70 mt-0.5">Direct tap-to-call on mobile.</p>
                </div>
              </div>

              {/* Call button prominent on mobile */}
              <div className="space-y-2">
                <div className="w-full py-2 rounded-xl bg-[#E8B08F] text-[#12304A] font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md">
                  <Phone className="w-3.5 h-3.5 fill-current" /> Tap to Call Now
                </div>
                <div className="w-full py-1.5 rounded-lg bg-white/10 text-white font-medium text-[10px] text-center border border-white/10">
                  Request Quote Online
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Annotations & Enquiry Inbox */}
        <div className="w-full lg:w-80 flex flex-col gap-3">
          {/* Annotations */}
          <div className="flex flex-col gap-2">
            {[
              { label: 'Call button', desc: 'Always visible on mobile with one tap' },
              { label: 'Quote form', desc: 'Captures name, job and postcode with zero friction' },
              { label: 'Service area', desc: 'Confirms local coverage so visitors do not bounce' },
            ].map((anno, idx) => {
              const annoReveal = Math.min(1, Math.max(0, (calloutsProgress - idx * 0.3) / 0.4));
              if (annoReveal <= 0) return null;
              return (
                <div
                  key={anno.label}
                  style={{
                    opacity: annoReveal,
                    transform: `translateX(${(1 - annoReveal) * 15}px)`,
                  }}
                  className="bg-white/10 border border-white/15 rounded-xl p-2.5 backdrop-blur-sm transition-all duration-300"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#E8B08F]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{anno.label}</span>
                  </div>
                  <p className="text-[10px] text-white/70 mt-0.5">{anno.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Enquiry Inbox card */}
          {isInboxReceived && (
            <div
              style={{
                opacity: 1,
                transform: 'scale(1)',
              }}
              className="bg-[#091926] border-2 border-emerald-500/50 rounded-2xl p-3 shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white border-b border-white/10 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Inbox className="w-4 h-4" /> Enquiry Inbox
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">New Lead</span>
              </div>
              <div className="mt-2 text-[11px] text-white/90 space-y-1">
                <p><span className="text-white/50">Name:</span> Tom Murphy</p>
                <p><span className="text-white/50">Job:</span> Slate repair, storm leak</p>
                <p><span className="text-white/50">Location:</span> {sampleTown} (H91...)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
