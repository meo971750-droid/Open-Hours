import React from 'react';
import { Smartphone, Laptop, Phone, CheckCircle2, Inbox, Send, MapPin, Check } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene4Build({
  progress,
  stepIndex,
  stepProgress,
  activeHighlight,
  isMobile,
  palette,
}: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';

  // 4 Steps mapping:
  // Step 0: 'blueprint': Blueprint of site
  // Step 1: 'header': Call button and headline always in reach
  // Step 2: 'quote': Quote form: name, job, postcode
  // Step 3: 'inbox': Each enquiry confirmed and lands in inbox

  const isFormFilled = stepIndex >= 2;
  const isFormSent = stepIndex >= 3;
  const isInboxReceived = stepIndex >= 3;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none px-2">
      <div className="absolute top-1 right-2 text-[10px] uppercase tracking-wider text-white/40 px-2 py-0.5 rounded bg-black/20 border border-white/10 z-20">
        Illustrative example
      </div>

      {/* Blueprint Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: activeHighlight === 'blueprint' ? 0.6 : 0.3,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-4 py-1 z-10">
        {/* Device Stage: Laptop + Mobile */}
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          {/* Laptop Frame */}
          <div
            className={`hidden sm:flex flex-col w-[320px] md:w-[380px] bg-[#0E2235] rounded-xl border shadow-xl overflow-hidden transition-all duration-300 ${
              activeHighlight === 'blueprint'
                ? 'border-[#E8B08F] ring-2 ring-[#E8B08F]/30'
                : 'border-white/20'
            }`}
          >
            {/* Laptop Header Bar */}
            <div className="h-5 bg-[#091724] border-b border-white/10 flex items-center px-2.5 gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
              <span className="text-[9px] text-white/40 ml-1.5 font-mono">sample-roofing.com</span>
            </div>

            {/* Laptop Website Body */}
            <div className="p-3 flex flex-col gap-2 bg-[#11293F]">
              {/* Header with Call Button */}
              <div
                className={`flex items-center justify-between pb-1.5 border-b transition-all duration-300 ${
                  activeHighlight === 'header'
                    ? 'border-[#E8B08F] bg-[#E8B08F]/10 p-1 rounded ring-2 ring-[#E8B08F]/40'
                    : 'border-white/10'
                }`}
              >
                <div className="text-[11px] font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded bg-[#E8B08F]" />
                  <span>Sample Roofing</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#E8B08F] text-[#12304A] font-bold text-[9px] flex items-center gap-1 shadow-sm">
                  <Phone className="w-2 h-2" /> Call Now
                </span>
              </div>

              {/* Headline & Quote Form */}
              <div className="grid grid-cols-2 gap-2 items-center">
                <div
                  className={`p-1 rounded transition-all duration-300 ${
                    activeHighlight === 'header' ? 'bg-white/10 ring-1 ring-[#E8B08F]/40' : ''
                  }`}
                >
                  <span className="text-[8.5px] uppercase tracking-wider text-[#E8B08F] font-bold">Local roofing</span>
                  <h4 className="text-[11px] font-bold text-white leading-tight">
                    Reliable roof repairs in {sampleTown}.
                  </h4>
                  <p className="text-[8.5px] text-white/60 mt-0.5">Written estimates, insured.</p>
                </div>

                {/* Quote Form */}
                <div
                  className={`bg-[#0B1E2E] p-2 rounded-lg border text-[9px] text-white space-y-1 transition-all duration-300 ${
                    activeHighlight === 'quote'
                      ? 'border-[#E8B08F] ring-2 ring-[#E8B08F]/40 shadow-md'
                      : 'border-white/15'
                  }`}
                >
                  <div className="font-semibold text-white/90 text-[9px] flex items-center justify-between">
                    <span>Quick Quote</span>
                    {isFormSent && <span className="text-emerald-400 text-[8.5px]">✓ Sent</span>}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[8.5px] text-white/80">
                    {isFormFilled ? 'Tom Murphy' : 'Name'}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[8.5px] text-white/80">
                    {isFormFilled ? 'Slate storm leak' : 'Job'}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[8.5px] text-white/80">
                    {isFormFilled ? 'H91 ...' : 'Postcode'}
                  </div>
                  <button
                    type="button"
                    className={`w-full py-0.5 rounded text-[8.5px] font-bold flex items-center justify-center gap-1 transition-colors duration-300 ${
                      isFormSent ? 'bg-emerald-600 text-white' : 'bg-[#E8B08F] text-[#12304A]'
                    }`}
                  >
                    {isFormSent ? <Check className="w-2 h-2" /> : <Send className="w-2 h-2" />}
                    {isFormSent ? 'Confirmed' : 'Send'}
                  </button>
                </div>
              </div>

              {/* Service-Area Bar */}
              <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[8px] text-white/60">
                <span className="text-[#E8B08F] font-semibold">Covering: {sampleTown} &amp; 25km radius</span>
                <span>Response in 24h</span>
              </div>
            </div>
          </div>

          {/* Mobile Frame (Phone) */}
          <div
            className={`relative w-40 sm:w-44 h-[240px] bg-[#0E2235] rounded-2xl border-2 shadow-xl overflow-hidden p-1.5 flex flex-col shrink-0 transition-all duration-300 ${
              activeHighlight === 'header'
                ? 'border-[#E8B08F] ring-2 ring-[#E8B08F]/30'
                : 'border-white/30'
            }`}
          >
            <div className="w-16 h-2.5 bg-black/40 rounded-full mx-auto mb-1.5" />
            <div className="flex-1 bg-[#11293F] rounded-xl p-2 flex flex-col justify-between overflow-hidden">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-1">
                  <span className="text-[9px] font-bold text-white">Sample Roofing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-[#E8B08F]/15 border border-[#E8B08F]/30 rounded p-1.5 text-[9px]">
                  <p className="font-bold text-[#E8B08F]">Roof problem? We reply.</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="w-full py-1.5 rounded-lg bg-[#E8B08F] text-[#12304A] font-bold text-[10px] flex items-center justify-center gap-1 shadow">
                  <Phone className="w-3 h-3 fill-current" /> Tap to Call Now
                </div>
                <div className="w-full py-1 rounded bg-white/10 text-white font-medium text-[9px] text-center">
                  Quick Quote Form
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Inbox Card & Blueprint Notes */}
        <div className="w-full lg:w-72 flex flex-col gap-2">
          {/* Inbox card */}
          {isInboxReceived && (
            <div
              className={`bg-[#091926] border-2 rounded-xl p-2.5 shadow-lg transition-all duration-300 ${
                activeHighlight === 'inbox'
                  ? 'border-emerald-400 ring-2 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'border-emerald-500/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white border-b border-white/10 pb-1.5">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Inbox className="w-3.5 h-3.5" /> Live Enquiry Inbox
                </span>
                <span className="text-[8.5px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">New Lead</span>
              </div>
              <div className="mt-1.5 text-[10px] text-white/90 space-y-1">
                <p><span className="text-white/50">Name:</span> Tom Murphy</p>
                <p><span className="text-white/50">Job:</span> Slate storm leak</p>
                <p><span className="text-white/50">Location:</span> {sampleTown} (H91...)</p>
              </div>
            </div>
          )}

          {/* Quick Annotation */}
          <div className="bg-white/10 border border-white/15 rounded-xl p-2 backdrop-blur-sm text-[10px] text-white/80">
            <span className="font-bold text-[#E8B08F] block mb-0.5">Catching every enquiry</span>
            Clear next steps on both desktop and mobile so visitors never leave confused.
          </div>
        </div>
      </div>
    </div>
  );
}
