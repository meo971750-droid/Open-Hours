import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Mail,
  PhoneCall,
  Clock,
  Loader2,
  MapPin,
} from 'lucide-react';
import {
  CTA_CONFIG,
  CONTACT,
  devPlaceholder,
  config,
} from '../content';
import { OH_DUR, OH_EASE } from '../lib/motion';

interface AboutProps {
  onOpenPrivacy?: () => void;
}

export default function About({ onOpenPrivacy }: AboutProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  // Form input state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const sectionRef = useRef<HTMLElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Clean config-backed values (hide empty fields, never show bracket placeholders)
  const cleanEmail = (() => {
    const candidate = config.email || CTA_CONFIG.email || CONTACT.email || '';
    if (!candidate || candidate.includes('[')) return '';
    return candidate.trim();
  })();

  const fallbackEmail = cleanEmail || devPlaceholder('hello@openhours.studio');

  const cleanPhone = (() => {
    const candidate = config.phone || '';
    if (!candidate || candidate.includes('[')) return '';
    return candidate.trim();
  })();

  const cleanAddress = (() => {
    const candidate = config.companyAddress || '';
    if (!candidate || candidate.includes('[')) return '';
    return candidate.trim();
  })();

  const cleanWorkingModel = (
    config.workingModelLine ||
    CTA_CONFIG.workingModelLine ||
    ''
  ).trim();

  const endpoint = (config.formEndpoint || CTA_CONFIG.formEndpoint || '').trim();
  const tradeOptions = (config.trades && config.trades.length > 0 ? config.trades : CTA_CONFIG.trades) || [];

  // Package option chips built dynamically from config.pricing.tiers
  const optionChips = [
    ...(config.pricing?.tiers || []).map((t) => {
      const hasSetup = typeof t.price === 'number' && t.price > 0;
      const hasMonthly = typeof t.monthlyPrice === 'number' && t.monthlyPrice > 0;
      const priceStr = hasSetup
        ? `from €${t.price.toLocaleString('en-IE')}${hasMonthly ? ` + €${t.monthlyPrice}/mo` : ''}`
        : '';
      return {
        id: t.id,
        label: t.name,
        price: priceStr,
      };
    }),
    { id: 'custom', label: 'Custom build', price: '' },
    { id: 'white-label', label: 'White label', price: '' },
    { id: 'not-sure', label: 'Not sure yet', price: '' },
  ];

  // Global Prefill listeners (from package cards, final CTA, design showcase buttons)
  useEffect(() => {
    const handleCustomPrefill = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.option) setSelectedOption(detail.option);
      if (detail?.message) setMessage(detail.message);
      if (detail?.trade) setSelectedTrade(detail.trade);
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        window.setTimeout(() => {
          (detail?.focusField === 'name' ? nameInputRef.current : messageInputRef.current)?.focus();
        }, 450);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement)?.closest('button, a');
      if (!btn) return;
      const text = (btn.textContent || '').trim();

      if (text.includes('Get a design like') || text.includes('Get a design')) {
        let designName = '';
        const card = btn.closest('article, [class*="card"], .group');
        if (card) {
          const titleEl = card.querySelector('h3, h4, [class*="font-semibold"]');
          if (titleEl) designName = (titleEl.textContent || '').trim();
        }
        if (!designName) {
          const match = text.match(/Get a design like\s+(.+)/i);
          if (match && match[1] && !match[1].toLowerCase().includes('this')) {
            designName = match[1].trim();
          }
        }
        setMessage(`I'd like a design like ${designName || 'this'}.`);
        setSelectedTrade('Roofers');

        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: 'smooth' });
          window.setTimeout(() => {
            messageInputRef.current?.focus();
          }, 550);
        }
        return;
      }
    };

    window.addEventListener('openhours:prefill-contact', handleCustomPrefill);
    document.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('openhours:prefill-contact', handleCustomPrefill);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Reused form submission handler (validation, honeypot, formEndpoint + mailto fallback)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot trap
    if (honeypot) return;

    const newErrors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your name.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!message.trim()) {
      newErrors.message = 'Please tell us a little about your business.';
    }
    if (!consent) {
      newErrors.consent = 'Please agree to be contacted about your enquiry.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatusMessage('Please correct the highlighted fields.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmissionError(null);
    setStatusMessage('Sending your enquiry...');

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      trade: selectedTrade,
      packageOption: selectedOption,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Never simulate success when endpoint is empty: fall back to mailto link
    if (!endpoint) {
      console.warn(
        'config.formEndpoint is not configured. Falling back to prefilled email client link.'
      );
      setIsSubmitting(false);

      const subject = `Enquiry from ${fullName.trim()}${
        selectedTrade ? ` (${selectedTrade})` : ''
      }`;
      const bodyLines = [
        `Name: ${fullName.trim()}`,
        `Email: ${email.trim()}`,
        phone.trim() ? `Phone/WhatsApp: ${phone.trim()}` : '',
        selectedTrade ? `Trade: ${selectedTrade}` : '',
        selectedOption ? `Interested in: ${selectedOption}` : '',
        '',
        'Business details & goals:',
        message.trim(),
      ].filter(Boolean);

      const mailtoUrl = `mailto:${encodeURIComponent(fallbackEmail)}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      window.location.href = mailtoUrl;

      setSubmissionError(
        `Your enquiry has been prepared in your email app. If it did not open automatically, please email ${fallbackEmail}.`
      );
      setStatusMessage('Enquiry opened in email client.');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      setIsSubmitted(true);
      setStatusMessage('Enquiry received successfully.');
    } catch (err) {
      console.error('Failed to submit enquiry form:', err);
      setSubmissionError(
        `Could not deliver your enquiry right now. Please email us directly at ${fallbackEmail}.`
      );
      setStatusMessage('Submission error. Please email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstName = fullName.trim().split(' ')[0] || 'there';

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="oh-cv-auto oh-grain-dark relative w-full bg-[#050E0D] text-white py-24 sm:py-28 md:py-36 overflow-x-clip"
    >
      {/* Top & Bottom Light-to-Dark Soft Gradient Boundary Bleeds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#F3F5F3]/12 to-transparent z-[1]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#F3F5F3]/12 to-transparent z-[1]"
      />
      {/* Preserved anchor aliases for smooth scrolling */}
      <div id="about" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />
      <div id="who-we-are" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />

      <style>{`
        @keyframes contactCircuitPulse {
          0% { stroke-dashoffset: 1.2; }
          100% { stroke-dashoffset: -0.35; }
        }
        .contact-circuit-pulse {
          stroke-dasharray: 0.22 1;
          animation: contactCircuitPulse 5.2s linear infinite;
          will-change: stroke-dashoffset;
        }
        @media (prefers-reduced-motion: reduce) {
          .contact-circuit-pulse {
            animation: none !important;
            stroke-dashoffset: 0.4 !important;
          }
        }
      `}</style>

      {/* Top-Centre Soft Green-Teal Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1200px] h-[440px] sm:h-[520px] z-0"
        style={{
          background:
            'radial-gradient(ellipse 68% 60% at 50% 0%, rgba(20, 87, 76, 0.42) 0%, rgba(15, 47, 43, 0.22) 46%, transparent 78%)',
        }}
      />

      {/* Top-Left Thin Circuit Lines with Round Nodes (inline SVG, 1px) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 280 180"
        fill="none"
        className="pointer-events-none hidden sm:block absolute top-0 left-0 w-[200px] md:w-[270px] h-auto z-0 opacity-90"
      >
        <path
          d="M 0 38 L 58 96 L 164 96"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          pathLength="1"
          d="M 0 38 L 58 96 L 164 96"
          stroke="#A8EBD3"
          strokeOpacity="0.85"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="contact-circuit-pulse"
        />
        <path
          d="M 28 0 L 76 48"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="164" cy="96" r="3.5" fill="#050E0D" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
        <circle cx="76" cy="48" r="3.5" fill="#050E0D" stroke="rgba(255,255,255,0.24)" strokeWidth="1" />
      </svg>

      {/* Top-Right Thin Circuit Lines with Round Nodes */}
      <svg
        aria-hidden="true"
        viewBox="0 0 280 180"
        fill="none"
        className="pointer-events-none hidden sm:block absolute top-0 right-0 w-[200px] md:w-[270px] h-auto z-0 opacity-90"
      >
        <path
          d="M 280 42 L 222 100 L 116 100"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 252 0 L 200 52 L 154 52"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="116" cy="100" r="3.5" fill="#050E0D" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
        <circle cx="154" cy="52" r="3.5" fill="#050E0D" stroke="rgba(255,255,255,0.24)" strokeWidth="1" />
      </svg>

      {/* Giant Faded Condensed "CONTACT" Watermark Behind Content */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-4 sm:top-6 inset-x-0 flex justify-center overflow-hidden z-0"
      >
        <span
          className="font-heading font-extrabold uppercase leading-[0.86] tracking-[0.04em] whitespace-nowrap text-transparent bg-clip-text"
          style={{
            fontSize: 'clamp(64px, 17vw, 224px)',
            backgroundImage:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.04) 55%, rgba(255, 255, 255, 0) 95%)',
          }}
        >
          CONTACT
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT COLUMN: Pill, Heading, Line & Stacked Info Cards */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="inline-flex items-center self-start gap-2 rounded-full bg-white/[0.06] border border-white/[0.14] px-3.5 py-1.5 text-[13px] font-medium text-white/90 mb-5">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#A8EBD3]">
                <PhoneCall className="w-3 h-3" aria-hidden="true" />
              </span>
              <span>Free intro call</span>
            </div>

            <h2
              id="contact-heading"
              className="font-heading text-[36px] sm:text-[44px] font-medium tracking-[-0.025em] leading-[1.08] text-white mb-3"
            >
              <span className="oh-line-mask">
                <span className="oh-line-reveal">Get in touch</span>
              </span>
            </h2>

            <p className="text-[15px] leading-[1.6] text-white/75 max-w-[38ch] mb-8">
              {config.contactSubtitle ||
                'Tell us about your business and we will reply in writing.'}
            </p>

            {/* Stacked Info Cards */}
            <div className="space-y-3.5">
              {/* Card 1: Email us */}
              {cleanEmail && (
                <a
                  href={`mailto:${cleanEmail}`}
                  data-spotlight=""
                  className="oh-dark-card group flex items-center justify-between gap-4 rounded-[20px] p-4 sm:p-5 transition-[transform,filter] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:brightness-110 active:scale-[0.98]"
                >
                  <div className="relative z-[3] flex items-center gap-3.5 min-w-0">
                    <span className="w-11 h-11 rounded-[12px] bg-white/[0.06] border border-white/[0.14] flex items-center justify-center text-[#A8EBD3] shrink-0">
                      <Mail className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-normal text-white/75 leading-snug">
                        Email us
                      </p>
                      <p className="text-[15px] font-medium text-white truncate mt-0.5">
                        {cleanEmail}
                      </p>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="relative z-[3] w-9 h-9 rounded-full bg-white/[0.08] border border-white/14 flex items-center justify-center text-white/90 shrink-0 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:bg-[#14624F] group-hover:text-white"
                  >
                    <ArrowUpRight className="w-4 h-4 oh-arrow-45" strokeWidth={1.5} />
                  </span>
                </a>
              )}

              {/* Card 2: Call us (hidden cleanly if config.phone is empty) */}
              {cleanPhone && (
                <a
                  href={`tel:${cleanPhone}`}
                  data-spotlight=""
                  className="oh-dark-card group flex items-center justify-between gap-4 rounded-[20px] p-4 sm:p-5 transition-[transform,filter] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:brightness-110 active:scale-[0.98]"
                >
                  <div className="relative z-[3] flex items-center gap-3.5 min-w-0">
                    <span className="w-11 h-11 rounded-[12px] bg-white/[0.06] border border-white/[0.14] flex items-center justify-center text-[#A8EBD3] shrink-0">
                      <PhoneCall className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-normal text-white/75 leading-snug">
                        Call us
                      </p>
                      <p className="text-[15px] font-medium text-white truncate mt-0.5 tabular-nums">
                        {cleanPhone}
                      </p>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="relative z-[3] w-9 h-9 rounded-full bg-white/[0.08] border border-white/14 flex items-center justify-center text-white/90 shrink-0 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:bg-[#14624F] group-hover:text-white"
                  >
                    <ArrowUpRight className="w-4 h-4 oh-arrow-45" strokeWidth={1.5} />
                  </span>
                </a>
              )}

              {/* Card 3: Our location ONLY if config.companyAddress is filled; otherwise Working hours */}
              {cleanAddress ? (
                <div
                  data-spotlight=""
                  className="oh-dark-card group flex items-center justify-between gap-4 rounded-[20px] p-4 sm:p-5 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  <div className="relative z-[3] flex items-center gap-3.5 min-w-0">
                    <span className="w-11 h-11 rounded-[12px] bg-white/[0.06] border border-white/[0.14] flex items-center justify-center text-[#A8EBD3] shrink-0">
                      <MapPin className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-normal text-white/75 leading-snug">
                        Our location
                      </p>
                      <p className="text-[15px] font-medium text-white leading-snug mt-0.5">
                        {cleanAddress}
                      </p>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="relative z-[3] w-9 h-9 rounded-full bg-white/[0.08] border border-white/14 flex items-center justify-center text-white/90 shrink-0"
                  >
                    <ArrowUpRight className="w-4 h-4 oh-arrow-45" strokeWidth={1.5} />
                  </span>
                </div>
              ) : cleanWorkingModel ? (
                <button
                  type="button"
                  onClick={() => nameInputRef.current?.focus()}
                  data-spotlight=""
                  className="oh-dark-card group w-full text-left flex items-center justify-between gap-4 rounded-[20px] p-4 sm:p-5 transition-[transform,filter] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:brightness-110 active:scale-[0.98] cursor-pointer"
                >
                  <div className="relative z-[3] flex items-center gap-3.5 min-w-0">
                    <span className="w-11 h-11 rounded-[12px] bg-white/[0.06] border border-white/[0.14] flex items-center justify-center text-[#A8EBD3] shrink-0">
                      <Clock className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-normal text-white/75 leading-snug">
                        Working hours
                      </p>
                      <p className="text-[15px] font-medium text-white leading-snug mt-0.5">
                        {cleanWorkingModel}
                      </p>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="relative z-[3] w-9 h-9 rounded-full bg-white/[0.08] border border-white/14 flex items-center justify-center text-white/90 shrink-0 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:bg-[#14624F] group-hover:text-white"
                  >
                    <ArrowUpRight className="w-4 h-4 oh-arrow-45" strokeWidth={1.5} />
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          {/* RIGHT COLUMN: Glass Form Panel */}
          <div className="lg:col-span-7">
            <div
              data-spotlight=""
              className="oh-dark-card rounded-[28px] p-5 sm:p-7 backdrop-blur-md"
            >
              {isSubmitted ? (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: OH_DUR.base, ease: OH_EASE }}
                  role="status"
                  aria-live="polite"
                  className="relative z-[3] flex flex-col items-center justify-center text-center py-12 px-4"
                >
                  <div className="w-14 h-14 rounded-full bg-[#14624F]/35 border border-[#6FD6B0] text-[#A8EBD3] flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-white mb-3">
                    Thanks, {firstName}. We&apos;ve received your enquiry.
                  </h3>
                  <p className="text-white/75 text-[15px] max-w-md">
                    {config.responseTime && config.responseTime.trim()
                      ? `We will reply in writing within ${config.responseTime.trim()}.`
                      : 'We will review your details and reply in writing shortly.'}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="relative z-[3] space-y-4">
                  {/* Accessible status live region */}
                  <div aria-live="polite" className="sr-only">
                    {statusMessage}
                  </div>

                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="_openhours_hp"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* Name */}
                  <div>
                    <label htmlFor="cta-name" className="block text-[12.5px] font-medium text-white/88 mb-1.5">
                      Name
                    </label>
                    <input
                      id="cta-name"
                      name="fullName"
                      autoComplete="name"
                      ref={nameInputRef}
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                      }}
                      onBlur={() => {
                        if (!fullName.trim() || fullName.trim().length < 2) {
                          setErrors((prev) => ({ ...prev, fullName: 'Please enter your name.' }));
                        }
                      }}
                      placeholder="Your full name"
                      className="w-full h-12 px-4 rounded-[12px] bg-[#050E0D]/90 border border-white/[0.16] text-[15px] text-white placeholder:text-white/75 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:border-[#6FD6B0]"
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'cta-name-error' : undefined}
                    />
                    {errors.fullName && (
                      <p id="cta-name-error" role="alert" className="text-xs text-[#FCA5A5] mt-1.5 font-medium">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone (optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="cta-email" className="block text-[12.5px] font-medium text-white/88 mb-1.5">
                        Email
                      </label>
                      <input
                        id="cta-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        onBlur={() => {
                          if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                            setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
                          }
                        }}
                        placeholder="you@yourtrade.ie"
                        className="w-full h-12 px-4 rounded-[12px] bg-[#050E0D]/90 border border-white/[0.16] text-[15px] text-white placeholder:text-white/75 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:border-[#6FD6B0]"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'cta-email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="cta-email-error" role="alert" className="text-xs text-[#FCA5A5] mt-1.5 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="cta-phone" className="block text-[12.5px] font-medium text-white/88 mb-1.5">
                        Phone <span className="text-white/70 font-normal">(optional)</span>
                      </label>
                      <input
                        id="cta-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="087 123 4567"
                        className="w-full h-12 px-4 rounded-[12px] bg-[#050E0D]/90 border border-white/[0.16] text-[15px] text-white placeholder:text-white/75 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:border-[#6FD6B0]"
                      />
                    </div>
                  </div>

                  {/* Trade Chips */}
                  {tradeOptions.length > 0 && (
                    <div className="pt-1">
                      <span className="block text-[12.5px] font-medium text-white/88 mb-2">
                        What&apos;s your trade?
                      </span>
                      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Trade selection">
                        {tradeOptions.map((trade) => {
                          const isSelected = selectedTrade === trade;
                          return (
                            <button
                              key={trade}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => setSelectedTrade(isSelected ? '' : trade)}
                              className={`px-3 py-1.5 rounded-[12px] text-[12.5px] border transition-[colors,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer ${
                                isSelected
                                  ? 'border-[#6FD6B0] bg-[#14624F]/45 text-[#A8EBD3] font-semibold'
                                  : 'border-white/[0.16] bg-[#050E0D]/75 text-white/88 hover:border-white/35 hover:text-white'
                              }`}
                            >
                              {trade}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          role="radio"
                          aria-checked={selectedTrade === 'Other'}
                          onClick={() => setSelectedTrade(selectedTrade === 'Other' ? '' : 'Other')}
                          className={`px-3 py-1.5 rounded-[12px] text-[12.5px] border transition-[colors,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer ${
                            selectedTrade === 'Other'
                              ? 'border-[#6FD6B0] bg-[#14624F]/45 text-[#A8EBD3] font-semibold'
                              : 'border-white/[0.16] bg-[#050E0D]/75 text-white/88 hover:border-white/35 hover:text-white'
                          }`}
                        >
                          Other
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Package Chips */}
                  <div className="pt-0.5">
                    <span className="block text-[12.5px] font-medium text-white/88 mb-2">
                      Which option interests you?
                    </span>
                    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Package option selection">
                      {optionChips.map((chip) => {
                        const isSelected = selectedOption === chip.label;
                        return (
                          <button
                            key={chip.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setSelectedOption(isSelected ? '' : chip.label)}
                            className={`px-3 py-1.5 rounded-[12px] text-[12.5px] border transition-[colors,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer ${
                              isSelected
                                ? 'border-[#6FD6B0] bg-[#14624F]/45 text-[#A8EBD3] font-semibold'
                                : 'border-white/[0.16] bg-[#050E0D]/75 text-white/88 hover:border-white/35 hover:text-white'
                            }`}
                          >
                            <span>{chip.label}</span>
                            {chip.price && (
                              <span className="opacity-85 ml-1 font-normal tabular-nums">({chip.price})</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="pt-1">
                    <label htmlFor="cta-message" className="block text-[12.5px] font-medium text-white/88 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="cta-message"
                      name="message"
                      ref={messageInputRef}
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                      }}
                      onBlur={() => {
                        if (!message.trim()) {
                          setErrors((prev) => ({ ...prev, message: 'Please tell us a little about your business.' }));
                        }
                      }}
                      placeholder="Tell us your trade, your area, and what you need"
                      className="w-full p-4 rounded-[12px] bg-[#050E0D]/90 border border-white/[0.16] text-[15px] text-white placeholder:text-white/75 resize-y min-h-[120px] transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:border-[#6FD6B0]"
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'cta-message-error' : undefined}
                    />
                    {errors.message && (
                      <p id="cta-message-error" role="alert" className="text-xs text-[#FCA5A5] mt-1.5 font-medium">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Consent Checkbox */}
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }));
                        }}
                        className="mt-1 h-4 w-4 rounded border-white/30 bg-[#050E0D] accent-[#1E9E6A] cursor-pointer shrink-0"
                      />
                      <span className="text-[12.5px] text-white/85 leading-normal">
                        I agree to be contacted about my enquiry. See the{' '}
                        <a
                          href={CTA_CONFIG.privacyPolicyUrl || '#privacy'}
                          onClick={(e) => {
                            if (onOpenPrivacy) {
                              e.preventDefault();
                              onOpenPrivacy();
                            }
                          }}
                          className="text-[#A8EBD3] underline hover:text-white transition-colors rounded-xs"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                    {errors.consent && (
                      <p role="alert" className="text-xs text-[#FCA5A5] mt-1.5 font-medium">
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {/* Honest Submission / Mailto Fallback Alert */}
                  {submissionError && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="p-3.5 rounded-[12px] bg-[#14624F]/30 border border-[#6FD6B0]/45 text-[#A8EBD3] text-[13px] leading-relaxed"
                    >
                      {submissionError}
                    </div>
                  )}

                  {/* Full-Width Single-Accent Primary Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="oh-btn-pill oh-magnetic oh-btn-primary w-full h-12 rounded-full text-[15px] font-semibold cursor-pointer disabled:opacity-60"
                    >
                      <span>{isSubmitting ? 'Sending...' : 'Submit'}</span>
                      <span className="oh-btn-arrow-circle bg-white/15 text-white">
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                        ) : (
                          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
