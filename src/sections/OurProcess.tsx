import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Play,
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
import Logo from '../components/Logo';
import Accent from '../components/Accent';
import { CTA } from '../content';

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

// Helper: safe opacity cross-fade across scenes (10% of scene on each side)
function getSceneOpacity(p: number, index: number) {
  const { start, end } = SCENE_RANGES[index];
  const fade = (end - start) * 0.10;
  if (index === 0) {
    if (p < end - fade) return 1;
    if (p >= end) return 0;
    return Math.max(0, 1 - (p - (end - fade)) / fade);
  }
  if (index === SCENE_RANGES.length - 1) {
    if (p < start - fade) return 0;
    if (p >= start) return 1;
    return Math.min(1, (p - (start - fade)) / fade);
  }
  if (p < start - fade || p >= end) return 0;
  if (p < start) return Math.min(1, (p - (start - fade)) / fade);
  if (p > end - fade) return Math.max(0, 1 - (p - (end - fade)) / fade);
  return 1;
}

export default function OurProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualAreaRef = useRef<HTMLDivElement>(null);
  const textMeasurerRef = useRef<HTMLDivElement>(null);
  const [visualScale, setVisualScale] = useState(1);
  const [tallestTextHeight, setTallestTextHeight] = useState<number>(175);
  const [isCompactText, setIsCompactText] = useState(false);

  // Debug parameter helper (?debug=process)
  const [isDebug, setIsDebug] = useState(false);
  const [debugProgress, setDebugProgress] = useState(0);
  const [debugScene, setDebugScene] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsDebug(params.get('debug') === 'process');
    }
  }, []);

  // Measure tallest text to reserve space so description is never clipped
  const measureTallest = () => {
    if (!textMeasurerRef.current) return;
    const children = Array.from(textMeasurerRef.current.children) as HTMLElement[];
    let maxH = 0;
    children.forEach((child) => {
      const h = child.offsetHeight;
      if (h > maxH) maxH = h;
    });
    if (maxH > 0) {
      setTallestTextHeight(Math.ceil(maxH));
    }
  };

  useEffect(() => {
    measureTallest();
    const node = textMeasurerRef.current;
    if (!node) return;
    const ro = new ResizeObserver(() => measureTallest());
    ro.observe(node);
    window.addEventListener('resize', measureTallest);
    document.fonts?.ready?.then(measureTallest);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureTallest);
    };
  }, [isCompactText]);

  // ResizeObserver on un-transformed container to scale the 960x480 canvas without overflow, minimum 0.68
  useEffect(() => {
    const node = visualAreaRef.current;
    if (!node) return;

    const updateScale = () => {
      const { clientWidth, clientHeight } = node;
      if (clientWidth === 0 || clientHeight === 0) return;
      const rawScale = Math.min(clientWidth / 960, clientHeight / 480);
      if (rawScale < 0.68) {
        setIsCompactText(true);
      } else {
        setIsCompactText(false);
      }
      setVisualScale(Math.max(0.68, Math.min(1.05, rawScale)));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  // Master scroll progress p (0 to 1) bound directly to container scroll without spring delay
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Strip WAAPI accelerate config to prevent invalid offset browser errors
  delete (scrollYProgress as any).accelerate;

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const idx = SCENE_RANGES.findIndex((r) => latest >= r.start && latest <= r.end);
    if (idx !== -1) {
      if (idx !== activeSceneIndex) {
        setActiveSceneIndex(idx);
      }
      if (isDebug) {
        setDebugScene(idx);
      }
    }
    if (isDebug) {
      setDebugProgress(latest);
    }
  });

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const nextSection = document.getElementById('included') || document.getElementById('sample-audit');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJumpToScene = (idx: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const maxScroll = container.scrollHeight - window.innerHeight;
    const targetScroll = scrollTop + SCENE_RANGES[idx].start * maxScroll + 20;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
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
      className="relative w-full bg-[#0F2A35] text-white scroll-mt-24"
      style={{
        // Wrapper height = 100svh + sum(SCENE_WEIGHTS) * PROCESS_SCROLL_PER_WEIGHT_SVH * svh
        height: `${totalSvh}svh`,
      }}
    >
      {/* Keyboard-only skip link (first focusable element of section) */}
      <a
        href="#included"
        onClick={handleSkip}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-6 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#E3B896] focus:text-[#0F2A35] focus:font-bold focus:rounded-full focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white text-[16px]"
      >
        Skip this section &rarr;
      </a>

      {/* Debug Helper: Only visible when ?debug=process */}
      {isDebug && (
        <div className="fixed bottom-4 left-4 z-50 px-3 py-1.5 rounded-lg bg-black/85 text-white font-mono text-xs shadow-lg border border-white/20 backdrop-blur-sm pointer-events-none flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#34D399]" />
          <span>process: scene {debugScene + 1}/6 ({(debugProgress * 100).toFixed(1)}%) | scale {visualScale.toFixed(2)} | text {tallestTextHeight}px</span>
        </div>
      )}

      {/* 1. Header block ABOVE the pinned stage (normal flow, dark background, padding 96px top / 40px bottom) */}
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

      {/* 2. Pinned Stage Viewport: 100svh, sticky top-0 */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0F2A35] via-[#133543] to-[#0F2A35] px-4 sm:px-6 py-5 z-10">
        {/* Stage Header: Compact top bar (~56px) */}
        <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 pb-3 border-b border-white/10 shrink-0 h-[56px] relative">
          {/* Persistent Headline in pinned top bar: "The Way We Deliver" (18px, weight 700, peach #E3B896) */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[18px] font-bold text-[#E3B896] tracking-tight whitespace-nowrap">
              The Way We Deliver
            </span>
          </div>

          {/* Stepper Dots/Chips (1 to 6) centred in the bar */}
          <div className="hidden md:flex items-center justify-center gap-1.5 lg:gap-2 mx-auto">
            {PROCESS_STEPS.map((s, idx) => (
              <ProcessStepChip
                key={s.id}
                index={idx}
                stepNum={s.stepNum}
                navTitle={s.navTitle}
                scrollYProgress={scrollYProgress}
                onSelect={() => handleJumpToScene(idx)}
              />
            ))}
          </div>

          {/* Right spacer for symmetrical centering */}
          <div className="hidden md:block w-[180px] shrink-0" />
        </header>

        {/* Centred Text Block directly above the visual card (max-width 980px, height set to tallest of 6 texts) */}
        <div
          style={{ height: tallestTextHeight }}
          className="w-full max-w-[980px] mx-auto text-center relative z-[2] mb-5 flex-none"
        >
          {PROCESS_STEPS.map((step, idx) => (
            <ScrubbedStepText
              key={step.id}
              step={step}
              index={idx}
              scrollYProgress={scrollYProgress}
              isCompact={isCompactText}
            />
          ))}
        </div>

        {/* Visual Area: flex 1, scaled logical 960 x 480 canvas */}
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
            <Scene1Visual scrollYProgress={scrollYProgress} />
            <Scene2Visual scrollYProgress={scrollYProgress} isActive={activeSceneIndex === 1} />
            <Scene3Visual scrollYProgress={scrollYProgress} />
            <Scene4Visual scrollYProgress={scrollYProgress} />
            <Scene5Visual scrollYProgress={scrollYProgress} />
            <Scene6Visual scrollYProgress={scrollYProgress} />
          </div>
        </main>

        {/* Stage Footer / Progress Strip (~36px) */}
        <footer className="w-full max-w-7xl mx-auto pt-2 border-t border-white/10 shrink-0 flex flex-col gap-2">
          {/* Global Progress Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#E3B896]"
              style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-white/50">
            <div className="flex items-center gap-2 shrink-0">
              <span>Scroll down to advance</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
            </div>

            <p className="text-[11px] sm:text-xs text-white/50 text-right">
              Illustrative story. Search results vary and take time to build. We never promise rankings or a set number of enquiries.
            </p>
          </div>
        </footer>
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
    </section>
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
  scrollYProgress: any;
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
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/90 cursor-pointer transition-colors"
      title={`Jump to ${stepNum}: ${navTitle}`}
    >
      <span className="font-mono text-[#E3B896] font-semibold">{stepNum}</span>
      <span className="font-medium whitespace-nowrap">{navTitle}</span>
    </motion.button>
  );
}

// Centred, scroll-scrubbed step text above the visual
function ScrubbedStepText({
  step,
  index,
  scrollYProgress,
  isCompact,
}: {
  step: (typeof PROCESS_STEPS)[0];
  index: number;
  scrollYProgress: any;
  isCompact?: boolean;
}) {
  const { start, end } = SCENE_RANGES[index];
  const fade = (end - start) * 0.10;

  const opacity = useTransform(scrollYProgress, (p: number) => {
    if (index === 0) {
      if (p < end - fade) return 1;
      if (p >= end) return 0;
      return Math.max(0, 1 - (p - (end - fade)) / fade);
    }
    if (index === SCENE_RANGES.length - 1) {
      if (p < start - fade) return 0;
      if (p >= start) return 1;
      return Math.min(1, (p - (start - fade)) / fade);
    }
    if (p < start - fade || p >= end) return 0;
    if (p < start) return Math.min(1, (p - (start - fade)) / fade);
    if (p > end - fade) return Math.max(0, 1 - (p - (end - fade)) / fade);
    return 1;
  });

  // Outgoing rises 12px (translateY to -12px), incoming rises 16px (starts at +16px to 0)
  const y = useTransform(scrollYProgress, (p: number) => {
    if (index === 0) {
      return p > end - fade ? -12 * Math.min(1, Math.max(0, (p - (end - fade)) / fade)) : 0;
    }
    if (index === SCENE_RANGES.length - 1) {
      return p < start ? 16 * (1 - Math.min(1, Math.max(0, (p - (start - fade)) / fade))) : 0;
    }
    if (p < start) return 16 * (1 - Math.min(1, Math.max(0, (p - (start - fade)) / fade)));
    if (p > end - fade) return -12 * Math.min(1, (p - (end - fade)) / fade);
    return 0;
  });

  const pointerEvents = useTransform(scrollYProgress, (p: number) => {
    if (index === 0 && p < end) return 'auto';
    if (index === SCENE_RANGES.length - 1 && p >= start) return 'auto';
    return p >= start && p < end ? 'auto' : 'none';
  });

  return (
    <motion.div
      style={{ opacity, y, pointerEvents: pointerEvents as any }}
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
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-[#E3B896] text-[#0F2A35] font-semibold text-sm px-5 py-2 rounded-full hover:bg-[#ebd0b9] transition-colors shadow-md"
          >
            {CTA.label}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </motion.div>
  );
}

// Scene visibility hook
function useSceneVisibility(scrollYProgress: any, sceneIndex: number) {
  const { start, end } = SCENE_RANGES[sceneIndex];
  const fade = (end - start) * 0.10;

  const opacity = useTransform(scrollYProgress, (p: number) => getSceneOpacity(p, sceneIndex));

  // Visual card: incoming rises 16px (starts from +16px), outgoing rises 12px (rises to -12px)
  const y = useTransform(scrollYProgress, (p: number) => {
    if (sceneIndex === 0) {
      return p > end - fade ? -12 * Math.min(1, Math.max(0, (p - (end - fade)) / fade)) : 0;
    }
    if (sceneIndex === SCENE_RANGES.length - 1) {
      return p < start ? 16 * (1 - Math.min(1, Math.max(0, (p - (start - fade)) / fade))) : 0;
    }
    if (p < start) return 16 * (1 - Math.min(1, Math.max(0, (p - (start - fade)) / fade)));
    if (p > end - fade) return -12 * Math.min(1, (p - (end - fade)) / fade);
    return 0;
  });

  const scale = useTransform(scrollYProgress, (p: number) => {
    if (sceneIndex === 0) {
      return p > end - fade ? 1 - 0.03 * Math.min(1, (p - (end - fade)) / fade) : 1;
    }
    if (sceneIndex === SCENE_RANGES.length - 1) {
      return p < start ? 0.97 + 0.03 * Math.min(1, Math.max(0, (p - (start - fade)) / fade)) : 1;
    }
    if (p < start) return 0.97 + 0.03 * Math.min(1, Math.max(0, (p - (start - fade)) / fade));
    if (p > end - fade) return 1 - 0.03 * Math.min(1, (p - (end - fade)) / fade);
    return 1;
  });

  const pointerEvents = useTransform(scrollYProgress, (val: number) => {
    if (sceneIndex === 0 && val < end) return 'auto';
    if (sceneIndex === SCENE_RANGES.length - 1 && val >= start) return 'auto';
    return val >= start && val < end ? 'auto' : 'none';
  });

  const sceneProgress = useTransform(scrollYProgress, (v: number) =>
    Math.min(1, Math.max(0, (v - start) / (end - start)))
  );

  return { opacity, y, scale, pointerEvents, sceneProgress, start, end };
}

// SCENE 1: SEARCH
// Search bar typing simulation + clean Galway mini-map with 3 plain peach pins dropping in
function Scene1Visual({ scrollYProgress }: { scrollYProgress: any }) {
  const { opacity, y, scale, pointerEvents, sceneProgress } = useSceneVisibility(scrollYProgress, 0);

  const row1Opacity = useTransform(sceneProgress, [0.12, 0.28], [0, 1]);
  const row2Opacity = useTransform(sceneProgress, [0.24, 0.40], [0, 1]);
  const row3Opacity = useTransform(sceneProgress, [0.36, 0.52], [0, 1]);

  const pin1Drop = useTransform(sceneProgress, [0.15, 0.28], [0, 1]);
  const pin2Drop = useTransform(sceneProgress, [0.28, 0.41], [0, 1]);
  const pin3Drop = useTransform(sceneProgress, [0.41, 0.54], [0, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale, pointerEvents: pointerEvents as any }}
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
          {/* Results list without numbers or badges */}
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

          {/* Clean Galway Mini-Map: rounded dark panel, soft street lines, title "Galway" (18px), 3 plain peach pins */}
          <div className="bg-[#133543] rounded-2xl p-5 border border-white/10 flex flex-col justify-between h-full relative overflow-hidden">
            {/* Soft street lines (inline SVG, 1.5px strokes at white 12%) */}
            <div className="absolute inset-0 opacity-100 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 240" fill="none">
                <path d="M-20 60 C80 50, 140 100, 220 80 S340 120, 420 110" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <path d="M-10 170 C100 160, 180 130, 260 170 S360 180, 420 160" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <path d="M120 -10 C140 70, 110 150, 130 250" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <path d="M280 -10 C270 80, 290 160, 280 250" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <path d="M60 20 L340 220" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Title Galway (18px) */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[18px] font-semibold text-white/90 tracking-wide">
                Galway
              </span>
            </div>

            {/* 3 Plain Peach Pins (18px) that drop in 150ms apart */}
            <div className="relative z-10 flex items-center justify-around my-auto">
              {/* Pin 1 */}
              <motion.div
                style={{
                  opacity: pin1Drop,
                  y: useTransform(pin1Drop, [0, 1], [-24, 0]),
                }}
                className="flex flex-col items-center"
              >
                <MapPin className="w-[18px] h-[18px] text-[#E3B896] fill-[#E3B896]" />
              </motion.div>

              {/* Pin 2 */}
              <motion.div
                style={{
                  opacity: pin2Drop,
                  y: useTransform(pin2Drop, [0, 1], [-24, 0]),
                }}
                className="flex flex-col items-center"
              >
                <MapPin className="w-[18px] h-[18px] text-[#E3B896] fill-[#E3B896]" />
              </motion.div>

              {/* Pin 3 */}
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
// Make "Your business" impossible to miss: red border, red chip, dashed box drawing, ambient breathe pulse
function Scene2Visual({ scrollYProgress, isActive }: { scrollYProgress: any; isActive: boolean }) {
  const { opacity, y, scale, pointerEvents, sceneProgress } = useSceneVisibility(scrollYProgress, 1);

  // Entrance slide and settle
  const cardSlide = useTransform(sceneProgress, [0.15, 0.38], [-40, 0]);
  const cardOpacity = useTransform(sceneProgress, [0.15, 0.32], [0, 1]);

  // Dashed box self-draw indicator
  const dashedBoxReveal = useTransform(sceneProgress, [0.32, 0.46], [0, 1]);

  // Red chip pops in above card pointing down
  const redChipPop = useTransform(sceneProgress, [0.38, 0.50], [0, 1]);

  // Ambient pulse state (active after build-up)
  const isPulseActive = useTransform(sceneProgress, (p: number) => p >= 0.52);

  return (
    <motion.div
      style={{ opacity, y, scale, pointerEvents: pointerEvents as any }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="w-[912px] h-[432px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-center">
        <div className="w-full max-w-[760px] mx-auto flex flex-col gap-3 relative">
          {/* Competitor Card 1 */}
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

          {/* Competitor Card 2 */}
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

          {/* "Your business" card: 3px solid border #D9444A, outer glow, title 24px, 4.8 stars 17px, PHONE ONLY chip */}
          <div className="relative pt-3">
            {/* Red chip pop-in with pointer triangle toward the dashed box */}
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
              className={`bg-white rounded-2xl p-4 text-[#0F2A35] border-[3px] border-[#D9444A] shadow-xl flex items-center justify-between relative z-10 ${
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

              {/* Dashed rounded box with dashed #D9444A border */}
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

// SCENE 3: AUDIT & CONCEPT (Open Hours Portal Transform)
// Left: Google Profile card -> Centre: Open Hours Portal -> Right: Finished custom website assembles
function Scene3Visual({ scrollYProgress }: { scrollYProgress: any }) {
  const { opacity, y, scale, pointerEvents, sceneProgress } = useSceneVisibility(scrollYProgress, 2);

  // Beat 1 (0 to 35%): profile card appears with short wobble
  const profileCardIn = useTransform(sceneProgress, [0.05, 0.30], [0, 1]);
  const wobbleX = useTransform(sceneProgress, [0.20, 0.28, 0.35], [0, -6, 0]);

  // Beat 2 (35 to 70%): card slides into portal
  const cardSlideToPortal = useTransform(sceneProgress, [0.35, 0.65], [0, 220]);
  const cardScaleDown = useTransform(sceneProgress, [0.35, 0.65], [1, 0.55]);
  const cardFadeOut = useTransform(sceneProgress, [0.50, 0.68], [1, 0]);
  const portalGlow = useTransform(sceneProgress, [0.55, 0.65, 0.75], [1, 1.8, 1]);

  // Beat 3 (70 to 100%): website blocks assemble block by block
  const webNav = useTransform(sceneProgress, [0.68, 0.76], [0, 1]);
  const webHero = useTransform(sceneProgress, [0.74, 0.82], [0, 1]);
  const webTiles = useTransform(sceneProgress, [0.80, 0.88], [0, 1]);
  const webCta = useTransform(sceneProgress, [0.86, 0.94], [0, 1]);
  const webBadge = useTransform(sceneProgress, [0.90, 0.98], [0, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale, pointerEvents: pointerEvents as any }}
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

        {/* CENTRE: Open Hours portal (220 x 260) */}
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

          {/* 3 dashed lines running through portal */}
          <div className="flex gap-1.5 mt-3 opacity-60">
            <div className="w-4 h-1 bg-[#E3B896] rounded-full" />
            <div className="w-4 h-1 bg-[#E3B896] rounded-full" />
            <div className="w-4 h-1 bg-[#E3B896] rounded-full" />
          </div>
        </motion.div>

        {/* RIGHT: Finished Website assembling block by block */}
        <div className="w-[370px] h-[370px] flex flex-col justify-between shrink-0 z-20">
          <div className="bg-white rounded-2xl border-2 border-[#1E4A5C] shadow-2xl p-4 flex flex-col justify-between flex-1">
            {/* Nav block */}
            <motion.div
              style={{ opacity: webNav }}
              className="flex items-center justify-between pb-2 border-b border-black/5"
            >
              <span className="text-[18px] font-bold text-[#0F2A35]">Your business</span>
              <span className="text-[16px] font-semibold bg-[#1E4A5C] text-white px-3 py-1 rounded-full">
                Call now
              </span>
            </motion.div>

            {/* Headline */}
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

            {/* 3 Gallery tiles */}
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

            {/* Action button & Teal Website chip */}
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

            {/* Green tick badge: Built for enquiries (17px) */}
            <motion.div
              style={{ opacity: webBadge }}
              className="mt-2 flex items-center justify-center gap-1.5 bg-[#2E9E6B]/15 text-[#2E9E6B] rounded-xl py-1 px-3 text-[17px] font-bold"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Built for enquiries</span>
            </motion.div>
          </div>

          {/* 2 Bottom chips: 2-minute video audit & Homepage concept */}
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

// SCENE 4: READY TO BE FOUND (Climb with NO numbers)
// Search bar + "Over time" bar + 4 rows with "Your business" climbing from row 4 to row 1
function Scene4Visual({ scrollYProgress }: { scrollYProgress: any }) {
  const { opacity, y, scale, pointerEvents, sceneProgress } = useSceneVisibility(scrollYProgress, 3);

  // 3 smooth climb steps:
  // Step 1: Row 4 -> Row 3
  // Step 2: Row 3 -> Row 2
  // Step 3: Row 2 -> Row 1
  const climbY = useTransform(sceneProgress, [0.10, 0.22, 0.25, 0.37, 0.40, 0.52], [264, 176, 176, 88, 88, 0]);

  // Corresponding opponent shifts
  const comp3Y = useTransform(sceneProgress, [0.10, 0.22], [176, 264]);
  const comp2Y = useTransform(sceneProgress, [0.25, 0.37], [88, 176]);
  const comp1Y = useTransform(sceneProgress, [0.40, 0.52], [0, 88]);

  // Peach ring highlight on reaching top row
  const peachRingOpacity = useTransform(sceneProgress, [0.52, 0.58], [0, 1]);

  // "Over time" fill bar progress
  const timeBarWidth = useTransform(sceneProgress, [0.10, 0.52], ['0%', '100%']);

  return (
    <motion.div
      style={{ opacity, y, scale, pointerEvents: pointerEvents as any }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="w-[912px] h-[432px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
        {/* Top: Search bar */}
        <div className="w-full bg-white rounded-2xl p-3 flex items-center gap-3 shadow-md">
          <Search className="w-5 h-5 text-[#1E4A5C] shrink-0" />
          <span className="text-[22px] font-semibold text-[#0F2A35]">
            roofers in Galway
          </span>
          <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-full bg-[#DCE9EC] text-[#1E4A5C]">
            Search Results
          </span>
        </div>

        {/* Thin "Over time" bar with clock icon */}
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

        {/* 4 Rows (76px high, 12px gaps) with absolute row positions */}
        <div className="relative w-full h-[340px]">
          {/* Competitor 1: Galway Roofing Services */}
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

          {/* Competitor 2: Corrib Slate & Tile */}
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

          {/* Competitor 3: Western Roofing */}
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

          {/* "Your business" Card: starts at row 4, climbs to row 1, pulses peach ring */}
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

            {/* Peach pulse highlight ring on reaching top */}
            <motion.div
              style={{ opacity: peachRingOpacity }}
              className="absolute inset-0 rounded-xl ring-2 ring-[#E3B896] shadow-[0_0_20px_rgba(227,184,150,0.5)] pointer-events-none"
            />
          </motion.div>
        </div>

        {/* Disclaimer under list */}
        <p className="text-[16px] text-white/75 text-center pt-1">
          Illustrative. Search results vary and take time to build.
        </p>
      </div>
    </motion.div>
  );
}

// SCENE 5: DIRECT ENQUIRIES
// Left: Top two rows + 6 anonymous people tapping & connecting -> Right: Phone frame dropping chips
function Scene5Visual({ scrollYProgress }: { scrollYProgress: any }) {
  const { opacity, y, scale, pointerEvents, sceneProgress } = useSceneVisibility(scrollYProgress, 4);

  // Dropping notifications inside phone
  const chip1In = useTransform(sceneProgress, [0.12, 0.22], [0, 1]);
  const chip2In = useTransform(sceneProgress, [0.24, 0.34], [0, 1]);
  const chip3In = useTransform(sceneProgress, [0.36, 0.46], [0, 1]);
  const chip4In = useTransform(sceneProgress, [0.48, 0.58], [0, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale, pointerEvents: pointerEvents as any }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="w-[912px] h-[432px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex items-center justify-between gap-6">
        {/* LEFT: Two rows + 6 people sending enquiries */}
        <div className="flex-1 flex flex-col justify-between h-full">
          {/* Top 2 search rows with Your business highlighted */}
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

          {/* 6 anonymous people silhouettes & connection visual */}
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

        {/* RIGHT: Phone frame (340px wide, 380px high, with 24px margin) */}
        <div className="w-[340px] h-[380px] bg-[#0F2A35] border-2 border-white/20 rounded-[32px] p-4 shadow-2xl flex flex-col justify-between shrink-0">
          {/* Top status bar inside phone */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono text-white/60">Notifications</span>
            {/* Clock chip 9:15 pm */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-xs font-mono text-white/90">
              <Clock className="w-3 h-3 text-[#E3B896]" />
              <span>9:15 pm</span>
            </div>
          </div>

          {/* Notifications stack */}
          <div className="flex flex-col gap-2.5 my-auto">
            {/* Chip 1 */}
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

            {/* Chip 2 */}
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

            {/* Chip 3 */}
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

            {/* Chip 4 */}
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
// Split representation: physical workshop closes at 5:30 pm, website stays open 24h
function Scene6Visual({ scrollYProgress }: { scrollYProgress: any }) {
  const { opacity, y, scale, pointerEvents, sceneProgress } = useSceneVisibility(scrollYProgress, 5);

  const flipRatio = useTransform(sceneProgress, [0.15, 0.45], [0, 180]);

  return (
    <motion.div
      style={{ opacity, y, scale, pointerEvents: pointerEvents as any }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="w-[912px] h-[432px] grid grid-cols-2 gap-6 items-center">
        {/* Physical Office Card */}
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
              className="px-5 py-1.5 rounded-full bg-[#EEF3F4] text-[#5E6F77] border border-black/10 text-[16px] font-bold"
            >
              CLOSED
            </motion.div>
          </div>

          <span className="text-[16px] text-[#5E6F77] font-medium">Closes at 5:30 pm</span>
        </div>

        {/* Online Website Card */}
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
