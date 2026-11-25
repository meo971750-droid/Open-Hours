import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageCircle,
  X,
} from 'lucide-react';
import { config } from '../config';
import { CONTACT, CTA_CONFIG, FOUNDER, devPlaceholder } from '../content';
import { useConsent } from '../lib/consent';
import { subscribeScroll } from '../lib/scrollHub';

interface FloatingQuestionPillProps {
  isModalOpen?: boolean;
  onOpenPrivacy?: () => void;
}

type WidgetMode = 'card' | 'form' | 'pill';

export default function FloatingQuestionPill({
  isModalOpen = false,
  onOpenPrivacy,
}: FloatingQuestionPillProps) {
  const [delayPassed, setDelayPassed] = useState(false);
  const [isContactOrFooterInView, setIsContactOrFooterInView] = useState(false);
  const [bottomBarVisible, setBottomBarVisible] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const cookieConsent = useConsent();
  const [mode, setMode] = useState<WidgetMode>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'pill';
    }
    return 'card';
  });

  // Quick-enquiry form state
  const [name, setName] = useState('');
  const [businessDetails, setBusinessDetails] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fallbackNotice, setFallbackNotice] = useState('');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDelayPassed(true);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onBottomBar = (event: Event) => {
      const custom = event as CustomEvent<{ visible?: boolean }>;
      setBottomBarVisible(Boolean(custom.detail?.visible));
    };
    window.addEventListener('openhours:bottombar', onBottomBar);
    return () => window.removeEventListener('openhours:bottombar', onBottomBar);
  }, []);

  useEffect(() => {
    return subscribeScroll(({ scrollY, winWidth, winHeight, getBounds }) => {
      const nextMob = winWidth < 640;
      setIsSmallMobile((prev) => (prev === nextMob ? prev : nextMob));

      const contactBounds = getBounds('contact');
      const footerBounds = getBounds('footer');
      const contactInView = contactBounds
        ? contactBounds.top - scrollY <= winHeight && contactBounds.bottom - scrollY >= 0
        : false;
      const footerInView = footerBounds
        ? footerBounds.top - scrollY <= winHeight && footerBounds.bottom - scrollY >= 0
        : false;
      const nextInView = contactInView || footerInView;
      setIsContactOrFooterInView((prev) => (prev === nextInView ? prev : nextInView));
    });
  }, []);

  useEffect(() => {
    if (mode !== 'form') return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 120);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMode('pill');
        window.requestAnimationFrame(() => previousFocusRef.current?.focus());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode]);

  const founderName = (FOUNDER.name || 'Zuhayer').trim();
  const studioLabel = (config.legalName || config.studioName || 'Open Hours Studio').trim();
  const pillLabel = (config.floatingCtaLabel || 'Any question?').trim() || 'Any question?';
  const founderPhoto = (config.founderPhoto || FOUNDER.photo || '').trim();
  const showAvatar = Boolean(founderPhoto && !avatarFailed);
  const responseTime = (config.responseTime || CTA_CONFIG.responseTime || '24 hours').trim();

  const endpoint = (config.formEndpoint || CTA_CONFIG.formEndpoint || '').trim();
  const cleanEmail = (() => {
    const candidate = config.email || CTA_CONFIG.email || CONTACT.email || '';
    if (!candidate || candidate.includes('[')) return '';
    return candidate.trim();
  })();
  const fallbackEmail = cleanEmail || devPlaceholder('hello@openhours.studio');

  const visible =
    delayPassed &&
    !isContactOrFooterInView &&
    !isModalOpen &&
    !(isSmallMobile && !cookieConsent.decided);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('openhours:widget-mode', { detail: { visible, mode } })
    );
  }, [visible, mode]);

  const fieldErrors = {
    name: touched.name && name.trim().length < 2 ? 'Please enter your name.' : '',
    businessDetails:
      touched.businessDetails && businessDetails.trim().length < 2
        ? 'Please enter your business name, trade or town.'
        : '',
    email:
      touched.email && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        ? 'Please enter a valid email address.'
        : '',
  };

  const handleOpenForm = () => {
    setErrorMessage('');
    setFallbackNotice('');
    setMode('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    setTouched({ name: true, businessDetails: true, email: true });
    setErrorMessage('');
    setFallbackNotice('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!businessDetails.trim() || businessDetails.trim().length < 2) {
      setErrorMessage('Please enter your business name, trade or town.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!consent) {
      setErrorMessage('Please confirm we can reply to your email.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      businessDetails: businessDetails.trim(),
      email: email.trim(),
      note: note.trim(),
      source: 'floating-question-widget',
      submittedAt: new Date().toISOString(),
    };

    if (!endpoint) {
      console.warn(
        'config.formEndpoint is not configured. Falling back to prefilled email client link.'
      );
      setIsSubmitting(false);

      const subject = `Question from ${name.trim()} (${businessDetails.trim()})`;
      const bodyLines = [
        `Name: ${name.trim()}`,
        `Business details: ${businessDetails.trim()}`,
        `Email: ${email.trim()}`,
        note.trim() ? `Question: ${note.trim()}` : '',
      ].filter(Boolean);

      window.location.href = `mailto:${encodeURIComponent(
        fallbackEmail
      )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        bodyLines.join('\n')
      )}`;

      setFallbackNotice(
        `Your question was prepared in your email app. If it did not open automatically, please email ${fallbackEmail}.`
      );
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
    } catch (err) {
      console.error('Failed to submit floating widget form:', err);
      setFallbackNotice(
        `Could not send right now. Please email us directly at ${fallbackEmail}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className={
        'fixed right-4 md:right-6 z-30 transition-[bottom] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ' +
        (bottomBarVisible ? 'bottom-[76px] md:bottom-6' : 'bottom-4 md:bottom-6')
      }
    >
      {mode === 'card' && (
        <div
          key="widget-card"
          role="region"
          aria-label={`Talk with ${founderName}`}
          onClick={handleOpenForm}
          className="oh-slide-up-in w-[calc(100vw-32px)] max-w-[356px] bg-white rounded-[26px] p-2.5 border border-[rgba(11,27,34,0.1)] shadow-[0_22px_54px_-12px_rgba(11,27,34,0.24),0_0_24px_-6px_rgba(63,209,165,0.22)] cursor-pointer select-none transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 active:scale-[0.99]"
        >
          <div className="flex items-stretch gap-3.5">
            {/* Left: Rounded Tall Portrait */}
            <div className="relative w-[108px] sm:w-[114px] h-[142px] rounded-[18px] overflow-hidden shrink-0 bg-[#DDF4EA]">
              {showAvatar ? (
                <img
                  src={founderPhoto}
                  alt={founderName}
                  width={114}
                  height={142}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0F4A3E] text-white font-heading text-3xl font-bold">
                  {founderName.charAt(0)}
                </div>
              )}
            </div>

                {/* Right Column */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 pr-0.5 text-left">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#0B1B22] pt-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full bg-[#1E9E6A] shadow-[0_0_8px_rgba(30,158,106,0.55)] shrink-0"
                          aria-hidden="true"
                        />
                        <span>Online now</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMode('pill');
                        }}
                        aria-label="Minimise question card"
                        className="w-7 h-7 rounded-full bg-[#F3F5F3] hover:bg-[#DDF4EA] text-[#0B1B22] flex items-center justify-center transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] shrink-0 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                    </div>

                    <p className="text-[13px] leading-[1.3] text-[#475754] mt-1">
                      Founder,
                      <br />
                      {studioLabel}
                    </p>

                    <div className="font-heading text-[22px] font-bold tracking-[-0.025em] leading-[1.15] text-[#0B1B22] mt-0.5 truncate">
                      {founderName}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenForm();
                    }}
                    className="mt-2.5 w-full h-10 rounded-full px-4 flex items-center justify-between bg-[#050E0D] hover:bg-[#0F4A3E] text-white text-[13px] font-semibold transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] cursor-pointer"
                  >
                    <span className="truncate">Talk With {founderName}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full bg-[#1E9E6A] shadow-[0_0_8px_rgba(111,214,176,0.9)] shrink-0 ml-2"
                      aria-hidden="true"
                    />
                  </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'form' && (
        <div
          key="widget-form"
          role="dialog"
          aria-modal="true"
          aria-label={`Ask ${founderName} a question`}
          className="oh-slide-up-in w-[calc(100vw-28px)] max-w-[372px] max-h-[calc(100vh-110px)] overflow-y-auto bg-white rounded-[26px] p-5 border border-[rgba(11,27,34,0.12)] shadow-[0_24px_60px_-14px_rgba(11,27,34,0.28),0_0_28px_-6px_rgba(63,209,165,0.24)] text-left"
        >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-[rgba(11,27,34,0.08)]">
                <div className="flex items-center gap-2.5 min-w-0">
                  {showAvatar ? (
                    <img
                      src={founderPhoto}
                      alt={founderName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover object-top shrink-0 bg-[#DDF4EA]"
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-[#0F4A3E] text-white font-bold flex items-center justify-center shrink-0">
                      {founderName.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="font-heading text-[15px] font-bold text-[#0B1B22] leading-tight truncate">
                      Ask {founderName}
                    </div>
                    <div className="text-[12px] text-[#475754] truncate">
                      Replies in writing within {responseTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMode('card')}
                    aria-label="Back to card"
                    className="w-7 h-7 rounded-full bg-[#F3F5F3] hover:bg-[#DDF4EA] text-[#0B1B22] flex items-center justify-center transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('pill')}
                    aria-label="Minimise widget"
                    className="w-7 h-7 rounded-full bg-[#F3F5F3] hover:bg-[#DDF4EA] text-[#0B1B22] flex items-center justify-center transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {isSubmitted ? (
                <div
                  className="oh-fade-in py-4 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-11 h-11 rounded-full bg-[#DDF4EA] text-[#14624F] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h3 className="font-heading text-[17px] font-bold text-[#0B1B22] mb-1">
                    Thanks, {name.trim().split(' ')[0] || 'there'}.
                  </h3>
                  <p className="text-[13px] text-[#475754] leading-relaxed mb-4">
                    We&apos;ve logged your details and will reply to {email.trim()} within {responseTime}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setMode('pill');
                    }}
                    className="h-9 px-5 rounded-full bg-[#F3F5F3] hover:bg-[#DDF4EA] text-[13px] font-semibold text-[#0B1B22] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="_openhours_widget_hp"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div>
                    <label
                      htmlFor="floating-q-name"
                      className="block text-[12px] font-semibold text-[#0B1B22] mb-1"
                    >
                      Your name <span className="text-[#14624F]">*</span>
                    </label>
                    <input
                      id="floating-q-name"
                      name="name"
                      autoComplete="name"
                      ref={nameInputRef}
                      type="text"
                      required
                      value={name}
                      onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="e.g. John Murphy"
                      aria-invalid={Boolean(fieldErrors.name)}
                      className="w-full h-10 px-3.5 rounded-[12px] border border-[rgba(11,27,34,0.16)] bg-[#F9FAF9] text-[14px] text-[#0B1B22] placeholder:text-[#475754] focus:bg-white transition-colors duration-150"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-[11.5px] font-medium text-[#9E2F16]">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="floating-q-business"
                      className="block text-[12px] font-semibold text-[#0B1B22] mb-1"
                    >
                      Business name, trade &amp; area <span className="text-[#14624F]">*</span>
                    </label>
                    <input
                      id="floating-q-business"
                      name="organization"
                      autoComplete="organization"
                      type="text"
                      required
                      value={businessDetails}
                      onBlur={() => setTouched((prev) => ({ ...prev, businessDetails: true }))}
                      onChange={(e) => {
                        setBusinessDetails(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="e.g. Murphy Roofing, Galway"
                      aria-invalid={Boolean(fieldErrors.businessDetails)}
                      className="w-full h-10 px-3.5 rounded-[12px] border border-[rgba(11,27,34,0.16)] bg-[#F9FAF9] text-[14px] text-[#0B1B22] placeholder:text-[#475754] focus:bg-white transition-colors duration-150"
                    />
                    {fieldErrors.businessDetails && (
                      <p className="mt-1 text-[11.5px] font-medium text-[#9E2F16]">{fieldErrors.businessDetails}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="floating-q-email"
                      className="block text-[12px] font-semibold text-[#0B1B22] mb-1"
                    >
                      Email <span className="text-[#14624F]">*</span>
                    </label>
                    <input
                      id="floating-q-email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      type="email"
                      required
                      value={email}
                      onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="you@yourbusiness.ie"
                      aria-invalid={Boolean(fieldErrors.email)}
                      className="w-full h-10 px-3.5 rounded-[12px] border border-[rgba(11,27,34,0.16)] bg-[#F9FAF9] text-[14px] text-[#0B1B22] placeholder:text-[#475754] focus:bg-white transition-colors duration-150"
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-[11.5px] font-medium text-[#9E2F16]">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="floating-q-note"
                      className="block text-[12px] font-semibold text-[#0B1B22] mb-1"
                    >
                      Your question <span className="text-[11px] font-normal text-[#475754]">(optional)</span>
                    </label>
                    <textarea
                      id="floating-q-note"
                      name="question"
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What would you like help with?"
                      className="w-full px-3.5 py-2 rounded-[12px] border border-[rgba(11,27,34,0.16)] bg-[#F9FAF9] text-[13.5px] text-[#0B1B22] placeholder:text-[#475754] focus:bg-white transition-colors duration-150 resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer select-none pt-0.5">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-[rgba(11,27,34,0.3)] accent-[#14624F] cursor-pointer shrink-0"
                    />
                    <span className="text-[11.5px] text-[#475754] leading-snug">
                      We&apos;ll use your email only to reply to your enquiry. No spam.{' '}
                      {onOpenPrivacy ? (
                        <button
                          type="button"
                          onClick={onOpenPrivacy}
                          className="underline text-[#14624F] hover:text-[#0F4A3E] cursor-pointer"
                        >
                          Privacy policy
                        </button>
                      ) : (
                        <a
                          href="#privacy"
                          className="underline text-[#14624F] hover:text-[#0F4A3E]"
                        >
                          Privacy policy
                        </a>
                      )}
                      .
                    </span>
                  </label>

                  {errorMessage && (
                    <p role="alert" className="text-[12px] font-medium text-[#9E2F16]">
                      {errorMessage}
                    </p>
                  )}

                  {fallbackNotice && (
                    <div
                      role="status"
                      className="p-2.5 rounded-[12px] bg-[#DDF4EA] border border-[#14624F]/25 text-[12px] text-[#0F4A3E] leading-relaxed"
                    >
                      {fallbackNotice}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="oh-btn-primary w-full h-11 rounded-full text-white text-[14px] font-semibold flex items-center justify-center gap-2 transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer disabled:opacity-65"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send question</span>
                        <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {mode === 'pill' && (
            <button
              key="widget-pill"
              type="button"
              onClick={handleOpenForm}
              aria-label={pillLabel}
              className="oh-slide-up-in bg-white hover:bg-[#F3F5F3] text-[#0B1B22] rounded-full p-1 md:p-[5px] md:pr-5 border border-[rgba(20,98,79,0.28)] ring-2 ring-[rgba(111,214,176,0.45)] shadow-[0_14px_34px_-10px_rgba(11,27,34,0.2),0_0_24px_-4px_rgba(63,209,165,0.28)] inline-flex items-center justify-center md:justify-start gap-0 md:gap-3 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer w-[52px] h-[52px] md:w-auto md:h-[58px]"
            >
              {showAvatar ? (
                <img
                  src={founderPhoto}
                  alt={pillLabel}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="w-[42px] h-[42px] md:w-12 md:h-12 rounded-full object-cover object-top shrink-0 bg-[#DDF4EA]"
                />
              ) : (
                <span
                  className="w-[42px] h-[42px] md:w-10 md:h-10 rounded-full text-white flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
                  }}
                  aria-hidden="true"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                </span>
              )}
              <span className="hidden md:inline text-[15px] font-medium text-[#0B1B22] whitespace-nowrap">
                {pillLabel}
              </span>
            </button>
          )}
        </div>
  );
}
