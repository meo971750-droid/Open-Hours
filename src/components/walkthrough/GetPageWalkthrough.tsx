import React, { useEffect, useRef, useState, useCallback } from 'react';
import Scene1 from './Scene1';
import Scene2 from './Scene2';
import Scene3 from './Scene3';

// SCENE_DURATIONS in seconds: [4.2, 4.8, 3.8] (total 12.8s)
export const SCENE_DURATIONS = [4.2, 4.8, 3.8] as const;

export const CAPTIONS = [
  '1. You apply on our website',
  '2. We verify your details and hand over your page',
  '3. A surprise is waiting for you',
] as const;

export const STEP_PILLS = [
  '1 Apply',
  '2 Hand over',
  '3 Surprise',
] as const;

interface GetPageWalkthroughProps {
  onHighlightChange?: (rowIndex: number) => void;
  shouldReduceMotion?: boolean;
}

export default function GetPageWalkthrough({
  onHighlightChange,
  shouldReduceMotion = false,
}: GetPageWalkthroughProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Active scene index (0, 1, or 2)
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  // Time tracking ref for single requestAnimationFrame loop
  const animStateRef = useRef<{
    activeScene: number;
    sceneElapsed: number; // seconds into current scene
    lastTimestamp: number | null;
    isIntersecting: boolean;
    isTabVisible: boolean;
    isTransitioning: boolean;
    transitionDirection: 'none' | 'in' | 'out';
  }>({
    activeScene: 0,
    sceneElapsed: 0,
    lastTimestamp: null,
    isIntersecting: false,
    isTabVisible: true,
    isTransitioning: false,
    transitionDirection: 'none',
  });

  // Scene transition visual style refs to bypass per-frame React state
  const sceneWrapperRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const sceneProgressRef = useRef<number>(0);
  const [, setRerenderTick] = useState(0);

  // ResizeObserver to calculate logical 560 x 420 scale transform
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const handleResize = () => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth === 0 || clientHeight === 0) return;
      const s = Math.min(clientWidth / 560, clientHeight / 420);
      setScale(Math.max(0.4, Math.min(1.2, s)));
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    handleResize();

    return () => ro.disconnect();
  }, []);

  // Update right card highlight according to spec:
  // Scene 1: row 1 from 0.3s
  // Scene 2: row 2 at 0.3s, row 3 at 1.5s, row 4 at 3.0s (stays until next)
  // Scene 3: row 5 at 0.5s
  const lastReportedRow = useRef<number>(-1);
  const reportHighlight = useCallback(
    (rowIndex: number) => {
      if (lastReportedRow.current !== rowIndex) {
        lastReportedRow.current = rowIndex;
        onHighlightChange?.(rowIndex);
      }
    },
    [onHighlightChange]
  );

  // Visibility & Intersection Observer
  useEffect(() => {
    if (shouldReduceMotion) {
      reportHighlight(-1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        animStateRef.current.isIntersecting = entry.isIntersecting && entry.intersectionRatio >= 0.4;
      },
      { threshold: [0, 0.4, 0.8] }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleVisibility = () => {
      animStateRef.current.isTabVisible = !document.hidden;
      // Resume from start of current scene if returning
      if (!document.hidden) {
        animStateRef.current.lastTimestamp = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [shouldReduceMotion, reportHighlight]);

  // Main RAF Animation Loop (time-based, refs + DOM writes)
  useEffect(() => {
    if (shouldReduceMotion) return;

    let rafId: number;

    const step = (timestamp: number) => {
      const state = animStateRef.current;

      if (!state.lastTimestamp) {
        state.lastTimestamp = timestamp;
      }

      const delta = (timestamp - state.lastTimestamp) / 1000;
      state.lastTimestamp = timestamp;

      // Only advance if visible in viewport >= 40% and tab is active
      if (state.isIntersecting && state.isTabVisible && delta < 0.25) {
        state.sceneElapsed += delta;
        const currentDuration = SCENE_DURATIONS[state.activeScene];

        // Highlight mapping logic
        if (state.activeScene === 0) {
          if (state.sceneElapsed >= 0.3) {
            reportHighlight(0); // Row 1
          }
        } else if (state.activeScene === 1) {
          if (state.sceneElapsed >= 3.0) {
            reportHighlight(3); // Row 4
          } else if (state.sceneElapsed >= 1.5) {
            reportHighlight(2); // Row 3
          } else if (state.sceneElapsed >= 0.3) {
            reportHighlight(1); // Row 2
          }
        } else if (state.activeScene === 2) {
          if (state.sceneElapsed >= 0.5) {
            reportHighlight(4); // Row 5
          }
        }

        // Scene transition check
        // Scene transition is 260ms (outgoing fades and rises 8px, incoming rises 10px)
        const transitionWindow = 0.26;
        if (state.sceneElapsed >= currentDuration) {
          // Advance to next scene
          const nextScene = (state.activeScene + 1) % 3;
          state.activeScene = nextScene;
          state.sceneElapsed = 0;
          setActiveSceneIndex(nextScene);
        }

        // Calculate progress for current scene (0 to 1)
        const progress = Math.min(1, Math.max(0, state.sceneElapsed / currentDuration));
        sceneProgressRef.current = progress;

        // Transition styling on scene wrapper
        if (sceneWrapperRef.current) {
          if (state.sceneElapsed < transitionWindow) {
            // Incoming rises 10px, fades in
            const inProg = state.sceneElapsed / transitionWindow;
            const y = (1 - inProg) * 10;
            sceneWrapperRef.current.style.transform = `translateY(${y}px)`;
            sceneWrapperRef.current.style.opacity = `${inProg}`;
          } else if (state.sceneElapsed > currentDuration - transitionWindow) {
            // Outgoing fades and rises 8px
            const outProg = (state.sceneElapsed - (currentDuration - transitionWindow)) / transitionWindow;
            const y = -outProg * 8;
            sceneWrapperRef.current.style.transform = `translateY(${y}px)`;
            sceneWrapperRef.current.style.opacity = `${1 - outProg}`;
          } else {
            sceneWrapperRef.current.style.transform = 'translateY(0px)';
            sceneWrapperRef.current.style.opacity = '1';
          }
        }

        // Caption fade-in (300ms after scene starts)
        if (captionRef.current) {
          const capOpacity = Math.min(1, Math.max(0, (state.sceneElapsed - 0.3) / 0.3));
          captionRef.current.style.opacity = `${capOpacity}`;
        }

        // Trigger tick for sub-scenes progress
        setRerenderTick((t) => (t + 1) % 100000);
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion, reportHighlight]);

  // Reduced motion: show Scene 3's final picture statically with the three captions as plain lines under it
  if (shouldReduceMotion) {
    return (
      <div
        className="w-full flex flex-col justify-between"
        role="region"
        aria-label="Walkthrough overview"
      >
        <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <Scene3 progress={1} />
          </div>
        </div>

        {/* Static three captions under it */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-left text-[14px] text-white/90">
          {CAPTIONS.map((cap, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E3B896]" />
              <span>{cap}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450px] sm:h-[470px] flex flex-col justify-between overflow-hidden"
      aria-hidden="true"
    >
      {/* Top Bar / Chip "Illustrative walkthrough" */}
      <div className="relative z-20 flex items-center justify-between pb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 text-[12px] font-medium backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-[#2E9E6B]" />
          <span>Illustrative walkthrough</span>
        </span>
        <span className="text-[11px] text-white/50 font-medium">
          fictional demo
        </span>
      </div>

      {/* Main Scaled Canvas Stage (Logical 560 x 420) */}
      <div
        ref={stageRef}
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden"
      >
        <div
          ref={sceneWrapperRef}
          style={{
            width: '560px',
            height: '420px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
          }}
          className="relative shrink-0 flex items-center justify-center"
        >
          {activeSceneIndex === 0 && (
            <Scene1 progress={sceneProgressRef.current} />
          )}
          {activeSceneIndex === 1 && (
            <Scene2 progress={sceneProgressRef.current} />
          )}
          {activeSceneIndex === 2 && (
            <Scene3 progress={sceneProgressRef.current} />
          )}
        </div>
      </div>

      {/* Bottom Bar: Step Pills (Bottom-Left) & Caption Strip */}
      <div className="relative z-20 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Step pills: "1 Apply" | "2 Hand over" | "3 Surprise" */}
        <div
          className="flex items-center gap-1.5 p-1 rounded-full bg-white/10 border border-white/10 shrink-0"
          aria-hidden="true"
        >
          {STEP_PILLS.map((pill, idx) => {
            const isActive = activeSceneIndex === idx;
            return (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E3B896] text-[#0F2A35] shadow-xs'
                    : 'text-white/60'
                }`}
              >
                {pill}
              </span>
            );
          })}
        </div>

        {/* Caption (Bottom Strip, 17px, weight 500, white on a translucent dark strip) */}
        <div
          ref={captionRef}
          className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-xs border border-white/10 text-[17px] font-medium text-white tracking-tight leading-snug w-full sm:w-auto text-left sm:text-right"
        >
          {CAPTIONS[activeSceneIndex]}
        </div>
      </div>
    </div>
  );
}
