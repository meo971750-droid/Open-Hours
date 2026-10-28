import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
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
  X,
  Info,
} from 'lucide-react';
import { config, PricingTierConfig, BuilderFeatureConfig, BuilderFeatureGroup } from '../config';
import { CONTACT, FORM_ENDPOINT } from '../content';

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

  // Currency formatter
  const euroFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }),
    []
  );
  const formatEuro = (amount: number) => euroFormatter.format(amount);

  // Dev-only console warnings: warn if sum for any package is outside 105% to 120% of its "from" price
  useEffect(() => {
    if (import.meta.env?.DEV) {
      if (basePrice < starterTierPrice) {
        console.warn(
          `[PricingBuilder] Default builder basePrice (€${basePrice}) is lower than Starter tier price (€${starterTierPrice}).`
        );
      }

      const allConfigFeatures = builderConfig?.features || [];
      tiers.forEach((tier) => {
        const tierFeatures = allConfigFeatures.filter((f) =>
          f.includedInTiers?.includes(tier.id as 'starter' | 'standard' | 'growth')
        );
        const tierFeaturesCost = tierFeatures
          .filter((f) => f.billing === 'one-time')
          .reduce((sum, f) => sum + (f.price || 0), 0);
        const tierCustomTotal = basePrice + tierFeaturesCost;
        const ratio = tierCustomTotal / tier.price;
        if (ratio < 1.05 || ratio > 1.20) {
          console.warn(
            `[PricingBuilder] Selecting all features for tier "${tier.name}" gives custom total €${tierCustomTotal} (${Math.round(ratio * 100)}% of package price €${tier.price}), which is outside the 105% to 120% target range.`
          );
        }
      });

      // List every feature still at price 0
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
  }, [basePrice, starterTierPrice, builderConfig, tiers]);

  // Price calculations with useMemo:
  // Total = base website price + max(0, pages - includedPages) x pricePerExtraPage + sum of selected one-time features.
  // Monthly features are summed separately and shown as "+ €X / month".
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

  const animatedTotal = useAnimatedCount(oneTimeTotal, shouldReduceMotion);

  // E5: "TRY A PACKAGE" LIVE RECOMMENDATION IN ESTIMATE CARD
  const packageComparison = useMemo(() => {
    const selectedCount = selectedVisibleFeatures.length;
    if (selectedCount === 0) return null;

    interface TierMatch {
      tier: PricingTierConfig;
      includedCount: number;
      effectivePrice: number;
      isFullMatch: boolean;
    }

    const matches: TierMatch[] = [];

    tiers.forEach((tier) => {
      const tierFeats = (builderConfig?.features || []).filter((f) =>
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
      const effectiveTierPrice =
        tier.price + (pricePerExtraPage > 0 ? extraPagesForTier * pricePerExtraPage : 0);

      matches.push({
        tier,
        includedCount: matchCount,
        effectivePrice: effectiveTierPrice,
        isFullMatch: matchCount === selectedCount,
      });
    });

    // Case 1: One or more packages include ALL selected features and price is LOWER than custom total
    const fullMatchesLower = matches
      .filter((m) => m.isFullMatch && m.effectivePrice < oneTimeTotal)
      .sort((a, b) => a.effectivePrice - b.effectivePrice);

    if (fullMatchesLower.length > 0) {
      const best = fullMatchesLower[0];
      const difference = oneTimeTotal - best.effectivePrice;
      if (difference > 0) {
        return {
          type: 'full-saving' as const,
          tier: best.tier,
          text: `Everything you selected is included in our ${best.tier.name} package, from ${formatEuro(best.tier.price)}. That is ${formatEuro(difference)} less than this custom build.`,
        };
      }
    }

    // Case 2: No package covers everything, but one covers at least half of the selected features
    const halfThreshold = Math.ceil(selectedCount / 2);
    const partialMatches = matches
      .filter((m) => m.includedCount >= halfThreshold && m.includedCount > 0)
      .sort((a, b) => {
        if (b.includedCount !== a.includedCount) {
          return b.includedCount - a.includedCount;
        }
        return a.effectivePrice - b.effectivePrice;
      });

    if (partialMatches.length > 0) {
      const best = partialMatches[0];
      return {
        type: 'partial-match' as const,
        tier: best.tier,
        text: `${best.includedCount} of your ${selectedCount} selected features are already included in our ${best.tier.name} package, from ${formatEuro(best.tier.price)}. Compare it before you request.`,
      };
    }

    return null;
  }, [selectedVisibleFeatures, tiers, builderConfig, pages, pricePerExtraPage, oneTimeTotal, formatEuro]);

  // ----------------------------------------------------
  // "TALK TO SALES" ACCESSIBLE MODAL FORM STATE
  // ----------------------------------------------------
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [salesName, setSalesName] = useState('');
  const [salesEmail, setSalesEmail] = useState('');
  const [salesPhone, setSalesPhone] = useState('');
  const [salesMessage, setSalesMessage] = useState('');
  const [salesConsent, setSalesConsent] = useState(false);
  const [salesHoneypot, setSalesHoneypot] = useState('');
  const [salesErrors, setSalesErrors] = useState<Record<string, string>>({});
  const [salesSubmitting, setSalesSubmitting] = useState(false);
  const [salesSubmitted, setSalesSubmitted] = useState(false);
  const [salesStatus, setSalesStatus] = useState<string | null>(null);

  const desktopSalesButtonRef = useRef<HTMLButtonElement>(null);
  const mobileSalesButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Generate plain-text summary message
  const generateSummaryText = () => {
    const pkgName =
      selectedPackage === 'scratch'
        ? 'Started from scratch'
        : selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1);

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
      monthlyTotal > 0 ? `Monthly total: ${formatEuro(monthlyTotal)} / month` : 'Monthly total: None',
      builderConfig?.estimateNote ? `Estimate note: ${builderConfig.estimateNote}` : '',
    ].filter(Boolean);

    return lines.join('\n\n');
  };

  // Open Sales Modal
  const handleOpenSalesModal = () => {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setSalesMessage(generateSummaryText());
    setSalesErrors({});
    setSalesStatus(null);
    setSalesSubmitted(false);
    setIsSalesModalOpen(true);
  };

  // Close Sales Modal (returns focus with preventScroll)
  const handleCloseSalesModal = () => {
    setIsSalesModalOpen(false);
    lastFocusedRef.current?.focus({ preventScroll: true });
  };

  // Scroll lock and Esc to close
  useEffect(() => {
    if (!isSalesModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first input on open
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseSalesModal();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableEls.length === 0) return;

        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSalesModalOpen]);

  // Handle Sales Modal Submit
  const handleSalesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (salesHoneypot) return;

    const newErrors: Record<string, string> = {};
    if (!salesName.trim()) {
      newErrors.name = 'Please provide your name.';
    }
    if (!salesEmail.trim() || !/^\S+@\S+\.\S+$/.test(salesEmail.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!salesConsent) {
      newErrors.consent = 'Please confirm consent to be contacted.';
    }

    if (Object.keys(newErrors).length > 0) {
      setSalesErrors(newErrors);
      return;
    }

    setSalesSubmitting(true);
    setSalesStatus(null);

    const payload = {
      tag: 'Custom build',
      name: salesName.trim(),
      email: salesEmail.trim(),
      phone: salesPhone.trim(),
      startingPackage: selectedPackage,
      pages,
      oneTimeTotal,
      monthlyTotal,
      selectedFeatures: selectedVisibleFeatures.map((f) => ({
        id: f.id,
        name: f.name,
        price: f.price,
        billing: f.billing,
      })),
      message: salesMessage.trim(),
      submittedAt: new Date().toISOString(),
    };

    // If formEndpoint is empty, use mailto fallback and never show a fake success message
    const activeEndpoint = FORM_ENDPOINT && !FORM_ENDPOINT.startsWith('[') ? FORM_ENDPOINT : '';

    if (!activeEndpoint || !activeEndpoint.trim()) {
      setSalesSubmitting(false);
      const fallbackEmail =
        CONTACT.email && !CONTACT.email.startsWith('[')
          ? CONTACT.email
          : 'hello@openhours.studio';
      const mailSubject = `Custom build quote request from ${salesName.trim()}`;
      const mailBody = `Name: ${salesName.trim()}\nEmail: ${salesEmail.trim()}\nPhone: ${salesPhone.trim()}\nTag: Custom build\n\n${salesMessage.trim()}`;

      window.location.href = `mailto:${encodeURIComponent(fallbackEmail)}?subject=${encodeURIComponent(
        mailSubject
      )}&body=${encodeURIComponent(mailBody)}`;

      setSalesStatus(
        `Form endpoint is pending setup. Your enquiry was prepared in your email client. If it did not open automatically, please send your email directly to ${fallbackEmail}.`
      );
      return;
    }

    try {
      const res = await fetch(activeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      setSalesSubmitted(true);
    } catch {
      setSalesStatus(
        'Could not deliver your enquiry right now. Please try again or reach out directly.'
      );
    } finally {
      setSalesSubmitting(false);
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
        {/* PART 2: BUILDER ("Need something different?")        */}
        {/* ==================================================== */}
        {hasBuilderContent && basePrice > 0 && (
          <div className="mt-16 sm:mt-24 pt-14 border-t border-[#0F2A35]/10">
            {/* Builder Heading */}
            <div className="text-center mb-10 sm:mb-14">
              <h3 className="text-[28px] sm:text-[38px] font-normal tracking-[-0.02em] leading-tight text-[#0F2A35] mb-3">
                <span>Need something </span>
                <span className="font-serif italic text-[#12303D]">different?</span>
              </h3>
              <p className="text-[16px] sm:text-[17px] text-[#5E6F77] max-w-xl mx-auto">
                {builderConfig?.subtext ||
                  'Start from a package and customise each feature. The estimate updates as you go.'}
              </p>
            </div>

            {/* 1. PACKAGE SELECTOR: Segmented tabs for Starter, Standard, Growth, Start from scratch */}
            <div className="max-w-2xl mx-auto mb-10">
              <span className="text-[12.5px] font-semibold text-[#5E6F77] uppercase tracking-wider block text-center mb-2.5">
                Start from a package:
              </span>
              <div
                className="bg-[#EEF3F4] p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1.5 border border-[#0F2A35]/[0.08]"
                role="tablist"
                aria-label="Starting package selector"
              >
                {(
                  [
                    { id: 'starter' as const, label: 'Starter' },
                    { id: 'standard' as const, label: 'Standard' },
                    { id: 'growth' as const, label: 'Growth' },
                    { id: 'scratch' as const, label: 'Start from scratch' },
                  ] as const
                ).map((tab) => {
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
                      className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-[13.5px] sm:text-[14px] font-semibold transition-all duration-150 cursor-pointer text-center ${
                        isActive
                          ? 'bg-white text-[#0F2A35] shadow-xs'
                          : 'text-[#5E6F77] hover:text-[#0F2A35] hover:bg-white/50'
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
                <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#0F2A35]/[0.08] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[17px] font-semibold text-[#0F2A35] block">
                        How many pages?
                      </span>
                      <span className="text-[13px] text-[#5E6F77]">
                        {includedPages} page{includedPages > 1 ? 's' : ''} included in base build
                        {pricePerExtraPage > 0 ? `, then €${pricePerExtraPage} per extra page.` : '.'}
                      </span>
                    </div>

                    {/* Stepper Controls */}
                    <div className="inline-flex items-center gap-3 bg-[#EEF3F4] p-1.5 rounded-full self-start sm:self-auto border border-[#0F2A35]/[0.06]">
                      <button
                        type="button"
                        aria-label="Decrease page count"
                        disabled={pages <= minPages}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPages((p) => Math.max(minPages, p - 1));
                        }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPages((p) => Math.min(maxPages, p + 1));
                        }}
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
                  <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#0F2A35]/[0.08] shadow-xs min-h-[460px]">
                    {/* Header with Title and Select all / Clear all */}
                    <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-[rgba(15,42,53,0.06)]">
                      <div>
                        <h4 className="text-[17px] font-semibold text-[#0F2A35]">
                          Features
                        </h4>
                        <span className="text-[12.5px] text-[#5E6F77]">
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
                          className="text-[#1E4A5C] hover:text-[#0F2A35] font-medium cursor-pointer transition-colors"
                        >
                          Select all
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedFeatureIds(new Set());
                          }}
                          className="text-[#5E6F77] hover:text-[#0F2A35] font-medium cursor-pointer transition-colors"
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
                            <h5 className="text-[12px] font-semibold text-[#5E6F77] uppercase tracking-wider mb-3">
                              {group}
                            </h5>
                            <div className="space-y-2.5">
                              {groupFeatures.map((feat) => {
                                const isSelected = selectedFeatureIds.has(feat.id);
                                const isInCurrentPackage =
                                  selectedPackage !== 'scratch' &&
                                  Boolean(feat.includedInTiers?.includes(selectedPackage));

                                const priceLabel =
                                  (feat.price || 0) > 0
                                    ? feat.billing === 'monthly'
                                      ? `+${formatEuro(feat.price)}/month`
                                      : `+${formatEuro(feat.price)}`
                                    : 'Included in package';

                                return (
                                  <label
                                    key={feat.id}
                                    htmlFor={`feat-checkbox-${feat.id}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-4 cursor-pointer select-none ${
                                      isSelected
                                        ? 'bg-white border-[#1E4A5C]/35 shadow-xs ring-1 ring-[#1E4A5C]/20'
                                        : 'bg-[#F9FBFC] hover:bg-white border-[#0F2A35]/[0.06] hover:border-[#0F2A35]/15'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3 min-w-0">
                                      {/* Accessible Checkbox input */}
                                      <input
                                        type="checkbox"
                                        id={`feat-checkbox-${feat.id}`}
                                        checked={isSelected}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          toggleFeature(feat.id);
                                        }}
                                        aria-label={feat.name}
                                        className="mt-1 w-4 h-4 rounded border-slate-300 text-[#1E4A5C] focus:ring-[#1E4A5C] focus:ring-offset-0 cursor-pointer"
                                      />

                                      {/* Icon */}
                                      <div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                                          isSelected
                                            ? 'bg-[#0F2A35] text-white shadow-xs'
                                            : 'bg-[#EEF3F4] text-[#5E6F77]'
                                        }`}
                                      >
                                        <FeatureIcon
                                          name={feat.icon}
                                          className="w-4 h-4"
                                        />
                                      </div>

                                      {/* Name, Description, In Package Tag */}
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-semibold text-[14.5px] sm:text-[15px] text-[#0F2A35] leading-snug">
                                            {feat.name}
                                          </span>
                                          {isInCurrentPackage && (
                                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCE9EC] text-[#1E4A5C] whitespace-nowrap">
                                              In {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)}
                                            </span>
                                          )}
                                        </div>
                                        {feat.description && (
                                          <p className="text-[12.5px] text-[#5E6F77] mt-0.5 leading-relaxed">
                                            {feat.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Price & Billing */}
                                    <div className="text-right shrink-0 pt-0.5 pl-2">
                                      <span className="font-semibold text-[13px] sm:text-[13.5px] text-[#0F2A35] block">
                                        {priceLabel}
                                      </span>
                                      <span className="text-[11px] text-[#5E6F77]">
                                        {feat.billing === 'monthly' ? 'monthly' : 'one-time'}
                                      </span>
                                    </div>
                                  </label>
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
                <div className="bg-[#F8FAFB] rounded-[24px] p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                  <div className="mb-4">
                    <h4 className="text-[20px] font-semibold text-[#0F2A35] leading-tight">
                      Your estimate
                    </h4>
                    <span className="text-[13px] text-[#5E6F77]">
                      {pages} page{pages > 1 ? 's' : ''}
                      {selectedFeatureIds.size > 0
                        ? ` · ${selectedFeatureIds.size} feature${selectedFeatureIds.size > 1 ? 's' : ''} selected`
                        : ' · No features selected'}
                    </span>
                  </div>

                  {/* Live region for screen readers */}
                  <div id={liveRegionId} aria-live="polite" className="sr-only">
                    Estimated total: {formatEuro(oneTimeTotal)} one-time
                    {monthlyTotal > 0 ? ` plus ${formatEuro(monthlyTotal)} per month` : ''}
                  </div>

                  {/* Main One-Time Price Display */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[40px] sm:text-[46px] font-bold tabular-nums text-[#0F2A35] leading-none tracking-tight">
                        {formatEuro(animatedTotal)}
                      </span>
                      <span className="text-[14px] text-[#5E6F77] font-normal">
                        one-time
                      </span>
                    </div>

                    {/* Cost Breakdown Line */}
                    <div className="text-[12.5px] text-[#5E6F77] mt-2 leading-relaxed">
                      <span>Base website: {formatEuro(basePrice)}</span>
                      {pagesCost > 0 && <span> + Extra pages: {formatEuro(pagesCost)}</span>}
                      {oneTimeFeaturesCost > 0 && (
                        <span> + Features: {formatEuro(oneTimeFeaturesCost)}</span>
                      )}
                    </div>

                    {/* E5: Try a package recommendation line */}
                    {packageComparison && (
                      <div className="mt-3 p-3 rounded-2xl bg-[#EEF3F4] border border-[#0F2A35]/[0.08] text-[12.5px] text-[#0F2A35] flex items-start gap-2.5 leading-snug">
                        <Info className="w-4 h-4 text-[#1E4A5C] shrink-0 mt-0.5" />
                        <div>
                          <span>{packageComparison.text} </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectStartingPackage(packageComparison.tier.id as StartingPackage);
                            }}
                            className="font-semibold text-[#1E4A5C] hover:text-[#0F2A35] underline underline-offset-2 ml-1 cursor-pointer transition-colors"
                          >
                            View {packageComparison.tier.name} package
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Monthly ongoing total if any monthly feature selected */}
                  {monthlyTotal > 0 && (
                    <div className="pt-2.5 pb-2 border-t border-[rgba(15,42,53,0.06)] mt-2">
                      <div className="flex items-baseline gap-2 text-[17px] font-semibold text-[#1E4A5C]">
                        <span>+ €{monthlyTotal} / month</span>
                        <span className="text-[12.5px] text-[#5E6F77] font-normal">
                          ongoing
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Estimate Note from config (plain trade language, no savings claims) */}
                  {builderConfig?.estimateNote && (
                    <p className="text-[12.5px] text-[#5E6F77] leading-relaxed my-4">
                      {builderConfig.estimateNote}
                    </p>
                  )}

                  {/* Selected Features Pill Tags */}
                  {selectedFeatureNames.length > 0 && (
                    <div className="mb-5 pt-3 border-t border-[rgba(15,42,53,0.06)]">
                      <span className="text-[11.5px] font-semibold text-[#5E6F77] uppercase tracking-wider block mb-2">
                        Selected features ({selectedFeatureNames.length}):
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
                      className="w-full h-[52px] rounded-full text-[16px] font-semibold flex items-center justify-center gap-2 bg-[#0F2A35] hover:bg-[#1A3D4C] text-white shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-45 disabled:cursor-not-allowed"
                    >
                      <span>Talk to Sales</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Helper hint if button is disabled */}
                    {selectedFeatureIds.size === 0 && (
                      <p className="text-xs text-[#5E6F77] text-center mt-2">
                        Select at least one feature or package to talk to sales.
                      </p>
                    )}
                  </div>

                  {/* "Always included" items */}
                  {builderConfig?.alwaysIncluded && builderConfig.alwaysIncluded.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[rgba(15,42,53,0.08)]">
                      <span className="text-[12px] font-semibold text-[#0F2A35] uppercase tracking-wider block mb-2.5">
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
                </div>
              </div>
            </div>

            {/* Mobile Sticky Bottom Bar (Total & Talk to Sales) */}
            <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#0F2A35]/10 p-3.5 sm:p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-40 lg:hidden flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold tabular-nums text-[#0F2A35] leading-none">
                    {formatEuro(oneTimeTotal)}
                  </span>
                  <span className="text-xs text-[#5E6F77]">one-time</span>
                </div>
                {monthlyTotal > 0 && (
                  <span className="text-xs font-semibold text-[#1E4A5C] block mt-0.5">
                    + {formatEuro(monthlyTotal)}/mo
                  </span>
                )}
                <span className="text-[11px] text-[#5E6F77] truncate block mt-0.5">
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
                className="px-5 h-11 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 bg-[#0F2A35] hover:bg-[#1A3D4C] text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
              >
                <span>Talk to Sales</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Accessible "Talk to Sales" Modal Dialog */}
            {isSalesModalOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="sales-modal-title"
                ref={modalRef}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    handleCloseSalesModal();
                  }
                }}
              >
                <div className="relative w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={handleCloseSalesModal}
                    aria-label="Close modal"
                    className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F2A35] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3
                    id="sales-modal-title"
                    className="text-2xl font-bold text-[#0F2A35] mb-2 pr-10"
                  >
                    Talk to Sales
                  </h3>
                  <p className="text-sm text-[#5E6F77] mb-5">
                    Review your custom estimate and tell us about your project.
                  </p>

                  {/* Top of Modal: Read-only "Your custom package" summary */}
                  <div className="bg-[#EEF3F4] rounded-2xl p-4 sm:p-5 border border-[#0F2A35]/10 mb-6 text-xs text-[#0F2A35]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#0F2A35]/10 mb-3">
                      <span className="font-bold text-sm text-[#0F2A35]">Your custom package</span>
                      <span className="font-semibold text-xs text-[#5E6F77] bg-white px-2.5 py-1 rounded-full border border-[#0F2A35]/10">
                        {selectedPackage === 'scratch'
                          ? 'Started from scratch'
                          : `Starting package: ${selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)}`}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-[#5E6F77]">
                        <span>Pages:</span>
                        <span className="font-medium text-[#0F2A35]">{pages} page{pages > 1 ? 's' : ''}</span>
                      </div>

                      {/* Selected Features List */}
                      <div className="pt-2 border-t border-[#0F2A35]/10">
                        <span className="font-semibold text-[#5E6F77] uppercase text-[10.5px] tracking-wider block mb-1.5">
                          Selected features ({selectedVisibleFeatures.length}):
                        </span>
                        {selectedVisibleFeatures.length === 0 ? (
                          <span className="text-[#5E6F77] italic">No features selected</span>
                        ) : (
                          <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            {selectedVisibleFeatures.map((f) => (
                              <li key={f.id} className="flex items-baseline justify-between gap-2 text-[11.5px]">
                                <span className="truncate text-[#0F2A35]">• {f.name}</span>
                                <span className="shrink-0 font-medium text-[#5E6F77]">
                                  {f.price > 0 ? formatEuro(f.price) : 'Included in package'}{' '}
                                  <span className="text-[10px] text-[#5E6F77]/80">
                                    ({f.billing === 'monthly' ? '/month' : 'one-time'})
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="pt-2.5 border-t border-[#0F2A35]/10 flex items-baseline justify-between font-bold text-sm">
                      <span>One-time total:</span>
                      <span className="text-base text-[#0F2A35]">{formatEuro(oneTimeTotal)}</span>
                    </div>
                    {monthlyTotal > 0 && (
                      <div className="flex items-baseline justify-between text-xs font-semibold text-[#1E4A5C] mt-1">
                        <span>Monthly total:</span>
                        <span>+ {formatEuro(monthlyTotal)} / month</span>
                      </div>
                    )}

                    {/* Estimate note */}
                    {builderConfig?.estimateNote && (
                      <p className="text-[11px] text-[#5E6F77] mt-3 pt-2.5 border-t border-[#0F2A35]/10 leading-relaxed italic">
                        {builderConfig.estimateNote}
                      </p>
                    )}
                  </div>

                  {salesSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-[#0F2A35] mb-2">
                        Enquiry received
                      </h4>
                      <p className="text-sm text-[#5E6F77] mb-6">
                        Thank you, {salesName}. We'll review your custom build requirements and reply with a fixed quote.
                      </p>
                      <button
                        type="button"
                        onClick={handleCloseSalesModal}
                        className="px-6 h-11 rounded-full bg-[#0F2A35] text-white text-sm font-semibold hover:bg-[#1A3D4C] transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSalesSubmit} noValidate className="space-y-4">
                      {/* Honeypot field */}
                      <input
                        type="text"
                        name="_builder_hp"
                        value={salesHoneypot}
                        onChange={(e) => setSalesHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                      />

                      {/* Name */}
                      <div>
                        <label
                          htmlFor="sales-name"
                          className="block text-xs font-semibold text-[#0F2A35] uppercase tracking-wider mb-1.5"
                        >
                          Full name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="sales-name"
                          ref={firstInputRef}
                          type="text"
                          value={salesName}
                          onChange={(e) => {
                            setSalesName(e.target.value);
                            if (salesErrors.name) setSalesErrors((prev) => ({ ...prev, name: '' }));
                          }}
                          placeholder="Your full name"
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:border-[#1E4A5C] focus:ring-1 focus:ring-[#1E4A5C] text-sm text-[#0F2A35] outline-none"
                        />
                        {salesErrors.name && (
                          <p className="text-xs text-red-500 mt-1">{salesErrors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="sales-email"
                          className="block text-xs font-semibold text-[#0F2A35] uppercase tracking-wider mb-1.5"
                        >
                          Email address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="sales-email"
                          type="email"
                          value={salesEmail}
                          onChange={(e) => {
                            setSalesEmail(e.target.value);
                            if (salesErrors.email) setSalesErrors((prev) => ({ ...prev, email: '' }));
                          }}
                          placeholder="you@yourtrade.ie"
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:border-[#1E4A5C] focus:ring-1 focus:ring-[#1E4A5C] text-sm text-[#0F2A35] outline-none"
                        />
                        {salesErrors.email && (
                          <p className="text-xs text-red-500 mt-1">{salesErrors.email}</p>
                        )}
                      </div>

                      {/* Phone (optional) */}
                      <div>
                        <label
                          htmlFor="sales-phone"
                          className="block text-xs font-semibold text-[#0F2A35] uppercase tracking-wider mb-1.5"
                        >
                          Phone or WhatsApp <span className="text-slate-400 font-normal lowercase">(optional)</span>
                        </label>
                        <input
                          id="sales-phone"
                          type="tel"
                          value={salesPhone}
                          onChange={(e) => setSalesPhone(e.target.value)}
                          placeholder="087 123 4567"
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:border-[#1E4A5C] focus:ring-1 focus:ring-[#1E4A5C] text-sm text-[#0F2A35] outline-none"
                        />
                      </div>

                      {/* Prefilled editable message */}
                      <div>
                        <label
                          htmlFor="sales-message"
                          className="block text-xs font-semibold text-[#0F2A35] uppercase tracking-wider mb-1.5"
                        >
                          Estimate summary &amp; notes <span className="text-slate-400 font-normal lowercase">(editable)</span>
                        </label>
                        <textarea
                          id="sales-message"
                          rows={4}
                          value={salesMessage}
                          onChange={(e) => setSalesMessage(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1E4A5C] focus:ring-1 focus:ring-[#1E4A5C] text-xs font-mono text-[#0F2A35] leading-relaxed resize-y outline-none"
                        />
                      </div>

                      {/* Consent checkbox */}
                      <div>
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={salesConsent}
                            onChange={(e) => {
                              setSalesConsent(e.target.checked);
                              if (salesErrors.consent) setSalesErrors((prev) => ({ ...prev, consent: '' }));
                            }}
                            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#1E4A5C] focus:ring-[#1E4A5C] cursor-pointer"
                          />
                          <span className="text-xs text-[#5E6F77] leading-relaxed">
                            I agree to be contacted about this estimate. Details will never be shared or spammed.
                          </span>
                        </label>
                        {salesErrors.consent && (
                          <p className="text-xs text-red-500 mt-1">{salesErrors.consent}</p>
                        )}
                      </div>

                      {/* Status / Fallback Banner */}
                      {salesStatus && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                          {salesStatus}
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={salesSubmitting}
                          className="w-full h-12 rounded-full bg-[#0F2A35] hover:bg-[#1A3D4C] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                          <span>{salesSubmitting ? 'Sending...' : 'Request Custom Package'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
