import React, { useEffect, useRef, useState } from 'react';
import { X, Check, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
  FORM_ENDPOINT,
  whatsappLink,
  CTA,
  DELIVERY,
} from '../content';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy: () => void;
  initialEmail?: string;
  initialTrade?: string;
  variant?: 'page' | 'feature';
}

export const AUDIT_TRADE_OPTIONS = [
  'Roofers',
  'Kitchen fitters',
  'Extension builders',
  'Windows & doors',
  'Landscapers',
  'Painters & decorators',
  'Heating installers',
  'Garden rooms',
  'Other trade',
] as const;

export type AuditTrade = (typeof AUDIT_TRADE_OPTIONS)[number];

export default function AuditModal({
  isOpen,
  onClose,
  onOpenPrivacy,
  initialEmail = '',
  initialTrade = 'Roofers',
  variant = 'page',
}: AuditModalProps) {
  const [name, setName] = useState('');
  const [trade, setTrade] = useState<AuditTrade>('Roofers');
  const [town, setTown] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [idea, setIdea] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Form submission status & inline blur tracking
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'failure'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Focus trap refs
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      if (initialEmail) {
        setEmail(initialEmail);
      }
      if (initialTrade) {
        const found = AUDIT_TRADE_OPTIONS.find(
          (t) => t.toLowerCase() === initialTrade.toLowerCase()
        );
        if (found) {
          setTrade(found);
        }
      }
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(() => {
        const firstInput = modalRef.current?.querySelector<HTMLElement>('#audit-name');
        firstInput?.focus();
      });
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      document.body.style.overflow = '';
      const prevEl = previousActiveElementRef.current;
      if (prevEl && typeof prevEl.focus === 'function') {
        window.requestAnimationFrame(() => prevEl.focus());
      }
      // Reset statuses on close
      setStatus('idle');
      setErrorMessage('');
      setTouched({});
      setIdea('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialEmail, initialTrade]);

  // Handle ESC key and focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (!first || !last) return;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fieldErrors = {
    name: touched.name && !name.trim() ? 'Please enter your name or business name.' : '',
    town: touched.town && !town.trim() ? 'Please enter your town or area.' : '',
    email:
      touched.email && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        ? 'Please enter a valid email address.'
        : '',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, town: true, email: true });
    setErrorMessage('');

    // Honeypot check
    if (honeypot) {
      onClose();
      return;
    }

    // Validation
    if (!name.trim()) {
      setErrorMessage('Please enter your name or business name.');
      return;
    }
    if (!town.trim()) {
      setErrorMessage('Please enter your town or area.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!consent) {
      setErrorMessage(
        variant === 'feature'
          ? 'Please confirm your consent to be contacted about your feature idea.'
          : 'Please confirm your consent to receive the video audit.'
      );
      return;
    }

    setStatus('loading');

    try {
      const endpoint = FORM_ENDPOINT as string;
      if (endpoint && endpoint.trim() !== '') {
        const payload: Record<string, unknown> = {
          name,
          trade,
          town,
          websiteLink,
          email,
          phone,
        };

        if (variant === 'feature') {
          payload.topic = 'feature-idea';
          if (idea.trim()) {
            payload.idea = idea.trim();
          }
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
      } else {
        // If FORM_ENDPOINT is not set (or empty), simulate 600ms latency then show success
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setStatus('success');
    } catch {
      setStatus('failure');
      setErrorMessage('Could not send your request. Please try again or chat with us on WhatsApp.');
    }
  };

  const waLink = whatsappLink(
    variant === 'feature'
      ? `Hi Open Hours, I have a feature idea for my website: ${name ? name : ''}`
      : `Hi Open Hours, I'd like a 1-page website for my business: ${name || '[Business Name]'}`
  );

  return (
    <div
      className="oh-fade-in fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(11, 27, 34, 0.58)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="oh-scale-in relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(11,27,34,0.24)] border border-[rgba(11,27,34,0.09)]"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#F3F5F3] hover:bg-[#DDF4EA] text-[#0B1B22] flex items-center justify-center transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer z-10"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* SUCCESS STATE */}
        {status === 'success' ? (
          <div
            className="oh-slide-up-in py-6 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="w-14 h-14 rounded-full bg-[#DDF4EA] text-[#14624F] flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" strokeWidth={2.5} />
            </div>
              {variant === 'feature' ? (
                <>
                  <h3 className="text-[24px] sm:text-[26px] font-semibold text-[#0B1B22] mb-2">
                    Thanks.
                  </h3>
                  <p className="text-[16px] text-[#475754] leading-relaxed max-w-md mx-auto mb-6">
                    We&apos;ll reply to {email} within about {DELIVERY.auditWorkingDays} working days with a written quote.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-[24px] sm:text-[26px] font-semibold text-[#0B1B22] mb-2">
                    Thanks {name.trim() || 'there'}, we&apos;re on it.
                  </h3>
                  <p className="text-[16px] text-[#475754] leading-relaxed max-w-md mx-auto mb-6">
                    We&apos;ll record your video within 2 working days and email it over. No sales pitch, just honest feedback on what customers see.
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={onClose}
                className="oh-btn-primary h-12 px-8 rounded-full text-white text-[15px] font-semibold active:scale-[0.98] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            /* FORM VIEW (when idle, loading, or failure) */
            <div>
              {/* Header */}
              <div className="mb-6 pr-8">
                <h2 className="text-[28px] font-semibold text-[#0B1B22] tracking-tight leading-tight mb-2">
                  {variant === 'feature' ? 'Tell us your feature idea' : CTA.label}
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#475754] leading-relaxed">
                  {variant === 'feature'
                    ? "Describe what you'd like your website to do, and we'll reply with a written quote."
                    : "Tell us about your business and we'll set up your 1-page website at no cost."}
                </p>
              </div>

              {/* Inline Failure Notice if POST failed */}
              {status === 'failure' && (
                <div
                  role="alert"
                  className="mb-4 p-3 rounded-xl bg-[#FDF2EE] border border-[#B43C1E]/35 text-[13px] text-[#9E2F16] flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>{errorMessage || 'Could not send your request. Please try again or chat with us on WhatsApp.'}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Honeypot field (hidden from screen, bots trigger it) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="modal-hp">Leave this empty</label>
                  <input
                    id="modal-hp"
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="audit-name" className="block text-[14px] font-semibold text-[#0B1B22] mb-1.5">
                    Name <span className="text-[#14624F]">*</span>
                  </label>
                  <input
                    id="audit-name"
                    name="name"
                    autoComplete="name"
                    type="text"
                    required
                    value={name}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Murphy or Atlantic Slate Roofing"
                    aria-invalid={Boolean(fieldErrors.name)}
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(11,27,34,0.16)] text-[16px] text-[#0B1B22] placeholder:text-[#475754] transition-colors duration-150"
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-[12px] font-medium text-[#9E2F16]">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Trade Select */}
                <div>
                  <label htmlFor="audit-trade" className="block text-[14px] font-semibold text-[#0B1B22] mb-1.5">
                    Trade <span className="text-[#14624F]">*</span>
                  </label>
                  <select
                    id="audit-trade"
                    name="trade"
                    required
                    value={trade}
                    onChange={(e) => setTrade(e.target.value as AuditTrade)}
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(11,27,34,0.16)] text-[16px] text-[#0B1B22] bg-white transition-colors duration-150"
                  >
                    {AUDIT_TRADE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Town / Area */}
                <div>
                  <label htmlFor="audit-town" className="block text-[14px] font-semibold text-[#0B1B22] mb-1.5">
                    Town / Area <span className="text-[#14624F]">*</span>
                  </label>
                  <input
                    id="audit-town"
                    name="town"
                    autoComplete="address-level2"
                    type="text"
                    required
                    value={town}
                    onBlur={() => setTouched((prev) => ({ ...prev, town: true }))}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="e.g. Galway, Cork, Sliema"
                    aria-invalid={Boolean(fieldErrors.town)}
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(11,27,34,0.16)] text-[16px] text-[#0B1B22] placeholder:text-[#475754] transition-colors duration-150"
                  />
                  {fieldErrors.town && (
                    <p className="mt-1 text-[12px] font-medium text-[#9E2F16]">{fieldErrors.town}</p>
                  )}
                </div>

                {/* Current website or Facebook page (optional) */}
                <div>
                  <label htmlFor="audit-website" className="block text-[14px] font-semibold text-[#0B1B22] mb-1.5">
                    Current website or Facebook page <span className="text-[12px] font-normal text-[#475754]">(If you have one)</span>
                  </label>
                  <input
                    id="audit-website"
                    name="url"
                    autoComplete="url"
                    inputMode="url"
                    type="text"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                    placeholder="e.g. www.yourbusiness.ie or fb.com/yourpage"
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(11,27,34,0.16)] text-[16px] text-[#0B1B22] placeholder:text-[#475754] transition-colors duration-150"
                  />
                </div>

                {/* Optional "Your idea" textarea (only for feature variant, placed before email) */}
                {variant === 'feature' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="modal-idea" className="block text-[14px] font-semibold text-[#0B1B22]">
                        Your idea
                      </label>
                      <span className="text-[12px] text-[#475754] tabular-nums">
                        {idea.length}/500
                      </span>
                    </div>
                    <textarea
                      id="modal-idea"
                      name="idea"
                      rows={3}
                      maxLength={500}
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="Describe what you'd like your website to do..."
                      className="w-full p-3.5 rounded-xl border border-[rgba(11,27,34,0.16)] text-[15px] text-[#0B1B22] placeholder:text-[#475754] transition-colors duration-150 resize-y"
                    />
                    <p className="mt-1 text-[12px] text-[#475754]">
                      Please don&apos;t include personal or sensitive information.
                    </p>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="audit-email" className="block text-[14px] font-semibold text-[#0B1B22] mb-1.5">
                    Email <span className="text-[#14624F]">*</span>
                  </label>
                  <input
                    id="audit-email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    type="email"
                    required
                    value={email}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(11,27,34,0.16)] text-[16px] text-[#0B1B22] placeholder:text-[#475754] transition-colors duration-150"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-[12px] font-medium text-[#9E2F16]">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Phone (optional) */}
                <div>
                  <label htmlFor="audit-phone" className="block text-[14px] font-semibold text-[#0B1B22] mb-1.5">
                    Phone <span className="text-[12px] font-normal text-[#475754]">(If you prefer a WhatsApp / text update)</span>
                  </label>
                  <input
                    id="audit-phone"
                    name="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +353 87 123 4567"
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(11,27,34,0.16)] text-[16px] text-[#0B1B22] placeholder:text-[#475754] transition-colors duration-150"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[13px] text-[#475754] select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-[rgba(11,27,34,0.3)] cursor-pointer accent-[#14624F]"
                    />
                    <span>
                      {variant === 'feature' ? (
                        <>
                          I agree to Open Hours using these details to contact me about my feature idea.{' '}
                          <button
                            type="button"
                            onClick={onOpenPrivacy}
                            className="underline text-[#14624F] hover:text-[#0F4A3E]"
                          >
                            Privacy policy
                          </button>
                          .
                        </>
                      ) : (
                        <>
                          We&apos;ll use your email only to reply to your enquiry. No spam.{' '}
                          <button
                            type="button"
                            onClick={onOpenPrivacy}
                            className="underline text-[#14624F] hover:text-[#0F4A3E]"
                          >
                            Privacy policy
                          </button>
                          .
                        </>
                      )}
                    </span>
                  </label>
                </div>

                {/* Error message */}
                {errorMessage && status !== 'failure' && (
                  <p role="alert" className="text-[13px] text-[#9E2F16] font-medium">
                    {errorMessage}
                  </p>
                )}

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="oh-btn-primary w-full h-12 rounded-xl text-white text-[15px] font-semibold active:scale-[0.98] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin motion-reduce:animate-none" strokeWidth={1.5} />
                        <span>{variant === 'feature' ? 'Sending idea...' : 'Sending request...'}</span>
                      </>
                    ) : (
                      <span>{variant === 'feature' ? 'Send my idea' : 'Send request'}</span>
                    )}
                  </button>
                </div>
              </form>

              {/* WhatsApp fallback / alternative: below form, "Prefer WhatsApp? Chat with us directly" */}
              {waLink && (
                <div className="pt-5 mt-6 border-t border-[rgba(11,27,34,0.09)] flex items-center justify-between">
                  <span className="text-[13px] text-[#475754]">
                    Prefer WhatsApp?
                  </span>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0B1B22] hover:text-[#14624F] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#14735A]" strokeWidth={1.5} />
                    <span>Chat with us directly</span>
                  </a>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
