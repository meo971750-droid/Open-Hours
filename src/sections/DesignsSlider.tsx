import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { TradeName } from '../content';
import { CONFIG, config } from '../config';

const SCREENSHOTS_VERSION = '1';

interface ConceptItem {
  id: number | string;
  name: string;
  image: string;
  domain?: string;
  trade?: string;
  location?: string;
  note?: string;
  demoUrl?: string;
}

const DEFAULT_ROOFING_CARDS: ConceptItem[] = [
  {
    id: 1,
    name: 'XYZ Roofing',
    image: `/roofing-sites/1-xyz-roofing.png?v=${SCREENSHOTS_VERSION}`,
    domain: 'xyzroofing.com',
    trade: 'Roofers',
    location: '',
    note: 'Concept for a roofing business',
  },
  {
    id: 2,
    name: 'ABC Roofing',
    image: `/roofing-sites/2-abc-roofing.png?v=${SCREENSHOTS_VERSION}`,
    domain: 'abcroofing.com',
    trade: 'Roofers',
    location: '',
    note: 'Concept for a roofing business',
  },
  {
    id: 3,
    name: 'Alex Roofing',
    image: `/roofing-sites/3-alex-roofing.png?v=${SCREENSHOTS_VERSION}`,
    domain: 'alexroofing.com',
    trade: 'Roofers',
    location: '',
    note: 'Concept for a roofing business',
  },
  {
    id: 4,
    name: 'Roofen',
    image: `/roofing-sites/4-roofen.png?v=${SCREENSHOTS_VERSION}`,
    domain: 'roofen.com',
    trade: 'Roofers',
    location: '',
    note: 'Concept for a roofing business',
  },
  {
    id: 5,
    name: 'Atlantic Slate Roofing',
    image: `/roofing-sites/5-atlantic-slate-roofing.png?v=${SCREENSHOTS_VERSION}`,
    domain: 'atlanticslateroofing.com',
    trade: 'Roofers',
    location: '',
    note: 'Concept for a roofing business',
  },
];

interface DesignsSliderProps {
  id?: string;
  onOpenAudit?: (trade?: TradeName, cardName?: string) => void;
}

export default function DesignsSlider({ id = 'designs' }: DesignsSliderProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Manual pause toggle state (for WCAG 2.2.2 keyboard / screen reader control)
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    setIsTouching(true);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsTouching(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  // Failed image tracking: hide cards if image fails to load
  const [failedImageIds, setFailedImageIds] = useState<Set<number | string>>(new Set());

  // Lightbox state
  const [lightboxCard, setLightboxCard] = useState<ConceptItem | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Determine concept items from config.portfolio or fallback to default 5 concepts
  type PossiblePortfolioItem = {
    id?: number | string;
    name?: string;
    title?: string;
    image?: string;
    src?: string;
    thumbnail?: string;
    domain?: string;
    trade?: string;
    location?: string;
    note?: string;
    demoUrl?: string;
  };

  const rawPortfolio =
    (config as unknown as { portfolio?: PossiblePortfolioItem[] })?.portfolio ||
    (CONFIG as unknown as { portfolio?: PossiblePortfolioItem[] })?.portfolio;

  const sourceConcepts: ConceptItem[] =
    Array.isArray(rawPortfolio) && rawPortfolio.length > 0
      ? rawPortfolio.map((item, idx) => ({
          id: item.id ?? idx + 1,
          name: item.name || item.title || `Concept ${idx + 1}`,
          image: item.image || item.src || item.thumbnail || '',
          domain: item.domain || '',
          trade: item.trade || 'Roofers',
          location: item.location || '',
          note: item.note || 'Concept for a roofing business',
          demoUrl: item.demoUrl,
        }))
      : DEFAULT_ROOFING_CARDS;

  // Active cards: hide any card with empty image or that errored out
  const activeCards = sourceConcepts.filter(
    (card) => Boolean(card.image && card.image.trim()) && !failedImageIds.has(card.id)
  );

  const handleImageError = (cardId: number | string, src: string) => {
    if (import.meta.env.DEV) {
      console.warn(`[DesignsSlider] Concept card image failed to load for card "${cardId}": ${src}`);
    }
    setFailedImageIds((prev) => {
      const next = new Set(prev);
      next.add(cardId);
      return next;
    });
  };

  // CSS mask for the smooth tab notch at the bottom-right corner
  // Progressive fallback: if mask is unsupported, the card retains its rounded shape
  // and the circular button overlaps the bottom-right corner.
  const notchMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      'radial-gradient(circle 56px at calc(100% - 38px) calc(100% - 38px), transparent 55.5px, black 56px)',
    maskImage:
      'radial-gradient(circle 56px at calc(100% - 38px) calc(100% - 38px), transparent 55.5px, black 56px)',
  };

  // Soft edge fade on the left and right sides of the marquee
  const edgeFadeMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      'linear-gradient(to right, transparent 0%, black clamp(24px, 5vw, 64px), black calc(100% - clamp(24px, 5vw, 64px)), transparent 100%)',
    maskImage:
      'linear-gradient(to right, transparent 0%, black clamp(24px, 5vw, 64px), black calc(100% - clamp(24px, 5vw, 64px)), transparent 100%)',
  };

  // Card action: open live demo in new tab if valid URL exists, otherwise open accessible Lightbox
  const handleCardAction = (card: ConceptItem) => {
    const cardUrl = card.demoUrl;
    const configUrl = (CONFIG as unknown as { liveDemoUrl?: string })?.liveDemoUrl;
    const activeUrl =
      cardUrl && typeof cardUrl === 'string' && cardUrl.trim() && !cardUrl.startsWith('[')
        ? cardUrl.trim()
        : configUrl && typeof configUrl === 'string' && configUrl.trim() && !configUrl.startsWith('[')
        ? configUrl.trim()
        : null;

    if (activeUrl) {
      window.open(activeUrl, '_blank', 'noopener,noreferrer');
    } else {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      setLightboxCard(card);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxCard(null);
    lastFocusedRef.current?.focus({ preventScroll: true });
  };

  // Lightbox focus trap, scroll lock, and Esc key handler
  useEffect(() => {
    if (!lightboxCard) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseLightbox();
        return;
      }

      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusableEls = modalContainerRef.current.querySelectorAll<HTMLElement>(
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
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxCard]);

  // Render a single concept card
  const renderCard = (
    card: ConceptItem,
    _idx: number,
    isDuplicate: boolean = false
  ) => {
    return (
      <div
        key={`${card.id}-${isDuplicate ? 'dup' : 'orig'}`}
        className="w-[clamp(240px,70vw,320px)] sm:w-[clamp(260px,28vw,400px)] aspect-[4/5] shrink-0 snap-start"
      >
        <button
          type="button"
          tabIndex={isDuplicate ? -1 : 0}
          onClick={() => handleCardAction(card)}
          onFocus={(e) => {
            if (e.target.matches?.(':focus-visible')) {
              setIsKeyboardFocused(true);
            }
          }}
          onBlur={() => setIsKeyboardFocused(false)}
          aria-label={isDuplicate ? undefined : `View ${card.name} concept`}
          className={`group relative w-full h-full block rounded-[28px] sm:rounded-[32px] text-left cursor-pointer outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#12303D] focus-visible:ring-offset-4 ${
            shouldReduceMotion
              ? ''
              : 'hover:-translate-y-1 focus-visible:-translate-y-1'
          }`}
        >
          {/* Card shape with bottom-right notch cutout */}
          <div
            style={notchMaskStyle}
            className="w-full h-full rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#EEF3F4] relative"
          >
            {/* The teal background is on the card wrapper itself (bg-[#EEF3F4]).
                The image layer sits above the placeholder background with position: absolute; inset: 0 */}
            <img
              src={card.image}
              alt={isDuplicate ? '' : `${card.name} website concept (Illustrative example)`}
              width={1400}
              height={875}
              loading="eager"
              decoding="async"
              onError={() => handleImageError(card.id, card.image)}
              className={`absolute inset-0 w-full h-full object-cover object-top block z-10 transition-transform duration-300 ease-out ${
                shouldReduceMotion
                  ? ''
                  : 'group-hover:scale-[1.03] group-focus-visible:scale-[1.03]'
              }`}
            />
          </div>

          {/* Circular dark teal button inside notch */}
          <div
            aria-hidden="true"
            className={`absolute bottom-2.5 right-2.5 z-20 w-14 h-14 rounded-full bg-[#12303D] text-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:bg-[#C8642E] group-focus-visible:bg-[#C8642E] ${
              shouldReduceMotion
                ? ''
                : 'group-hover:rotate-45 group-focus-visible:rotate-45'
            }`}
          >
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    );
  };

  return (
    <section
      id={id}
      aria-label="Example website designs"
      className="w-full bg-[#FFFFFF] py-16 sm:py-20 md:py-24 overflow-hidden scroll-mt-24"
    >
      <style>{`
        @keyframes openhours-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          animation: openhours-marquee 45s linear infinite;
        }
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
        .marquee-wrapper:has(:focus-visible) .marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <Container>
        {/* ==================================================== */}
        {/* HEADER: Single Centred Column                         */}
        {/* ==================================================== */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-12 px-4">
          <h2 className="text-[clamp(32px,4.4vw,54px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#12303D] mb-3">
            Designs built to{' '}
            <Accent className="text-[#C8642E] whitespace-nowrap">
              catch enquiries
            </Accent>
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#12303D]/75 leading-relaxed max-w-[640px] mx-auto text-center font-normal">
            Five roofing website concepts, each laid out so a homeowner can call or send an
            enquiry without hunting for the button.
          </p>

          {/* WCAG 2.2.2 keyboard & screen-reader visible-on-focus pause control */}
          {!shouldReduceMotion && (
            <button
              type="button"
              onClick={() => setIsUserPaused((prev) => !prev)}
              aria-pressed={isUserPaused}
              className="sr-only focus:not-sr-only focus:inline-flex focus:items-center focus:gap-2 focus:px-4 focus:py-2 focus:mt-4 focus:rounded-full focus:bg-[#12303D] focus:text-white focus:text-sm focus:font-semibold focus:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8642E] cursor-pointer"
            >
              {isUserPaused ? 'Resume sliding cards animation' : 'Pause sliding cards animation'}
            </button>
          )}
        </div>
      </Container>

      {/* ==================================================== */}
      {/* MARQUEE CAROUSEL ROW                                  */}
      {/* ==================================================== */}
      {activeCards.length > 0 && (
        <div
          style={shouldReduceMotion ? undefined : edgeFadeMaskStyle}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="marquee-wrapper relative w-full overflow-hidden select-none py-2"
        >
          {shouldReduceMotion ? (
            /* Reduced-motion & non-animated fallback: horizontally scrollable row with scroll-snap */
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-5 sm:gap-6 px-5 sm:px-8 py-2">
              {activeCards.map((card, idx) => renderCard(card, idx, false))}
            </div>
          ) : (
            /* Continuous infinite sliding marquee track */
            <div
              className="flex w-max items-center marquee-track"
              style={{
                animationPlayState:
                  isUserPaused || isTouching || isKeyboardFocused ? 'paused' : undefined,
              }}
            >
              {/* Set 1: primary interactive cards */}
              <div className="flex gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0">
                {activeCards.map((card, idx) => renderCard(card, idx, false))}
              </div>

              {/* Set 2: seamless duplicate for infinite loop (hidden from assistive tech) */}
              <div
                className="flex gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0"
                aria-hidden="true"
                inert={true as unknown as undefined}
              >
                {activeCards.map((card, idx) => renderCard(card, idx, true))}
              </div>
            </div>
          )}
        </div>
      )}

      <Container>
        {/* ==================================================== */}
        {/* FOOTER DISCLAIMER                                    */}
        {/* ==================================================== */}
        <p className="text-[13px] text-[#5E6F77] text-center mt-6 sm:mt-8">
          Concept designs shown for illustration. They are not client projects.
        </p>
      </Container>

      {/* ==================================================== */}
      {/* ACCESSIBLE LIGHTBOX DIALOG                           */}
      {/* ==================================================== */}
      {lightboxCard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxCard.name} concept illustrative example`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#0F2A35]/85 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseLightbox();
          }}
        >
          <div
            ref={modalContainerRef}
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center bg-[#FFFFFF] rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-2xl border border-[rgba(15,42,53,0.12)] overflow-hidden"
          >
            {/* Close button with focus trap target */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleCloseLightbox}
              aria-label="Close concept preview"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-[#12303D] hover:bg-[#1A3D4C] text-white flex items-center justify-center transition-colors cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8642E]"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Enlarged image */}
            <div className="w-full flex-1 min-h-0 overflow-auto rounded-[16px] sm:rounded-[20px] bg-[#EEF3F4] flex items-center justify-center p-2 sm:p-4">
              <img
                src={lightboxCard.image}
                alt={`${lightboxCard.name} website concept (Illustrative example)`}
                className="max-h-[70vh] w-auto h-auto object-contain rounded-[12px] sm:rounded-[16px] shadow-sm block"
              />
            </div>

            {/* Footer caption */}
            <div className="w-full mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
              <span className="text-[14px] sm:text-[15px] font-semibold text-[#12303D]">
                {lightboxCard.name}{' '}
                <span className="font-normal text-[#5E6F77]">— Illustrative example</span>
              </span>
              <span className="text-[12px] sm:text-[13px] text-[#5E6F77]">
                Concept designs shown for illustration. They are not client projects.
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
