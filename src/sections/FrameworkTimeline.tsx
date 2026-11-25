import React, { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Globe,
  Hammer,
  Layout,
  MapPin,
  MessageSquare,
  PhoneCall,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  Target,
} from 'lucide-react';
import { config, ProcessStepConfig } from '../config';
import { useAnimationInView } from '../hooks/useAnimationInView';
import { subscribeScroll } from '../lib/scrollHub';

interface FrameworkTimelineProps {
  onOpenAudit?: () => void;
}

function Framework3DFolderIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className="inline-block w-9 h-9 sm:w-11 sm:h-11 align-middle -mt-1 ml-1 shrink-0"
    >
      {/* Folder back tab in deep brand green */}
      <path
        d="M5 12C5 9.79086 6.79086 8 9 8H17.2C18.3 8 19.35 8.45 20.1 9.25L22.2 11.5H35C37.2091 11.5 39 13.2909 39 15.5V31C39 33.2091 37.2091 35 35 35H9C6.79086 35 5 33.2091 5 31V12Z"
        fill="#0F4A3E"
      />
      {/* Paper sheet peeking out */}
      <rect x="10" y="13.5" width="24" height="10" rx="2.5" fill="#DDF4EA" />
      {/* Front folder flap in mint-green */}
      <path
        d="M5 17.5C5 15.8431 6.34315 14.5 8 14.5H36C37.6569 14.5 39 15.8431 39 17.5V32C39 34.2091 37.2091 36 35 36H9C6.79086 36 5 34.2091 5 32V17.5Z"
        fill="url(#frameworkFolderGrad)"
      />
      <defs>
        <linearGradient id="frameworkFolderGrad" x1="5" y1="14.5" x2="39" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6FD6B0" />
          <stop offset="100%" stopColor="#14735A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GlassCursorArrow() {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="w-8 h-8 sm:w-10 sm:h-10 -ml-4 sm:-ml-5 mt-10 sm:mt-12 shrink-0"
    >
      <path
        d="M9 5L29 15L19.5 19L15.5 29L9 5Z"
        fill="rgba(255,255,255,0.28)"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StepIcons {
  capsule: Array<React.ComponentType<{ className?: string }>>;
  main: React.ComponentType<{ className?: string }>;
}

const STEP_ICON_SETS: Record<ProcessStepConfig['visualType'], StepIcons> = {
  intro: {
    capsule: [Target, MapPin, MessageSquare],
    main: PhoneCall,
  },
  quote: {
    capsule: [FileText, ShieldCheck, Calendar],
    main: ClipboardCheck,
  },
  build: {
    capsule: [Layout, Smartphone, Search],
    main: Hammer,
  },
  live: {
    capsule: [Globe, PhoneCall, Star],
    main: CheckCircle2,
  },
};

function FrameworkVisualCard({
  visualType,
  animDelay,
}: {
  visualType: ProcessStepConfig['visualType'];
  animDelay: string;
}) {
  const icons = STEP_ICON_SETS[visualType] || STEP_ICON_SETS.intro;
  const MainIcon = icons.main;

  return (
    <div
      data-spotlight=""
      className="oh-dark-card relative w-full md:max-w-[520px] lg:max-w-[600px] aspect-[600/335] rounded-[28px] overflow-hidden flex items-center justify-center px-6 sm:px-8"
    >
      {/* Pre-softened ambient corner glow pulse (zero blur filter) */}
      <div
        aria-hidden="true"
        className="framework-glow-pulse pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 lg:w-96 lg:h-96 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(63, 209, 165, 0.32) 0%, rgba(20, 98, 79, 0.16) 44%, transparent 72%)',
          animationDelay: animDelay,
        }}
      />

      {/* Glass Elements Cluster */}
      <div
        aria-hidden="true"
        className="framework-card-float relative z-[3] flex items-center justify-center gap-3.5 sm:gap-5"
        style={{ animationDelay: animDelay }}
      >
        {/* Frosted Capsule with 3 Round Icons */}
        <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-full bg-[#0F2F28]/90 border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]">
          {icons.capsule.map((CapIcon, i) => (
            <span
              key={i}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/[0.06] border border-white/20 flex items-center justify-center text-white/90"
            >
              <CapIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
            </span>
          ))}
        </div>

        {/* Large Glass Circle + Soft Glass Cursor Arrow */}
        <div className="flex items-center">
          <div className="w-[82px] h-[82px] sm:w-[100px] sm:h-[100px] lg:w-[108px] lg:h-[108px] rounded-full bg-[#144339]/90 border border-white/25 shadow-[0_14px_30px_rgba(0,0,0,0.38),inset_0_1px_2px_rgba(255,255,255,0.28)] flex items-center justify-center text-white">
            <MainIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 stroke-[1.5]" />
          </div>
          <GlassCursorArrow />
        </div>
      </div>
    </div>
  );
}

export default function FrameworkTimeline({ onOpenAudit: _onOpenAudit }: FrameworkTimelineProps) {
  const steps = config.process || [];
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressSpineRef = useRef<HTMLDivElement>(null);
  const reachedCountRef = useRef(0);
  const [reachedCount, setReachedCount] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useAnimationInView(sectionRef, false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Scroll-linked spine updated via ref + thresholded step indicator updates
  useEffect(() => {
    if (prefersReducedMotion || steps.length === 0) {
      if (progressSpineRef.current) {
        progressSpineRef.current.style.transform = 'scaleY(1)';
      }
      reachedCountRef.current = steps.length;
      setReachedCount(steps.length);
      return;
    }

    const el = timelineRef.current;
    if (!el) return;

    let cachedTop = 0;
    let cachedHeight = 1;

    const measureTimeline = () => {
      const rect = el.getBoundingClientRect();
      cachedTop = rect.top + window.scrollY;
      cachedHeight = Math.max(1, rect.height);
    };

    measureTimeline();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measureTimeline);
      ro.observe(el);
    }
    window.addEventListener('resize', measureTimeline, { passive: true });

    const unsubscribe = subscribeScroll(({ scrollY, winHeight }) => {
      if (cachedHeight <= 1) measureTimeline();
      const raw = (scrollY + winHeight * 0.55 - cachedTop) / cachedHeight;
      const clamped = Math.min(1, Math.max(0, raw));

      if (progressSpineRef.current) {
        progressSpineRef.current.style.transform = `scaleY(${Math.max(0.02, clamped).toFixed(4)})`;
      }

      let nextReached = 0;
      for (let i = 0; i < steps.length; i += 1) {
        if (clamped >= i / steps.length) nextReached = i + 1;
      }
      if (nextReached !== reachedCountRef.current) {
        reachedCountRef.current = nextReached;
        setReachedCount(nextReached);
      }
    });

    return () => {
      unsubscribe();
      ro?.disconnect();
      window.removeEventListener('resize', measureTimeline);
    };
  }, [prefersReducedMotion, steps.length]);

  if (steps.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="framework"
      aria-label="The Framework"
      className="oh-cv-auto oh-anim-paused relative bg-[#F3F5F3] text-[#0B1B22] py-[var(--section-py)] overflow-x-clip"
    >
      <div aria-hidden="true" className="oh-silk-waves-subtle" />
      <style>{`
        @keyframes frameworkFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -6px, 0); }
        }
        @keyframes frameworkGlowPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .framework-card-float {
          animation: frameworkFloat 7s ease-in-out infinite;
          will-change: transform;
        }
        .framework-glow-pulse {
          animation: frameworkGlowPulse 7s ease-in-out infinite;
          will-change: opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .framework-card-float,
          .framework-glow-pulse {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centred Header */}
        <div className="text-center max-w-[720px] mx-auto mb-16 sm:mb-20">
          <h2 className="font-heading text-[clamp(38px,4.6vw,60px)] font-bold leading-[1.06] tracking-[-0.03em] mb-4 inline-flex items-center justify-center flex-wrap gap-x-2.5">
            <span className="oh-line-mask">
              <span className="oh-line-reveal">
                <span className="text-[#475754]">The</span>{' '}
                <span className="text-[#0B1B22]">Framework</span>
              </span>
            </span>
            <Framework3DFolderIcon />
          </h2>

          {config.processSubtitle && (
            <p className="text-[clamp(16px,1.15vw,18px)] leading-[1.6] text-[#475754] max-w-[640px] mx-auto">
              {config.processSubtitle}
            </p>
          )}
        </div>

        {/* Central Vertical Timeline */}
        <div ref={timelineRef} className="relative">
          {/* 6px Track (Left on <1024px, Center on >=1024px) */}
          <div
            aria-hidden="true"
            className="absolute left-5 lg:left-1/2 top-2 bottom-2 w-[6px] -translate-x-1/2 rounded-full bg-[rgba(11,27,34,0.12)] overflow-hidden"
          >
            <div
              ref={progressSpineRef}
              className="w-full h-full origin-top rounded-full"
              style={{
                background: 'linear-gradient(180deg, #0F4A3E 0%, #1E9E6A 100%)',
                transform: `scaleY(${prefersReducedMotion ? 1 : 0.02})`,
              }}
            />
          </div>

          {/* Alternating Steps */}
          <div className="space-y-20 sm:space-y-28">
            {steps.map((item, idx) => {
              // Step 1 (idx 0) on RIGHT, Step 2 (idx 1) on LEFT, Step 3 on RIGHT, Step 4 on LEFT
              const isLeftColumn = idx % 2 === 1;
              const isReached = prefersReducedMotion || idx < reachedCount;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col lg:flex-row items-start ${
                    isLeftColumn ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Round Step Node on Central Spine */}
                  <div
                    aria-hidden="true"
                    className={`absolute left-5 lg:left-1/2 top-1.5 -translate-x-1/2 w-[18px] h-[18px] rounded-full border-[3px] border-[#F3F5F3] z-10 transition-colors duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                      isReached
                        ? 'bg-[#14624F] shadow-[0_0_0_5px_rgba(63,209,165,0.22)]'
                        : 'bg-[rgba(11,27,34,0.26)]'
                    }`}
                  />

                  {/* Opposite Empty Side Spacer on Desktop */}
                  <div className="hidden lg:block lg:w-1/2" />

                  {/* Content Column (Always on Right on <1024px; alternates RIGHT / LEFT on lg+) */}
                  <div
                    className={`w-full lg:w-1/2 pl-12 md:pl-14 ${
                      isLeftColumn
                        ? 'lg:pl-0 lg:pr-14 lg:flex lg:flex-col lg:items-end lg:text-right'
                        : 'lg:pl-14 lg:flex lg:flex-col lg:items-start lg:text-left'
                    }`}
                  >
                    <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#14624F] block mb-2 tabular-nums">
                      {item.stepLabel}
                    </span>

                    <h3 className="font-heading text-[clamp(31px,3.4vw,44px)] font-bold leading-[1.12] tracking-[-0.025em] text-[#0B1B22] mb-3">
                      {item.title}
                    </h3>

                    <p className="text-[18px] leading-[1.55] text-[#475754] max-w-[42ch] mb-6">
                      {item.description}
                    </p>

                    {item.timing && item.timing.trim() && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-white/95 text-[#14624F] border border-[#6FD6B0]/60 mb-5 tabular-nums">
                        {item.timing}
                      </span>
                    )}

                    <FrameworkVisualCard
                      visualType={item.visualType}
                      animDelay={`${idx * -1.4}s`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
