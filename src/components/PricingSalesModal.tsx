import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Loader2, X } from 'lucide-react';
import type { BuilderFeatureConfig } from '../config';
import { CONTACT, FORM_ENDPOINT } from '../content';

export interface PricingSalesModalProps {
  selectedPackage: string;
  selectedTierName: string;
  pages: number;
  oneTimeTotal: number;
  monthlyTotal: number;
  hasVoiceAgentSelected: boolean;
  estimateNote?: string;
  selectedVisibleFeatures: BuilderFeatureConfig[];
  initialSummaryMessage: string;
  onClose: () => void;
}

export default function PricingSalesModal({
  selectedPackage,
  selectedTierName,
  pages,
  oneTimeTotal,
  monthlyTotal,
  hasVoiceAgentSelected,
  estimateNote,
  selectedVisibleFeatures,
  initialSummaryMessage,
  onClose,
}: PricingSalesModalProps) {
  const [salesName, setSalesName] = useState('');
  const [salesEmail, setSalesEmail] = useState('');
  const [salesPhone, setSalesPhone] = useState('');
  const [salesMessage, setSalesMessage] = useState(initialSummaryMessage);
  const [salesConsent, setSalesConsent] = useState(false);
  const [salesHoneypot, setSalesHoneypot] = useState('');
  const [salesErrors, setSalesErrors] = useState<Record<string, string>>({});
  const [salesSubmitting, setSalesSubmitting] = useState(false);
  const [salesSubmitted, setSalesSubmitted] = useState(false);
  const [salesStatus, setSalesStatus] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSalesMessage(initialSummaryMessage);
  }, [initialSummaryMessage]);

  const euroFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }),
    []
  );
  const formatEuro = (amount: number) => euroFormatter.format(amount);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      firstInputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableEls.length === 0) return;

        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSalesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salesHoneypot) return;

    const newErrors: Record<string, string> = {};
    if (!salesName.trim()) {
      newErrors.name = 'Please provide your name.';
    }
    if (!salesEmail.trim() || !/^\S+@\S+\.\S+$/.test(salesEmail.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!salesConsent) {
      newErrors.consent = 'Please confirm consent to be contacted.';
    }

    if (Object.keys(newErrors).length > 0) {
      setSalesErrors(newErrors);
      return;
    }

    setSalesSubmitting(true);
    setSalesStatus(null);

    const payload = {
      tag: 'Custom build',
      name: salesName.trim(),
      email: salesEmail.trim(),
      phone: salesPhone.trim(),
      startingPackage: selectedPackage,
      pages,
      oneTimeTotal,
      monthlyTotal,
      selectedFeatures: selectedVisibleFeatures.map((f) => ({
        id: f.id,
        name: f.name,
        price: f.price,
        billing: f.billing,
      })),
      message: salesMessage.trim(),
      submittedAt: new Date().toISOString(),
    };

    const activeEndpoint = FORM_ENDPOINT && !FORM_ENDPOINT.startsWith('[') ? FORM_ENDPOINT : '';

    if (!activeEndpoint || !activeEndpoint.trim()) {
      setSalesSubmitting(false);
      const fallbackEmail =
        CONTACT.email && !CONTACT.email.startsWith('[')
          ? CONTACT.email
          : 'hello@openhours.studio';
      const mailSubject = `Custom build quote request from ${salesName.trim()}`;
      const mailBody = `Name: ${salesName.trim()}\nEmail: ${salesEmail.trim()}\nPhone: ${salesPhone.trim()}\nTag: Custom build\n\n${salesMessage.trim()}`;

      window.location.href = `mailto:${encodeURIComponent(fallbackEmail)}?subject=${encodeURIComponent(
        mailSubject
      )}&body=${encodeURIComponent(mailBody)}`;

      setSalesStatus(
        `Form endpoint is pending setup. Your enquiry was prepared in your email client. If it did not open automatically, please send your email directly to ${fallbackEmail}.`
      );
      return;
    }

    try {
      const res = await fetch(activeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      setSalesSubmitted(true);
    } catch {
      setSalesStatus(
        'Could not deliver your enquiry right now. Please try again or reach out directly.'
      );
    } finally {
      setSalesSubmitting(false);
    }
  };

  return (
    <div
      className="oh-fade-in fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sales-modal-title"
      ref={modalRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="oh-scale-in relative w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[rgba(11,27,34,0.1)] my-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F3F5F3] hover:bg-[#DDF4EA] active:scale-[0.98] text-[#0B1B22] flex items-center justify-center transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 id="sales-modal-title" className="text-2xl font-bold text-[#0B1B22] mb-2 pr-10">
          Talk to Sales
        </h3>
        <p className="text-sm text-[#475754] mb-5">
          Review your custom estimate and tell us about your project.
        </p>

        {/* Read-only custom package summary */}
        <div className="bg-[#F3F5F3] rounded-2xl p-4 sm:p-5 border border-[rgba(11,27,34,0.08)] mb-6 text-xs text-[#0B1B22]">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(11,27,34,0.08)] mb-3 gap-2">
            <span className="font-bold text-sm text-[#0B1B22]">Your custom package</span>
            <span className="font-semibold text-xs text-[#475754] bg-white px-2.5 py-1 rounded-full border border-[rgba(11,27,34,0.08)]">
              {selectedPackage === 'scratch'
                ? 'Started from scratch'
                : `Starting package: ${selectedTierName}`}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-[#475754]">
              <span>Pages:</span>
              <span className="font-medium text-[#0B1B22] tabular-nums">
                {pages} page{pages > 1 ? 's' : ''}
              </span>
            </div>

            <div className="pt-2 border-t border-[rgba(11,27,34,0.08)]">
              <span className="font-semibold text-[#475754] uppercase text-[10.5px] tracking-wider block mb-1.5">
                Selected features ({selectedVisibleFeatures.length}):
              </span>
              {selectedVisibleFeatures.length === 0 ? (
                <span className="text-[#475754] italic">No features selected</span>
              ) : (
                <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedVisibleFeatures.map((f) => (
                    <li key={f.id} className="flex items-baseline justify-between gap-2 text-[11.5px]">
                      <span className="truncate text-[#0B1B22]">• {f.name}</span>
                      <span className="shrink-0 font-medium text-[#475754] tabular-nums">
                        {f.price > 0 ? formatEuro(f.price) : 'Included in package'}{' '}
                        <span className="text-[10px] text-[#475754]">
                          ({f.billing === 'monthly' ? '/month' : 'one-time'})
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="pt-2.5 border-t border-[rgba(11,27,34,0.08)] flex items-baseline justify-between font-bold text-sm">
            <span>One-time:</span>
            <span className="text-base text-[#0B1B22] tabular-nums">{formatEuro(oneTimeTotal)}</span>
          </div>
          <div className="flex items-baseline justify-between text-xs font-semibold text-[#14624F] mt-1">
            <span>Per month:</span>
            <span className="tabular-nums">{formatEuro(monthlyTotal)}</span>
          </div>
          {hasVoiceAgentSelected && (
            <p className="text-[11px] text-[#475754] mt-2">
              Voice call costs are charged separately.
            </p>
          )}
          {estimateNote && (
            <p className="text-[11px] text-[#475754] mt-3 pt-2.5 border-t border-[rgba(11,27,34,0.08)] leading-relaxed italic">
              {estimateNote}
            </p>
          )}
        </div>

        {salesSubmitted ? (
          <div className="oh-scale-in text-center py-8">
            <div className="w-12 h-12 rounded-full bg-[#DDF4EA] text-[#14624F] flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-[#0B1B22] mb-2">Enquiry received</h4>
            <p className="text-sm text-[#475754] mb-6">
              Thank you, {salesName}. We&apos;ll review your custom build requirements and reply with a fixed quote.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="oh-btn-primary px-6 h-11 rounded-full text-white text-sm font-semibold active:scale-[0.98] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSalesSubmit} noValidate className="space-y-4">
            <input
              type="text"
              name="_builder_hp"
              value={salesHoneypot}
              onChange={(e) => setSalesHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div>
              <label
                htmlFor="sales-name"
                className="block text-xs font-semibold text-[#0B1B22] uppercase tracking-wider mb-1.5"
              >
                Full name <span className="text-[#14624F]">*</span>
              </label>
              <input
                id="sales-name"
                name="fullName"
                autoComplete="name"
                ref={firstInputRef}
                type="text"
                value={salesName}
                onChange={(e) => {
                  setSalesName(e.target.value);
                  if (salesErrors.name) setSalesErrors((prev) => ({ ...prev, name: '' }));
                }}
                onBlur={() => {
                  if (!salesName.trim()) {
                    setSalesErrors((prev) => ({ ...prev, name: 'Please provide your name.' }));
                  }
                }}
                placeholder="Your full name"
                aria-invalid={Boolean(salesErrors.name)}
                className="w-full h-11 px-3.5 rounded-xl border border-[rgba(11,27,34,0.16)] focus:border-[#14624F] focus:ring-1 focus:ring-[#14624F] text-sm text-[#0B1B22] outline-none"
              />
              {salesErrors.name && (
                <p role="alert" className="text-xs text-[#9E2F16] mt-1 font-medium">
                  {salesErrors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="sales-email"
                className="block text-xs font-semibold text-[#0B1B22] uppercase tracking-wider mb-1.5"
              >
                Email address <span className="text-[#14624F]">*</span>
              </label>
              <input
                id="sales-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={salesEmail}
                onChange={(e) => {
                  setSalesEmail(e.target.value);
                  if (salesErrors.email) setSalesErrors((prev) => ({ ...prev, email: '' }));
                }}
                onBlur={() => {
                  if (salesEmail.trim() && !/^\S+@\S+\.\S+$/.test(salesEmail.trim())) {
                    setSalesErrors((prev) => ({
                      ...prev,
                      email: 'Please provide a valid email address.',
                    }));
                  }
                }}
                placeholder="you@yourtrade.ie"
                aria-invalid={Boolean(salesErrors.email)}
                className="w-full h-11 px-3.5 rounded-xl border border-[rgba(11,27,34,0.16)] focus:border-[#14624F] focus:ring-1 focus:ring-[#14624F] text-sm text-[#0B1B22] outline-none"
              />
              {salesErrors.email && (
                <p role="alert" className="text-xs text-[#9E2F16] mt-1 font-medium">
                  {salesErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="sales-phone"
                className="block text-xs font-semibold text-[#0B1B22] uppercase tracking-wider mb-1.5"
              >
                Phone or WhatsApp <span className="text-[#475754] font-normal lowercase">(optional)</span>
              </label>
              <input
                id="sales-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={salesPhone}
                onChange={(e) => setSalesPhone(e.target.value)}
                placeholder="087 123 4567"
                className="w-full h-11 px-3.5 rounded-xl border border-[rgba(11,27,34,0.16)] focus:border-[#14624F] focus:ring-1 focus:ring-[#14624F] text-sm text-[#0B1B22] outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="sales-message"
                className="block text-xs font-semibold text-[#0B1B22] uppercase tracking-wider mb-1.5"
              >
                Estimate summary &amp; notes <span className="text-[#475754] font-normal lowercase">(editable)</span>
              </label>
              <textarea
                id="sales-message"
                name="message"
                rows={4}
                value={salesMessage}
                onChange={(e) => setSalesMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-[rgba(11,27,34,0.16)] focus:border-[#14624F] focus:ring-1 focus:ring-[#14624F] text-xs font-mono text-[#0B1B22] leading-relaxed resize-y outline-none"
              />
            </div>

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={salesConsent}
                  onChange={(e) => {
                    setSalesConsent(e.target.checked);
                    if (salesErrors.consent) setSalesErrors((prev) => ({ ...prev, consent: '' }));
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-[rgba(11,27,34,0.3)] accent-[#14624F] cursor-pointer"
                />
                <span className="text-xs text-[#475754] leading-relaxed">
                  I agree to be contacted about this estimate. Details will never be shared or spammed.
                </span>
              </label>
              {salesErrors.consent && (
                <p role="alert" className="text-xs text-[#9E2F16] mt-1 font-medium">
                  {salesErrors.consent}
                </p>
              )}
            </div>

            {salesStatus && (
              <div
                role="status"
                className="p-3 rounded-xl bg-[#DDF4EA] border border-[#14624F]/25 text-xs text-[#0F4A3E] leading-relaxed"
              >
                {salesStatus}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={salesSubmitting}
                className="oh-btn-primary w-full h-12 rounded-full text-white text-sm font-semibold active:scale-[0.98] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {salesSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{salesSubmitting ? 'Sending...' : 'Request Custom Package'}</span>
                {!salesSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
