import React, { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { LogoMark } from '../components/Logo';
import { config } from '../config';
import { CTA_CONFIG, CONTACT, devPlaceholder } from '../content';
import { useAnimationInView } from '../hooks/useAnimationInView';
import { preloadSectionAndNext } from '../components/LazySection';

interface FinalCTAProps {
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
}

export default function FinalCTA({ onOpenAudit, onOpenPrivacy }: FinalCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useAnimationInView(sectionRef, false);
  const [quickEmail, setQuickEmail] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fallbackNotice, setFallbackNotice] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const tiers = config.pricing?.tiers || [];
  const ctaSubline =
    config.cta?.text || "Let's see what customers find when they look for your trade.";
  const responseTime = (config.responseTime || CTA_CONFIG.responseTime || '').trim();
  const endpoint = (config.formEndpoint || CTA_CONFIG.formEndpoint || '').trim();

  const cleanEmail = (() => {
    const candidate = config.email || CTA_CONFIG.email || CONTACT.email || '';
    if (!candidate || candidate.includes('[')) return '';
    return candidate.trim();
  })();
  const fallbackEmail = cleanEmail || devPlaceholder('hello@openhours.studio');

  const handleOpenContact = (tier?: (typeof tiers)[number]) => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      const detail = tier
        ? {
            option: tier.name,
            message: `I'm interested in the ${tier.name} package (from €${tier.price.toLocaleString('en-IE')}${
              typeof tier.monthlyPrice === 'number' && tier.monthlyPrice > 0
                ? ` + €${tier.monthlyPrice}/month`
                : ''
            }).`,
          }
        : { focusField: 'name' };
      (window as Window & { __ohPendingContactPrefill?: unknown }).__ohPendingContactPrefill = detail;
      preloadSectionAndNext('contact', 'faq');
      window.dispatchEvent(new CustomEvent('openhours:prefill-contact', { detail }));
      contactEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Fallback when rendered on a subpage without #contact
    onOpenAudit?.();
  };

  const handleQuickEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFallbackNotice('');

    if (honeypot) return;

    const trimmed = quickEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMessage('Please enter a valid email address.');
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    if (!consentAccepted) {
      setErrorMessage('Please tick the box to confirm we can reply to your email.');
      setStatusMessage('Consent required before sending.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Sending your email...');

    // Never simulate success if endpoint is empty: use mailto fallback
    if (!endpoint) {
      console.warn(
        'config.formEndpoint is not configured. Falling back to prefilled email client link.'
      );
      setIsSubmitting(false);

      const subject = 'Website enquiry — Open Hours';
      const body = `Hi Open Hours,\n\nPlease reply to ${trimmed} about a new website for my business.`;
      window.location.href = `mailto:${encodeURIComponent(
        fallbackEmail
      )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      setFallbackNotice(
        `Your reply request was prepared in your email app. If it did not open automatically, please email ${fallbackEmail}.`
      );
      setStatusMessage('Enquiry opened in email client.');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          source: 'final-cta-quick-email',
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      setIsSubmitted(true);
      setStatusMessage('Email received. We will reply shortly.');
    } catch (err) {
      console.error('Failed to submit final CTA email:', err);
      setFallbackNotice(
        `Could not send right now. Please email us directly at ${fallbackEmail}.`
      );
      setStatusMessage('Submission error. Please email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="final-cta"
      ref={sectionRef}
      aria-labelledby="final-cta-heading"
      className="oh-cv-auto oh-anim-paused oh-grain-dark relative w-full bg-[#050E0D] text-white py-20 sm:py-28 px-4 sm:px-6 overflow-x-clip"
    >
      {/* Top Light-to-Dark Soft Gradient Boundary Bleed */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#F3F5F3]/12 to-transparent z-[1]"
      />
      <style>{`
        @keyframes finalCtaLogoPulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1.04);
          }
        }
        .final-cta-logo-pulse {
          animation: finalCtaLogoPulse 4s ease-in-out infinite;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .final-cta-logo-pulse {
            animation: none !important;
            transform: none !important;
            opacity: 0.85 !important;
          }
        }
      `}</style>

      {/* Main Luminous Panel Wrapper (filter-free radial mint side edge glows) */}
      <div className="relative z-10 max-w-[1000px] mx-auto">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[12%] -left-16 sm:-left-28 w-72 sm:w-96 h-80 sm:h-96 rounded-full z-0"
          style={{
            background:
              'radial-gradient(circle, rgba(63, 209, 165, 0.28) 0%, rgba(20, 98, 79, 0.14) 45%, transparent 72%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[12%] -right-16 sm:-right-28 w-72 sm:w-96 h-80 sm:h-96 rounded-full z-0"
          style={{
            background:
              'radial-gradient(circle, rgba(63, 209, 165, 0.28) 0%, rgba(20, 98, 79, 0.14) 45%, transparent 72%)',
          }}
        />

        {/* Wide Glass Panel (radius 28px, dark green AA contrast behind white text) */}
        <div
          data-spotlight=""
          className="oh-dark-card relative z-10 rounded-[28px] overflow-hidden px-6 sm:px-12 py-14 sm:py-20 text-center shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
          style={{
            background:
              'radial-gradient(ellipse 76% 36% at 50% 0%, rgba(63, 209, 165, 0.28) 0%, transparent 72%), linear-gradient(180deg, #0F4A3E 0%, #0A3A30 46%, #050E0D 100%)',
          }}
        >
          {/* Subtle Dot-Grid Pattern Fading Downwards */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
              WebkitMaskImage:
                'linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 52%, transparent 82%)',
              maskImage:
                'linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 52%, transparent 82%)',
            }}
          />

          <div className="relative z-[3] flex flex-col items-center">
            {/* Rounded-Square Glass Logo Tile (~88px) with Slow 4s Pre-Softened Pulse */}
            <div className="relative mb-8 flex items-center justify-center">
              <div
                aria-hidden="true"
                className="final-cta-logo-pulse pointer-events-none absolute -inset-6 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(168, 235, 211, 0.36) 0%, rgba(63, 209, 165, 0.14) 46%, transparent 72%)',
                }}
              />
              <div className="relative w-[88px] h-[88px] rounded-[20px] bg-[#0A3A30]/95 border border-white/28 shadow-[inset_0_1px_1px_rgba(255,255,255,0.36),0_16px_40px_rgba(5,14,13,0.45)] flex items-center justify-center">
                <LogoMark size={44} variant="light" />
              </div>
            </div>

            {/* Heading (~44px) */}
            <h2
              id="final-cta-heading"
              className="font-heading text-[30px] sm:text-[44px] font-medium tracking-[-0.025em] leading-[1.1] text-white max-w-[18ch] mb-4"
              style={{ textShadow: '0 2px 10px rgba(5,14,13,0.35)' }}
            >
              <span className="oh-line-mask">
                <span className="oh-line-reveal">Ready to talk about your new website?</span>
              </span>
            </h2>

            {/* Supporting Line */}
            {ctaSubline && (
              <p className="text-[15px] sm:text-[17px] leading-[1.55] text-white/88 max-w-[46ch] mb-8">
                {ctaSubline}
              </p>
            )}

            {/* Pill Button with Single Green Accent & Arrow Circle */}
            <button
              type="button"
              onClick={() => handleOpenContact()}
              className="oh-btn-pill oh-magnetic oh-btn-primary group pl-7 pr-4 text-[15px] font-semibold border border-[#6FD6B0]/40 cursor-pointer"
            >
              <span>Talk to Us</span>
              <span className="oh-btn-arrow-circle bg-white/15 text-white">
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </span>
            </button>

            {/* Small Package "from" Price Chips Read Dynamically from config.pricing.tiers */}
            {tiers.length > 0 && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                {tiers.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleOpenContact(tier)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] active:scale-[0.98] border border-white/18 text-[12.5px] font-medium text-white/92 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
                  >
                    <span>{tier.name}</span>
                    {typeof tier.price === 'number' && tier.price > 0 && (
                      <span className="text-[#A8EBD3] tabular-nums">
                        from &euro;{tier.price.toLocaleString('en-IE')}
                        {typeof tier.monthlyPrice === 'number' && tier.monthlyPrice > 0
                          ? ` + €${tier.monthlyPrice}/mo`
                          : ''}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lower Two-Column Row Below Panel (PREFER EMAIL?) */}
      <div className="relative z-10 max-w-[1000px] mx-auto mt-14 sm:mt-16 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
          {/* Left Info Block */}
          <div className="md:col-span-6">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75 mb-2">
              PREFER EMAIL?
            </span>
            <h3 className="font-heading text-[24px] sm:text-[28px] font-medium tracking-[-0.02em] leading-[1.18] text-white mb-2">
              Leave your email and we will reply
            </h3>
            {responseTime && (
              <p className="text-[14px] sm:text-[15px] leading-[1.55] text-white/75 max-w-[40ch]">
                We reply within {responseTime} on business days with clear next steps.
              </p>
            )}
          </div>

          {/* Right Quick Email Form */}
          <div className="md:col-span-6">
            {isSubmitted ? (
              <div
                role="status"
                aria-live="polite"
                className="oh-scale-in rounded-[20px] bg-white/[0.05] border border-[#6FD6B0]/45 p-4 sm:p-5 flex items-center gap-3 text-white"
              >
                <CheckCircle2 className="w-5 h-5 text-[#A8EBD3] shrink-0" strokeWidth={1.5} />
                <span className="text-[14px] text-white/90">
                  Thanks &mdash; we&apos;ve logged {quickEmail.trim()} and will reply in writing.
                </span>
              </div>
            ) : (
              <form onSubmit={handleQuickEmailSubmit} noValidate className="space-y-3">
                <div aria-live="polite" className="sr-only">
                  {statusMessage}
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  name="_openhours_quick_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <label
                  htmlFor="final-cta-email"
                  className="block text-[13px] font-medium text-white/88"
                >
                  Email
                </label>

                <div className="flex items-center gap-2 rounded-[12px] bg-white/[0.05] border border-white/[0.16] p-1.5 focus-within:border-[#6FD6B0] transition-colors">
                  <Mail className="w-4 h-4 text-white/75 ml-2.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <input
                    id="final-cta-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={quickEmail}
                    onChange={(e) => {
                      setQuickEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    onBlur={() => {
                      const trimmed = quickEmail.trim();
                      if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                        setErrorMessage('Please enter a valid email address.');
                      }
                    }}
                    placeholder="Enter your email"
                    className="w-full min-w-0 h-9 px-2 bg-transparent text-[14.5px] text-white placeholder:text-white/75 rounded-md"
                    aria-invalid={Boolean(errorMessage)}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9 px-4 rounded-[10px] bg-[#14624F] hover:bg-[#14735A] active:scale-[0.98] text-white text-[13px] font-semibold border border-[#6FD6B0]/35 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shrink-0"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />}
                    <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>

                {/* Same Consent Checkbox & Text */}
                <label className="flex items-start gap-2 cursor-pointer select-none text-[12.5px] text-white/85">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => {
                      setConsentAccepted(e.target.checked);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-white/30 bg-[#050E0D] accent-[#1E9E6A] cursor-pointer shrink-0"
                  />
                  <span>
                    We&apos;ll use your email only to reply to your enquiry. No spam.{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="underline text-[#A8EBD3] hover:text-white transition-colors cursor-pointer rounded-xs"
                    >
                      Privacy policy
                    </button>
                    .
                  </span>
                </label>

                {errorMessage && (
                  <p role="alert" className="text-xs text-[#FCA5A5] font-medium">
                    {errorMessage}
                  </p>
                )}

                {fallbackNotice && (
                  <div
                    role="status"
                    className="p-3 rounded-[12px] bg-[#14624F]/30 border border-[#6FD6B0]/45 text-[12.5px] text-[#A8EBD3] leading-relaxed"
                  >
                    {fallbackNotice}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
