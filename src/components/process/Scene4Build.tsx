import React, { useState } from 'react';
import { Smartphone, Laptop, Phone, CheckCircle2, ArrowRight, MapPin, RotateCcw, Inbox, Sparkles } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene4Build({ progress, isActive, isMobile, onInteract }: SceneProps) {
  const [device, setDevice] = useState<'laptop' | 'phone'>('laptop');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [formDemoStep, setFormDemoStep] = useState<'idle' | 'filling' | 'ready' | 'submitted'>('idle');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';
  const sampleTrade = config.wayOfWorking.sampleTrade || 'roofers';

  // Timing: 20% entrance, 45% main animation (0.20 to 0.65), 20% HOLD (0.65 to 0.85), 15% exit (0.85 to 1.0)
  const enterProgress = Math.min(1, Math.max(0, progress / 0.2));
  const exitProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.15));

  const xOffset = isMobile ? 0 : (1 - enterProgress) * -40 + exitProgress * 40;
  const opacity = isMobile ? 1 : Math.min(enterProgress, 1 - exitProgress);

  const triggerFormDemo = () => {
    if (onInteract) onInteract();
    setHasInteracted(true);
    setFormDemoStep('filling');

    setTimeout(() => {
      setFormDemoStep('ready');
    }, 600);
  };

  const submitFormDemo = () => {
    if (onInteract) onInteract();
    setHasInteracted(true);
    setFormDemoStep('submitted');
  };

  const handleHotspotClick = (key: string) => {
    setActiveHotspot(activeHotspot === key ? null : key);
    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteract) onInteract();
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormDemoStep('idle');
    setActiveHotspot(null);
    setReplayKey((k) => k + 1);
  };

  const hotspots = {
    call: 'Call button: prominent and always accessible on mobile for emergency repairs.',
    quote: 'Quote form: captures homeowner name, phone, and job scope with zero friction.',
    areas: 'Service-area block: explicitly confirms local coverage so visitors do not bounce.',
    header: 'Header: clear branding and license reassurance so customers trust you instantly.',
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
      {/* Top Banner with Device Toggle & Try Form Button */}
      <div className="flex items-center justify-between text-xs text-white/70">
        <div className="flex items-center gap-1.5 p-1 bg-[#13242C] rounded-full border border-white/10">
          <button
            type="button"
            onClick={() => setDevice('laptop')}
            className={`min-h-[32px] px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              device === 'laptop' ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Laptop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('phone')}
            className={`min-h-[32px] px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              device === 'phone' ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!hasInteracted && formDemoStep === 'idle' && (
            <button
              type="button"
              onClick={triggerFormDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E3B896] hover:bg-[#D4A379] text-[#0F2A35] text-xs font-semibold shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try the form</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay mockup animation"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Main Canvas: Mockup Device on Left, Live Enquiry Inbox on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Device Container */}
        <div className="md:col-span-8 bg-[#18262E] rounded-2xl p-3 sm:p-4 border border-white/15 shadow-2xl flex flex-col justify-between">
          {/* Laptop Browser Header / Phone Top */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs text-white/40">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] font-mono text-white/50 truncate max-w-[200px]">
              https://sample-{sampleTrade}-{sampleTown.toLowerCase()}.com
            </span>
            <span className="text-[10px] text-white/40">Tap dots to inspect</span>
          </div>

          {/* Website Canvas */}
          <div
            className={`bg-[#FAF8F5] text-[#0F2A35] rounded-xl p-3 sm:p-4 flex flex-col gap-3 shadow-inner transition-all ${
              device === 'phone' ? 'max-w-[320px] mx-auto' : 'w-full'
            }`}
          >
            {/* Nav Header with Call Button & Hotspot */}
            <div className="relative flex items-center justify-between border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => handleHotspotClick('header')}
                className="font-bold text-xs sm:text-sm tracking-tight text-[#0F2A35] flex items-center gap-1.5 cursor-pointer text-left"
              >
                <span>Sample Roofing {sampleTown}</span>
                <span className="w-2 h-2 rounded-full bg-[#E3B896] animate-ping" />
              </button>

              <button
                type="button"
                onClick={() => handleHotspotClick('call')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E4A5C] hover:bg-[#153B34] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                <Phone className="w-3 h-3 text-[#E3B896]" />
                <span>Call Now</span>
              </button>
            </div>

            {/* Headline & Body */}
            <div>
              <span className="text-[10px] font-bold text-[#1E4A5C] uppercase tracking-wider block">
                Local Trade Specialists
              </span>
              <h4 className="text-sm sm:text-base font-bold text-[#0F2A35] leading-snug">
                Professional Roofing &amp; Roof Repairs in {sampleTown}
              </h4>
            </div>

            {/* Service Area Block with Hotspot */}
            <button
              type="button"
              onClick={() => handleHotspotClick('areas')}
              className="inline-flex items-center gap-1.5 text-xs text-[#1E4A5C] bg-[#DCE9EC]/80 px-2.5 py-1.5 rounded-lg border border-[#1E4A5C]/20 cursor-pointer text-left hover:bg-[#DCE9EC]"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1E4A5C] shrink-0" />
              <span>Serving {sampleTown}, Salthill &amp; County</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E3B896] ml-auto animate-ping" />
            </button>

            {/* Interactive Form Section */}
            <div className="relative bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F2A35]">Get a Fast Estimate</span>
                <button
                  type="button"
                  onClick={() => handleHotspotClick('quote')}
                  className="text-[10px] text-[#1E4A5C] font-semibold underline flex items-center gap-1"
                >
                  <span>Form Hotspot</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E3B896] animate-ping" />
                </button>
              </div>

              {formDemoStep === 'submitted' ? (
                <div className="py-3 flex flex-col items-center justify-center text-center animate-in fade-in">
                  <CheckCircle2 className="w-8 h-8 text-[#2E9E6B] mb-1" />
                  <span className="text-xs font-bold text-[#0F2A35]">Thanks, we've got your request</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Enquiry logged in inbox</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="h-7 bg-slate-100 rounded px-2 text-xs flex items-center text-slate-700">
                    {formDemoStep === 'idle' ? 'Your Name' : 'Tom Murphy'}
                  </div>
                  <div className="h-7 bg-slate-100 rounded px-2 text-xs flex items-center text-slate-700">
                    {formDemoStep === 'idle' ? 'Phone Number' : '087 123 4567'}
                  </div>
                  <button
                    type="button"
                    onClick={formDemoStep === 'ready' ? submitFormDemo : triggerFormDemo}
                    className="min-h-[34px] w-full bg-[#E3B896] hover:bg-[#D4A379] text-[#0F2A35] font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>{formDemoStep === 'ready' ? 'Tap to Send' : 'Try the Form'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Hotspot Annotation Drawer */}
          {activeHotspot && (
            <div className="mt-2.5 p-2.5 bg-[#E3B896]/15 border border-[#E3B896]/40 rounded-xl text-xs text-white/90 animate-in fade-in">
              <strong className="text-[#E3B896] block mb-0.5">Annotation:</strong>
              {hotspots[activeHotspot as keyof typeof hotspots]}
            </div>
          )}
        </div>

        {/* Right Side: Live Enquiry Inbox (Cause and effect demo!) */}
        <div className="md:col-span-4 bg-[#14232B] rounded-2xl border border-white/10 p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs mb-3">
              <span className="font-semibold text-white/80 flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-[#E3B896]" />
                <span>Enquiry Inbox</span>
              </span>
              <span className="text-[10px] text-white/40">Real-time</span>
            </div>

            {formDemoStep === 'submitted' ? (
              <div className="bg-[#18313D] rounded-xl p-3.5 border border-[#E3B896]/40 flex flex-col gap-2 shadow-lg animate-in slide-in-from-left duration-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Tom Murphy</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    New lead
                  </span>
                </div>
                <div className="text-xs text-white/70 space-y-1 bg-white/[0.03] p-2 rounded">
                  <div><strong>Phone:</strong> 087 123 4567</div>
                  <div><strong>Town:</strong> {sampleTown}</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#2E9E6B] font-semibold pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Confirmation delivered to homeowner</span>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center text-white/50 gap-2">
                <Inbox className="w-8 h-8 text-white/30" />
                <p className="text-xs max-w-[180px]">
                  When a homeowner completes the form, details drop directly into your inbox.
                </p>
                <button
                  type="button"
                  onClick={triggerFormDemo}
                  className="mt-1 text-xs text-[#E3B896] underline font-semibold cursor-pointer"
                >
                  Test it now
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-white/60 mt-4 leading-relaxed border-t border-white/10 pt-3">
            Cause &amp; effect: Obvious contact options convert visitors before they leave for a competitor.
          </p>
        </div>
      </div>
    </div>
  );
}
