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

interface FrameworkTimelineProps {
  onOpenAudit?: () => void;
}

function Framework3DFolderIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className="inline-block w-9 h-9 sm:w-11 sm:h-11 align-middle -mt-1 ml-1 shrink-0 drop-shadow-[0_6px_12px_rgba(11,27,34,0.16)]"
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
      className="w-8 h-8 -ml-4 mt-10 drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)] shrink-0"
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
      className="oh-dark-card relative w-full max-w-[450px] h-[220px] sm:h-[250px] rounded-[28px] overflow-hidden flex items-center justify-center px-6"
    >
      {/* Pre-softened ambient corner glow pulse (zero blur filter) */}
      <div
        aria-hidden="true"
        className="framework-glow-pulse pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(63, 209, 165, 0.32) 0%, rgba(20, 98, 79, 0.16) 44%, transparent 72%)',
          animationDelay: animDelay,
        }}
      />

      {/* Glass Elements Cluster */}
      <div
        aria-hidden="true"
        className="framework-card-float relative z-[3] flex items-center justify-center gap-3.5"
        style={{ animationDelay: animDelay }}
      >
        {/* Frosted Capsule with 3 Round Icons */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]">
          {icons.capsule.map((CapIcon, i) => (
            <span
              key={i}
              className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/20 flex items-center justify-center text-white/90"
            >
              <CapIcon className="w-4 h-4 stroke-[1.5]" />
            </span>
          ))}
        </div>

        {/* Large Glass Circle + Soft Glass Cursor Arrow */}
        <div className="flex items-center">
          <div className="w-[78px] h-[78px] sm:w-[86px] sm:h-[86px] rounded-full bg-white/[0.1] border border-white/25 backdrop-blur-md shadow-[0_14px_30px_rgba(0,0,0,0.38),inset_0_1px_2px_rgba(255,255,255,0.28)] flex items-center justify-center text-white">
            <MainIcon className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.5]" />
          </div>
          <GlassCursorArrow />
        </div>
      </div>
    </div>
  );
}

export default function FrameworkTimeline({ onOpenAudit: _onOpenAudit }: FrameworkTimelineProps) {
  const steps = config.process || [];
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Scroll-linked central progress bar using passive scroll + requestAnimationFrame
  useEffect(() => {
    if (prefersReducedMotion) {
      setScrollProgress(1);
      return;
    }

    let rafId: number | null = null;

    const updateProgress = () => {
      rafId = null;
      const el = timelineRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.55;
      const raw = (triggerY - rect.top) / Math.max(1, rect.height);
      const clamped = Math.min(1, Math.max(0, raw));
      setScrollProgress(clamped);
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  if (steps.length === 0) return null;

  const effectiveProgress = prefersReducedMotion ? 1 : scrollProgress;

  return (
    <section
      id="framework"
      aria-label="The Framework"
      className="oh-cv-auto relative bg-[#F3F5F3] text-[#0B1B22] py-[var(--section-py)] overflow-x-clip"
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

      <div className="relative z-10 max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8">
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
          {/* 6px Track (Left on <768px, Center on >=768px) */}
          <div
            aria-hidden="true"
            className="absolute left-5 md:left-1/2 top-2 bottom-2 w-[6px] -translate-x-1/2 rounded-full bg-[rgba(11,27,34,0.12)] overflow-hidden"
          >
            <div
              className="w-full h-full origin-top rounded-full"
              style={{
                background: 'linear-gradient(180deg, #0F4A3E 0%, #1E9E6A 100%)',
                transform: `scaleY(${Math.max(0.02, effectiveProgress)})`,
              }}
            />
          </div>

          {/* Alternating Steps */}
          <div className="space-y-16 sm:space-y-24">
            {steps.map((item, idx) => {
              // Step 1 (idx 0) on RIGHT, Step 2 (idx 1) on LEFT, Step 3 on RIGHT, Step 4 on LEFT
              const isLeftColumn = idx % 2 === 1;
              const nodeThreshold = idx / Math.max(1, steps.length);
              const isReached = effectiveProgress >= nodeThreshold;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isLeftColumn ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Round Step Node on Central Spine */}
                  <div
                    aria-hidden="true"
                    className={`absolute left-5 md:left-1/2 top-1.5 -translate-x-1/2 w-[18px] h-[18px] rounded-full border-[3px] border-[#F3F5F3] z-10 transition-colors duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                      isReached
                        ? 'bg-[#14624F] shadow-[0_0_0_5px_rgba(63,209,165,0.22)]'
                        : 'bg-[rgba(11,27,34,0.26)]'
                    }`}
                  />

                  {/* Opposite Empty Side Spacer on Desktop */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Content Column (Always on Right on mobile <768px; alternates RIGHT / LEFT on md+) */}
                  <div
                    className={`w-full md:w-1/2 pl-12 ${
                      isLeftColumn
                        ? 'md:pl-0 md:pr-14 md:flex md:flex-col md:items-end md:text-right'
                        : 'md:pl-14 md:flex md:flex-col md:items-start md:text-left'
                    }`}
                  >
                    <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#14624F] block mb-2 tabular-nums">
                      {item.stepLabel}
                    </span>

                    <h3 className="font-heading text-[clamp(28px,3.1vw,40px)] font-bold leading-[1.12] tracking-[-0.025em] text-[#0B1B22] mb-3">
                      {item.title}
                    </h3>

                    <p className="text-[17px] leading-[1.55] text-[#475754] max-w-[42ch] mb-6">
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
