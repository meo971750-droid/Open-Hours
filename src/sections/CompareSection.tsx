import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { config, type CompareIconKind, type CompareTabConfig } from '../config';
import Logo from '../components/Logo';
import { useAnimationInView } from '../hooks/useAnimationInView';

interface ResolvedCompareTab {
  id: string;
  label: string;
  icon: CompareIconKind;
  typical: string;
  highlight: string;
  continuation: string;
  fileTitle: string;
  fileSubtitle: string;
  fileIsDemo: boolean;
}

function hasMonthlyUpdatesAndReportsInPackages(): boolean {
  const tiers = config.pricing?.tiers || [];
  let hasMonthlyUpdates = false;
  let hasMonthlyReports = false;

  for (const tier of tiers) {
    for (const item of tier.monthlyItems || []) {
      if (item.flag && !config.features[item.flag]) continue;
      const lower = item.label.toLowerCase();
      if (lower.includes('update') || lower.includes('post') || lower.includes('tuning')) {
        hasMonthlyUpdates = true;
      }
      if (lower.includes('report') || lower.includes('summary')) {
        hasMonthlyReports = true;
      }
    }
  }

  return hasMonthlyUpdates && hasMonthlyReports;
}

function resolveCompareTabs(): ResolvedCompareTab[] {
  const rawTabs: CompareTabConfig[] = config.compare?.tabs || [];
  const hasMonthlyData = hasMonthlyUpdatesAndReportsInPackages();
  const gbpEnabled = Boolean(config.features.googleBusinessProfile);

  const resolved: ResolvedCompareTab[] = [];

  for (const tab of rawTabs) {
    if (tab.requiresMonthlyPackageData && !hasMonthlyData) {
      continue;
    }

    if (tab.requiresAnyFlag && tab.requiresAnyFlag.length > 0) {
      const anyActive = tab.requiresAnyFlag.some((flagKey) => Boolean(config.features[flagKey]));
      if (!anyActive) continue;
    }

    const flagActive = tab.requiresFlag ? Boolean(config.features[tab.requiresFlag]) : true;
    const hideProfileMention = tab.id === 'care' && !gbpEnabled;

    const highlight = !flagActive || hideProfileMention
      ? tab.fallbackHighlight?.trim() || tab.highlight
      : tab.highlight;

    const continuationBase = !flagActive
      ? tab.fallbackContinuation?.trim() || tab.continuation
      : tab.continuation;

    // If an AI assistant is mentioned anywhere in this tab's copy, guarantee explicit disclosure
    const combinedCopy = `${highlight} ${continuationBase}`;
    const mentionsAiAssistant = /\bAI\b|\bassistant\b/i.test(combinedCopy);
    const aiNote = tab.aiDisclosure?.trim() || 'The assistant always says it is an AI.';
    const continuation =
      mentionsAiAssistant && !combinedCopy.toLowerCase().includes(aiNote.toLowerCase())
        ? `${continuationBase.trim()} ${aiNote}`
        : continuationBase;

    const fileTitle = !flagActive
      ? tab.fallbackFileTitle?.trim() || tab.fileTitle
      : tab.fileTitle;

    const fileSubtitle = !flagActive
      ? tab.fallbackFileSubtitle?.trim() || tab.fileSubtitle
      : tab.fileSubtitle;

    resolved.push({
      id: tab.id,
      label: tab.label,
      icon: tab.icon || 'website',
      typical: tab.typical,
      highlight,
      continuation,
      fileTitle,
      fileSubtitle,
      fileIsDemo: Boolean(tab.fileIsDemo),
    });
  }

  return resolved;
}

function TabGlossyIcon({
  kind,
  active,
  uid,
}: {
  kind: CompareIconKind;
  active: boolean;
  uid: string;
}) {
  const isPeach = kind === 'google' || kind === 'care';
  const gradId = `${uid}-${kind}-${active ? 'a' : 'i'}`;
  const shineId = `${uid}-${kind}-shine-${active ? 'a' : 'i'}`;

  const baseFrom = active
    ? '#FFFFFF'
    : isPeach
      ? '#F7C9AC'
      : '#9FE6CA';
  const baseTo = active
    ? '#DCE8E4'
    : isPeach
      ? '#DF8B5B'
      : '#1E9E6A';
  const innerAccent = active
    ? '#0B1B22'
    : isPeach
      ? '#6B3314'
      : '#06382E';

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="w-7 h-7 shrink-0"
    >
      <defs>
        <linearGradient id={gradId} x1="3" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={baseFrom} />
          <stop offset="100%" stopColor={baseTo} />
        </linearGradient>
        <linearGradient id={shineId} x1="14" y1="2" x2="14" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={active ? '0.85' : '0.7'} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {kind === 'website' && (
        <>
          <rect x="2.5" y="4.5" width="23" height="19" rx="5.5" fill={`url(#${gradId})`} />
          <rect x="3.5" y="5.5" width="21" height="9" rx="4.5" fill={`url(#${shineId})`} />
          <rect x="6" y="10.5" width="16" height="9.5" rx="2.5" fill={innerAccent} fillOpacity={active ? 0.22 : 0.16} />
          <circle cx="7.2" cy="8" r="1.15" fill={innerAccent} fillOpacity="0.65" />
          <circle cx="10.6" cy="8" r="1.15" fill={innerAccent} fillOpacity="0.45" />
          <rect x="8.2" y="13.2" width="11.6" height="4.2" rx="2.1" fill="#FFFFFF" fillOpacity={active ? 0.95 : 0.88} />
        </>
      )}

      {kind === 'google' && (
        <>
          <path
            d="M14 2.5C9.03 2.5 5 6.46 5 11.35C5 17.56 12.64 24.44 13.45 25.15C13.76 25.43 14.24 25.43 14.55 25.15C15.36 24.44 23 17.56 23 11.35C23 6.46 18.97 2.5 14 2.5Z"
            fill={`url(#${gradId})`}
          />
          <path
            d="M14 3.5C9.7 3.5 6.2 6.8 6 11C6.2 9 9.7 6.8 14 6.8C18.3 6.8 21.8 9 22 11C21.8 6.8 18.3 3.5 14 3.5Z"
            fill={`url(#${shineId})`}
          />
          <circle cx="14" cy="11.4" r="4.2" fill="#FFFFFF" fillOpacity={active ? 0.96 : 0.9} />
          <circle cx="14" cy="11.4" r="1.8" fill={innerAccent} fillOpacity="0.7" />
        </>
      )}

      {kind === 'enquiries' && (
        <>
          <path
            d="M5.5 4.5H22.5C24.43 4.5 26 6.07 26 8V18.5C26 20.43 24.43 22 22.5 22H12.2L7.1 25.6C6.45 26.06 5.55 25.59 5.55 24.79V22C3.62 21.97 2 20.41 2 18.5V8C2 6.07 3.57 4.5 5.5 4.5Z"
            fill={`url(#${gradId})`}
          />
          <rect x="3" y="5.5" width="22" height="8" rx="4" fill={`url(#${shineId})`} />
          <rect x="7" y="10.2" width="14" height="2.4" rx="1.2" fill="#FFFFFF" fillOpacity={active ? 0.95 : 0.9} />
          <rect x="7" y="14.5" width="9.5" height="2.4" rx="1.2" fill="#FFFFFF" fillOpacity={active ? 0.85 : 0.78} />
        </>
      )}

      {kind === 'care' && (
        <>
          <rect x="3" y="13.5" width="22" height="10.5" rx="4.5" fill={baseTo} fillOpacity="0.78" />
          <rect x="3" y="8.5" width="22" height="10.5" rx="4.5" fill={`url(#${gradId})`} />
          <rect x="3" y="3.5" width="22" height="10.5" rx="4.5" fill={`url(#${gradId})`} />
          <rect x="4" y="4.5" width="20" height="5" rx="2.5" fill={`url(#${shineId})`} />
          <path
            d="M10.5 8.8L12.9 11.1L17.6 6.5"
            stroke="#FFFFFF"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function BrowserWindowIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="w-9 h-9 shrink-0 text-[#0B1B22]"
    >
      <rect
        x="3"
        y="5.5"
        width="30"
        height="25"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <line x1="3.5" y1="13" x2="32.5" y2="13" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="8.5" cy="9.25" r="1.4" fill="currentColor" />
      <circle cx="13" cy="9.25" r="1.4" fill="currentColor" />
      <circle cx="17.5" cy="9.25" r="1.4" fill="currentColor" />
    </svg>
  );
}

function OpenHoursTileMark() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
      className="w-[42px] h-[42px]"
    >
      <circle cx="21" cy="21" r="12.5" stroke="#0B1B22" strokeWidth="5.2" />
      <circle cx="21" cy="21" r="4.3" fill="#1E9E6A" />
    </svg>
  );
}

export default function CompareSection() {
  const tabs = useMemo(() => resolveCompareTabs(), []);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasInteractedRef = useRef(false);
  const uid = useId().replace(/:/g, '');

  useAnimationInView(sectionRef, false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hasSwitched, setHasSwitched] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (activeIndex >= tabs.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, tabs.length]);

  const measurePill = useCallback(() => {
    const btn = tabRefs.current[activeIndex];
    if (!btn) return;
    // Track padding is 5px; indicator sits at left: 5px, top: 5px, bottom: 5px
    setPillStyle({
      left: Math.max(0, btn.offsetLeft - 5),
      width: btn.offsetWidth,
    });
  }, [activeIndex]);

  useEffect(() => {
    measurePill();
    if (typeof ResizeObserver === 'undefined' || !trackRef.current) return;
    const ro = new ResizeObserver(measurePill);
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measurePill, tabs.length]);

  useEffect(() => {
    if (!hasInteractedRef.current) return;
    const activeBtn = tabRefs.current[activeIndex];
    if (!activeBtn) return;
    activeBtn.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeIndex, prefersReducedMotion]);

  if (tabs.length < 2) return null;

  const activeTab = tabs[activeIndex] ?? tabs[0];
  const compareCopy = config.compare;
  const pillLabel = compareCopy?.pill?.trim() || 'The difference';
  const headingLine1 = compareCopy?.headingLine1?.trim() || 'Same trade.';
  const headingLine2 = compareCopy?.headingLine2?.trim() || 'Different website.';
  const subtitleText =
    compareCopy?.subtitle?.trim() ||
    'Hand over the brief. We build it, set it up and make sure enquiries have somewhere to land.';
  const typicalLabel = compareCopy?.typicalLabel?.trim() || 'A typical template site';
  const footnoteText =
    compareCopy?.footnote?.trim() || 'General comparison. Every website is different.';

  const selectTab = (nextIndex: number, focusTarget = false) => {
    const wrapped = ((nextIndex % tabs.length) + tabs.length) % tabs.length;
    hasInteractedRef.current = true;
    if (wrapped !== activeIndex) {
      setHasSwitched(true);
      setActiveIndex(wrapped);
    }
    if (focusTarget) {
      window.requestAnimationFrame(() => tabRefs.current[wrapped]?.focus());
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      selectTab(idx + 1, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      selectTab(idx - 1, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      selectTab(0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      selectTab(tabs.length - 1, true);
    }
  };

  const desktopGridColsClass =
    tabs.length === 2
      ? 'min-[960px]:grid-cols-2'
      : tabs.length === 3
        ? 'min-[960px]:grid-cols-3'
        : 'min-[960px]:grid-cols-4';

  return (
    <section
      ref={sectionRef}
      id="compare"
      aria-label="Comparison between template sites and Open Hours"
      className="oh-cv-auto oh-anim-paused relative w-full bg-white text-[#0B1B22] py-[var(--section-py)] overflow-x-clip"
    >
      <style>{`
        @keyframes ohCompareArrowRight {
          0%, 72%, 100% { transform: translate3d(0, 0, 0); }
          84% { transform: translate3d(8px, 0, 0); }
        }
        @keyframes ohCompareArrowDown {
          0%, 72%, 100% { transform: translate3d(0, 0, 0) rotate(90deg); }
          84% { transform: translate3d(0, 8px, 0) rotate(90deg); }
        }
        @keyframes ohCompareCardsIn {
          from { opacity: 0; transform: translate3d(24px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes ohCompareHighlightReveal {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        .oh-compare-arrow-desktop {
          animation: ohCompareArrowRight 4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
          will-change: transform;
        }
        .oh-compare-arrow-mobile {
          animation: ohCompareArrowDown 4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
          will-change: transform;
        }
        .oh-compare-cards-enter {
          animation: ohCompareCardsIn 350ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .oh-compare-highlight-enter {
          animation: ohCompareHighlightReveal 350ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .oh-compare-arrow-desktop {
            animation: none !important;
            transform: none !important;
          }
          .oh-compare-arrow-mobile {
            animation: none !important;
            transform: rotate(90deg) !important;
          }
          .oh-compare-cards-enter,
          .oh-compare-highlight-enter {
            animation: none !important;
            transform: none !important;
            clip-path: none !important;
          }
        }
      `}</style>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Centered Header */}
        <div className="text-center max-w-[920px] mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EDF3F0] text-[#14624F] text-[13px] sm:text-[14px] font-medium mb-5">
            {pillLabel}
          </span>

          <h2 className="font-heading text-[clamp(40px,6vw,96px)] font-bold leading-[1.0] tracking-[-0.03em] text-[#0B1B22]">
            <span className="block">{headingLine1}</span>
            <span className="block">{headingLine2}</span>
          </h2>

          <p className="mt-5 text-[17px] sm:text-[20px] leading-[1.45] text-[#5B666B] max-w-[700px] mx-auto">
            {subtitleText}
          </p>
        </div>

        {/* 2. Pill Tab Bar */}
        <div className="w-full max-w-[1700px] mx-auto mb-8 sm:mb-10">
          <div
            ref={trackRef}
            role="tablist"
            aria-label="Website comparison categories"
            className={`relative h-[70px] w-full rounded-full bg-[#F6F4F2] p-[5px] flex min-[960px]:grid ${desktopGridColsClass} items-center overflow-x-auto min-[960px]:overflow-visible no-scrollbar snap-x snap-proximity`}
          >
            {/* Shared Sliding Dark Pill */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute top-[5px] bottom-[5px] left-[5px] rounded-full shadow-[0_8px_20px_-6px_rgba(11,27,34,0.35)] ${
                prefersReducedMotion
                  ? ''
                  : 'transition-[transform,width] duration-300 ease-[cubic-bezier(0.34,1.35,0.64,1)]'
              }`}
              style={{
                width: pillStyle.width > 0 ? `${pillStyle.width}px` : undefined,
                transform: `translate3d(${pillStyle.left}px, 0, 0)`,
                background: 'linear-gradient(135deg, #12303D 0%, #0B1B22 100%)',
                opacity: pillStyle.width > 0 ? 1 : 0,
              }}
            />

            {tabs.map((tab, idx) => {
              const isActive = idx === activeIndex;
              const tabDomId = `${uid}-tab-${tab.id}`;
              const panelDomId = `${uid}-panel-${tab.id}`;

              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  id={tabDomId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={panelDomId}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectTab(idx, false)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`relative z-10 h-full shrink-0 min-[960px]:shrink flex items-center justify-center gap-2.5 sm:gap-3 px-5 min-[960px]:px-3 rounded-full whitespace-nowrap snap-center cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#1E9E6A] focus-visible:outline-offset-[-2px] ${
                    isActive ? 'text-white' : 'text-[#0B1B22] hover:text-[#14624F]'
                  }`}
                >
                  <TabGlossyIcon kind={tab.icon} active={isActive} uid={uid} />
                  <span className="font-heading text-[16px] sm:text-[18px] min-[1180px]:text-[22px] font-medium leading-none tracking-[-0.02em]">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Side-by-Side Comparison Cards + Animated Cream Arrow */}
        <div
          role="tabpanel"
          id={`${uid}-panel-${activeTab.id}`}
          aria-labelledby={`${uid}-tab-${activeTab.id}`}
          className="w-full max-w-[1700px] mx-auto"
        >
          <div
            key={activeTab.id}
            className={`relative flex flex-col min-[1024px]:flex-row items-stretch min-[1024px]:items-center gap-4 min-[1024px]:gap-[150px] ${
              hasSwitched ? 'oh-compare-cards-enter' : ''
            }`}
          >
            {/* LEFT CARD: A typical template site */}
            <div className="relative z-10 flex-1 min-[1024px]:h-[300px] rounded-[32px] bg-[#F8F4EF] p-6 sm:p-[30px] flex flex-col justify-between">
              <div className="flex items-center gap-3.5 pr-4">
                <BrowserWindowIcon />
                <h3 className="font-heading text-[24px] sm:text-[32px] font-semibold leading-[1.12] tracking-[-0.025em] text-[#0B1B22]">
                  {typicalLabel}
                </h3>
              </div>

              <p className="mt-8 min-[1024px]:mt-4 text-[18px] sm:text-[22px] leading-[1.35] text-[#5B666B] font-normal">
                {activeTab.typical}
              </p>
            </div>

            {/* EMBOSSED CREAM ARROW BETWEEN CARDS */}
            {/* Desktop centered overlapping left card right edge slightly; Mobile rotated downward between stacked cards */}
            <div
              aria-hidden="true"
              className="pointer-events-none flex items-center justify-center my-[-12px] min-[1024px]:my-0 min-[1024px]:absolute min-[1024px]:left-1/2 min-[1024px]:top-1/2 min-[1024px]:-translate-x-[66%] min-[1024px]:-translate-y-1/2 z-20"
            >
              <div className="hidden min-[1024px]:block oh-compare-arrow-desktop">
                <svg
                  width="156"
                  height="94"
                  viewBox="0 0 156 94"
                  fill="none"
                  className="w-[156px] h-[94px]"
                  style={{
                    filter: 'drop-shadow(6px 8px 14px rgba(18, 48, 61, 0.11))',
                  }}
                >
                  <path
                    d="M6 38H104.5L80.5 14.5C76.7 10.8 76.7 4.7 80.4 1C84.1 -2.7 90.2 -2.7 93.9 1L141.2 47L93.9 93C90.2 96.7 84.1 96.7 80.4 93C76.7 89.3 76.7 83.2 80.5 79.5L104.5 56H6C1.6 56 0 52.4 0 48V46C0 41.6 1.6 38 6 38Z"
                    fill="#F8F4EF"
                    transform="translate(4, 0) scale(0.95)"
                  />
                </svg>
              </div>

              <div className="min-[1024px]:hidden oh-compare-arrow-mobile">
                <svg
                  width="76"
                  height="52"
                  viewBox="0 0 154 94"
                  fill="none"
                  className="w-[76px] h-[52px]"
                  style={{
                    filter: 'drop-shadow(0 6px 12px rgba(18, 48, 61, 0.09))',
                  }}
                >
                  <path
                    d="M8 38H102.5L78.5 14.5C74.7 10.8 74.7 4.7 78.4 1C82.1 -2.7 88.2 -2.7 91.9 1L139.2 47L91.9 93C88.2 96.7 82.1 96.7 78.4 93C74.7 89.3 74.7 83.2 78.5 79.5L102.5 56H8C3.6 56 0 52.4 0 48V46C0 41.6 3.6 38 8 38Z"
                    fill="#F8F4EF"
                    transform="translate(4, 0) scale(0.95)"
                  />
                </svg>
              </div>
            </div>

            {/* RIGHT CARD: Open Hours brand green gradient */}
            <div
              className="relative z-10 flex-1 min-[1024px]:h-[300px] rounded-[32px] p-6 sm:p-[30px] text-white overflow-hidden flex flex-col sm:flex-row justify-between gap-6"
              style={{
                background:
                  'radial-gradient(circle at 14% 12%, rgba(168, 235, 211, 0.18) 0%, transparent 45%), linear-gradient(135deg, #2FA97D 0%, #157D5D 46%, #06382E 100%)',
              }}
            >
              {/* Left Text Block: Open Hours Wordmark + Marker-Highlighted Two-Part Line */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="h-[48px] flex items-center">
                  <Logo
                    variant="light"
                    size="xl"
                    className="[&>span]:text-[34px] sm:[&>span]:text-[42px]"
                  />
                </div>

                <p
                  className={`mt-6 sm:mt-4 text-[18px] sm:text-[22px] leading-[1.45] font-normal ${
                    hasSwitched ? 'oh-compare-highlight-enter' : ''
                  }`}
                >
                  <span className="inline bg-white text-[#0F4A3E] rounded-[6px] px-[8px] py-[2px] font-medium box-decoration-clone">
                    {activeTab.highlight}
                  </span>{' '}
                  <span className="text-white/95">{activeTab.continuation}</span>
                </p>
              </div>

              {/* Right Rail: 70px White App Tile -> Vertical Connector Line -> Translucent File Card */}
              <div className="flex sm:flex-col items-center sm:items-center justify-between sm:justify-between gap-3 sm:gap-0 shrink-0">
                <div className="w-[70px] h-[70px] rounded-[18px] bg-white shadow-[0_14px_30px_-8px_rgba(6,56,46,0.55)] flex items-center justify-center shrink-0">
                  <OpenHoursTileMark />
                </div>

                {/* Vertical Connector Line (hidden on xs row, visible vertical stem on sm+) */}
                <div
                  aria-hidden="true"
                  className="hidden sm:block w-[1px] flex-1 bg-white/35 my-0 min-h-[24px]"
                />

                <div className="rounded-[12px] border border-white/30 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 min-w-[144px] max-w-[196px] text-left shadow-[0_10px_24px_-10px_rgba(6,56,46,0.45)]">
                  {activeTab.fileIsDemo && config.ui.demoLabels && (
                    <span className="inline-block mb-1 px-1.5 py-0.5 rounded bg-white/16 text-[9.5px] font-semibold uppercase tracking-wider text-white/90 leading-none">
                      Demo
                    </span>
                  )}
                  <div className="text-[12px] font-semibold text-white leading-tight truncate">
                    {activeTab.fileTitle}
                  </div>
                  <div className="text-[12px] text-white/75 leading-tight mt-0.5 truncate">
                    {activeTab.fileSubtitle}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Muted Footnote */}
        {footnoteText && (
          <p className="mt-7 text-center text-[13.5px] text-[#5B666B]">
            {footnoteText}
          </p>
        )}
      </div>
    </section>
  );
}
