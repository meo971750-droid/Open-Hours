import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  Search,
  Video,
  CheckSquare,
  Layout,
  Smartphone,
  FileText,
  Globe,
  PhoneCall,
  MessageSquareReply,
  BarChart3,
  Bell,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Star,
  ArrowRight,
  Bot,
  Sparkles,
  Layers,
  Palette,
  Compass,
  MessageCircle,
} from 'lucide-react';
import Container from '../components/Container';
import { CTA } from '../content';
import { config } from '../config';

// =============================================================================
// DATA: Background Marquee Tools
// =============================================================================
export interface ToolItem {
  id: string;
  name: string;
  short: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const tools: ToolItem[] = [
  {
    id: 'claude',
    name: 'Claude',
    short: 'Cl',
    category: 'Analysis & Briefs',
    icon: Bot,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    short: 'Ge',
    category: 'Local Search Data',
    icon: Sparkles,
  },
  {
    id: 'lovable',
    name: 'Lovable',
    short: 'Lv',
    category: 'Rapid Prototyping',
    icon: Layers,
  },
  {
    id: 'figma',
    name: 'Figma',
    short: 'Fg',
    category: 'UI & Layouts',
    icon: Palette,
  },
  {
    id: 'gbp',
    name: 'Google Business Profile',
    short: 'GBP',
    category: 'Map & Local Visibility',
    icon: Compass,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    short: 'WA',
    category: 'Instant Messaging',
    icon: MessageCircle,
  },
];

// =============================================================================
// DATA: Five Cards
// =============================================================================
export interface CardItem {
  stepNumber: string;
  title: string;
  description: string;
  icons: React.ComponentType<{ className?: string }>[];
  chips: string[];
}

export const cards: CardItem[] = [
  {
    stepNumber: '01',
    title: 'Audit',
    description: 'We search your trade the way your customers do.',
    icons: [Search, Video, CheckSquare],
    chips: ['Video Audit', 'Profile Checklist', 'Quick Wins'],
  },
  {
    stepNumber: '02',
    title: 'Design',
    description: 'A homepage concept built around your real work.',
    icons: [Layout, Smartphone, FileText],
    chips: ['Homepage Concept', 'Mobile Layout', 'Quote Form'],
  },
  {
    stepNumber: '03',
    title: 'Build',
    description: 'Your site goes live with the essentials switched on.',
    icons: [Globe, PhoneCall, MessageSquareReply],
    chips: ['Live Site', 'Missed-call Text-back', 'After-hours Reply'],
  },
  {
    stepNumber: '04',
    title: 'Track',
    description: 'See which calls, messages and forms come in.',
    icons: [BarChart3, Bell, ShieldCheck],
    chips: ['Enquiry Tracking', 'Monthly Report', '30-Day Fixes'],
  },
  {
    stepNumber: '05',
    title: 'Local Growth',
    description: 'Groundwork so local customers can find you.',
    icons: [TrendingUp, MapPin, Star],
    chips: [
      'Google Profile Optimisation',
      'Service-area Pages',
      'Review Requests',
      'Ads Add-on (later)',
    ],
  },
];

interface BuiltFastProps {
  onOpenAudit: () => void;
}

export default function BuiltFast({ onOpenAudit }: BuiltFastProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isTabHidden, setIsTabHidden] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const tierDays = (config.pricing?.tiers || [])
    .map((t) => t.deliveryDays ?? t.days)
    .filter((d): d is number => typeof d === 'number' && d > 0);
  const minDays = tierDays.length > 0 ? Math.min(...tierDays) : null;
  const maxDays = tierDays.length > 0 ? Math.max(...tierDays) : null;

  const deliverySubtext =
    minDays !== null && maxDays !== null
      ? `Live in ${minDays} to ${maxDays} working days, depending on your package, with the groundwork in place to keep enquiries coming after launch.`
      : 'A fixed price in writing, a live site in a matter of working days, and the groundwork to keep enquiries coming after launch.';

  // Triple array for smooth continuous marquee loop
  const marqueeRowA = [...tools, ...tools, ...tools];
  const marqueeRowB = [...tools.slice().reverse(), ...tools.slice().reverse(), ...tools.slice().reverse()];

  return (
    <section
      id="built-fast"
      aria-labelledby="built-fast-heading"
      className="oh-cv-auto oh-grain-dark relative w-full bg-[#050E0D] py-20 sm:py-24 overflow-x-clip"
      style={{
        background:
          'radial-gradient(ellipse 75% 42% at 50% 18%, rgba(20, 98, 79, 0.22) 0%, transparent 72%), #050E0D',
      }}
    >

      {/* Scoped CSS Keyframes for Marquee and Light Pulse Animations */}
      <style>{`
        @keyframes marquee-scroll-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes marquee-scroll-right {
          0% { transform: translate3d(-33.333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes light-travel {
          0% { stroke-dashoffset: 0.18; }
          100% { stroke-dashoffset: -1; }
        }
        .marquee-left {
          animation: marquee-scroll-left 52s linear infinite;
          will-change: transform;
        }
        .marquee-right {
          animation: marquee-scroll-right 52s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-left, .marquee-right {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Subtle soft boundary fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#F3F5F3]/12 to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#F3F5F3]/12 to-transparent z-10"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        {/* ===================================================================
            HEADER: Centered H2 & Subtext
           =================================================================== */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2
            id="built-fast-heading"
            className="text-[clamp(32px,4.5vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-white mb-4"
          >
            <span className="oh-line-mask">
              <span className="oh-line-reveal">Built fast,</span>
            </span>{' '}
            <span className="oh-line-mask">
              <span className="oh-line-reveal oh-line-reveal-delay-1 font-serif italic font-normal text-[#A8EBD3]">
                built to catch enquiries
              </span>
            </span>
          </h2>

          <p className="text-[17px] sm:text-[19px] text-white/78 max-w-[620px] mx-auto font-normal leading-relaxed">
            {deliverySubtext}
          </p>
        </div>

        {/* ===================================================================
            STAGE: Hub with Behind Marquee + Connectors
           =================================================================== */}
        <div className="relative w-full max-w-[1240px] mx-auto flex flex-col items-center">
          {/* Pre-softened radial mint glow behind hub (zero live blur filter) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full opacity-100"
            style={{
              background:
                'radial-gradient(circle, rgba(63, 209, 165, 0.22) 0%, rgba(20, 98, 79, 0.14) 42%, transparent 70%)',
            }}
          />

          {/* ---------------------------------------------------------------
              BEHIND THE HUB: Glass Icon Tiles Infinite Marquee
             --------------------------------------------------------------- */}
          <div
            aria-hidden="true"
            className="oh-marquee-fade relative w-full overflow-hidden py-4 pointer-events-none select-none"
          >
            {/* Row 1 (desktop & tablet, moves left) */}
            <div
              className="flex gap-4 w-max marquee-left mb-3"
              style={{ animationPlayState: isTabHidden ? 'paused' : 'running' }}
            >
              {marqueeRowA.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <div
                    key={`row1-${t.id}-${idx}`}
                    className="oh-dark-glass w-[84px] h-[84px] rounded-[20px] backdrop-blur-md flex flex-col items-center justify-center p-2 text-center"
                  >
                    <div className="relative z-[3] w-8 h-8 rounded-[12px] bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 mb-1.5">
                      <Icon className="w-4 h-4 text-[#6FD6B0] stroke-[1.5]" />
                    </div>
                    <span className="relative z-[3] text-[11px] font-medium text-white/70 tracking-tight leading-tight truncate max-w-[72px]">
                      {t.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Row 2 (moves right, hidden on mobile for clean single-row look) */}
            <div
              className="hidden sm:flex gap-4 w-max marquee-right"
              style={{ animationPlayState: isTabHidden ? 'paused' : 'running' }}
            >
              {marqueeRowB.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <div
                    key={`row2-${t.id}-${idx}`}
                    className="oh-dark-glass w-[84px] h-[84px] rounded-[20px] backdrop-blur-md flex flex-col items-center justify-center p-2 text-center"
                  >
                    <div className="relative z-[3] w-8 h-8 rounded-[12px] bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 mb-1.5">
                      <Icon className="w-4 h-4 text-[#A8EBD3] stroke-[1.5]" />
                    </div>
                    <span className="relative z-[3] text-[11px] font-medium text-white/70 tracking-tight leading-tight truncate max-w-[72px]">
                      {t.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------------------------------------------------------------
              CENTERED HUB (~110px) with emerald-mint glow ring
             --------------------------------------------------------------- */}
          <div className="relative -mt-16 sm:-mt-20 z-20 flex flex-col items-center">
            <div
              className="w-[110px] h-[110px] rounded-full bg-gradient-to-b from-[#0F4A3E] to-[#050E0D] border border-[#6FD6B0]/45 flex flex-col items-center justify-center relative shadow-[0_0_36px_rgba(63,209,165,0.28),inset_0_0_24px_rgba(63,209,165,0.14)] scale-100 opacity-100"
            >
              {/* Soft pulsing glow ring */}
              <div
                className="absolute inset-[-4px] rounded-full border border-[#6FD6B0]/25 pointer-events-none animate-pulse"
                aria-hidden="true"
              />

              {/* Open Hours signature logo mark */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 drop-shadow-md"
                aria-hidden="true"
              >
                <rect width="32" height="32" rx="8" fill="#14624F" />
                <circle cx="16" cy="16" r="6.5" stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="16" cy="16" r="2.2" fill="#6FD6B0" />
              </svg>
              <span className="text-[8.5px] font-bold tracking-[0.18em] uppercase text-[#A8EBD3] mt-1.5 select-none">
                OPEN HOURS
              </span>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              CONNECTOR LINES (Desktop only >= 1024px)
             --------------------------------------------------------------- */}
          <div
            aria-hidden="true"
            className="hidden lg:block w-full max-w-[1200px] h-[64px] relative z-10 pointer-events-none mt-1 -mb-1"
          >
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1000 64"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="connectorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6FD6B0" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#1E9E6A" stopOpacity="0.65" />
                </linearGradient>
              </defs>

              {/* Ambient glow track (filter-free dual stroke) */}
              <g stroke="rgba(63, 209, 165, 0.16)" strokeWidth="4.5" strokeLinecap="round">
                <path d="M 500 0 V 16 Q 500 24 492 24 H 108 Q 100 24 100 32 V 64" />
                <path d="M 500 0 V 16 Q 500 24 492 24 H 308 Q 300 24 300 32 V 64" />
                <path d="M 500 0 V 64" />
                <path d="M 500 0 V 16 Q 500 24 508 24 H 692 Q 700 24 700 32 V 64" />
                <path d="M 500 0 V 16 Q 500 24 508 24 H 892 Q 900 24 900 32 V 64" />
              </g>

              {/* Glowing green-teal connector stroke */}
              <g stroke="url(#connectorGrad)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M 500 0 V 16 Q 500 24 492 24 H 108 Q 100 24 100 32 V 64" />
                <path d="M 500 0 V 16 Q 500 24 492 24 H 308 Q 300 24 300 32 V 64" />
                <path d="M 500 0 V 64" />
                <path d="M 500 0 V 16 Q 500 24 508 24 H 692 Q 700 24 700 32 V 64" />
                <path d="M 500 0 V 16 Q 500 24 508 24 H 892 Q 900 24 900 32 V 64" />
              </g>

              {/* Light pulses travelling down the lines */}
              {shouldReduceMotion ? (
                <g
                  stroke="#A8EBD3"
                  strokeWidth="2"
                  strokeDasharray="0.2 0.8"
                  strokeDashoffset="-0.4"
                  opacity="0.7"
                  strokeLinecap="round"
                >
                  <path pathLength="1" d="M 500 0 V 16 Q 500 24 492 24 H 108 Q 100 24 100 32 V 64" />
                  <path pathLength="1" d="M 500 0 V 16 Q 500 24 492 24 H 308 Q 300 24 300 32 V 64" />
                  <path pathLength="1" d="M 500 0 V 64" />
                  <path pathLength="1" d="M 500 0 V 16 Q 500 24 508 24 H 692 Q 700 24 700 32 V 64" />
                  <path pathLength="1" d="M 500 0 V 16 Q 500 24 508 24 H 892 Q 900 24 900 32 V 64" />
                </g>
              ) : (
                <g
                  stroke="#A8EBD3"
                  strokeWidth="2.4"
                  strokeDasharray="0.18 1"
                  strokeLinecap="round"
                >
                  <path
                    pathLength="1"
                    d="M 500 0 V 16 Q 500 24 492 24 H 108 Q 100 24 100 32 V 64"
                    style={{
                      animation: 'light-travel 2.8s linear infinite',
                      animationDelay: '-0.56s',
                      animationPlayState: isTabHidden ? 'paused' : 'running',
                    }}
                  />
                  <path
                    pathLength="1"
                    d="M 500 0 V 16 Q 500 24 492 24 H 308 Q 300 24 300 32 V 64"
                    style={{
                      animation: 'light-travel 2.8s linear infinite',
                      animationDelay: '-1.68s',
                      animationPlayState: isTabHidden ? 'paused' : 'running',
                    }}
                  />
                  <path
                    pathLength="1"
                    d="M 500 0 V 64"
                    style={{
                      animation: 'light-travel 2.8s linear infinite',
                      animationDelay: '-1.12s',
                      animationPlayState: isTabHidden ? 'paused' : 'running',
                    }}
                  />
                  <path
                    pathLength="1"
                    d="M 500 0 V 16 Q 500 24 508 24 H 692 Q 700 24 700 32 V 64"
                    style={{
                      animation: 'light-travel 2.8s linear infinite',
                      animationDelay: '-2.24s',
                      animationPlayState: isTabHidden ? 'paused' : 'running',
                    }}
                  />
                  <path
                    pathLength="1"
                    d="M 500 0 V 16 Q 500 24 508 24 H 892 Q 900 24 900 32 V 64"
                    style={{
                      animation: 'light-travel 2.8s linear infinite',
                      animationDelay: '-0.28s',
                      animationPlayState: isTabHidden ? 'paused' : 'running',
                    }}
                  />
                </g>
              )}
            </svg>
          </div>

          {/* ---------------------------------------------------------------
              FIVE CARDS: Dark glass style in an ordered list (<ol>/<li>)
             --------------------------------------------------------------- */}
          <ol className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-4.5 list-none p-0 m-0 mt-6 lg:mt-0">
            {cards.map((c, i) => {
              const isFifthCard = i === 4;
              return (
                <li
                  key={c.stepNumber}
                  data-spotlight=""
                  className={`group oh-dark-card relative rounded-[20px] p-5 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col justify-between overflow-hidden ${
                    isFifthCard ? 'sm:col-span-2 sm:max-w-md sm:mx-auto lg:col-span-1 lg:max-w-none' : ''
                  } hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(63,209,165,0.2)]`}
                >
                  {/* Card Content Top */}
                  <div className="relative z-[3]">
                    {/* Top Row: Step badge & icons */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#14624F]/35 border border-[#6FD6B0]/35 text-[#A8EBD3] text-[11px] font-mono font-semibold tabular-nums">
                        STEP {c.stepNumber}
                      </span>

                      <div className="flex items-center gap-1.5" aria-hidden="true">
                        {c.icons.map((IconComp, iconIdx) => (
                          <div
                            key={iconIdx}
                            className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/75 group-hover:text-[#6FD6B0] transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                          >
                            <IconComp className="w-3.5 h-3.5 stroke-[1.5]" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step Title (h3) */}
                    <h3 className="text-[19px] sm:text-[20px] font-semibold text-white tracking-tight mb-2">
                      {c.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13.5px] text-white/75 leading-relaxed mb-4">
                      {c.description}
                    </p>
                  </div>

                  {/* Card Content Bottom: Produces label & chips */}
                  <div className="relative z-[3] pt-3 border-t border-white/[0.08] mt-auto">
                    <span className="block text-[10px] font-semibold tracking-wider text-white/70 uppercase mb-2">
                      PRODUCES:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-block text-[11px] font-medium text-white/90 bg-white/[0.05] border border-white/14 rounded-full px-2.5 py-0.5 leading-snug group-hover:border-[#6FD6B0]/40 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* ===================================================================
              BOTTOM CTA & DISCLAIMER
             =================================================================== */}
          <div className="mt-14 sm:mt-16 flex flex-col items-center text-center">
            <button
              type="button"
              onClick={onOpenAudit}
              className="oh-btn-pill oh-magnetic oh-btn-primary group inline-flex items-center justify-center gap-2.5 pl-6 pr-3.5 text-[15px] font-semibold cursor-pointer"
            >
              <span>{CTA.label}</span>
              <span className="oh-btn-arrow-circle bg-white/15 text-white">
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </span>
            </button>

            <p className="text-[13px] text-white/70 max-w-lg mx-auto mt-3.5 font-normal leading-normal">
              Results vary by business. We never promise rankings or a set number
              of enquiries.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
