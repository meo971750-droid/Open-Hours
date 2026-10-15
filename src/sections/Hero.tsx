import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ChevronsRight,
  ArrowRight,
  Check,
  Zap,
  Clock,
  Lock,
} from 'lucide-react';
import SideTicker, { HorizontalTicker } from '../components/SideTicker';
import { HERO_CONTENT, HERO_TICKERS, DELIVERY } from '../content';
import { CONFIG } from '../config';

interface HeroProps {
  onOpenPrivacy?: () => void;
  onOpenAudit?: (email?: string) => void;
}

export default function Hero({ onOpenPrivacy, onOpenAudit }: HeroProps) {
  const [email, setEmail] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rowSliding, setRowSliding] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

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
            The website that catches your enquiries
            <br className="hidden lg:inline" />
            {' '}while you're on the job.
          </h1>

          {/* Subtext: max-width 560px, centred, font-size 17-18px */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.6] text-[#5E6F77] max-w-[600px] mx-auto mb-5 sm:mb-6"
          >
            {CONFIG.hero.subtext}
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

                {/* Centred row of three small chips: 20px below consent line, wraps on mobile */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                  <div className="inline-flex items-center gap-1.5 px-[14px] py-[8px] rounded-[999px] bg-[#DCE9EC] text-[#1E4A5C] text-[14px] font-semibold">
                    <Zap className="w-4 h-4 text-[#1E4A5C] shrink-0" />
                    <span>Concept in about {DELIVERY.conceptWorkingDays} working days</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-[14px] py-[8px] rounded-[999px] bg-[#DCE9EC] text-[#1E4A5C] text-[14px] font-semibold">
                    <Clock className="w-4 h-4 text-[#1E4A5C] shrink-0" />
                    <span>Live in about {DELIVERY.liveWorkingDays} working days</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-[14px] py-[8px] rounded-[999px] bg-[#DCE9EC] text-[#1E4A5C] text-[14px] font-semibold">
                    <Lock className="w-4 h-4 text-[#1E4A5C] shrink-0" />
                    <span>Fixed price</span>
                  </div>
                </div>
              </form>
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
    </section>
  );
}
