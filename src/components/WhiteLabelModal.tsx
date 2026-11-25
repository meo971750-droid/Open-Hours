import React, { useEffect, useRef } from 'react';
import { ArrowRight, Check, CheckCircle2, Handshake, X } from 'lucide-react';
import type { WhiteLabelConfig } from '../config';

interface WhiteLabelModalProps {
  wl: WhiteLabelConfig;
  onClose: () => void;
  onRequestPartnership: () => void;
}

export default function WhiteLabelModal({
  wl,
  onClose,
  onRequestPartnership,
}: WhiteLabelModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalPanelRef.current) {
        const focusable = modalPanelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === firstEl ||
            !modalPanelRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (
            document.activeElement === lastEl ||
            !modalPanelRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="oh-fade-in fixed inset-0 z-50 bg-[#040B0A]/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        ref={modalPanelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="whitelabel-modal-title"
        aria-describedby="whitelabel-modal-subtitle"
        onClick={(e) => e.stopPropagation()}
        className="oh-scale-in relative w-full h-[100dvh] sm:h-auto sm:w-[min(1080px,94vw)] sm:max-h-[90vh] sm:rounded-[28px] bg-[#061310]/95 backdrop-blur-xl border-0 sm:border sm:border-white/15 text-white shadow-[0_32px_90px_-16px_rgba(4,11,10,0.85)] flex flex-col overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 65% 45% at 80% 0%, rgba(30, 158, 106, 0.2) 0%, rgba(15, 74, 62, 0.12) 48%, transparent 78%), linear-gradient(165deg, #061310 0%, #050E0D 100%)',
        }}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-white/12 flex items-start justify-between gap-4 shrink-0 bg-[#050E0D]/55">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              aria-hidden="true"
              className="w-10 h-10 rounded-2xl bg-[#14624F]/45 border border-[#6FD6B0]/40 text-[#A8EBD3] flex items-center justify-center shrink-0 mt-0.5"
            >
              <Handshake className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h3
                id="whitelabel-modal-title"
                className="font-heading text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em] text-white leading-tight"
              >
                {wl.modalTitle}
              </h3>
              <p
                id="whitelabel-modal-subtitle"
                className="mt-1.5 text-[13.5px] sm:text-[14.5px] text-white/80 leading-relaxed max-w-2xl"
              >
                {wl.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/15 text-white flex items-center justify-center transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#6FD6B0]"
          >
            <X className="w-4 h-4" strokeWidth={1.85} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-8">
          {/* Desktop Swimlane Visual (>= md) */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[1fr_112px_1fr] items-center mb-5">
              <div className="pr-4 flex justify-end">
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[12.5px] font-semibold text-white">
                  You (the agency)
                </span>
              </div>
              <div className="text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A8EBD3]">
                7 Steps
              </div>
              <div className="pl-4 flex justify-start">
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#14624F]/45 border border-[#6FD6B0]/45 text-[12.5px] font-semibold text-[#DDF4EA]">
                  Open Hours
                </span>
              </div>
            </div>

            <div className="relative space-y-4">
              <div
                aria-hidden="true"
                className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-white/12 rounded-full overflow-hidden"
              >
                <div className="oh-scale-y-in w-full h-full origin-top rounded-full bg-gradient-to-b from-[#A8EBD3] via-[#6FD6B0] to-[#1E9E6A]" />
              </div>

              {wl.steps.map((step) => (
                <div
                  key={step.step}
                  className="relative grid grid-cols-[1fr_112px_1fr] items-center"
                >
                  <div className="relative pr-7 flex items-center">
                    <div
                      className={`w-full rounded-[16px] p-4 border text-[13px] leading-relaxed ${
                        step.leadLane === 'you'
                          ? 'bg-white/[0.08] border-[#6FD6B0]/35 text-white'
                          : 'bg-white/[0.04] border-white/12 text-white/90'
                      }`}
                    >
                      {step.you}
                    </div>
                    <svg
                      aria-hidden="true"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-6 text-[#6FD6B0]/65 pointer-events-none"
                      viewBox="0 0 28 24"
                      fill="none"
                    >
                      <path
                        d="M0 12C10 12 16 12 28 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray={step.leadLane === 'you' ? undefined : '3 3'}
                      />
                    </svg>
                  </div>

                  <div className="relative z-10 flex flex-col items-center text-center px-1">
                    <span className="w-8 h-8 rounded-full bg-[#0A3A30] border-2 border-[#6FD6B0] text-[#DDF4EA] text-[12px] font-bold tabular-nums flex items-center justify-center shadow-[0_0_16px_rgba(63,209,165,0.35)]">
                      {step.step}
                    </span>
                    <span className="mt-1.5 px-2 py-0.5 rounded-md bg-[#050E0D] border border-white/12 text-[10.5px] font-semibold text-white leading-tight">
                      {step.title}
                    </span>
                  </div>

                  <div className="relative pl-7 flex items-center">
                    <svg
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-6 text-[#6FD6B0]/65 pointer-events-none"
                      viewBox="0 0 28 24"
                      fill="none"
                    >
                      <path
                        d="M0 12C12 12 18 12 28 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray={step.leadLane === 'openHours' ? undefined : '3 3'}
                      />
                    </svg>
                    <div
                      className={`w-full rounded-[16px] p-4 border text-[13px] leading-relaxed ${
                        step.leadLane === 'openHours'
                          ? 'bg-[#0F4A3E]/55 border-[#6FD6B0]/40 text-white'
                          : 'bg-[#0A3A30]/35 border-white/12 text-white/90'
                      }`}
                    >
                      {step.openHours}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Single-Column Step Cards (< md) */}
          <div className="md:hidden space-y-3.5">
            {wl.steps.map((step) => {
              const rows =
                step.leadLane === 'you'
                  ? [
                      { tag: 'You', text: step.you, isOpenHours: false },
                      { tag: 'Open Hours', text: step.openHours, isOpenHours: true },
                    ]
                  : [
                      { tag: 'Open Hours', text: step.openHours, isOpenHours: true },
                      { tag: 'You', text: step.you, isOpenHours: false },
                    ];

              return (
                <div
                  key={step.step}
                  className="rounded-[18px] bg-white/[0.04] border border-white/12 p-4 space-y-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#0A3A30] border border-[#6FD6B0] text-[#DDF4EA] text-[11px] font-bold tabular-nums flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <h4 className="font-heading text-[15px] font-semibold text-white">
                      {step.title}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {rows.map((row) => (
                      <div
                        key={row.tag}
                        className={`rounded-xl p-3 border text-[12.5px] leading-relaxed ${
                          row.isOpenHours
                            ? 'bg-[#0F4A3E]/45 border-[#6FD6B0]/30 text-white'
                            : 'bg-white/[0.05] border-white/10 text-white/90'
                        }`}
                      >
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            row.isOpenHours ? 'text-[#A8EBD3]' : 'text-white/75'
                          }`}
                        >
                          {row.tag}
                        </span>
                        <p>{row.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Cards Below Lanes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-[18px] bg-[#0F4A3E]/35 border border-[#6FD6B0]/30 p-4 sm:p-5">
              <h4 className="font-heading text-[15px] font-semibold text-[#DDF4EA] mb-3">
                What you get
              </h4>
              <ul className="space-y-2">
                {wl.whatYouGet.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13.5px] text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#6FD6B0] shrink-0" strokeWidth={2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[18px] bg-white/[0.05] border border-white/15 p-4 sm:p-5">
              <h4 className="font-heading text-[15px] font-semibold text-white mb-3">
                What we ask of you
              </h4>
              <ul className="space-y-2">
                {wl.whatWeAsk.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13.5px] text-white/90">
                    <Check className="w-4 h-4 text-[#A8EBD3] shrink-0" strokeWidth={2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky Modal Footer CTA */}
        <div className="px-5 sm:px-8 py-4 border-t border-white/12 bg-[#050E0D]/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 h-11 rounded-full border border-white/20 text-[13.5px] font-medium text-white hover:bg-white/10 active:scale-[0.98] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onRequestPartnership}
            className="oh-btn-pill oh-magnetic oh-btn-primary w-full sm:w-auto pl-6 pr-3.5 h-12 text-[14.5px] font-semibold cursor-pointer"
          >
            <span>{wl.modalCtaLabel}</span>
            <span className="oh-btn-arrow-circle bg-white/15 text-white">
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
