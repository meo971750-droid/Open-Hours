import React, { useState, useRef } from 'react';
import { Search, MousePointer, Globe, PhoneCall, CheckCircle2, AlertTriangle, Check, RotateCcw, SlidersHorizontal, UserCheck } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export function getActiveFrictionPairs() {
  const features = config.features;
  const rawPairs = config.wayOfWorking.scenes.find((s) => s.id === 'solve')?.pairs || [];
  return rawPairs.filter((pair) => {
    if (!pair.requiresFlag) return true;
    if (pair.requiresFlag === 'afterHours') {
      return Boolean(features.missedCallTextBack || features.afterHoursAutoReply || features.voiceAgent);
    }
    if (pair.requiresFlag === 'enquiryTracking') {
      return Boolean(features.enquiryTracking);
    }
    return true;
  });
}

export default function Scene3Solve({ progress, isActive, isMobile, onInteract }: SceneProps) {
  const [sliderPos, setSliderPos] = useState<number>(65); // 0 to 100 percentage
  const [fixedState, setFixedState] = useState<Record<string, boolean>>({
    'No website to click': true,
    'Hard to contact on mobile': true,
    'Missed call after hours': true,
    'No follow-up': true,
  });
  const [hasInteracted, setHasInteracted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Timing: 20% entrance, 45% main animation (0.20 to 0.65), 20% HOLD (0.65 to 0.85), 15% exit (0.85 to 1.0)
  const enterProgress = Math.min(1, Math.max(0, progress / 0.2));
  const exitProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.15));

  const xOffset = isMobile ? 0 : (1 - enterProgress) * -40 + exitProgress * 40;
  const opacity = isMobile ? 1 : Math.min(enterProgress, 1 - exitProgress);

  const activePairs = getActiveFrictionPairs();

  const handlePointerDown = (e: React.PointerEvent) => {
    if (onInteract) onInteract();
    setHasInteracted(true);
    const container = sliderContainerRef.current;
    if (!container) return;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = moveEvent.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
      setSliderPos(pct);
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
      setSliderPos((p) => Math.max(0, p - 5));
      if (!hasInteracted) {
        setHasInteracted(true);
        if (onInteract) onInteract();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((p) => Math.min(100, p + 5));
      if (!hasInteracted) {
        setHasInteracted(true);
        if (onInteract) onInteract();
      }
    }
  };

  const toggleFix = (problem: string) => {
    setFixedState((prev) => ({
      ...prev,
      [problem]: !prev[problem],
    }));
    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteract) onInteract();
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSliderPos(65);
    setFixedState({
      'No website to click': true,
      'Hard to contact on mobile': true,
      'Missed call after hours': true,
      'No follow-up': true,
    });
    setReplayKey((k) => k + 1);
  };

  const nodes = [
    { id: 'search', title: 'Search', icon: Search },
    { id: 'click', title: 'Click', icon: MousePointer },
    { id: 'website', title: 'Website', icon: Globe },
    { id: 'enquiry', title: 'Call / form', icon: PhoneCall },
    { id: 'followup', title: 'Follow-up', icon: CheckCircle2 },
  ];

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
      {/* Top Banner with Slider Hint & Replay */}
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="font-semibold text-[#E3B896] uppercase tracking-wider text-[11px]">
          Before &amp; After Comparison
        </span>

        <div className="flex items-center gap-2">
          {!hasInteracted && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E3B896]/20 border border-[#E3B896]/40 text-[#E3B896] text-[11px] font-medium animate-pulse">
              <SlidersHorizontal className="w-3 h-3 text-[#E3B896]" />
              <span>Drag slider or click chips below</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay comparison"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Main Draggable Comparison Stage */}
      <div
        ref={sliderContainerRef}
        onPointerDown={handlePointerDown}
        style={{ touchAction: 'pan-y' }}
        className="relative bg-[#13242C] rounded-2xl border border-white/10 p-5 sm:p-7 min-h-[350px] flex flex-col justify-between overflow-hidden shadow-xl cursor-ew-resize select-none"
      >
        {/* Left Side: Before Label */}
        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider pointer-events-none">
          Before: Broken journey
        </div>

        {/* Right Side: After Label */}
        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider pointer-events-none">
          After: Solved &amp; seamless
        </div>

        {/* Comparison Line Layer (Full Width Track) */}
        <div className="relative my-10 py-6 pointer-events-none">
          {/* Base Red Dashed Broken Line (Before) */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2">
            <svg className="w-full h-8" preserveAspectRatio="none">
              <line
                x1="0"
                y1="16"
                x2="100%"
                y2="16"
                stroke="#F43F5E"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          {/* Solid Green Fixed Line (After side revealed by slider) */}
          <div
            style={{ width: `${sliderPos}%` }}
            className="absolute left-6 top-1/2 -translate-y-1/2 overflow-hidden transition-[width] duration-75"
          >
            <svg className="w-full h-8" style={{ width: '800px' }} preserveAspectRatio="none">
              <line
                x1="0"
                y1="16"
                x2="100%"
                y2="16"
                stroke="#2E9E6B"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* The 5 Journey Nodes */}
          <div className="relative z-10 grid grid-cols-5 gap-2 items-center">
            {nodes.map((node, idx) => {
              const Icon = node.icon;
              const nodePct = (idx / (nodes.length - 1)) * 100;
              const isFixed = nodePct <= sliderPos;

              return (
                <div key={node.id} className="flex flex-col items-center text-center">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      isFixed
                        ? 'bg-[#153B34] border-2 border-[#2E9E6B] text-[#2E9E6B]'
                        : 'bg-[#2A1820] border-2 border-rose-500/60 text-rose-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-white mt-1.5">{node.title}</span>
                </div>
              );
            })}
          </div>

          {/* Figure completing journey at the right end */}
          <div
            style={{
              opacity: sliderPos >= 85 ? 1 : 0.3,
              transition: 'opacity 0.4s ease-out',
            }}
            className="absolute right-6 -top-4 flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-[11px]">Job booked</span>
          </div>
        </div>

        {/* Draggable Vertical Divider Handle */}
        <div
          role="slider"
          aria-label="Comparison slider"
          aria-valuenow={Math.round(sliderPos)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ left: `${sliderPos}%` }}
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 -translate-x-1/2 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3B896]"
        >
          <div className="w-8 h-8 rounded-full bg-[#E3B896] text-[#0F2A35] flex items-center justify-center shadow-2xl font-bold text-xs ring-4 ring-[#0F2A35]">
            ↔
          </div>
        </div>

        {/* Bottom Interactive Friction-to-Fix Toggle Chips */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 items-center justify-center">
          {activePairs.map((pair) => {
            const isFixed = fixedState[pair.problem] ?? true;
            return (
              <button
                key={pair.problem}
                type="button"
                onClick={() => toggleFix(pair.problem)}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                  isFixed
                    ? 'bg-[#153B34] border-[#2E9E6B]/60 text-emerald-200'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                }`}
              >
                {isFixed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2E9E6B] shrink-0" />
                    <span>{pair.fix}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="line-through">{pair.problem}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Calm Summary Footer */}
        <div className="mt-3 text-center text-xs text-white/50">
          From search to booked job, with fewer drop-offs · Drag the handle to inspect before &amp; after
        </div>
      </div>
    </div>
  );
}
