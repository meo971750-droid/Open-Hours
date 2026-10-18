import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ChevronsRight,
  ArrowRight,
  Star,
} from 'lucide-react';
import SideTicker, { HorizontalTicker } from '../components/SideTicker';
import LiveMockup from '../components/LiveMockup';
import { HERO_CONTENT, HERO_TICKERS } from '../content';
import { config } from '../config';

interface HeroProps {
  onOpenPrivacy?: () => void;
  onOpenAudit?: (email?: string) => void;
}

export default function Hero({ onOpenPrivacy, onOpenAudit }: HeroProps) {
  const [email, setEmail] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rowSliding, setRowSliding] = useState(false);
  const [hasReviewsSection, setHasReviewsSection] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById('reviews');
    if (!el) {
      setHasReviewsSection(false);
    }
  }, []);

  const handleScrollToReviews = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('reviews');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#reviews');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!consentAccepted) {
      setErrorMessage('Please confirm your consent to receive the 2-minute video audit.');
      return;
    }

    if (onOpenAudit) {
      onOpenAudit(email);
    }
  };

  const mixedMobileItems = [
    HERO_TICKERS.left.items[0],
    HERO_TICKERS.right.items[0],
    HERO_TICKERS.left.items[1],
    HERO_TICKERS.right.items[1],
    HERO_TICKERS.left.items[2],
    HERO_TICKERS.right.items[2],
    HERO_TICKERS.left.items[3],
    HERO_TICKERS.right.items[3],
  ];

  const validAvatars = (config.heroProof?.avatars || [])
    .filter((a, idx) => a.consent && (a.src || a.localSrc) && !failedImages[idx])
    .slice(0, 5);

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative z-1 w-full overflow-x-clip overflow-y-visible min-h-[100svh] flex flex-col justify-between pt-26 sm:pt-30 md:pt-36 pb-16 md:pb-20 xl:pb-24"
      style={{
        minHeight: '100svh',
        background: 'linear-gradient(180deg, #FBF8F3 0%, #CFE0E4 100%)',
      }}
    >
      {/* Peach radial ambient glow behind headline */}
      <div
        className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[340px] sm:w-[680px] h-[340px] sm:h-[480px] rounded-full blur-[90px] -z-10"
        style={{ background: 'rgba(227, 184, 150, 0.28)' }}
      />

      {/* Visually hidden list for screen readers without loop duplicates */}
      <div className="sr-only">
        <h2>Specialist trades:</h2>
        <ul>
          {HERO_TICKERS.left.items.map((it) => (
            <li key={it.text}>{it.text}</li>
          ))}
        </ul>
        <h2>Website enquiry features:</h2>
        <ul>
          {HERO_TICKERS.right.items.map((it) => (
            <li key={it.text}>{it.text}</li>
          ))}
        </ul>
      </div>

      {/* 3-Part Layout at >= 1024px:
          [ticker 216px/240px] [centre content] [ticker 216px/240px]
          Column gap 24px/32px, edge padding 24px/32px.
          Centre content NEVER extends under tickers. */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-6 min-[1440px]:px-8 lg:grid lg:grid-cols-[216px_minmax(0,1fr)_216px] min-[1440px]:grid-cols-[240px_minmax(0,1fr)_240px] gap-6 xl:gap-8 items-start relative z-10">
        {/* Left Side Ticker (Built for trades) */}
        <div className="relative hidden lg:block w-[216px] min-[1440px]:w-[240px] h-[600px]">
          <SideTicker
            items={HERO_TICKERS.left.items}
            direction="up"
            label={HERO_TICKERS.left.label}
            side="left"
          />
        </div>

        {/* Centre Content: max-w 640px on 1024-1279px, max-w 760px on 1280-1439px, max-w 780px on >= 1440px
            pt-3 (mobile ~40px gap from nav), lg:pt-4 (1024-1279px ~56px gap), xl:pt-8 (>=1280px ~72px gap) */}
        <div className="w-full max-w-[640px] xl:max-w-[760px] min-[1440px]:max-w-[780px] mx-auto flex flex-col items-center text-center pt-3 sm:pt-3.5 lg:pt-4 xl:pt-8">
          {/* Badge: Fades in immediately */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 bg-[#1E4A5C] text-white px-3.5 py-1.5 rounded-full text-[13px] font-medium shadow-sm mb-5 sm:mb-6"
          >
            <span>{HERO_CONTENT.badge}</span>
            <ChevronsRight className="w-3.5 h-3.5 opacity-80" />
          </motion.div>

          {/* H1 Headline:
              clamp responsive, line-height 1.05, letter-spacing -0.03em.
              On >= 1024px force two-line break after "answers":
              Line 1: "The website that answers"
              Line 2: "while you're on the job"
              Below 1440px reduced clamp maximum to 52px so centre column is comfortable and headline stays on two lines. */}
          <h1
            className="text-[34px] sm:text-[44px] md:text-[48px] lg:text-[48px] xl:text-[52px] min-[1440px]:text-[60px] font-normal tracking-[-0.03em] leading-[1.05] text-[#0F2A35] mb-5 sm:mb-6"
            style={{ textWrap: 'balance' }}
          >
            The website that answers
            <br className="hidden lg:inline" />
            {' '}while you're on the job
          </h1>

          {/* Subtext: max-width 560px, centred, font-size 17-18px */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.6] text-[#5E6F77] max-w-[600px] mx-auto mb-5 sm:mb-6"
          >
            {HERO_CONTENT.subtext}
          </motion.p>

          {/* Mobile / Tablet Horizontal Ticker directly under subtext (< 1024px) */}
          <HorizontalTicker items={mixedMobileItems} />

          {/* Form Capsule: max-width 560px */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[560px] mb-2 sm:mb-3"
          >
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
              {/* Joined capsule on desktop, stacked on mobile */}
                <div className="w-full bg-white p-1.5 sm:p-2 rounded-full shadow-[0_8px_30px_rgba(15,42,53,0.08)] border border-[rgba(15,42,53,0.06)] flex flex-col sm:flex-row items-center gap-2">
                  <input
                    id="audit-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={HERO_CONTENT.emailPlaceholder}
                    required
                    className="w-full sm:flex-1 px-5 py-3 text-[15px] text-[#0F2A35] placeholder:text-[#5E6F77]/70 bg-transparent rounded-full focus:outline-none"
                    aria-label="Email address for 1-page website"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto h-[48px] px-6 bg-[#0F2A35] text-white text-[14px] font-medium rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center gap-2 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] cursor-pointer"
                  >
                    <span>{HERO_CONTENT.ctaText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Consent checkline: centred */}
                <div className="mt-3 flex items-center justify-center gap-2 text-[12px] sm:text-[13px] text-[#5E6F77]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1E4A5C] focus:ring-[#1E4A5C] border-gray-300 cursor-pointer accent-[#1E4A5C]"
                    />
                    <span>
                      We'll use your email only to reply about your 1-page website. No spam.{' '}
                      <button
                        type="button"
                        onClick={onOpenPrivacy}
                        className="underline text-[#1E4A5C] hover:text-[#0F2A35]"
                      >
                        Privacy policy
                      </button>
                      .
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <p className="mt-2 text-xs text-[#D9444A] font-medium text-center">{errorMessage}</p>
                )}
              </form>

              {/* CHANGE 2: Real-Client Proof Row directly under the email form and consent checkbox */}
              {validAvatars.length > 0 && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-full"
                >
                  {/* Overlapping Avatars */}
                  <div className="flex items-center justify-center pl-2.5 shrink-0">
                    {validAvatars.map((avatar, idx) => {
                      const hasNameOrBiz = Boolean(avatar.name?.trim() || avatar.business?.trim());
                      const altText = hasNameOrBiz
                        ? [avatar.name?.trim(), avatar.business?.trim()].filter(Boolean).join(', ')
                        : 'Open Hours client';

                      return (
                        <div
                          key={idx}
                          className={`relative group ${idx === 0 ? 'ml-0' : '-ml-[10px]'} hover:z-20 focus-within:z-30`}
                          style={{ zIndex: 10 - idx }}
                        >
                          <img
                            src={avatar.src || avatar.localSrc}
                            alt={altText}
                            width={42}
                            height={42}
                            loading="lazy"
                            tabIndex={hasNameOrBiz ? 0 : undefined}
                            onError={(e) => {
                              if (avatar.localSrc && e.currentTarget.src !== window.location.origin + avatar.localSrc && e.currentTarget.src !== avatar.localSrc) {
                                e.currentTarget.src = avatar.localSrc;
                              } else {
                                setFailedImages((prev) => ({ ...prev, [idx]: true }));
                              }
                            }}
                            className="w-[42px] h-[42px] rounded-full object-cover ring-2 ring-white shadow-sm shrink-0 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C]"
                            style={{ objectPosition: 'center top' }}
                          />

                          {hasNameOrBiz && (
                            <div
                              role="tooltip"
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#0F2A35] text-white text-[11px] font-medium rounded-md shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-40"
                            >
                              <span>
                                {[avatar.name?.trim(), avatar.business?.trim()].filter(Boolean).join(' · ')}
                              </span>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[#0F2A35]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Proof text */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    {config.heroProof.showStars && config.heroProof.ratingSourceUrl && (
                      <a
                        href={config.heroProof.ratingSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mb-1 text-amber-500 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1E4A5C] rounded-sm text-xs font-medium"
                        aria-label={config.heroProof.ratingLabel || '5 out of 5 stars'}
                      >
                        <div className="flex items-center gap-0.5" aria-hidden="true">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {config.heroProof.ratingLabel && (
                          <span className="text-[#5E6F77] text-[11px] ml-1">{config.heroProof.ratingLabel}</span>
                        )}
                      </a>
                    )}

                    <p className="text-[14px] sm:text-[15px] font-medium text-[#0F2A35] leading-snug">
                      {config.heroProof.line}
                    </p>

                    {hasReviewsSection && config.heroProof.linkText && (
                      <a
                        href="#reviews"
                        onClick={handleScrollToReviews}
                        className="inline-flex items-center gap-1 mt-0.5 text-[12px] sm:text-[13px] text-[#5E6F77] hover:text-[#0F2A35] transition-colors group/link focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1E4A5C] rounded-sm"
                      >
                        <span>{config.heroProof.linkText}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/link:translate-x-0.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
          </motion.div>
        </div>

        {/* Right Side Ticker (What your site does) */}
        <div className="relative hidden lg:block w-[216px] min-[1440px]:w-[240px] h-[600px]">
          <SideTicker
            items={HERO_TICKERS.right.items}
            direction="down"
            label={HERO_TICKERS.right.label}
            side="right"
          />
        </div>
      </div>

      {/* Centred Title Block directly ABOVE Mockup Card
          Spacing reduced to 40px (>= 1280px), 32px (768-1279px), 24px (mobile) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.07,
            },
          },
        }}
        className="flex flex-col items-center text-center mt-[48px] lg:mt-[72px] mb-[24px] md:mb-[32px] xl:mb-[40px] px-4 relative z-20"
      >
        <motion.span
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="inline-flex items-center text-[12px] font-semibold text-[#1E4A5C] bg-[#DCE9EC] tracking-[0.14em] uppercase px-[14px] py-[6px] rounded-full"
        >
          SEE IT WORK
        </motion.span>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="mt-[12px] text-[30px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-medium tracking-[-0.03em] leading-[1.12] text-[#0F2A35] max-w-[900px]"
          style={{ textWrap: 'balance' }}
        >
          Imagine seeing your website performing like this
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="mt-[12px] text-[15px] text-[#5E6F77] max-w-xl"
        >
          Quote requests, missed calls and messages, all in one simple inbox.
        </motion.p>
      </motion.div>

      {/* Hero Laptop Mockup (Animated Live Enquiry Inbox):
          - Sits entirely INSIDE the hero in normal document flow
          - max-w-[1000px] on desktop
          - Rise-in ends at resting position (y: 0) and never overlaps sub line */}
      <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-0"
        >
          {/* Laptop Shell */}
          <div className="bg-[#18262E] p-2.5 sm:p-4 rounded-t-[24px] sm:rounded-t-[32px] shadow-[0_25px_60px_-15px_rgba(15,42,53,0.35)] border border-[rgba(255,255,255,0.1)]">
            {/* Top Bar with Camera & Window Controls */}
            <div className="flex items-center justify-between px-3 py-1.5 sm:py-2 mb-2 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D9444A]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#E8943A]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#2E9E6B]/80" />
              </div>
              <div className="w-3 h-3 rounded-full bg-white/10" />
            </div>

            {/* Screen Display Container */}
            <div className="bg-white rounded-[16px] sm:rounded-[20px] overflow-hidden p-3 sm:p-6 shadow-inner text-left relative">
              <LiveMockup isRowSliding={setRowSliding} />
            </div>
          </div>

          {/* Laptop Base Stand */}
          <div className="bg-[#0C151B] h-3.5 sm:h-5 rounded-b-[18px] max-w-[102%] -mx-[1%] shadow-xl flex justify-center">
            <div className="w-20 sm:w-28 h-1 bg-white/20 rounded-b-md" />
          </div>

          {/* Always visible 12px muted line under mockup */}
          <p className="text-[12px] text-[#5E6F77] text-center mt-3">
            Illustrative example with sample data. Results vary by business.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
