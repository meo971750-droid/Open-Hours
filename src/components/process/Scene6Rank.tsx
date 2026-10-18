import React, { useState, useRef } from 'react';
import { Calendar, RotateCcw, ExternalLink, ShieldAlert, Sliders } from 'lucide-react';
import { SceneProps } from './types';

export default function Scene6Rank({ progress, isActive, isMobile, onInteract }: SceneProps) {
  const [timePct, setTimePct] = useState<number>(35); // 0 to 100 percentage
  const [hasInteracted, setHasInteracted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Timing: 20% entrance, 45% main animation (0.20 to 0.65), 20% HOLD (0.65 to 0.85), 15% exit (0.85 to 1.0)
  const enterProgress = Math.min(1, Math.max(0, progress / 0.2));
  const exitProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.15));

  const xOffset = isMobile ? 0 : (1 - enterProgress) * -40 + exitProgress * 40;
  const opacity = isMobile ? 1 : Math.min(enterProgress, 1 - exitProgress);

  // Auto-progress drives the time handle if visitor has not manually scrubbed
  const autoTimePct = isMobile ? 70 : Math.min(100, Math.max(0, ((progress - 0.2) / 0.45) * 100));
  const effectivePct = hasInteracted ? timePct : autoTimePct;

  // Timeline markers from Week 1 to Month 6
  const milestones = [
    { label: 'Week 1', pct: 0 },
    { label: 'Month 2', pct: 33 },
    { label: 'Month 4', pct: 66 },
    { label: 'Month 6', pct: 100 },
  ];

  const handlePointerDown = (e: React.PointerEvent) => {
    if (onInteract) onInteract();
    setHasInteracted(true);
    const track = trackRef.current;
    if (!track) return;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const rect = track.getBoundingClientRect();
      const relativeX = moveEvent.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
      setTimePct(pct);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setTimePct((p) => Math.max(0, p - 8));
      if (!hasInteracted) {
        setHasInteracted(true);
        if (onInteract) onInteract();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setTimePct((p) => Math.min(100, p + 8));
      if (!hasInteracted) {
        setHasInteracted(true);
        if (onInteract) onInteract();
      }
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(false);
    setTimePct(35);
    setReplayKey((k) => k + 1);
  };

  // State of "Your business" in the list:
  // Week 1 (0-30%): "Not listed"
  // Month 2 (30-55%): "Indexing & appearing"
  // Month 4+ (55-100%): "Appearing in local results" (settled in 3rd place, NEVER #1)
  const isListed = effectivePct >= 50;

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
      {/* Top Banner with Scrubber hint & Replay */}
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="font-semibold text-[#E3B896] uppercase tracking-wider text-[11px]">
          Honest Timeline Evolution
        </span>

        <div className="flex items-center gap-2">
          {!hasInteracted && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E3B896]/20 border border-[#E3B896]/40 text-[#E3B896] text-[11px] font-medium animate-pulse">
              <Sliders className="w-3 h-3 text-[#E3B896]" />
              <span>Drag timeline scrubber</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay timeline animation"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Main Scrubber Stage */}
      <div className="bg-[#13242C] rounded-2xl border border-white/10 p-5 sm:p-7 flex flex-col gap-5 shadow-xl">
        {/* Interactive Timeline Scrubber Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-white/70">
            <span className="flex items-center gap-1.5 text-white/90">
              <Calendar className="w-3.5 h-3.5 text-[#E3B896]" />
              <span>Time Elapsed:</span>
            </span>
            <span className="font-mono text-[#E3B896] font-bold text-sm">
              {effectivePct < 25 ? 'Week 1' : effectivePct < 55 ? 'Month 2' : effectivePct < 85 ? 'Month 4' : 'Month 6'}
            </span>
          </div>

          {/* Draggable Track Container */}
          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            style={{ touchAction: 'pan-y' }}
            className="relative h-10 flex items-center cursor-ew-resize py-2"
          >
            {/* Background track line */}
            <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden">
              <div
                style={{ width: `${effectivePct}%` }}
                className="h-full bg-[#E3B896] transition-[width] duration-75"
              />
            </div>

            {/* Draggable Scrubber Knob */}
            <div
              role="slider"
              aria-label="Timeline scrubber"
              aria-valuenow={Math.round(effectivePct)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              style={{ left: `${effectivePct}%` }}
              className="absolute -translate-x-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none"
            >
              <div className="w-6 h-6 rounded-full bg-[#E3B896] border-2 border-white shadow-xl flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 transition-transform" />
            </div>
          </div>

          {/* Milestone Labels */}
          <div className="grid grid-cols-4 text-center mt-1">
            {milestones.map((m) => {
              const passed = effectivePct >= m.pct;
              return (
                <div key={m.label} className="flex flex-col items-center">
                  <span className={`text-xs font-bold transition-colors ${passed ? 'text-[#E3B896]' : 'text-white/40'}`}>
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Local Results List reacting live to the scrubber */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Illustrative Local Search Pack at this stage:
          </span>

          {/* Listing 1: Sample Co. A */}
          <div className="bg-[#182C37] rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-white">Sample Roofing Co. A</span>
              <p className="text-[11px] text-white/50">Established profile · Long-standing business</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white/60 text-[11px]">Local result</span>
          </div>

          {/* Listing 2: Sample Co. B */}
          <div className="bg-[#182C37] rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-white">Sample Roofing Co. B</span>
              <p className="text-[11px] text-white/50">Regional coverage · Active presence</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white/60 text-[11px]">Local result</span>
          </div>

          {/* Listing 3: Your Business (Gradually enters the list in 3rd place, never in first place!) */}
          <div
            className={`rounded-xl p-3 border transition-all duration-500 flex items-center justify-between text-xs ${
              isListed
                ? 'bg-[#E3B896]/15 border-[#E3B896] text-white shadow-md'
                : 'bg-white/[0.03] border-dashed border-white/20 text-white/40'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#E3B896]">Your business</span>
                {isListed ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Appearing in local search
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                    Not listed yet (building foundations)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/70 mt-0.5">
                {isListed
                  ? 'Website active · Verified address & service radius established'
                  : 'Site indexing and crawl validation underway'}
              </p>
            </div>

            {isListed && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1E4A5C] text-white text-[11px] font-semibold">
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>

        {/* Permanent Line Under It */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70 bg-[#0F1E26] p-3 rounded-xl">
          <div className="flex items-center gap-2 text-amber-300 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Rankings take months. Nobody can promise a position.</span>
          </div>
          <span className="text-white/40 text-[11px] hidden sm:inline">Illustrative example</span>
        </div>
      </div>
    </div>
  );
}
