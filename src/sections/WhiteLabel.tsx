import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Handshake,
  ListChecks,
  X,
} from 'lucide-react';
import Container from '../components/Container';
import { config } from '../config';
import { OH_DUR, OH_EASE } from '../lib/motion';

interface WhiteLabelProps {
  onOpenAudit?: () => void;
}

function WhiteLabelIllustration() {
  const thumbOne = config.portfolio?.[0]?.image || '/roofing-sites/1-xyz-roofing.png';
  const thumbTwo = config.portfolio?.[1]?.image || '/roofing-sites/3-alex-roofing.png';

  return (
    <div className="relative w-full h-full min-h-[235px] sm:min-h-[265px] lg:min-h-[380px] flex items-center justify-center px-4 py-5 sm:p-7 select-none overflow-hidden">
      {/* Soft Mint Sparkles */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-5 left-7 w-4 h-4 text-[#A8EBD3]/80"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-8 w-3 h-3 text-[#6FD6B0]/70"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 left-10 w-2.5 h-2.5 text-[#A8EBD3]/60"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
      </svg>

      {/* Floating Stack Wrapper (8px / 7s float) */}
      <div className="oh-whitelabel-float relative z-10 w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center">
        {/* Three Layered Tilted Browser Windows */}
        <div className="relative w-full h-[178px] sm:h-[214px] lg:h-[238px]">
          {/* Back-left Browser Window (portfolio concept thumbnail, green-tinted) */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-3 w-[56%] h-[78%] -rotate-6 rounded-[14px] overflow-hidden border border-[#6FD6B0]/30 bg-[#0A3A30] shadow-[0_14px_30px_rgba(4,11,10,0.6)]"
          >
            <div className="h-4 px-2 bg-[#072820] border-b border-white/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>
            <div className="relative w-full h-[calc(100%-16px)] bg-[#0A3A30]">
              <img
                src={thumbOne}
                alt=""
                width={360}
                height={240}
                loading="lazy"
                className="w-full h-full object-cover object-top opacity-75 saturate-50"
              />
              <div className="absolute inset-0 bg-[#0F4A3E]/45 mix-blend-multiply" />
            </div>
          </div>

          {/* Back-right Browser Window (portfolio concept thumbnail, green-tinted) */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-2 w-[56%] h-[78%] rotate-[5deg] rounded-[14px] overflow-hidden border border-[#6FD6B0]/30 bg-[#0A3A30] shadow-[0_14px_30px_rgba(4,11,10,0.6)]"
          >
            <div className="h-4 px-2 bg-[#072820] border-b border-white/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>
            <div className="relative w-full h-[calc(100%-16px)] bg-[#0A3A30]">
              <img
                src={thumbTwo}
                alt=""
                width={360}
                height={240}
                loading="lazy"
                className="w-full h-full object-cover object-top opacity-75 saturate-50"
              />
              <div className="absolute inset-0 bg-[#0F4A3E]/45 mix-blend-multiply" />
            </div>
          </div>

          {/* Front Browser Window: Clean Website Wireframe with "YOUR AGENCY LOGO" Tile */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[76%] sm:w-[74%] h-[84%] -rotate-[1deg] rounded-[16px] overflow-hidden border border-[#A8EBD3]/45 bg-[#F8FBF9] shadow-[0_22px_48px_-12px_rgba(4,11,10,0.8)]">
            {/* Browser Bar */}
            <div className="h-5 px-2.5 bg-[#0F4A3E] flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A8EBD3]/65" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
              <span className="px-2 py-0.5 rounded bg-white/15 text-[8px] font-mono text-[#DDF4EA] tracking-tight">
                client-domain.ie
              </span>
            </div>

            {/* Clean Wireframe Interior */}
            <div className="p-3 sm:p-3.5 h-[calc(100%-20px)] flex flex-col justify-between text-[#0B1B22]">
              <div className="flex items-center justify-between gap-2">
                {/* Rounded "YOUR AGENCY LOGO" Tile */}
                <span className="inline-flex items-center px-2.5 py-1 rounded-[8px] bg-[#DDF4EA] border border-[#14624F]/25 text-[9px] sm:text-[9.5px] font-bold tracking-[0.06em] text-[#0F4A3E] uppercase">
                  YOUR AGENCY LOGO
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-1.5 rounded-full bg-[#0B1B22]/15" />
                  <span className="w-6 h-3 rounded-full bg-[#14624F]" />
                </div>
              </div>

              {/* Wireframe Content Placeholder */}
              <div className="space-y-1.5 my-1">
                <div className="w-4/5 h-2.5 rounded-full bg-[#0B1B22]/85" />
                <div className="w-3/5 h-2 rounded-full bg-[#475754]/35" />
              </div>

              {/* Wireframe Cards Row */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-8 sm:h-10 rounded-[8px] bg-[#E9ECEA] border border-[rgba(11,27,34,0.08)]" />
                <div className="h-8 sm:h-10 rounded-[8px] bg-[#DDF4EA]/70 border border-[#14624F]/20" />
                <div className="h-8 sm:h-10 rounded-[8px] bg-[#E9ECEA] border border-[rgba(11,27,34,0.08)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Handoff Strip: Muted "Open Hours" -> Curved Arrow -> Bright "Your agency" */}
        <div className="mt-4 flex items-center justify-center gap-2 sm:gap-2.5">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium text-white/85">
            Open Hours
          </span>

          <svg
            aria-hidden="true"
            className="w-10 h-5 text-[#6FD6B0] shrink-0"
            viewBox="0 0 44 20"
            fill="none"
          >
            <path
              d="M3 13C14 3 27 3 39 11"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <path
              d="M35 6.5L40 11.5L33.5 13"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="px-3.5 py-1 rounded-full bg-[#1E9E6A]/25 border border-[#6FD6B0]/65 text-[11.5px] font-semibold text-[#DDF4EA] shadow-[0_0_20px_rgba(63,209,165,0.28)]">
            Your agency
          </span>
        </div>
      </div>
    </div>
  );
}

export default function WhiteLabel({ onOpenAudit }: WhiteLabelProps) {
  const wl = config.whiteLabel;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const ctaTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalPanelRef = useRef<HTMLDivElement>(null);

  const customImage = wl.image?.trim() || '';

  // Esc, Focus Trap, Scroll Lock & Focus Return on Modal Close
  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsModalOpen(false);
        window.requestAnimationFrame(() => {
          ctaTriggerRef.current?.focus({ preventScroll: true });
        });
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
          if (document.activeElement === firstEl || !modalPanelRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl || !modalPanelRef.current.contains(document.activeElement)) {
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
  }, [isModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.requestAnimationFrame(() => {
      ctaTriggerRef.current?.focus({ preventScroll: true });
    });
  };

  const handleRequestPartnership = () => {
    setIsModalOpen(false);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      window.dispatchEvent(
        new CustomEvent('openhours:prefill-contact', {
          detail: {
            option: 'White label',
            message:
              "We're an agency interested in talking about a white-label website project. Here's a bit about our agency and typical client builds:",
          },
        })
      );
      contactEl.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      return;
    }
    onOpenAudit?.();
  };

  return (
    <section
      id="white-label"
      aria-labelledby="white-label-heading"
      className="oh-cv-auto w-full bg-[#F3F5F3] py-16 sm:py-24 overflow-x-clip"
    >
      <Container className="max-w-[1160px]">
        {/* Top Centered Brand-Green Emblem & Two-Tone Heading */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-full flex items-center justify-center text-white mb-4 border border-[#6FD6B0]/35"
            style={{
              background: 'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
              boxShadow: '0 8px 22px -4px rgba(30, 158, 106, 0.48)',
            }}
          >
            <Handshake className="w-4 h-4" strokeWidth={1.75} />
          </div>

          <h2
            id="white-label-heading"
            className="font-heading text-[32px] sm:text-[44px] md:text-[52px] tracking-[-0.03em] leading-[1.08] max-w-3xl"
          >
            <span className="oh-line-mask">
              <span className="oh-line-reveal font-normal text-[#475754]">
                {wl.headingLead}
              </span>
            </span>{' '}
            <span className="oh-line-mask">
              <span className="oh-line-reveal oh-line-reveal-delay-1 font-medium text-[#0B1B22]">
                {wl.headingAccent}
              </span>
            </span>
          </h2>
        </div>

        {/* Outer Architectural White Rim */}
        <div className="rounded-[30px] sm:rounded-[34px] p-2 sm:p-2.5 border border-[rgba(11,27,34,0.1)] bg-white/55 shadow-[0_14px_38px_-18px_rgba(11,27,34,0.1)]">
          {/* Inner Dark Banner Card with Brand-Green Glow */}
          <div
            data-spotlight=""
            className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#040B0A] min-h-[360px] sm:min-h-[410px] lg:min-h-[430px] flex flex-col lg:flex-row items-stretch border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
            style={{
              backgroundImage: [
                'radial-gradient(ellipse 56% 68% at 72% 48%, rgba(20, 115, 90, 0.52) 0%, rgba(15, 74, 62, 0.3) 44%, transparent 74%)',
                'radial-gradient(ellipse 46% 52% at 22% 84%, rgba(30, 158, 106, 0.22) 0%, rgba(15, 74, 62, 0.12) 48%, transparent 74%)',
                'linear-gradient(108deg, #040B0A 0%, #061411 48%, #081F1A 76%, #040B0A 100%)',
              ].join(', '),
            }}
          >
            {/* Subtle Tiled Stipple Grain Overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.035] z-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect x='3' y='5' width='1' height='1' fill='%23A8EBD3' fill-opacity='0.65'/%3E%3Crect x='15' y='11' width='1' height='1' fill='%23FFFFFF' fill-opacity='0.55'/%3E%3Crect x='28' y='4' width='1' height='1' fill='%23A8EBD3' fill-opacity='0.5'/%3E%3Crect x='40' y='13' width='1' height='1' fill='%23FFFFFF' fill-opacity='0.6'/%3E%3Crect x='9' y='21' width='1' height='1' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3Crect x='22' y='26' width='1' height='1' fill='%23A8EBD3' fill-opacity='0.6'/%3E%3Crect x='35' y='19' width='1' height='1' fill='%23FFFFFF' fill-opacity='0.45'/%3E%3Crect x='45' y='29' width='1' height='1' fill='%23A8EBD3' fill-opacity='0.55'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Visual Column: Above text on mobile (order-1), Right half on desktop (lg:order-2) */}
            <div className="relative z-[5] order-1 lg:order-2 w-full lg:w-[48%] flex items-center justify-center overflow-hidden border-b border-white/10 lg:border-b-0">
              {customImage && !imageFailed ? (
                <img
                  src={customImage}
                  alt="White-label website build showcase"
                  width={560}
                  height={420}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setImageFailed(true)}
                  className="w-full h-full max-h-[260px] sm:max-h-[320px] lg:max-h-[430px] object-cover select-none"
                />
              ) : (
                <WhiteLabelIllustration />
              )}
            </div>

            {/* Text & CTA Column: Below visual on mobile (order-2), Left half on desktop (lg:order-1) */}
            <div className="relative z-10 order-2 lg:order-1 w-full lg:w-[52%] px-7 sm:px-12 lg:px-14 py-9 sm:py-12 lg:py-14 flex flex-col justify-center items-start text-left">
              <h3 className="font-heading text-[26px] sm:text-[34px] lg:text-[40px] font-normal tracking-[-0.025em] leading-[1.15] text-white max-w-[18.5ch]">
                {wl.cardTitle}
              </h3>

              <p className="mt-4 mb-8 text-[15px] sm:text-[17px] leading-[1.5] text-white/75 font-normal">
                {wl.cardSubtitle}
              </p>

              {/* Glowing Emerald Halo + White Pill CTA with List-Steps Icon Circle */}
              <button
                ref={ctaTriggerRef}
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group relative inline-flex items-center p-[6px] rounded-full transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#6FD6B0] focus-visible:outline-offset-4"
                style={{
                  background: 'rgba(20, 115, 90, 0.36)',
                  border: '1px solid rgba(111, 214, 176, 0.42)',
                  boxShadow:
                    '0 0 40px rgba(30, 158, 106, 0.55), 0 12px 26px -8px rgba(4, 11, 10, 0.75)',
                }}
              >
                <span className="inline-flex items-center gap-3.5 bg-white text-[#0B1B22] rounded-full pl-2 pr-6 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <span
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shrink-0 transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
                    style={{
                      background:
                        'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
                      boxShadow:
                        'inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 4px 12px rgba(20, 98, 79, 0.4)',
                    }}
                  >
                    <ListChecks className="w-4 h-4 text-white" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="text-[14.5px] sm:text-[15.5px] font-semibold tracking-tight text-[#0B1B22] whitespace-nowrap">
                    {wl.ctaLabel}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Accessible White-Label Partnership Swimlane Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : OH_DUR.base, ease: OH_EASE }}
            className="fixed inset-0 z-50 bg-[#040B0A]/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              ref={modalPanelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="whitelabel-modal-title"
              aria-describedby="whitelabel-modal-subtitle"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: shouldReduceMotion ? 0 : OH_DUR.base, ease: OH_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-[100dvh] sm:h-auto sm:w-[min(1080px,94vw)] sm:max-h-[90vh] sm:rounded-[28px] bg-[#061310]/95 backdrop-blur-xl border-0 sm:border sm:border-white/15 text-white shadow-[0_32px_90px_-16px_rgba(4,11,10,0.85)] flex flex-col overflow-hidden"
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
                  onClick={handleCloseModal}
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
                  {/* Lane Column Headers */}
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

                  {/* Swimlane Rows with Central Animated Vertical Progress Line */}
                  <div className="relative space-y-4">
                    {/* Base Central Track */}
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-white/12 rounded-full overflow-hidden"
                    >
                      <motion.div
                        initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: shouldReduceMotion ? 0 : OH_DUR.slow, ease: OH_EASE }}
                        className="w-full h-full origin-top rounded-full bg-gradient-to-b from-[#A8EBD3] via-[#6FD6B0] to-[#1E9E6A]"
                      />
                    </div>

                    {wl.steps.map((step) => (
                      <div
                        key={step.step}
                        className="relative grid grid-cols-[1fr_112px_1fr] items-center"
                      >
                        {/* Left Lane: You (the agency) */}
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
                          {/* Curved SVG Connector: Left Card -> Center Node */}
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

                        {/* Center Node & Step Title */}
                        <div className="relative z-10 flex flex-col items-center text-center px-1">
                          <span className="w-8 h-8 rounded-full bg-[#0A3A30] border-2 border-[#6FD6B0] text-[#DDF4EA] text-[12px] font-bold tabular-nums flex items-center justify-center shadow-[0_0_16px_rgba(63,209,165,0.35)]">
                            {step.step}
                          </span>
                          <span className="mt-1.5 px-2 py-0.5 rounded-md bg-[#050E0D] border border-white/12 text-[10.5px] font-semibold text-white leading-tight">
                            {step.title}
                          </span>
                        </div>

                        {/* Right Lane: Open Hours */}
                        <div className="relative pl-7 flex items-center">
                          {/* Curved SVG Connector: Center Node -> Right Card */}
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
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-[13.5px] text-white"
                        >
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
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-[13.5px] text-white/90"
                        >
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
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto px-5 h-11 rounded-full border border-white/20 text-[13.5px] font-medium text-white hover:bg-white/10 active:scale-[0.98] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleRequestPartnership}
                  className="oh-btn-pill oh-magnetic oh-btn-primary w-full sm:w-auto pl-6 pr-3.5 h-12 text-[14.5px] font-semibold cursor-pointer"
                >
                  <span>{wl.modalCtaLabel}</span>
                  <span className="oh-btn-arrow-circle bg-white/15 text-white">
                    <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
