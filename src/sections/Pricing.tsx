import React, {
  useState,
  useEffect,
  useRef,
  useId,
  useMemo,
  useCallback,
  memo,
  lazy,
  Suspense,
} from 'react';
import {
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
  Calendar,
  Bell,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { config, PricingTierConfig, BuilderFeatureConfig, BuilderFeatureGroup } from '../config';
import { preloadSectionAndNext } from '../components/LazySection';

const PricingSalesModal = lazy(() => import('../components/PricingSalesModal'));

const EURO_FORMATTER = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

function formatEuroAmount(amount: number): string {
  return EURO_FORMATTER.format(amount);
}

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
    case 'calendar':
      return <Calendar className={className} />;
    case 'bell':
      return <Bell className={className} />;
    case 'refresh':
      return <RefreshCw className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
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

const AnimatedEuro = memo(function AnimatedEuro({
  value,
  shouldReduceMotion,
  className,
}: {
  value: number;
  shouldReduceMotion: boolean;
  className: string;
}) {
  const animated = useAnimatedCount(value, shouldReduceMotion);
  return <span className={className}>{formatEuroAmount(animated)}</span>;
});

const PricingTierCard = memo(function PricingTierCard({
  tier,
  onSelect,
}: {
  tier: PricingTierConfig;
  onSelect: (tier: PricingTierConfig) => void;
}) {
  const isStandard = tier.id === 'standard' || Boolean(tier.highlighted);
  const featuresMap = config.features as unknown as Record<string, boolean | number | undefined>;
  const visibleSetupItems = (tier.setupItems || []).filter(
    (item) => !item.flag || Boolean(featuresMap[item.flag])
  );
  const visibleMonthlyItems = (tier.monthlyItems || []).filter(
    (item) => !item.flag || Boolean(featuresMap[item.flag])
  );
  const showsAiAgent =
    visibleSetupItems.some((item) => item.aiDisclosure) ||
    visibleMonthlyItems.some((item) => item.aiDisclosure);
  const deliveryDays =
    typeof tier.deliveryDays === 'number' && tier.deliveryDays > 0 ? tier.deliveryDays : null;

  return (
    <article
      data-tier-id={tier.id}
      className={`relative rounded-[28px] p-7 sm:p-8 flex flex-col justify-between overflow-visible transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 bg-white ${
        isStandard
          ? 'order-first lg:order-none border-2 border-[#6FD6B0] ring-1 ring-[#14624F]/20 shadow-[0_20px_48px_-14px_rgba(20,98,79,0.18)]'
          : 'border border-[rgba(11,27,34,0.09)] shadow-[0_12px_32px_rgba(11,27,34,0.06)]'
      }`}
    >
      {isStandard && (
        <div className="absolute -top-3.5 right-6 z-20 bg-[#DDF4EA] text-[#0F4A3E] border border-[#14624F]/25 text-[12px] font-semibold px-3.5 py-1 rounded-full shadow-sm whitespace-nowrap">
          <span>{tier.tag || 'Recommended'}</span>
        </div>
      )}

      <div>
        <div className="flex items-center mb-2">
          <h3 className="text-[24px] sm:text-[26px] font-semibold tracking-[-0.02em] text-[#0B1B22]">
            {tier.name}
          </h3>
        </div>

        {(tier.outcome || tier.description) && (
          <p className="text-[15px] leading-[1.55] text-[#475754] mb-5 min-h-[68px]">
            {tier.outcome || tier.description}
          </p>
        )}

        <div className="mb-5">
          <span className="text-[13px] text-[#475754] block mb-0.5 font-normal">from</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[38px] sm:text-[42px] font-semibold tabular-nums text-[#0B1B22] leading-none">
              {formatEuroAmount(tier.price)}
            </span>
            <span className="text-[14.5px] font-medium text-[#475754]">set-up</span>
          </div>
          {typeof tier.monthlyPrice === 'number' && tier.monthlyPrice > 0 && (
            <div className="mt-1.5 text-[16px] font-semibold tabular-nums text-[#14624F]">
              + {formatEuroAmount(tier.monthlyPrice)} / month
            </div>
          )}
          {tier.priceNote && (
            <p className="mt-1.5 text-[12.5px] text-[#475754] leading-snug">{tier.priceNote}</p>
          )}
        </div>

        {deliveryDays !== null && (
          <div className="flex items-center gap-2 mb-6 text-[14px] font-medium text-[#0B1B22]">
            <Clock className="w-4 h-4 text-[#14624F] shrink-0" strokeWidth={1.5} />
            <span className="tabular-nums">About {deliveryDays} working days</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onSelect(tier)}
          className={`w-full h-[50px] rounded-full text-[15px] font-semibold flex items-center justify-center gap-2 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer px-4 ${
            isStandard
              ? 'oh-btn-primary text-white'
              : 'bg-[#050E0D] hover:bg-[#0F4A3E] text-white shadow-sm'
          }`}
        >
          <span className="truncate">Choose {tier.name}</span>
          <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
        </button>
      </div>

      {(visibleSetupItems.length > 0 || visibleMonthlyItems.length > 0) && (
        <div className="mt-7 pt-6 border-t border-[rgba(11,27,34,0.08)] flex-1 flex flex-col justify-between gap-5">
          <div className="space-y-5">
            {tier.everythingInLabel && (
              <p className="text-[13.5px] font-semibold text-[#14624F]">
                {tier.everythingInLabel}
              </p>
            )}

            {visibleSetupItems.length > 0 && (
              <div>
                <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#475754] mb-2.5">
                  Set-up
                </div>
                <ul className="space-y-2.5">
                  {visibleSetupItems.map((item, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-start gap-2.5 text-[14px] leading-[1.45] text-[#0B1B22]"
                    >
                      <div className="w-[18px] h-[18px] rounded-full bg-[#DDF4EA] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#14624F]" strokeWidth={2.5} />
                      </div>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {visibleMonthlyItems.length > 0 && (
              <div>
                <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#475754] mb-2.5">
                  Every month
                </div>
                <ul className="space-y-2.5">
                  {visibleMonthlyItems.map((item, mIdx) => (
                    <li
                      key={mIdx}
                      className="flex items-start gap-2.5 text-[14px] leading-[1.45] text-[#0B1B22]"
                    >
                      <div className="w-[18px] h-[18px] rounded-full bg-[#DDF4EA] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#14624F]" strokeWidth={2.5} />
                      </div>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {showsAiAgent && (
            <p className="pt-3 border-t border-[rgba(11,27,34,0.06)] text-[12px] text-[#475754] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#14624F] shrink-0" strokeWidth={1.75} />
              <span>The assistant always says it is an AI.</span>
            </p>
          )}
        </div>
      )}
    </article>
  );
});

const BuilderFeatureRow = memo(function BuilderFeatureRow({
  feat,
  isSelected,
  isInCurrentPackage,
  selectedTierName,
  onToggle,
}: {
  feat: BuilderFeatureConfig;
  isSelected: boolean;
  isInCurrentPackage: boolean;
  selectedTierName: string;
  onToggle: (id: string) => void;
}) {
  const priceLabel =
    (feat.price || 0) > 0
      ? feat.billing === 'monthly'
        ? `+${formatEuroAmount(feat.price)}/month`
        : `+${formatEuroAmount(feat.price)}`
      : 'Included in package';

  return (
    <label
      htmlFor={`feat-checkbox-${feat.id}`}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`p-3.5 sm:p-4 rounded-2xl border transition-[background-color,border-color] duration-150 flex items-start justify-between gap-4 cursor-pointer select-none ${
        isSelected
          ? 'bg-white border-[#14624F]/35 shadow-xs ring-1 ring-[#6FD6B0]/35'
          : 'bg-[#F9FAF9] hover:bg-white border-[rgba(11,27,34,0.07)] hover:border-[rgba(11,27,34,0.16)]'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <input
          type="checkbox"
          id={`feat-checkbox-${feat.id}`}
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggle(feat.id);
          }}
          aria-label={feat.name}
          className="mt-1 w-4 h-4 rounded border-[rgba(11,27,34,0.28)] accent-[#14624F] cursor-pointer"
        />

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
            isSelected ? 'bg-[#14624F] text-white shadow-xs' : 'bg-[#F3F5F3] text-[#475754]'
          }`}
        >
          <FeatureIcon name={feat.icon} className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[14.5px] sm:text-[15px] text-[#0B1B22] leading-snug">
              {feat.name}
            </span>
            {isInCurrentPackage && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#DDF4EA] text-[#0F4A3E] whitespace-nowrap">
                In {selectedTierName}
              </span>
            )}
          </div>
          {feat.description && (
            <p className="text-[12.5px] text-[#475754] mt-0.5 leading-relaxed">
              {feat.description}
            </p>
          )}
        </div>
      </div>

      <div className="text-right shrink-0 pt-0.5 pl-2">
        <span className="font-semibold text-[13px] sm:text-[13.5px] text-[#0B1B22] block tabular-nums">
          {priceLabel}
        </span>
        <span className="text-[11px] text-[#475754]">
          {feat.billing === 'monthly' ? 'monthly' : 'one-time'}
        </span>
      </div>
    </label>
  );
});

export default function Pricing({ onOpenAudit: _onOpenAudit }: PricingProps) {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const pricingConfig = config.pricing;
  const builderConfig = config.builder;
  const liveRegionId = useId();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Scroll and prefill helper
  const handleSelectPackage = useCallback((tier: PricingTierConfig) => {
    const monthlyPart =
      typeof tier.monthlyPrice === 'number' && tier.monthlyPrice > 0
        ? ` + €${tier.monthlyPrice}/month`
        : '';
    const detail = {
      option: tier.name,
      message: `I'm interested in the ${tier.name} package (from €${tier.price.toLocaleString('en-IE')}${monthlyPart}).`,
    };
    (window as Window & { __ohPendingContactPrefill?: unknown }).__ohPendingContactPrefill = detail;
    preloadSectionAndNext('contact', 'faq');
    window.dispatchEvent(new CustomEvent('openhours:prefill-contact', { detail }));

    const contactSection =
      document.getElementById('contact') || document.getElementById('about');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Filter tiers: explicitly exclude any free / 1-page offer tier
  const tiers: PricingTierConfig[] = (pricingConfig?.tiers || []).filter(
    (tier) => tier.id !== 'first' && !tier.name.toLowerCase().includes('1-page')
  );

  // ----------------------------------------------------
  // BUILDER LOGIC (PASS C)
  // ----------------------------------------------------
  type StartingPackage = 'starter' | 'standard' | 'growth' | 'scratch';

  const starterTierPrice =
    tiers.find((t) => t.id === 'starter')?.price ?? 790;
  const basePrice = builderConfig?.basePrice || starterTierPrice;
  const includedPages = builderConfig?.includedPages ?? 1;
  const pricePerExtraPage = builderConfig?.pricePerExtraPage || 0;

  // Filter visible features: take price from config only.
  // Hide if no price / price 0 AND not part of a package. Respect feature flags.
  const visibleFeatures = useMemo(() => {
    return (builderConfig?.features || []).filter((feat) => {
      if (feat.flag) {
        const flagValue = (config.features as unknown as Record<string, boolean | undefined>)?.[feat.flag];
        if (flagValue === false) return false;
      }
      const hasPrice = typeof feat.price === 'number' && feat.price > 0;
      const isPartOfPackage = Array.isArray(feat.includedInTiers) && feat.includedInTiers.length > 0;
      if (!hasPrice && !isPartOfPackage) {
        return false;
      }
      return true;
    });
  }, [builderConfig]);

  const hasBuilderContent = visibleFeatures.length > 0 || pricePerExtraPage > 0;

  // Stepper state
  const minPages = builderConfig?.minPages ?? 1;
  const maxPages = builderConfig?.maxPages ?? 15;
  const [pages, setPages] = useState<number>(includedPages);

  // Package selector state: 'starter' | 'standard' | 'growth' | 'scratch'
  const [selectedPackage, setSelectedPackage] = useState<StartingPackage>('standard');

  const selectedTierName =
    selectedPackage === 'scratch'
      ? 'Start from scratch'
      : tiers.find((t) => t.id === selectedPackage)?.name ?? selectedPackage;

  // Pre-tick features for the starting package
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(() => {
    const initialPkg = 'standard';
    const initialIds = (builderConfig?.features || [])
      .filter((f) => {
        if (f.flag) {
          const flagValue = (config.features as unknown as Record<string, boolean | undefined>)?.[f.flag];
          if (flagValue === false) return false;
        }
        const hasPrice = typeof f.price === 'number' && f.price > 0;
        const isPartOfPackage = Array.isArray(f.includedInTiers) && f.includedInTiers.length > 0;
        if (!hasPrice && !isPartOfPackage) return false;
        return f.includedInTiers?.includes(initialPkg);
      })
      .map((f) => f.id);
    return new Set(initialIds);
  });

  // Package tab selector handler (never scrolls, never changes URL, purely updates builder selection)
  const handleSelectStartingPackage = (pkg: StartingPackage) => {
    setSelectedPackage(pkg);
    if (pkg === 'scratch') {
      setSelectedFeatureIds(new Set());
    } else {
      const tierFeatIds = visibleFeatures
        .filter((f) => f.includedInTiers?.includes(pkg))
        .map((f) => f.id);
      setSelectedFeatureIds(new Set(tierFeatIds));
    }
  };

  // Toggle individual feature freely
  const toggleFeature = useCallback((id: string) => {
    setSelectedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const formatEuro = useCallback((amount: number) => formatEuroAmount(amount), []);

  // Dev-only console warnings: warn if set-up or monthly sum for any package is outside 105% to 120%
  useEffect(() => {
    if (import.meta.env?.DEV) {
      const allConfigFeatures = builderConfig?.features || [];
      tiers.forEach((tier) => {
        const tierFeatures = allConfigFeatures.filter((f) =>
          f.includedInTiers?.includes(tier.id as 'starter' | 'standard' | 'growth')
        );
        const tierSetupFeaturesCost = tierFeatures
          .filter((f) => f.billing === 'one-time')
          .reduce((sum, f) => sum + (f.price || 0), 0);
        const tierCustomSetupTotal = basePrice + tierSetupFeaturesCost;
        const setupRatio = tierCustomSetupTotal / tier.price;

        if (setupRatio < 1.05 || setupRatio > 1.20) {
          console.warn(
            `[PricingBuilder] Selecting all set-up features for "${tier.name}" gives €${tierCustomSetupTotal} (${Math.round(setupRatio * 100)}% of €${tier.price}), which is outside the 105% to 120% target range.`
          );
        }

        const tierMonthlyTotal = tierFeatures
          .filter((f) => f.billing === 'monthly')
          .reduce((sum, f) => sum + (f.price || 0), 0);
        if (tier.monthlyPrice > 0) {
          const monthlyRatio = tierMonthlyTotal / tier.monthlyPrice;
          if (monthlyRatio < 1.05 || monthlyRatio > 1.20) {
            console.warn(
              `[PricingBuilder] Selecting all monthly features for "${tier.name}" gives €${tierMonthlyTotal}/mo (${Math.round(monthlyRatio * 100)}% of €${tier.monthlyPrice}/mo), which is outside the 105% to 120% target range.`
            );
          }
        }
      });

      const zeroPriceFeatures = allConfigFeatures
        .filter((f) => !f.price || f.price === 0)
        .map((f) => f.name);
      if (zeroPriceFeatures.length > 0) {
        console.warn(
          `[PricingBuilder] Features currently at price 0 (hidden from builder unless included in a package):`,
          zeroPriceFeatures
        );
      }
    }
  }, [basePrice, builderConfig, tiers]);

  // Price calculations with useMemo:
  // One-time total = base website price + max(0, pages - includedPages) * pricePerExtraPage + sum of selected one-time features.
  // Monthly total = sum of selected monthly features.
  const {
    oneTimeTotal,
    monthlyTotal,
    oneTimeFeaturesCost,
    pagesCost,
    selectedVisibleFeatures,
    selectedFeatureNames,
  } = useMemo(() => {
    const extraPages = Math.max(0, pages - includedPages);
    const pCost = extraPages * pricePerExtraPage;

    let oneTimeCost = 0;
    let mTotal = 0;
    const feats: typeof visibleFeatures = [];
    const names: string[] = [];

    visibleFeatures.forEach((feat) => {
      if (selectedFeatureIds.has(feat.id)) {
        feats.push(feat);
        names.push(feat.name);
        if (feat.billing === 'monthly') {
          mTotal += feat.price || 0;
        } else {
          oneTimeCost += feat.price || 0;
        }
      }
    });

    const total = basePrice + pCost + oneTimeCost;

    return {
      oneTimeTotal: total,
      monthlyTotal: mTotal,
      oneTimeFeaturesCost: oneTimeCost,
      pagesCost: pCost,
      selectedVisibleFeatures: feats,
      selectedFeatureNames: names,
    };
  }, [pages, includedPages, pricePerExtraPage, visibleFeatures, selectedFeatureIds, basePrice]);

  const hasVoiceAgentSelected = selectedFeatureIds.has('voiceAgent');

  // "TRY A PACKAGE" LIVE RECOMMENDATION IN ESTIMATE CARD (dynamic set-up & monthly comparison)
  const packageComparison = useMemo(() => {
    const selectedCount = selectedVisibleFeatures.length;
    if (selectedCount === 0) return null;

    interface TierMatch {
      tier: PricingTierConfig;
      includedCount: number;
      effectiveSetupPrice: number;
      effectiveMonthlyPrice: number;
      isFullMatch: boolean;
    }

    const matches: TierMatch[] = [];

    tiers.forEach((tier) => {
      const tierFeats = visibleFeatures.filter((f) =>
        f.includedInTiers?.includes(tier.id as 'starter' | 'standard' | 'growth')
      );
      const tierFeatIdSet = new Set(tierFeats.map((f) => f.id));

      let matchCount = 0;
      selectedVisibleFeatures.forEach((f) => {
        if (tierFeatIdSet.has(f.id)) {
          matchCount++;
        }
      });

      const tierIncludedPages = (tier as unknown as { includedPages?: number }).includedPages;
      const extraPagesForTier =
        typeof tierIncludedPages === 'number' ? Math.max(0, pages - tierIncludedPages) : 0;
      const effectiveSetupPrice =
        tier.price + (pricePerExtraPage > 0 ? extraPagesForTier * pricePerExtraPage : 0);

      matches.push({
        tier,
        includedCount: matchCount,
        effectiveSetupPrice,
        effectiveMonthlyPrice: tier.monthlyPrice,
        isFullMatch: matchCount === selectedCount,
      });
    });

    // Case 1: One or more packages include ALL selected features -> pick the cheapest
    const fullMatches = matches
      .filter((m) => m.isFullMatch)
      .sort(
        (a, b) =>
          a.effectiveSetupPrice - b.effectiveSetupPrice ||
          a.effectiveMonthlyPrice - b.effectiveMonthlyPrice
      );

    if (fullMatches.length > 0) {
      const best = fullMatches[0];
      const setupDiff = oneTimeTotal - best.effectiveSetupPrice;
      const monthlyDiff = monthlyTotal - best.effectiveMonthlyPrice;

      // Never show zero or negative differences; if neither is lower, show nothing
      if (setupDiff <= 0 && monthlyDiff <= 0) {
        return null;
      }

      let comparisonClause = '';
      if (setupDiff > 0 && monthlyDiff > 0) {
        comparisonClause = `That is ${formatEuro(setupDiff)} less set-up and ${formatEuro(
          monthlyDiff
        )} less per month than this custom build.`;
      } else if (setupDiff > 0) {
        comparisonClause = `That is ${formatEuro(setupDiff)} less set-up than this custom build.`;
      } else {
        comparisonClause = `That is ${formatEuro(monthlyDiff)} less per month than this custom build.`;
      }

      return {
        type: 'full-saving' as const,
        tier: best.tier,
        text: `Everything you selected is included in ${best.tier.name}, from ${formatEuro(
          best.effectiveSetupPrice
        )} plus ${formatEuro(best.effectiveMonthlyPrice)} a month. ${comparisonClause}`,
      };
    }

    // Case 2: No package covers everything, check if any covers at least half
    const halfThreshold = Math.ceil(selectedCount / 2);
    const partialMatches = matches
      .filter((m) => m.includedCount >= halfThreshold && m.includedCount > 0)
      .sort((a, b) => {
        if (b.includedCount !== a.includedCount) {
          return b.includedCount - a.includedCount;
        }
        return a.effectiveSetupPrice - b.effectiveSetupPrice;
      });

    if (partialMatches.length > 0) {
      const best = partialMatches[0];
      return {
        type: 'partial-match' as const,
        tier: best.tier,
        text: `${best.includedCount} of your ${selectedCount} selected features are already in ${best.tier.name}. Compare it before you request.`,
      };
    }

    return null;
  }, [
    selectedVisibleFeatures,
    tiers,
    visibleFeatures,
    pages,
    pricePerExtraPage,
    oneTimeTotal,
    monthlyTotal,
    formatEuro,
  ]);

  // ----------------------------------------------------
  // "TALK TO SALES" LAZY MODAL TRIGGER STATE
  // ----------------------------------------------------
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [initialSummaryMessage, setInitialSummaryMessage] = useState('');

  const desktopSalesButtonRef = useRef<HTMLButtonElement>(null);
  const mobileSalesButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const generateSummaryText = () => {
    const pkgName =
      selectedPackage === 'scratch' ? 'Started from scratch' : selectedTierName;

    const featureItems = selectedVisibleFeatures.map(
      (f) =>
        `- ${f.name} (${
          f.price > 0
            ? f.billing === 'monthly'
              ? `+${formatEuro(f.price)}/month`
              : `+${formatEuro(f.price)}`
            : 'Included in package'
        } · ${f.billing === 'monthly' ? 'monthly' : 'one-time'})`
    );

    const lines = [
      `Your custom package summary:`,
      `Starting package: ${pkgName}`,
      `Number of pages: ${pages}`,
      featureItems.length > 0
        ? `Selected features:\n${featureItems.join('\n')}`
        : 'Selected features: None',
      `One-time total: ${formatEuro(oneTimeTotal)}`,
      `Per month total: ${formatEuro(monthlyTotal)} / month`,
      hasVoiceAgentSelected ? 'Voice call costs are charged separately.' : '',
      builderConfig?.estimateNote ? `Estimate note: ${builderConfig.estimateNote}` : '',
    ].filter(Boolean);

    return lines.join('\n\n');
  };

  const handleOpenSalesModal = () => {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setInitialSummaryMessage(generateSummaryText());
    setIsSalesModalOpen(true);
  };

  const handleCloseSalesModal = useCallback(() => {
    setIsSalesModalOpen(false);
    window.requestAnimationFrame(() => {
      lastFocusedRef.current?.focus({ preventScroll: true });
    });
  }, []);

  return (
    <section
      id="pricing"
      className="oh-cv-auto w-full bg-[#F3F5F3] text-[#0B1B22] py-[var(--section-py)] overflow-visible"
    >
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ==================================================== */}
        {/* PART 1: THREE PACKAGE CARDS                          */}
        {/* ==================================================== */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <h2 className="text-[34px] sm:text-[46px] md:text-[56px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0B1B22] max-w-2xl mb-4">
            <span>{pricingConfig?.title || 'Simple pricing,'} </span>
            <span className="font-serif italic text-[#14624F]">
              {pricingConfig?.titleAccent || 'fixed in writing'}
            </span>
          </h2>

          {pricingConfig?.subtext && (
            <p className="text-[16px] sm:text-[18px] text-[#475754] max-w-2xl">
              {pricingConfig.subtext}
            </p>
          )}
        </div>

        {/* Three Package Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-8 overflow-visible">
          {tiers.map((tier) => (
            <PricingTierCard key={tier.id} tier={tier} onSelect={handleSelectPackage} />
          ))}
        </div>

        {/* Estimate and optional notes below the three cards */}
        {(pricingConfig?.estimateNote ||
          pricingConfig?.termNote ||
          pricingConfig?.vatNote ||
          pricingConfig?.deliveryNote ||
          pricingConfig?.smallPrint) && (
          <div className="text-center text-[13px] text-[#475754] mb-20 max-w-2xl mx-auto space-y-1.5 leading-relaxed">
            {pricingConfig?.estimateNote && <p>{pricingConfig.estimateNote}</p>}
            {pricingConfig?.termNote && <p>{pricingConfig.termNote}</p>}
            {pricingConfig?.vatNote && <p>{pricingConfig.vatNote}</p>}
            {pricingConfig?.deliveryNote && <p>{pricingConfig.deliveryNote}</p>}
            {pricingConfig?.smallPrint && <p>{pricingConfig.smallPrint}</p>}
          </div>
        )}

        {/* ==================================================== */}
        {/* PART 2: BUILDER ("Need something different?")        */}
        {/* ==================================================== */}
        {hasBuilderContent && basePrice > 0 && (
          <div className="mt-16 sm:mt-24 pt-14 border-t border-[rgba(11,27,34,0.1)]">
            {/* Builder Heading */}
            <div className="text-center mb-10 sm:mb-14">
              <h3 className="text-[28px] sm:text-[38px] font-normal tracking-[-0.02em] leading-tight text-[#0B1B22] mb-3">
                <span>Need something </span>
                <span className="font-serif italic text-[#14624F]">different?</span>
              </h3>
              <p className="text-[16px] sm:text-[17px] text-[#475754] max-w-xl mx-auto">
                {builderConfig?.subtext ||
                  'Start from a package and customise each feature. The estimate updates as you go.'}
              </p>
            </div>

            {/* 1. PACKAGE SELECTOR: Segmented tabs for the three packages + Start from scratch */}
            <div className="max-w-3xl mx-auto mb-10">
              <span className="text-[12.5px] font-semibold text-[#475754] uppercase tracking-wider block text-center mb-2.5">
                Start from a package:
              </span>
              <div
                className="bg-[#E9ECEA] p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1.5 border border-[rgba(11,27,34,0.08)]"
                role="tablist"
                aria-label="Starting package selector"
              >
                {[
                  ...tiers.map((tier) => ({
                    id: tier.id as StartingPackage,
                    label: tier.name,
                  })),
                  { id: 'scratch' as const, label: 'Start from scratch' },
                ].map((tab) => {
                  const isActive = selectedPackage === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectStartingPackage(tab.id);
                      }}
                      className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-[13px] sm:text-[13.5px] font-semibold transition-all duration-150 cursor-pointer text-center leading-tight ${
                        isActive
                          ? 'bg-white text-[#0F4A3E] shadow-xs'
                          : 'text-[#475754] hover:text-[#0B1B22] hover:bg-white/60'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Two Columns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Options (Pages Stepper + Feature Toggles) */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Pages Stepper */}
                <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[rgba(11,27,34,0.09)] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[17px] font-semibold text-[#0B1B22] block">
                        How many pages?
                      </span>
                      <span className="text-[13px] text-[#475754]">
                        {includedPages} page{includedPages > 1 ? 's' : ''} included in base build
                        {pricePerExtraPage > 0 ? `, then €${pricePerExtraPage} per extra page.` : '.'}
                      </span>
                    </div>

                    {/* Stepper Controls */}
                    <div className="inline-flex items-center gap-3 bg-[#F3F5F3] p-1.5 rounded-full self-start sm:self-auto border border-[rgba(11,27,34,0.08)]">
                      <button
                        type="button"
                        aria-label="Decrease page count"
                        disabled={pages <= minPages}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPages((p) => Math.max(minPages, p - 1));
                        }}
                        className="w-9 h-9 rounded-full bg-white text-[#0B1B22] flex items-center justify-center hover:bg-[#DDF4EA] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center font-bold text-[17px] tabular-nums text-[#0B1B22]">
                        {pages}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase page count"
                        disabled={pages >= maxPages}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPages((p) => Math.min(maxPages, p + 1));
                        }}
                        className="w-9 h-9 rounded-full bg-white text-[#0B1B22] flex items-center justify-center hover:bg-[#DDF4EA] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Typical page examples */}
                  {builderConfig?.pageExamples && builderConfig.pageExamples.length > 0 && (
                    <div className="pt-3 border-t border-[rgba(11,27,34,0.07)] text-[12.5px] text-[#475754]">
                      <span className="font-medium text-[#0B1B22]">Typical pages: </span>
                      <span>{builderConfig.pageExamples.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* 2. Grouped Feature List */}
                {visibleFeatures.length > 0 && (
                  <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[rgba(11,27,34,0.09)] shadow-xs min-h-[460px]">
                    {/* Header with Title and Select all / Clear all */}
                    <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-[rgba(11,27,34,0.07)]">
                      <div>
                        <h4 className="text-[17px] font-semibold text-[#0B1B22]">
                          Features
                        </h4>
                        <span className="text-[12.5px] text-[#475754]">
                          Include or exclude any feature to match your exact brief.
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[12.5px] shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedFeatureIds(
                              new Set(visibleFeatures.map((f) => f.id))
                            );
                          }}
                          className="text-[#14624F] hover:text-[#0F4A3E] font-medium cursor-pointer transition-colors"
                        >
                          Select all
                        </button>
                        <span aria-hidden="true" className="text-[#0B1B22]/30">|</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedFeatureIds(new Set());
                          }}
                          className="text-[#475754] hover:text-[#0B1B22] font-medium cursor-pointer transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>

                    {/* Grouped feature rows */}
                    <div className="space-y-7">
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
                            <h5 className="text-[12px] font-semibold text-[#475754] uppercase tracking-wider mb-3">
                              {group}
                            </h5>
                            <div className="space-y-2.5">
                              {groupFeatures.map((feat) => {
                                const isSelected = selectedFeatureIds.has(feat.id);
                                const isInCurrentPackage =
                                  selectedPackage !== 'scratch' &&
                                  Boolean(feat.includedInTiers?.includes(selectedPackage));

                                return (
                                  <BuilderFeatureRow
                                    key={feat.id}
                                    feat={feat}
                                    isSelected={isSelected}
                                    isInCurrentPackage={isInCurrentPackage}
                                    selectedTierName={selectedTierName}
                                    onToggle={toggleFeature}
                                  />
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

              {/* RIGHT COLUMN: Sticky Estimate Card on Desktop */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[rgba(11,27,34,0.09)] shadow-[0_14px_36px_-12px_rgba(11,27,34,0.12)]">
                  <div className="mb-4">
                    <h4 className="text-[20px] font-semibold text-[#0B1B22] leading-tight">
                      Your estimate
                    </h4>
                    <span className="text-[13px] text-[#475754]">
                      {pages} page{pages > 1 ? 's' : ''}
                      {selectedFeatureIds.size > 0
                        ? ` · ${selectedFeatureIds.size} feature${selectedFeatureIds.size > 1 ? 's' : ''} selected`
                        : ' · No features selected'}
                    </span>
                  </div>

                  {/* Live region for screen readers */}
                  <div id={liveRegionId} aria-live="polite" className="sr-only">
                    Estimated total: {formatEuro(oneTimeTotal)} one-time and {formatEuro(monthlyTotal)} per month.
                    {hasVoiceAgentSelected ? ' Voice call costs are charged separately.' : ''}
                  </div>

                  {/* Separate One-time and Per month Totals */}
                  <div className="mb-3">
                    <div className="grid grid-cols-2 gap-4 items-end pb-3 border-b border-[rgba(11,27,34,0.08)]">
                      <div>
                        <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#475754] block mb-1">
                          One-time
                        </span>
                        <AnimatedEuro
                          value={oneTimeTotal}
                          shouldReduceMotion={shouldReduceMotion}
                          className="text-[34px] sm:text-[40px] font-bold tabular-nums text-[#0B1B22] leading-none tracking-tight block"
                        />
                      </div>
                      <div className="pl-4 border-l border-[rgba(11,27,34,0.08)]">
                        <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#475754] block mb-1">
                          Per month
                        </span>
                        <AnimatedEuro
                          value={monthlyTotal}
                          shouldReduceMotion={shouldReduceMotion}
                          className="text-[26px] sm:text-[30px] font-bold tabular-nums text-[#14624F] leading-none tracking-tight block"
                        />
                      </div>
                    </div>

                    {/* Cost Breakdown Line */}
                    <div className="text-[12.5px] text-[#475754] mt-2.5 leading-relaxed">
                      <span>Base website: {formatEuro(basePrice)}</span>
                      {pagesCost > 0 && <span> + Extra pages: {formatEuro(pagesCost)}</span>}
                      {oneTimeFeaturesCost > 0 && (
                        <span> + Features: {formatEuro(oneTimeFeaturesCost)}</span>
                      )}
                    </div>

                    {hasVoiceAgentSelected && (
                      <p className="mt-2 text-[12px] text-[#475754] flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#14624F] shrink-0" />
                        <span>Voice call costs are charged separately.</span>
                      </p>
                    )}

                    {/* Try a package recommendation line */}
                    {packageComparison && (
                      <div className="mt-3 p-3 rounded-2xl bg-[#DDF4EA]/70 border border-[#14624F]/20 text-[12.5px] text-[#0B1B22] flex items-start gap-2.5 leading-snug">
                        <Info className="w-4 h-4 text-[#14624F] shrink-0 mt-0.5" />
                        <div>
                          <span>{packageComparison.text} </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectStartingPackage(packageComparison.tier.id as StartingPackage);
                            }}
                            className="font-semibold text-[#14624F] hover:text-[#0F4A3E] underline underline-offset-2 ml-1 cursor-pointer transition-colors"
                          >
                            View {packageComparison.tier.name}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Estimate Note from config (plain trade language, no savings claims) */}
                  {builderConfig?.estimateNote && (
                    <p className="text-[12.5px] text-[#475754] leading-relaxed my-4">
                      {builderConfig.estimateNote}
                    </p>
                  )}

                  {/* Selected Features Pill Tags */}
                  {selectedFeatureNames.length > 0 && (
                    <div className="mb-5 pt-3 border-t border-[rgba(11,27,34,0.08)]">
                      <span className="text-[11.5px] font-semibold text-[#475754] uppercase tracking-wider block mb-2">
                        Selected features ({selectedFeatureNames.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedFeatureNames.slice(0, 6).map((name, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] bg-[#F3F5F3] text-[#0B1B22] font-medium"
                          >
                            {name}
                          </span>
                        ))}
                        {selectedFeatureNames.length > 6 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] bg-[#F3F5F3] text-[#475754] font-medium">
                            +{selectedFeatureNames.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* "Talk to Sales" Button (disabled if nothing selected) */}
                  <div>
                    <button
                      type="button"
                      ref={desktopSalesButtonRef}
                      disabled={selectedFeatureIds.size === 0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenSalesModal();
                      }}
                      className="oh-btn-primary w-full h-[52px] rounded-full text-[16px] font-semibold flex items-center justify-center gap-2 text-white transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed"
                    >
                      <span>Talk to Sales</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Helper hint if button is disabled */}
                    {selectedFeatureIds.size === 0 && (
                      <p className="text-xs text-[#475754] text-center mt-2">
                        Select at least one feature or package to talk to sales.
                      </p>
                    )}
                  </div>

                  {/* "Always included" items */}
                  {builderConfig?.alwaysIncluded && builderConfig.alwaysIncluded.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[rgba(11,27,34,0.08)]">
                      <span className="text-[12px] font-semibold text-[#0B1B22] uppercase tracking-wider block mb-2.5">
                        Always included:
                      </span>
                      <ul className="space-y-2">
                        {builderConfig.alwaysIncluded.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-[13px] text-[#0B1B22] leading-tight"
                          >
                            <Check className="w-4 h-4 text-[#14624F] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Inline Summary Bar inside section (avoids clashing with site-wide StickyBottomBar) */}
            <div className="mt-6 rounded-[20px] bg-white border border-[rgba(11,27,34,0.1)] p-4 shadow-sm lg:hidden flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl sm:text-2xl font-bold tabular-nums text-[#0B1B22] leading-none">
                    {formatEuro(oneTimeTotal)}
                  </span>
                  <span className="text-xs text-[#475754]">one-time</span>
                  <span className="text-xs font-semibold text-[#14624F] tabular-nums">
                    + {formatEuro(monthlyTotal)}/month
                  </span>
                </div>
                {hasVoiceAgentSelected && (
                  <span className="text-[11px] text-[#475754] block mt-0.5">
                    Voice call costs are charged separately.
                  </span>
                )}
                <span className="text-[11px] text-[#475754] truncate block mt-0.5">
                  {pages} page{pages > 1 ? 's' : ''} · {selectedFeatureIds.size} feature{selectedFeatureIds.size === 1 ? '' : 's'}
                </span>
              </div>

              <button
                type="button"
                ref={mobileSalesButtonRef}
                disabled={selectedFeatureIds.size === 0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOpenSalesModal();
                }}
                className="oh-btn-primary px-5 h-11 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 text-white disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
              >
                <span>Talk to Sales</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Accessible "Talk to Sales" Modal Dialog */}
            {isSalesModalOpen && (
              <Suspense fallback={null}>
                <PricingSalesModal
                  selectedPackage={selectedPackage}
                  selectedTierName={selectedTierName}
                  pages={pages}
                  oneTimeTotal={oneTimeTotal}
                  monthlyTotal={monthlyTotal}
                  hasVoiceAgentSelected={hasVoiceAgentSelected}
                  estimateNote={builderConfig?.estimateNote}
                  selectedVisibleFeatures={selectedVisibleFeatures}
                  initialSummaryMessage={initialSummaryMessage}
                  onClose={handleCloseSalesModal}
                />
              </Suspense>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
