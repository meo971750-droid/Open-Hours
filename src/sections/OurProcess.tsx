import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform, MotionValue } from 'motion/react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Star,
  Phone,
  Mail,
  Building2,
  Globe,
  Clock,
  User,
  ArrowRight,
  ChevronDown,
  MapPin,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { CTA } from '../content';

// Build ID declaration from Vite define (H10)
declare const __BUILD_ID__: string;

// Print build ID once to console on module load
if (typeof window !== 'undefined') {
  console.log('OpenHours build: ' + (typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev-local'));
}

export const PROCESS_SCROLL_PER_WEIGHT_SVH_DESKTOP = 125;
export const PROCESS_SCROLL_PER_WEIGHT_SVH_MOBILE = 100;
export const SCENE_WEIGHTS = [1, 1, 1.2, 1.3, 1, 1.2];
const totalWeight = SCENE_WEIGHTS.reduce((a, b) => a + b, 0);

export const SCENE_RANGES = SCENE_WEIGHTS.reduce((acc, weight, i) => {
  const start = i === 0 ? 0 : acc[i - 1].end;
  const end = i === SCENE_WEIGHTS.length - 1 ? 1 : start + weight / totalWeight;
  acc.push({ start, end });
  return acc;
}, [] as { start: number; end: number }[]);

export const PROCESS_STEPS = [
  {
    id: 1,
    stepNum: '01',
    navTitle: 'Search',
    title: 'We search the way your customers do',
    titleRender: (
      <>
        We search the way your <span className="text-[#E3B896]">customers</span> do
      </>
    ),
    description:
      'We search for your trade in your area and see exactly what local homeowners see. No assumptions, just what shows up.',
  },
  {
    id: 2,
    stepNum: '02',
    navTitle: 'Review',
    title: 'We check where enquiries get lost',
    titleRender: (
      <>
        We check where <span className="text-[#E3B896]">enquiries get lost</span>
      </>
    ),
    description:
      'We review your online presence, Google profile, reviews and contact routes to identify what is working and where potential jobs drop off.',
  },
  {
    id: 3,
    stepNum: '03',
    navTitle: 'Audit & Concept',
    title: 'You receive a 2-minute video audit and a homepage concept',
    titleRender: (
      <>
        You receive a 2-minute <span className="text-[#E3B896]">video audit</span> and a{' '}
        <span className="text-[#E3B896]">homepage concept</span>
      </>
    ),
    description:
      'A concise video walkthrough and a tailored homepage concept built around your real work. At no cost, with no obligation to proceed.',
  },
  {
    id: 4,
    stepNum: '04',
    navTitle: 'Ready to be Found',
    title: 'Your business is ready to be found',
    titleRender: (
      <>
        Your business is <span className="text-[#E3B896]">ready to be found</span>
      </>
    ),
    description:
      'A clear, professional web presence with prominent ways to get in touch makes choosing your business straightforward.',
  },
  {
    id: 5,
    stepNum: '05',
    navTitle: 'Direct Enquiries',
    title: 'Enquiries arrive directly through your website',
    titleRender: (
      <>
        Enquiries arrive <span className="text-[#E3B896]">directly through your website</span>
      </>
    ),
    description:
      'Homeowners can request quotes, send project details or tap to call directly from your website at any time of day.',
  },
  {
    id: 6,
    stepNum: '06',
    navTitle: 'Your silent salesman',
    title: 'Your website works while you are on site or off duty',
    titleRender: (
      <>
        Your website works <span className="text-[#E3B896]">while you are on site or off duty</span>
      </>
    ),
    description:
      "When your work day finishes, your website stays open to capture enquiries and reassure visitors. Start with a 1-page website. If it's not for you, we stop contacting you.",
  },
];

// Diagnostic flags parser (Phase 2)
interface DebugFlags {
  notrans: boolean;
  raw: boolean;
  onescene: boolean;
  fixedscale: boolean;
  noblur: boolean;
  remeasure: boolean;
  nosticky: boolean;
  log: boolean;
  debugOverlay: boolean;
  activeFlagList: string[];
}

function parseDebugFlags(): DebugFlags {
  if (typeof window === 'undefined') {
    return {
      notrans: false,
      raw: false,
      onescene: false,
      fixedscale: false,
      noblur: false,
      remeasure: false,
      nosticky: false,
      log: false,
      debugOverlay: false,
      activeFlagList: [],
    };
  }
  const params = new URLSearchParams(window.location.search);
  const pdebug = (params.get('pdebug') || '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
  const debug = (params.get('debug') || '').toLowerCase();

  const notrans = pdebug.includes('notrans');
  const raw = pdebug.includes('raw');
  const onescene = pdebug.includes('onescene');
  const fixedscale = pdebug.includes('fixedscale');
  const noblur = pdebug.includes('noblur');
  const remeasure = pdebug.includes('remeasure');
  const nosticky = pdebug.includes('nosticky');
  const log = pdebug.includes('log');
  const debugOverlay = debug === 'process' || log;

  return {
    notrans,
    raw,
    onescene,
    fixedscale,
    noblur,
    remeasure,
    nosticky,
    log,
    debugOverlay,
    activeFlagList: pdebug,
  };
}

// H4 / Hardening 2: Normalized crossfade calculation with hard boundaries (8% crossfade window)
// Ensures at most two scenes are visible simultaneously during crossfade; outside crossfade exactly one is visible.
function getSceneTransitionState(p: number, index: number, onescene: boolean) {
  const { start, end } = SCENE_RANGES[index];

  if (onescene) {
    const isCurrent = p >= start && p < (index === SCENE_RANGES.length - 1 ? 1.001 : end);
    return {
      isVisible: isCurrent,
      opacity: isCurrent ? 1 : 0,
      y: 0,
      scale: 1,
      pointerEvents: isCurrent ? ('auto' as const) : ('none' as const),
    };
  }

  // Crossfade duration = 8% of neighbouring scene ranges
  const prevRange = index > 0 ? SCENE_RANGES[index - 1] : null;
  const nextRange = index < SCENE_RANGES.length - 1 ? SCENE_RANGES[index + 1] : null;

  const fadePrev = prevRange ? 0.08 * Math.min(end - start, prevRange.end - prevRange.start) : 0;
  const fadeNext = nextRange ? 0.08 * Math.min(end - start, nextRange.end - nextRange.start) : 0;

  // Window bounds where this scene is rendered
  const visibleStart = index === 0 ? 0 : start - fadePrev / 2;
  const visibleEnd = index === SCENE_RANGES.length - 1 ? 1 : end + fadeNext / 2;

  if (p < visibleStart || p > visibleEnd) {
    return {
      isVisible: false,
      opacity: 0,
      y: p < visibleStart ? 16 : -12,
      scale: 0.98,
      pointerEvents: 'none' as const,
    };
  }

  let opacity = 1;
  let y = 0;
  let scale = 1;

  // Incoming transition at start boundary
  if (index > 0 && p < start + fadePrev / 2) {
    const t = Math.max(0, Math.min(1, (p - visibleStart) / fadePrev));
    opacity = t;
    y = 16 * (1 - t);
    scale = 0.98 + 0.02 * t;
  }
  // Outgoing transition at end boundary
  else if (index < SCENE_RANGES.length - 1 && p > end - fadeNext / 2) {
    const t = Math.max(0, Math.min(1, (p - (end - fadeNext / 2)) / fadeNext));
    opacity = 1 - t;
    y = -12 * t;
    scale = 1 - 0.02 * t;
  }

  return {
    isVisible: opacity > 0.001,
    opacity: Math.max(0, Math.min(1, opacity)),
    y,
    scale,
    pointerEvents: (opacity > 0.1 ? 'auto' : 'none') as 'auto' | 'none',
  };
}

export default function OurProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const visualAreaRef = useRef<HTMLDivElement>(null);
  const textMeasurerRef = useRef<HTMLDivElement>(null);

  // Diagnostic flags
  const flags = useMemo(() => parseDebugFlags(), []);

  // Motion values for smooth scrubbing
  const smoothProgress = useMotionValue(0);
  const rawProgressVal = useMotionValue(0);

  // Active scene index with 0.006 hysteresis (Hardening 4)
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Responsive scale & height state
  const [visualScale, setVisualScale] = useState(1);
  const [tallestTextHeight, setTallestTextHeight] = useState<number>(180);
  const [isCompactText, setIsCompactText] = useState(false);
  const isUpdatingScale = useRef(false); // Lock flag (Hardening 5)
  const lastScaleRef = useRef(1);
  const lastMeasuredWidthRef = useRef(0);

  // Diagnostic metrics
  const roCountRef = useRef(0);
  const [roRate, setRoRate] = useState(0);
  const [debugStats, setDebugStats] = useState({
    raw: 0,
    smoothed: 0,
    sceneIdx: 0,
    wrapperTop: 0,
    wrapperHeight: 0,
    stageHeight: 0,
    visibleScenesCount: 1,
    visibleTextsCount: 1,
  });

  // H5 / Hardening 5: Measure tallest text block safely once after fonts load & on large width changes (> 2px)
  const measureTallest = () => {
    if (!textMeasurerRef.current) return;
    const currentWidth = textMeasurerRef.current.offsetWidth;
    if (Math.abs(currentWidth - lastMeasuredWidthRef.current) <= 2 && lastMeasuredWidthRef.current > 0) {
      return;
    }
    lastMeasuredWidthRef.current = currentWidth;

    const children = Array.from(textMeasurerRef.current.children) as HTMLElement[];
    let maxH = 0;
    children.forEach((child) => {
      const h = child.offsetHeight;
      if (h > maxH) maxH = h;
    });
    if (maxH > 0) {
      // Per-breakpoint fallback reservation (mobile 190px, desktop 160px min)
      const minReserve = typeof window !== 'undefined' && window.innerWidth < 768 ? 190 : 160;
      setTallestTextHeight(Math.max(minReserve, Math.ceil(maxH)));
    }
  };

  useEffect(() => {
    measureTallest();
    const handleResize = () => {
      measureTallest();
    };
    window.addEventListener('resize', handleResize);
    document.fonts?.ready?.then(() => measureTallest());
    window.addEventListener('load', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
    };
  }, []);

  // H5 / Hardening 5: ResizeObserver to scale 960x480 canvas from un-scaled container with 0.5% deadband
  useEffect(() => {
    const node = visualAreaRef.current;
    if (!node) return;

    const updateScale = () => {
      if (isUpdatingScale.current) return; // Prevent re-entrant loops
      isUpdatingScale.current = true;
      roCountRef.current += 1;

      try {
        if (flags.fixedscale) {
          setVisualScale(1);
          setIsCompactText(false);
          return;
        }

        const { clientWidth, clientHeight } = node;
        if (clientWidth === 0 || clientHeight === 0) return;

        const rawScale = Math.min(clientWidth / 960, clientHeight / 480);
        const clampedScale = Math.max(0.68, Math.min(1.05, rawScale));

        // Threshold check: apply only if changed by >= 0.5%
        if (Math.abs(clampedScale - lastScaleRef.current) / lastScaleRef.current >= 0.005) {
          lastScaleRef.current = clampedScale;
          setVisualScale(clampedScale);
          setIsCompactText(clampedScale < 0.72);
        }
      } finally {
        isUpdatingScale.current = false;
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(node);
    return () => ro.disconnect();
  }, [flags.fixedscale]);

  // RO Rate tracker (resets every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setRoRate(roCountRef.current);
      roCountRef.current = 0;
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // H4 / Hardening 4: RAF Loop measuring wrapper.getBoundingClientRect() while near viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isNearViewport = true;
    let rafId: number;
    let lastTime = performance.now();
    let smoothed = 0;
    let currentActiveIdx = 0;

    // IntersectionObserver with 100% vertical margin
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isNearViewport = entry.isIntersecting;
        });
      },
      { rootMargin: '100% 0px 100% 0px' }
    );
    io.observe(container);

    const onFrame = (now: number) => {
      if (isNearViewport && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const stageH = stageRef.current ? stageRef.current.offsetHeight : rect.height / totalWeight;
        const scrollable = rect.height - stageH; // Hardening 8: rendered height, never window.innerHeight

        let raw = 0;
        if (scrollable > 0) {
          raw = Math.max(0, Math.min(1, -rect.top / scrollable));
        }

        rawProgressVal.set(raw);

        // Smoothing: s += (raw - s) * (1 - exp(-dt * 14))
        if (flags.raw) {
          smoothed = raw;
        } else {
          const dt = Math.min(0.1, (now - lastTime) / 1000);
          smoothed += (raw - smoothed) * (1 - Math.exp(-dt * 14));
          if (Math.abs(raw - smoothed) < 0.0004) {
            smoothed = raw;
          }
        }

        smoothProgress.set(smoothed);

        // Scene index with 0.006 hysteresis (Hardening 4)
        const currentRange = SCENE_RANGES[currentActiveIdx];
        let nextIdx = currentActiveIdx;

        if (currentActiveIdx < SCENE_RANGES.length - 1 && smoothed > currentRange.end + 0.006) {
          const found = SCENE_RANGES.findIndex((r) => smoothed >= r.start && smoothed <= r.end);
          if (found !== -1) nextIdx = found;
        } else if (currentActiveIdx > 0 && smoothed < currentRange.start - 0.006) {
          const found = SCENE_RANGES.findIndex((r) => smoothed >= r.start && smoothed <= r.end);
          if (found !== -1) nextIdx = found;
        }

        if (nextIdx !== currentActiveIdx) {
          currentActiveIdx = nextIdx;
          setActiveSceneIndex(nextIdx);
        }

        // Count visible scenes & texts for debug
        let visScenes = 0;
        let visTexts = 0;
        for (let i = 0; i < SCENE_WEIGHTS.length; i++) {
          const s = getSceneTransitionState(smoothed, i, flags.onescene);
          if (s.isVisible) {
            visScenes += 1;
            visTexts += 1;
          }
        }

        setDebugStats({
          raw,
          smoothed,
          sceneIdx: currentActiveIdx,
          wrapperTop: rect.top,
          wrapperHeight: rect.height,
          stageHeight: stageH,
          visibleScenesCount: visScenes,
          visibleTextsCount: visTexts,
        });
      }

      lastTime = now;
      rafId = requestAnimationFrame(onFrame);
    };

    rafId = requestAnimationFrame(onFrame);

    // Recompute on body height ResizeObserver & fonts ready (Hardening 4)
    const bodyRo = new ResizeObserver(() => {
      // Triggers next rAF read cleanly
    });
    bodyRo.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      bodyRo.disconnect();
    };
  }, [flags.raw, flags.onescene]);

  // Diagnostic console.table logger (flags.log)
  useEffect(() => {
    if (!flags.log) return;
    const interval = setInterval(() => {
      console.table({
        'Build ID': typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev',
        'Scene Index': debugStats.sceneIdx,
        'Raw Progress': debugStats.raw.toFixed(4),
        'Smoothed Progress': debugStats.smoothed.toFixed(4),
        'Visible Scenes Count': debugStats.visibleScenesCount,
        'RO Callbacks / sec': roRate,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [flags.log, debugStats, roRate]);

  // Hardening 6: Internal jumps use native scrollTo with behavior "auto"
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const nextSection = document.getElementById('included') || document.getElementById('sample-audit');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'auto' });
    }
  };

  const handleJumpToScene = (idx: number) => {
    if (!containerRef.current || !stageRef.current) return;
    const container = containerRef.current;
    const stageH = stageRef.current.offsetHeight;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const maxScroll = container.scrollHeight - stageH; // Hardening 8: stageH instead of window.innerHeight
    const targetScroll = scrollTop + SCENE_RANGES[idx].start * maxScroll + 10;
    window.scrollTo({ top: targetScroll, behavior: 'auto' });
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalSvh = 100 + totalWeight * (isMobile ? PROCESS_SCROLL_PER_WEIGHT_SVH_MOBILE : PROCESS_SCROLL_PER_WEIGHT_SVH_DESKTOP);

  return (
    <section
      ref={containerRef}
      id="process"
      aria-label="Our Process"
      className="relative w-full bg-[#0F2A35] text-white scroll-mt-24 process-stage"
      style={{
        height: flags.nosticky ? 'auto' : `${totalSvh}svh`,
      }}
    >
      {/* Phase 2: Injected diagnostic styles for URL flags */}
      {flags.notrans && (
        <style>{`
          .process-stage, .process-stage * {
            transition: none !important;
            animation: none !important;
          }
        `}</style>
      )}
      {flags.noblur && (
        <style>{`
          .process-stage * {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            filter: none !important;
            mix-blend-mode: normal !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
          }
        `}</style>
      )}

      {/* Keyboard-only skip link */}
      <a
        href="#included"
        onClick={handleSkip}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-6 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#E3B896] focus:text-[#0F2A35] focus:font-bold focus:rounded-full focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white text-[16px]"
      >
        Skip this section &rarr;
      </a>

      {/* 1. Header block ABOVE the pinned stage */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-[96px] pb-[40px] text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase text-[#E3B896] mb-4">
          OUR PROCESS
        </div>
        <h2 className="text-[clamp(36px,5vw,68px)] font-semibold tracking-[-0.03em] text-white leading-[1.08] mb-3">
          The Way We Deliver
        </h2>
        <p className="text-[clamp(17px,1.5vw,21px)] text-white/75 max-w-2xl mx-auto leading-relaxed">
          What changes when your business is easy to find and easy to contact.
        </p>
      </div>

      {/* Screen-reader only ordered list for accessibility */}
      <ol className="sr-only">
        {PROCESS_STEPS.map((s) => (
          <li key={s.id}>
            <h3>
              {s.stepNum} {s.title}
            </h3>
            <p>{s.description}</p>
          </li>
        ))}
      </ol>

      {/* Off-screen measurement container to calculate tallest step height at current width */}
      <div
        ref={textMeasurerRef}
        aria-hidden="true"
        className="w-full max-w-[980px] absolute left-[-9999px] top-0 pointer-events-none opacity-0 invisible"
      >
        {PROCESS_STEPS.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center justify-center px-4 py-1">
            <span className="font-mono text-[22px] font-bold text-[#E3B896] mb-1">
              {step.stepNum}
            </span>
            <h3 className={`${isCompactText ? 'text-[clamp(24px,3vw,40px)]' : 'text-[clamp(26px,7vw,34px)] lg:text-[clamp(28px,3.4vw,48px)]'} font-semibold tracking-[-0.03em] leading-[1.08] text-white mb-2 max-w-4xl text-center`}>
              {step.titleRender}
            </h3>
            <p className={`${isCompactText ? 'text-[18px]' : 'text-[17px] lg:text-[clamp(18px,1.5vw,22px)]'} leading-[1.45] text-white/[0.88] max-w-3xl text-center`}>
              {step.description}
            </p>
            {idx === 5 && (
              <div className="mt-2.5 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 bg-[#E3B896] text-[#0F2A35] font-semibold text-sm px-5 py-2 rounded-full">
                  {CTA.label}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 2. Pinned Stage Viewport: 100svh, sticky top-0 (or unpinned in nosticky flag) */}
      <div
        ref={stageRef}
        className={`${
          flags.nosticky
            ? 'relative w-full py-12 flex flex-col gap-16 px-4 sm:px-6'
            : 'sticky top-0 h-[100svh] w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0F2A35] via-[#133543] to-[#0F2A35] px-4 sm:px-6 py-5 z-10'
        }`}
      >
        {!flags.nosticky && (
          <>
            {/* Stage Header: Compact top bar (~56px) */}
            <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 pb-3 border-b border-white/10 shrink-0 h-[56px] relative">
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[18px] font-bold text-[#E3B896] tracking-tight whitespace-nowrap">
                  The Way We Deliver
                </span>
              </div>

              {/* Stepper Chips (1 to 6) */}
              <div className="hidden md:flex items-center justify-center gap-1.5 lg:gap-2 mx-auto">
                {PROCESS_STEPS.map((s, idx) => (
                  <ProcessStepChip
                    key={s.id}
                    index={idx}
                    stepNum={s.stepNum}
                    navTitle={s.navTitle}
                    scrollYProgress={smoothProgress}
                    onSelect={() => handleJumpToScene(idx)}
                  />
                ))}
              </div>

              <div className="hidden md:block w-[180px] shrink-0" />
            </header>

            {/* Centred Text Block directly above the visual card (Hardening 1 & 2: Hard-hidden when inactive) */}
            <div
              style={{ height: tallestTextHeight }}
              className="w-full max-w-[980px] mx-auto text-center relative z-[2] mb-5 flex-none"
            >
              {PROCESS_STEPS.map((step, idx) => {
                if (flags.onescene && idx !== activeSceneIndex) {
                  return null; // Unmounted in onescene mode
                }
                return (
                  <ScrubbedStepText
                    key={step.id}
                    step={step}
                    index={idx}
                    scrollYProgress={smoothProgress}
                    isCompact={isCompactText}
                    onescene={flags.onescene}
                  />
                );
              })}
            </div>

            {/* Visual Area: logical 960 x 480 canvas */}
            <main
              ref={visualAreaRef}
              className="w-full max-w-7xl mx-auto flex-1 flex items-center justify-center min-h-0 relative overflow-hidden"
            >
              <div
                style={{
                  width: 960,
                  height: 480,
                  transform: `scale(${visualScale})`,
                  transformOrigin: 'center center',
                  flexShrink: 0,
                }}
                className="relative"
                aria-hidden="true"
              >
                {(!flags.onescene || activeSceneIndex === 0) && (
                  <Scene1Visual scrollYProgress={smoothProgress} onescene={flags.onescene} />
                )}
                {(!flags.onescene || activeSceneIndex === 1) && (
                  <Scene2Visual scrollYProgress={smoothProgress} isActive={activeSceneIndex === 1} onescene={flags.onescene} />
                )}
                {(!flags.onescene || activeSceneIndex === 2) && (
                  <Scene3Visual scrollYProgress={smoothProgress} onescene={flags.onescene} />
                )}
                {(!flags.onescene || activeSceneIndex === 3) && (
                  <Scene4Visual scrollYProgress={smoothProgress} onescene={flags.onescene} />
                )}
                {(!flags.onescene || activeSceneIndex === 4) && (
                  <Scene5Visual scrollYProgress={smoothProgress} onescene={flags.onescene} />
                )}
                {(!flags.onescene || activeSceneIndex === 5) && (
                  <Scene6Visual scrollYProgress={smoothProgress} onescene={flags.onescene} />
                )}
              </div>
            </main>

            {/* Stage Footer / Progress Strip */}
            <footer className="w-full max-w-7xl mx-auto pt-2 border-t border-white/10 shrink-0 flex flex-col gap-2">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#E3B896]"
                  style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-white/50">
                <div className="flex items-center gap-2 shrink-0">
                  <span>Scroll down to advance</span>
                  <ChevronDown className="w-3.5 h-3.5 animate-bounce ambient" />
                </div>

                <p className="text-[11px] sm:text-xs text-white/50 text-right">
                  Illustrative story. Search results vary and take time to build. We never promise rankings or a set number of enquiries.
                </p>
              </div>
            </footer>
          </>
        )}

        {/* Nosticky mode: plain vertical list of 6 scenes */}
        {flags.nosticky && (
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-16">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center gap-6 pb-12 border-b border-white/10">
                <div className="text-center max-w-3xl">
                  <span className="font-mono text-[22px] font-bold text-[#E3B896] mb-1 block">
                    {step.stepNum}
                  </span>
                  <h3 className="text-[28px] font-semibold text-white mb-2">
                    {step.titleRender}
                  </h3>
                  <p className="text-[17px] text-white/80">
                    {step.description}
                  </p>
                </div>
                <div className="w-[960px] max-w-full h-[480px] flex items-center justify-center">
                  {idx === 0 && <Scene1Visual scrollYProgress={smoothProgress} onescene={true} staticMode={true} />}
                  {idx === 1 && <Scene2Visual scrollYProgress={smoothProgress} isActive={true} onescene={true} staticMode={true} />}
                  {idx === 2 && <Scene3Visual scrollYProgress={smoothProgress} onescene={true} staticMode={true} />}
                  {idx === 3 && <Scene4Visual scrollYProgress={smoothProgress} onescene={true} staticMode={true} />}
                  {idx === 4 && <Scene5Visual scrollYProgress={smoothProgress} onescene={true} staticMode={true} />}
                  {idx === 5 && <Scene6Visual scrollYProgress={smoothProgress} onescene={true} staticMode={true} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Embedded CSS for Attention Pulse breathing in Scene 2 */}
      <style>{`
        @keyframes attentionCardPulse {
          0%, 100% {
            transform: scale(1.04);
            box-shadow: 0 0 0 6px rgba(217, 68, 74, 0.18);
          }
          50% {
            transform: scale(1.065);
            box-shadow: 0 0 0 12px rgba(217, 68, 74, 0.32);
          }
        }
        .attention-pulse-active {
          animation: attentionCardPulse 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .attention-pulse-active {
            animation: none !important;
          }
        }
      `}</style>

      {/* Phase 2: Debug Overlay Chip (?debug=process or pdebug=log) */}
      {flags.debugOverlay && (
        <DebugOverlay
          buildId={typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev-local'}
          activeFlags={flags.activeFlagList}
          stats={debugStats}
          roRate={roRate}
        />
      )}
    </section>
  );
}

// Phase 2: Diagnostic HUD Overlay Component (4 updates per second)
function DebugOverlay({
  buildId,
  activeFlags,
  stats,
  roRate,
}: {
  buildId: string;
  activeFlags: string[];
  stats: {
    raw: number;
    smoothed: number;
    sceneIdx: number;
    wrapperTop: number;
    wrapperHeight: number;
    stageHeight: number;
    visibleScenesCount: number;
    visibleTextsCount: number;
  };
  roRate: number;
}) {
  const [viewportStats, setViewportStats] = useState({
    innerHeight: 0,
    visualViewportH: 0,
    dpr: 1,
    fontStatus: 'loading',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setViewportStats({
        innerHeight: window.innerHeight,
        visualViewportH: window.visualViewport?.height ? Math.round(window.visualViewport.height) : window.innerHeight,
        dpr: window.devicePixelRatio || 1,
        fontStatus: document.fonts?.status || 'unknown',
      });
    }, 250);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-3 right-3 z-[9999] bg-[#0F2A35]/95 text-white font-mono text-[11px] p-3 rounded-xl border border-white/20 shadow-2xl pointer-events-none select-none max-w-xs leading-tight"
    >
      <div className="font-bold text-[#E3B896] pb-1 border-b border-white/10 mb-1 flex items-center justify-between">
        <span>PROCESS DEBUG HUD</span>
        <span className="text-[10px] text-white/50">4Hz</span>
      </div>
      <div className="space-y-0.5">
        <div><span className="text-white/60">build:</span> {buildId.slice(0, 19)}</div>
        <div><span className="text-white/60">flags:</span> {activeFlags.length > 0 ? activeFlags.join(',') : 'none'}</div>
        <div><span className="text-white/60">progress:</span> {stats.raw.toFixed(4)} (raw) / {stats.smoothed.toFixed(4)} (s)</div>
        <div><span className="text-white/60">scene:</span> {stats.sceneIdx + 1} of 6</div>
        <div><span className="text-white/60">vis scenes/texts:</span> {stats.visibleScenesCount} / {stats.visibleTextsCount}</div>
        <div><span className="text-white/60">wrapper top/h:</span> {stats.wrapperTop.toFixed(0)}px / {stats.wrapperHeight.toFixed(0)}px</div>
        <div><span className="text-white/60">stage h:</span> {stats.stageHeight.toFixed(0)}px</div>
        <div><span className="text-white/60">win/vv h:</span> {viewportStats.innerHeight}px / {viewportStats.visualViewportH}px</div>
        <div><span className="text-white/60">dpr / fonts:</span> {viewportStats.dpr}x / {viewportStats.fontStatus}</div>
        <div>
          <span className="text-white/60">ro callbacks/s:</span>{' '}
          <span className={roRate > 10 ? 'text-red-400 font-bold' : 'text-emerald-400'}>{roRate}/s</span>
        </div>
        <div><span className="text-white/60">motion:</span> 12.23.24</div>
      </div>
    </div>
  );
}

// Step dot/chip indicator in stage header
function ProcessStepChip({
  index,
  stepNum,
  navTitle,
  scrollYProgress,
  onSelect,
}: {
  index: number;
  stepNum: string;
  navTitle: string;
  scrollYProgress: MotionValue<number>;
  onSelect: () => void;
}) {
  const { start, end } = SCENE_RANGES[index];

  const opacity = useTransform(scrollYProgress, (p: number) => {
    return p >= start - 0.02 && p <= end + 0.02 ? 1 : 0.45;
  });

  const scale = useTransform(scrollYProgress, (p: number) => {
    return p >= start - 0.02 && p <= end + 0.02 ? 1.05 : 0.95;
  });

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      style={{ opacity, scale }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/90 cursor-pointer ambient"
      title={`Jump to ${stepNum}: ${navTitle}`}
    >
      <span className="font-mono text-[#E3B896] font-semibold">{stepNum}</span>
      <span className="font-medium whitespace-nowrap">{navTitle}</span>
    </motion.button>
  );
}

// Centred, scroll-scrubbed step text above the visual (H4 & Hardening 1 & 2: Hard-hidden when inactive)
function ScrubbedStepText({
  step,
  index,
  scrollYProgress,
  isCompact,
  onescene,
}: {
  step: (typeof PROCESS_STEPS)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
  isCompact?: boolean;
  onescene?: boolean;
}) {
  const state = useTransform(scrollYProgress, (p: number) =>
    getSceneTransitionState(p, index, onescene ?? false)
  );

  const opacity = useTransform(state, (s) => s.opacity);
  const y = useTransform(state, (s) => s.y);
  const pointerEvents = useTransform(state, (s) => s.pointerEvents);
  const visibility = useTransform(state, (s) => (s.isVisible ? 'visible' : 'hidden'));

  return (
    <motion.div
      style={{
        opacity,
        y,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      aria-hidden={index !== 0}
      className="absolute inset-0 flex flex-col items-center justify-center px-4"
    >
      <span className="font-mono text-[22px] font-bold text-[#E3B896] mb-1">
        {step.stepNum}
      </span>
      <h3 className={`${isCompact ? 'text-[clamp(24px,3vw,40px)]' : 'text-[clamp(26px,7vw,34px)] lg:text-[clamp(28px,3.4vw,48px)]'} font-semibold tracking-[-0.03em] leading-[1.08] text-white mb-2 max-w-4xl text-center`}>
        {step.titleRender}
      </h3>
      <p className={`${isCompact ? 'text-[18px]' : 'text-[17px] lg:text-[clamp(18px,1.5vw,22px)]'} leading-[1.45] text-white/[0.88] max-w-3xl text-center`}>
        {step.description}
      </p>
      {index === 5 && (
        <div className="mt-2.5 flex items-center justify-center">
          <a
            href="#audit-form"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('audit-form') || document.querySelector('form');
              if (el) el.scrollIntoView({ behavior: 'auto' });
            }}
            className="inline-flex items-center gap-2 bg-[#E3B896] text-[#0F2A35] font-semibold text-sm px-5 py-2 rounded-full hover:bg-[#ebd0b9] shadow-md ambient"
          >
            {CTA.label}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </motion.div>
  );
}

// Scene visibility hook returning exact transition values (H4 & Hardening 1 & 2)
function useSceneVisibility(
  scrollYProgress: MotionValue<number>,
  sceneIndex: number,
  onescene: boolean = false,
  staticMode: boolean = false
) {
  const { start, end } = SCENE_RANGES[sceneIndex];

  const state = useTransform(scrollYProgress, (p: number) => {
    if (staticMode) {
      return {
        isVisible: true,
        opacity: 1,
        y: 0,
        scale: 1,
        pointerEvents: 'auto' as const,
      };
    }
    return getSceneTransitionState(p, sceneIndex, onescene);
  });

  const opacity = useTransform(state, (s) => s.opacity);
  const y = useTransform(state, (s) => s.y);
  const scale = useTransform(state, (s) => s.scale);
  const pointerEvents = useTransform(state, (s) => s.pointerEvents);
  const visibility = useTransform(state, (s) => (s.isVisible ? 'visible' : 'hidden'));

  const sceneProgress = useTransform(scrollYProgress, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - start) / (end - start)));
  });

  return { opacity, y, scale, pointerEvents, visibility, sceneProgress, start, end };
}

// SCENE 1: SEARCH
function Scene1Visual({
  scrollYProgress,
  onescene,
  staticMode,
}: {
  scrollYProgress: MotionValue<number>;
  onescene?: boolean;
  staticMode?: boolean;
}) {
  const { opacity, y, scale, pointerEvents, visibility, sceneProgress } = useSceneVisibility(
    scrollYProgress,
    0,
    onescene,
    staticMode
  );

  const row1Opacity = useTransform(sceneProgress, [0.12, 0.28], [0, 1]);
  const row2Opacity = useTransform(sceneProgress, [0.24, 0.40], [0, 1]);
  const row3Opacity = useTransform(sceneProgress, [0.36, 0.52], [0, 1]);

  const pin1Drop = useTransform(sceneProgress, [0.15, 0.28], [0, 1]);
  const pin2Drop = useTransform(sceneProgress, [0.28, 0.41], [0, 1]);
  const pin3Drop = useTransform(sceneProgress, [0.41, 0.54], [0, 1]);

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="w-[912px] h-[432px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
        {/* Simulated Search Bar */}
        <div className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-md shrink-0">
          <Search className="w-5 h-5 text-[#1E4A5C] shrink-0" />
          <span className="text-[22px] font-semibold text-[#0F2A35]">
            roofers in Galway
          </span>
          <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-full bg-[#DCE9EC] text-[#1E4A5C]">
            Live Search
          </span>
        </div>

        {/* 2-Column Search Results & Clean Galway Mini-Map */}
        <div className="grid grid-cols-2 gap-6 items-center flex-1 pt-4">
          <div className="flex flex-col gap-3">
            <motion.div
              style={{ opacity: row1Opacity }}
              className="bg-white rounded-xl p-3.5 text-[#0F2A35] shadow-xs flex items-center justify-between"
            >
              <div>
                <h4 className="text-[18px] font-bold">Galway Roofing Services</h4>
                <p className="text-[16px] text-[#5E6F77] mt-0.5">4.8 stars · 24 reviews</p>
              </div>
              <span className="text-[16px] font-semibold text-[#1E4A5C] bg-[#EEF3F4] px-3.5 py-1.5 rounded-lg">
                Website
              </span>
            </motion.div>

            <motion.div
              style={{ opacity: row2Opacity }}
              className="bg-white rounded-xl p-3.5 text-[#0F2A35] shadow-xs flex items-center justify-between"
            >
              <div>
                <h4 className="text-[18px] font-bold">Corrib Slate & Tile</h4>
                <p className="text-[16px] text-[#5E6F77] mt-0.5">4.9 stars · 38 reviews</p>
              </div>
              <span className="text-[16px] font-semibold text-[#1E4A5C] bg-[#EEF3F4] px-3.5 py-1.5 rounded-lg">
                Website
              </span>
            </motion.div>

            <motion.div
              style={{ opacity: row3Opacity }}
              className="bg-white rounded-xl p-3.5 text-[#0F2A35] border-2 border-[#E3B896] shadow-md flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-[18px] font-bold">Your business</h4>
                  <span className="text-[16px] font-bold uppercase bg-[#E3B896]/20 text-[#0F2A35] px-2.5 py-0.5 rounded-sm">
                    Phone only
                  </span>
                </div>
                <p className="text-[16px] text-[#5E6F77] mt-0.5">
                  4.8 stars · Missing website link
                </p>
              </div>
              <span className="text-[16px] font-semibold text-[#5E6F77] italic">
                No link
              </span>
            </motion.div>
          </div>

          <div className="bg-[#133543] rounded-2xl p-5 border border-white/10 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute inset-0 opacity-100 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 240" fill="none">
                <path d="M-20 60 C80 50, 140 100, 220 80 S340 120, 420 110" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <path d="M-10 170 C100 160, 180 130, 260 170 S360 180, 420 160" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <path d="M120 -10 C140 70, 110 150, 130 250" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <path d="M280 -10 C270 80, 290 160, 280 250" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <path d="M60 20 L340 220" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[18px] font-semibold text-white/90 tracking-wide">
                Galway
              </span>
            </div>

            <div className="relative z-10 flex items-center justify-around my-auto">
              <motion.div
                style={{
                  opacity: pin1Drop,
                  y: useTransform(pin1Drop, [0, 1], [-24, 0]),
                }}
                className="flex flex-col items-center"
              >
                <MapPin className="w-[18px] h-[18px] text-[#E3B896] fill-[#E3B896]" />
              </motion.div>

              <motion.div
                style={{
                  opacity: pin2Drop,
                  y: useTransform(pin2Drop, [0, 1], [-24, 0]),
                }}
                className="flex flex-col items-center"
              >
                <MapPin className="w-[18px] h-[18px] text-[#E3B896] fill-[#E3B896]" />
              </motion.div>

              <motion.div
                style={{
                  opacity: pin3Drop,
                  y: useTransform(pin3Drop, [0, 1], [-24, 0]),
                }}
                className="flex flex-col items-center"
              >
                <MapPin className="w-[18px] h-[18px] text-[#E3B896] fill-[#E3B896]" />
              </motion.div>
            </div>

            <div className="relative z-10" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// SCENE 2: REVIEW
function Scene2Visual({
  scrollYProgress,
  isActive,
  onescene,
  staticMode,
}: {
  scrollYProgress: MotionValue<number>;
  isActive: boolean;
  onescene?: boolean;
  staticMode?: boolean;
}) {
  const { opacity, y, scale, pointerEvents, visibility, sceneProgress } = useSceneVisibility(
    scrollYProgress,
    1,
    onescene,
    staticMode
  );

  const cardSlide = useTransform(sceneProgress, [0.15, 0.38], [-40, 0]);
  const cardOpacity = useTransform(sceneProgress, [0.15, 0.32], [0, 1]);
  const dashedBoxReveal = useTransform(sceneProgress, [0.32, 0.46], [0, 1]);
  const redChipPop = useTransform(sceneProgress, [0.38, 0.50], [0, 1]);

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="w-[912px] h-[432px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-center">
        <div className="w-full max-w-[760px] mx-auto flex flex-col gap-3 relative">
          <div className="bg-white rounded-xl p-3.5 text-[#0F2A35] shadow-sm flex items-center justify-between">
            <div>
              <h4 className="text-[18px] font-bold">Galway Roofing Services</h4>
              <p className="text-[16px] text-[#5E6F77] mt-0.5">4.8 stars · 24 reviews</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-semibold text-[#1E4A5C] bg-[#EEF3F4] px-4 py-2 rounded-lg">
                Website
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 text-[#0F2A35] shadow-sm flex items-center justify-between">
            <div>
              <h4 className="text-[18px] font-bold">Corrib Slate & Tile</h4>
              <p className="text-[16px] text-[#5E6F77] mt-0.5">4.9 stars · 38 reviews</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-semibold text-[#1E4A5C] bg-[#EEF3F4] px-4 py-2 rounded-lg">
                Website
              </span>
            </div>
          </div>

          <div className="relative pt-3">
            <motion.div
              style={{
                opacity: redChipPop,
                scale: useTransform(redChipPop, [0, 1], [0.8, 1]),
              }}
              className="absolute -top-7 right-4 z-20 flex flex-col items-center pointer-events-none"
            >
              <div className="bg-[#C23B3F] text-white text-[18px] font-bold rounded-full px-4 py-2 shadow-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-white" />
                <span>Missing website link</span>
              </div>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-[#C23B3F]" />
            </motion.div>

            <motion.div
              style={{
                x: cardSlide,
                opacity: cardOpacity,
              }}
              className={`bg-white rounded-2xl p-4 text-[#0F2A35] border-[3px] border-[#D9444A] shadow-xl flex items-center justify-between relative z-10 ambient ${
                isActive ? 'attention-pulse-active' : ''
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-[24px] font-bold text-[#0F2A35]">Your business</h4>
                  <span className="text-[16px] font-bold text-[#0F2A35] bg-[#FBE4E1] px-3 py-0.5 rounded-sm">
                    PHONE ONLY
                  </span>
                </div>
                <p className="text-[17px] font-medium text-[#0F2A35] mt-1">
                  4.8 stars · Local contractor profile
                </p>
              </div>

              <motion.div
                style={{ opacity: dashedBoxReveal }}
                className="border-2 border-dashed border-[#D9444A] rounded-xl px-4 py-2.5 flex items-center gap-2 bg-[#FBE4E1]/40"
              >
                <AlertCircle className="w-4 h-4 text-[#D9444A] shrink-0" />
                <span className="text-[#D9444A] text-[17px] font-bold">
                  Missing website link
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// SCENE 3: AUDIT & CONCEPT
function Scene3Visual({
  scrollYProgress,
  onescene,
  staticMode,
}: {
  scrollYProgress: MotionValue<number>;
  onescene?: boolean;
  staticMode?: boolean;
}) {
  const { opacity, y, scale, pointerEvents, visibility, sceneProgress } = useSceneVisibility(
    scrollYProgress,
    2,
    onescene,
    staticMode
  );

  const wobbleX = useTransform(sceneProgress, [0.20, 0.28, 0.35], [0, -6, 0]);
  const cardSlideToPortal = useTransform(sceneProgress, [0.35, 0.65], [0, 220]);
  const cardScaleDown = useTransform(sceneProgress, [0.35, 0.65], [1, 0.55]);
  const cardFadeOut = useTransform(sceneProgress, [0.50, 0.68], [1, 0]);
  const portalGlow = useTransform(sceneProgress, [0.55, 0.65, 0.75], [1, 1.8, 1]);

  const webNav = useTransform(sceneProgress, [0.68, 0.76], [0, 1]);
  const webHero = useTransform(sceneProgress, [0.74, 0.82], [0, 1]);
  const webTiles = useTransform(sceneProgress, [0.80, 0.88], [0, 1]);
  const webCta = useTransform(sceneProgress, [0.86, 0.94], [0, 1]);
  const webBadge = useTransform(sceneProgress, [0.90, 0.98], [0, 1]);

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="w-[912px] h-[432px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex items-center justify-between relative overflow-hidden">
        {/* LEFT: Compact Google Business Profile card */}
        <motion.div
          style={{
            opacity: cardFadeOut,
            x: useTransform(cardSlideToPortal, (x) => x + (wobbleX as any).get()),
            scale: cardScaleDown,
          }}
          className="w-[250px] bg-white rounded-2xl p-4 text-[#0F2A35] border-[3px] border-[#D9444A] shadow-xl flex flex-col justify-between h-[280px] shrink-0 z-20"
        >
          <div>
            <span className="text-[16px] font-semibold text-[#5E6F77] block mb-1">
              Google Business Profile
            </span>
            <h4 className="text-[22px] font-bold text-[#0F2A35]">Your business</h4>
            <div className="flex items-center gap-1 text-[#E8943A] mt-1 text-[17px] font-semibold">
              <Star className="w-4 h-4 fill-current" />
              <span>4.8 stars</span>
            </div>
          </div>

          <div className="bg-[#FBE4E1] border border-[#D9444A]/30 rounded-xl p-3 text-center">
            <span className="text-[#D9444A] text-[17px] font-bold flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Missing website link
            </span>
          </div>

          <div className="text-[16px] text-[#5E6F77] font-medium border-t border-black/5 pt-2">
            Local Trade Listing
          </div>
        </motion.div>

        {/* CENTRE: Open Hours portal */}
        <motion.div
          style={{
            scale: portalGlow,
          }}
          className="w-[220px] h-[260px] rounded-3xl bg-[#0F2A35] border-2 border-[#1E4A5C] shadow-[0_0_24px_rgba(227,184,150,0.25)] p-5 flex flex-col items-center justify-center text-center shrink-0 relative z-10"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#1E4A5C]/40 border border-[#E3B896]/30 flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-[#E3B896]" />
          </div>
          <span className="font-heading text-[22px] font-bold text-white tracking-tight">
            Open <span className="text-[#E3B896]">Hours</span>
          </span>
          <div className="w-16 h-1 bg-[#E3B896]/60 rounded-full my-3" />
          <span className="text-[16px] text-[#DCE9EC] font-medium leading-tight">
            Design &amp; Audit Engine
          </span>

          <div className="flex gap-1.5 mt-3 opacity-60">
            <div className="w-4 h-1 bg-[#E3B896] rounded-full" />
            <div className="w-4 h-1 bg-[#E3B896] rounded-full" />
            <div className="w-4 h-1 bg-[#E3B896] rounded-full" />
          </div>
        </motion.div>

        {/* RIGHT: Finished Website assembling block by block */}
        <div className="w-[370px] h-[370px] flex flex-col justify-between shrink-0 z-20">
          <div className="bg-white rounded-2xl border-2 border-[#1E4A5C] shadow-2xl p-4 flex flex-col justify-between flex-1">
            <motion.div
              style={{ opacity: webNav }}
              className="flex items-center justify-between pb-2 border-b border-black/5"
            >
              <span className="text-[18px] font-bold text-[#0F2A35]">Your business</span>
              <span className="text-[16px] font-semibold bg-[#1E4A5C] text-white px-3 py-1 rounded-full">
                Call now
              </span>
            </motion.div>

            <motion.div style={{ opacity: webHero }} className="py-1">
              <h5 className="text-[20px] font-bold text-[#0F2A35] leading-snug">
                Roofing you can rely on
              </h5>
              <div className="flex items-center gap-1 text-[#E8943A] text-[16px] font-medium mt-0.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-black/70 ml-1">5.0 stars</span>
              </div>
            </motion.div>

            <motion.div style={{ opacity: webTiles }} className="grid grid-cols-3 gap-1.5 py-1">
              <div className="h-10 rounded-lg bg-[#EEF3F4] border border-black/5 flex items-center justify-center text-[13px] font-medium text-[#1E4A5C]">
                Slating
              </div>
              <div className="h-10 rounded-lg bg-[#EEF3F4] border border-black/5 flex items-center justify-center text-[13px] font-medium text-[#1E4A5C]">
                Repairs
              </div>
              <div className="h-10 rounded-lg bg-[#EEF3F4] border border-black/5 flex items-center justify-center text-[13px] font-medium text-[#1E4A5C]">
                Gutters
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: webCta }}
              className="flex items-center justify-between pt-1 gap-2"
            >
              <div className="flex-1 py-1.5 rounded-xl bg-[#1E4A5C] text-white text-[16px] font-semibold text-center">
                Request a quote
              </div>
              <span className="text-[16px] font-bold text-[#1E4A5C] bg-[#1E4A5C]/15 px-3 py-1 rounded-lg">
                Website
              </span>
            </motion.div>

            <motion.div
              style={{ opacity: webBadge }}
              className="mt-2 flex items-center justify-center gap-1.5 bg-[#2E9E6B]/15 text-[#2E9E6B] rounded-xl py-1 px-3 text-[17px] font-bold"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Built for enquiries</span>
            </motion.div>
          </div>

          <motion.div
            style={{ opacity: webBadge }}
            className="flex items-center justify-between gap-2 mt-2"
          >
            <span className="text-[17px] font-medium text-white bg-white/10 border border-white/20 px-3 py-1 rounded-full text-center flex-1">
              2-minute video audit
            </span>
            <span className="text-[17px] font-bold text-[#0F2A35] bg-[#E3B896] px-3 py-1 rounded-full text-center flex-1">
              Homepage concept
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// SCENE 4: READY TO BE FOUND
function Scene4Visual({
  scrollYProgress,
  onescene,
  staticMode,
}: {
  scrollYProgress: MotionValue<number>;
  onescene?: boolean;
  staticMode?: boolean;
}) {
  const { opacity, y, scale, pointerEvents, visibility, sceneProgress } = useSceneVisibility(
    scrollYProgress,
    3,
    onescene,
    staticMode
  );

  const climbY = useTransform(sceneProgress, [0.10, 0.22, 0.25, 0.37, 0.40, 0.52], [264, 176, 176, 88, 88, 0]);
  const comp3Y = useTransform(sceneProgress, [0.10, 0.22], [176, 264]);
  const comp2Y = useTransform(sceneProgress, [0.25, 0.37], [88, 176]);
  const comp1Y = useTransform(sceneProgress, [0.40, 0.52], [0, 88]);

  const peachRingOpacity = useTransform(sceneProgress, [0.52, 0.58], [0, 1]);
  const timeBarWidth = useTransform(sceneProgress, [0.10, 0.52], ['0%', '100%']);

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="w-[912px] h-[432px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
        <div className="w-full bg-white rounded-2xl p-3 flex items-center gap-3 shadow-md">
          <Search className="w-5 h-5 text-[#1E4A5C] shrink-0" />
          <span className="text-[22px] font-semibold text-[#0F2A35]">
            roofers in Galway
          </span>
          <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-full bg-[#DCE9EC] text-[#1E4A5C]">
            Search Results
          </span>
        </div>

        <div className="w-full flex items-center gap-3 py-1">
          <div className="flex items-center gap-1.5 text-[16px] font-semibold text-white/90 shrink-0">
            <Clock className="w-4 h-4 text-[#E3B896]" />
            <span>Over time</span>
          </div>
          <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden relative">
            <motion.div
              style={{ width: timeBarWidth }}
              className="h-full bg-[#E3B896] rounded-full"
            />
          </div>
        </div>

        <div className="relative w-full h-[340px]">
          <motion.div
            style={{ y: comp1Y }}
            className="absolute top-0 inset-x-0 h-[76px] bg-white rounded-xl p-3.5 text-[#0F2A35] shadow-xs flex items-center justify-between"
          >
            <div>
              <h4 className="text-[18px] font-bold">Galway Roofing Services</h4>
              <p className="text-[16px] text-[#5E6F77]">4.8 stars · 24 reviews</p>
            </div>
            <span className="text-[16px] font-semibold text-[#1E4A5C] bg-[#EEF3F4] px-4 py-1.5 rounded-lg">
              Website
            </span>
          </motion.div>

          <motion.div
            style={{ y: comp2Y }}
            className="absolute top-0 inset-x-0 h-[76px] bg-white rounded-xl p-3.5 text-[#0F2A35] shadow-xs flex items-center justify-between"
          >
            <div>
              <h4 className="text-[18px] font-bold">Corrib Slate & Tile</h4>
              <p className="text-[16px] text-[#5E6F77]">4.9 stars · 38 reviews</p>
            </div>
            <span className="text-[16px] font-semibold text-[#1E4A5C] bg-[#EEF3F4] px-4 py-1.5 rounded-lg">
              Website
            </span>
          </motion.div>

          <motion.div
            style={{ y: comp3Y }}
            className="absolute top-0 inset-x-0 h-[76px] bg-white rounded-xl p-3.5 text-[#0F2A35] shadow-xs flex items-center justify-between"
          >
            <div>
              <h4 className="text-[18px] font-bold">Western Roofing</h4>
              <p className="text-[16px] text-[#5E6F77]">4.7 stars · 19 reviews</p>
            </div>
            <span className="text-[16px] font-semibold text-[#1E4A5C] bg-[#EEF3F4] px-4 py-1.5 rounded-lg">
              Website
            </span>
          </motion.div>

          <motion.div
            style={{ y: climbY }}
            className="absolute top-0 inset-x-0 h-[76px] bg-white rounded-xl p-3.5 text-[#0F2A35] border-2 border-[#1E4A5C] shadow-lg flex items-center justify-between z-10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E4A5C] text-white flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-[#E3B896]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-[18px] font-bold">Your business</h4>
                  <span className="text-[14px] font-bold text-[#1E4A5C] bg-[#1E4A5C]/15 px-2.5 py-0.5 rounded-md">
                    Website
                  </span>
                </div>
                <p className="text-[16px] text-[#5E6F77]">4.8 stars · Verified trade website</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[16px] font-semibold text-white bg-[#1E4A5C] px-3.5 py-1.5 rounded-lg">
                Request a quote
              </span>
              <span className="text-[16px] font-semibold text-[#1E4A5C] bg-[#EEF3F4] px-3.5 py-1.5 rounded-lg flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                Call
              </span>
            </div>

            <motion.div
              style={{ opacity: peachRingOpacity }}
              className="absolute inset-0 rounded-xl ring-2 ring-[#E3B896] shadow-[0_0_20px_rgba(227,184,150,0.5)] pointer-events-none"
            />
          </motion.div>
        </div>

        <p className="text-[16px] text-white/75 text-center pt-1">
          Illustrative. Search results vary and take time to build.
        </p>
      </div>
    </motion.div>
  );
}

// SCENE 5: DIRECT ENQUIRIES
function Scene5Visual({
  scrollYProgress,
  onescene,
  staticMode,
}: {
  scrollYProgress: MotionValue<number>;
  onescene?: boolean;
  staticMode?: boolean;
}) {
  const { opacity, y, scale, pointerEvents, visibility, sceneProgress } = useSceneVisibility(
    scrollYProgress,
    4,
    onescene,
    staticMode
  );

  const chip1In = useTransform(sceneProgress, [0.12, 0.22], [0, 1]);
  const chip2In = useTransform(sceneProgress, [0.24, 0.34], [0, 1]);
  const chip3In = useTransform(sceneProgress, [0.36, 0.46], [0, 1]);
  const chip4In = useTransform(sceneProgress, [0.48, 0.58], [0, 1]);

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="w-[912px] h-[432px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex items-center justify-between gap-6">
        <div className="flex-1 flex flex-col justify-between h-full">
          <div className="flex flex-col gap-2.5">
            <div className="bg-white rounded-xl p-3.5 text-[#0F2A35] ring-2 ring-[#1E4A5C] shadow-lg flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-[18px] font-bold">Your business</h4>
                  <span className="text-[14px] font-bold text-[#1E4A5C] bg-[#1E4A5C]/15 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
                <p className="text-[16px] text-[#5E6F77]">4.8 stars · Direct web leads</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[16px] font-semibold text-white bg-[#1E4A5C] px-3 py-1.5 rounded-lg shadow-sm">
                  Request a quote
                </span>
                <span className="text-[16px] font-semibold text-[#1E4A5C] bg-[#EEF3F4] px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </span>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-3 text-[#0F2A35] opacity-60 flex items-center justify-between">
              <div>
                <span className="text-[16px] font-bold">Galway Roofing Services</span>
                <p className="text-[14px] text-[#5E6F77]">Standard listing</p>
              </div>
              <span className="text-[14px] font-medium text-[#5E6F77]">Website</span>
            </div>
          </div>

          <div className="bg-[#133543] rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[16px] font-semibold text-white/90">
                Local Homeowners Searching
              </span>
              <span className="text-xs text-[#E3B896] font-medium">Direct enquiry traffic</span>
            </div>

            <div className="flex items-center justify-between px-3 py-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white">
                    <User className="w-5 h-5 text-white/80" />
                  </div>
                  <span className="text-[12px] text-white/60">Searcher</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-around pt-2 border-t border-white/10 text-xs text-[#DCE9EC]">
              <span>&bull; 2 tap "Request a quote"</span>
              <span>&bull; 1 taps "Call"</span>
              <span>&bull; Photos &amp; details sent</span>
            </div>
          </div>
        </div>

        <div className="w-[340px] h-[380px] bg-[#0F2A35] border-2 border-white/20 rounded-[32px] p-4 shadow-2xl flex flex-col justify-between shrink-0">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono text-white/60">Notifications</span>
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-xs font-mono text-white/90">
              <Clock className="w-3 h-3 text-[#E3B896]" />
              <span>9:15 pm</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 my-auto">
            <motion.div
              style={{
                opacity: chip1In,
                y: useTransform(chip1In, [0, 1], [14, 0]),
              }}
              className="bg-white rounded-xl p-3 text-[#0F2A35] shadow-md flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1E4A5C]/10 text-[#1E4A5C] flex items-center justify-center mt-0.5 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[17px] font-bold leading-tight">New quote request</h5>
                  <p className="text-[14px] text-[#5E6F77] mt-0.5 leading-snug">Slate repair · Salthill</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold uppercase bg-[#EEF3F4] text-[#5E6F77] px-2 py-0.5 rounded-sm shrink-0">
                Sample
              </span>
            </motion.div>

            <motion.div
              style={{
                opacity: chip2In,
                y: useTransform(chip2In, [0, 1], [14, 0]),
              }}
              className="bg-white rounded-xl p-3 text-[#0F2A35] shadow-md flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E3B896]/20 text-[#0F2A35] flex items-center justify-center mt-0.5 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[17px] font-bold leading-tight">Missed call: auto-text sent</h5>
                  <p className="text-[14px] text-[#5E6F77] mt-0.5 leading-snug">Homeowner notified instantly</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold uppercase bg-[#EEF3F4] text-[#5E6F77] px-2 py-0.5 rounded-sm shrink-0">
                Sample
              </span>
            </motion.div>

            <motion.div
              style={{
                opacity: chip3In,
                y: useTransform(chip3In, [0, 1], [14, 0]),
              }}
              className="bg-white rounded-xl p-3 text-[#0F2A35] shadow-md flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1E4A5C]/10 text-[#1E4A5C] flex items-center justify-center mt-0.5 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[17px] font-bold leading-tight">New quote request</h5>
                  <p className="text-[14px] text-[#5E6F77] mt-0.5 leading-snug">Chimney flashing repair</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold uppercase bg-[#EEF3F4] text-[#5E6F77] px-2 py-0.5 rounded-sm shrink-0">
                Sample
              </span>
            </motion.div>

            <motion.div
              style={{
                opacity: chip4In,
                y: useTransform(chip4In, [0, 1], [14, 0]),
              }}
              className="bg-white rounded-xl p-3 text-[#0F2A35] shadow-md flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2E9E6B]/15 text-[#2E9E6B] flex items-center justify-center mt-0.5 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[17px] font-bold leading-tight">WhatsApp message</h5>
                  <p className="text-[14px] text-[#5E6F77] mt-0.5 leading-snug">Project photos received</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold uppercase bg-[#EEF3F4] text-[#5E6F77] px-2 py-0.5 rounded-sm shrink-0">
                Sample
              </span>
            </motion.div>
          </div>

          <div className="text-center text-[11px] text-white/50">
            Direct web enquiries delivered live
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// SCENE 6: WORKING AROUND THE CLOCK
function Scene6Visual({
  scrollYProgress,
  onescene,
  staticMode,
}: {
  scrollYProgress: MotionValue<number>;
  onescene?: boolean;
  staticMode?: boolean;
}) {
  const { opacity, y, scale, pointerEvents, visibility, sceneProgress } = useSceneVisibility(
    scrollYProgress,
    5,
    onescene,
    staticMode
  );

  const flipRatio = useTransform(sceneProgress, [0.15, 0.45], [0, 180]);

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="w-[912px] h-[432px] grid grid-cols-2 gap-6 items-center">
        <div className="bg-white/95 rounded-2xl p-6 text-[#0F2A35] shadow-xl flex flex-col justify-between h-[340px] text-center">
          <div className="flex items-center justify-between pb-2 border-b border-black/5">
            <span className="text-[18px] font-bold">Your office</span>
            <Building2 className="w-5 h-5 text-[#5E6F77]" />
          </div>

          <div className="my-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF3F4] flex items-center justify-center text-[#1E4A5C] mb-4">
              <Building2 className="w-7 h-7" />
            </div>

            <motion.div
              style={{ rotateY: flipRatio }}
              className="px-5 py-1.5 rounded-full bg-[#EEF3F4] text-[#5E6F77] border border-black/10 text-[16px] font-bold ambient"
            >
              CLOSED
            </motion.div>
          </div>

          <span className="text-[16px] text-[#5E6F77] font-medium">Closes at 5:30 pm</span>
        </div>

        <div className="bg-white rounded-2xl p-6 text-[#0F2A35] shadow-xl flex flex-col justify-between h-[340px] text-center border-2 border-[#2E9E6B]">
          <div className="flex items-center justify-between pb-2 border-b border-black/5">
            <span className="text-[18px] font-bold">Your website</span>
            <Globe className="w-5 h-5 text-[#2E9E6B]" />
          </div>

          <div className="my-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2E9E6B]/10 flex items-center justify-center text-[#2E9E6B] mb-4">
              <Globe className="w-7 h-7" />
            </div>

            <div className="px-5 py-1.5 rounded-full bg-[#2E9E6B] text-white text-[16px] font-bold shadow-md">
              OPEN 24h
            </div>
          </div>

          <span className="text-[16px] text-[#5E6F77] font-medium">Captures enquiries around the clock</span>
        </div>
      </div>
    </motion.div>
  );
}
