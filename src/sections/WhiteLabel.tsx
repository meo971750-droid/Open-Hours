import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Handshake, ListChecks } from 'lucide-react';
import Container from '../components/Container';
import { config } from '../config';
import { useAnimationInView } from '../hooks/useAnimationInView';
import { getResponsiveImageProps } from '../lib/images';
import { preloadSectionAndNext } from '../components/LazySection';

const WhiteLabelModal = lazy(() => import('../components/WhiteLabelModal'));

interface WhiteLabelProps {
  onOpenAudit?: () => void;
}

function WhiteLabelIllustration() {
  const thumbOne = config.portfolio?.[0]?.image || '/roofing-sites/1-xyz-roofing.png';
  const thumbTwo = config.portfolio?.[1]?.image || '/roofing-sites/3-alex-roofing.png';
  const thumbOneProps = getResponsiveImageProps(thumbOne, [320, 640], '260px', 'good');
  const thumbTwoProps = getResponsiveImageProps(thumbTwo, [320, 640], '260px', 'good');

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
                {...thumbOneProps}
                alt=""
                width={360}
                height={240}
                loading="lazy"
                decoding="async"
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
                {...thumbTwoProps}
                alt=""
                width={360}
                height={240}
                loading="lazy"
                decoding="async"
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
  const sectionRef = useRef<HTMLElement>(null);
  useAnimationInView(sectionRef, false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  const ctaTriggerRef = useRef<HTMLButtonElement>(null);
  const customImage = wl.image?.trim() || '';

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

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
      const detail = {
        option: 'White label',
        message:
          "We're an agency interested in talking about a white-label website project. Here's a bit about our agency and typical client builds:",
      };
      (window as Window & { __ohPendingContactPrefill?: unknown }).__ohPendingContactPrefill = detail;
      preloadSectionAndNext('contact', 'faq');
      window.dispatchEvent(new CustomEvent('openhours:prefill-contact', { detail }));
      contactEl.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      return;
    }
    onOpenAudit?.();
  };

  return (
    <section
      id="white-label"
      ref={sectionRef}
      aria-labelledby="white-label-heading"
      className="oh-cv-auto oh-anim-paused w-full bg-[#F3F5F3] py-16 sm:py-24 overflow-x-clip"
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
                  decoding="async"
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
      {isModalOpen && (
        <Suspense fallback={null}>
          <WhiteLabelModal
            wl={wl}
            onClose={handleCloseModal}
            onRequestPartnership={handleRequestPartnership}
          />
        </Suspense>
      )}
    </section>
  );
}
