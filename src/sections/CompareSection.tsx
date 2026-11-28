import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  config,
  type CompareIconKind,
  type CompareSendItemConfig,
  type CompareTabConfig,
} from '../config';
import Logo from '../components/Logo';
import { useAnimationInView } from '../hooks/useAnimationInView';

interface ResolvedCompareTab {
  id: string;
  label: string;
  icon: CompareIconKind;
  sendLead: string;
  sendItems: [CompareSendItemConfig, CompareSendItemConfig, CompareSendItemConfig];
  dropExample: string;
  headline: string;
  support: string;
  proof: string;
  demoMockup: boolean;
  showReplyFlow: boolean;
  showEnquiryCard: boolean;
  showOwnerBell: boolean;
  showGbp: boolean;
  showAreaPages: boolean;
}

function hasMonthlyUpdatesOrReportsInPackages(): boolean {
  const tiers = config.pricing?.tiers || [];
  for (const tier of tiers) {
    for (const item of tier.monthlyItems || []) {
      if (item.flag && !config.features[item.flag]) continue;
      const lower = item.label.toLowerCase();
      if (
        lower.includes('update') ||
        lower.includes('post') ||
        lower.includes('tuning') ||
        lower.includes('report') ||
        lower.includes('summary')
      ) {
        return true;
      }
    }
    for (const feat of tier.features || []) {
      const lower = feat.toLowerCase();
      if (
        lower.includes('monthly') &&
        (lower.includes('update') || lower.includes('report') || lower.includes('summary'))
      ) {
        return true;
      }
    }
  }
  return false;
}

function getTownChips(): [string, string, string] {
  const maybeMarkets = (config as unknown as {
    markets?: { towns?: string[]; primary?: string[] } | string[];
  }).markets;

  if (Array.isArray(maybeMarkets) && maybeMarkets.length >= 3) {
    return [maybeMarkets[0], maybeMarkets[1], maybeMarkets[2]];
  }
  if (maybeMarkets && !Array.isArray(maybeMarkets)) {
    const list = maybeMarkets.towns || maybeMarkets.primary;
    if (Array.isArray(list) && list.length >= 3) {
      return [list[0], list[1], list[2]];
    }
  }
  return ['Cork', 'Galway', 'Limerick'];
}

function resolveCompareTabs(): ResolvedCompareTab[] {
  const rawTabs: CompareTabConfig[] = config.compare?.tabs || [];
  const hasMonthlyData = hasMonthlyUpdatesOrReportsInPackages();
  const gbpEnabled = Boolean(config.features.googleBusinessProfile);
  const areaPagesEnabled = Boolean(config.features.serviceAreaPages);
  const missedCallEnabled = Boolean(config.features.missedCallTextBack);
  const afterHoursEnabled = Boolean(config.features.afterHoursAutoReply);
  const aiLeadEnabled = Boolean(config.features.aiLeadCapture);
  const trackingEnabled = Boolean(config.features.enquiryTracking);
  const ownerAlertsEnabled = Boolean(config.features.ownerAlerts);

  const hasAnyEnquiryFlag =
    missedCallEnabled || afterHoursEnabled || aiLeadEnabled || trackingEnabled;
  const hasReplyFlag = missedCallEnabled || afterHoursEnabled || aiLeadEnabled;

  const resolved: ResolvedCompareTab[] = [];

  for (const tab of rawTabs) {
    if (tab.requiresMonthlyPackageData && !hasMonthlyData) {
      continue;
    }

    if (tab.id === 'google' && !gbpEnabled && !areaPagesEnabled) {
      continue;
    }

    if (tab.id === 'enquiries' && !hasAnyEnquiryFlag) {
      continue;
    }

    if (tab.requiresFlag && !config.features[tab.requiresFlag]) {
      continue;
    }

    if (tab.requiresAnyFlag && tab.requiresAnyFlag.length > 0) {
      const anyActive = tab.requiresAnyFlag.some((flagKey) => Boolean(config.features[flagKey]));
      if (!anyActive) continue;
    }

    let headline = tab.headline;
    let support = tab.support;
    let proof = tab.proof;

    if (tab.id === 'google') {
      if (!gbpEnabled && areaPagesEnabled) {
        headline =
          tab.fallbackHeadline?.trim() ||
          'A dedicated local page built around each town you cover.';
        support = tab.fallbackSupport?.trim() || 'With clear details across every page.';
      } else if (gbpEnabled && !areaPagesEnabled) {
        headline = 'A Google Business Profile matched to your website.';
        support = tab.support;
      }
    }

    if (tab.id === 'enquiries') {
      if (hasReplyFlag && !trackingEnabled) {
        headline = 'Enquiries get a reply on supported channels while you work.';
        support = 'Customers hear back without waiting until evening.';
        proof = 'Fast channel replies';
      } else if (!hasReplyFlag && trackingEnabled) {
        headline = 'Enquiries arrive structured with the job details in one place.';
        support = 'You see what came in when you are off the job.';
      }
    }

    if (tab.id === 'care' && !gbpEnabled) {
      headline =
        tab.fallbackHeadline?.trim() || 'Monthly updates to your pages, and a short report.';
    }

    const combinedCopy = `${headline} ${support} ${proof}`;
    const mentionsAi = /\bAI\b|\bassistant\b/i.test(combinedCopy);
    const aiNote = tab.aiDisclosure?.trim() || 'The assistant always says it is an AI.';
    if (mentionsAi && !combinedCopy.toLowerCase().includes(aiNote.toLowerCase())) {
      support = `${support.trim()} ${aiNote}`;
    }

    resolved.push({
      id: tab.id,
      label: tab.label,
      icon: tab.icon || 'website',
      sendLead: tab.sendLead,
      sendItems: tab.sendItems,
      dropExample: tab.dropExample,
      headline,
      support,
      proof,
      demoMockup: Boolean(tab.demoMockup),
      showReplyFlow: tab.id === 'enquiries' ? hasReplyFlag : true,
      showEnquiryCard: tab.id === 'enquiries' ? trackingEnabled || hasReplyFlag : true,
      showOwnerBell: ownerAlertsEnabled,
      showGbp: gbpEnabled,
      showAreaPages: areaPagesEnabled,
    });
  }

  return resolved;
}

function resolveHeadingLines(): { line1: string; line2: string } {
  const title = config.compare?.title;
  if (typeof title === 'string' && title.trim()) {
    const clean = title.trim();
    if (clean.includes('\n')) {
      const [a, ...rest] = clean.split('\n');
      return { line1: a.trim(), line2: rest.join(' ').trim() };
    }
    const sentenceBreak = clean.indexOf('. ');
    if (sentenceBreak > 0) {
      return {
        line1: clean.slice(0, sentenceBreak + 1).trim(),
        line2: clean.slice(sentenceBreak + 2).trim(),
      };
    }
    return { line1: clean, line2: '' };
  }
  if (title && typeof title === 'object') {
    return {
      line1: title.line1?.trim() || 'You bring the trade.',
      line2: title.line2?.trim() || 'We build the rest.',
    };
  }
  return {
    line1: 'You bring the trade.',
    line2: 'We build the rest.',
  };
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

  const baseFrom = active ? '#FFFFFF' : isPeach ? '#F7C9AC' : '#9FE6CA';
  const baseTo = active ? '#DCE8E4' : isPeach ? '#DF8B5B' : '#1E9E6A';
  const innerAccent = active ? '#0B1B22' : isPeach ? '#6B3314' : '#06382E';

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="w-[calc(28px*var(--s))] h-[calc(28px*var(--s))] shrink-0"
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
          <rect
            x="6"
            y="10.5"
            width="16"
            height="9.5"
            rx="2.5"
            fill={innerAccent}
            fillOpacity={active ? 0.22 : 0.16}
          />
          <circle cx="7.2" cy="8" r="1.15" fill={innerAccent} fillOpacity="0.65" />
          <circle cx="10.6" cy="8" r="1.15" fill={innerAccent} fillOpacity="0.45" />
          <rect
            x="8.2"
            y="13.2"
            width="11.6"
            height="4.2"
            rx="2.1"
            fill="#FFFFFF"
            fillOpacity={active ? 0.95 : 0.88}
          />
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
          <rect
            x="7"
            y="10.2"
            width="14"
            height="2.4"
            rx="1.2"
            fill="#FFFFFF"
            fillOpacity={active ? 0.95 : 0.9}
          />
          <rect
            x="7"
            y="14.5"
            width="9.5"
            height="2.4"
            rx="1.2"
            fill="#FFFFFF"
            fillOpacity={active ? 0.85 : 0.78}
          />
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

function GlossySendCircleIcon({ uid }: { uid: string }) {
  const gradId = `${uid}-send-circle`;
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="w-[calc(40px*var(--s))] h-[calc(40px*var(--s))] shrink-0 drop-shadow-[0_6px_12px_rgba(20,115,90,0.28)]"
    >
      <defs>
        <linearGradient id={gradId} x1="4" y1="3" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6FD6B0" />
          <stop offset="55%" stopColor="#1E9E6A" />
          <stop offset="100%" stopColor="#0F4A3E" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#${gradId})`} />
      <ellipse cx="20" cy="11.5" rx="12" ry="6.5" fill="#FFFFFF" fillOpacity="0.22" />
      <path
        d="M27.8 12.6L11.5 19.3C10.9 19.55 10.95 20.42 11.58 20.61L17.45 22.36L19.2 28.23C19.39 28.86 20.26 28.91 20.51 28.31L27.8 12.6Z"
        stroke="#FFFFFF"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 22.3L27.2 13.1"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChecklistRowIcon({ kind }: { kind?: CompareSendItemConfig['icon'] }) {
  const cls = 'w-[calc(20px*var(--s))] h-[calc(20px*var(--s))]';
  switch (kind) {
    case 'photo':
    case 'camera':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <circle cx="9" cy="10.5" r="1.5" />
          <path d="M21 15l-4.5-4.5L7 19" />
        </svg>
      );
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'details':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
          <rect x="4" y="3" width="16" height="18" rx="3" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case 'profile':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M5 19.5a7 7 0 0 1 14 0" />
        </svg>
      );
    case 'chat':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </svg>
      );
    case 'reply':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
          <polyline points="9 14 4 9 9 4" />
          <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
        </svg>
      );
    case 'filter':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      );
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15.5 14" />
        </svg>
      );
    case 'wrench':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
        </svg>
      );
    case 'map':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
          <path d="M12 21s-6-5.33-6-10.5a6 6 0 1 1 12 0C18 15.67 12 21 12 21Z" />
          <circle cx="12" cy="10.5" r="2.2" />
        </svg>
      );
  }
}

function TradeThumbGlyph({ variant }: { variant: 0 | 1 | 2 }) {
  if (variant === 0) {
    // House silhouette glyph
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-[calc(16px*var(--s))] h-[calc(16px*var(--s))] text-[#14624F]/70">
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5.5 9.5V20h13V9.5" />
        <path d="M9.5 20v-5.5h5V20" />
      </svg>
    );
  }
  if (variant === 1) {
    // Pitched roof & dormer glyph
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-[calc(16px*var(--s))] h-[calc(16px*var(--s))] text-[#14624F]/70">
        <path d="M2.5 13L12 5l9.5 8" />
        <path d="M6 10.5V19h12v-8.5" />
        <rect x="9.5" y="12.5" width="5" height="3.5" rx="0.8" />
      </svg>
    );
  }
  // Roof ridge / tiles glyph
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-[calc(16px*var(--s))] h-[calc(16px*var(--s))] text-[#14624F]/70">
      <path d="M3 15l9-8 9 8" />
      <path d="M6.5 15l5.5-5 5.5 5" />
      <line x1="4" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function OpenHoursTileMark() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
      className="w-[calc(38px*var(--s))] h-[calc(38px*var(--s))]"
    >
      <circle cx="21" cy="21" r="12.5" stroke="#0B1B22" strokeWidth="5.2" />
      <circle cx="21" cy="21" r="4.3" fill="#1E9E6A" />
    </svg>
  );
}

function OutputMockupPanel({ tab }: { tab: ResolvedCompareTab }) {
  const towns = useMemo(() => getTownChips(), []);

  return (
    <div
      aria-hidden="true"
      className="relative rounded-[calc(24px*var(--s))] bg-[#FAFDFB] border border-white/60 text-[#0B1B22] shadow-[0_18px_36px_-14px_rgba(6,37,30,0.42)] h-[calc(212px*var(--s))] sm:h-[calc(224px*var(--s))] p-[calc(14px*var(--s))] sm:p-[calc(16px*var(--s))] overflow-hidden select-none"
    >
      {tab.demoMockup && config.ui.demoLabels && (
        <span className="absolute top-[calc(10px*var(--s))] right-[calc(10px*var(--s))] z-20 px-[calc(8px*var(--s))] py-[calc(2px*var(--s))] rounded-[calc(4px*var(--s))] bg-[#0B1B22]/8 text-[calc(10px*var(--s))] font-semibold uppercase tracking-wider text-[#475754] leading-none">
          Demo
        </span>
      )}

      {tab.id === 'website' && (
        <div className="h-full flex items-center justify-center gap-[calc(8px*var(--s))] sm:gap-[calc(16px*var(--s))]">
          {/* Step 2: Foreground Phone Screen */}
          <div className="oh-mockup-step-2 w-[calc(132px*var(--s))] sm:w-[calc(172px*var(--s))] h-full rounded-[calc(26px*var(--s))] border-[calc(3px*var(--s))] border-[#0F2A35] bg-white p-[calc(8px*var(--s))] sm:p-[calc(10px*var(--s))] shadow-[0_10px_22px_-10px_rgba(11,27,34,0.28)] flex flex-col justify-between shrink-0">
            <div className="flex items-center justify-between gap-[calc(6px*var(--s))] pb-[calc(6px*var(--s))] border-b border-[#0B1B22]/8">
              <span className="h-[calc(10px*var(--s))] w-[calc(56px*var(--s))] sm:w-[calc(64px*var(--s))] rounded-full bg-[#0B1B22]/80" />
              <span className="h-[calc(8px*var(--s))] w-[calc(8px*var(--s))] rounded-full bg-[#1E9E6A]" />
            </div>

            <div className="rounded-[calc(10px*var(--s))] bg-[#14735A] text-white text-[calc(10px*var(--s))] sm:text-[calc(10.5px*var(--s))] font-semibold py-[calc(6px*var(--s))] px-[calc(8px*var(--s))] sm:px-[calc(10px*var(--s))] flex items-center justify-center gap-[calc(6px*var(--s))] whitespace-nowrap">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[calc(12px*var(--s))] h-[calc(12px*var(--s))] shrink-0">
                <path d="M13.5 11.1v1.8a1.2 1.2 0 0 1-1.3 1.2 11.8 11.8 0 0 1-5.1-1.8 11.6 11.6 0 0 1-3.6-3.6A11.8 11.8 0 0 1 1.7 3.6 1.2 1.2 0 0 1 2.9 2.3h1.8a1.2 1.2 0 0 1 1.2 1c.07.58.22 1.15.42 1.7a1.2 1.2 0 0 1-.27 1.26l-.76.76a9.6 9.6 0 0 0 3.6 3.6l.76-.76a1.2 1.2 0 0 1 1.26-.27c.55.2 1.12.35 1.7.42a1.2 1.2 0 0 1 1.09 1.09Z" />
              </svg>
              <span>Call now</span>
            </div>

            <div className="oh-mockup-step-3 flex flex-col gap-[calc(6px*var(--s))] my-[calc(4px*var(--s))]">
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  className="flex items-center gap-[calc(6px*var(--s))] rounded-[calc(6px*var(--s))] bg-[#F2F6F4] px-[calc(6px*var(--s))] py-[calc(4px*var(--s))]"
                >
                  <span className="w-[calc(12px*var(--s))] h-[calc(12px*var(--s))] rounded-[calc(4px*var(--s))] bg-[#1E9E6A]/20 flex items-center justify-center shrink-0">
                    <span className="w-[calc(6px*var(--s))] h-[calc(6px*var(--s))] rounded-full bg-[#14735A]" />
                  </span>
                  <span className="h-[calc(6px*var(--s))] flex-1 rounded-full bg-[#0B1B22]/25" />
                </div>
              ))}
            </div>

            <div className="oh-mockup-step-3 rounded-[calc(9px*var(--s))] border border-[#14735A]/30 bg-[#E7F5EE] text-[#0F4A3E] text-[calc(9.5px*var(--s))] sm:text-[calc(10px*var(--s))] font-semibold py-[calc(4px*var(--s))] text-center whitespace-nowrap">
              Get a quote
            </div>
          </div>

          {/* Step 1: Small Desktop Browser Window */}
          <div className="oh-mockup-step-1 flex-1 min-w-0 max-w-[calc(240px*var(--s))] h-[calc(168px*var(--s))] rounded-[calc(16px*var(--s))] border border-[#0B1B22]/12 bg-white shadow-[0_8px_20px_-10px_rgba(11,27,34,0.16)] overflow-hidden flex flex-col">
            <div className="h-[calc(28px*var(--s))] bg-[#F3F6F4] border-b border-[#0B1B22]/8 px-[calc(8px*var(--s))] sm:px-[calc(10px*var(--s))] flex items-center gap-[calc(6px*var(--s))] sm:gap-[calc(8px*var(--s))]">
              <div className="flex items-center gap-[calc(4px*var(--s))] shrink-0">
                <span className="w-[calc(6px*var(--s))] h-[calc(6px*var(--s))] rounded-full bg-[#0B1B22]/25" />
                <span className="w-[calc(6px*var(--s))] h-[calc(6px*var(--s))] rounded-full bg-[#0B1B22]/25" />
              </div>
              <div className="flex-1 min-w-0 rounded-full bg-white border border-[#0B1B22]/10 px-[calc(6px*var(--s))] sm:px-[calc(8px*var(--s))] py-[calc(2px*var(--s))] text-[calc(9.5px*var(--s))] sm:text-[calc(10px*var(--s))] font-medium text-[#475754] whitespace-nowrap text-center">
                yourbusiness.ie
              </div>
            </div>

            <div className="p-[calc(8px*var(--s))] sm:p-[calc(10px*var(--s))] flex-1 flex flex-col justify-between">
              <div className="flex flex-col gap-[calc(6px*var(--s))]">
                <div className="h-[calc(10px*var(--s))] w-3/4 rounded-full bg-[#0B1B22]/75" />
                <div className="h-[calc(8px*var(--s))] w-1/2 rounded-full bg-[#475754]/30" />
              </div>

              <div className="flex items-center gap-[calc(4px*var(--s))] sm:gap-[calc(6px*var(--s))]">
                <span className="px-[calc(6px*var(--s))] sm:px-[calc(8px*var(--s))] py-[calc(4px*var(--s))] rounded-full bg-[#14735A] text-white text-[calc(8.5px*var(--s))] sm:text-[calc(9px*var(--s))] font-semibold whitespace-nowrap">
                  Call now
                </span>
                <span className="px-[calc(6px*var(--s))] sm:px-[calc(8px*var(--s))] py-[calc(4px*var(--s))] rounded-full bg-[#E7F5EE] text-[#0F4A3E] text-[calc(8.5px*var(--s))] sm:text-[calc(9px*var(--s))] font-semibold whitespace-nowrap">
                  Get a quote
                </span>
              </div>

              <div className="grid grid-cols-3 gap-[calc(6px*var(--s))]">
                {[0, 1, 2].map((box) => (
                  <div
                    key={box}
                    className="h-[calc(36px*var(--s))] rounded-[calc(8px*var(--s))] bg-[#F2F6F4] border border-[#0B1B22]/6 p-[calc(6px*var(--s))] flex flex-col justify-between"
                  >
                    <span className="w-[calc(10px*var(--s))] h-[calc(10px*var(--s))] rounded-[calc(2px*var(--s))] bg-[#1E9E6A]/25" />
                    <span className="h-[calc(6px*var(--s))] w-full rounded-full bg-[#0B1B22]/20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab.id === 'google' && (
        <div className="h-full flex flex-col justify-between gap-[calc(10px*var(--s))] pt-[calc(4px*var(--s))]">
          <div className="flex-1 grid grid-cols-12 gap-[calc(12px*var(--s))] min-h-0">
            {/* Step 1: Light Map Tile with Ping Pin */}
            <div className="oh-mockup-step-1 col-span-5 relative rounded-[calc(16px*var(--s))] bg-[#E7F1EB] border border-[#14624F]/12 overflow-hidden">
              <svg viewBox="0 0 180 130" fill="none" className="w-full h-full object-cover">
                <path d="M-10 38L190 74" stroke="#FFFFFF" strokeWidth="7" />
                <path d="M44 -10L78 140" stroke="#FFFFFF" strokeWidth="6" />
                <path d="M126 -10L102 140" stroke="#D1E4D9" strokeWidth="3.5" />
                <path d="M-10 96L190 88" stroke="#D1E4D9" strokeWidth="3" />
                <rect x="82" y="22" width="26" height="18" rx="4" fill="#CBE2D4" />
                <rect x="18" y="64" width="34" height="20" rx="4" fill="#CBE2D4" />
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="oh-compare-pin-ping absolute w-[calc(36px*var(--s))] h-[calc(36px*var(--s))] rounded-full bg-[#1E9E6A]/35" />
                <svg viewBox="0 0 28 34" fill="none" className="relative w-[calc(28px*var(--s))] h-[calc(32px*var(--s))] drop-shadow-md">
                  <path
                    d="M14 1.5C7.1 1.5 1.5 7.1 1.5 14C1.5 22.8 11.9 31.4 13.1 32.3C13.6 32.7 14.4 32.7 14.9 32.3C16.1 31.4 26.5 22.8 26.5 14C26.5 7.1 20.9 1.5 14 1.5Z"
                    fill="#14735A"
                  />
                  <circle cx="14" cy="13.5" r="4.6" fill="#FFFFFF" />
                </svg>
              </div>
            </div>

            {/* Step 2: Google-profile-style Card */}
            <div className="oh-mockup-step-2 col-span-7 rounded-[calc(16px*var(--s))] bg-white border border-[#0B1B22]/10 p-[calc(12px*var(--s))] shadow-xs flex flex-col justify-between">
              <div className="flex flex-col gap-[calc(6px*var(--s))] pr-[calc(40px*var(--s))]">
                <div className="h-[calc(12px*var(--s))] w-3/4 rounded-full bg-[#0B1B22]/80" />
                <div className="h-[calc(8px*var(--s))] w-full rounded-full bg-[#475754]/25" />
                <div className="h-[calc(8px*var(--s))] w-5/6 rounded-full bg-[#475754]/20" />
                <div className="h-[calc(8px*var(--s))] w-2/3 rounded-full bg-[#475754]/20" />
              </div>

              <div className="flex flex-wrap items-center gap-[calc(6px*var(--s))] pt-[calc(4px*var(--s))]">
                {tab.showGbp ? (
                  <>
                    <span className="px-[calc(8px*var(--s))] py-[calc(2px*var(--s))] rounded-full bg-[#E7F5EE] text-[#0F4A3E] text-[calc(10px*var(--s))] font-semibold">
                      Open now
                    </span>
                    <span className="px-[calc(8px*var(--s))] py-[calc(2px*var(--s))] rounded-full bg-[#F3F5F3] text-[#0B1B22] text-[calc(10px*var(--s))] font-medium">
                      Call
                    </span>
                    <span className="px-[calc(8px*var(--s))] py-[calc(2px*var(--s))] rounded-full bg-[#F3F5F3] text-[#0B1B22] text-[calc(10px*var(--s))] font-medium">
                      Directions
                    </span>
                  </>
                ) : (
                  <span className="px-[calc(8px*var(--s))] py-[calc(2px*var(--s))] rounded-full bg-[#E7F5EE] text-[#0F4A3E] text-[calc(10px*var(--s))] font-semibold">
                    Local page matched
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: 3 Local Page Town Chips */}
          {tab.showAreaPages && (
            <div className="oh-mockup-step-3 flex items-center justify-between gap-[calc(8px*var(--s))] rounded-[calc(12px*var(--s))] bg-[#F1F6F3] px-[calc(12px*var(--s))] py-[calc(8px*var(--s))] border border-[#14624F]/10">
              <span className="text-[calc(11px*var(--s))] font-medium text-[#475754] shrink-0">Local pages</span>
              <div className="flex items-center gap-[calc(6px*var(--s))] flex-wrap justify-end">
                {towns.map((town) => (
                  <span
                    key={town}
                    className="px-[calc(10px*var(--s))] py-[calc(2px*var(--s))] rounded-full bg-white border border-[#14624F]/18 text-[calc(11px*var(--s))] font-semibold text-[#0F4A3E]"
                  >
                    {town}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab.id === 'enquiries' && (
        <div className="h-full grid grid-cols-12 gap-[calc(12px*var(--s))] pt-[calc(4px*var(--s))]">
          {/* Step 1 & 2: Phone Chat */}
          {tab.showReplyFlow && (
            <div
              className={`${
                tab.showEnquiryCard ? 'col-span-6' : 'col-span-12'
              } rounded-[calc(20px*var(--s))] border-[calc(2px*var(--s))] border-[#0F2A35] bg-[#F4F8F6] p-[calc(10px*var(--s))] flex flex-col justify-between shadow-xs`}
            >
              <div className="flex items-center justify-between border-b border-[#0B1B22]/8 pb-[calc(6px*var(--s))]">
                <span className="h-[calc(8px*var(--s))] w-[calc(56px*var(--s))] rounded-full bg-[#0B1B22]/45" />
                <span className="text-[calc(9.5px*var(--s))] font-medium text-[#475754]">Messages</span>
              </div>

              <div className="flex flex-col gap-[calc(6px*var(--s))] my-[calc(4px*var(--s))]">
                <div className="oh-mockup-step-1 w-fit max-w-[90%] rounded-full bg-[#E2E7E5] text-[#0B1B22] px-[calc(10px*var(--s))] py-[calc(4px*var(--s))] text-[calc(10.5px*var(--s))] font-medium">
                  Missed call
                </div>

                <div className="oh-mockup-step-2 ml-auto w-fit max-w-[92%] rounded-[calc(12px*var(--s))] rounded-br-xs bg-[#14735A] text-white px-[calc(10px*var(--s))] py-[calc(6px*var(--s))] text-[calc(10px*var(--s))] leading-snug">
                  Sorry we missed you, send your job details here.
                </div>

                <div className="oh-mockup-step-2 text-right text-[calc(9.5px*var(--s))] font-semibold text-[#14624F]">
                  Delivered
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tidy New Enquiry Card */}
          {tab.showEnquiryCard && (
            <div
              className={`oh-mockup-step-3 ${
                tab.showReplyFlow ? 'col-span-6' : 'col-span-12'
              } rounded-[calc(16px*var(--s))] bg-white border border-[#0B1B22]/10 p-[calc(12px*var(--s))] shadow-xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between gap-[calc(8px*var(--s))] pr-[calc(40px*var(--s))]">
                <span className="text-[calc(12px*var(--s))] font-semibold text-[#0B1B22]">New enquiry</span>
                {tab.showOwnerBell && (
                  <span className="w-[calc(24px*var(--s))] h-[calc(24px*var(--s))] rounded-full bg-[#E7F5EE] text-[#14735A] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[calc(14px*var(--s))] h-[calc(14px*var(--s))]">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[calc(8px*var(--s))] mt-[calc(8px*var(--s))]">
                {(['Job', 'Town', 'Photos'] as const).map((fieldLabel, rowIdx) => (
                  <div
                    key={fieldLabel}
                    className="flex items-center justify-between gap-[calc(8px*var(--s))] rounded-[calc(8px*var(--s))] bg-[#F5F7F6] px-[calc(10px*var(--s))] py-[calc(6px*var(--s))]"
                  >
                    <span className="text-[calc(10.5px*var(--s))] font-semibold text-[#475754] shrink-0">
                      {fieldLabel}
                    </span>
                    <span
                      className={`h-[calc(8px*var(--s))] rounded-full bg-[#14735A]/30 ${
                        rowIdx === 0 ? 'w-[calc(64px*var(--s))]' : rowIdx === 1 ? 'w-[calc(48px*var(--s))]' : 'w-[calc(56px*var(--s))]'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab.id === 'care' && (
        <div className="h-full rounded-[calc(18px*var(--s))] bg-white border border-[#0B1B22]/10 p-[calc(14px*var(--s))] shadow-xs flex flex-col justify-between">
          {/* Step 1: Report Title Bar + Chip */}
          <div className="oh-mockup-step-1 flex items-center justify-between gap-[calc(8px*var(--s))] pr-[calc(48px*var(--s))]">
            <div className="flex items-center gap-[calc(8px*var(--s))] min-w-0">
              <span className="w-[calc(24px*var(--s))] h-[calc(24px*var(--s))] rounded-[calc(8px*var(--s))] bg-[#E7F5EE] text-[#14735A] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[calc(14px*var(--s))] h-[calc(14px*var(--s))]">
                  <path d="M4 19h16M7 16V9M12 16V5M17 16v-4" />
                </svg>
              </span>
              <span className="h-[calc(10px*var(--s))] w-[calc(96px*var(--s))] rounded-full bg-[#0B1B22]/80" />
            </div>
            <span className="px-[calc(10px*var(--s))] py-[calc(4px*var(--s))] rounded-full bg-[#E7F5EE] text-[#0F4A3E] text-[calc(10.5px*var(--s))] font-semibold shrink-0">
              Monthly update
            </span>
          </div>

          {/* Step 2: Three Small Bar Groups (no axis numbers) */}
          <div className="oh-mockup-step-2 flex-1 flex items-end justify-around gap-[calc(16px*var(--s))] px-[calc(8px*var(--s))] py-[calc(10px*var(--s))] my-[calc(4px*var(--s))] rounded-[calc(12px*var(--s))] bg-[#F4F8F6] border border-[#0B1B22]/5">
            {[
              ['h-[calc(28px*var(--s))]', 'h-[calc(44px*var(--s))]'],
              ['h-[calc(40px*var(--s))]', 'h-[calc(56px*var(--s))]'],
              ['h-[calc(32px*var(--s))]', 'h-[calc(48px*var(--s))]'],
            ].map((pair, groupIdx) => (
              <div key={groupIdx} className="flex items-end gap-[calc(6px*var(--s))]">
                <div className={`w-[calc(14px*var(--s))] rounded-t-[calc(6px*var(--s))] bg-[#A8EBD3] ${pair[0]}`} />
                <div className={`w-[calc(14px*var(--s))] rounded-t-[calc(6px*var(--s))] bg-[#14735A] ${pair[1]}`} />
              </div>
            ))}
          </div>

          {/* Step 3: Two Skeleton Lines */}
          <div className="oh-mockup-step-3 flex flex-col gap-[calc(6px*var(--s))]">
            <div className="h-[calc(8px*var(--s))] w-4/5 rounded-full bg-[#475754]/25" />
            <div className="h-[calc(8px*var(--s))] w-3/5 rounded-full bg-[#475754]/18" />
          </div>
        </div>
      )}
    </div>
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
    const track = trackRef.current;
    if (!btn) return;
    const pad = track ? parseFloat(getComputedStyle(track).paddingLeft) || 4.25 : 4.25;
    setPillStyle({
      left: Math.max(0, btn.offsetLeft - pad),
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
  const { line1: headingLine1, line2: headingLine2 } = resolveHeadingLines();
  const subtitleText =
    config.compare?.subtitle?.trim() ||
    'Four parts of the job. What you send us, and what you get back.';

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

  const tickDelayClasses = [
    'oh-tick-seq-0',
    'oh-tick-seq-1',
    'oh-tick-seq-2',
  ];

  return (
    <section
      ref={sectionRef}
      id="compare"
      aria-label="What you send us and what you get back"
      style={{ '--s': 0.85 } as React.CSSProperties}
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
        @keyframes ohCompareRightTextIn {
          from { opacity: 0; transform: translate3d(24px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes ohCompareMockupStep {
          from { opacity: 0; transform: translate3d(0, 12px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes ohCompareTickFill {
          from { opacity: 0; transform: scale(0.65); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ohComparePinPing {
          0% { opacity: 0.7; transform: scale(0.7); }
          75%, 100% { opacity: 0; transform: scale(1.85); }
        }
        .oh-compare-arrow-desktop {
          animation: ohCompareArrowRight 4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
          will-change: transform;
        }
        .oh-compare-arrow-mobile {
          animation: ohCompareArrowDown 4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
          will-change: transform;
        }
        .oh-compare-right-enter {
          animation: ohCompareRightTextIn 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .oh-mockup-step-1 {
          animation: ohCompareMockupStep 380ms cubic-bezier(0.2, 0.8, 0.2, 1) 0ms both;
        }
        .oh-mockup-step-2 {
          animation: ohCompareMockupStep 380ms cubic-bezier(0.2, 0.8, 0.2, 1) 80ms both;
        }
        .oh-mockup-step-3 {
          animation: ohCompareMockupStep 380ms cubic-bezier(0.2, 0.8, 0.2, 1) 160ms both;
        }
        .oh-tick-seq-0 {
          animation: ohCompareTickFill 360ms cubic-bezier(0.2, 0.8, 0.2, 1) 0ms both;
        }
        .oh-tick-seq-1 {
          animation: ohCompareTickFill 360ms cubic-bezier(0.2, 0.8, 0.2, 1) 250ms both;
        }
        .oh-tick-seq-2 {
          animation: ohCompareTickFill 360ms cubic-bezier(0.2, 0.8, 0.2, 1) 500ms both;
        }
        .oh-compare-pin-ping {
          animation: ohComparePinPing 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
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
          .oh-compare-right-enter,
          .oh-mockup-step-1,
          .oh-mockup-step-2,
          .oh-mockup-step-3,
          .oh-tick-seq-0,
          .oh-tick-seq-1,
          .oh-tick-seq-2 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .oh-compare-pin-ping {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>

      <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-px)]">
        {/* 1. Centered Header */}
        <div className="text-center max-w-[780px] mx-auto mb-12 sm:mb-14">
          <h2 className="font-heading text-[length:var(--h2-size)] font-bold leading-[var(--h2-lh)] tracking-[-0.03em] text-[#0B1B22]">
            <span className="block">{headingLine1}</span>
            {headingLine2 && <span className="block">{headingLine2}</span>}
          </h2>

          <p className="mt-4 text-[length:var(--sub-size)] leading-[1.6] text-[#475754] max-w-[640px] mx-auto">
            {subtitleText}
          </p>
        </div>

        {/* 2. Pill Tab Bar */}
        <div className="w-full mx-auto mb-[calc(34px*var(--s))] sm:mb-[calc(40px*var(--s))]">
          <div
            ref={trackRef}
            role="tablist"
            aria-label="Deliverable stages"
            className={`relative h-[calc(70px*var(--s))] w-full rounded-full bg-[#F6F4F2] p-[calc(5px*var(--s))] flex min-[960px]:grid ${desktopGridColsClass} items-center overflow-x-auto min-[960px]:overflow-visible no-scrollbar snap-x snap-proximity`}
          >
            {/* Shared Sliding Dark Pill */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute top-[calc(5px*var(--s))] bottom-[calc(5px*var(--s))] left-[calc(5px*var(--s))] rounded-full shadow-[0_8px_20px_-6px_rgba(11,27,34,0.35)] ${
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
                  className={`relative z-10 h-full shrink-0 min-[960px]:shrink flex items-center justify-center gap-[calc(10px*var(--s))] sm:gap-[calc(12px*var(--s))] px-[calc(20px*var(--s))] min-[960px]:px-[calc(12px*var(--s))] rounded-full whitespace-nowrap snap-center cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#1E9E6A] focus-visible:outline-offset-[-2px] ${
                    isActive ? 'text-white' : 'text-[#0B1B22] hover:text-[#14624F]'
                  }`}
                >
                  <TabGlossyIcon kind={tab.icon} active={isActive} uid={uid} />
                  <span className="font-heading text-[calc(17px*var(--s))] sm:text-[calc(18px*var(--s))] min-[1180px]:text-[calc(22px*var(--s))] font-medium leading-none tracking-[-0.02em]">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Side-by-Side Equal-Height Input / Output Cards + Embossed Green-Tinted Arrow */}
        <div
          role="tabpanel"
          id={`${uid}-panel-${activeTab.id}`}
          aria-labelledby={`${uid}-tab-${activeTab.id}`}
          className="w-full mx-auto"
        >
          <div className="relative flex flex-col min-[1024px]:flex-row items-stretch gap-[calc(16px*var(--s))] min-[1024px]:gap-[calc(150px*var(--s))]">
            {/* LEFT CARD: What you send us */}
            <div className="relative z-10 flex-1 min-h-[calc(400px*var(--s))] rounded-[calc(32px*var(--s))] bg-[#F8F4EF] border border-[#0B1B22]/10 shadow-[0_14px_34px_-18px_rgba(11,27,34,0.14)] p-[calc(24px*var(--s))] sm:p-[calc(36px*var(--s))] flex flex-col justify-between gap-[calc(16px*var(--s))] sm:gap-[calc(20px*var(--s))]">
              <div className="flex flex-col gap-[calc(16px*var(--s))]">
                {/* Header Row: 40px*s Glossy Green Icon + Title */}
                <div className="flex items-center gap-[calc(14px*var(--s))]">
                  <GlossySendCircleIcon uid={uid} />
                  <h3 className="font-heading text-[calc(28px*var(--s))] sm:text-[calc(30px*var(--s))] font-semibold leading-[1.12] tracking-[-0.025em] text-[#0B1B22]">
                    You send us
                  </h3>
                </div>

                {/* Short Lead Line */}
                <p className="text-[calc(18px*var(--s))] sm:text-[calc(20px*var(--s))] leading-[1.35] text-[#475754]">
                  {activeTab.sendLead}
                </p>

                {/* 3-Row Sequential Checklist */}
                <ul className="flex flex-col gap-[calc(14px*var(--s))] list-none p-0 m-0 pt-[calc(4px*var(--s))]">
                  {activeTab.sendItems.slice(0, 3).map((item, idx) => {
                    const isPeach = item.tone === 'peach';
                    return (
                      <li
                        key={`${activeTab.id}-send-${idx}`}
                        className="flex items-center justify-between gap-[calc(14px*var(--s))] rounded-[calc(18px*var(--s))] bg-white/70 border border-[#0B1B22]/6 px-[calc(14px*var(--s))] py-[calc(12px*var(--s))]"
                      >
                        <div className="flex items-center gap-[calc(14px*var(--s))] min-w-0 flex-1">
                          <div
                            className={`w-[calc(44px*var(--s))] h-[calc(44px*var(--s))] rounded-[calc(13px*var(--s))] shrink-0 flex items-center justify-center ${
                              isPeach
                                ? 'bg-[#FBE6D8] text-[#9A4D22]'
                                : 'bg-[#DDF4EA] text-[#14624F]'
                            }`}
                          >
                            <ChecklistRowIcon kind={item.icon} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="font-heading text-[calc(18.5px*var(--s))] sm:text-[calc(20px*var(--s))] font-semibold leading-[1.2] text-[#0B1B22]">
                              {item.label}
                            </div>
                            <div className="text-[calc(16px*var(--s))] sm:text-[calc(17px*var(--s))] leading-[1.35] text-[#475754] mt-[calc(2px*var(--s))]">
                              {item.detail}
                            </div>
                          </div>
                        </div>

                        {/* Empty Round Tick -> Sequential Green Tick */}
                        <span
                          aria-hidden="true"
                          className="relative w-[calc(24px*var(--s))] h-[calc(24px*var(--s))] rounded-full border border-[#0B1B22]/18 bg-white shrink-0 flex items-center justify-center overflow-hidden"
                        >
                          <span
                            className={`absolute inset-0 rounded-full bg-[#1E9E6A] flex items-center justify-center ${tickDelayClasses[idx]}`}
                          >
                            <svg
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="#FFFFFF"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-[calc(14px*var(--s))] h-[calc(14px*var(--s))]"
                            >
                              <polyline points="3.5 8.5 6.5 11.5 12.5 5" />
                            </svg>
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Drop Zone Strip */}
              <div className="rounded-[calc(20px*var(--s))] border-[1.5px] border-dashed border-[#1E9E6A]/45 bg-[#E7F5EE]/75 px-[calc(16px*var(--s))] py-[calc(12px*var(--s))] flex flex-wrap sm:flex-nowrap items-center justify-between gap-[calc(12px*var(--s))]">
                <div className="flex items-center gap-[calc(12px*var(--s))] min-w-0 flex-1">
                  <span
                    aria-hidden="true"
                    className="w-[calc(36px*var(--s))] h-[calc(36px*var(--s))] rounded-full bg-[#D2EEE1] text-[#14624F] flex items-center justify-center shrink-0"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-[calc(16px*var(--s))] h-[calc(16px*var(--s))]"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </span>
                  <span className="text-[calc(15.5px*var(--s))] sm:text-[calc(16.5px*var(--s))] font-medium text-[#0F4A3E] leading-snug">
                    {activeTab.dropExample}
                  </span>
                </div>

                {/* 3 Tiny Placeholder Thumbnails (soft grey-green gradient squares with house/roof glyph) */}
                <div className="flex items-center gap-[calc(6px*var(--s))] shrink-0" aria-hidden="true">
                  {([0, 1, 2] as const).map((variant) => (
                    <div
                      key={variant}
                      className="w-[calc(36px*var(--s))] h-[calc(36px*var(--s))] rounded-[calc(10px*var(--s))] bg-gradient-to-br from-[#DCE8E1] to-[#C2D8CC] border border-[#14624F]/15 flex items-center justify-center"
                    >
                      <TradeThumbGlyph variant={variant} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* EMBOSSED SOFT GREEN-TINTED ARROW BETWEEN CARDS */}
            <div
              aria-hidden="true"
              className="pointer-events-none flex items-center justify-center my-[calc(-10px*var(--s))] min-[1024px]:my-0 min-[1024px]:absolute min-[1024px]:left-1/2 min-[1024px]:top-1/2 min-[1024px]:-translate-x-1/2 min-[1024px]:-translate-y-1/2 z-20"
            >
              <div className="hidden min-[1024px]:block oh-compare-arrow-desktop">
                <svg
                  width="148"
                  height="90"
                  viewBox="0 0 156 94"
                  fill="none"
                  className="w-[calc(148px*var(--s))] h-[calc(90px*var(--s))]"
                  style={{
                    filter: 'drop-shadow(6px 10px 16px rgba(15, 74, 62, 0.14))',
                  }}
                >
                  <defs>
                    <linearGradient id={`${uid}-arrow-d`} x1="0" y1="0" x2="148" y2="90" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FAFDFB" />
                      <stop offset="100%" stopColor="#D7EFE4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M8 38H104.5L80.5 14.5C76.7 10.8 76.7 4.7 80.4 1C84.1 -2.7 90.2 -2.7 93.9 1L141.2 47L93.9 93C90.2 96.7 84.1 96.7 80.4 93C76.7 89.3 76.7 83.2 80.5 79.5L104.5 56H8C3.6 56 2 52.4 2 48V46C2 41.6 3.6 38 8 38Z"
                    fill={`url(#${uid}-arrow-d)`}
                    stroke="#1E9E6A"
                    strokeOpacity="0.22"
                    strokeWidth="1.5"
                    transform="translate(4, 2) scale(0.94)"
                  />
                </svg>
              </div>

              <div className="min-[1024px]:hidden oh-compare-arrow-mobile">
                <svg
                  width="76"
                  height="52"
                  viewBox="0 0 154 94"
                  fill="none"
                  className="w-[calc(76px*var(--s))] h-[calc(52px*var(--s))]"
                  style={{
                    filter: 'drop-shadow(0 6px 12px rgba(15, 74, 62, 0.12))',
                  }}
                >
                  <defs>
                    <linearGradient id={`${uid}-arrow-m`} x1="0" y1="0" x2="148" y2="90" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FAFDFB" />
                      <stop offset="100%" stopColor="#D7EFE4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M8 38H102.5L78.5 14.5C74.7 10.8 74.7 4.7 78.4 1C82.1 -2.7 88.2 -2.7 91.9 1L139.2 47L91.9 93C88.2 96.7 82.1 96.7 78.4 93C74.7 89.3 74.7 83.2 78.5 79.5L102.5 56H8C3.6 56 0 52.4 0 48V46C0 41.6 3.6 38 8 38Z"
                    fill={`url(#${uid}-arrow-m)`}
                    stroke="#1E9E6A"
                    strokeOpacity="0.22"
                    strokeWidth="1.5"
                    transform="translate(4, 2) scale(0.94)"
                  />
                </svg>
              </div>
            </div>

            {/* RIGHT CARD: What you get back */}
            <div
              className="relative z-10 flex-1 min-h-[calc(400px*var(--s))] rounded-[calc(32px*var(--s))] p-[calc(24px*var(--s))] sm:p-[calc(36px*var(--s))] text-white overflow-hidden flex flex-col justify-between gap-[calc(16px*var(--s))] sm:gap-[calc(20px*var(--s))] shadow-[0_22px_48px_-20px_rgba(6,37,30,0.45)]"
              style={{
                background:
                  'radial-gradient(circle at 86% 12%, rgba(111, 214, 176, 0.22) 0%, transparent 45%), linear-gradient(135deg, #137057 0%, #0D4E3D 50%, #062B22 100%)',
              }}
            >
              <div className="flex flex-col gap-[calc(16px*var(--s))]">
                {/* Header Row: Open Hours Wordmark Left + 64px*s White Tile Right */}
                <div className="flex items-center justify-between gap-[calc(16px*var(--s))]">
                  <div className="h-[calc(40px*var(--s))] flex items-center min-w-0">
                    <Logo
                      variant="light"
                      size="lg"
                      className="[&>span]:text-[calc(32px*var(--s))] sm:[&>span]:text-[calc(38px*var(--s))] leading-none"
                    />
                  </div>

                  <div className="w-[calc(64px*var(--s))] h-[calc(64px*var(--s))] rounded-[calc(16px*var(--s))] bg-white shadow-[0_14px_30px_-8px_rgba(6,56,46,0.52)] flex items-center justify-center shrink-0">
                    <OpenHoursTileMark />
                  </div>
                </div>

                {/* Title, Headline & Supporting Line */}
                <div
                  key={`text-${activeTab.id}`}
                  className={hasSwitched ? 'oh-compare-right-enter' : ''}
                >
                  <div className="font-heading text-[calc(28px*var(--s))] sm:text-[calc(30px*var(--s))] font-semibold leading-[1.12] tracking-[-0.02em] text-white">
                    You get
                  </div>
                  <h3 className="font-heading text-[calc(25px*var(--s))] sm:text-[calc(27px*var(--s))] xl:text-[calc(29px*var(--s))] font-semibold leading-[1.18] tracking-[-0.025em] text-white mt-[calc(8px*var(--s))]">
                    {activeTab.headline}
                  </h3>
                  <p className="text-[calc(17.5px*var(--s))] sm:text-[calc(19px*var(--s))] leading-[1.35] text-white/85 mt-[calc(8px*var(--s))]">
                    {activeTab.support}
                  </p>
                </div>
              </div>

              {/* Mockup Panel (200-240px*s high, inline SVG/CSS only, 3-step assemble) */}
              <div key={`mockup-${activeTab.id}`}>
                <OutputMockupPanel tab={activeTab} />
              </div>

              {/* Bottom Proof Pill (fully visible, no clipping) */}
              <div>
                <span className="inline-flex items-center w-fit max-w-full rounded-full bg-white/14 border border-white/25 px-[calc(16px*var(--s))] py-[calc(6px*var(--s))] text-[calc(14.5px*var(--s))] font-medium text-white leading-snug">
                  {activeTab.proof}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
