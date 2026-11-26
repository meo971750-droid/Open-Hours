import React, { useEffect, useMemo, useRef, useState } from 'react';
import { config } from '../config';
import DemoTag from '../components/DemoTag';
import { useAnimationInView } from '../hooks/useAnimationInView';

type ChannelId =
  | 'maps'
  | 'search'
  | 'gbp'
  | 'whatsapp'
  | 'phone'
  | 'star'
  | 'facebook'
  | 'instagram';

interface OrbitChannelTile {
  id: ChannelId;
  label: string;
  cx: number; // percentage X within panel
  cy: number; // percentage Y within panel
  rotate: number;
  blurred: boolean;
  driftDuration: string;
  driftDelay: string;
  pulseDelay: string;
}

function DomainGlyph() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="w-9 h-9 shrink-0">
      <rect width="36" height="36" rx="11" fill="#EBF6F1" />
      <rect x="8.5" y="10" width="19" height="16" rx="3.5" stroke="#14624F" strokeWidth="1.9" />
      <line x1="9" y1="14.5" x2="27" y2="14.5" stroke="#14624F" strokeWidth="1.7" />
      <circle cx="12" cy="12.25" r="0.9" fill="#1E9E6A" />
      <circle cx="14.8" cy="12.25" r="0.9" fill="#1E9E6A" />
      <rect x="12" y="17.5" width="8" height="2.4" rx="1.2" fill="#1E9E6A" />
    </svg>
  );
}

function ProfileOrPagesGlyph({ useProfile }: { useProfile: boolean }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="w-9 h-9 shrink-0">
      <rect width="36" height="36" rx="11" fill="#EBF6F1" />
      {useProfile ? (
        <>
          <path
            d="M18 9C14.13 9 11 12.06 11 15.84C11 20.66 16.95 26 17.57 26.55C17.81 26.76 18.19 26.76 18.43 26.55C19.05 26 25 20.66 25 15.84C25 12.06 21.87 9 18 9Z"
            stroke="#14624F"
            strokeWidth="1.9"
          />
          <circle cx="18" cy="15.8" r="2.6" fill="#1E9E6A" />
        </>
      ) : (
        <>
          <rect x="9.5" y="10" width="13" height="16" rx="2.5" stroke="#14624F" strokeWidth="1.9" />
          <path d="M13 15H19M13 18.5H19M13 22H16.5" stroke="#1E9E6A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M25.5 13V24.5C25.5 25.33 24.83 26 24 26H14.5" stroke="#14624F" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function AnimatedCheckIcon({
  animateDraw,
  delayMs,
}: {
  animateDraw: boolean;
  delayMs: number;
}) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] shrink-0"
    >
      <path
        d="M5.5 13.8L10.4 18.6L20.5 7.8"
        stroke="#1E9E6A"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className={animateDraw ? 'oh-help-check-path' : 'oh-help-check-static'}
        style={animateDraw ? { animationDelay: `${delayMs}ms` } : undefined}
      />
    </svg>
  );
}

function ChannelNeutralGlyph({ id }: { id: ChannelId }) {
  switch (id) {
    case 'maps':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="w-8 h-8 sm:w-9 sm:h-9">
          <path
            d="M18 6C12.75 6 8.5 10.14 8.5 15.25C8.5 21.74 16.56 29 17.4 29.74C17.74 30.04 18.26 30.04 18.6 29.74C19.44 29 27.5 21.74 27.5 15.25C27.5 10.14 23.25 6 18 6Z"
            stroke="#0F4A3E"
            strokeWidth="2.4"
            fill="#E8F6F0"
          />
          <circle cx="18" cy="15.2" r="3.4" fill="#1E9E6A" />
        </svg>
      );
    case 'search':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="w-8 h-8 sm:w-9 sm:h-9">
          <circle cx="16" cy="16" r="7.5" stroke="#0F4A3E" strokeWidth="2.6" fill="#E8F6F0" />
          <path d="M21.8 21.8L28.5 28.5" stroke="#1E9E6A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'gbp':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="w-8 h-8 sm:w-9 sm:h-9">
          <path
            d="M7.5 15L9.6 8.5H26.4L28.5 15C28.5 17.1 26.8 18.6 24.8 18.6C22.9 18.6 21.4 17.2 21.4 15.4C21.4 17.2 19.9 18.6 18 18.6C16.1 18.6 14.6 17.2 14.6 15.4C14.6 17.2 13.1 18.6 11.2 18.6C9.2 18.6 7.5 17.1 7.5 15Z"
            stroke="#0F4A3E"
            strokeWidth="2.1"
            strokeLinejoin="round"
            fill="#E8F6F0"
          />
          <path d="M9.5 18.6V27.5H26.5V18.6" stroke="#0F4A3E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="14.5" y="21.5" width="7" height="6" rx="1.2" fill="#1E9E6A" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="w-8 h-8 sm:w-9 sm:h-9">
          <path
            d="M18 7C11.92 7 7 11.72 7 17.55C7 19.83 7.75 21.95 9.04 23.68L7.6 28.4L12.56 26.95C14.18 27.68 16.03 28.1 18 28.1C24.08 28.1 29 23.38 29 17.55C29 11.72 24.08 7 18 7Z"
            stroke="#0F4A3E"
            strokeWidth="2.2"
            strokeLinejoin="round"
            fill="#E8F6F0"
          />
          <path
            d="M14.2 13.7C14.6 13.4 15.1 13.5 15.4 14L16.3 15.5C16.5 15.9 16.4 16.4 16 16.7L15.4 17.2C16.1 18.5 17.2 19.6 18.5 20.3L19 19.7C19.3 19.3 19.8 19.2 20.2 19.4L21.7 20.3C22.2 20.6 22.3 21.1 22 21.5C21.3 22.4 20.1 22.8 19 22.4C15.8 21.3 13.4 18.9 12.3 15.7C11.9 14.6 12.5 13.9 14.2 13.7Z"
            fill="#1E9E6A"
          />
        </svg>
      );
    case 'phone':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M11.6 8.8L14.5 12.7C14.9 13.3 14.8 14.1 14.2 14.6L12.7 15.8C14.1 18.6 16.4 20.9 19.2 22.3L20.4 20.8C20.9 20.2 21.7 20.1 22.3 20.5L26.2 23.4C26.8 23.9 27 24.8 26.5 25.5C25.2 27.3 22.9 28.1 20.7 27.3C14.9 25.1 10.9 21.1 8.7 15.3C7.9 13.1 8.7 10.8 10.5 9.5C11.2 9 11.2 8.3 11.6 8.8Z"
            stroke="#0F4A3E"
            strokeWidth="2.2"
            strokeLinejoin="round"
            fill="#E8F6F0"
          />
        </svg>
      );
    case 'star':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="w-7 h-7 sm:w-8 sm:h-8">
          <path
            d="M18 7.5L21.1 13.9L28.1 14.9L23 19.8L24.2 26.8L18 23.5L11.8 26.8L13 19.8L7.9 14.9L14.9 13.9L18 7.5Z"
            stroke="#0F4A3E"
            strokeWidth="2.2"
            strokeLinejoin="round"
            fill="#E8F6F0"
          />
        </svg>
      );
    case 'facebook':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="w-7 h-7 sm:w-8 sm:h-8">
          <circle cx="18" cy="18" r="10.5" stroke="#0F4A3E" strokeWidth="2.2" fill="#E8F6F0" />
          <path
            d="M19.8 28V19.6H22.5L22.9 16.5H19.8V14.6C19.8 13.7 20.1 13.1 21.3 13.1H23V10.3C22.3 10.2 21.4 10.1 20.5 10.1C18.1 10.1 16.6 11.5 16.6 14.2V16.5H14V19.6H16.6V28"
            fill="#1E9E6A"
          />
        </svg>
      );
    case 'instagram':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="w-7 h-7 sm:w-8 sm:h-8">
          <rect x="8.5" y="8.5" width="19" height="19" rx="5.5" stroke="#0F4A3E" strokeWidth="2.2" fill="#E8F6F0" />
          <circle cx="18" cy="18" r="4.3" stroke="#1E9E6A" strokeWidth="2.1" />
          <circle cx="23.5" cy="12.6" r="1.2" fill="#0F4A3E" />
        </svg>
      );
  }
}

function OpenHoursWhiteMark({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="22" stroke="#FFFFFF" strokeWidth="9.5" />
      <circle cx="36" cy="36" r="7.5" fill="#FFFFFF" fillOpacity="0.92" />
    </svg>
  );
}

const CHART_BAR_HEIGHTS = [38, 62, 86, 70, 96, 48, 68, 92];

export default function HelpSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useAnimationInView(sectionRef, false);

  const [hasEntered, setHasEntered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasEntered(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);

    // Failsafe so slow or off-frame headless states never get stuck unrevealed
    const fallbackTimer = window.setTimeout(() => setHasEntered(true), 1400);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const features = config.features;
  const gbpEnabled = Boolean(features.googleBusinessProfile);

  const showAiCard = Boolean(
    features.aiLeadCapture ||
      features.voiceAgent ||
      features.afterHoursAutoReply ||
      features.missedCallTextBack
  );

  const showOptionalTag = showAiCard && Boolean(config.wayOfWorking?.voiceAgentTag || config.help?.cards?.[2]?.optionalTag);

  const orbitTiles = useMemo<OrbitChannelTile[]>(() => {
    const enabled: OrbitChannelTile[] = [];

    if (features.googleBusinessProfile || features.localSeo || features.serviceAreaPages) {
      enabled.push({
        id: 'maps',
        label: 'Google Maps',
        cx: 19,
        cy: 23,
        rotate: -11,
        blurred: false,
        driftDuration: '6.8s',
        driftDelay: '0s',
        pulseDelay: '0s',
      });
    }

    if (features.localSeo || features.aeoFaq || features.geo || features.googleAds) {
      enabled.push({
        id: 'search',
        label: 'Local Search',
        cx: 81,
        cy: 24,
        rotate: 14,
        blurred: false,
        driftDuration: '7.6s',
        driftDelay: '-1.8s',
        pulseDelay: '-0.9s',
      });
    }

    if (features.aiLeadCapture || config.whatsapp?.trim() || config.socials?.whatsapp?.trim()) {
      enabled.push({
        id: 'whatsapp',
        label: 'WhatsApp',
        cx: 17,
        cy: 78,
        rotate: -14,
        blurred: false,
        driftDuration: '8.4s',
        driftDelay: '-3.1s',
        pulseDelay: '-1.7s',
      });
    }

    if (features.googleBusinessProfile) {
      enabled.push({
        id: 'gbp',
        label: 'Google Business Profile',
        cx: 82,
        cy: 77,
        rotate: 11,
        blurred: false,
        driftDuration: '7.2s',
        driftDelay: '-4.2s',
        pulseDelay: '-2.3s',
      });
    }

    if (config.phone?.trim() || features.missedCallTextBack || features.voiceAgent) {
      enabled.push({
        id: 'phone',
        label: 'Phone',
        cx: 58,
        cy: 13,
        rotate: 16,
        blurred: true,
        driftDuration: '8.8s',
        driftDelay: '-2.5s',
        pulseDelay: '-1.4s',
      });
    }

    if (features.reviewRequests || features.reviewEngine) {
      enabled.push({
        id: 'star',
        label: 'Google Reviews',
        cx: 13,
        cy: 50,
        rotate: -15,
        blurred: true,
        driftDuration: '6.4s',
        driftDelay: '-5.1s',
        pulseDelay: '-2.8s',
      });
    }

    if (config.socials?.facebook?.trim()) {
      enabled.push({
        id: 'facebook',
        label: 'Facebook',
        cx: 87,
        cy: 50,
        rotate: -10,
        blurred: true,
        driftDuration: '7.9s',
        driftDelay: '-3.7s',
        pulseDelay: '-2.1s',
      });
    }

    if (config.socials?.instagram?.trim()) {
      enabled.push({
        id: 'instagram',
        label: 'Instagram',
        cx: 48,
        cy: 87,
        rotate: 9,
        blurred: true,
        driftDuration: '8.1s',
        driftDelay: '-1.1s',
        pulseDelay: '-3.2s',
      });
    }

    return enabled;
  }, [features]);

  const helpCopy = config.help;
  const headingLine1 = helpCopy?.heading?.line1?.trim() || 'From a new website to';
  const headingLine2 = helpCopy?.heading?.line2?.trim() || 'a system that handles enquiries.';

  const card1 = helpCopy?.cards?.[0] || {
    title: 'Build your website',
    text: 'A fast, mobile-friendly website for your trade, set up with your Google Business Profile, at a fixed price in writing.',
  };

  const card2 = helpCopy?.cards?.[1] || {
    title: 'Get found and get enquiries',
    text: 'Local pages, your Google profile and an easy way to ask for a quote help the right people find you and get in touch.',
  };

  const card3 = helpCopy?.cards?.[2] || {
    title: 'An AI-powered enquiry system',
    text: 'Optional AI add-ons reply to enquiries, collect the job details and alert you, so follow-ups do not wait until you are off the job.',
    optionalTag: 'Optional add-on',
  };

  const optionalTagLabel =
    card3.optionalTag?.trim() || config.wayOfWorking?.voiceAgentTag || 'Optional add-on';

  const card1Pill2Title = gbpEnabled ? 'Google Business Profile' : 'Local service pages';
  const card1Pill2Subtitle = gbpEnabled
    ? 'Set up and matched to your site'
    : 'One page for each town you cover';

  const gridClassName = showAiCard
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px]'
    : 'grid grid-cols-1 md:grid-cols-2 gap-[25px] max-w-[1125px] mx-auto';

  const shouldAnimate = hasEntered && !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      id="help"
      aria-label="How Open Hours helps your trade business"
      className="oh-cv-auto oh-anim-paused relative w-full bg-white text-[#0B1B22] py-[var(--section-py)] overflow-x-clip"
    >
      <style>{`
        .oh-help-gradient-text {
          color: #1E9E6A;
        }
        @supports (-webkit-background-clip: text) or (background-clip: text) {
          .oh-help-gradient-text {
            background-image: linear-gradient(90deg, #1E9E6A 0%, #37B485 50%, #6FD6B0 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        }
        @keyframes ohHelpCheckDraw {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        .oh-help-check-static {
          stroke-dasharray: 1;
          stroke-dashoffset: 0;
        }
        .oh-help-check-path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: ohHelpCheckDraw 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes ohHelpTileDrift {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) translate3d(0, 0, 0) rotate(var(--tile-rot, 0deg));
          }
          50% {
            transform: translate3d(-50%, -50%, 0) translate3d(0, -6px, 0) rotate(var(--tile-rot, 0deg));
          }
        }
        .oh-help-orbit-tile {
          transform: translate3d(-50%, -50%, 0) rotate(var(--tile-rot, 0deg));
          animation: ohHelpTileDrift var(--tile-dur, 7.5s) ease-in-out var(--tile-delay, 0s) infinite;
          will-change: transform;
        }
        @keyframes ohHelpSpokePulse {
          0%, 100% { opacity: 0.24; }
          50% { opacity: 0.52; }
        }
        .oh-help-spoke {
          animation: ohHelpSpokePulse 4.5s ease-in-out var(--spoke-delay, 0s) infinite;
        }
        @keyframes ohHelpMsgRise {
          from { opacity: 0; transform: translate3d(0, 12px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .oh-help-msg-rise {
          animation: ohHelpMsgRise 480ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .oh-help-check-path {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }
          .oh-help-orbit-tile {
            animation: none !important;
            transform: translate3d(-50%, -50%, 0) rotate(var(--tile-rot, 0deg)) !important;
          }
          .oh-help-spoke {
            animation: none !important;
            opacity: 0.36 !important;
          }
          .oh-help-msg-rise {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Centered Two-Line Heading */}
        <div className="text-center max-w-[980px] mx-auto mb-12 sm:mb-14">
          <h2 className="font-heading text-[clamp(36px,4.6vw,64px)] font-bold leading-[1.08] tracking-[-0.03em] text-[#0B1B22]">
            <span className="block">{headingLine1}</span>
            <span className="block oh-help-gradient-text pb-1">{headingLine2}</span>
          </h2>
        </div>

        {/* 2. Three Cards Row */}
        <div className={gridClassName}>
          {/* ===============================================================
              CARD 1: Build your website
              =============================================================== */}
          <article className="rounded-[40px] bg-[#FAF7F5] overflow-hidden flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1">
            {/* Top Emerald Gradient Panel (all 4 corners radius 40px) */}
            <div
              className="relative h-[300px] md:h-[384px] rounded-[40px] overflow-hidden px-4 sm:px-6 lg:px-7 flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(180deg, #05261F 0%, #0D5442 54%, #3DBE93 100%)',
              }}
            >
              {/* Pill 1 */}
              <div className="w-full max-w-[440px] min-h-[78px] sm:h-[95px] rounded-[28px] sm:rounded-[36px] bg-white px-4 sm:px-5 lg:px-6 py-3 flex items-center justify-between gap-2.5 sm:gap-3.5 shadow-[0_20px_42px_-12px_rgba(5,38,31,0.52)]">
                <DomainGlyph />
                <div className="min-w-0 flex-1">
                  <div className="font-heading text-[16px] sm:text-[19px] xl:text-[22px] font-semibold text-[#0B1B22] leading-[1.18] tracking-[-0.02em]">
                    Your website
                  </div>
                  <div className="text-[12.5px] sm:text-[14.5px] xl:text-[17px] text-[#5B666B] leading-[1.25] mt-0.5">
                    Built for your trade, on your domain
                  </div>
                </div>
                <AnimatedCheckIcon animateDraw={shouldAnimate} delayMs={150} />
              </div>

              {/* Word between pills */}
              <span className="my-2.5 sm:my-3.5 text-[19px] sm:text-[22px] font-medium text-white/95 leading-none select-none">
                plus
              </span>

              {/* Pill 2 */}
              <div className="w-full max-w-[440px] min-h-[78px] sm:h-[95px] rounded-[28px] sm:rounded-[36px] bg-white px-4 sm:px-5 lg:px-6 py-3 flex items-center justify-between gap-2.5 sm:gap-3.5 shadow-[0_20px_42px_-12px_rgba(5,38,31,0.52)]">
                <ProfileOrPagesGlyph useProfile={gbpEnabled} />
                <div className="min-w-0 flex-1">
                  <div className="font-heading text-[16px] sm:text-[19px] xl:text-[22px] font-semibold text-[#0B1B22] leading-[1.18] tracking-[-0.02em]">
                    {card1Pill2Title}
                  </div>
                  <div className="text-[12.5px] sm:text-[14.5px] xl:text-[17px] text-[#5B666B] leading-[1.25] mt-0.5">
                    {card1Pill2Subtitle}
                  </div>
                </div>
                <AnimatedCheckIcon animateDraw={shouldAnimate} delayMs={750} />
              </div>
            </div>

            {/* Bottom Text Area */}
            <div className="p-7 sm:p-[36px] flex-1 flex flex-col">
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-1 sm:mt-2 w-[28px] h-[28px] rounded-[8px] shrink-0 flex items-center justify-center text-white text-[14px] font-bold tabular-nums shadow-[0_6px_14px_-4px_rgba(30,158,106,0.55)]"
                  style={{
                    background: 'linear-gradient(135deg, #1E9E6A 0%, #3DBE93 100%)',
                  }}
                >
                  1
                </span>
                <h3 className="font-heading text-[clamp(26px,2.3vw,44px)] font-semibold leading-[1.08] tracking-[-0.028em] text-[#0B1B22]">
                  {card1.title}
                </h3>
              </div>
              <p className="mt-4 text-[17px] sm:text-[20px] leading-[1.45] text-[#5B666B] font-normal">
                {card1.text}
              </p>
            </div>
          </article>

          {/* ===============================================================
              CARD 2: Get found and get enquiries
              =============================================================== */}
          <article className="rounded-[40px] bg-[#FAF7F5] overflow-hidden flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1">
            {/* Top Emerald Gradient Panel (all 4 corners radius 40px) */}
            <div
              className="relative h-[300px] md:h-[384px] rounded-[40px] overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #05261F 0%, #0D5442 54%, #3DBE93 100%)',
              }}
            >
              {/* Thin Radiating Lines From Center To Active Tiles */}
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full"
              >
                {orbitTiles.map((tile) => (
                  <line
                    key={`spoke-${tile.id}`}
                    x1="50%"
                    y1="50%"
                    x2={`${tile.cx}%`}
                    y2={`${tile.cy}%`}
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    className="oh-help-spoke"
                    style={{ '--spoke-delay': tile.pulseDelay } as React.CSSProperties}
                  />
                ))}
              </svg>

              {/* Floating Channel Tiles */}
              {orbitTiles.map((tile) => (
                <div
                  key={tile.id}
                  aria-label={tile.label}
                  className={`oh-help-orbit-tile absolute flex items-center justify-center bg-white ${
                    tile.blurred
                      ? 'z-10 w-[56px] h-[56px] sm:w-[70px] sm:h-[70px] rounded-[18px] sm:rounded-[22px] blur-[2px] opacity-55 shadow-[0_14px_26px_-8px_rgba(5,38,31,0.35)]'
                      : 'z-20 w-[68px] h-[68px] sm:w-[90px] sm:h-[90px] rounded-[22px] sm:rounded-[26px] shadow-[0_20px_38px_-10px_rgba(5,38,31,0.48)]'
                  }`}
                  style={
                    {
                      left: `${tile.cx}%`,
                      top: `${tile.cy}%`,
                      '--tile-rot': `${tile.rotate}deg`,
                      '--tile-dur': tile.driftDuration,
                      '--tile-delay': tile.driftDelay,
                    } as React.CSSProperties
                  }
                >
                  <ChannelNeutralGlyph id={tile.id} />
                </div>
              ))}

              {/* Large Centered Frosted Glass Tile (~150px, radius 36px) */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[116px] h-[116px] sm:w-[150px] sm:h-[150px] rounded-[28px] sm:rounded-[36px] flex items-center justify-center backdrop-blur-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.36)',
                  boxShadow:
                    'inset 0 1px 18px rgba(255, 255, 255, 0.28), 0 24px 48px -12px rgba(5, 38, 31, 0.55)',
                }}
              >
                <div className="scale-75 sm:scale-100">
                  <OpenHoursWhiteMark size={72} />
                </div>
              </div>
            </div>

            {/* Bottom Text Area */}
            <div className="p-7 sm:p-[36px] flex-1 flex flex-col">
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-1 sm:mt-2 w-[28px] h-[28px] rounded-[8px] shrink-0 flex items-center justify-center text-white text-[14px] font-bold tabular-nums shadow-[0_6px_14px_-4px_rgba(30,158,106,0.55)]"
                  style={{
                    background: 'linear-gradient(135deg, #1E9E6A 0%, #3DBE93 100%)',
                  }}
                >
                  2
                </span>
                <h3 className="font-heading text-[clamp(26px,2.3vw,44px)] font-semibold leading-[1.08] tracking-[-0.028em] text-[#0B1B22]">
                  {card2.title}
                </h3>
              </div>
              <p className="mt-4 text-[17px] sm:text-[20px] leading-[1.45] text-[#5B666B] font-normal">
                {card2.text}
              </p>
            </div>
          </article>

          {/* ===============================================================
              CARD 3: An AI-powered enquiry system (gated by AI/enquiry flags)
              =============================================================== */}
          {showAiCard && (
            <article className="md:col-span-2 lg:col-span-1 rounded-[40px] bg-[#FAF7F5] overflow-hidden flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1">
              {/* Top Emerald Gradient Panel (all 4 corners radius 40px) */}
              <div
                className="relative h-[300px] md:h-[384px] rounded-[40px] overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #05261F 0%, #0D5442 54%, #3DBE93 100%)',
                }}
              >
                {/* Small Demo Tag in Corner of Panel */}
                <DemoTag
                  variant="demo"
                  tone="dark"
                  className="absolute top-2.5 right-5 z-20"
                />

                {/* Chat-Window Mock Bleeding Off Right & Bottom Edges */}
                <div className="absolute left-[14px] sm:left-[22px] top-[24px] sm:top-[28px] -right-[14px] -bottom-[14px] rounded-tl-[28px] bg-white shadow-[0_24px_48px_-14px_rgba(5,38,31,0.58)] border border-white/80 flex overflow-hidden">
                  {/* Pale Green Left Sidebar Strip */}
                  <div
                    aria-hidden="true"
                    className="w-[32px] sm:w-[44px] shrink-0 bg-[#EBF7F2] border-r border-[#0B1B22]/[0.06] pt-4 px-2 flex flex-col gap-2.5"
                  >
                    <span className="h-2.5 w-full rounded bg-[#C7E9D9]" />
                    <span className="h-2 w-4/5 rounded bg-[#D7F0E4]" />
                    <span className="h-2 w-full rounded bg-[#D7F0E4]" />
                    <span className="h-2 w-3/4 rounded bg-[#D7F0E4]" />
                  </div>

                  {/* Main Window Content */}
                  <div className="flex-1 min-w-0 flex flex-col bg-white pr-6 sm:pr-7 pb-5">
                    {/* Window Header Bar */}
                    <div className="h-[38px] sm:h-[44px] px-3.5 sm:px-4 border-b border-[#0B1B22]/[0.06] flex items-center justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-heading text-[12.5px] sm:text-[14px] font-semibold text-[#0B1B22] truncate">
                          # new enquiries
                        </span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-[#5B666B] shrink-0">
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      <div
                        aria-hidden="true"
                        className="rounded-[8px] border border-[#0B1B22]/12 px-2 py-1 flex items-center gap-1 text-[#3D4B50] shrink-0 bg-[#FAFDFC]"
                      >
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                          <path d="M3 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <rect x="2" y="9.5" width="2.8" height="4.2" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                          <rect x="11.2" y="9.5" width="2.8" height="4.2" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                        </svg>
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    {/* Message + Stats + Chips (12px rise and fade once on first view; visible by default) */}
                    <div className={`p-3 sm:p-4 flex-1 ${shouldAnimate ? 'oh-help-msg-rise' : ''}`}>
                      <div className="flex items-start gap-2.5">
                        {/* Small Green Open Hours App Tile */}
                        <div
                          aria-hidden="true"
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-[9px] shrink-0 flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(13,84,66,0.45)]"
                          style={{
                            background: 'linear-gradient(135deg, #2FA97D 0%, #06382E 100%)',
                          }}
                        >
                          <OpenHoursWhiteMark size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-heading text-[12px] sm:text-[13px] font-semibold text-[#0B1B22] leading-tight">
                              Open Hours assistant
                            </span>
                            <span className="px-1.5 py-[1px] rounded bg-[#EBF5F0] text-[#14624F] text-[9.5px] font-semibold leading-tight">
                              APP
                            </span>
                            <span className="text-[10.5px] text-[#6B767B] tabular-nums leading-tight">
                              7:00 AM
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] sm:text-[12.5px] leading-[1.35] text-[#1A2930]">
                            New quote request: roof repair in Cork. Details and photos collected, reply sent.
                          </p>

                          <span className="mt-0.5 inline-block text-[11px] sm:text-[12px] font-medium text-[#1E9E6A]">
                            View enquiry
                          </span>

                          {/* White Stats Card */}
                          <div className="mt-2 rounded-[14px] border border-[#0B1B22]/[0.08] bg-white p-2 sm:p-2.5 shadow-[0_8px_18px_-10px_rgba(11,27,34,0.12)]">
                            <div className="grid grid-cols-3 gap-1.5">
                              <div className="rounded-[9px] bg-[#FAF7F5] px-2 py-1.5">
                                <div className="text-[8.5px] uppercase tracking-wider text-[#6B767B] leading-none">
                                  JOB
                                </div>
                                <div className="mt-1 text-[10.5px] sm:text-[11.5px] font-semibold text-[#0B1B22] leading-tight truncate">
                                  Roof repair
                                </div>
                              </div>
                              <div className="rounded-[9px] bg-[#FAF7F5] px-2 py-1.5">
                                <div className="text-[8.5px] uppercase tracking-wider text-[#6B767B] leading-none">
                                  TOWN
                                </div>
                                <div className="mt-1 text-[10.5px] sm:text-[11.5px] font-semibold text-[#0B1B22] leading-tight truncate">
                                  Cork
                                </div>
                              </div>
                              <div className="rounded-[9px] bg-[#FAF7F5] px-2 py-1.5">
                                <div className="text-[8.5px] uppercase tracking-wider text-[#6B767B] leading-none">
                                  PHOTOS
                                </div>
                                <div className="mt-1 text-[10.5px] sm:text-[11.5px] font-semibold text-[#0B1B22] tabular-nums leading-tight">
                                  3
                                </div>
                              </div>
                            </div>

                            {/* Small Static Green Bar Chart (no axis numbers) */}
                            <div
                              aria-hidden="true"
                              className="mt-2 pt-1.5 border-t border-[#0B1B22]/[0.05] flex items-end gap-1.5 h-[32px] sm:h-[42px]"
                            >
                              {CHART_BAR_HEIGHTS.map((pct, barIdx) => (
                                <div
                                  key={barIdx}
                                  className="flex-1 rounded-t-[4px]"
                                  style={{
                                    height: `${pct}%`,
                                    background:
                                      barIdx >= 4
                                        ? 'linear-gradient(180deg, #1E9E6A 0%, #0D5C48 100%)'
                                        : 'linear-gradient(180deg, #6FD6B0 0%, #2FA97D 100%)',
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Reaction Chips + Explicit AI Disclosure */}
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF5F0] text-[#14624F] text-[10px] font-medium leading-tight">
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                  <path d="M2.5 6.2L5 8.6L9.5 3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Seen
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF5F0] text-[#14624F] text-[10px] font-medium leading-tight">
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                  <path d="M4.5 4L2 6.5L4.5 9M2.3 6.5H7.5A2.5 2.5 0 0 1 10 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Replied
                              </span>
                            </div>

                            <span className="text-[10px] text-[#5B666B] font-medium leading-tight">
                              The assistant always says it is an AI.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Text Area */}
              <div className="p-7 sm:p-[36px] flex-1 flex flex-col">
                <div className="flex items-start gap-3.5">
                  <span
                    aria-hidden="true"
                    className="mt-1 sm:mt-2 w-[28px] h-[28px] rounded-[8px] shrink-0 flex items-center justify-center text-white text-[14px] font-bold tabular-nums shadow-[0_6px_14px_-4px_rgba(30,158,106,0.55)]"
                    style={{
                      background: 'linear-gradient(135deg, #1E9E6A 0%, #3DBE93 100%)',
                    }}
                  >
                    3
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                      <h3 className="font-heading text-[clamp(26px,2.3vw,44px)] font-semibold leading-[1.08] tracking-[-0.028em] text-[#0B1B22]">
                        {card3.title}
                      </h3>
                      {showOptionalTag && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DDF4EA] text-[#0F4A3E] border border-[#6FD6B0]/60 whitespace-nowrap shrink-0">
                          {optionalTagLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[17px] sm:text-[20px] leading-[1.45] text-[#5B666B] font-normal">
                  {card3.text}
                </p>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
