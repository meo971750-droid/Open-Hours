import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Globe,
  Home,
  MapPin,
  MessageSquare,
  PhoneCall,
  PhoneOff,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import { config } from '../config';
import { CTA } from '../content';
import { useAnimationInView } from '../hooks/useAnimationInView';
import { getResponsiveImageProps } from '../lib/images';

interface ExpandingCardsProps {
  onOpenAudit?: () => void;
}

interface CardItem {
  id: 'get-found' | 'explain-work' | 'reply-fast' | 'book-visits';
  title: string;
  shortDesc: string;
  bullets: Array<{
    text: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }>;
}

function buildCards(): CardItem[] {
  const f = config.features;
  const items: CardItem[] = [];

  // Card 1: Get found
  const foundBullets: CardItem['bullets'] = [];
  if (f.googleBusinessProfile) {
    foundBullets.push({
      text: 'Google Business Profile set up and tidied',
      icon: MapPin,
    });
  }
  if (f.serviceAreaPages) {
    foundBullets.push({
      text: 'Pages for the towns and counties you cover',
      icon: Globe,
    });
  }
  if (f.reviewRequests) {
    foundBullets.push({
      text: 'Review-request link ready after finished jobs',
      icon: Sparkles,
    });
  }
  if (foundBullets.length === 0) {
    foundBullets.push({
      text: 'Local search foundations structured by trade',
      icon: MapPin,
    });
  }

  items.push({
    id: 'get-found',
    title: 'Get found',
    shortDesc: 'Show up clearly when local homeowners search for your trade.',
    bullets: foundBullets.slice(0, 3),
  });

  // Card 2: Look established
  const citedBullets: CardItem['bullets'] = [
    {
      text: 'Clear services and plain-language FAQs',
      icon: FileText,
    },
    {
      text: 'Recent project photos paired with your trade',
      icon: Sparkles,
    },
  ];
  if (f.googleBusinessProfile) {
    citedBullets.push({
      text: 'Consistent details linked to your Google profile',
      icon: Globe,
    });
  }

  items.push({
    id: 'explain-work',
    title: 'Look established',
    shortDesc: 'Present real project work and plain answers before anyone calls.',
    bullets: citedBullets.slice(0, 3),
  });

  // Card 3: Reply fast
  if (f.afterHoursAutoReply || f.missedCallTextBack || f.voiceAgent) {
    const replyBullets: CardItem['bullets'] = [];
    if (f.afterHoursAutoReply) {
      replyBullets.push({
        text: 'After-hours auto-reply confirms enquiries',
        icon: MessageSquare,
      });
    }
    if (f.missedCallTextBack) {
      replyBullets.push({
        text: 'Missed-call text-back when your hands are full',
        icon: PhoneCall,
      });
    }
    if (f.voiceAgent) {
      replyBullets.push({
        text: 'Optional voice assistant logs job details',
        icon: Sparkles,
      });
    }

    items.push({
      id: 'reply-fast',
      title: 'Reply fast',
      shortDesc: 'Confirm quote requests and missed calls while you stay on site.',
      bullets: replyBullets.slice(0, 3),
    });
  }

  // Card 4: Capture quotes
  const bookBullets: CardItem['bullets'] = [
    {
      text: 'Quote form collects name, job and postcode',
      icon: FileText,
    },
    {
      text: 'Preferred site-visit days kept tidy for you',
      icon: Calendar,
    },
  ];
  if (f.enquiryTracking) {
    bookBullets.push({
      text: 'Calls and quote requests listed in one inbox',
      icon: Check,
    });
  }

  items.push({
    id: 'book-visits',
    title: 'Capture quotes',
    shortDesc: 'Every enquiry lands with the job details you need to price.',
    bullets: bookBullets.slice(0, 3),
  });

  return items;
}

function GlossyCursor({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M5.7 4.7L20.2 12.4L13.3 14.8L10.1 21.4L5.7 4.7Z"
        fill="#050E0D"
        opacity="0.16"
      />
      <path
        d="M5 3.5L19.5 11.2L12.6 13.6L9.4 20.2L5 3.5Z"
        fill="#0F4A3E"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DOME_CONFIG: Record<
  CardItem['id'],
  { gradient: string; pattern: string }
> = {
  'get-found': {
    gradient:
      'linear-gradient(180deg, rgba(255,255,255,0) 0%, #E7F7F2 18%, #9BE4CC 54%, #14735A 86%, #0A3A30 100%)',
    pattern: 'oh-exp-pat-dots',
  },
  'explain-work': {
    gradient:
      'linear-gradient(180deg, rgba(255,255,255,0) 0%, #EAF8F1 18%, #A8EBD3 54%, #1E9E6A 86%, #0F4A3E 100%)',
    pattern: 'oh-exp-pat-diag',
  },
  'reply-fast': {
    gradient:
      'linear-gradient(180deg, rgba(255,255,255,0) 0%, #EDF7F2 18%, #8EE0C0 52%, #14624F 85%, #0A3A30 100%)',
    pattern: 'oh-exp-pat-arcs',
  },
  'book-visits': {
    gradient:
      'linear-gradient(180deg, rgba(255,255,255,0) 0%, #EAF5F0 18%, #6FD6B0 50%, #0F4A3E 84%, #050E0D 100%)',
    pattern: 'oh-exp-pat-grid',
  },
};

const CardBottomVisual = memo(function CardBottomVisual({
  cardId,
}: {
  cardId: CardItem['id'];
}) {
  const [tileFailed, setTileFailed] = useState(false);
  const f = config.features;
  const portfolioImage = config.portfolio[0]?.image || '';
  const portfolioImgProps = useMemo(
    () =>
      portfolioImage
        ? getResponsiveImageProps(portfolioImage, [320, 640], '140px', 'good')
        : null,
    [portfolioImage]
  );
  const missedCallCopy =
    config.missedCallText ||
    "Sorry we missed you. We're on a job. Send your details and we'll reply today.";
  const dome = DOME_CONFIG[cardId];

  return (
    <div
      aria-hidden="true"
      className="oh-exp-stage pointer-events-none select-none w-full h-full relative overflow-hidden"
    >
      {/* Large Semicircle Gradient Dome + Faint 7% Texture */}
      <div
        className="absolute inset-x-[-20%] bottom-[-24%] h-[112%] rounded-t-[999px] overflow-hidden"
        style={{ background: dome.gradient }}
      >
        <div className={`w-full h-full ${dome.pattern}`} />
      </div>

      {/* Fixed-Size Artboard Scaled Smoothly via Compositor Transform (Bottom-Centre) */}
      <div
        data-exp-scale
        className="oh-exp-art-scale absolute bottom-[8px] left-1/2 z-10"
      >
        <div className="oh-exp-artboard flex flex-col justify-end">
          {/* ============================================================
              CARD 1: GET FOUND
              ============================================================ */}
          {cardId === 'get-found' && (
            <div className="w-full flex flex-col gap-[0.65em] px-[0.6em]">
              {/* White Search Pill with Cycling Phrases + Glossy Green Button */}
              <div className="relative h-[2.35em] rounded-full bg-white border border-[rgba(11,27,34,0.12)] shadow-[0_6px_14px_rgba(11,27,34,0.08)] pl-[0.95em] pr-[0.3em] flex items-center justify-between gap-[0.5em]">
                <div className="relative flex-1 h-[1.4em] overflow-hidden text-[0.92em] font-medium text-[#0B1B22]">
                  <span className="oh-exp-anim oh-exp-phrase-1 absolute inset-0 flex items-center truncate">
                    roofer near me
                  </span>
                  <span className="oh-exp-anim oh-exp-phrase-2 absolute inset-0 flex items-center truncate">
                    kitchen fitter Galway
                  </span>
                  <span className="oh-exp-anim oh-exp-phrase-3 absolute inset-0 flex items-center truncate">
                    plumber Valletta
                  </span>
                </div>
                <span
                  className="w-[1.75em] h-[1.75em] rounded-full text-white flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_10px_rgba(15,74,62,0.28)]"
                  style={{
                    background: 'linear-gradient(135deg, #0F4A3E 0%, #1E9E6A 100%)',
                  }}
                >
                  <Search className="w-[0.9em] h-[0.9em]" strokeWidth={2.2} />
                </span>
              </div>

              {/* Split Content: Left Skeleton Results + Right Stylised Map Tile */}
              <div className="grid grid-cols-12 gap-[0.7em] items-end">
                {/* Left Result Stack */}
                <div className="col-span-7 relative flex flex-col gap-[0.5em]">
                  {/* Highlighted First Result + Pin + Glossy Cursor Click */}
                  <div className="relative rounded-[0.8em] bg-white border border-[rgba(20,98,79,0.22)] shadow-[0_8px_16px_-6px_rgba(10,58,48,0.16)] p-[0.65em] pl-[0.85em] flex items-center gap-[0.55em]">
                    <span className="absolute left-[0.28em] top-[0.45em] bottom-[0.45em] w-[0.22em] rounded-full bg-[#14735A]" />
                    <span
                      className="w-[1.65em] h-[1.65em] rounded-full text-white flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                      style={{
                        background: 'linear-gradient(135deg, #0F4A3E 0%, #1E9E6A 100%)',
                      }}
                    >
                      <MapPin className="w-[0.9em] h-[0.9em]" strokeWidth={2} />
                    </span>
                    <div className="flex-1 min-w-0 space-y-[0.35em]">
                      <div className="h-[0.52em] w-[72%] rounded-full bg-[#0A3A30]/75" />
                      <div className="h-[0.38em] w-[90%] rounded-full bg-[#0B1B22]/20" />
                      {f.googleBusinessProfile && (
                        <span className="inline-block px-[0.55em] py-[0.15em] rounded-full bg-[#DDF4EA] text-[#0F4A3E] text-[0.65em] font-semibold leading-none">
                          Google Business Profile
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Secondary Neutral Skeleton Row */}
                  <div className="rounded-[0.75em] bg-white/85 border border-[rgba(11,27,34,0.08)] p-[0.55em] flex items-center gap-[0.55em]">
                    <span className="w-[1.45em] h-[1.45em] rounded-full bg-[#D1DDD7] shrink-0" />
                    <div className="flex-1 space-y-[0.3em]">
                      <div className="h-[0.45em] w-[58%] rounded-full bg-[#0B1B22]/22" />
                      <div className="h-[0.34em] w-[80%] rounded-full bg-[#0B1B22]/12" />
                    </div>
                  </div>

                  {/* Glossy Cursor Gliding to First Result */}
                  <div className="oh-exp-anim oh-exp-cursor-find absolute right-[0.35em] top-[1.35em] z-20 w-[1.65em] h-[1.65em]">
                    <GlossyCursor className="w-full h-full" />
                  </div>
                </div>

                {/* Right Stylised Map Tile + Pin Drop + 4s Ripple + Pin Tags */}
                <div className="col-span-5 relative h-[8.5em] rounded-[0.9em] bg-[#EAF4EE] border border-white/90 shadow-[0_8px_16px_-6px_rgba(10,58,48,0.18)] overflow-hidden p-[0.55em] flex flex-col justify-between">
                  <svg
                    viewBox="0 0 120 96"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M-5 24 Q 42 36 125 18"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 -4 Q 38 54 96 102"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-5 74 Q 68 62 125 78"
                      fill="none"
                      stroke="#CFE4D9"
                      strokeWidth="2.5"
                    />
                  </svg>

                  {/* Centre Pin + Ripple */}
                  <div className="relative z-10 m-auto flex items-center justify-center">
                    <span className="oh-exp-anim oh-exp-ripple-4s absolute w-[2.4em] h-[2.4em] rounded-full border-[0.14em] border-[#14735A]" />
                    <span
                      className="oh-exp-anim oh-exp-pin-drop relative w-[2em] h-[2em] rounded-full text-white flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_4px_10px_rgba(10,58,48,0.3)]"
                      style={{
                        background: 'linear-gradient(135deg, #0F4A3E 0%, #1E9E6A 100%)',
                      }}
                    >
                      <MapPin className="w-[1em] h-[1em]" strokeWidth={2} />
                    </span>
                  </div>

                  {/* Floating Map Tags */}
                  <div className="relative z-10 flex flex-wrap items-center justify-center gap-[0.3em]">
                    <span className="px-[0.55em] py-[0.18em] rounded-full bg-[#0F4A3E] text-white text-[0.64em] font-semibold leading-none shadow-xs">
                      Open now
                    </span>
                    <span className="oh-exp-tag-active px-[0.5em] py-[0.18em] rounded-full bg-white text-[#0F4A3E] border border-[rgba(15,74,62,0.18)] text-[0.64em] font-semibold leading-none">
                      Call
                    </span>
                    <span className="oh-exp-tag-active px-[0.5em] py-[0.18em] rounded-full bg-white text-[#0F4A3E] border border-[rgba(15,74,62,0.18)] text-[0.64em] font-semibold leading-none">
                      Directions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              CARD 2: LOOK ESTABLISHED
              ============================================================ */}
          {cardId === 'explain-work' && (
            <div className="w-full h-full relative flex items-end justify-center pb-[0.5em]">
              {/* Expanded Extra Floating Tags (opacity fade-in via data-active) */}
              <span className="oh-exp-tag-active absolute top-[0.6em] left-[1.1em] z-20 px-[0.75em] py-[0.26em] rounded-full bg-white text-[#0F4A3E] border border-[rgba(15,74,62,0.16)] text-[0.72em] font-semibold shadow-xs">
                Real work
              </span>
              <span className="oh-exp-tag-active absolute top-[0.6em] left-[6.8em] z-20 px-[0.75em] py-[0.26em] rounded-full bg-[#0F4A3E] text-white text-[0.72em] font-semibold shadow-xs">
                Plain answers
              </span>

              {/* Floating Fanned Stack Container */}
              <div className="oh-exp-anim oh-exp-stack-float relative w-[24.5em] h-[11.2em]">
                {/* Card A (-6deg left): Recent project tile */}
                <div className="absolute left-[0.2em] bottom-[0.6em] w-[9.2em] -rotate-6 rounded-[0.95em] bg-white border border-[rgba(11,27,34,0.1)] shadow-[0_8px_18px_-8px_rgba(10,58,48,0.2)] p-[0.5em]">
                  <div className="relative w-full aspect-[4/3] rounded-[0.6em] overflow-hidden bg-gradient-to-br from-[#DDF4EA] to-[#6FD6B0] flex items-center justify-center">
                    {portfolioImgProps && !tileFailed ? (
                      <img
                        src={portfolioImgProps.src}
                        srcSet={portfolioImgProps.srcSet}
                        sizes={portfolioImgProps.sizes}
                        alt=""
                        width={120}
                        height={90}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => setTileFailed(true)}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <Home className="w-[2em] h-[2em] text-[#0F4A3E]" strokeWidth={1.6} />
                    )}
                    <div className="absolute inset-0 bg-[#14735A]/22" />
                  </div>
                  <p className="mt-[0.45em] text-[0.7em] font-semibold text-[#0B1B22] truncate">
                    Recent project
                  </p>
                </div>

                {/* Card C (+6deg right): Your details with 3 sequential ticks */}
                <div className="absolute right-[0.2em] bottom-[0.6em] w-[9.6em] rotate-6 rounded-[0.95em] bg-white border border-[rgba(11,27,34,0.1)] shadow-[0_8px_18px_-8px_rgba(10,58,48,0.2)] p-[0.65em] space-y-[0.45em]">
                  <p className="text-[0.74em] font-semibold text-[#0B1B22]">
                    Your details
                  </p>
                  {(['Address', 'Phone', 'Opening hours'] as const).map(
                    (label, i) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-[0.4em] px-[0.5em] py-[0.3em] rounded-[0.45em] bg-[#F3F7F5]"
                      >
                        <span className="text-[0.68em] font-medium text-[#0B1B22] truncate">
                          {label}
                        </span>
                        <svg
                          viewBox="0 0 12 12"
                          className="w-[0.95em] h-[0.95em] shrink-0"
                          fill="none"
                        >
                          <path
                            d="M2.2 6.2L4.8 8.8L9.8 3.2"
                            pathLength={1}
                            stroke="#14735A"
                            strokeWidth="1.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`oh-exp-anim oh-exp-tick-${i + 1}`}
                          />
                        </svg>
                      </div>
                    )
                  )}
                </div>

                {/* Card B (0deg centre front): Mini FAQ */}
                <div className="relative z-10 mx-auto w-[12.6em] rounded-[1em] bg-white border border-[rgba(11,27,34,0.1)] shadow-[0_12px_22px_-8px_rgba(10,58,48,0.24)] p-[0.7em] space-y-[0.4em]">
                  {/* Row 1 (Open with 2 skeleton lines) */}
                  <div className="rounded-[0.6em] bg-[#EFF7F3] border border-[#14735A]/20 p-[0.5em]">
                    <div className="flex items-center justify-between gap-[0.35em]">
                      <span className="text-[0.68em] font-semibold text-[#0F4A3E] leading-tight">
                        What areas do you cover?
                      </span>
                      <Plus
                        className="w-[0.8em] h-[0.8em] text-[#14735A] rotate-45 shrink-0"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="mt-[0.38em] space-y-[0.26em]">
                      <div className="h-[0.34em] w-[92%] rounded-full bg-[#0F4A3E]/22" />
                      <div className="h-[0.34em] w-[68%] rounded-full bg-[#0F4A3E]/16" />
                    </div>
                  </div>

                  {/* Row 2 & 3 */}
                  {(
                    [
                      'Can I attach job photos?',
                      'Do you give written quotes?',
                    ] as const
                  ).map((q) => (
                    <div
                      key={q}
                      className="rounded-[0.55em] bg-[#F7F9F8] border border-[rgba(11,27,34,0.06)] px-[0.5em] py-[0.38em] flex items-center justify-between gap-[0.35em]"
                    >
                      <span className="text-[0.67em] font-medium text-[#0B1B22] truncate">
                        {q}
                      </span>
                      <Plus
                        className="w-[0.75em] h-[0.75em] text-[#475754] shrink-0"
                        strokeWidth={2}
                      />
                    </div>
                  ))}
                </div>

                {/* Glossy Top-Right Check Badge */}
                <div
                  className="absolute -top-[0.65em] right-[2.2em] z-20 w-[2.3em] h-[2.3em] rounded-full text-white flex items-center justify-center shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.55),0_6px_14px_rgba(10,58,48,0.3)] border border-white/60"
                  style={{
                    background: 'linear-gradient(135deg, #0F4A3E 0%, #1E9E6A 100%)',
                  }}
                >
                  <Check className="w-[1.15em] h-[1.15em]" strokeWidth={2.4} />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              CARD 3: REPLY FAST
              ============================================================ */}
          {cardId === 'reply-fast' && (
            <div className="w-full h-full relative flex flex-col items-center justify-end px-[0.5em]">
              {/* Top Dashed Arc + Travelling Dot + Endpoint Chips */}
              <div className="relative w-[22.5em] h-[3.2em] mb-[0.35em] flex items-end justify-between">
                <svg
                  viewBox="0 0 220 34"
                  className="absolute inset-x-0 top-0 w-full h-[2.4em]"
                  fill="none"
                >
                  <path
                    d="M 38 28 Q 110 -4 182 28"
                    stroke="#0F4A3E"
                    strokeOpacity="0.45"
                    strokeWidth="1.6"
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* Travelling Mint Dot along Arc */}
                <span className="oh-exp-anim oh-exp-arc-dot absolute left-1/2 top-[1.25em] -ml-[0.35em] w-[0.7em] h-[0.7em] rounded-full bg-[#1E9E6A] border border-white shadow-[0_2px_6px_rgba(15,74,62,0.45)]" />

                {/* Left Source Chip */}
                <span className="relative z-10 inline-flex items-center gap-[0.35em] px-[0.7em] py-[0.28em] rounded-full bg-white border border-[rgba(11,27,34,0.12)] text-[#0B1B22] text-[0.7em] font-semibold shadow-xs">
                  {f.missedCallTextBack ? (
                    <>
                      <PhoneOff className="w-[0.85em] h-[0.85em] text-[#475754]" strokeWidth={2} />
                      <span>Missed call</span>
                    </>
                  ) : f.afterHoursAutoReply ? (
                    <span>New message</span>
                  ) : (
                    <span>New enquiry</span>
                  )}
                </span>

                {/* Centre Clock Ring Badge: "about a minute" */}
                <span className="relative z-10 -translate-y-[0.9em] inline-flex items-center gap-[0.35em] px-[0.68em] py-[0.25em] rounded-full bg-[#DDF4EA] border border-[#6FD6B0] text-[#0A3A30] text-[0.68em] font-semibold shadow-xs">
                  <Clock className="w-[0.88em] h-[0.88em] text-[#14624F]" strokeWidth={2} />
                  <span>about a minute</span>
                </span>

                {/* Right Sent Chip */}
                <span className="relative z-10 inline-flex items-center gap-[0.3em] px-[0.7em] py-[0.28em] rounded-full bg-[#0F4A3E] text-white text-[0.7em] font-semibold shadow-xs">
                  <Check className="w-[0.85em] h-[0.85em] text-[#A8EBD3]" strokeWidth={2.2} />
                  <span>
                    {f.missedCallTextBack
                      ? 'Text sent'
                      : f.afterHoursAutoReply
                        ? 'Auto-reply'
                        : 'Reply sent'}
                  </span>
                </span>
              </div>

              {/* Phone Mockup in Dark Green Bezel */}
              <div className="relative w-[13.6em] rounded-t-[1.35em] bg-[#071D18] border-x-[0.16em] border-t-[0.16em] border-[#14735A]/60 pt-[0.55em] px-[0.5em] pb-[0.4em] shadow-[0_-6px_16px_-6px_rgba(5,14,13,0.3)]">
                {/* Notch bar */}
                <div className="mx-auto mb-[0.45em] w-[3.2em] h-[0.28em] rounded-full bg-white/20" />

                {/* Screen Area */}
                <div className="rounded-[0.85em] bg-white p-[0.6em] space-y-[0.42em] min-h-[8.3em] flex flex-col justify-between">
                  <div className="space-y-[0.4em]">
                    {/* Incoming Bubble */}
                    <div className="oh-exp-anim oh-exp-phone-in inline-flex items-center gap-[0.35em] px-[0.6em] py-[0.35em] rounded-[0.7em] rounded-bl-xs bg-[#EEF2F0] text-[#0B1B22] text-[0.67em] font-medium">
                      {f.missedCallTextBack ? (
                        <>
                          <PhoneOff className="w-[0.85em] h-[0.85em] text-[#475754] shrink-0" strokeWidth={2} />
                          <span>Missed call</span>
                        </>
                      ) : f.afterHoursAutoReply ? (
                        <span>Is anyone free next week?</span>
                      ) : (
                        <span>New quote request received</span>
                      )}
                    </div>

                    {/* Typing Indicator */}
                    <div className="oh-exp-anim oh-exp-phone-typing flex justify-end">
                      <span className="inline-flex items-center gap-[0.22em] px-[0.55em] py-[0.32em] rounded-full bg-[#DDF4EA]">
                        <span className="oh-exp-anim oh-exp-dot-1 w-[0.34em] h-[0.34em] rounded-full bg-[#14624F]" />
                        <span className="oh-exp-anim oh-exp-dot-2 w-[0.34em] h-[0.34em] rounded-full bg-[#14624F]" />
                        <span className="oh-exp-anim oh-exp-dot-3 w-[0.34em] h-[0.34em] rounded-full bg-[#14624F]" />
                      </span>
                    </div>

                    {/* Outgoing Reply Bubble */}
                    <div className="oh-exp-anim oh-exp-phone-reply ml-auto max-w-[94%] rounded-[0.75em] rounded-br-xs bg-[#14624F] text-white px-[0.62em] py-[0.45em] text-[0.64em] leading-[1.35] shadow-xs">
                      {f.missedCallTextBack
                        ? missedCallCopy
                        : f.afterHoursAutoReply
                          ? "Thanks, we'll get back to you in the morning."
                          : "Thanks for getting in touch. We'll follow up shortly."}
                    </div>
                  </div>

                  {/* Delivered Tick Footer */}
                  <div className="oh-exp-anim oh-exp-phone-delivered flex items-center justify-end gap-[0.25em] text-[0.62em] font-semibold text-[#14624F]">
                    <Check className="w-[0.9em] h-[0.9em]" strokeWidth={2.4} />
                    <span>
                      {f.missedCallTextBack || f.afterHoursAutoReply
                        ? 'Delivered'
                        : 'Reply sent'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extra Floating Tags Visible Only When Active */}
              <span className="oh-exp-tag-active absolute left-[0.5em] bottom-[2.2em] px-[0.65em] py-[0.25em] rounded-full bg-white text-[#0F4A3E] border border-[rgba(15,74,62,0.16)] text-[0.68em] font-semibold shadow-xs">
                Logged in inbox
              </span>
              <span className="oh-exp-tag-active absolute right-[0.5em] bottom-[2.2em] px-[0.65em] py-[0.25em] rounded-full bg-[#DDF4EA] text-[#0A3A30] border border-[#6FD6B0] text-[0.68em] font-semibold shadow-xs">
                Same-day follow-up
              </span>
            </div>
          )}

          {/* ============================================================
              CARD 4: CAPTURE QUOTES
              ============================================================ */}
          {cardId === 'book-visits' && (
            <div className="w-full h-full relative flex items-end justify-between gap-[0.4em] px-[0.4em] pb-[0.35em]">
              {/* Left: White Form Card */}
              <div className="relative w-[11.2em] rounded-[0.95em] bg-white border border-[rgba(11,27,34,0.1)] shadow-[0_8px_18px_-8px_rgba(5,14,13,0.22)] p-[0.6em] space-y-[0.36em]">
                <div className="oh-exp-anim oh-exp-row-1 px-[0.48em] py-[0.25em] rounded-[0.45em] bg-[#F3F7F5] text-[0.65em] font-medium text-[#0B1B22]">
                  Job: Roof repair
                </div>
                <div className="oh-exp-anim oh-exp-row-2 px-[0.48em] py-[0.25em] rounded-[0.45em] bg-[#F3F7F5] text-[0.65em] font-medium text-[#0B1B22]">
                  Town: Your town
                </div>
                <div className="oh-exp-anim oh-exp-row-3 px-[0.48em] py-[0.25em] rounded-[0.45em] bg-[#F3F7F5] flex items-center justify-between gap-[0.25em] text-[0.65em] font-medium text-[#0B1B22]">
                  <span>Photos: 3 attached</span>
                  <span className="flex items-center gap-[0.18em] shrink-0">
                    <span className="w-[0.7em] h-[0.7em] rounded-[0.18em] bg-[#6FD6B0]" />
                    <span className="w-[0.7em] h-[0.7em] rounded-[0.18em] bg-[#1E9E6A]" />
                    <span className="w-[0.7em] h-[0.7em] rounded-[0.18em] bg-[#0F4A3E]" />
                  </span>
                </div>
                <div className="oh-exp-anim oh-exp-row-4 px-[0.48em] py-[0.25em] rounded-[0.45em] bg-[#F3F7F5] text-[0.65em] font-medium text-[#0B1B22]">
                  Phone: filled
                </div>

                {/* Glossy Send Button + Pressing Cursor */}
                <div className="relative pt-[0.2em]">
                  <div
                    className="w-full h-[1.8em] rounded-full text-white text-[0.68em] font-semibold flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_10px_rgba(15,74,62,0.3)]"
                    style={{
                      background: 'linear-gradient(135deg, #0F4A3E 0%, #14624F 100%)',
                    }}
                  >
                    Send
                  </div>
                  <div className="oh-exp-anim oh-exp-send-cursor absolute right-[0.55em] -bottom-[0.45em] z-20 w-[1.45em] h-[1.45em]">
                    <GlossyCursor className="w-full h-full" />
                  </div>
                </div>
              </div>

              {/* Middle Dashed Arrow Connector */}
              <div className="shrink-0 self-center">
                <svg viewBox="0 0 28 20" className="w-[1.85em] h-[1.35em]" fill="none">
                  <path
                    d="M2 10H23M19 5L24.5 10L19 15"
                    stroke="#FFFFFF"
                    strokeWidth="1.9"
                    strokeDasharray="3 3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Right: Tidy "New enquiry" Card Sliding In */}
              <div className="oh-exp-anim oh-exp-enquiry-in relative w-[11.2em] rounded-[0.95em] bg-white border border-[rgba(11,27,34,0.1)] shadow-[0_10px_20px_-8px_rgba(5,14,13,0.26)] p-[0.6em] space-y-[0.4em]">
                {/* Title Bar with Green Dot + Conditional Owner Alert Bell */}
                <div className="flex items-center justify-between gap-[0.35em] pb-[0.35em] border-b border-[rgba(11,27,34,0.08)]">
                  <div className="flex items-center gap-[0.38em] min-w-0">
                    <span className="w-[0.48em] h-[0.48em] rounded-full bg-[#1E9E6A] shrink-0" />
                    <span className="text-[0.72em] font-semibold text-[#0B1B22] truncate">
                      New enquiry
                    </span>
                  </div>

                  {f.ownerAlerts && (
                    <div className="relative flex items-center justify-center w-[1.35em] h-[1.35em] rounded-full bg-[#DDF4EA] text-[#0F4A3E] shrink-0">
                      <span className="oh-exp-anim oh-exp-bell-ring absolute inset-0 rounded-full border border-[#1E9E6A]" />
                      <Bell className="w-[0.78em] h-[0.78em]" strokeWidth={2.2} />
                    </div>
                  )}
                </div>

                {/* Structured Summary Rows */}
                <div className="space-y-[0.28em] text-[0.64em] text-[#475754]">
                  <div className="flex justify-between gap-[0.3em]">
                    <span>Job</span>
                    <span className="font-semibold text-[#0B1B22]">Roof repair</span>
                  </div>
                  <div className="flex justify-between gap-[0.3em]">
                    <span>Town</span>
                    <span className="font-semibold text-[#0B1B22]">Your town</span>
                  </div>
                  <div className="flex justify-between gap-[0.3em]">
                    <span>Photos</span>
                    <span className="font-semibold text-[#0B1B22]">3 files</span>
                  </div>
                </div>

                {/* Conditional Owner Alerts / Enquiry Tracking Tags */}
                <div className="flex flex-wrap gap-[0.3em] pt-[0.2em]">
                  {f.ownerAlerts && (
                    <span className="px-[0.52em] py-[0.18em] rounded-full bg-[#0F4A3E] text-white text-[0.6em] font-semibold leading-none">
                      Owner alerted
                    </span>
                  )}
                  {f.enquiryTracking && (
                    <span className="px-[0.52em] py-[0.18em] rounded-full bg-[#DDF4EA] text-[#0F4A3E] text-[0.6em] font-semibold leading-none">
                      Tracked
                    </span>
                  )}
                  <span className="oh-exp-tag-active px-[0.52em] py-[0.18em] rounded-full bg-[#F3F5F3] text-[#0B1B22] text-[0.6em] font-semibold leading-none">
                    Ready to price
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

interface DesktopCardProps {
  card: CardItem;
  defaultActive: boolean;
  hasRightNeighbour: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
  onIntentEnter: (id: CardItem['id']) => void;
  onIntentLeave: () => void;
  onActivateImmediate: (id: CardItem['id']) => void;
  onWidthTransitionEnd: (id: CardItem['id'], e: React.TransitionEvent<HTMLDivElement>) => void;
}

const DesktopCard = memo(function DesktopCard({
  card,
  defaultActive,
  hasRightNeighbour,
  cardRef,
  onIntentEnter,
  onIntentLeave,
  onActivateImmediate,
  onWidthTransitionEnd,
}: DesktopCardProps) {
  return (
    <div
      ref={cardRef}
      data-card-id={card.id}
      data-active={defaultActive ? 'true' : 'false'}
      onTransitionEnd={(e) => onWidthTransitionEnd(card.id, e)}
      className="oh-exp-card h-full"
    >
      {/* SVG Concave Neck Bridging 16px Gap at ~14% From Top */}
      {hasRightNeighbour && (
        <svg
          aria-hidden="true"
          viewBox="0 0 18 84"
          className="pointer-events-none absolute -right-[17px] top-[58px] w-[18px] h-[84px] z-20"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 0 Q 0 14 9 14 Q 18 14 18 0 L 18 84 Q 18 70 9 70 Q 0 70 0 84 Z"
            fill="#FFFFFF"
          />
        </svg>
      )}

      <button
        type="button"
        aria-expanded={defaultActive}
        onPointerEnter={() => onIntentEnter(card.id)}
        onPointerLeave={onIntentLeave}
        onFocus={() => onActivateImmediate(card.id)}
        onClick={() => onActivateImmediate(card.id)}
        className="oh-exp-card-btn group relative w-full h-full flex flex-col justify-start items-stretch text-left bg-white rounded-[28px] overflow-hidden cursor-pointer border border-white focus-visible:outline-2 focus-visible:outline-[#14624F] focus-visible:outline-offset-[-3px]"
      >
        {/* Fixed Collapsed Width Layer (Zero text reflow while card widens) */}
        <div className="oh-exp-layer-col absolute left-0 top-0 z-20 p-5 pb-0 xl:p-7 xl:pb-0">
          <h3 className="font-heading text-[clamp(23px,1.8vw,28px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[#0B1B22]">
            {card.title}
          </h3>
          <p className="mt-1.5 xl:mt-2.5 text-[14px] xl:text-[15px] leading-[1.45] xl:leading-[1.5] text-[#475754] line-clamp-2">
            {card.shortDesc}
          </p>
        </div>

        {/* Fixed Expanded Width Layer (Zero text reflow while card widens) */}
        <div className="oh-exp-layer-exp absolute left-0 top-0 z-20 p-5 pb-0 xl:p-7 xl:pb-0">
          <h3 className="font-heading text-[clamp(23px,1.8vw,28px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[#0B1B22]">
            {card.title}
          </h3>
          <p className="mt-1.5 xl:mt-2.5 text-[14px] xl:text-[15px] leading-[1.45] xl:leading-[1.5] text-[#475754] max-w-[42ch]">
            {card.shortDesc}
          </p>

          <div className="mt-3 xl:mt-5">
            <ul className="relative space-y-2 xl:space-y-3 pl-7 xl:pl-8">
              <span
                aria-hidden="true"
                className="absolute left-[10px] xl:left-[11px] top-3 bottom-3 w-[1.5px] bg-[rgba(20,98,79,0.2)]"
              />
              {card.bullets.map((bullet, bIdx) => {
                const IconComp = bullet.icon;
                return (
                  <li
                    key={bIdx}
                    className="relative flex items-center gap-2 xl:gap-2.5 text-[12.5px] xl:text-[13.5px] font-medium text-[#0B1B22] leading-snug"
                  >
                    <span className="absolute -left-7 xl:-left-8 w-5 h-5 xl:w-6 xl:h-6 rounded-full bg-[#DDF4EA] border border-[#6FD6B0]/70 text-[#14624F] flex items-center justify-center shrink-0">
                      <IconComp className="w-3 h-3 xl:w-3.5 xl:h-3.5" strokeWidth={1.5} />
                    </span>
                    <span>{bullet.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom 50% Illustrated Gradient Dome Visual (Always Visible) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] z-10 overflow-hidden">
          <CardBottomVisual cardId={card.id} />
        </div>
      </button>
    </div>
  );
});

const DesktopCardsRow = memo(function DesktopCardsRow({
  cards,
  animActive,
}: {
  cards: CardItem[];
  animActive: boolean;
}) {
  const defaultId = cards[1]?.id || cards[0]?.id || 'get-found';
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const activeIdRef = useRef<CardItem['id']>(defaultId);
  const hasInteractedRef = useRef(false);
  const isRowHoveredRef = useRef(false);
  const intentTimerRef = useRef<number>(0);
  const safetyTimerRef = useRef<number>(0);

  // Measure row container via ResizeObserver to set pixel widths & artboard scale factors
  useLayoutEffect(() => {
    const rowEl = rowRef.current;
    if (!rowEl || cards.length === 0) return;

    const syncGeometry = () => {
      const w = rowEl.clientWidth;
      if (!w) return;
      const n = cards.length;
      const usable = Math.max(200, w - (n - 1) * 16);
      const colW = usable / (n + 0.5);
      const expW = colW * 1.5;
      const artExpScale = Math.min(1, Math.max(0.55, (expW - 18) / 348));
      const artColScale = Math.min(0.67, Math.max(0.4, (colW - 18) / 348));

      rowEl.style.setProperty('--oh-n', String(n));
      rowEl.style.setProperty('--oh-col-w', `${colW.toFixed(2)}px`);
      rowEl.style.setProperty('--oh-exp-w', `${expW.toFixed(2)}px`);
      rowEl.style.setProperty('--oh-art-exp-scale', artExpScale.toFixed(4));
      rowEl.style.setProperty('--oh-art-col-scale', artColScale.toFixed(4));
    };

    syncGeometry();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(syncGeometry);
      ro.observe(rowEl);
      return () => ro.disconnect();
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(syncGeometry, 100);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [cards.length]);

  const setCardWillChange = (el: HTMLDivElement | null, enabled: boolean) => {
    if (!el) return;
    const scaleEl = el.querySelector<HTMLElement>('[data-exp-scale]');
    if (scaleEl) {
      scaleEl.style.willChange = enabled ? 'transform' : '';
    }
  };

  const clearAllWillChange = () => {
    for (const id of Object.keys(cardRefs.current)) {
      setCardWillChange(cardRefs.current[id], false);
    }
  };

  const activateCard = (nextId: CardItem['id'], userAction: boolean) => {
    if (userAction) {
      hasInteractedRef.current = true;
    }
    const prevId = activeIdRef.current;
    if (prevId === nextId) return;

    const prevEl = cardRefs.current[prevId];
    const nextEl = cardRefs.current[nextId];
    activeIdRef.current = nextId;

    setCardWillChange(prevEl, true);
    setCardWillChange(nextEl, true);

    if (prevEl) {
      prevEl.setAttribute('data-active', 'false');
      prevEl.querySelector('button[aria-expanded]')?.setAttribute('aria-expanded', 'false');
    }
    if (nextEl) {
      nextEl.setAttribute('data-active', 'true');
      nextEl.querySelector('button[aria-expanded]')?.setAttribute('aria-expanded', 'true');
    }

    window.clearTimeout(safetyTimerRef.current);
    safetyTimerRef.current = window.setTimeout(clearAllWillChange, 650);
  };

  // Auto-advance timer runs only while section is active & visible, mutating DOM attributes directly
  useEffect(() => {
    if (!animActive || cards.length < 2) return;
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMq.matches) return;

    const timer = window.setInterval(() => {
      if (hasInteractedRef.current || isRowHoveredRef.current || reducedMq.matches) return;
      const idx = cards.findIndex((c) => c.id === activeIdRef.current);
      const next = cards[(idx + 1) % cards.length];
      if (next) activateCard(next.id, false);
    }, 5000);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(intentTimerRef.current);
      window.clearTimeout(safetyTimerRef.current);
    };
  }, [cards, animActive]);

  const handleIntentEnter = (id: CardItem['id']) => {
    window.clearTimeout(intentTimerRef.current);
    intentTimerRef.current = window.setTimeout(() => {
      activateCard(id, true);
    }, 70);
  };

  const handleIntentLeave = () => {
    window.clearTimeout(intentTimerRef.current);
  };

  const handleActivateImmediate = (id: CardItem['id']) => {
    window.clearTimeout(intentTimerRef.current);
    activateCard(id, true);
  };

  const handleWidthTransitionEnd = (
    id: CardItem['id'],
    e: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (e.propertyName === 'width' && e.target === e.currentTarget) {
      setCardWillChange(cardRefs.current[id], false);
    }
  };

  return (
    <div
      ref={rowRef}
      onPointerEnter={() => {
        isRowHoveredRef.current = true;
      }}
      onPointerLeave={() => {
        isRowHoveredRef.current = false;
        window.clearTimeout(intentTimerRef.current);
      }}
      className="oh-exp-row hidden min-[900px]:flex items-stretch gap-[16px] h-[492px] w-full"
    >
      {cards.map((card, index) => (
        <DesktopCard
          key={card.id}
          card={card}
          defaultActive={card.id === defaultId}
          hasRightNeighbour={index < cards.length - 1}
          cardRef={(el) => {
            cardRefs.current[card.id] = el;
          }}
          onIntentEnter={handleIntentEnter}
          onIntentLeave={handleIntentLeave}
          onActivateImmediate={handleActivateImmediate}
          onWidthTransitionEnd={handleWidthTransitionEnd}
        />
      ))}
    </div>
  );
});

const MobileAccordion = memo(function MobileAccordion({ cards }: { cards: CardItem[] }) {
  const [activeId, setActiveId] = useState<string>(() => cards[1]?.id || cards[0]?.id || '');
  const [mobileScale, setMobileScale] = useState(0.77);
  const stageHostRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = stageHostRef.current;
    if (!el) return;

    const syncMobileScale = () => {
      if (!el.clientWidth) return;
      const next = Math.min(1, Math.max(0.55, (el.clientWidth - 16) / 348));
      setMobileScale(Number(next.toFixed(4)));
    };
    syncMobileScale();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(syncMobileScale);
      ro.observe(el);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', syncMobileScale, { passive: true });
    return () => window.removeEventListener('resize', syncMobileScale);
  }, [activeId]);

  return (
    <div className="flex flex-col gap-3 min-[900px]:hidden">
      {cards.map((card) => {
        const isActive = activeId === card.id;

        return (
          <button
            key={card.id}
            type="button"
            aria-expanded={isActive}
            onClick={() => setActiveId(card.id)}
            className="relative w-full text-left bg-white rounded-[20px] p-5 sm:p-6 border border-[rgba(11,27,34,0.08)] shadow-[var(--e1)] hover:shadow-[var(--e2)] hover:-translate-y-0.5 active:scale-[0.99] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden cursor-pointer"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading text-[22px] font-semibold text-[#0B1B22] leading-tight">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-[14.5px] text-[#475754] leading-snug">
                    {card.shortDesc}
                  </p>
                </div>
                <ChevronDown
                  strokeWidth={1.5}
                  className={`w-5 h-5 text-[#475754] shrink-0 transition-transform duration-300 ${
                    isActive ? 'rotate-180 text-[#14624F]' : ''
                  }`}
                />
              </div>

              {isActive && (
                <div className="mt-5 pt-4 border-t border-[rgba(11,27,34,0.08)] space-y-4">
                  <ul className="relative space-y-2.5 pl-7">
                    <span
                      aria-hidden="true"
                      className="absolute left-[10px] top-2 bottom-2 w-[1.5px] bg-[rgba(20,98,79,0.2)]"
                    />
                    {card.bullets.map((bullet, bIdx) => {
                      const IconComp = bullet.icon;
                      return (
                        <li
                          key={bIdx}
                          className="relative flex items-center gap-2 text-[13.5px] font-medium text-[#0B1B22]"
                        >
                          <span className="absolute -left-7 w-5 h-5 rounded-full bg-[#DDF4EA] text-[#14624F] flex items-center justify-center">
                            <IconComp className="w-3 h-3" strokeWidth={1.5} />
                          </span>
                          <span>{bullet.text}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <div
                    ref={stageHostRef}
                    data-active="true"
                    style={{ '--oh-art-exp-scale': String(mobileScale) } as React.CSSProperties}
                    className="relative h-[220px] sm:h-[250px] rounded-[18px] overflow-hidden border border-[rgba(11,27,34,0.08)] bg-[#F9FBFA]"
                  >
                    <CardBottomVisual cardId={card.id} />
                  </div>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
});

export default function ExpandingCards({ onOpenAudit }: ExpandingCardsProps) {
  const cards = useMemo(() => buildCards(), []);
  const sectionRef = useRef<HTMLElement>(null);
  const isAnimActive = useAnimationInView(sectionRef, false);

  if (cards.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="services"
      className="oh-anim-paused relative bg-[#F3F5F3] text-[#0B1B22] py-[var(--section-py)] overflow-x-clip"
    >
      {/* Subtle Silk Wave Layer (light alternating background) */}
      <div aria-hidden="true" className="oh-silk-waves-subtle" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centred Header */}
        <div className="text-center max-w-[780px] mx-auto mb-12 min-[900px]:mb-16">
          <h2 className="font-heading text-[clamp(34px,4.5vw,62px)] font-bold leading-[1.06] tracking-[-0.03em] text-[#0B1B22] mb-5">
            <span className="oh-line-mask">
              <span className="oh-line-reveal">A website that works while you&apos;re on the job</span>
            </span>
          </h2>
          <p className="text-[clamp(17px,1.15vw,18px)] leading-[1.6] text-[#475754] max-w-[560px] mx-auto mb-7">
            Four jobs your site should do. Hover or click any card to see it in action.
          </p>
          <button
            type="button"
            onClick={onOpenAudit}
            className="oh-btn-pill oh-magnetic oh-btn-primary font-semibold text-[15px] pl-6 pr-3.5 cursor-pointer"
          >
            <span>{CTA.label}</span>
            <span className="oh-btn-arrow-circle bg-white/15 text-white">
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </span>
          </button>
        </div>

        {/* Desktop Connected Sheet Card Row (>= 900px) */}
        <DesktopCardsRow cards={cards} animActive={isAnimActive} />

        {/* Mobile / Tablet Vertical Accordion Stack (< 900px) */}
        <MobileAccordion cards={cards} />
      </div>
    </section>
  );
}
