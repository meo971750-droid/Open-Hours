import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform, MotionValue } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { CTA } from '../content';
import {
  SCENES,
  SCENE_WEIGHTS,
  SCENE_RANGES,
  PROCESS_SCENES_VERSION,
  getSceneTransitionState,
  totalWeight,
} from '../components/process';

export { SCENE_WEIGHTS, SCENE_RANGES, PROCESS_SCENES_VERSION, totalWeight };

// Build ID declaration from Vite define (H10)
declare const __BUILD_ID__: string;

// Print build ID and process scenes version once to console on module load
if (typeof window !== 'undefined') {
  console.log('OpenHours build: ' + (typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev-local'));
  console.log('OpenHours process scenes: ' + PROCESS_SCENES_VERSION);
}

export const PROCESS_SCROLL_PER_WEIGHT_SVH_DESKTOP = 125;
export const PROCESS_SCROLL_PER_WEIGHT_SVH_MOBILE = 100;

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
    navTitle: 'Apply',
    title: 'You apply for a package',
    titleRender: (
      <>
        You <span className="text-[#E3B896]">apply</span> for a package
      </>
    ),
    description:
      'Choose any package and send your business details through a short form. We confirm the next steps with you.',
  },
  {
    id: 3,
    stepNum: '03',
    navTitle: 'Portal',
    title: 'Follow your project in a personal portal',
    titleRender: (
      <>
        Follow your project in a <span className="text-[#E3B896]">personal portal</span>
      </>
    ),
    description:
      "See what's done, what's next and what we need from you, all in one private place.",
  },
  {
    id: 4,
    stepNum: '04',
    navTitle: 'Found',
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
    navTitle: 'Enquiries',
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
    navTitle: 'Always on',
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



export default function OurProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const visualAreaRef = useRef<HTMLDivElement>(null);
  const textMeasurerNormalRef = useRef<HTMLDivElement>(null);
  const textMeasurerCompactRef = useRef<HTMLDivElement>(null);

  // Diagnostic flags
  const flags = useMemo(() => parseDebugFlags(), []);

  // Motion values for smooth scrubbing
  const smoothProgress = useMotionValue(0);
  const rawProgressVal = useMotionValue(0);

  // Active scene index with 0.006 hysteresis (Hardening 4)
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Responsive scale & height state (Requirement 1, 2, 3)
  const [visualScale, setVisualScale] = useState(1);
  const [isCompactText, setIsCompactText] = useState(false);
  const [normalTextHeight, setNormalTextHeight] = useState<number>(170);
  const [compactTextHeight, setCompactTextHeight] = useState<number>(115);
  const [visualAreaHeight, setVisualAreaHeight] = useState<number>(400);

  const isUpdatingScale = useRef(false); // Lock flag (Hardening 5)
  const lastScaleRef = useRef(1);
  const lastNormalMeasuredWidthRef = useRef(0);
  const lastCompactMeasuredWidthRef = useRef(0);
  const compactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    visualAreaHeight: 0,
    appliedScale: 1,
    isCompact: false,
    visibleScenesCount: 1,
    visibleTextsCount: 1,
  });

  // Requirement 3: Measure tallest text block in normal and compact states
  const measureTexts = () => {
    // Normal measurer
    if (textMeasurerNormalRef.current) {
      const currentWidth = textMeasurerNormalRef.current.offsetWidth;
      if (Math.abs(currentWidth - lastNormalMeasuredWidthRef.current) > 2 || lastNormalMeasuredWidthRef.current === 0) {
        lastNormalMeasuredWidthRef.current = currentWidth;
        const children = Array.from(textMeasurerNormalRef.current.children) as HTMLElement[];
        let maxH = 0;
        children.forEach((child) => {
          const h = child.offsetHeight;
          if (h > maxH) maxH = h;
        });
        if (maxH > 0) {
          const minReserve = typeof window !== 'undefined' && window.innerWidth < 768 ? 190 : 160;
          setNormalTextHeight(Math.max(minReserve, Math.ceil(maxH)));
        }
      }
    }

    // Compact measurer
    if (textMeasurerCompactRef.current) {
      const currentWidth = textMeasurerCompactRef.current.offsetWidth;
      if (Math.abs(currentWidth - lastCompactMeasuredWidthRef.current) > 2 || lastCompactMeasuredWidthRef.current === 0) {
        lastCompactMeasuredWidthRef.current = currentWidth;
        const children = Array.from(textMeasurerCompactRef.current.children) as HTMLElement[];
        let maxH = 0;
        children.forEach((child) => {
          const h = child.offsetHeight;
          if (h > maxH) maxH = h;
        });
        if (maxH > 0) {
          const minReserve = typeof window !== 'undefined' && window.innerWidth < 768 ? 130 : 105;
          setCompactTextHeight(Math.max(minReserve, Math.ceil(maxH)));
        }
      }
    }
  };

  useEffect(() => {
    measureTexts();
    const handleResize = () => {
      measureTexts();
    };
    window.addEventListener('resize', handleResize);
    document.fonts?.ready?.then(() => measureTexts());
    window.addEventListener('load', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
      if (compactTimeoutRef.current) {
        clearTimeout(compactTimeoutRef.current);
      }
    };
  }, []);

  // Requirement 3: Debounced compact mode decision (at most once per 250ms, never in same frame)
  const scheduleCompactDecision = (s_uncomp: number) => {
    if (compactTimeoutRef.current) return;
    compactTimeoutRef.current = setTimeout(() => {
      compactTimeoutRef.current = null;
      setIsCompactText((currentCompact) => {
        // Hysteresis: on when < 0.62, off when > 0.70
        if (!currentCompact && s_uncomp < 0.62) {
          return true;
        }
        if (currentCompact && s_uncomp > 0.70) {
          return false;
        }
        return currentCompact;
      });
    }, 250);
  };

  // Requirement 2: Scale rule (hard min 0.4, step 0.005, 0.5% deadband, no 0.68 floor)
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
          return;
        }

        const areaW = node.clientWidth;
        const areaH = node.clientHeight;
        if (areaW === 0 || areaH === 0) return;

        setVisualAreaHeight(areaH);

        // Requirement 3: s_uncompacted computed from NORMAL mode geometry
        const stageH = stageRef.current ? stageRef.current.offsetHeight : areaH + 300;
        const normalFixedOverhead = 40 + 56 + normalTextHeight + 20 + 48;
        const normalAreaH = Math.max(0, stageH - normalFixedOverhead);
        const s_uncompacted = Math.min(areaW / 960, Math.max(0, normalAreaH - 12) / 480);

        scheduleCompactDecision(s_uncompacted);

        // Available canvas height with 12px top padding and 12px bottom clearance
        const availableH = Math.max(0, areaH - 24);
        const rawScale = Math.min(areaW / 960, availableH / 480);
        // Requirement 2: clamped to hard minimum of 0.4, rounded to 0.005 steps
        const clampedScale = Math.max(0.4, Math.min(1.05, rawScale));
        const roundedScale = Math.round(clampedScale / 0.005) * 0.005;

        // Apply only when changed by at least 0.5%
        if (Math.abs(roundedScale - lastScaleRef.current) / lastScaleRef.current >= 0.005) {
          lastScaleRef.current = roundedScale;
          setVisualScale(roundedScale);
        }
      } finally {
        isUpdatingScale.current = false;
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(node);
    return () => ro.disconnect();
  }, [flags.fixedscale, normalTextHeight]);

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
          visualAreaHeight,
          appliedScale: visualScale,
          isCompact: isCompactText,
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
  }, [flags.raw, flags.onescene, visualAreaHeight, visualScale, isCompactText]);

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

      {/* Normal mode measurement container to calculate tallest step height at current width */}
      <div
        ref={textMeasurerNormalRef}
        aria-hidden="true"
        className="w-full max-w-[980px] absolute left-[-9999px] top-0 pointer-events-none opacity-0 invisible"
      >
        {PROCESS_STEPS.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center justify-center px-4 py-1">
            <span className="font-mono text-[22px] font-bold text-[#E3B896] mb-1">
              {step.stepNum}
            </span>
            <h3 className="text-[clamp(26px,7vw,34px)] lg:text-[clamp(28px,3.4vw,48px)] font-semibold tracking-[-0.03em] leading-[1.08] text-white mb-2 max-w-4xl text-center">
              {step.titleRender}
            </h3>
            <p className="text-[17px] lg:text-[clamp(18px,1.5vw,22px)] leading-[1.45] text-white/[0.88] max-w-3xl text-center">
              {step.description}
            </p>
            {idx === 5 && (
              <div className="mt-3 flex flex-col items-center justify-center gap-1.5">
                <span className="inline-flex items-center gap-2 bg-[#E3B896] text-[#0F2A35] font-semibold text-sm px-6 py-2.5 rounded-full">
                  {CTA.version}
                </span>
                <span className="text-[12px] text-white/60">
                  If it&apos;s not for you, we stop contacting you.
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Compact mode measurement container (Requirement 3: numeral hidden, title clamp max 34px, description 16-18px leading 1.35) */}
      <div
        ref={textMeasurerCompactRef}
        aria-hidden="true"
        className="w-full max-w-[980px] absolute left-[-9999px] top-0 pointer-events-none opacity-0 invisible"
      >
        {PROCESS_STEPS.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center justify-center px-4 py-1">
            <h3 className="text-[clamp(20px,3.2vw,34px)] font-semibold tracking-[-0.03em] leading-[1.08] text-white mb-1.5 max-w-4xl text-center">
              {step.titleRender}
            </h3>
            <p className="text-[clamp(16px,1.8vw,18px)] leading-[1.35] text-white/[0.88] max-w-3xl text-center">
              {step.description}
            </p>
            {idx === 5 && (
              <div className="mt-2 flex flex-col items-center justify-center gap-1">
                <span className="inline-flex items-center gap-2 bg-[#E3B896] text-[#0F2A35] font-semibold text-xs px-4 py-1.5 rounded-full">
                  {CTA.version}
                </span>
                <span className="text-[10px] text-white/60">
                  If it&apos;s not for you, we stop contacting you.
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
            : 'sticky top-0 h-[100svh] w-full flex flex-col justify-between overflow-clip bg-gradient-to-b from-[#0F2A35] via-[#133543] to-[#0F2A35] px-4 sm:px-6 py-4 sm:py-5 z-10'
        }`}
      >
        {!flags.nosticky && (
          <>
            {/* Stage Header: Compact top bar (~56px normal, ~48px compact) */}
            <header className={`w-full max-w-7xl mx-auto flex items-center justify-between gap-4 border-b border-white/10 shrink-0 relative ${isCompactText ? 'h-[48px] pb-2 mb-2' : 'h-[56px] pb-3 mb-4'}`}>
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
              style={{ height: isCompactText ? compactTextHeight : normalTextHeight }}
              className={`w-full max-w-[980px] mx-auto text-center relative z-[2] flex-none ${isCompactText ? 'mb-2.5' : 'mb-5'}`}
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
              className="w-full max-w-7xl mx-auto flex-1 min-h-0 relative overflow-visible pt-3 pb-4 px-2"
            >
              {/* Scaled canvas box matching exact layout size logicalW * s and logicalH * s (Requirement 1) */}
              <div
                style={{
                  width: Math.round(960 * visualScale),
                  height: Math.round(480 * visualScale),
                }}
                className="mx-auto relative overflow-visible"
                aria-hidden="true"
              >
                {/* Logical canvas pinned to top-left of the scaled layout box */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 960,
                    height: 480,
                    transform: `scale(${visualScale})`,
                    transformOrigin: 'top left',
                  }}
                  className="relative overflow-visible"
                >
                  {SCENES.map((SceneComponent, idx) => {
                    if (flags.onescene && idx !== activeSceneIndex) {
                      return null;
                    }
                    return (
                      <SceneComponent
                        key={idx}
                        scrollYProgress={smoothProgress}
                        onescene={flags.onescene}
                        staticMode={false}
                        isActive={activeSceneIndex === idx}
                      />
                    );
                  })}
                </div>
              </div>
            </main>

            {/* Stage Footer / Progress Strip */}
            <footer className="w-full max-w-7xl mx-auto pt-2 border-t border-white/10 shrink-0 flex flex-col gap-2 mt-3">
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
            {PROCESS_STEPS.map((step, idx) => {
              const SceneComponent = SCENES[idx];
              return (
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
                    {idx === 5 && (
                      <div className="mt-4 flex flex-col items-center justify-center gap-1.5">
                        <a
                          href="#audit-form"
                          className="inline-flex items-center gap-2 bg-[#E3B896] text-[#0F2A35] font-semibold text-[15px] px-6 py-2.5 rounded-full hover:bg-[#ebd0b9] shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#E3B896] focus:ring-offset-2 focus:ring-offset-[#0F2A35]"
                        >
                          <span>{CTA.version}</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                        <span className="text-[13px] text-white/60">
                          If it&apos;s not for you, we stop contacting you.
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-[960px] max-w-full h-[480px] flex items-center justify-center">
                    <SceneComponent
                      scrollYProgress={smoothProgress}
                      onescene={true}
                      staticMode={true}
                      isActive={true}
                    />
                  </div>
                </div>
              );
            })}
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
    visualAreaHeight: number;
    appliedScale: number;
    isCompact: boolean;
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
        <div><span className="text-white/60">scenes:</span> {PROCESS_SCENES_VERSION}</div>
        <div><span className="text-white/60">flags:</span> {activeFlags.length > 0 ? activeFlags.join(',') : 'none'}</div>
        <div><span className="text-white/60">progress:</span> {stats.raw.toFixed(4)} (raw) / {stats.smoothed.toFixed(4)} (s)</div>
        <div><span className="text-white/60">scene:</span> {stats.sceneIdx + 1} of 6</div>
        <div><span className="text-white/60">vis scenes/texts:</span> {stats.visibleScenesCount} / {stats.visibleTextsCount}</div>
        <div><span className="text-white/60">wrapper top/h:</span> {stats.wrapperTop.toFixed(0)}px / {stats.wrapperHeight.toFixed(0)}px</div>
        <div><span className="text-white/60">stage h:</span> {stats.stageHeight.toFixed(0)}px</div>
        <div><span className="text-white/60">visual area h:</span> {stats.visualAreaHeight.toFixed(0)}px</div>
        <div><span className="text-white/60">applied scale:</span> {stats.appliedScale.toFixed(3)}</div>
        <div><span className="text-white/60">compact:</span> {stats.isCompact ? 'ON' : 'OFF'}</div>
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
      {!isCompact && (
        <span className="font-mono text-[22px] font-bold text-[#E3B896] mb-1">
          {step.stepNum}
        </span>
      )}
      <h3 className={`${isCompact ? 'text-[clamp(20px,3.2vw,34px)] mb-1.5' : 'text-[clamp(26px,7vw,34px)] lg:text-[clamp(28px,3.4vw,48px)] mb-2'} font-semibold tracking-[-0.03em] leading-[1.08] text-white max-w-4xl text-center`}>
        {step.titleRender}
      </h3>
      <p className={`${isCompact ? 'text-[clamp(16px,1.8vw,18px)] leading-[1.35]' : 'text-[17px] lg:text-[clamp(18px,1.5vw,22px)] leading-[1.45]'} text-white/[0.88] max-w-3xl text-center`}>
        {step.description}
      </p>
      {index === 5 && (
        <div className="mt-3 flex flex-col items-center justify-center gap-1.5">
          <a
            href="#audit-form"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('audit-form') || document.querySelector('form');
              if (el) el.scrollIntoView({ behavior: 'auto' });
            }}
            className="inline-flex items-center gap-2 bg-[#E3B896] text-[#0F2A35] font-semibold text-sm sm:text-[15px] px-6 py-2.5 rounded-full hover:bg-[#ebd0b9] shadow-md ambient transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#E3B896] focus:ring-offset-2 focus:ring-offset-[#0F2A35]"
          >
            <span>{CTA.version}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <span className="text-[12px] sm:text-[13px] text-white/60">
            If it&apos;s not for you, we stop contacting you.
          </span>
        </div>
      )}
    </motion.div>
  );
}
