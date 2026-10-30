import React, { useRef, useState, useEffect } from 'react';
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
// Tool list in one editable array.
// Neutral initial badges / inline SVGs are used; swap in brand icons here as desired.
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
// Exact copy provided in requirements; kept in one editable array `cards`.
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
    title: 'Growth',
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
    .map((t) => t.days)
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
      className="relative w-full bg-[#07080b] py-20 sm:py-24 overflow-hidden scroll-mt-24 selection:bg-sky-500/30 selection:text-white"
      style={{
        background: 'linear-gradient(180deg, #07080b 0%, #090c12 50%, #0b0d12 100%)',
      }}
    >
      {/* Keyboard accessible skip-link */}
      <a
        href="#why-open-hours"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-6 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#38bdf8] focus:text-[#07080b] focus:font-bold focus:rounded-full focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white text-[15px]"
      >
        Skip this section &rarr;
      </a>

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
        }
        .marquee-right {
          animation: marquee-scroll-right 52s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-left, .marquee-right {
            animation: none !important;
          }
        }
      `}</style>

      {/* Subtle edge blend overlay at section boundaries */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#EEF3F4]/20 to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F7F9FA]/20 to-transparent z-10"
        aria-hidden="true"
      />

      <Container>
        {/* ===================================================================
            HEADER: Centered H2 & Subtext
           =================================================================== */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2
            id="built-fast-heading"
            className="text-[clamp(32px,4.5vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-white mb-4"
          >
            Built fast,{' '}
            <span
              className="text-white inline-block"
              style={{
                fontFamily: '"Playfair Display", "Instrument Serif", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              built to catch enquiries
            </span>
          </h2>

          <p className="text-[17px] sm:text-[19px] text-white/65 max-w-[620px] mx-auto font-normal leading-relaxed">
            {deliverySubtext}
          </p>
        </div>

        {/* ===================================================================
            STAGE: Hub with Behind Marquee + Connectors
           =================================================================== */}
        <div className="relative w-full max-w-[1240px] mx-auto flex flex-col items-center">
          {/* Radial soft cyan/blue glow behind the hub */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] rounded-full bg-radial from-[#38bdf8]/18 via-[#3b82f6]/08 to-transparent blur-3xl opacity-100"
          />

          {/* ---------------------------------------------------------------
              BEHIND THE HUB: Glass Icon Tiles Infinite Marquee
             --------------------------------------------------------------- */}
          <div
            aria-hidden="true"
            className="relative w-full overflow-hidden py-4 pointer-events-none select-none"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 16%, black 84%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 16%, black 84%, transparent)',
            }}
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
                    className="w-[84px] h-[84px] rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex flex-col items-center justify-center p-2 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 mb-1.5">
                      <Icon className="w-4 h-4 text-[#38bdf8]/80" />
                    </div>
                    <span className="text-[11px] font-medium text-white/50 tracking-tight leading-tight truncate max-w-[72px]">
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
                    className="w-[84px] h-[84px] rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex flex-col items-center justify-center p-2 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 mb-1.5">
                      <Icon className="w-4 h-4 text-[#E3B896]/80" />
                    </div>
                    <span className="text-[11px] font-medium text-white/50 tracking-tight leading-tight truncate max-w-[72px]">
                      {t.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------------------------------------------------------------
              CENTERED HUB (~110px) with cyan/blue glow ring
             --------------------------------------------------------------- */}
          <div className="relative -mt-16 sm:-mt-20 z-20 flex flex-col items-center">
            <div
              className="w-[110px] h-[110px] rounded-full bg-gradient-to-b from-[#0F2A35] to-[#08151B] border border-[#38bdf8]/40 flex flex-col items-center justify-center relative shadow-[0_0_36px_rgba(56,189,248,0.28),inset_0_0_24px_rgba(56,189,248,0.14)] scale-100 opacity-100"
            >
              {/* Soft pulsing glow ring */}
              <div
                className="absolute inset-[-4px] rounded-full border border-sky-400/25 pointer-events-none animate-pulse"
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
                <rect width="32" height="32" rx="8" fill="#1E4A5C" />
                <circle cx="16" cy="16" r="6.5" stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="16" cy="16" r="2.2" fill="#E3B896" />
              </svg>
              <span className="text-[8.5px] font-bold tracking-[0.18em] uppercase text-[#E3B896] mt-1.5 select-none">
                OPEN HOURS
              </span>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              CONNECTOR LINES (Desktop only >= 1024px)
              Splits from hub bottom into 5 branches ending at cards
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
                {/* Glow filter for cyan strokes */}
                <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="connectorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.65" />
                </linearGradient>
              </defs>

              {/* Base background faint track */}
              <g stroke="rgba(255,255,255,0.06)" strokeWidth="1.5">
                <path d="M 500 0 V 16 Q 500 24 492 24 H 108 Q 100 24 100 32 V 64" />
                <path d="M 500 0 V 16 Q 500 24 492 24 H 308 Q 300 24 300 32 V 64" />
                <path d="M 500 0 V 64" />
                <path d="M 500 0 V 16 Q 500 24 508 24 H 692 Q 700 24 700 32 V 64" />
                <path d="M 500 0 V 16 Q 500 24 508 24 H 892 Q 900 24 900 32 V 64" />
              </g>

              {/* Glowing blue connector stroke - visible immediately */}
              <g
                stroke="url(#connectorGrad)"
                strokeWidth="1.5"
                filter="url(#cyanGlow)"
              >
                {/* Branch 1 to Card 01 */}
                <path d="M 500 0 V 16 Q 500 24 492 24 H 108 Q 100 24 100 32 V 64" />
                {/* Branch 2 to Card 02 */}
                <path d="M 500 0 V 16 Q 500 24 492 24 H 308 Q 300 24 300 32 V 64" />
                {/* Branch 3 to Card 03 (Center) */}
                <path d="M 500 0 V 64" />
                {/* Branch 4 to Card 04 */}
                <path d="M 500 0 V 16 Q 500 24 508 24 H 692 Q 700 24 700 32 V 64" />
                {/* Branch 5 to Card 05 */}
                <path d="M 500 0 V 16 Q 500 24 508 24 H 892 Q 900 24 900 32 V 64" />
              </g>

              {/* Light pulses travelling down the lines (pure SVG with pathLength="1" and negative delays) */}
              {shouldReduceMotion ? (
                <g
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="0.2 0.8"
                  strokeDashoffset="-0.4"
                  opacity="0.6"
                  filter="url(#cyanGlow)"
                >
                  <path pathLength="1" d="M 500 0 V 16 Q 500 24 492 24 H 108 Q 100 24 100 32 V 64" />
                  <path pathLength="1" d="M 500 0 V 16 Q 500 24 492 24 H 308 Q 300 24 300 32 V 64" />
                  <path pathLength="1" d="M 500 0 V 64" />
                  <path pathLength="1" d="M 500 0 V 16 Q 500 24 508 24 H 692 Q 700 24 700 32 V 64" />
                  <path pathLength="1" d="M 500 0 V 16 Q 500 24 508 24 H 892 Q 900 24 900 32 V 64" />
                </g>
              ) : (
                <g
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="0.18 1"
                  strokeLinecap="round"
                  filter="url(#cyanGlow)"
                >
                  {/* Branch 1 to Card 01 - negative delay ensures pulse is moving on first paint */}
                  <path
                    pathLength="1"
                    d="M 500 0 V 16 Q 500 24 492 24 H 108 Q 100 24 100 32 V 64"
                    style={{
                      animation: 'light-travel 2.8s linear infinite',
                      animationDelay: '-0.56s',
                      animationPlayState: isTabHidden ? 'paused' : 'running',
                    }}
                  />
                  {/* Branch 2 to Card 02 */}
                  <path
                    pathLength="1"
                    d="M 500 0 V 16 Q 500 24 492 24 H 308 Q 300 24 300 32 V 64"
                    style={{
                      animation: 'light-travel 2.8s linear infinite',
                      animationDelay: '-1.68s',
                      animationPlayState: isTabHidden ? 'paused' : 'running',
                    }}
                  />
                  {/* Branch 3 to Card 03 (Center) */}
                  <path
                    pathLength="1"
                    d="M 500 0 V 64"
                    style={{
                      animation: 'light-travel 2.8s linear infinite',
                      animationDelay: '-1.12s',
                      animationPlayState: isTabHidden ? 'paused' : 'running',
                    }}
                  />
                  {/* Branch 4 to Card 04 */}
                  <path
                    pathLength="1"
                    d="M 500 0 V 16 Q 500 24 508 24 H 692 Q 700 24 700 32 V 64"
                    style={{
                      animation: 'light-travel 2.8s linear infinite',
                      animationDelay: '-2.24s',
                      animationPlayState: isTabHidden ? 'paused' : 'running',
                    }}
                  />
                  {/* Branch 5 to Card 05 */}
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
              // On tablet (2 cols), card 5 is centered / full width
              const isFifthCard = i === 4;
              return (
                <li
                  key={c.stepNumber}
                  className={`group relative rounded-[20px] p-5 border border-white/[0.08] backdrop-blur-md transition-all duration-300 ease-out flex flex-col justify-between ${
                    isFifthCard ? 'sm:col-span-2 sm:max-w-md sm:mx-auto lg:col-span-1 lg:max-w-none' : ''
                  } translate-y-0 opacity-100 hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-[0_12px_32px_rgba(56,189,248,0.14)]`}
                >
                  {/* Glass background & subtle top gradient */}
                  <div
                    className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 rounded-[20px] bg-[#0A0D14]/90 -z-10"
                    aria-hidden="true"
                  />

                  {/* Card Content Top */}
                  <div className="relative z-10">
                    {/* Top Row: Step badge & number */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-[#38bdf8] text-[11px] font-mono font-semibold">
                        STEP {c.stepNumber}
                      </span>

                      {/* 2-3 Small Icon Tiles */}
                      <div className="flex items-center gap-1.5" aria-hidden="true">
                        {c.icons.map((IconComp, iconIdx) => (
                          <div
                            key={iconIdx}
                            className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 group-hover:text-[#38bdf8] transition-colors"
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step Title (h3) */}
                    <h3 className="text-[19px] sm:text-[20px] font-semibold text-white tracking-tight mb-2">
                      {c.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13px] text-white/65 leading-relaxed mb-4">
                      {c.description}
                    </p>
                  </div>

                  {/* Card Content Bottom: Produces label & chips */}
                  <div className="relative z-10 pt-3 border-t border-white/[0.07] mt-auto">
                    <span className="block text-[10px] font-semibold tracking-wider text-white/40 uppercase mb-2">
                      PRODUCES:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-block text-[11px] font-medium text-white/85 bg-white/[0.04] border border-white/10 rounded-full px-2.5 py-0.5 leading-snug group-hover:border-sky-400/25 transition-colors"
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
              className="inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full bg-white text-[#0F2A35] hover:bg-[#F0F5F7] text-[15px] font-semibold shadow-lg shadow-sky-500/10 hover:shadow-sky-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[44px]"
            >
              <span>{CTA.label}</span>
              <ArrowRight className="w-4 h-4 text-[#1E4A5C]" />
            </button>

            <p className="text-[13px] text-white/50 max-w-lg mx-auto mt-3.5 font-normal leading-normal">
              Results vary by business. We never promise rankings or a set number
              of enquiries.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
