import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  ClipboardList,
  Globe,
  LayoutGrid,
  MapPin,
  MessageCircle,
  MessageSquare,
  Navigation,
  PhoneCall,
  Search,
  Share2,
} from 'lucide-react';
import { config } from '../config';
import { CTA } from '../content';
import { LogoMark } from '../components/Logo';
import { ShimmerImage } from '../components/PremiumPrimitives';
import DemoTag from '../components/DemoTag';
import { useAnimationInView } from '../hooks/useAnimationInView';
import { getResponsiveImageProps } from '../lib/images';

interface BestInBentoProps {
  onOpenAudit: () => void;
}

const SAMPLE_SEARCHES = [
  'roofer near me',
  'kitchen fitter Galway',
  'plumber Valletta',
];

const LOCAL_CHANNELS = [
  { id: 'gbp', label: 'Google Business Profile', icon: Globe },
  { id: 'maps', label: 'Google Maps', icon: MapPin },
  { id: 'facebook', label: 'Facebook', icon: Share2 },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
];

const DEFAULT_GEO_DESCRIPTION =
  'We structure your pages, FAQs and service areas so search engines and AI assistants can read your business clearly. No one can guarantee being named.';

function GlossyCursorArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="bentoCursorGrad" x1="4" y1="3" x2="22" y2="23" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6FD6B0" />
          <stop offset="55%" stopColor="#14735A" />
          <stop offset="100%" stopColor="#0A3A30" />
        </linearGradient>
      </defs>
      <path
        d="M5.5 3.5L22.5 11.8L14.5 14.4L11.8 22.4L5.5 3.5Z"
        fill="url(#bentoCursorGrad)"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatCapabilityList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

interface IntegrationTile {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  positionClass: string;
  arcPath: string;
  pulseDelay: string;
  dotDuration: string;
  dotDelay: string;
}

export default function BestInBento({ onOpenAudit }: BestInBentoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isAnimActive = useAnimationInView(sectionRef, false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [searchTermIdx, setSearchTermIdx] = useState(0);
  const [typedLen, setTypedLen] = useState(SAMPLE_SEARCHES[0].length);
  const [failedThumbIds, setFailedThumbIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Looping typing animation across 3 sample trade searches (paused offscreen & hidden tab)
  useEffect(() => {
    if (prefersReducedMotion) {
      setSearchTermIdx(0);
      setTypedLen(SAMPLE_SEARCHES[0].length);
      return;
    }
    if (!isAnimActive) {
      return;
    }

    let termIndex = 0;
    let charCount = SAMPLE_SEARCHES[0].length;
    let isDeleting = false;
    let holdTicks = 12;

    const timer = window.setInterval(() => {
      const target = SAMPLE_SEARCHES[termIndex];

      if (holdTicks > 0) {
        holdTicks -= 1;
        return;
      }

      if (!isDeleting) {
        if (charCount < target.length) {
          charCount += 1;
          setTypedLen(charCount);
        } else {
          isDeleting = true;
          holdTicks = 18;
        }
      } else if (charCount > 0) {
        charCount -= 1;
        setTypedLen(charCount);
      } else {
        isDeleting = false;
        termIndex = (termIndex + 1) % SAMPLE_SEARCHES.length;
        setSearchTermIdx(termIndex);
        holdTicks = 4;
      }
    }, 85);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isAnimActive]);

  // Service chips from config, filtered by enabled feature flags
  const enabledServices = useMemo(() => {
    const featuresMap = config.features as unknown as Record<string, boolean | number | undefined>;
    return (config.builder?.features || [])
      .filter((item) => {
        if (item.flag) {
          return Boolean(featuresMap[item.flag]);
        }
        return true;
      })
      .map((item) => item.name)
      .slice(0, 8);
  }, []);

  // Card 3 ("Advanced AI Integration"): active AI & enquiry handling flags
  const hasAiIntegrationFeature = Boolean(
    config.features.aiLeadCapture ||
      config.features.voiceAgent ||
      config.features.afterHoursAutoReply ||
      config.features.missedCallTextBack ||
      config.features.enquiryTracking
  );

  const aiSummarySentence = useMemo(() => {
    const capabilities: string[] = [];
    if (config.features.voiceAgent) capabilities.push('answer calls');
    if (config.features.aiLeadCapture || config.features.afterHoursAutoReply) capabilities.push('reply after hours');
    if (config.features.missedCallTextBack) capabilities.push('text back missed calls');
    if (config.features.enquiryTracking) capabilities.push('log enquiries');
    if (capabilities.length === 0) return '';
    return `Connects your site to tools that ${formatCapabilityList(capabilities)} while you are on the job.`;
  }, []);

  const integrationTiles = useMemo<IntegrationTile[]>(() => {
    const raw: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }> = [];
    if (config.features.afterHoursAutoReply || config.features.voiceAgent) {
      raw.push({ id: 'chat', label: 'Chat', icon: MessageSquare });
    }
    if (config.features.missedCallTextBack || config.features.voiceAgent) {
      raw.push({ id: 'phone', label: 'Phone', icon: PhoneCall });
    }
    raw.push({ id: 'calendar', label: 'Calendar', icon: Calendar });
    if (config.features.enquiryTracking) {
      raw.push({ id: 'enquiries', label: 'Enquiry list', icon: ClipboardList });
    }

    const layoutPresets = [
      {
        positionClass: 'left-[8%] top-[44%]',
        arcPath: 'M 150 28 C 90 34, 42 56, 36 96',
        pulseDelay: '0s',
        dotDuration: '5.2s',
        dotDelay: '0s',
      },
      {
        positionClass: 'left-[30%] top-[68%]',
        arcPath: 'M 150 28 C 122 54, 102 84, 102 128',
        pulseDelay: '-1.2s',
        dotDuration: '6.1s',
        dotDelay: '-1.6s',
      },
      {
        positionClass: 'left-[62%] top-[68%]',
        arcPath: 'M 150 28 C 178 54, 198 84, 198 128',
        pulseDelay: '-2.4s',
        dotDuration: '5.7s',
        dotDelay: '-3.1s',
      },
      {
        positionClass: 'right-[8%] top-[38%]',
        arcPath: 'M 150 28 C 210 32, 256 50, 264 84',
        pulseDelay: '-3.1s',
        dotDuration: '6.6s',
        dotDelay: '-0.8s',
      },
    ];

    return raw.slice(0, 4).map((item, idx) => ({
      ...item,
      ...layoutPresets[idx],
    }));
  }, []);

  const visiblePortfolio = useMemo(() => {
    return (config.portfolio || []).filter(
      (item) => Boolean(item.image) && !failedThumbIds.has(item.id)
    );
  }, [failedThumbIds]);

  const perspectivePortfolio = useMemo(() => {
    if (visiblePortfolio.length === 0) return [];
    if (visiblePortfolio.length >= 6) return visiblePortfolio.slice(0, 6);
    const padded = [...visiblePortfolio];
    let i = 0;
    while (padded.length < 6) {
      padded.push({
        ...visiblePortfolio[i % visiblePortfolio.length],
        id: `${visiblePortfolio[i % visiblePortfolio.length].id}-tile-${padded.length}`,
      });
      i += 1;
    }
    return padded;
  }, [visiblePortfolio]);

  const handleOpenContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
      return;
    }
    onOpenAudit();
  };

  const handleViewDesigns = () => {
    const target =
      document.getElementById('designs') ||
      document.getElementById('work');
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  const activeSearchText = prefersReducedMotion
    ? SAMPLE_SEARCHES[0]
    : SAMPLE_SEARCHES[searchTermIdx].slice(0, typedLen);

  return (
    <section
      ref={sectionRef}
      id="best-in"
      className="oh-cv-auto oh-anim-paused relative bg-[#E9ECEA] text-[#0B1B22] py-[var(--section-py)] overflow-x-clip"
    >
      <style>{`
        @keyframes bentoMarqueeSlow {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes bentoOrbitDot {
          0% { stroke-dashoffset: 1.05; }
          100% { stroke-dashoffset: -0.08; }
        }
        @keyframes bentoNodePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes bentoCursorClick {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          45% { transform: translate3d(28px, -118px, 0) scale(1); }
          52% { transform: translate3d(28px, -118px, 0) scale(0.86); }
          60% { transform: translate3d(28px, -118px, 0) scale(1); }
          85% { transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes bentoSearchRipple {
          0%, 48% { transform: scale(1); opacity: 0; }
          52% { transform: scale(1); opacity: 0.72; }
          72% { transform: scale(1.65); opacity: 0; }
          100% { transform: scale(1.65); opacity: 0; }
        }
        @keyframes bentoEyeBlink {
          0%, 44%, 50%, 100% { transform: scaleY(1); }
          47% { transform: scaleY(0.12); }
        }
        @keyframes bentoBlobFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -6px, 0); }
        }
        @keyframes bentoGridDrift {
          0% { transform: rotateX(48deg) rotateZ(-18deg) skewX(-4deg) translate3d(0, 0, 0); }
          100% { transform: rotateX(48deg) rotateZ(-18deg) skewX(-4deg) translate3d(-10px, -8px, 0); }
        }
        .bento-marquee-track {
          animation: bentoMarqueeSlow 28s linear infinite;
          will-change: transform;
        }
        .bento-marquee-wrap:hover .bento-marquee-track {
          animation-play-state: paused;
        }
        .bento-orbit-dot {
          stroke-dasharray: 0.055 0.945;
          animation: bentoOrbitDot linear infinite;
          will-change: stroke-dashoffset;
        }
        .bento-node-pulse {
          animation: bentoNodePulse 4.6s ease-in-out infinite;
          will-change: transform;
        }
        .bento-cursor-drift {
          animation: bentoCursorClick 6s ease-in-out infinite;
          will-change: transform;
        }
        .bento-search-ripple {
          animation: bentoSearchRipple 6s ease-out infinite;
          will-change: transform, opacity;
        }
        .bento-eye-blink {
          animation: bentoEyeBlink 5s ease-in-out infinite;
          transform-origin: center center;
          will-change: transform;
        }
        .bento-blob-float {
          animation: bentoBlobFloat 5.2s ease-in-out infinite;
          will-change: transform;
        }
        .bento-grid-drift {
          animation: bentoGridDrift 8s ease-in-out infinite alternate;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .bento-marquee-track,
          .bento-orbit-dot,
          .bento-node-pulse,
          .bento-cursor-drift,
          .bento-search-ripple,
          .bento-eye-blink,
          .bento-blob-float,
          .bento-grid-drift {
            animation: none !important;
          }
          .bento-grid-drift {
            transform: rotateX(48deg) rotateZ(-18deg) skewX(-4deg) !important;
          }
        }
      `}</style>

      <div className="relative z-10 max-w-[1260px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centred Two-Tone Section Header */}
        <div className="text-center max-w-[740px] mx-auto mb-12 sm:mb-14">
          <h2 className="font-heading text-[clamp(36px,4.6vw,60px)] font-bold leading-[1.06] tracking-[-0.03em] mb-4">
            <span className="oh-line-mask">
              <span className="oh-line-reveal">
                <span className="text-[#475754] font-normal">We&apos;re</span>{' '}
                <span className="text-[#0B1B22]">Best in</span>
              </span>
            </span>
          </h2>
          <p className="text-[clamp(16px,1.15vw,18px)] leading-[1.6] text-[#475754] max-w-[640px] mx-auto">
            The same dedicated team handles design, search and automation, so your trade business is always consistent.
          </p>
        </div>

        {/* 12-Column Asymmetric Bento Grid (16px gaps, 32px white cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* =================================================================
              CARD 1: TALL LEFT CARD — Local SEO
              ================================================================= */}
          <article className="md:col-span-1 md:row-span-2 lg:col-span-4 lg:row-span-2 bg-white rounded-[32px] border border-[rgba(11,27,34,0.08)] shadow-[0_2px_6px_rgba(11,27,34,0.04),0_12px_30px_-14px_rgba(11,27,34,0.09)] hover:-translate-y-1 hover:shadow-[0_18px_38px_-14px_rgba(11,27,34,0.16)] hover:border-[rgba(20,98,79,0.22)] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden flex flex-col justify-between">
            <div className="p-6 sm:p-7 pb-0 flex flex-col items-center">
              {/* Top Browser URL Pill (radius 14px, 1px border) */}
              <div className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-[14px] bg-[#FAFBFB] border border-[rgba(11,27,34,0.09)] mb-7">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 rounded-full bg-[#0F4A3E] flex items-center justify-center shrink-0 shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6FD6B0]" />
                  </span>
                  <span className="text-[12.5px] font-medium text-[#475754] truncate">
                    yourbusiness.ie
                  </span>
                </div>
                <LayoutGrid
                  className="w-3.5 h-3.5 text-[#475754] shrink-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>

              {/* Grey Category Pill Chip (#EEF0EF + small gradient icon right) */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF0EF] pl-3.5 pr-1.5 py-1 mb-5">
                <span className="text-[12px] font-medium text-[#475754]">
                  Get found
                </span>
                <span
                  aria-hidden="true"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                  style={{
                    background: 'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
                  }}
                >
                  <MapPin className="w-3 h-3" strokeWidth={2} />
                </span>
              </div>

              {/* Heading (~40px medium, centred) & Bold-Keyword Description */}
              <h3 className="font-heading text-[34px] sm:text-[40px] font-medium leading-[1.08] tracking-[-0.025em] text-[#0B1B22] text-center mb-3">
                Local SEO
              </h3>
              <p className="text-[15px] leading-[1.55] text-[#475754] text-center max-w-[30ch] mb-6">
                Show up in the towns where you work across Ireland and Malta with{' '}
                <strong className="font-semibold text-[#0B1B22]">clear local pages</strong>.
              </p>

              {/* Animated White Pill Search Input (0 18px 40px -16px rgba(11,27,34,.25)) */}
              <div className="relative z-20 w-full max-w-[318px] rounded-full bg-white border border-[rgba(11,27,34,0.09)] shadow-[0_18px_40px_-16px_rgba(11,27,34,0.25)] p-1.5 pl-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Micro-element 1: Small pulsing map-pin ping */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                    {!prefersReducedMotion && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E9E6A] opacity-60" />
                    )}
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#14735A]" />
                  </span>
                  <span className="text-[13.5px] font-medium text-[#0B1B22] truncate text-left">
                    {activeSearchText}
                    {!prefersReducedMotion && (
                      <span
                        aria-hidden="true"
                        className="inline-block w-[1.5px] h-3.5 bg-[#14624F] ml-0.5 align-middle"
                      />
                    )}
                  </span>
                </div>

                {/* Circular Accent-Gradient Button in Glass Ring + 6s Click Ripple */}
                <span
                  aria-hidden="true"
                  className="relative p-[3px] rounded-full bg-[#6FD6B0]/30 border border-[#6FD6B0]/50 shrink-0"
                >
                  <span className="bento-search-ripple pointer-events-none absolute inset-0 rounded-full border-2 border-[#1E9E6A]" />
                  <span
                    className="relative w-8 h-8 rounded-full text-white flex items-center justify-center shadow-[0_6px_14px_-3px_rgba(20,115,90,0.48)]"
                    style={{
                      background: 'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
                    }}
                  >
                    <Search className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </span>
                </span>
              </div>

              {/* Micro-elements 2 & 3: Neutral Skeleton Result Lines + Action Tags */}
              <div
                aria-hidden="true"
                className="w-full max-w-[270px] mt-4 rounded-[14px] bg-[#F7F9F8] border border-[rgba(11,27,34,0.06)] px-3.5 py-2.5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2 w-28 rounded-full bg-[#0B1B22]/12" />
                    <div className="h-1.5 w-36 rounded-full bg-[#0B1B22]/7" />
                    <div className="h-1.5 w-20 rounded-full bg-[#0B1B22]/6" />
                  </div>
                  <MapPin className="w-3.5 h-3.5 text-[#14735A] shrink-0" strokeWidth={1.75} />
                </div>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DDF4EA] text-[#0F4A3E] text-[10px] font-medium">
                    Open now
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[rgba(11,27,34,0.08)] text-[#475754] text-[10px] font-medium">
                    <PhoneCall className="w-2.5 h-2.5" strokeWidth={1.75} />
                    Call
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[rgba(11,27,34,0.08)] text-[#475754] text-[10px] font-medium">
                    <Navigation className="w-2.5 h-2.5" strokeWidth={1.75} />
                    Directions
                  </span>
                </div>
              </div>
            </div>

            {/* Lower Half (~45%): Dome with Vertical Near-White to Saturated Green Gradient */}
            <div className="relative mt-5 pt-10 pb-5 px-4 flex flex-col items-center justify-end min-h-[265px]">
              {/* Semi-Circle Dome Backdrop */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 w-[135%] h-[285px] rounded-t-[999px]"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, #DDF4EA 24%, #6FD6B0 54%, #14735A 78%, #0A3A30 100%)',
                }}
              />

              {/* Glass Capsule Holding Glossy Inflated 3D "LOCAL" Word */}
              <div className="relative z-10 flex flex-col items-center mb-6">
                <div
                  aria-hidden="true"
                  className="relative rounded-full px-8 py-3 border border-white/65"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.68) 0%, rgba(168,235,211,0.48) 100%)',
                    boxShadow:
                      'inset 0 1px 2px rgba(255, 255, 255, 0.85), inset 0 -6px 14px rgba(15, 74, 62, 0.22), 0 16px 34px -8px rgba(10, 58, 48, 0.45)',
                  }}
                >
                  {/* Back Extrusion & Shadow Layer */}
                  <span className="relative block font-heading font-extrabold text-[44px] sm:text-[50px] tracking-[0.03em] leading-none uppercase select-none">
                    <span
                      className="block text-[#0F4A3E]"
                      style={{
                        textShadow:
                          '0 1px 0 #14735A, 0 2px 0 #14735A, 0 3px 0 #0F4A3E, 0 5px 0 #0A3A30, 0 12px 22px rgba(5, 14, 13, 0.42)',
                      }}
                    >
                      LOCAL
                    </span>
                    {/* Front Glossy Mint-to-Emerald Gradient Layer */}
                    <span
                      className="absolute inset-0 block bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          'linear-gradient(180deg, #FFFFFF 0%, #DDF4EA 38%, #6FD6B0 74%, #14735A 100%)',
                      }}
                    >
                      LOCAL
                    </span>
                  </span>
                </div>

                {/* One-Line Sub-Label Below Capsule */}
                <p className="mt-2.5 text-[12.5px] font-semibold tracking-tight text-[#0A3A30] flex items-center gap-2">
                  <span>Town pages</span>
                  <span className="w-[1px] h-3 bg-[#0A3A30]/40" aria-hidden="true" />
                  <span>Google Business Profile</span>
                </p>

                {/* Glossy Cursor Arrow Drifting Up to Click Search Every 6s */}
                <div className="bento-cursor-drift pointer-events-none absolute -right-5 -bottom-1 z-30">
                  <GlossyCursorArrow className="w-7 h-7" />
                </div>
              </div>

              {/* Bottom White Channel Strip on Saturated Green (No Client Logos) */}
              <div className="relative z-10 w-full pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-white/95">
                {LOCAL_CHANNELS.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <span
                      key={ch.id}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-tight whitespace-nowrap"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#A8EBD3] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                      <span>{ch.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </article>

          {/* =================================================================
              CARD 2: TOP-MIDDLE CARD — GEO and AEO
              ================================================================= */}
          <article
            className={`md:col-span-1 ${
              hasAiIntegrationFeature ? 'lg:col-span-4' : 'md:row-span-2 lg:row-span-2 lg:col-span-8'
            } bg-white rounded-[32px] border border-[rgba(11,27,34,0.08)] shadow-[0_2px_6px_rgba(11,27,34,0.04),0_12px_30px_-14px_rgba(11,27,34,0.09)] hover:-translate-y-1 hover:shadow-[0_18px_38px_-14px_rgba(11,27,34,0.16)] hover:border-[rgba(20,98,79,0.22)] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden flex flex-col justify-between min-h-[340px]`}
          >
            <div className="p-6 sm:p-7 pb-3">
              <h3 className="font-heading text-[26px] sm:text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-[#0B1B22] mb-2.5">
                GEO and AEO
              </h3>
              <p className="text-[14.5px] sm:text-[15px] leading-[1.55] text-[#475754]">
                {DEFAULT_GEO_DESCRIPTION}
              </p>
            </div>

            {/* Lower 55% Green Gradient Dome + Faded "Structure" + Blinking Blob + Clipped Marquee Chips */}
            <div className="relative mt-2 pt-8 pb-5 overflow-hidden flex flex-col justify-end min-h-[195px]">
              {/* Green Gradient Dome Backdrop */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[-14%] bottom-[-24px] h-[205px] rounded-t-[999px]"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(221, 244, 234, 0.35) 0%, #8EE0C0 38%, #1E9E6A 74%, #0F4A3E 100%)',
                }}
              />

              {/* Large Faded Inflated Word "Structure" (~25-30% opacity, no outline stroke) */}
              <div
                aria-hidden="true"
                className="pointer-events-none relative z-[1] flex justify-center -mb-6 select-none"
              >
                <span
                  className="font-heading font-extrabold text-[48px] sm:text-[56px] tracking-[-0.03em] leading-none text-white/30"
                  style={{
                    textShadow: '0 4px 16px rgba(15, 74, 62, 0.22)',
                  }}
                >
                  Structure
                </span>
              </div>

              {/* Round Soft Blob Character with Two Blinking Oval Eyes + Glossy Cursor */}
              <div className="relative z-10 flex items-center justify-center mb-4" aria-hidden="true">
                <div
                  className="bento-blob-float relative w-[96px] h-[76px] rounded-t-[48px] rounded-b-[28px] border border-white/65 flex items-center justify-center gap-3"
                  style={{
                    background:
                      'linear-gradient(180deg, #DDF4EA 0%, #6FD6B0 48%, #14735A 100%)',
                    boxShadow:
                      'inset 0 2px 4px rgba(255,255,255,0.8), 0 18px 34px -8px rgba(10, 58, 48, 0.5)',
                  }}
                >
                  <span className="bento-eye-blink w-2 h-4 rounded-full bg-white shadow-xs" />
                  <span className="bento-eye-blink w-2 h-4 rounded-full bg-white shadow-xs" />
                  <GlossyCursorArrow className="w-6 h-6 absolute -right-5 -bottom-1" />
                </div>
              </div>

              {/* Translucent Pill Chips Marquee from Config (clipped cleanly at card right edge) */}
              {enabledServices.length > 0 && (
                <div className="relative z-10 bento-marquee-wrap overflow-hidden w-full px-3">
                  {prefersReducedMotion ? (
                    <div className="flex items-center gap-2 overflow-hidden">
                      {enabledServices.slice(0, 4).map((srv) => (
                        <span
                          key={srv}
                          className="px-3.5 py-1.5 rounded-full bg-[#0A3A30]/92 border border-[#A8EBD3]/40 text-[11.5px] font-medium text-white whitespace-nowrap"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2 w-max bento-marquee-track">
                      {[...enabledServices, ...enabledServices].map((srv, idx) => (
                        <span
                          key={`${srv}-${idx}`}
                          className="px-3.5 py-1.5 rounded-full bg-[#0A3A30]/92 border border-[#A8EBD3]/40 text-[11.5px] font-medium text-white whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>

          {/* =================================================================
              CARD 3: TOP-RIGHT CARD — Advanced AI Integration
              ================================================================= */}
          {hasAiIntegrationFeature && (
            <article className="md:col-span-1 lg:col-span-4 bg-white rounded-[32px] border border-[rgba(11,27,34,0.08)] shadow-[0_2px_6px_rgba(11,27,34,0.04),0_12px_30px_-14px_rgba(11,27,34,0.09)] hover:-translate-y-1 hover:shadow-[0_18px_38px_-14px_rgba(11,27,34,0.16)] hover:border-[rgba(20,98,79,0.22)] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden flex flex-col justify-between min-h-[340px]">
              <div className="p-6 sm:p-7 pb-1">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DDF4EA] text-[#0F4A3E] border border-[#6FD6B0]/60">
                    {config.wayOfWorking?.voiceAgentTag || 'Optional add-on'}
                  </span>
                </div>
                <h3 className="font-heading text-[26px] sm:text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-[#0B1B22] mb-2">
                  Advanced AI Integration
                </h3>
                <p className="text-[14.5px] sm:text-[15px] leading-[1.55] text-[#475754]">
                  {aiSummarySentence}
                </p>
                {(config.features.aiLeadCapture || config.features.voiceAgent) && (
                  <p className="mt-2 text-[12px] font-medium text-[#14624F]">
                    The assistant always says it is an AI.
                  </p>
                )}
              </div>

              {/* Orbit Layout: Top-Centre 56px Brand Node + Dashed Arcs with Traveling Dots + 4 Staggered 40px Nodes */}
              <div className="relative px-5 pb-5 pt-2 flex flex-col items-center">
                <div className="relative w-full max-w-[300px] h-[176px]">
                  {/* Dashed SVG Arcs Fanning Down + Traveling Dot Along Each Path */}
                  <svg
                    viewBox="0 0 300 170"
                    fill="none"
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                  >
                    {integrationTiles.map((tile) => (
                      <g key={`arc-${tile.id}`}>
                        {/* Static 1.5px Dashed Arc */}
                        <path
                          d={tile.arcPath}
                          stroke="rgba(11, 27, 34, 0.2)"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          strokeLinecap="round"
                        />
                        {/* Traveling Luminous Dot Along Arc (5-7s staggered phase) */}
                        {!prefersReducedMotion && (
                          <path
                            pathLength="1"
                            d={tile.arcPath}
                            stroke="#14735A"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            className="bento-orbit-dot"
                            style={{
                              animationDuration: tile.dotDuration,
                              animationDelay: tile.dotDelay,
                            }}
                          />
                        )}
                      </g>
                    ))}
                  </svg>

                  {/* Top-Centre 56px Accent-Gradient Node with Open Hours Mark */}
                  <div
                    className="absolute top-[2px] left-1/2 -translate-x-1/2 z-10 w-14 h-14 rounded-full flex items-center justify-center border border-[#6FD6B0]/50"
                    style={{
                      background:
                        'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
                      boxShadow:
                        'inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 12px 26px -6px rgba(30, 158, 106, 0.55)',
                    }}
                    aria-hidden="true"
                  >
                    <LogoMark size={28} variant="light" />
                  </div>

                  {/* 4 Staggered White Circular Icon Nodes (40px, gentle pulse) */}
                  {integrationTiles.map((tile) => {
                    const TileIcon = tile.icon;
                    return (
                      <div
                        key={tile.id}
                        style={{ animationDelay: tile.pulseDelay }}
                        className={`bento-node-pulse absolute z-10 flex flex-col items-center gap-1 ${tile.positionClass}`}
                      >
                        <div
                          className="w-10 h-10 rounded-full bg-white border border-[rgba(11,27,34,0.08)] shadow-[0_8px_20px_-6px_rgba(11,27,34,0.18)] flex items-center justify-center text-[#0F4A3E]"
                          title={tile.label}
                        >
                          <TileIcon className="w-4 h-4 stroke-[1.6]" aria-hidden="true" />
                        </div>
                        <span className="text-[10.5px] font-medium text-[#475754] whitespace-nowrap leading-none">
                          {tile.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          )}

          {/* =================================================================
              CARD 4: WIDE BOTTOM CARD — Websites that look like your work
              ================================================================= */}
          <article className="md:col-span-2 lg:col-span-8 bg-white rounded-[32px] border border-[rgba(11,27,34,0.08)] shadow-[0_2px_6px_rgba(11,27,34,0.04),0_12px_30px_-14px_rgba(11,27,34,0.09)] hover:-translate-y-1 hover:shadow-[0_18px_38px_-14px_rgba(11,27,34,0.16)] hover:border-[rgba(20,98,79,0.22)] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden relative flex flex-col md:flex-row items-stretch min-h-[330px]">
            {/* Left Copy, Two Pill Buttons & Caption */}
            <div className="relative z-10 w-full md:w-[54%] p-7 sm:p-9 lg:p-10 flex flex-col justify-center items-start text-left">
              <h3 className="font-heading text-[30px] sm:text-[38px] lg:text-[42px] font-medium leading-[1.08] tracking-[-0.025em] text-[#0B1B22] mb-3.5 max-w-[14ch]">
                Websites that look like your work
              </h3>
              <p className="text-[15px] leading-[1.6] text-[#475754] mb-7 max-w-[38ch]">
                Custom design tailored specifically for Irish and Maltese builders and trades. Clean, mobile-fast and built from the ground up to win quote requests.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenContact}
                  className="h-12 px-6 rounded-full bg-white border border-[rgba(11,27,34,0.16)] hover:border-[#14624F] hover:text-[#0F4A3E] active:scale-[0.98] text-[#0B1B22] font-semibold text-[14.5px] cursor-pointer shadow-[0_2px_6px_rgba(11,27,34,0.05)] transition-[color,border-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  {CTA.label}
                </button>

                <button
                  type="button"
                  onClick={handleViewDesigns}
                  className="oh-magnetic oh-btn-primary h-12 px-7 rounded-full text-white font-semibold text-[14.5px] cursor-pointer inline-flex items-center justify-center transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98]"
                >
                  View designs
                </button>
              </div>

              <p className="mt-4 text-[11.5px] text-[#475754]">
                <DemoTag variant="concept" />
              </p>
            </div>

            {/* Right: Perspective-Tilted 2-Row Grid of Portfolio Thumbnails (clipped at right edge) */}
            {perspectivePortfolio.length > 0 && (
              <div
                aria-hidden="true"
                className="relative w-full md:w-[46%] min-h-[210px] md:min-h-full overflow-hidden flex items-center justify-start"
                style={{ perspective: '950px' }}
              >
                <div className="bento-grid-drift grid grid-cols-3 gap-3.5 w-[500px] sm:w-[560px] -ml-4 sm:-ml-2 md:-ml-4 py-6">
                  {perspectivePortfolio.map((thumb) => (
                    <div
                      key={thumb.id}
                      className="relative aspect-[16/10] rounded-[18px] overflow-hidden bg-[#DDF4EA] border-2 border-white shadow-[0_14px_30px_-10px_rgba(11,27,34,0.28)]"
                    >
                      <ShimmerImage
                        {...getResponsiveImageProps(thumb.image, [320, 640], '280px', 'good')}
                        alt=""
                        width={260}
                        height={162}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedThumbIds((prev) => new Set(prev).add(thumb.id))
                        }
                        wrapperClassName="relative w-full h-full"
                        className="w-full h-full object-cover object-top block"
                      />
                      {/* Green Multiply Tint Overlay */}
                      <div
                        className="pointer-events-none absolute inset-0 bg-[#14735A]/20 mix-blend-multiply"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
