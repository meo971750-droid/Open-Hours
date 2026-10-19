import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useReducedMotion } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
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

interface GlobalStep {
  globalIndex: number;
  sceneIndex: number;
  stepIndex: number;
  sceneId: string;
  caption: string;
  highlight: string;
  isFirstStepInScene: boolean;
  isLastStepInScene: boolean;
}

export default function OurProcess({ onOpenAudit }: OurProcessProps) {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter scenes according to feature flags
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

  // Flatten active scenes into global sequential steps
  const globalSteps: GlobalStep[] = useMemo(() => {
    const list: GlobalStep[] = [];
    activeScenes.forEach((scene, sIdx) => {
      const steps = scene.steps || [{ caption: '', highlight: '' }];
      steps.forEach((st, stepIdx) => {
        list.push({
          globalIndex: list.length,
          sceneIndex: sIdx,
          stepIndex: stepIdx,
          sceneId: scene.id,
          caption: st.caption,
          highlight: st.highlight,
          isFirstStepInScene: stepIdx === 0,
          isLastStepInScene: stepIdx === steps.length - 1,
        });
      });
    });
    return list;
  }, [activeScenes]);

  const totalGlobalSteps = globalSteps.length;

  // Calculate scroll track height & scene scroll ranges
  const { totalVh, sceneScrollRanges } = useMemo(() => {
    const pace = config.wayOfWorking.pace;
    const vhPerStep = isMobile ? (pace.mobileScrollVhPerStep || 20) : (pace.scrollVhPerStep || 25);
    const sumVh = Math.max(300, totalGlobalSteps * vhPerStep + 100);

    let stepCounter = 0;
    const ranges = activeScenes.map((s, idx) => {
      const sceneStepsCount = s.steps?.length || 1;
      const startStep = stepCounter;
      stepCounter += sceneStepsCount;
      const endStep = stepCounter;
      return {
        sceneIndex: idx,
        sceneId: s.id,
        startFraction: totalGlobalSteps > 0 ? startStep / totalGlobalSteps : 0,
        endFraction: totalGlobalSteps > 0 ? endStep / totalGlobalSteps : 1,
        firstGlobalIndex: startStep,
        lastGlobalIndex: endStep - 1,
      };
    });

    return { totalVh: sumVh, sceneScrollRanges: ranges };
  }, [totalGlobalSteps, activeScenes, isMobile]);

  // Target step decided strictly by scroll position
  const targetGlobalStepRef = useRef(0);

  // Step player engine state
  const playerRef = useRef({
    index: 0,
    phase: 'animating' as 'animating' | 'holding' | 'scene-transition' | 'rewinding',
    phaseStartTime: performance.now(),
  });

  const [playerRenderState, setPlayerRenderState] = useState({
    globalIndex: 0,
    stepProgress: 0,
    isSceneTransitioning: false,
    isRewinding: false,
  });

  // Passive scroll listener (never hijacks wheel or touch)
  useEffect(() => {
    const updateScrollTarget = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
      const targetStep = Math.min(
        totalGlobalSteps - 1,
        Math.floor(progress * totalGlobalSteps)
      );
      targetGlobalStepRef.current = targetStep;

      if (progress > 0.02 && !hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    updateScrollTarget();

    return () => {
      window.removeEventListener('scroll', updateScrollTarget);
    };
  }, [totalGlobalSteps, hasScrolled]);

  // Step Player Engine running in requestAnimationFrame
  // Rules:
  // - Step animation (~1200ms) + hold (~700ms) = min dwell 1900ms
  // - Fast scrolling queues steps: plays in order, never skips or jumps ahead
  // - Scrolling up rewinds: goes back one step at a time with 450ms transition
  // - Scene transition takes 1000ms
  // - Reduced motion: steps change instantly
  useEffect(() => {
    let rafId: number;
    const pace = config.wayOfWorking.pace;
    const STEP_ANIM_MS = pace.stepAnimMs || 1200;
    const STEP_HOLD_MS = pace.stepHoldMs || 700;
    const REWIND_MS = pace.rewindStepMs || 450;
    const SCENE_TRANS_MS = pace.sceneTransitionMs || 1000;

    const playerLoop = () => {
      const now = performance.now();
      const targetIdx = targetGlobalStepRef.current;
      const current = playerRef.current;

      if (shouldReduceMotion) {
        if (current.index !== targetIdx) {
          current.index = targetIdx;
          current.phase = 'holding';
          current.phaseStartTime = now;
          setPlayerRenderState({
            globalIndex: targetIdx,
            stepProgress: 1,
            isSceneTransitioning: false,
            isRewinding: false,
          });
        }
        rafId = requestAnimationFrame(playerLoop);
        return;
      }

      // State machine transitions
      if (current.phase === 'rewinding') {
        const elapsed = now - current.phaseStartTime;
        if (elapsed >= REWIND_MS) {
          const prevIdx = Math.max(0, current.index - 1);
          current.index = prevIdx;
          if (current.index > targetIdx) {
            current.phase = 'rewinding';
            current.phaseStartTime = now;
          } else {
            current.phase = 'holding';
            current.phaseStartTime = now;
          }
        }
      } else if (current.phase === 'scene-transition') {
        const elapsed = now - current.phaseStartTime;
        if (elapsed >= SCENE_TRANS_MS) {
          current.index = Math.min(totalGlobalSteps - 1, current.index + 1);
          current.phase = 'animating';
          current.phaseStartTime = now;
        }
      } else if (current.phase === 'animating') {
        const elapsed = now - current.phaseStartTime;
        if (elapsed >= STEP_ANIM_MS) {
          current.phase = 'holding';
          current.phaseStartTime = now;
        }
      } else if (current.phase === 'holding') {
        const elapsed = now - current.phaseStartTime;
        if (targetIdx > current.index) {
          // Can only advance after hold dwell time completes (~700ms)
          if (elapsed >= STEP_HOLD_MS) {
            const curStep = globalSteps[current.index];
            const nextStep = globalSteps[current.index + 1];
            if (nextStep) {
              if (nextStep.sceneIndex !== curStep.sceneIndex) {
                // Next step starts a new scene
                current.phase = 'scene-transition';
                current.phaseStartTime = now;
              } else {
                current.index = current.index + 1;
                current.phase = 'animating';
                current.phaseStartTime = now;
              }
            }
          }
        } else if (targetIdx < current.index) {
          // User scrolled back up! Rewind one step
          current.phase = 'rewinding';
          current.phaseStartTime = now;
        }
      }

      // Compute display progress for the step
      let prog = 1;
      if (current.phase === 'animating') {
        const elapsed = now - current.phaseStartTime;
        prog = Math.min(1, Math.max(0, elapsed / STEP_ANIM_MS));
      } else {
        prog = 1;
      }

      const isTrans = current.phase === 'scene-transition';
      const isRewind = current.phase === 'rewinding';

      // Update state when meaningful change occurs
      setPlayerRenderState((prev) => {
        if (
          prev.globalIndex !== current.index ||
          prev.isSceneTransitioning !== isTrans ||
          prev.isRewinding !== isRewind ||
          Math.abs(prev.stepProgress - prog) > 0.02 ||
          (prog === 1 && prev.stepProgress !== 1)
        ) {
          return {
            globalIndex: current.index,
            stepProgress: prog,
            isSceneTransitioning: isTrans,
            isRewinding: isRewind,
          };
        }
        return prev;
      });

      rafId = requestAnimationFrame(playerLoop);
    };

    rafId = requestAnimationFrame(playerLoop);
    return () => cancelAnimationFrame(rafId);
  }, [totalGlobalSteps, globalSteps, shouldReduceMotion]);

  // Current active step and scene from player
  const curGlobalStep = globalSteps[playerRenderState.globalIndex] || globalSteps[0];
  const activeIndex = curGlobalStep ? curGlobalStep.sceneIndex : 0;
  const activeScene = activeScenes[activeIndex] || activeScenes[0];
  const sceneStepsCount = activeScene.steps?.length || 1;
  const currentSceneProgress = (curGlobalStep.stepIndex + playerRenderState.stepProgress) / sceneStepsCount;

  // Active scene palette
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

  // Smooth scroll to a specific scene when tab or progress bar segment is clicked
  const scrollToScene = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const containerTop = containerRef.current.offsetTop;
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      const range = sceneScrollRanges[index];
      const fraction = range ? range.startFraction + 0.005 : index / totalScenes;
      const targetScroll = containerTop + fraction * scrollableDistance;

      window.scrollTo({
        top: targetScroll,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    },
    [sceneScrollRanges, totalScenes, shouldReduceMotion]
  );

  // Skip section button action
  const handleSkipSection = () => {
    const nextSection =
      document.getElementById('included') ||
      document.getElementById('after-process') ||
      document.getElementById('pricing');

    if (nextSection) {
      nextSection.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      const heading = nextSection.querySelector('h2, h3, [tabindex]') as HTMLElement | null;
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    }
  };

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
  const renderSceneVisual = (
    sceneId: string,
    prog: number,
    sIdx: number,
    sProg: number,
    highlight: string,
    mobileMode = false
  ) => {
    const props = {
      progress: prog,
      stepIndex: sIdx,
      stepProgress: sProg,
      activeHighlight: highlight,
      isActive: true,
      isMobile: mobileMode,
      palette: currentPalette,
      onOpenAudit,
    };

    switch (sceneId) {
      case 'searches':
        return <Scene1Searches {...props} />;
      case 'journey':
        return <Scene2Journey {...props} />;
      case 'solve':
        return <Scene3Solve {...props} />;
      case 'build':
        return <Scene4Build {...props} />;
      case 'findable':
        return <Scene5Findable {...props} />;
      case 'rank':
        return <Scene6Rank {...props} />;
      case 'always-on':
        return <Scene7AlwaysOn {...props} />;
      case 'talk':
        return <Scene8Talk {...props} />;
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
          {activeScenes.map((scene) => {
            const pal =
              (paletteConfig[scene.paletteKey as keyof typeof paletteConfig] as ScenePalette) || currentPalette;
            const stepsCount = scene.steps?.length || 1;
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
                  <h3 style={{ color: pal.textPrimary }} className="text-xl sm:text-2xl font-bold leading-snug">
                    {scene.headline}
                  </h3>
                  {scene.text && (
                    <p style={{ color: pal.textSecondary }} className="text-sm mt-1.5 leading-relaxed">
                      {scene.text}
                    </p>
                  )}
                </div>

                <div className="w-full min-h-[300px]">
                  {renderSceneVisual(scene.id, 1, stepsCount - 1, 1, '', true)}
                </div>

                {/* Full list of commentary captions for accessibility */}
                <div className="border-t border-black/10 pt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60">Step-by-step summary</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs opacity-85">
                    {scene.steps?.map((st, i) => (
                      <li key={i}>{st.caption}</li>
                    ))}
                  </ol>
                </div>

                <div style={{ color: pal.textSecondary }} className="text-[11px] text-right border-t border-black/10 pt-3">
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
  // Scroll-Driven Medium-Slow Step Player Story (Sticky 100svh Stage)
  // Clean 3-Part Layout:
  // 1. Top (about 25-28%): Tabs, Title, Headline
  // 2. Center (about 55-58%): Visual Stage (overflow: hidden, nothing cut off)
  // 3. Bottom (about 16-18%): Caption Box in normal flow + 8-segment Progress Bar
  // --------------------------------------------------------------------------
  const { isSceneTransitioning } = playerRenderState;

  return (
    <section
      ref={containerRef}
      id="process"
      aria-label={config.wayOfWorking.title}
      style={{ height: `${totalVh}vh` }}
      className="relative w-full bg-[#0F2A35]"
    >
      {/* Anchor for backward compatibility with #how-it-works */}
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
        style={{
          background: currentPalette.bg,
          transition: 'background 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="sticky top-0 h-[100svh] min-h-[640px] max-h-[100svh] w-full flex flex-col justify-between overflow-hidden px-3 sm:px-6 lg:px-8 py-2 sm:py-3 select-none"
      >
        {/* ===================================================================
            PART 1: TOP AREA (~25-28% height max)
            Tabs, Title, Headline & Skip Button
           =================================================================== */}
        <div className="w-full max-w-7xl mx-auto flex flex-col justify-start shrink-0 z-20 max-h-[28svh] gap-1 sm:gap-2">
          {/* Top Bar: Title, Tabs, and Always-Visible Skip Section Button */}
          <div className="flex items-center justify-between gap-2.5">
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
              ref={tablistRef}
              role="tablist"
              aria-label="Story chapters"
              className="hidden md:flex items-center gap-1 p-1 rounded-full bg-black/15 backdrop-blur-md border border-white/10 overflow-x-auto no-scrollbar max-w-full"
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

            {/* Always-Visible "Skip section" Button (at least 44px touch target) */}
            <button
              type="button"
              onClick={handleSkipSection}
              aria-label="Skip this section and jump to next"
              className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-md cursor-pointer ${
                currentPalette.isDark
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  : 'bg-black/10 hover:bg-black/20 text-[#1B2B34] border border-black/15'
              }`}
            >
              <span>Skip section</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Row 2: Headline Block */}
          <div className="text-center max-w-3xl mx-auto pt-0.5 sm:pt-1">
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

            {/* Large Exact Headline */}
            <h3
              style={{ color: currentPalette.textPrimary }}
              className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug transition-colors duration-500"
            >
              {activeScene.headline}
            </h3>

            {/* Supporting line only on Scene 8 */}
            {activeScene.text && (
              <p
                style={{ color: currentPalette.textSecondary }}
                className="text-xs sm:text-sm mt-0.5 max-w-2xl mx-auto leading-relaxed transition-colors duration-500"
              >
                {activeScene.text}
              </p>
            )}
          </div>
        </div>

        {/* ===================================================================
            PART 2: CENTER VISUAL STAGE (~55-58% height)
            Overflow hidden, graphics scaled to fit so nothing ever pushes caption
           =================================================================== */}
        <div
          id={`panel-${activeScene.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeScene.id}`}
          className="relative flex-1 min-h-0 h-[56svh] max-h-[58svh] w-full max-w-7xl mx-auto flex items-center justify-center overflow-hidden z-10 px-2 py-1"
        >
          <div
            key={activeScene.id}
            className={`w-full h-full flex items-center justify-center transition-all duration-700 ${
              isSceneTransitioning
                ? 'opacity-0 translate-x-12 scale-[0.98]'
                : 'opacity-100 translate-x-0 scale-100'
            }`}
          >
            <div className="w-full h-full flex items-center justify-center origin-center transform scale-[0.92] sm:scale-100">
              {renderSceneVisual(
                activeScene.id,
                currentSceneProgress,
                curGlobalStep.stepIndex,
                playerRenderState.stepProgress,
                curGlobalStep.highlight,
                isMobile
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================
            PART 3: BOTTOM AREA (~16-18% height max)
            Synced Commentary Caption Bar in normal flow + 8 Progress Segments
           =================================================================== */}
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pb-1 sm:pb-2 flex flex-col justify-end shrink-0 z-20 gap-1.5 max-h-[18svh]">
          {/* Scroll to continue hint on Scene 1 step 0 */}
          {activeIndex === 0 && curGlobalStep.stepIndex === 0 && !hasScrolled && (
            <div className="flex justify-center -mb-1 animate-bounce">
              <div
                style={{
                  backgroundColor: currentPalette.pillBg,
                  color: currentPalette.pillText,
                  borderColor: currentPalette.pillBorder,
                }}
                className="px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 border backdrop-blur-md shadow-sm"
              >
                <span>Scroll to advance</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Commentary Caption Bar (In bottom flow, NOT position: absolute) */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="w-full max-w-4xl mx-auto flex items-center justify-between gap-3 px-4 py-2 sm:py-2.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 shadow-lg min-h-[46px] sm:min-h-[52px]"
          >
            <p
              key={`${activeIndex}-${curGlobalStep.stepIndex}`}
              style={{
                color: currentPalette.textPrimary,
                fontSize: 'clamp(1.05rem, 2vw, 1.4rem)',
              }}
              className="flex-1 font-semibold tracking-tight leading-snug line-clamp-2"
            >
              {curGlobalStep.caption}
            </p>
            <span
              style={{ color: currentPalette.textSecondary }}
              className="text-[11px] sm:text-xs font-mono whitespace-nowrap shrink-0 opacity-80"
            >
              Step {curGlobalStep.stepIndex + 1} of {sceneStepsCount}
            </span>
          </div>

          {/* 8 Clickable Progress Segments */}
          <div className="w-full grid grid-cols-8 gap-1.5 sm:gap-2 pt-0.5">
            {activeScenes.map((scene, idx) => {
              let fillPct = 0;
              if (idx < activeIndex) fillPct = 100;
              else if (idx === activeIndex) fillPct = currentSceneProgress * 100;

              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => scrollToScene(idx)}
                  aria-label={`Scroll to scene ${idx + 1}: ${scene.tab}`}
                  className="group relative h-1.5 sm:h-2 rounded-full bg-white/20 hover:bg-white/35 overflow-hidden cursor-pointer transition-colors"
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${fillPct}%`,
                      backgroundColor: currentPalette.pillText || '#FFFFFF',
                      transitionDuration: '100ms',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div id="after-process" className="sr-only" />
    </section>
  );
}
