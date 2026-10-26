import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ArrowRight, ArrowUpRight, MessageCircle, Clock } from 'lucide-react';
import Container from '../components/Container';
import {
  CTA_CONFIG,
  FOUNDER,
  CONTACT,
  SETUP_FROM,
  devPlaceholder,
  whatsappLink,
  config,
} from '../content';

interface AboutProps {
  onOpenPrivacy?: () => void;
}

export default function About({ onOpenPrivacy }: AboutProps) {
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
  const [imageError, setImageError] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Fallback email address
  const fallbackEmail = devPlaceholder(
    CTA_CONFIG.email || CONTACT.email || 'hello@openhours.studio'
  );

  // Clean WhatsApp number
  const cleanWhatsapp =
    CTA_CONFIG.whatsapp && !CTA_CONFIG.whatsapp.startsWith('[')
      ? CTA_CONFIG.whatsapp
      : CONTACT.whatsappNumber && !CONTACT.whatsappNumber.startsWith('[')
      ? CONTACT.whatsappNumber
      : '';

  // Clean booking URL
  const cleanBookingUrl =
    CTA_CONFIG.bookingUrl && !CTA_CONFIG.bookingUrl.startsWith('[')
      ? CTA_CONFIG.bookingUrl
      : '';

  // Checklist points logic:
  // If config.responseTime is set, add it as first item and keep list to 3 items by dropping the last default.
  // Never show a response time that is not in config.
  const checklistPoints = (() => {
    const base = [...CTA_CONFIG.cta.points];
    if (CTA_CONFIG.responseTime && CTA_CONFIG.responseTime.trim()) {
      return [
        `I reply within ${CTA_CONFIG.responseTime.trim()} on business days`,
        base[0],
        base[1],
      ].filter(Boolean);
    }
    return base.slice(0, 3);
  })();

  // Option chips built from normal pricing config tiers (never hard-coded, no free chips)
  const optionChips = [
    ...(config.pricing?.tiers || []).map((t) => ({
      id: t.id,
      label: t.name,
      price: `from €${t.price}`,
    })),
    { id: 'custom', label: 'Custom build', price: '' },
    { id: 'not-sure', label: 'Not sure yet', price: '' },
  ];

  // Global Prefill listener:
  // "Get a design like this" buttons and case-study cards scroll here and prefill message and trade.
  // Pricing buttons preselect the matching option chip.
  useEffect(() => {
    const handleCustomPrefill = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.option) setSelectedOption(detail.option);
      if (detail?.message) setMessage(detail.message);
      if (detail?.trade) setSelectedTrade(detail.trade);
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          messageInputRef.current?.focus();
        }, 500);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement)?.closest('button, a');
      if (!btn) return;
      const text = (btn.textContent || '').trim();

      // Check if "Get a design like..." was clicked
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
        if (!designName) {
          designName = 'this';
        }

        setMessage(`I'd like a design like ${designName}.`);
        setSelectedTrade('Roofers');

        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            messageInputRef.current?.focus();
          }, 600);
        }
        return;
      }

      // Check if a pricing tier button was clicked
      const pricingSection = btn.closest('#pricing');
      if (pricingSection) {
        const tierCard = btn.closest('article, .relative, [class*="rounded"]');
        const content = (tierCard?.textContent || '') + ' ' + text;
        if (/custom|request this quote/i.test(content)) {
          setSelectedOption('Custom build');
        } else if (/growth/i.test(content)) {
          setSelectedOption('Growth');
          setMessage("I'm interested in the Growth package.");
        } else if (/standard/i.test(content)) {
          setSelectedOption('Standard');
          setMessage("I'm interested in the Standard package.");
        } else if (/starter/i.test(content)) {
          setSelectedOption('Starter');
          setMessage("I'm interested in the Starter package.");
        } else if (/1-page|free/i.test(content)) {
          setSelectedOption('1-Page starter');
        }
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('openhours:prefill-contact', handleCustomPrefill);
    document.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('openhours:prefill-contact', handleCustomPrefill);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot trap
    if (honeypot) return;

    const newErrors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!message.trim()) {
      newErrors.message = 'Please tell me a little about your business.';
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

    // If config.formEndpoint is empty:
    // IMPORTANT: never simulate success. Fall back to opening mailto: link, and console.warn.
    if (!CTA_CONFIG.formEndpoint || !CTA_CONFIG.formEndpoint.trim()) {
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
        `Form connection is pending setup. Your enquiry was prepared in your email client. If it did not open, please send an email directly to ${fallbackEmail}.`
      );
      setStatusMessage('Enquiry opened in email client.');
      return;
    }

    // Submit with fetch POST
    try {
      const response = await fetch(CTA_CONFIG.formEndpoint, {
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
        `Could not deliver your enquiry right now. Please email directly to ${fallbackEmail}.`
      );
      setStatusMessage('Submission error. Please email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Headline rendering with italic accent phrase
  const renderHeadline = (headline: string) => {
    const match = headline.match(/\*(.*?)\*/);
    if (match) {
      const parts = headline.split(match[0]);
      return (
        <>
          {parts[0]}
          <span className="font-serif italic font-normal text-[#E3B896]">
            {match[1]}
          </span>
          {parts[1]}
        </>
      );
    }
    const phrase = 'new website';
    if (headline.includes(phrase)) {
      const [before, after] = headline.split(phrase);
      return (
        <>
          {before}
          <span className="font-serif italic font-normal text-[#E3B896]">
            {phrase}
          </span>
          {after}
        </>
      );
    }
    return headline;
  };

  const firstName = fullName.trim().split(' ')[0] || 'there';

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 md:py-28 bg-white scroll-mt-20 overflow-hidden"
    >
      {/* Anchor targets for seamless scroll links */}
      <div id="final-cta" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />
      <div id="contact" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />
      <div id="who-we-are" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />

      <Container>
        {/* Large dark panel using site's existing dark teal tokens */}
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#0F2A35] p-7 sm:p-10 md:p-14 lg:p-16 border border-white/10 shadow-2xl overflow-hidden text-white">
          {/* Soft warm corner glow in site's accent color (No purple, gold or neon) */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 sm:-top-32 sm:-right-32 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full blur-[110px] opacity-20 -z-0"
            style={{ background: '#E3B896' }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-32 w-72 h-72 rounded-full blur-[90px] opacity-10 -z-0"
            style={{ background: '#1E4A5C' }}
            aria-hidden="true"
          />

          {/* Grid Layout:
              Desktop: Left ~45% (col-span-5), Right ~55% (col-span-7)
              Mobile stacking order: 1. badge, 2. headline, 3. checklist, 4. form, 5. founder card */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* ITEM 1 ON MOBILE (Order 1): Headline, Supporting Content Packages, Checklist */}
            <div className="order-1 lg:order-none lg:col-span-5 flex flex-col">
              {/* Headline with italic accent phrase */}
              <h2 className="text-[32px] sm:text-[42px] lg:text-[46px] font-normal leading-[1.1] tracking-[-0.03em] text-white mb-6">
                {renderHeadline(CTA_CONFIG.cta.headline)}
              </h2>

              {/* Supporting Content: Starter, Standard and Growth from config.pricing.tiers */}
              <div className="space-y-2.5 mb-6">
                {(config.pricing?.tiers || []).map((tier) => (
                  <div
                    key={tier.id}
                    className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white"
                  >
                    <span className="font-semibold text-[14px] sm:text-[15px]">{tier.name}</span>
                    <span className="text-[12px] sm:text-[13px] text-white/70">
                      from <span className="text-[#E3B896] font-semibold">€{tier.price}</span> · about {tier.days} working days
                    </span>
                  </div>
                ))}
              </div>

              {/* Checklist items with circled check icons */}
              <ul className="space-y-3 mb-2">
                {checklistPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[14px] sm:text-[15px] text-white/85 leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-[#E3B896] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ITEM 2 ON MOBILE (Order 2): Right Column Contact Form */}
            <div className="order-2 lg:order-none lg:col-span-7 lg:row-span-2">
              <div className="w-full bg-white/[0.03] border border-white/10 rounded-[24px] sm:rounded-[28px] p-6 sm:p-9 md:p-10 backdrop-blur-xs">
                {/* Free intro call badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E3B896] text-xs font-semibold uppercase tracking-wider mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E3B896]" />
                  <span>Free intro call</span>
                </div>
                {isSubmitted ? (
                  /* Success State */
                  <div className="flex flex-col items-center justify-center text-center py-10 px-2 sm:px-6">
                    <div className="w-14 h-14 rounded-full bg-[#E3B896]/20 border border-[#E3B896] text-[#E3B896] flex items-center justify-center mb-5">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
                      Thanks, {firstName}. I'll be in touch soon.
                    </h3>
                    <p className="text-white/80 text-base max-w-md">
                      {CTA_CONFIG.responseTime && CTA_CONFIG.responseTime.trim()
                        ? `I'll reply within ${CTA_CONFIG.responseTime.trim()}.`
                        : "I've received your enquiry and will review your details shortly."}
                    </p>
                  </div>
                ) : (
                  /* Contact Form */
                  <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-7">
                    {/* Status live region for accessibility */}
                    <div aria-live="polite" className="sr-only">
                      {statusMessage}
                    </div>

                    {/* Honeypot field for spam prevention */}
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

                    {/* Full Name */}
                    <div>
                      <label htmlFor="cta-name" className="block text-sm font-semibold text-white mb-2">
                        Full name <span className="text-[#E3B896]">*</span>
                      </label>
                      <input
                        id="cta-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                        }}
                        placeholder="Your name"
                        className="w-full bg-transparent border-0 border-b border-white/20 focus:border-[#E3B896] focus:ring-0 text-white placeholder-white/40 pb-2.5 px-0 text-base transition-colors"
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={errors.fullName ? 'cta-name-error' : undefined}
                      />
                      {errors.fullName && (
                        <p id="cta-name-error" className="text-xs text-[#E3B896] mt-1.5 font-medium">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email & Phone side-by-side on sm screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Email */}
                      <div>
                        <label htmlFor="cta-email" className="block text-sm font-semibold text-white mb-2">
                          Email <span className="text-[#E3B896]">*</span>
                        </label>
                        <input
                          id="cta-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                          }}
                          placeholder="you@yourbusiness.ie"
                          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-[#E3B896] focus:ring-0 text-white placeholder-white/40 pb-2.5 px-0 text-base transition-colors"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'cta-email-error' : undefined}
                        />
                        {errors.email && (
                          <p id="cta-email-error" className="text-xs text-[#E3B896] mt-1.5 font-medium">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone or WhatsApp */}
                      <div>
                        <label htmlFor="cta-phone" className="block text-sm font-semibold text-white mb-2">
                          Phone or WhatsApp <span className="text-white/40 font-normal text-xs">(optional)</span>
                        </label>
                        <input
                          id="cta-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="087 123 4567"
                          className="w-full bg-transparent border-0 border-b border-white/20 focus:border-[#E3B896] focus:ring-0 text-white placeholder-white/40 pb-2.5 px-0 text-base transition-colors"
                        />
                      </div>
                    </div>

                    {/* What's your trade? chips */}
                    <div>
                      <span className="block text-sm font-semibold text-white mb-2.5">
                        What's your trade?
                      </span>
                      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Trade selection">
                        {CTA_CONFIG.trades.map((trade: string) => {
                          const isSelected = selectedTrade === trade;
                          return (
                            <button
                              key={trade}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => setSelectedTrade(isSelected ? '' : trade)}
                              className={`px-3 py-1.5 rounded-xl text-xs sm:text-[13px] border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#E3B896] bg-[#E3B896]/20 text-[#E3B896] font-semibold shadow-xs'
                                  : 'border-white/15 bg-white/[0.04] text-white/80 hover:border-white/30 hover:bg-white/[0.08]'
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
                          className={`px-3 py-1.5 rounded-xl text-xs sm:text-[13px] border transition-all cursor-pointer ${
                            selectedTrade === 'Other'
                              ? 'border-[#E3B896] bg-[#E3B896]/20 text-[#E3B896] font-semibold shadow-xs'
                              : 'border-white/15 bg-white/[0.04] text-white/80 hover:border-white/30 hover:bg-white/[0.08]'
                          }`}
                        >
                          Other
                        </button>
                      </div>
                    </div>

                    {/* Which option interests you? chips built from pricing config */}
                    <div>
                      <span className="block text-sm font-semibold text-white mb-2.5">
                        Which option interests you?
                      </span>
                      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Package option selection">
                        {optionChips.map((chip) => {
                          const isSelected = selectedOption === chip.label;
                          return (
                            <button
                              key={chip.id}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => setSelectedOption(isSelected ? '' : chip.label)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#E3B896] bg-[#E3B896]/20 text-[#E3B896] font-semibold shadow-xs'
                                  : 'border-white/15 bg-white/[0.04] text-white/80 hover:border-white/30 hover:bg-white/[0.08]'
                              }`}
                            >
                              <span>{chip.label}</span>
                              {chip.price && (
                                <span className="opacity-60 ml-1 font-normal">
                                  ({chip.price})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tell me about your business */}
                    <div>
                      <label htmlFor="cta-message" className="block text-sm font-semibold text-white mb-2">
                        Tell me about your business <span className="text-[#E3B896]">*</span>
                      </label>
                      <textarea
                        id="cta-message"
                        ref={messageInputRef}
                        rows={3}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                        }}
                        placeholder="What do you do, where do you work, and what should the website do for you?"
                        className="w-full bg-transparent border-0 border-b border-white/20 focus:border-[#E3B896] focus:ring-0 text-white placeholder-white/40 pb-2 px-0 text-base resize-none transition-colors"
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? 'cta-message-error' : undefined}
                      />
                      {errors.message && (
                        <p id="cta-message-error" className="text-xs text-[#E3B896] mt-1.5 font-medium">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Consent Checkbox */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => {
                            setConsent(e.target.checked);
                            if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }));
                          }}
                          className="mt-1 h-4 w-4 rounded border-white/30 bg-white/10 text-[#E3B896] focus:ring-[#E3B896] focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-xs sm:text-[13px] text-white/70 leading-normal">
                          I agree to be contacted about my enquiry. See the{' '}
                          <a
                            href={CTA_CONFIG.privacyPolicyUrl}
                            onClick={(e) => {
                              if (onOpenPrivacy) {
                                e.preventDefault();
                                onOpenPrivacy();
                              }
                            }}
                            className="text-[#E3B896] underline hover:text-white"
                          >
                            Privacy Policy
                          </a>
                          .
                        </span>
                      </label>
                      {errors.consent && (
                        <p className="text-xs text-[#E3B896] mt-1.5 font-medium">
                          {errors.consent}
                        </p>
                      )}
                    </div>

                    {/* Submission error fallback banner */}
                    {submissionError && (
                      <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs sm:text-[13px] leading-relaxed">
                        {submissionError}
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#E3B896] text-[#0F2A35] hover:bg-[#edd0b5] active:scale-[0.98] transition-all font-semibold text-[15px] sm:text-[16px] shadow-md disabled:opacity-60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3B896] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2A35]"
                      >
                        <span>{isSubmitting ? 'Sending...' : 'Send enquiry'}</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* ITEM 3 ON MOBILE (Order 3): Founder Card (Left column desktop) */}
            <div className="order-3 lg:order-none lg:col-span-5 mt-10 sm:mt-12 lg:mt-6">
              <div className="flex flex-col items-start w-full max-w-[300px] sm:max-w-[320px]">
                {/* Large Portrait Tile */}
                <div
                  className="relative w-full aspect-[4/5] rounded-[24px] sm:rounded-3xl overflow-hidden border border-white/15 shadow-xl bg-[#1E4A5C]/30 transition-transform duration-300 hover:scale-[1.01] motion-reduce:transform-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 35%, rgba(227, 184, 150, 0.22) 0%, rgba(15, 42, 53, 0.8) 100%)',
                  }}
                >
                  {FOUNDER.photo && !imageError ? (
                    <img
                      src={FOUNDER.photo}
                      alt="Zuhayer, founder of Open Hours"
                      width="1122"
                      height="1402"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'top center' }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#183946] text-[#E3B896]">
                      <span className="text-4xl font-semibold">ZH</span>
                      <span className="text-xs text-white/60 mt-2 font-medium">Founder Lead</span>
                    </div>
                  )}
                </div>

                {/* Name & Role directly below tile */}
                <div className="mt-4 sm:mt-5 text-left">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight">
                    {FOUNDER.name}
                  </h3>
                  <p className="text-[15px] sm:text-[16px] text-white/70 mt-1 font-normal">
                    Founder, Open Hours
                  </p>
                </div>

                {/* Thin divider */}
                <div className="w-full h-px bg-white/10 my-4" />

                {/* Contact row: WhatsApp / Phone and Book a call directly (hidden if empty) */}
                {(cleanWhatsapp || cleanBookingUrl) && (
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-[13px] mb-3">
                    {cleanWhatsapp && (
                      <a
                        href={whatsappLink() || `tel:${cleanWhatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-[#E3B896] hover:underline"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{cleanWhatsapp}</span>
                      </a>
                    )}
                    {cleanBookingUrl && (
                      <a
                        href={cleanBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-white/90 hover:text-[#E3B896] underline underline-offset-2"
                      >
                        <span>Book a call directly</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Working model line */}
                {CTA_CONFIG.workingModelLine && (
                  <div className="text-xs text-white/50 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-[#E3B896]/70 shrink-0" />
                    <span>{CTA_CONFIG.workingModelLine}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
