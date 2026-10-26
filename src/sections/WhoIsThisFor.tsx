import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import {
  Compass,
  ArrowRight,
  MapPin,
  Globe,
  Clock,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { config } from '../config';
import { PACKAGES, FIRST_PAGE } from '../content';

interface WhoIsThisForProps {
  onOpenAudit?: () => void;
}

export default function WhoIsThisFor({ onOpenAudit }: WhoIsThisForProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });
  const shouldReduceMotion = useReducedMotion();

  const whoFor = config.whoFor;
  const cards = whoFor.cards || [];

  // Check if free 1-page offer exists in pricing data or config
  const hasFree1PageOffer = Boolean(
    FIRST_PAGE && PACKAGES.some((pkg) => pkg.id === 'first')
  );

  // Growth tier features check: inspect whether Google Ads set-up, local SEO, or enquiry tracking exist in PACKAGES
  const growthTier = PACKAGES.find((pkg) => pkg.id === 'growth');
  const growthChips: string[] = [];
  if (growthTier) {
    const featureText = growthTier.features.join(' ').toLowerCase();
    if (featureText.includes('google ads')) {
      growthChips.push('Google Ads set-up');
    }
    if (featureText.includes('enquiry tracking')) {
      growthChips.push('Enquiry tracking');
    }
    if (growthChips.length < 2 && (featureText.includes('local seo') || featureText.includes('local search'))) {
      growthChips.push('Local SEO');
    }
  }

  // Smooth-scroll to target package in Pricing section and trigger a 1.5s highlight ring
  const handleScrollToPackage = (packageKey: string) => {
    const pricingSection = document.getElementById('pricing');
    if (!pricingSection) return;

    // Resolve target package name
    const targetPkg = PACKAGES.find((pkg) => pkg.id === packageKey);
    const targetName = targetPkg ? targetPkg.name.toLowerCase() : packageKey.toLowerCase();

    // Find the matching article card inside the pricing section
    const articles = Array.from(pricingSection.querySelectorAll('article'));
    const matchedCard = articles.find((article) => {
      const h3 = article.querySelector('h3');
      if (!h3) return false;
      const text = h3.textContent?.trim().toLowerCase() || '';
      return text.includes(targetName) || (packageKey === 'first' && (text.includes('1-page') || text.includes('free')));
    });

    if (matchedCard) {
      matchedCard.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'center' });
      // Apply brief highlight ring (~1.5s)
      matchedCard.style.transition = 'box-shadow 0.35s ease, outline 0.35s ease, outline-offset 0.35s ease';
      matchedCard.style.outline = '3px solid #1E4A5C';
      matchedCard.style.outlineOffset = '6px';
      matchedCard.style.boxShadow = '0 20px 48px rgba(30, 74, 92, 0.28)';

      setTimeout(() => {
        matchedCard.style.outline = 'transparent';
        matchedCard.style.outlineOffset = '0px';
        matchedCard.style.boxShadow = '';
      }, 1500);
    } else {
      // Fallback: scroll to pricing section top
      pricingSection.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  };

  const handleCtaClick = () => {
    if (config.bookingUrl && config.bookingUrl.startsWith('http')) {
      window.open(config.bookingUrl, '_blank', 'noopener,noreferrer');
    } else if (config.bookingUrl && config.bookingUrl.startsWith('#')) {
      const targetEl = document.querySelector(config.bookingUrl);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      }
    } else if (onOpenAudit) {
      onOpenAudit();
    } else {
      const contactEl = document.getElementById('final-cta');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <section
      id="who-is-this-for"
      ref={sectionRef}
      className="w-full bg-[#EEF3F4] py-20 sm:py-28 md:py-32 overflow-hidden scroll-mt-24"
    >
      <Container>
        {/* =========================================================================
            SECTION HEADER
            Pill + H2 with Italic Accent word ("for")
           ========================================================================= */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-2xl">
            Who is this <Accent>for</Accent>?
          </h2>
        </div>

        {/* =========================================================================
            3-COLUMN CARDS GRID
            Responsive: 1 col on mobile, 2 cols on tablet (3rd centered below), 3 cols on desktop
           ========================================================================= */}
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mb-14 sm:mb-16">
          {cards.map((card, idx) => {
            const matchedPackage = PACKAGES.find((pkg) => pkg.id === card.packageKey);
            const isStage1 = idx === 0;
            const isStage2 = idx === 1;
            const isStage3 = idx === 2;

            // Gradient backgrounds for bottom illustration zone
            const gradientStyle = isStage1
              ? { background: 'linear-gradient(180deg, #FFFFFF 0%, #CDE6EC 100%)' }
              : isStage2
              ? { background: 'linear-gradient(180deg, #FFFFFF 0%, #F5DCCB 100%)' }
              : { background: 'linear-gradient(180deg, #FFFFFF 0%, #D3EBDD 100%)' };

            return (
              <motion.article
                key={card.stage}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-6%' }}
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
                  delay: shouldReduceMotion ? 0 : idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`rounded-3xl bg-white border border-[rgba(15,42,53,0.08)] shadow-[0_10px_30px_rgba(15,42,53,0.06)] hover:shadow-[0_20px_42px_rgba(15,42,53,0.12)] transition-shadow duration-300 overflow-hidden flex flex-col justify-between ${
                  isStage3 ? 'md:max-lg:col-span-2 md:max-lg:max-w-md md:max-lg:mx-auto lg:col-span-1' : ''
                }`}
              >
                {/* -----------------------------------------------------------------
                    TOP HALF: Text Content & Action Button (Centered)
                   ----------------------------------------------------------------- */}
                <div className="p-7 sm:p-8 flex flex-col items-center text-center">
                  {/* Stage Pill */}
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0F2A35]/5 border border-[#0F2A35]/10 text-xs font-semibold text-[#5E6F77] uppercase tracking-wider mb-4">
                    {card.stage}
                  </span>

                  {/* Card Title */}
                  <h3 className="text-xl sm:text-[24px] font-bold tracking-tight text-[#0F2A35] leading-snug mb-3">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm sm:text-[15px] text-[#5E6F77] leading-relaxed mb-4 max-w-sm">
                    {card.text}
                  </p>

                  {/* Growth Tier Tiny Chips (if on Card 3 and items exist in pricing data) */}
                  {isStage3 && growthChips.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
                      {growthChips.slice(0, 2).map((chip) => (
                        <span
                          key={chip}
                          className="text-[11px] font-semibold text-[#1E4A5C] bg-[#EEF4F6] border border-[#1E4A5C]/15 px-2.5 py-0.5 rounded-full"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Best matched to & See {Package} Button */}
                  {matchedPackage ? (
                    <div className="flex flex-col items-center mt-auto pt-2">
                      <p className="text-xs font-semibold text-[#0F2A35]/75 uppercase tracking-wider mb-2">
                        Best matched to:{' '}
                        <span className="font-bold text-[#1E4A5C] normal-case">
                          {matchedPackage.name}
                        </span>
                      </p>

                      <button
                        type="button"
                        onClick={() => handleScrollToPackage(card.packageKey)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#0F2A35]/20 hover:border-[#1E4A5C] bg-white hover:bg-[#EEF4F6] text-xs font-bold text-[#0F2A35] transition-colors shadow-xs cursor-pointer group"
                      >
                        <span>See {matchedPackage.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#1E4A5C] transition-transform duration-200 group-hover:translate-x-0.5" />
                      </button>

                      {/* Extra link on Card 1 only: Free 1-page website option */}
                      {isStage1 && hasFree1PageOffer && card.secondaryLink && (
                        <button
                          type="button"
                          onClick={() => handleScrollToPackage('first')}
                          className="mt-2.5 text-xs text-[#1E4A5C] hover:text-[#0F2A35] underline decoration-[#1E4A5C]/40 hover:decoration-[#0F2A35] underline-offset-2 font-medium cursor-pointer transition-colors"
                        >
                          {card.secondaryLink}
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* -----------------------------------------------------------------
                    BOTTOM ZONE: 40-45% Vertical Pastel Gradient with Illustration
                    Blends from pure white at top with zero seam
                   ----------------------------------------------------------------- */}
                <div
                  aria-hidden="true"
                  style={gradientStyle}
                  className="h-48 sm:h-52 w-full flex flex-col items-center justify-center p-4 relative select-none"
                >
                  {/* ===============================================================
                      ILLUSTRATION 1 (Stage 1):
                      Map Pin card connected by dashed line to dashed Globe card
                     =============================================================== */}
                  {isStage1 && (
                    <div className="flex items-center justify-center gap-3 sm:gap-4 relative w-full max-w-[260px]">
                      {/* Left: Google Profile Icon Card */}
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-[rgba(15,42,53,0.08)] flex items-center justify-center text-[#0F2A35] shrink-0">
                          <MapPin className="w-6 h-6 text-[#0F2A35]" />
                        </div>
                        <span className="text-[10px] font-semibold text-[#0F2A35] mt-1.5 whitespace-nowrap">
                          Your Google profile
                        </span>
                      </div>

                      {/* Dashed connector line that draws left to right on scroll */}
                      <div className="relative w-12 sm:w-16 h-8 flex items-center justify-center shrink-0">
                        <svg className="w-full h-4 overflow-visible" viewBox="0 0 60 16" fill="none">
                          <motion.path
                            d="M 2 8 H 58"
                            stroke="#0F2A35"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                            animate={isInView || shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </svg>
                      </div>

                      {/* Right: No Website Yet (Dashed outline, pulses once) */}
                      <motion.div
                        className="flex flex-col items-center"
                        animate={
                          shouldReduceMotion
                            ? {}
                            : isInView
                            ? { scale: [1, 1.08, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.6, delay: 0.9, ease: 'easeInOut' }}
                      >
                        <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[#0F2A35]/35 bg-white/70 flex items-center justify-center text-[#5E6F77]/70 shrink-0">
                          <Globe className="w-6 h-6 text-[#5E6F77]/60" />
                        </div>
                        <span className="text-[10px] font-semibold text-[#5E6F77]/80 mt-1.5 whitespace-nowrap">
                          No website yet
                        </span>
                      </motion.div>
                    </div>
                  )}

                  {/* ===============================================================
                      ILLUSTRATION 2 (Stage 2):
                      Globe + Map Pin (with amber badges) = ? card
                     =============================================================== */}
                  {isStage2 && (
                    <div className="flex flex-col items-center justify-center w-full">
                      <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                        {/* Globe with Clock Badge */}
                        <motion.div
                          initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          animate={isInView || shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                          className="flex flex-col items-center"
                        >
                          <div className="relative w-12 h-12 rounded-2xl bg-white shadow-md border border-[rgba(15,42,53,0.08)] flex items-center justify-center text-[#0F2A35]">
                            <Globe className="w-5 h-5 text-[#0F2A35]" />
                            {/* Amber Clock Badge */}
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={isInView || shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.3, delay: 0.5 }}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shadow-xs"
                            >
                              <Clock className="w-3 h-3 text-amber-700" />
                            </motion.span>
                          </div>
                          <span className="text-[9.5px] font-semibold text-[#0F2A35] mt-1">Website</span>
                        </motion.div>

                        <span className="text-sm font-bold text-[#5E6F77]/70 mb-3">+</span>

                        {/* MapPin with Speech Bubble Badge */}
                        <motion.div
                          initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          animate={isInView || shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                          className="flex flex-col items-center"
                        >
                          <div className="relative w-12 h-12 rounded-2xl bg-white shadow-md border border-[rgba(15,42,53,0.08)] flex items-center justify-center text-[#0F2A35]">
                            <MapPin className="w-5 h-5 text-[#0F2A35]" />
                            {/* Amber Speech-Bubble Badge */}
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={isInView || shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.3, delay: 0.65 }}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shadow-xs"
                            >
                              <MessageSquare className="w-3 h-3 text-amber-700" />
                            </motion.span>
                          </div>
                          <span className="text-[9.5px] font-semibold text-[#0F2A35] mt-1">Profile</span>
                        </motion.div>

                        <span className="text-sm font-bold text-[#5E6F77]/70 mb-3">=</span>

                        {/* Third card: Dotted outline with muted ? */}
                        <motion.div
                          initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          animate={isInView || shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.45 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-12 h-12 rounded-2xl border-2 border-dotted border-[#0F2A35]/30 bg-white/60 flex items-center justify-center text-base font-bold text-[#5E6F77]/70">
                            ?
                          </div>
                          <span className="text-[9.5px] font-semibold text-[#5E6F77]/70 mt-1">Neglected</span>
                        </motion.div>
                      </div>

                      <p className="text-[11px] font-medium text-[#5E6F77] text-center mt-3">
                        Both exist. Neither is doing much.
                      </p>
                    </div>
                  )}

                  {/* ===============================================================
                      ILLUSTRATION 3 (Stage 3):
                      Globe + Map Pin = Compass card with pulsing thin ring
                     =============================================================== */}
                  {isStage3 && (
                    <div className="flex flex-col items-center justify-center w-full">
                      <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                        {/* Globe */}
                        <motion.div
                          initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          animate={isInView || shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-[rgba(15,42,53,0.08)] flex items-center justify-center text-[#0F2A35]">
                            <Globe className="w-5 h-5 text-[#0F2A35]" />
                          </div>
                          <span className="text-[9.5px] font-semibold text-[#0F2A35] mt-1">Website</span>
                        </motion.div>

                        <span className="text-sm font-bold text-[#5E6F77]/70 mb-3">+</span>

                        {/* MapPin */}
                        <motion.div
                          initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          animate={isInView || shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-[rgba(15,42,53,0.08)] flex items-center justify-center text-[#0F2A35]">
                            <MapPin className="w-5 h-5 text-[#0F2A35]" />
                          </div>
                          <span className="text-[9.5px] font-semibold text-[#0F2A35] mt-1">Profile</span>
                        </motion.div>

                        <span className="text-sm font-bold text-[#5E6F77]/70 mb-3">=</span>

                        {/* Third card: Compass with pulsing ring */}
                        <motion.div
                          initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          animate={isInView || shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.45 }}
                          className="flex flex-col items-center relative"
                        >
                          {/* Pulsing ring around the target card */}
                          {!shouldReduceMotion && (
                            <motion.div
                              initial={{ scale: 1, opacity: 0 }}
                              animate={isInView ? { scale: [1, 1.3], opacity: [0.8, 0] } : { scale: 1, opacity: 0 }}
                              transition={{ duration: 1.1, delay: 0.75, ease: 'easeOut' }}
                              className="absolute top-0 left-0 w-12 h-12 rounded-2xl border-2 border-[#1E4A5C] pointer-events-none"
                            />
                          )}

                          <div className="w-12 h-12 rounded-2xl bg-white shadow-md border-2 border-[#1E4A5C] flex items-center justify-center text-[#1E4A5C]">
                            <Compass className="w-5 h-5 text-[#1E4A5C]" />
                          </div>
                          <span className="text-[9.5px] font-bold text-[#1E4A5C] mt-1">Next step</span>
                        </motion.div>
                      </div>

                      <p className="text-[11px] font-medium text-[#1E4A5C] text-center mt-3">
                        Solid foundation. Ready for visibility.
                      </p>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* =========================================================================
            CTA ROW BELOW THE CARDS
            Centered line + Dark pill button "Talk to Us"
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-sm sm:text-base font-medium text-[#0F2A35]">
            {whoFor.footer}
          </p>

          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F2A35] hover:bg-[#1E4A5C] text-white text-xs sm:text-sm font-bold transition-colors shadow-md cursor-pointer group"
          >
            <span>Talk to Us</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
