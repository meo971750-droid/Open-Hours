import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, Play, Phone } from 'lucide-react';
import Container from '../components/Container';
import { config } from '../config';
import { PACKAGES, SETUP_FROM } from '../content';

export default function WhyOpenHours() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-6%' });
  const shouldReduceMotion = useReducedMotion();

  const growth = config.growth || {
    theme: 'light',
    pill: 'Growth package',
    title: 'Go Further',
    titleAccent: 'Our Growth Package',
    cards: {
      pages: {
        title: 'Pages for every service and area',
        text: 'Clear, dedicated pages that help you show up when local customers search.',
      },
      profile: {
        title: 'Responsive & Google Setup',
        text: 'Our responsive approach ensures your website and Google profile adapt to every screen and search.',
      },
      list: {
        title: 'Everything in Growth',
      },
    },
  };

  // 1. Data from pricing tiers (Growth)
  const growthTier = PACKAGES.find((p) => p.id === 'growth');
  const setupAmount = growthTier?.setupAmount ?? SETUP_FROM.growth;
  const priceDisplay = setupAmount ? `€${setupAmount.toLocaleString('en-IE')}` : null;

  // Check matching promises for "Fixed price. A written quote before we start."
  const hasMatchingPromises = (config.promises || []).some(
    (p) =>
      p.toLowerCase().includes('quote before we start') ||
      p.toLowerCase().includes('price stays the same')
  );

  // Growth tier feature checks for Card 1 & Card 2
  const growthFeaturesList = growthTier?.features || [];
  const hasServiceAreaPages = growthFeaturesList.some(
    (f) =>
      f.toLowerCase().includes('page') ||
      f.toLowerCase().includes('area') ||
      f.toLowerCase().includes('service')
  );

  const card1Title = hasServiceAreaPages
    ? growth.cards?.pages?.title || 'Pages for every service and area'
    : 'A website built to catch enquiries';

  const card1Text =
    growth.cards?.pages?.text ||
    'Clear, dedicated pages that help you show up when local customers search.';

  const card2Title =
    growth.cards?.profile?.title || 'Responsive & Google Setup';

  const card2Text =
    growth.cards?.profile?.text ||
    'Our responsive approach ensures your website and Google profile adapt to every screen and search.';

  // Card 3 Bullet list items: features from Growth tier
  const rawBullets: string[] = [];
  if (growthTier?.featuresHeading) {
    rawBullets.push(growthTier.featuresHeading);
  }
  growthFeaturesList.forEach((feat) => {
    rawBullets.push(feat);
  });

  // Ensure 8 clean items for the two-column grid matching the reference
  const fallbackBullets = [
    'Dedicated service & area pages',
    'Advanced Google Business Profile',
    'Enquiry tracking & monthly report',
    'Review-request automated flow',
    'Google Ads campaign set-up',
    'Speed & mobile optimisation',
    'Local search foundations',
    'Fixed price & direct phone support',
  ];

  const bulletItems =
    rawBullets.length >= 6
      ? rawBullets.slice(0, 8)
      : fallbackBullets;

  const midPoint = Math.ceil(bulletItems.length / 2);
  const col1Bullets = bulletItems.slice(0, midPoint);
  const col2Bullets = bulletItems.slice(midPoint);

  // Client avatar photos from heroProof
  const clientAvatars = (config.heroProof?.avatars || []).slice(0, 4);

  // Smooth scroll and highlight Growth card in Pricing section
  const handleScrollToGrowthPricing = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => {
        const h3s = Array.from(pricingEl.querySelectorAll('h3'));
        const growthH3 = h3s.find((h) => h.textContent?.trim() === 'Growth');
        const cardEl =
          (growthH3?.closest('div[class*="rounded-[24px]"]') as HTMLElement) ||
          (growthH3?.parentElement?.parentElement?.parentElement as HTMLElement);
        if (cardEl) {
          cardEl.classList.add(
            'ring-4',
            'ring-[#E07A5F]',
            'ring-offset-4',
            'transition-all',
            'duration-300'
          );
          setTimeout(() => {
            cardEl.classList.remove('ring-4', 'ring-[#E07A5F]', 'ring-offset-4');
          }, 1500);
        }
      }, 400);
    }
  };

  // Smooth scroll to contact form and preselect Growth option chip
  const handleGetGrowth = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutEl = document.getElementById('about') || document.getElementById('final-cta');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => {
        const radioGroup = document.querySelector(
          '[role="radiogroup"][aria-label="Package option selection"]'
        );
        if (radioGroup) {
          const buttons = Array.from(radioGroup.querySelectorAll('button'));
          const growthBtn = buttons.find((b) => b.textContent?.includes('Growth'));
          if (growthBtn && growthBtn.getAttribute('aria-checked') !== 'true') {
            growthBtn.click();
          }
        }
      }, 450);
    }
  };

  const handleScrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  };

  const titleLine1 = growth.title || 'Go Further';
  const titleAccent = growth.titleAccent || 'Our Growth Package';

  return (
    <section
      id="why-open-hours"
      ref={sectionRef}
      aria-label="Growth package details"
      className="relative w-full overflow-hidden scroll-mt-24 bg-white text-[#0F2A35] py-20 sm:py-28 md:py-32"
    >
      {/* Anchor for backward compatibility with navbar "What you get" links */}
      <div id="what-you-get" className="sr-only scroll-mt-24" />

      <Container className="relative z-10">
        {/* =========================================================================
            SECTION HEADER (Two Columns on Desktop, matching reference composition)
           ========================================================================= */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 sm:mb-16"
        >
          {/* Left Column: Pill + 3-Line H2 */}
          <div className="max-w-2xl">
            {/* Small pill label */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 bg-[#EEF3F4] border border-[#0F2A35]/10 text-[#1E4A5C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F]" />
              <span>{growth.pill || 'Growth package'}</span>
            </div>

            {/* H2 Heading on three lines matching reference styling */}
            <h2 className="text-[clamp(2.4rem,5vw,4.25rem)] font-bold tracking-tight leading-[1.06]">
              <span className="block text-[#0F2A35]">
                {titleLine1}
              </span>
              <span className="block text-[#0F2A35]">
                with <span className="italic font-normal">Our </span>
                <span className="italic font-normal bg-gradient-to-r from-[#D97724] via-[#E07A5F] to-[#C8642E] bg-clip-text text-transparent">
                  {titleAccent.replace(/^Our\s+/i, '')}
                </span>
              </span>
            </h2>
          </div>

          {/* Right Column: Avatars stack + Compact Info Block */}
          <div className="flex flex-col lg:items-end text-left lg:text-right gap-3 pb-1">
            {/* Client Avatars Stack with yellow '+' badge matching reference */}
            <div className="flex items-center lg:justify-end gap-1.5">
              <div className="flex -space-x-2.5 overflow-hidden">
                {clientAvatars.map((av, idx) => (
                  <img
                    key={idx}
                    src={av.localSrc || av.src}
                    alt={av.name || 'Client photo'}
                    className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover shadow-2xs"
                    loading="lazy"
                  />
                ))}
              </div>
              <div
                className="w-7 h-7 rounded-full bg-[#E59838] text-[#0F2A35] text-xs font-black flex items-center justify-center ring-2 ring-white shadow-2xs"
                aria-hidden="true"
              >
                +
              </div>
            </div>

            {/* Line 1: Growth package price */}
            {priceDisplay && (
              <p className="text-[17px] sm:text-[19px] font-semibold tracking-tight text-[#0F2A35]">
                Growth package, from {priceDisplay}
              </p>
            )}

            {/* Line 2: Fixed price promise */}
            {hasMatchingPromises && (
              <p className="text-sm max-w-sm text-[#5E6F77]">
                Fixed price. A written quote before we start.
              </p>
            )}

            {/* Button: Talk to Us */}
            <div className="mt-1">
              <a
                href={config.bookingUrl || '#about'}
                onClick={(e) => {
                  if (!config.bookingUrl) {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#0F2A35]/25 text-[#0F2A35] hover:bg-[#0F2A35]/5 hover:border-[#0F2A35]/50 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]"
              >
                <span>Talk to Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* =========================================================================
            BENTO GRID (12 Columns, Desktop total height ~580-620px)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:h-[600px]">
          {/* =====================================================================
              CARD 1 (Left, tall, light gray): 5 Columns, both rows
             ===================================================================== */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-[#E9EDEF] p-7 sm:p-8 flex flex-col justify-between overflow-hidden relative shadow-[0_16px_40px_rgba(15,42,53,0.08)] min-h-[500px] lg:min-h-0 lg:h-full border border-[#0F2A35]/[0.08]"
            style={{
              backgroundImage: 'radial-gradient(rgba(15, 42, 53, 0.08) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            {/* Top Text Area */}
            <div className="relative z-10">
              <h3 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#0F2A35] leading-snug mb-2.5">
                {card1Title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-[#35505C] mb-5 max-w-sm">
                {card1Text}
              </p>

              {/* Small outlined pill button */}
              <button
                type="button"
                onClick={handleScrollToGrowthPricing}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[#0F2A35]/25 bg-white/80 hover:bg-white hover:border-[#0F2A35]/50 text-[#0F2A35] text-xs font-semibold shadow-2xs transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C]"
              >
                <span>See sample pages</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Illustrative tag in corner */}
            <div className="absolute top-4 right-4 z-20">
              <span className="text-[11px] font-mono tracking-tight text-[#5E6F77] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-[#0F2A35]/10">
                Live preview
              </span>
            </div>

            {/* Bottom 55% Visual: Two overlapping phone mockups rising out of the bottom */}
            <div className="relative w-full h-[270px] sm:h-[300px] mt-6 flex items-end justify-center pointer-events-none select-none">
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full h-full flex items-end justify-center"
              >
                {/* Phone 1 (Left & Foreground, dark chassis with dynamic island) */}
                <div
                  className="absolute -bottom-8 left-[4%] sm:left-[8%] w-[190px] sm:w-[210px] h-[325px] rounded-[32px] bg-[#0B1519] p-2.5 shadow-[0_24px_50px_rgba(15,42,53,0.3)] border-4 border-[#080E11] overflow-hidden z-10"
                  aria-hidden="true"
                >
                  {/* Phone speaker pill / Dynamic Island */}
                  <div className="w-14 h-3 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1C2A30] ml-auto mr-2" />
                  </div>

                  {/* Phone screen UI */}
                  <div className="bg-[#121E24] rounded-2xl p-2.5 h-full flex flex-col justify-start border border-white/10 text-white">
                    {/* Brand bar */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
                      <span className="text-[10px] font-bold text-white tracking-wide truncate">
                        Apex Heat & Roofing
                      </span>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#E59838] text-[#080E11] text-[8px] font-extrabold">
                        <Phone className="w-2 h-2 fill-current" /> Call
                      </span>
                    </div>

                    {/* Service & Area Highlight */}
                    <p className="text-[11px] font-extrabold text-white leading-tight mb-1">
                      Dublin & Wicklow Slate Roofs
                    </p>
                    <p className="text-[8px] text-white/70 leading-tight mb-2">
                      SEAI Grant Registered · Free Quote
                    </p>

                    {/* Interactive quote request card */}
                    <div className="bg-[#1B2B33] rounded-xl p-2 border border-white/10 shadow-2xs mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8.5px] font-semibold text-[#EBB894]">Request Quote</span>
                        <span className="text-[7.5px] text-white/50">10 min reply</span>
                      </div>
                      <div className="w-full h-3.5 bg-black/40 rounded text-[7.5px] px-1.5 text-white/60 flex items-center mb-1">
                        Chimney repair & flashing...
                      </div>
                      <div className="w-full h-4 bg-[#E07A5F] hover:bg-[#C8642E] rounded text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                        Get Trade Quote
                      </div>
                    </div>

                    {/* Area coverage tags */}
                    <div className="mt-auto pt-1.5 border-t border-white/10">
                      <p className="text-[7.5px] text-white/60 font-mono truncate">
                        Dublin 1–24 · Bray · Greystones
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone 2 (Right & Background, angled slightly) */}
                <div
                  className="absolute -bottom-6 right-[4%] sm:right-[8%] w-[185px] sm:w-[200px] h-[310px] rounded-[30px] bg-[#142229] p-2.5 shadow-[0_20px_45px_rgba(15,42,53,0.25)] border-4 border-[#0F1B20] overflow-hidden transform rotate-3 origin-bottom-right"
                  aria-hidden="true"
                >
                  {/* Dynamic Island */}
                  <div className="w-12 h-2.5 bg-black rounded-full mx-auto mb-2" />

                  {/* Enquiry Inbox card */}
                  <div className="bg-[#192A33] rounded-2xl p-2.5 h-full flex flex-col justify-start border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8.5px] font-bold text-white/70">Enquiry Dashboard</span>
                      <span className="text-[7.5px] text-[#E59838] font-bold">New lead</span>
                    </div>

                    {/* Lead Card */}
                    <div className="rounded-xl bg-[#213540] p-2 border border-white/10 shadow-xs mb-2">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[9.5px] font-bold text-white truncate">David K. · Blackrock</span>
                        <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[7px] font-bold">
                          Urgent
                        </span>
                      </div>
                      <p className="text-[8px] text-white/70 leading-snug line-clamp-2">
                        “Ridge tile loosened after storm. Need inspection this week.”
                      </p>
                    </div>

                    {/* Quick Response Bar */}
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <div className="h-4 rounded bg-[#E07A5F] text-white text-[7.5px] font-bold flex items-center justify-center">
                        Call Lead
                      </div>
                      <div className="h-4 rounded bg-white/10 text-white text-[7.5px] font-medium flex items-center justify-center">
                        View Map
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* =====================================================================
              RIGHT SIDE COLUMN (7 Columns, Cards 2 & 3)
             ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-5 lg:h-full">
            {/* ===================================================================
                CARD 2 (Top Right, Golden-Amber Gradient): ~38% height
               =================================================================== */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="lg:h-[38%] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-[0_16px_40px_rgba(217,119,36,0.22)] min-h-[220px]"
              style={{
                background: 'linear-gradient(135deg, #E59838 0%, #D97724 35%, #8C3D10 75%, #502008 100%)',
              }}
            >
              {/* Soft light sweep highlight */}
              <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                  background: 'linear-gradient(105deg, rgba(255,255,255,0.7) 0%, transparent 45%)',
                }}
                aria-hidden="true"
              />

              {/* Floating Rotating Text Badge with Play Icon (matching reference) */}
              <a
                href={config.bookingUrl || '#about'}
                onClick={(e) => {
                  if (!config.bookingUrl) {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                aria-label="Get in touch"
                className="absolute -top-1.5 right-6 z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform duration-200"
              >
                {/* Rotating SVG Circular Text */}
                <motion.svg
                  animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                >
                  <path
                    id="circlePathBadge"
                    d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="none"
                  />
                  <text className="text-[10px] font-bold tracking-[0.24em] fill-white drop-shadow-xs">
                    <textPath href="#circlePathBadge">
                      GET IN TOUCH • GET IN TOUCH •{' '}
                    </textPath>
                  </text>
                </motion.svg>
                {/* White circle with dark triangle play button in center */}
                <span className="absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#0F2A35] flex items-center justify-center shadow-md">
                  <Play className="w-3.5 h-3.5 fill-[#0F2A35] ml-0.5" />
                </span>
              </a>

              {/* Text content on left */}
              <div className="relative z-10 max-w-[62%] sm:max-w-[66%]">
                <h3 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-white leading-tight mb-2">
                  {card2Title}
                </h3>
                <p className="text-[13.5px] sm:text-[14.5px] font-medium leading-snug text-white/90">
                  {card2Text}
                </p>
              </div>

              {/* 3D Iridescent Faceted Crystal / Prism (matching reference artwork) */}
              <div
                className="absolute right-3 bottom-1 sm:right-7 sm:bottom-2 w-28 h-36 sm:w-36 sm:h-44 pointer-events-none select-none z-10"
                aria-hidden="true"
              >
                <motion.svg
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: [0, -6, 0],
                          rotate: [-1, 2, -1],
                        }
                  }
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  viewBox="0 0 140 180"
                  className="w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
                >
                  <defs>
                    {/* Prismatic Cyan / Blue Reflection Gradient */}
                    <linearGradient id="prismCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#80E5FF" />
                      <stop offset="45%" stopColor="#25A4E8" />
                      <stop offset="100%" stopColor="#0B4B70" />
                    </linearGradient>

                    {/* Prismatic Center Highlight with Rainbow Caustics */}
                    <linearGradient id="prismRainbow" x1="20%" y1="0%" x2="80%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="25%" stopColor="#FFF2A3" />
                      <stop offset="60%" stopColor="#FF77B6" />
                      <stop offset="85%" stopColor="#7EE6FF" />
                      <stop offset="100%" stopColor="#1B384F" />
                    </linearGradient>

                    {/* Right facet golden reflection */}
                    <linearGradient id="prismGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFE082" />
                      <stop offset="50%" stopColor="#D97724" />
                      <stop offset="100%" stopColor="#3E1A08" />
                    </linearGradient>

                    {/* Specular White Rim Highlight */}
                    <linearGradient id="prismSpecular" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                      <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Crystal Shadow on golden surface */}
                  <ellipse cx="70" cy="168" rx="36" ry="7" fill="#250E04" opacity="0.45" />

                  {/* Left Facet: Vivid Cyan & Electric Blue */}
                  <polygon
                    points="70,18 24,96 70,158"
                    fill="url(#prismCyan)"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1.2"
                  />

                  {/* Center Ridge Facet: Iridescent Spectral White & Pink Caustics */}
                  <polygon
                    points="70,18 70,158 98,92"
                    fill="url(#prismRainbow)"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.2"
                  />

                  {/* Right Facet: Warm Golden Amber & Deep Bronze */}
                  <polygon
                    points="70,18 98,92 122,82"
                    fill="url(#prismGold)"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1.2"
                  />

                  {/* Bottom Right Facet */}
                  <polygon
                    points="70,158 98,92 122,82"
                    fill="#4A1E06"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.2"
                  />

                  {/* Top Edge Specular Glint */}
                  <line
                    x1="70"
                    y1="18"
                    x2="24"
                    y2="96"
                    stroke="url(#prismSpecular)"
                    strokeWidth="2"
                  />
                  <line
                    x1="70"
                    y1="18"
                    x2="70"
                    y2="158"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    opacity="0.85"
                  />
                </motion.svg>
              </div>
            </motion.div>

            {/* ===================================================================
                CARD 3 (Bottom Right, Matte Dark Charcoal): ~62% height
               =================================================================== */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="lg:h-[62%] rounded-[28px] sm:rounded-[32px] bg-[#0F141C] p-7 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(11,27,34,0.22)] min-h-[340px] border border-white/10"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            >
              <div>
                {/* Title matching reference layout */}
                <h3 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-white mb-5">
                  {growth.cards?.list?.title || 'Everything in Growth'}
                </h3>

                {/* Two-column bullet list with peach dots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 max-w-xl">
                  {/* Column 1 */}
                  <ul className="space-y-2.5">
                    {col1Bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[0.92rem] sm:text-[0.95rem] text-[#D1D8DB] leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] mt-1.5 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Column 2 */}
                  <ul className="space-y-2.5">
                    {col2Bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[0.92rem] sm:text-[0.95rem] text-[#D1D8DB] leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] mt-1.5 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Row: Buttons (Left) & 3D Pointer Cursor (Right) */}
              <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10 relative z-10">
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Glowing outlined pill button "Get Growth" */}
                  <button
                    type="button"
                    onClick={handleGetGrowth}
                    className="inline-flex items-center gap-2 min-h-[44px] px-6 rounded-full border border-white text-white hover:bg-white/10 shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:shadow-[0_0_32px_rgba(255,255,255,0.4)] text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EBB894]"
                  >
                    <span>Get Growth</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  {/* Secondary text link */}
                  <button
                    type="button"
                    onClick={handleScrollToPricing}
                    className="text-sm font-medium text-white/60 hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline"
                  >
                    See pricing
                  </button>
                </div>

                {/* 3D Matte Dark Cursor / Pointer emerging from bottom-right (matching reference) */}
                <div
                  className="hidden sm:block absolute -right-4 -bottom-6 w-36 h-36 pointer-events-none select-none z-10"
                  aria-hidden="true"
                >
                  <motion.svg
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: [0, -5, 0],
                            x: [0, 4, 0],
                          }
                    }
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    viewBox="0 0 120 120"
                    className="w-full h-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.6)]"
                  >
                    <defs>
                      {/* Top Matte Face */}
                      <linearGradient id="cursorTop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2E3842" />
                        <stop offset="60%" stopColor="#1B2228" />
                        <stop offset="100%" stopColor="#10151A" />
                      </linearGradient>

                      {/* 3D Extrusion Side */}
                      <linearGradient id="cursorSide" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#141A20" />
                        <stop offset="100%" stopColor="#080C0F" />
                      </linearGradient>

                      {/* Top Edge Bevel Highlight */}
                      <linearGradient id="cursorBevel" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5B6A78" />
                        <stop offset="100%" stopColor="#2A353E" />
                      </linearGradient>
                    </defs>

                    {/* 3D Extruded Shadow & Depth */}
                    <path
                      d="M28 22 L34 100 L56 78 L80 106 L96 92 L72 64 L104 60 Z"
                      fill="url(#cursorSide)"
                      transform="translate(4, 5)"
                      opacity="0.9"
                    />

                    {/* Main Cursor Face */}
                    <path
                      d="M28 22 L34 100 L56 78 L80 106 L96 92 L72 64 L104 60 Z"
                      fill="url(#cursorTop)"
                      stroke="url(#cursorBevel)"
                      strokeWidth="1.5"
                    />

                    {/* Subtle Top Facet Glint */}
                    <path
                      d="M28 22 L34 100 L56 78 Z"
                      fill="#FFFFFF"
                      opacity="0.08"
                    />
                  </motion.svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
