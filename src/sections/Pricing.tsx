import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Tag,
  Check,
  ArrowRight,
  Minus,
  Plus,
  FileText,
  MessageCircle,
  MapPin,
  Layers,
  Star,
  BarChart3,
  Phone,
  Shield,
  Clock,
  Images,
  Globe,
  Target,
  Camera,
  Mic,
  Lock,
  LifeBuoy,
} from 'lucide-react';
import { config, PricingTierConfig, BuilderFeatureConfig, BuilderFeatureGroup } from '../config';

interface PricingProps {
  onOpenAudit?: () => void;
}

// Map config icon keys to Lucide icon components
function FeatureIcon({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
  switch (name) {
    case 'form':
      return <FileText className={className} />;
    case 'message':
      return <MessageCircle className={className} />;
    case 'map-pin':
      return <MapPin className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'bar-chart':
      return <BarChart3 className={className} />;
    case 'phone':
      return <Phone className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'clock':
      return <Clock className={className} />;
    case 'images':
      return <Images className={className} />;
    case 'file-text':
      return <FileText className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'target':
      return <Target className={className} />;
    case 'camera':
      return <Camera className={className} />;
    case 'mic':
      return <Mic className={className} />;
    case 'lock':
      return <Lock className={className} />;
    case 'life-buoy':
      return <LifeBuoy className={className} />;
    default:
      return <Check className={className} />;
  }
}

// Smooth animated number tween (~300ms) with prefers-reduced-motion fallback
function useAnimatedCount(targetValue: number, shouldReduceMotion: boolean): number {
  const [displayValue, setDisplayValue] = useState<number>(targetValue);
  const prevValueRef = useRef<number>(targetValue);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(targetValue);
      prevValueRef.current = targetValue;
      return;
    }

    const startVal = prevValueRef.current;
    const endVal = targetValue;
    if (startVal === endVal) return;

    const startTime = performance.now();
    const duration = 300;

    let frameId: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
        prevValueRef.current = endVal;
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue, shouldReduceMotion]);

  return displayValue;
}

export default function Pricing({ onOpenAudit }: PricingProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const pricingConfig = config.pricing;
  const builderConfig = config.builder;
  const liveRegionId = useId();

  // Scroll and prefill helper
  const handleSelectPackage = (packageName: string) => {
    const message = `I'm interested in the ${packageName} package.`;
    window.dispatchEvent(
      new CustomEvent('openhours:prefill-contact', {
        detail: { option: packageName, message },
      })
    );

    const contactSection = document.getElementById('about');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter tiers: explicitly exclude any free / 1-page offer tier
  const tiers: PricingTierConfig[] = (pricingConfig?.tiers || []).filter(
    (tier) => tier.id !== 'first' && !tier.name.toLowerCase().includes('1-page')
  );

  // ----------------------------------------------------
  // BUILDER LOGIC
  // ----------------------------------------------------
  const starterTierPrice =
    tiers.find((t) => t.id === 'starter')?.price ?? 790;
  const basePrice = builderConfig?.basePrice || starterTierPrice;

  // Filter visible features: price > 0 and flag is not disabled in config.features
  const visibleFeatures = (builderConfig?.features || []).filter((feat) => {
    if (!feat.price || feat.price <= 0) return false;
    if (feat.flag) {
      const flagValue = (config.features as unknown as Record<string, boolean | undefined>)?.[feat.flag];
      if (flagValue === false) return false;
    }
    return true;
  });

  const pricePerExtraPage = builderConfig?.pricePerExtraPage || 0;
  const hasBuilderContent =
    visibleFeatures.length > 0 || pricePerExtraPage > 0;

  // Stepper state
  const minPages = builderConfig?.minPages ?? 1;
  const maxPages = builderConfig?.maxPages ?? 15;
  const [pages, setPages] = useState<number>(builderConfig?.includedPages ?? 1);

  // Selected features state (set of IDs)
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(new Set());

  const toggleFeature = (id: string) => {
    setSelectedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Dev-only console warnings
  useEffect(() => {
    if (import.meta.env?.DEV) {
      if (basePrice < starterTierPrice) {
        console.warn(
          `[PricingBuilder] Default builder basePrice (€${basePrice}) is lower than Starter tier price (€${starterTierPrice}).`
        );
      }

      // (1) Check if selecting all features of a tier gives a custom total that differs from that tier's "from" price by > 15%
      const allConfigFeatures = builderConfig?.features || [];
      tiers.forEach((tier) => {
        const tierFeatures = allConfigFeatures.filter((f) =>
          f.includedInTiers?.includes(tier.id as 'starter' | 'standard' | 'growth')
        );
        const tierFeaturesCost = tierFeatures
          .filter((f) => f.billing === 'one-time')
          .reduce((sum, f) => sum + (f.price || 0), 0);
        const tierCustomTotal = basePrice + tierFeaturesCost;
        const diff = Math.abs(tierCustomTotal - tier.price);
        if (diff / tier.price > 0.15) {
          console.warn(
            `[PricingBuilder] Selecting all features for tier "${tier.name}" gives custom total €${tierCustomTotal}, which differs by more than 15% from package price €${tier.price}. Consider setting individual feature prices to align with package tiers.`
          );
        }
      });

      // (2) List every feature still at price 0
      const zeroPriceFeatures = allConfigFeatures
        .filter((f) => !f.price || f.price === 0)
        .map((f) => f.name);
      if (zeroPriceFeatures.length > 0) {
        console.warn(
          `[PricingBuilder] Features currently at price 0 (hidden from builder until owner sets price):`,
          zeroPriceFeatures
        );
      }
    }
  }, [basePrice, starterTierPrice, builderConfig, tiers]);

  // Calculations
  const includedPages = builderConfig?.includedPages ?? 1;
  const extraPages = Math.max(0, pages - includedPages);
  const pagesCost = extraPages * pricePerExtraPage;

  let oneTimeFeaturesCost = 0;
  let monthlyTotal = 0;
  const selectedFeatureNames: string[] = [];

  const selectedVisibleFeatures = visibleFeatures.filter((feat) =>
    selectedFeatureIds.has(feat.id)
  );

  visibleFeatures.forEach((feat) => {
    if (selectedFeatureIds.has(feat.id)) {
      selectedFeatureNames.push(feat.name);
      if (feat.billing === 'monthly') {
        monthlyTotal += feat.price;
      } else {
        oneTimeFeaturesCost += feat.price;
      }
    }
  });

  const oneTimeTotal = basePrice + pagesCost + oneTimeFeaturesCost;
  const animatedTotal = useAnimatedCount(oneTimeTotal, shouldReduceMotion);

  // Quick-start tiers with visible features
  const quickStartTiers = tiers.filter((t) =>
    visibleFeatures.some((f) =>
      f.includedInTiers?.includes(t.id as 'starter' | 'standard' | 'growth')
    )
  );

  // Package comparison hint: if selected features all appear in one of the tiers AND custom total > tier.price
  const comparisonTier = tiers.find((tier) => {
    if (selectedVisibleFeatures.length === 0) return false;
    const allInTier = selectedVisibleFeatures.every((f) =>
      f.includedInTiers?.includes(tier.id as 'starter' | 'standard' | 'growth')
    );
    return allInTier && oneTimeTotal > tier.price;
  });

  // Currency formatter
  const formatEuro = (amount: number) =>
    new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);

  // Request quote handler
  const handleRequestQuote = () => {
    const monthlySummary = monthlyTotal > 0 ? ` (+ €${monthlyTotal}/month)` : '';
    const featuresSummary =
      selectedFeatureNames.length > 0
        ? ` Features: ${selectedFeatureNames.join(', ')}.`
        : '';
    const summaryMessage = `Custom build estimate: €${oneTimeTotal} one-time${monthlySummary}. Pages: ${pages}.${featuresSummary}`;

    window.dispatchEvent(
      new CustomEvent('openhours:prefill-contact', {
        detail: { option: 'Custom build', message: summaryMessage },
      })
    );

    const contactSection = document.getElementById('about');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="pricing"
      className="w-full bg-[#EEF3F4] py-20 sm:py-28 md:py-32 overflow-visible scroll-mt-24"
    >
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-6 md:px-8">
        {/* ==================================================== */}
        {/* PART 1: THREE PACKAGE CARDS                          */}
        {/* ==================================================== */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          {pricingConfig?.pill && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-medium text-[#1E4A5C]">
              <Tag className="w-3.5 h-3.5" />
              <span>{pricingConfig.pill}</span>
            </div>
          )}

          <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-2xl mb-4">
            <span>{pricingConfig?.title || 'Simple pricing,'} </span>
            <span className="font-serif italic text-[#12303D]">
              {pricingConfig?.titleAccent || 'fixed in writing'}
            </span>
          </h2>

          {pricingConfig?.subtext && (
            <p className="text-[16px] sm:text-[18px] text-[#5E6F77] max-w-2xl">
              {pricingConfig.subtext}
            </p>
          )}
        </div>

        {/* Three Package Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-8 overflow-visible">
          {tiers.map((tier, idx) => {
            const isStandard = tier.id === 'standard' || tier.highlighted;

            return (
              <motion.article
                key={tier.id}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -4,
                        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                      }
                }
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative rounded-[24px] p-7 sm:p-8 flex flex-col justify-between overflow-visible transition-shadow duration-[220ms] ease-out bg-white ${
                  isStandard
                    ? 'border-2 border-[#E3B896] shadow-[0_18px_44px_rgba(30,74,92,0.14)]'
                    : 'border border-[#0F2A35]/[0.08] shadow-[0_12px_32px_rgba(15,42,53,0.06)]'
                }`}
              >
                {/* Standard Recommended Pill */}
                {isStandard && (
                  <div className="absolute -top-3.5 right-6 z-20 bg-[#E3B896] text-[#0F2A35] text-[12.5px] font-bold px-3.5 py-1 rounded-full shadow-xs whitespace-nowrap">
                    <span>{tier.tag || 'Recommended'}</span>
                  </div>
                )}

                <div>
                  {/* Package Name */}
                  <div className="flex items-center mb-2">
                    <h3 className="text-[26px] font-semibold tracking-[-0.02em] text-[#0F2A35]">
                      {tier.name}
                    </h3>
                  </div>

                  {/* One-line Description for who it suits */}
                  {tier.description && (
                    <p className="text-[15px] leading-[1.5] text-[#5E6F77] mb-5 min-h-[44px]">
                      {tier.description}
                    </p>
                  )}

                  {/* Price block: "from €{price}" */}
                  <div className="mb-4">
                    <span className="text-[13.5px] text-[#5E6F77] block mb-0.5 font-normal">
                      from
                    </span>
                    <div className="flex items-baseline">
                      <span className="text-[38px] sm:text-[42px] font-semibold tabular-nums text-[#0F2A35] leading-none">
                        {formatEuro(tier.price)}
                      </span>
                    </div>
                  </div>

                  {/* Delivery time: "About {n} working days" */}
                  {tier.days && (
                    <div className="flex items-center gap-2 mb-6 text-[14px] font-medium text-[#0F2A35]">
                      <Clock className="w-4 h-4 text-[#1E4A5C] shrink-0" />
                      <span>About {tier.days} working days</span>
                    </div>
                  )}

                  {/* Choose {Package} Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectPackage(tier.name)}
                    className="w-full h-[50px] rounded-full text-[15.5px] font-semibold flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] focus-visible:ring-offset-2 cursor-pointer bg-[#0F2A35] hover:bg-[#1A3D4C] text-white shadow-sm"
                  >
                    <span>Choose {tier.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Feature List (max 8 items) */}
                {tier.features && tier.features.length > 0 && (
                  <div className="mt-7 pt-6 border-t border-[rgba(15,42,53,0.08)] flex-1">
                    <ul className="space-y-3">
                      {tier.features.slice(0, 8).map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-3 text-[14.5px] leading-[1.45] text-[#1B1F27]"
                        >
                          <div className="w-[20px] h-[20px] rounded-full bg-[#DCE9EC] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-[#1E4A5C]" strokeWidth={2.5} />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>

        {/* Small print note under cards */}
        {pricingConfig?.smallPrint && (
          <div className="text-center text-[13px] text-[#5E6F77] mb-20 max-w-2xl mx-auto leading-relaxed">
            <p>{pricingConfig.smallPrint}</p>
          </div>
        )}

        {/* ==================================================== */}
        {/* PART 2: BUILDER ("Only pay for what you need")       */}
        {/* ==================================================== */}
        {hasBuilderContent && basePrice > 0 && (
          <div className="mt-16 sm:mt-24 pt-14 border-t border-[#0F2A35]/10">
            {/* Builder Heading */}
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-[28px] sm:text-[38px] font-normal tracking-[-0.02em] leading-tight text-[#0F2A35] mb-3">
                <span>Need something </span>
                <span className="font-serif italic text-[#12303D]">different?</span>
              </h3>
              <p className="text-[16px] sm:text-[17px] text-[#5E6F77] max-w-xl mx-auto">
                {builderConfig?.subtext ||
                  'Choose the pages and features you want. The estimate updates as you go.'}
              </p>
            </div>

            {/* Two Columns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Options (Pages Stepper + Feature Toggles) */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Pages Stepper */}
                <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#0F2A35]/[0.08] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[17px] font-semibold text-[#0F2A35] block">
                        How many pages?
                      </span>
                      <span className="text-[13px] text-[#5E6F77]">
                        {includedPages} page{includedPages > 1 ? 's' : ''} included in the base
                        price
                        {pricePerExtraPage > 0 ? `, then €${pricePerExtraPage} per extra page.` : '.'}
                      </span>
                    </div>

                    {/* Stepper Controls */}
                    <div className="inline-flex items-center gap-3 bg-[#EEF3F4] p-1.5 rounded-full self-start sm:self-auto border border-[#0F2A35]/[0.06]">
                      <button
                        type="button"
                        aria-label="Decrease page count"
                        disabled={pages <= minPages}
                        onClick={() => setPages((p) => Math.max(minPages, p - 1))}
                        className="w-9 h-9 rounded-full bg-white text-[#0F2A35] flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center font-bold text-[17px] tabular-nums text-[#0F2A35]">
                        {pages}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase page count"
                        disabled={pages >= maxPages}
                        onClick={() => setPages((p) => Math.min(maxPages, p + 1))}
                        className="w-9 h-9 rounded-full bg-white text-[#0F2A35] flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Typical page examples */}
                  {builderConfig?.pageExamples && builderConfig.pageExamples.length > 0 && (
                    <div className="pt-3 border-t border-[rgba(15,42,53,0.06)] text-[12.5px] text-[#5E6F77]">
                      <span className="font-medium text-[#0F2A35]">Typical pages: </span>
                      <span>{builderConfig.pageExamples.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* 2. Grouped Feature List */}
                {visibleFeatures.length > 0 && (
                  <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#0F2A35]/[0.08] shadow-xs">
                    {/* Header with Title and Select all / Clear all */}
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <h4 className="text-[16px] font-semibold text-[#0F2A35]">
                        Add features
                      </h4>
                      <div className="flex items-center gap-2.5 text-[12.5px]">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFeatureIds(
                              new Set(visibleFeatures.map((f) => f.id))
                            )
                          }
                          className="text-[#1E4A5C] hover:text-[#0F2A35] font-medium cursor-pointer transition-colors"
                        >
                          Select all
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setSelectedFeatureIds(new Set())}
                          className="text-[#5E6F77] hover:text-[#0F2A35] font-medium cursor-pointer transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>

                    {/* Quick-start chips (hidden if tier has no visible features) */}
                    {quickStartTiers.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-[rgba(15,42,53,0.06)]">
                        <span className="text-[12px] font-medium text-[#5E6F77]">
                          Quick start:
                        </span>
                        {quickStartTiers.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              const tierFeatIds = visibleFeatures
                                .filter((f) =>
                                  f.includedInTiers?.includes(
                                    t.id as 'starter' | 'standard' | 'growth'
                                  )
                                )
                                .map((f) => f.id);
                              setSelectedFeatureIds(new Set(tierFeatIds));
                            }}
                            className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#EEF3F4] text-[#0F2A35] hover:bg-[#DCE9EC] border border-[#0F2A35]/[0.06] transition-colors cursor-pointer"
                          >
                            Start from {t.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Grouped feature rows */}
                    <div className="space-y-6">
                      {(
                        [
                          'Website',
                          'Get found on Google',
                          'Handle enquiries',
                          'Ongoing',
                        ] as BuilderFeatureGroup[]
                      ).map((group) => {
                        const groupFeatures = visibleFeatures.filter(
                          (f) => f.group === group
                        );
                        if (groupFeatures.length === 0) return null;

                        return (
                          <div key={group}>
                            <h5 className="text-[12px] font-semibold text-[#5E6F77] uppercase tracking-wider mb-2.5">
                              {group}
                            </h5>
                            <div className="divide-y divide-[rgba(15,42,53,0.06)]">
                              {groupFeatures.map((feat) => {
                                const isSelected = selectedFeatureIds.has(feat.id);
                                const priceLabel =
                                  feat.billing === 'monthly'
                                    ? `+€${feat.price}/month`
                                    : `+€${feat.price}`;

                                return (
                                  <div
                                    key={feat.id}
                                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                                  >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                      {/* Round Icon */}
                                      <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                          isSelected
                                            ? 'bg-[#0F2A35] text-white'
                                            : 'bg-[#EEF3F4] text-[#5E6F77]'
                                        }`}
                                      >
                                        <FeatureIcon
                                          name={feat.icon}
                                          className="w-4 h-4"
                                        />
                                      </div>

                                      {/* Title, description & price */}
                                      <div className="min-w-0">
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                          <span className="font-semibold text-[15px] text-[#0F2A35] leading-snug">
                                            {feat.name}
                                          </span>
                                          <span className="text-[12.5px] font-semibold text-[#1E4A5C]">
                                            {priceLabel}
                                          </span>
                                        </div>
                                        {feat.description && (
                                          <p className="text-[12.5px] text-[#5E6F77] truncate block mt-0.5">
                                            {feat.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                      type="button"
                                      role="switch"
                                      aria-checked={isSelected}
                                      aria-label={`Toggle ${feat.name}`}
                                      onClick={() => toggleFeature(feat.id)}
                                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] ${
                                        isSelected
                                          ? 'bg-[#1E4A5C]'
                                          : 'bg-slate-200'
                                      }`}
                                    >
                                      <span
                                        aria-hidden="true"
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                          isSelected
                                            ? 'translate-x-5'
                                            : 'translate-x-0'
                                        }`}
                                      />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Sticky Estimate Card */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <div className="bg-[#F8FAFB] rounded-[24px] p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                  <div className="mb-4">
                    <h4 className="text-[20px] font-semibold text-[#0F2A35] leading-tight">
                      Your estimate
                    </h4>
                    <span className="text-[13px] text-[#5E6F77]">
                      {pages} page{pages > 1 ? 's' : ''}
                      {selectedFeatureIds.size > 0
                        ? ` + ${selectedFeatureIds.size} feature${selectedFeatureIds.size > 1 ? 's' : ''} selected`
                        : ' selected'}
                    </span>
                  </div>

                  {/* Live region for accessibility */}
                  <div id={liveRegionId} aria-live="polite" className="sr-only">
                    Estimated total: {formatEuro(oneTimeTotal)} one-time
                    {monthlyTotal > 0 ? ` plus ${formatEuro(monthlyTotal)} per month` : ''}
                  </div>

                  {/* Main One-Time Price Display */}
                  <div className="mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[40px] sm:text-[46px] font-bold tabular-nums text-[#0F2A35] leading-none tracking-tight">
                        €{animatedTotal}
                      </span>
                      <span className="text-[14px] text-[#5E6F77] font-normal">
                        one-time
                      </span>
                    </div>

                    {/* Breakdown line (hiding 0 parts) */}
                    <div className="text-[12.5px] text-[#5E6F77] mt-1.5 leading-snug">
                      <span>Base: €{basePrice}</span>
                      {pagesCost > 0 && <span> + Extra pages: €{pagesCost}</span>}
                      {oneTimeFeaturesCost > 0 && (
                        <span> + Features: €{oneTimeFeaturesCost}</span>
                      )}
                    </div>
                  </div>

                  {/* Monthly ongoing total if any monthly feature selected */}
                  {monthlyTotal > 0 && (
                    <div className="pt-2 pb-1 border-t border-[rgba(15,42,53,0.06)] mt-2.5">
                      <div className="flex items-baseline gap-2 text-[17px] font-semibold text-[#1E4A5C]">
                        <span>+ €{monthlyTotal}/month</span>
                        <span className="text-[12.5px] text-[#5E6F77] font-normal">
                          ongoing
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Estimate Note */}
                  {builderConfig?.estimateNote && (
                    <p className="text-[12.5px] text-[#5E6F77] leading-relaxed my-4">
                      {builderConfig.estimateNote}
                    </p>
                  )}

                  {/* Compact list of selected features under total (names only, max 6, then +N more) */}
                  {selectedFeatureNames.length > 0 && (
                    <div className="mb-4 pt-3 border-t border-[rgba(15,42,53,0.06)]">
                      <span className="text-[11.5px] font-semibold text-[#5E6F77] uppercase tracking-wider block mb-2">
                        Selected features:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedFeatureNames.slice(0, 6).map((name, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] bg-[#EEF3F4] text-[#0F2A35] font-medium"
                          >
                            {name}
                          </span>
                        ))}
                        {selectedFeatureNames.length > 6 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] bg-[#EEF3F4] text-[#5E6F77] font-medium">
                            +{selectedFeatureNames.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Package comparison hint: if selected features all appear in one of the tiers AND custom total > tier.price */}
                  {comparisonTier && (
                    <div className="mb-4 p-3 rounded-xl bg-white/80 border border-[#0F2A35]/[0.08] text-[12.5px] text-[#1E4A5C] leading-snug">
                      <span>
                        These features are all included in the {comparisonTier.name} package, from {formatEuro(comparisonTier.price)}.
                      </span>{' '}
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('pricing');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="font-semibold underline hover:text-[#0F2A35] cursor-pointer inline-flex items-center gap-0.5"
                      >
                        See {comparisonTier.name}
                      </button>
                    </div>
                  )}

                  {/* Request this quote CTA button */}
                  <button
                    type="button"
                    onClick={handleRequestQuote}
                    className="w-full h-[52px] rounded-full text-[16px] font-semibold flex items-center justify-center gap-2 bg-[#0F2A35] hover:bg-[#1A3D4C] text-white shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99] mb-4"
                  >
                    <span>Request this quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* "Always included" items */}
                  {builderConfig?.alwaysIncluded && builderConfig.alwaysIncluded.length > 0 && (
                    <div className="pt-4 border-t border-[rgba(15,42,53,0.08)]">
                      <span className="text-[12.5px] font-semibold text-[#0F2A35] uppercase tracking-wider block mb-2.5">
                        Always included:
                      </span>
                      <ul className="space-y-2">
                        {builderConfig.alwaysIncluded.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-[13px] text-[#1B1F27] leading-tight"
                          >
                            <Check className="w-4 h-4 text-[#1E4A5C] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Secondary question link */}
                  <div className="mt-5 pt-3 border-t border-[rgba(15,42,53,0.06)] text-center">
                    <a
                      href="#about"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('about');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[13px] text-[#1E4A5C] hover:text-[#0F2A35] hover:underline"
                    >
                      Not sure what you need? Talk to us and we&apos;ll tell you honestly.
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
