import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { config } from '../config';
import {
  Scene1Searches,
  Scene2Journey,
  Scene3Solve,
  Scene4Build,
  Scene5Findable,
  Scene6Rank,
  Scene7AlwaysOn,
  Scene8Talk,
} from '../components/process';

interface OurProcessProps {
  onOpenAudit?: () => void;
}

export default function OurProcess({ onOpenAudit }: OurProcessProps) {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Raw scroll target and smoothed lerp progress
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Viewport resize listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine active scenes and total scroll distance from config.wayOfWorking.pace
  const { scenes: activeScenes, totalVh, sceneSlices } = useMemo(() => {
    const features = config.features;
    const canShowAlwaysOn = Boolean(
      features.voiceAgent ||
      features.missedCallTextBack ||
      features.afterHoursAutoReply ||
      features.enquiryTracking
    );

    const baseScenes = config.wayOfWorking.scenes;
    const filtered = canShowAlwaysOn
      ? baseScenes
      : baseScenes.filter((s) => s.id !== 'always-on');

    // Dynamically format tabs with clean sequential 2-digit numbers: 01 Searches, 02 Journey, 03 Solve, etc.
    const formatted = filtered.map((scene, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      const baseLabel = scene.tab.replace(/^\d+\s*/, '');
      return {
        ...scene,
        tab: `${num} ${baseLabel}`,
      };
    });

    const pace = config.wayOfWorking.pace;
    const getSceneVh = (id: string) => {
      if (id === 'rank') return pace.rankSceneVh || 260;
      if (id === 'solve') return pace.solveSceneVh || 220;
      if (id === 'talk') return pace.ctaSceneVh || 120;
      return pace.scrollPerSceneVh || 200;
    };

    const sumVh = formatted.reduce((acc, s) => acc + getSceneVh(s.id), 0);

    let cumulativeVh = 0;
    const slices = formatted.map((s) => {
      const vh = getSceneVh(s.id);
      const start = cumulativeVh / sumVh;
      cumulativeVh += vh;
      const end = cumulativeVh / sumVh;
      return { id: s.id, start, end, vh };
    });

    return { scenes: formatted, totalVh: sumVh, sceneSlices: slices };
  }, []);

  const totalScenes = activeScenes.length;

  // Passive scroll listener + 60fps lerp inertia smoothing (factor ~0.08)
  useEffect(() => {
    if (isMobile || shouldReduceMotion) return;

    let rafId: number;

    const updateScrollTarget = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) {
        targetProgressRef.current = 0;
        return;
      }

      const currentScroll = -rect.top;
      const raw = currentScroll / scrollableDistance;
      targetProgressRef.current = Math.max(0, Math.min(1, raw));
    };

    const animate = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0001) {
        // Lerp factor ~0.08 per frame for butter-smooth inertia
        const next = current + diff * 0.08;
        currentProgressRef.current = next;
        setDisplayProgress(next);
      } else if (current !== target) {
        currentProgressRef.current = target;
        setDisplayProgress(target);
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    updateScrollTarget();
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', updateScrollTarget);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile, shouldReduceMotion]);

  // Current active scene and local progress (0 to 1) based on custom scene slice ranges
  const { activeIndex, localProgress } = useMemo(() => {
    if (sceneSlices.length === 0) return { activeIndex: 0, localProgress: 0 };
    const p = displayProgress;
    let idx = sceneSlices.findIndex((s) => p >= s.start && p < s.end);
    if (idx === -1) {
      idx = p >= 1 ? sceneSlices.length - 1 : 0;
    }
    const slice = sceneSlices[idx];
    const sliceRange = slice.end - slice.start;
    const lp = sliceRange > 0 ? (p - slice.start) / sliceRange : 0;
    return {
      activeIndex: idx,
      localProgress: Math.max(0, Math.min(1, lp)),
    };
  }, [displayProgress, sceneSlices]);

  // Smooth scroll to a specific scene
  const scrollToScene = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const containerTop = containerRef.current.offsetTop;
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      const slice = sceneSlices[index];
      // Scroll to mid-hold point of scene
      const fraction = slice ? (slice.start + slice.end) / 2 : index / totalScenes;
      const targetScroll = containerTop + fraction * scrollableDistance;

      window.scrollTo({
        top: targetScroll,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    },
    [sceneSlices, totalScenes, shouldReduceMotion]
  );

  // Keyboard navigation for tablist (ArrowLeft, ArrowRight)
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % totalScenes;
      scrollToScene(nextIndex);
      const nextTab = tablistRef.current?.children[nextIndex] as HTMLButtonElement;
      nextTab?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + totalScenes) % totalScenes;
      scrollToScene(prevIndex);
      const prevTab = tablistRef.current?.children[prevIndex] as HTMLButtonElement;
      prevTab?.focus();
    }
  };

  // Helper to render scene visual component
  const renderSceneVisual = (sceneId: string, currentLocalProgress: number, isActive: boolean, mobileMode = false) => {
    switch (sceneId) {
      case 'searches':
        return <Scene1Searches progress={currentLocalProgress} isActive={isActive} isMobile={mobileMode} />;
      case 'journey':
        return <Scene2Journey progress={currentLocalProgress} isActive={isActive} isMobile={mobileMode} />;
      case 'solve':
        return <Scene3Solve progress={currentLocalProgress} isActive={isActive} isMobile={mobileMode} />;
      case 'build':
        return <Scene4Build progress={currentLocalProgress} isActive={isActive} isMobile={mobileMode} />;
      case 'findable':
        return <Scene5Findable progress={currentLocalProgress} isActive={isActive} isMobile={mobileMode} />;
      case 'rank':
        return <Scene6Rank progress={currentLocalProgress} isActive={isActive} isMobile={mobileMode} />;
      case 'always-on':
        return <Scene7AlwaysOn progress={currentLocalProgress} isActive={isActive} isMobile={mobileMode} />;
      case 'talk':
        return (
          <Scene8Talk
            progress={currentLocalProgress}
            isActive={isActive}
            isMobile={mobileMode}
            onOpenAudit={onOpenAudit}
          />
        );
      default:
        return null;
    }
  };

  // --------------------------------------------------------------------------
  // Mobile & Reduced-Motion Fallback: Stacked static / animated panels
  // --------------------------------------------------------------------------
  if (isMobile || shouldReduceMotion) {
    return (
      <section
        id="process"
        aria-label={config.wayOfWorking.title}
        className="relative w-full bg-[#0F2A35] text-white py-16 px-4 sm:px-6"
      >
        <div id="how-it-works" className="absolute top-0 left-0 scroll-mt-24 pointer-events-none" />

        {/* Section Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#E3B896] bg-[#E3B896]/10 px-3.5 py-1.5 rounded-full border border-[#E3B896]/20">
            {config.wayOfWorking.title}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-4">
            How we take you from invisible to booked
          </h2>
          <p className="text-sm text-white/70 mt-2 max-w-xl mx-auto">
            A transparent look at the exact technical and conversion steps we follow.
          </p>
        </div>

        {/* Stacked Panels */}
        <div className="max-w-4xl mx-auto space-y-16">
          {activeScenes.map((scene) => (
            <div
              key={scene.id}
              className="bg-[#13242C] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col gap-6"
            >
              {/* Scene Header */}
              <div>
                <span className="text-xs font-bold text-[#E3B896] uppercase tracking-wider block mb-1">
                  {scene.tab}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {scene.headline}
                </h3>
                <p className="text-sm text-white/70 mt-1.5 leading-relaxed">{scene.text}</p>
              </div>

              {/* Scene Visual Body */}
              <div className="w-full">{renderSceneVisual(scene.id, 0.5, true, true)}</div>

              {/* Caption */}
              <div className="text-[11px] text-white/40 text-right border-t border-white/10 pt-3">
                {scene.caption}
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="max-w-4xl mx-auto mt-12 text-center text-xs text-white/50">
          Illustrative story. Search results vary and take time to build. We never promise rankings or a set number of enquiries.
        </div>
        <div id="after-process" />
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // Desktop Full-Screen Scroll-Driven Experience
  // --------------------------------------------------------------------------
  const currentScene = activeScenes[activeIndex] || activeScenes[0];

  return (
    <section
      ref={containerRef}
      id="process"
      aria-label={config.wayOfWorking.title}
      className="relative w-full bg-[#0F2A35] text-white"
      style={{
        height: `${totalVh}vh`,
      }}
    >
      {/* Anchor for backward compatibility with #how-it-works navigation */}
      <div id="how-it-works" className="absolute top-0 left-0 scroll-mt-24 pointer-events-none" />

      {/* Screen reader skip link */}
      <a
        href="#after-process"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#0F2A35] focus:rounded-lg focus:shadow-lg focus:font-semibold"
      >
        Skip this section
      </a>

      {/* Sticky Full-Viewport Stage */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-[100svh] w-full flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-5 select-none"
      >
        {/* ===================================================================
            HEADER: Title & Numbered Pill Tabs (Fit on 1280px Screen)
           =================================================================== */}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-1">
          {/* Section Title */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#E3B896] animate-pulse" />
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight whitespace-nowrap">
              {config.wayOfWorking.title}
            </h2>
          </div>

          {/* Numbered Pill Tabs (role="tablist"): Single row on >=1024px, scrollable on narrow */}
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Story chapters"
            className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#13242C] rounded-full border border-white/10 shadow-md overflow-x-auto no-scrollbar max-w-full"
          >
            {activeScenes.map((scene, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={scene.id}
                  role="tab"
                  id={`tab-${scene.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${scene.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => scrollToScene(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`relative px-2.5 sm:px-3 py-1 rounded-full text-[11px] xl:text-xs font-medium transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-white/15 text-white ring-1 ring-[#E3B896]/60 shadow-sm'
                      : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  <span className="relative z-10">{scene.tab}</span>

                  {/* Tiny progress fill bar inside active pill tab */}
                  {isSelected && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E3B896] transition-all duration-75"
                      style={{
                        width: `${Math.min(100, Math.max(0, localProgress * 100))}%`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            MAIN STAGE: Active Scene Content (Headline, Supporting Line, Visual)
           =================================================================== */}
        <div
          id={`panel-${currentScene.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentScene.id}`}
          className="w-full max-w-5xl mx-auto my-auto flex flex-col justify-center py-2"
        >
          {/* Scene Header */}
          <div className="mb-3 sm:mb-5 text-center max-w-3xl mx-auto">
            <h3 className="text-[clamp(1.5rem,3vw,2.35rem)] font-bold text-white leading-[1.12] tracking-[-0.03em]">
              {currentScene.headline}
            </h3>
            <p className="text-xs sm:text-sm md:text-[15px] text-white/70 mt-1 leading-relaxed">
              {currentScene.text}
            </p>
          </div>

          {/* Active Scene Visual with Staggered Entrance & 20% Hold Phase */}
          <div className="w-full relative">
            {renderSceneVisual(currentScene.id, localProgress, true, false)}
          </div>

          {/* Scene Caption / Attribution */}
          <div className="text-[11px] text-white/40 text-center mt-2 sm:mt-3">
            {currentScene.caption}
          </div>
        </div>

        {/* ===================================================================
            FOOTER: Scroll Hint, Footnote, and Overall Progress Bar
           =================================================================== */}
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 pb-2 text-[11px] text-white/50 border-t border-white/10 pt-2">
          {/* Scroll Hint (fades out as you advance past scene 1) */}
          <div
            style={{
              opacity: Math.max(0, 1 - displayProgress * 5),
              transition: 'opacity 0.3s linear',
            }}
            className="flex items-center gap-1.5 text-white/70 font-medium"
          >
            <ChevronDown className="w-3.5 h-3.5 text-[#E3B896] animate-bounce" />
            <span>Scroll down to advance</span>
          </div>

          {/* Footnote statement */}
          <div className="text-center sm:text-right max-w-xl text-white/50">
            Illustrative story. Search results vary and take time to build. We never promise rankings or a set number of enquiries.
          </div>
        </div>

        {/* Global Progress Bar at the absolute bottom of the sticky viewport */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 overflow-hidden">
          <div
            className="h-full bg-[#E3B896] transition-transform duration-75 origin-left"
            style={{
              transform: `scaleX(${displayProgress})`,
            }}
          />
        </div>
      </div>

      {/* Target for skip link */}
      <div id="after-process" className="h-0 w-0" />
    </section>
  );
}
