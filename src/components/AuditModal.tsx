import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  // Form submission status
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'failure'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Focus trap refs
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen) {
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
    } else {
      document.body.style.overflow = '';
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
      // Reset statuses on close
      setStatus('idle');
      setErrorMessage('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        style={{ backgroundColor: 'rgba(15, 42, 53, 0.55)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,42,53,0.24)] border border-[rgba(15,42,53,0.08)] outline-none"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#F4F6F8] hover:bg-[#E1E8EA] text-[#0F2A35] flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* SUCCESS STATE */}
          {status === 'success' ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#2E9E6B]/15 text-[#2E9E6B] flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              {variant === 'feature' ? (
                <>
                  <h3 className="text-[24px] sm:text-[26px] font-semibold text-[#0F2A35] mb-2">
                    Thanks.
                  </h3>
                  <p className="text-[16px] text-[#5E6F77] leading-relaxed max-w-md mx-auto mb-6">
                    We&apos;ll reply to {email} within about {DELIVERY.auditWorkingDays} working days with a written quote.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-[24px] sm:text-[26px] font-semibold text-[#0F2A35] mb-2">
                    Thanks {name.trim() || 'there'}, we&apos;re on it.
                  </h3>
                  <p className="text-[16px] text-[#5E6F77] leading-relaxed max-w-md mx-auto mb-6">
                    We&apos;ll record your video within 2 working days and email it over. No sales pitch, just honest feedback on what customers see.
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={onClose}
                className="h-12 px-8 rounded-full bg-[#0F2A35] text-white text-[15px] font-semibold hover:bg-[#1E4A5C] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            /* FORM VIEW (when idle, loading, or failure) */
            <div>
              {/* Header */}
              <div className="mb-6 pr-8">
                <h2 className="text-[28px] font-semibold text-[#0F2A35] tracking-tight leading-tight mb-2">
                  {variant === 'feature' ? 'Tell us your feature idea' : CTA.label}
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#5E6F77] leading-relaxed">
                  {variant === 'feature'
                    ? "Describe what you'd like your website to do, and we'll reply with a written quote."
                    : "Tell us about your business and we'll set up your 1-page website at no cost."}
                </p>
              </div>

              {/* Inline Failure Notice if POST failed */}
              {status === 'failure' && (
                <div className="mb-4 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[13px] text-[#B91C1C] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
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
                  <label className="block text-[14px] font-semibold text-[#0F2A35] mb-1.5">
                    Name <span className="text-[#D9444A]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Murphy or Atlantic Slate Roofing"
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(15,42,53,0.15)] text-[16px] text-[#0F2A35] placeholder:text-[#5E6F77]/60 focus:outline-none focus:ring-2 focus:ring-[#1E4A5C] focus:border-transparent transition-all"
                  />
                </div>

                {/* Trade Select */}
                <div>
                  <label className="block text-[14px] font-semibold text-[#0F2A35] mb-1.5">
                    Trade <span className="text-[#D9444A]">*</span>
                  </label>
                  <select
                    required
                    value={trade}
                    onChange={(e) => setTrade(e.target.value as AuditTrade)}
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(15,42,53,0.15)] text-[16px] text-[#0F2A35] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4A5C] focus:border-transparent transition-all"
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
                  <label className="block text-[14px] font-semibold text-[#0F2A35] mb-1.5">
                    Town / Area <span className="text-[#D9444A]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="e.g. Galway, Cork, Sliema"
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(15,42,53,0.15)] text-[16px] text-[#0F2A35] placeholder:text-[#5E6F77]/60 focus:outline-none focus:ring-2 focus:ring-[#1E4A5C] focus:border-transparent transition-all"
                  />
                </div>

                {/* Current website or Facebook page (optional) */}
                <div>
                  <label className="block text-[14px] font-semibold text-[#0F2A35] mb-1.5">
                    Current website or Facebook page <span className="text-[12px] font-normal text-[#5E6F77]">(If you have one)</span>
                  </label>
                  <input
                    type="text"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                    placeholder="e.g. www.yourbusiness.ie or fb.com/yourpage"
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(15,42,53,0.15)] text-[16px] text-[#0F2A35] placeholder:text-[#5E6F77]/60 focus:outline-none focus:ring-2 focus:ring-[#1E4A5C] focus:border-transparent transition-all"
                  />
                </div>

                {/* Optional "Your idea" textarea (only for feature variant, placed before email) */}
                {variant === 'feature' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="modal-idea" className="block text-[14px] font-semibold text-[#0F2A35]">
                        Your idea
                      </label>
                      <span className="text-[12px] text-[#5E6F77] tabular-nums">
                        {idea.length}/500
                      </span>
                    </div>
                    <textarea
                      id="modal-idea"
                      rows={3}
                      maxLength={500}
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="Describe what you'd like your website to do..."
                      className="w-full p-3.5 rounded-xl border border-[rgba(15,42,53,0.15)] text-[15px] text-[#0F2A35] placeholder:text-[#5E6F77]/60 focus:outline-none focus:ring-2 focus:ring-[#1E4A5C] focus:border-transparent transition-all resize-y"
                    />
                    <p className="mt-1 text-[12px] text-[#5E6F77]">
                      Please don&apos;t include personal or sensitive information.
                    </p>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-[14px] font-semibold text-[#0F2A35] mb-1.5">
                    Email <span className="text-[#D9444A]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(15,42,53,0.15)] text-[16px] text-[#0F2A35] placeholder:text-[#5E6F77]/60 focus:outline-none focus:ring-2 focus:ring-[#1E4A5C] focus:border-transparent transition-all"
                  />
                </div>

                {/* Phone (optional) */}
                <div>
                  <label className="block text-[14px] font-semibold text-[#0F2A35] mb-1.5">
                    Phone <span className="text-[12px] font-normal text-[#5E6F77]">(If you prefer a WhatsApp / text update)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +353 87 123 4567"
                    className="w-full h-12 px-4 rounded-xl border border-[rgba(15,42,53,0.15)] text-[16px] text-[#0F2A35] placeholder:text-[#5E6F77]/60 focus:outline-none focus:ring-2 focus:ring-[#1E4A5C] focus:border-transparent transition-all"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[13px] text-[#5E6F77] select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#1E4A5C] focus:ring-[#1E4A5C] border-gray-300 cursor-pointer accent-[#1E4A5C]"
                    />
                    <span>
                      {variant === 'feature' ? (
                        <>
                          I agree to Open Hours using these details to contact me about my feature idea.{' '}
                          <button
                            type="button"
                            onClick={onOpenPrivacy}
                            className="underline text-[#1E4A5C] hover:text-[#0F2A35]"
                          >
                            Privacy policy
                          </button>
                          .
                        </>
                      ) : (
                        <>
                          I agree to Open Hours using these details to contact me about my 1-page website.{' '}
                          <button
                            type="button"
                            onClick={onOpenPrivacy}
                            className="underline text-[#1E4A5C] hover:text-[#0F2A35]"
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
                  <p className="text-[13px] text-[#D9444A] font-medium">
                    {errorMessage}
                  </p>
                )}

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full h-12 rounded-xl bg-[#0F2A35] hover:bg-[#1E4A5C] text-white text-[15px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
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
                <div className="pt-5 mt-6 border-t border-[rgba(15,42,53,0.08)] flex items-center justify-between">
                  <span className="text-[13px] text-[#5E6F77]">
                    Prefer WhatsApp?
                  </span>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1E4A5C] hover:text-[#0F2A35] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#1E4A5C]" />
                    <span>Chat with us directly</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
