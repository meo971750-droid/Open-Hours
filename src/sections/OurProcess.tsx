import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useReducedMotion } from 'motion/react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
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
import { ScenePalette } from '../components/process/types';

interface OurProcessProps {
  onOpenAudit?: () => void;
}

export default function OurProcess({ onOpenAudit }: OurProcessProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Active Scenes based on feature flags
  const activeScenes = useMemo(() => {
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

    const pills = [
      '01 · The problem',
      '02 · The journey',
      '03 · What we fix',
      '04 · The build',
      '05 · Clear signals',
      '06 · Time passing',
      '07 · Always on',
      '08 · Next step',
    ];

    return filtered.map((scene, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      const baseLabel = scene.tab.replace(/^\d+\s*/, '');
      return {
        ...scene,
        tab: `${num} ${baseLabel}`,
        pillLabel: pills[idx] || `${num} · ${baseLabel}`,
        paletteKey: `s${idx + 1}`,
      };
    });
  }, []);

  const totalScenes = activeScenes.length;

  // Autoplay State
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // IntersectionObserver:
  // Starts when >= 60% is visible; pauses when < 30% is visible.
  useEffect(() => {
    if (shouldReduceMotion) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.6) {
            setIsSectionVisible(true);
            setIsPlaying(true);
          } else if (entry.intersectionRatio < 0.3) {
            setIsSectionVisible(false);
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: [0.3, 0.6],
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  // Tab visibility listener (pause on hidden tab, resume when visible if in view)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPlaying(false);
      } else if (isSectionVisible) {
        setIsPlaying(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isSectionVisible]);

  // Durations from config.wayOfWorking.timing
  const timingConfig = config.wayOfWorking.timing || {
    s1: 10000,
    s2: 11000,
    s3: 10000,
    s4: 11000,
    s5: 10000,
    s6: 13000,
    s7: 11000,
    s8: 0,
    speed: 1,
    pauseOnHover: false,
  };

  const getSceneDuration = useCallback(
    (idx: number) => {
      const key = `s${idx + 1}` as keyof typeof timingConfig;
      const raw = (timingConfig[key] as number) || 10000;
      return raw * (timingConfig.speed || 1);
    },
    [timingConfig]
  );

  // Autoplay Timeline Loop via requestAnimationFrame
  useEffect(() => {
    if (!isPlaying || !isSectionVisible || shouldReduceMotion) return;

    // If on scene 8 (last scene), holds permanently and never loops
    if (currentSceneIdx >= totalScenes - 1) {
      setSceneProgress(1);
      return;
    }

    const duration = getSceneDuration(currentSceneIdx);
    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      setSceneProgress((prev) => {
        const next = prev + delta / duration;
        if (next >= 1) {
          // Transition to next scene
          if (currentSceneIdx < totalScenes - 1) {
            setCurrentSceneIdx((curr) => curr + 1);
            return 0;
          }
          return 1;
        }
        return next;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isSectionVisible, currentSceneIdx, totalScenes, getSceneDuration, shouldReduceMotion]);

  // Scene navigation controls
  const goToScene = useCallback(
    (idx: number) => {
      const bounded = Math.max(0, Math.min(totalScenes - 1, idx));
      setCurrentSceneIdx(bounded);
      setSceneProgress(0);
      setIsPlaying(true);
    },
    [totalScenes]
  );

  const handleNext = () => {
    if (currentSceneIdx < totalScenes - 1) {
      goToScene(currentSceneIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentSceneIdx > 0) {
      goToScene(currentSceneIdx - 1);
    }
  };

  const handleReplay = () => {
    setSceneProgress(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSectionVisible) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ') {
        // Toggle play/pause only if user is not in a text input
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSectionVisible, currentSceneIdx, totalScenes]);

  // Hover pause support if enabled
  const handleMouseEnter = () => {
    if (timingConfig.pauseOnHover) {
      setIsPlaying(false);
    }
  };
  const handleMouseLeave = () => {
    if (timingConfig.pauseOnHover && isSectionVisible) {
      setIsPlaying(true);
    }
  };

  // Active scene & palette
  const activeScene = activeScenes[currentSceneIdx] || activeScenes[0];
  const paletteConfig = config.wayOfWorking.palette || {};
  const currentPalette: ScenePalette =
    (paletteConfig[activeScene.paletteKey as keyof typeof paletteConfig] as ScenePalette) || {
      id: 'default',
      bg: '#0F2A35',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255,255,255,0.7)',
      pillBg: 'rgba(255,255,255,0.1)',
      pillText: '#E3B896',
      pillBorder: 'rgba(227,184,150,0.3)',
      isDark: true,
    };

  // Helper to render current scene visual
  const renderSceneVisual = (sceneId: string, progressVal: number) => {
    switch (sceneId) {
      case 'searches':
        return (
          <Scene1Searches
            progress={progressVal}
            isActive={true}
            isMobile={isMobile}
            palette={currentPalette}
          />
        );
      case 'journey':
        return (
          <Scene2Journey
            progress={progressVal}
            isActive={true}
            isMobile={isMobile}
            palette={currentPalette}
          />
        );
      case 'solve':
        return (
          <Scene3Solve
            progress={progressVal}
            isActive={true}
            isMobile={isMobile}
            palette={currentPalette}
          />
        );
      case 'build':
        return (
          <Scene4Build
            progress={progressVal}
            isActive={true}
            isMobile={isMobile}
            palette={currentPalette}
          />
        );
      case 'findable':
        return (
          <Scene5Findable
            progress={progressVal}
            isActive={true}
            isMobile={isMobile}
            palette={currentPalette}
          />
        );
      case 'rank':
        return (
          <Scene6Rank
            progress={progressVal}
            isActive={true}
            isMobile={isMobile}
            palette={currentPalette}
          />
        );
      case 'always-on':
        return (
          <Scene7AlwaysOn
            progress={progressVal}
            isActive={true}
            isMobile={isMobile}
            palette={currentPalette}
          />
        );
      case 'talk':
        return (
          <Scene8Talk
            progress={progressVal}
            isActive={true}
            isMobile={isMobile}
            palette={currentPalette}
            onOpenAudit={onOpenAudit}
          />
        );
      default:
        return null;
    }
  };

  // --------------------------------------------------------------------------
  // Reduced Motion / No-JS Fallback: Static stacked panels in final state
  // --------------------------------------------------------------------------
  if (shouldReduceMotion) {
    return (
      <section
        id="process"
        aria-label={config.wayOfWorking.title}
        className="relative w-full py-16 px-4 sm:px-6 bg-[#0F2A35]"
      >
        <div id="how-it-works" className="absolute top-0 left-0 scroll-mt-24 pointer-events-none" />

        <div className="max-w-4xl mx-auto mb-12 text-center text-white">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#E3B896] bg-[#E3B896]/10 px-3.5 py-1.5 rounded-full border border-[#E3B896]/20">
            {config.wayOfWorking.title}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-4">
            How we take you from invisible to booked
          </h2>
          <p className="text-sm text-white/70 mt-2 max-w-xl mx-auto">
            A transparent look at the exact technical and conversion steps we follow.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {activeScenes.map((scene, idx) => {
            const pal = (paletteConfig[scene.paletteKey as keyof typeof paletteConfig] as ScenePalette) || currentPalette;
            return (
              <div
                key={scene.id}
                style={{ background: pal.bg }}
                className="rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col gap-6"
              >
                <div>
                  <span
                    style={{
                      backgroundColor: pal.pillBg,
                      color: pal.pillText,
                      borderColor: pal.pillBorder,
                    }}
                    className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border mb-2"
                  >
                    {scene.pillLabel}
                  </span>
                  <h3
                    style={{ color: pal.textPrimary }}
                    className="text-xl sm:text-2xl font-bold leading-snug"
                  >
                    {scene.headline}
                  </h3>
                  <p
                    style={{ color: pal.textSecondary }}
                    className="text-sm mt-1.5 leading-relaxed"
                  >
                    {scene.text}
                  </p>
                </div>

                <div className="w-full min-h-[300px]">
                  {renderSceneVisual(scene.id, 1)}
                </div>

                <div
                  style={{ color: pal.textSecondary }}
                  className="text-[11px] text-right border-t border-black/10 pt-3"
                >
                  {scene.caption}
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto mt-12 text-center text-xs text-white/50">
          Illustrative story. Search results vary and take time to build. We never promise rankings or a set number of enquiries.
        </div>
        <div id="after-process" />
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // Full-Screen Autoplay Story Engine (100svh, never locks scrolling)
  // --------------------------------------------------------------------------
  return (
    <section
      ref={sectionRef}
      id="process"
      aria-label={config.wayOfWorking.title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: currentPalette.bg,
        transition: 'background 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Anchor for backward compatibility with #how-it-works */}
      <div id="how-it-works" className="absolute top-0 left-0 scroll-mt-24 pointer-events-none" />

      {/* Screen Reader Skip Link */}
      <a
        href="#after-process"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[#0F2A35] focus:rounded-lg focus:shadow-lg focus:font-semibold"
      >
        Skip this section
      </a>

      {/* ===================================================================
          TOP AREA: Section Title, Tabs & Active Scene Header (< 35% height)
         =================================================================== */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 flex flex-col gap-2 shrink-0 z-20">
        {/* Row 1: Section Title & 8 Numbered Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* Section Title */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentPalette.pillText }}
            />
            <h2
              style={{ color: currentPalette.textPrimary }}
              className="text-xs sm:text-sm font-bold tracking-tight uppercase"
            >
              {config.wayOfWorking.title}
            </h2>
          </div>

          {/* Numbered Pill Tabs (role="tablist") */}
          <div
            role="tablist"
            aria-label="Story scenes"
            className="flex items-center gap-1 p-1 rounded-full bg-black/15 backdrop-blur-md border border-white/10 overflow-x-auto no-scrollbar max-w-full"
          >
            {activeScenes.map((scene, idx) => {
              const isSelected = currentSceneIdx === idx;
              return (
                <button
                  key={scene.id}
                  role="tab"
                  id={`tab-${scene.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${scene.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => goToScene(idx)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-white text-[#12303D] font-bold shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {scene.tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Centered Scene Pill, Headline, and Supporting Line */}
        <div className="text-center max-w-3xl mx-auto pt-1 sm:pt-2">
          {/* Centered Pill Label */}
          <span
            style={{
              backgroundColor: currentPalette.pillBg,
              color: currentPalette.pillText,
              borderColor: currentPalette.pillBorder,
            }}
            className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border mb-1 transition-colors duration-500"
          >
            {activeScene.pillLabel}
          </span>

          {/* Large Headline */}
          <h3
            style={{ color: currentPalette.textPrimary }}
            className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug transition-colors duration-500"
          >
            {activeScene.headline}
          </h3>

          {/* Short Supporting Line */}
          <p
            style={{ color: currentPalette.textSecondary }}
            className="text-xs sm:text-sm mt-1 max-w-2xl mx-auto leading-relaxed transition-colors duration-500"
          >
            {activeScene.text}
          </p>
        </div>
      </div>

      {/* ===================================================================
          STAGE AREA: Responsive Viewport Canvas (~60% height)
         =================================================================== */}
      <div
        id={`panel-${activeScene.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeScene.id}`}
        className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-center overflow-hidden z-10"
      >
        <div
          key={activeScene.id}
          className="w-full h-full flex items-center justify-center transition-all duration-700"
          style={{
            animation: 'fadeInScale 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
          }}
        >
          {renderSceneVisual(activeScene.id, sceneProgress)}
        </div>
      </div>

      {/* ===================================================================
          BOTTOM CONTROL BAR: 8 Progress Segments, Play/Pause, Prev/Next, Replay
         =================================================================== */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4 flex flex-col gap-2 shrink-0 z-20">
        {/* 8 Clickable Progress Segments */}
        <div className="w-full grid grid-cols-8 gap-1.5 sm:gap-2">
          {activeScenes.map((scene, idx) => {
            let fillPct = 0;
            if (idx < currentSceneIdx) fillPct = 100;
            else if (idx === currentSceneIdx) fillPct = sceneProgress * 100;

            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => goToScene(idx)}
                aria-label={`Jump to scene ${idx + 1}: ${scene.tab}`}
                className="group relative h-2 sm:h-2.5 rounded-full bg-white/20 hover:bg-white/30 overflow-hidden cursor-pointer transition-colors"
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${fillPct}%`,
                    backgroundColor: currentPalette.pillText || '#FFFFFF',
                    transitionDuration: idx === currentSceneIdx ? '100ms' : '300ms',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Playback Controls & Caption Bar */}
        <div className="flex items-center justify-between text-xs pt-1">
          {/* Controls: Prev, Play/Pause, Next, Replay */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentSceneIdx === 0}
              aria-label="Previous scene"
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause autoplay' : 'Resume autoplay'}
              className="px-3 py-1 rounded-full bg-black/25 hover:bg-black/45 border border-white/10 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[11px]">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[11px]">Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentSceneIdx >= totalScenes - 1}
              aria-label="Next scene"
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReplay}
              aria-label="Replay current scene"
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white cursor-pointer ml-1"
              title="Replay scene"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scene Counter & Keyboard Hint */}
          <div
            style={{ color: currentPalette.textSecondary }}
            className="flex items-center gap-3 text-[11px]"
          >
            <span className="hidden sm:inline opacity-75">
              Press Space to pause · Arrow keys to skip
            </span>
            <span className="font-mono font-semibold">
              {String(currentSceneIdx + 1).padStart(2, '0')} / {String(totalScenes).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div id="after-process" className="sr-only" />
    </section>
  );
}
