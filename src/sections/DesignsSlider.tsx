import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  LayoutTemplate,
  ArrowUpRight,
} from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { TradeName } from '../content';

const SCREENSHOTS_VERSION = "1";

const ROOFING_CARDS = [
  { id: 1, name: "XYZ Roofing",           image: `/roofing-sites/1-xyz-roofing.png?v=${SCREENSHOTS_VERSION}`,            domain: "xyzroofing.com",           trade: "Roofers", location: "[ADD LOCATION]", note: "Concept for a roofing business" },
  { id: 2, name: "ABC Roofing",           image: `/roofing-sites/2-abc-roofing.png?v=${SCREENSHOTS_VERSION}`,            domain: "abcroofing.com",           trade: "Roofers", location: "[ADD LOCATION]", note: "Concept for a roofing business" },
  { id: 3, name: "Alex Roofing",          image: `/roofing-sites/3-alex-roofing.png?v=${SCREENSHOTS_VERSION}`,           domain: "alexroofing.com",          trade: "Roofers", location: "[ADD LOCATION]", note: "Concept for a roofing business" },
  { id: 4, name: "Roofen",                image: `/roofing-sites/4-roofen.png?v=${SCREENSHOTS_VERSION}`,                 domain: "roofen.com",               trade: "Roofers", location: "[ADD LOCATION]", note: "Concept for a roofing business" },
  { id: 5, name: "Atlantic Slate Roofing", image: `/roofing-sites/5-atlantic-slate-roofing.png?v=${SCREENSHOTS_VERSION}`, domain: "atlanticslateroofing.com", trade: "Roofers", location: "[ADD LOCATION]", note: "Concept for a roofing business" }
];

function CardScreenshot({ card, index }: { card: typeof ROOFING_CARDS[number]; index: number }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full aspect-[16/10] bg-[#EEF3F4] overflow-hidden">
      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#EEF3F4]">
          <span className="text-[16px] text-[#5E6F77] font-normal">
            Preview coming soon
          </span>
          {import.meta.env.DEV && (
            <span className="mt-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-white/80 text-[#5E6F77] border border-[rgba(15,42,53,0.12)]">
              missing: {card.name}
            </span>
          )}
        </div>
      ) : (
        <img
          src={card.image}
          alt={`${card.name} website concept`}
          width={1400}
          height={875}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top"
          loading={index < 3 ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

interface DesignsSliderProps {
  id?: string;
  onOpenAudit?: (trade?: TradeName) => void;
}

const BASE_TILTS = [-2.4, 1.8, -1.5, 2.2, -1.8, 1.4, -2.1, 2.0];

const loopCards = [...ROOFING_CARDS, ...ROOFING_CARDS];

export default function DesignsSlider({ id = 'designs', onOpenAudit }: DesignsSliderProps) {
  const cards = loopCards;
  const totalCards = cards.length;
  const hasConcept = true;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ropePathRef = useRef<SVGPathElement>(null);
  const highlightPathRef = useRef<SVGPathElement>(null);
  const cardElsRef = useRef<(HTMLDivElement | null)[]>([]);

  // State for centered card in Info Bar (updates ONLY when index changes)
  const [centeredIndex, setCenteredIndex] = useState(0);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [stageWidth, setStageWidth] = useState(1200);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [debugState, setDebugState] = useState({ isDrifting: true, reason: 'running' });

  // Refs for animation loop (no React re-renders per frame)
  const pRef = useRef(0);
  const speedMultRef = useRef(1); // lerps to target (0 or 1)
  const lastTimeRef = useRef<number | null>(null);
  const transitionRef = useRef<{
    startP: number;
    targetP: number;
    startTime: number;
    duration: number;
  } | null>(null);

  // Interaction refs (no drag/swipe)
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const isUserPausedRef = useRef(false);
  const isIntersectingRef = useRef(true);
  const isDocumentVisibleRef = useRef(true);

  // Keep isUserPausedRef in sync
  useEffect(() => {
    isUserPausedRef.current = isUserPaused;
  }, [isUserPaused]);

  // Motion reduced check
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Stage width with ResizeObserver
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateWidth = () => {
      if (el) {
        setStageWidth(el.clientWidth || window.innerWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Responsive dimensions
  const isMobile = stageWidth < 768;
  const sagBase = isMobile ? 34 : 46;
  const y0 = isMobile ? 28 : 36;
  const cardWidth = isMobile ? 260 : 285;
  const cardGap = isMobile ? 22 : 32;
  const slotWidth = cardWidth + cardGap;

  // Drag and swipe refs
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Recompute pause flags
  const recomputePauseFlags = useCallback(() => {
    if (typeof document !== 'undefined') {
      isDocumentVisibleRef.current = document.visibilityState === 'visible';
    }
  }, []);

  // IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        recomputePauseFlags();
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [recomputePauseFlags]);

  // Visibility change
  useEffect(() => {
    const handleVisChange = () => {
      isDocumentVisibleRef.current = document.visibilityState === 'visible';
      recomputePauseFlags();
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => document.removeEventListener('visibilitychange', handleVisChange);
  }, [recomputePauseFlags]);

  // Action handler
  const handleGetDesign = useCallback(
    (trade?: TradeName) => {
      if (onOpenAudit) {
        onOpenAudit(trade);
      } else {
        const input = document.getElementById('audit-email-input');
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    },
    [onOpenAudit]
  );

  // Transition to specific card offset (e.g. arrows, card click)
  const animateToPhase = useCallback((targetPhase: number, duration = 550) => {
    transitionRef.current = {
      startP: pRef.current,
      targetP: targetPhase,
      startTime: performance.now(),
      duration,
    };
  }, []);

  // Main 60/120fps Automatic Slide Animation Loop (like "What you can count on" marquee)
  useEffect(() => {
    let animId: number;
    let lastReportedIndex = -1;
    let lastDebugUpdate = 0;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Determine target speed multiplier and reason (pauses on hover/focus/pause button, like OurPromises)
      let targetSpeedFactor = 1.0;
      let currentReason = 'running';

      if (prefersReducedMotion) {
        targetSpeedFactor = 0;
        currentReason = 'reduced motion';
      } else if (isUserPausedRef.current) {
        targetSpeedFactor = 0;
        currentReason = 'paused by button';
      } else if (!isDocumentVisibleRef.current) {
        targetSpeedFactor = 0;
        currentReason = 'tab hidden';
      } else if (!isIntersectingRef.current) {
        targetSpeedFactor = 0;
        currentReason = 'off screen';
      } else if (isFocusedRef.current) {
        targetSpeedFactor = 0;
        currentReason = 'keyboard focus';
      } else if (isHoveredRef.current) {
        targetSpeedFactor = 0;
        currentReason = 'hovered (paused)';
      }

      // Smoothly ease speed multiplier toward target
      speedMultRef.current += (targetSpeedFactor - speedMultRef.current) * Math.min(dt * 8, 1);

      // Update phase p
      if (transitionRef.current) {
        const { startP, targetP, startTime, duration } = transitionRef.current;
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        pRef.current = startP + (targetP - startP) * ease;
        if (progress >= 1) {
          transitionRef.current = null;
        }
      } else if (!prefersReducedMotion) {
        // Automatic slide to the left (steady, continuous motion like OurPromises)
        const slotMultiplier = 0.65 + 0.35 * Math.abs(Math.sin(Math.PI * pRef.current));
        const dp = 0.25 * slotMultiplier * speedMultRef.current * dt;
        pRef.current += dp;
      }

      // Update centered index for Info Bar only when integer index changes
      const currentIntCenter = ((Math.round(pRef.current) % ROOFING_CARDS.length) + ROOFING_CARDS.length) % ROOFING_CARDS.length;
      if (currentIntCenter !== lastReportedIndex) {
        lastReportedIndex = currentIntCenter;
        setCenteredIndex(currentIntCenter);
      }

      // Update DEV debug state periodically
      if (import.meta.env.DEV && now - lastDebugUpdate > 250) {
        lastDebugUpdate = now;
        setDebugState({
          isDrifting: speedMultRef.current > 0.05,
          reason: currentReason,
        });
      }

      // Calculate rope sag with subtle dynamic sway
      const timeSec = now / 1000;
      const ropeSway = prefersReducedMotion ? 0 : Math.sin(timeSec * 2.8) * (1.2 * speedMultRef.current);
      const currentSag = sagBase + ropeSway;

      // Update SVG rope path
      if (ropePathRef.current && highlightPathRef.current) {
        const dRope = `M 0,${y0} Q ${stageWidth / 2},${y0 + 2 * currentSag} ${stageWidth},${y0}`;
        const dHigh = `M 0,${y0 - 1} Q ${stageWidth / 2},${y0 + 2 * currentSag - 1} ${stageWidth},${y0 - 1}`;
        ropePathRef.current.setAttribute('d', dRope);
        highlightPathRef.current.setAttribute('d', dHigh);
      }

      // Update each card's transform along the rope
      const cx = stageWidth / 2;
      for (let i = 0; i < totalCards; i++) {
        const el = cardElsRef.current[i];
        if (!el) continue;

        // Calculate d in [-N/2, N/2)
        let d = ((i - (pRef.current % totalCards)) % totalCards);
        if (d < -totalCards / 2) d += totalCards;
        if (d >= totalCards / 2) d -= totalCards;

        const cardStageX = cx + d * slotWidth;
        const t = cardStageX / stageWidth;
        const ropeY = y0 + 4 * currentSag * t * (1 - t);
        const slope = (4 * currentSag * (1 - 2 * t)) / stageWidth;
        const ropeAngle = Math.atan(slope) * (180 / Math.PI);
        const baseTilt = BASE_TILTS[i % BASE_TILTS.length];

        const speedNormalized = speedMultRef.current * (0.65 + 0.35 * Math.abs(Math.sin(Math.PI * pRef.current)));
        const pendulumSway = prefersReducedMotion
          ? 0
          : Math.sin(timeSec * 2.8 + i * 0.7) * (2.2 * speedNormalized);
        const totalRotate = prefersReducedMotion ? 0 : ropeAngle * 0.65 + baseTilt + pendulumSway;
        const cardY = ropeY + 12;

        el.style.transform = `translate3d(${cardStageX - cardWidth / 2}px, ${cardY}px, 0) rotate(${totalRotate}deg)`;
        el.style.zIndex = Math.round(30 - Math.min(Math.abs(d) * 5, 25)).toString();
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [
    prefersReducedMotion,
    stageWidth,
    totalCards,
    slotWidth,
    cardWidth,
    sagBase,
    y0,
  ]);

  // Hover handlers: pauses on hover, resumes on leave (like OurPromises)
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    recomputePauseFlags();
  };

  // Focus and keyboard listeners
  const handleFocus = () => {
    isFocusedRef.current = true;
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    recomputePauseFlags();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      animateToPhase(Math.round(pRef.current) - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      animateToPhase(Math.round(pRef.current) + 1);
    } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Escape') {
      e.preventDefault();
      setIsUserPaused((prev) => {
        const next = !prev;
        setLiveAnnouncement(next ? 'Slider paused' : 'Slider playing');
        return next;
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartPRef.current = pRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 4) {
      hasDraggedRef.current = true;
    }
    const dp = -dx / slotWidth;
    pRef.current = dragStartPRef.current + dp;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (hasDraggedRef.current) {
      animateToPhase(Math.round(pRef.current), 350);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handleCardClick = (idx: number, e: React.MouseEvent) => {
    if (hasDraggedRef.current) return;
    let d = ((idx - (Math.round(pRef.current) % totalCards)) % totalCards);
    if (d < -totalCards / 2) d += totalCards;
    if (d >= totalCards / 2) d -= totalCards;
    if (Math.abs(d) > 0.3) {
      animateToPhase(Math.round(pRef.current) + d, 500);
    }
  };

  // Active card details for Info Bar
  const activeCard = ROOFING_CARDS[centeredIndex] || ROOFING_CARDS[0];
  const showActiveLocation = !import.meta.env.PROD || !activeCard.location.startsWith('[');

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-label="Example website designs"
      className="w-full bg-[#FFFFFF] pt-14 sm:pt-20 md:pt-24 pb-12 overflow-x-clip overflow-y-visible scroll-mt-24"
    >
      <Container>
        {/* Header (Centred, same style as other sections) */}
        <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F6F8] border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-semibold text-[#1E4A5C]">
            <LayoutTemplate className="w-3.5 h-3.5 text-[#1E4A5C]" />
            <span>Our designs</span>
          </div>

          <h2 className="text-[clamp(32px,4.4vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-3xl mb-3">
            Designs built to <Accent>catch enquiries</Accent>
          </h2>

          <p className="text-[17px] sm:text-[19px] text-[#5E6F77] max-w-2xl mx-auto font-normal">
            A few of the styles we build for trades. Yours is shaped around your own work, colours and reviews.
          </p>

          {hasConcept && (
            <p className="text-[13px] text-[#5E6F77] text-center mt-3">
              Concept designs shown for illustration. They are not client projects.
            </p>
          )}
        </div>
      </Container>

      {/* Stage: automatic sliding clothesline with drag/swipe and side-card click */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-label="Example website designs"
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="relative w-full h-[418px] sm:h-[466px] md:h-[526px] overflow-x-clip overflow-y-visible select-none bg-transparent outline-none cursor-grab active:cursor-grabbing touch-pan-y focus-visible:ring-2 focus-visible:ring-[#1E4A5C] focus-visible:ring-offset-2"
      >
        {/* Polite Screen Reader Live Announcement */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {liveAnnouncement || `${activeCard.name}, ${activeCard.trade}`}
        </div>
        {/* DEV ONLY Debug Chip */}
        {import.meta.env.DEV && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#0F2A35]/85 text-white shadow-md z-40 pointer-events-none flex items-center gap-1.5 backdrop-blur-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: debugState.isDrifting ? '#34D399' : '#F87171' }}
            />
            <span>slide {debugState.isDrifting ? 'on' : 'off'} ({debugState.reason})</span>
          </div>
        )}

        {/* ROPE: Inline SVG spanning whole stage width */}
        <svg
          className="absolute top-0 left-0 w-full pointer-events-none z-10 overflow-visible"
          height="100%"
          width="100%"
          aria-hidden="true"
        >
          {/* Faint 1px highlight stroke above it (white at 40%) */}
          <path
            ref={highlightPathRef}
            d={`M 0,${y0 - 1} Q ${stageWidth / 2},${y0 + 2 * sagBase - 1} ${stageWidth},${y0 - 1}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Main rope stroke: #8C7B6A, 2px, round caps */}
          <path
            ref={ropePathRef}
            d={`M 0,${y0} Q ${stageWidth / 2},${y0 + 2 * sagBase} ${stageWidth},${y0}`}
            fill="none"
            stroke="#8C7B6A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Single Row Cards Track (Slides automatically, clicks go directly to buttons) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {cards.map((card, idx) => {
            const showLocation = !import.meta.env.PROD || !card.location.startsWith('[');
            return (
              <div
                key={`${card.id}-${idx}`}
                ref={(el) => {
                  cardElsRef.current[idx] = el;
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${cardWidth}px`,
                  willChange: 'transform',
                }}
                className="pointer-events-auto origin-top"
              >
                <article
                  onClick={(e) => handleCardClick(idx, e)}
                  aria-label={`${card.name}${showLocation && card.location ? `, ${card.location}` : ''} - ${card.note}`}
                  className="group relative flex flex-col bg-white rounded-[7px] border border-[rgba(15,42,53,0.08)] p-3 pt-3.5 pb-3.5 shadow-[0_12px_28px_rgba(15,42,53,0.11),_0_2px_6px_rgba(15,42,53,0.05)] hover:shadow-[0_20px_42px_rgba(15,42,53,0.18),_0_4px_10px_rgba(15,42,53,0.08)] transition-all duration-200 select-none cursor-pointer"
                >
                  {/* WOODEN PEG: 14 x 32px rounded wooden clip (gradient #E3C59A to #C9A06B, 1px darker edge #B88A55, small centre slot line), subtle shadow 0 2px 3px */}
                  <div
                    aria-hidden="true"
                    className="absolute -top-[16px] left-1/2 -translate-x-1/2 w-[14px] h-[32px] rounded-[3px] pointer-events-none z-30"
                    style={{
                      background: 'linear-gradient(180deg, #E3C59A 0%, #D4AE7E 50%, #C9A06B 100%)',
                      border: '1px solid #B88A55',
                      boxShadow: '0 2px 3px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {/* Top slot */}
                    <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[1.5px] h-[7px] bg-[#8B5E3C]/70 rounded-full" />
                    {/* Metal spring coil band across center */}
                    <div className="absolute top-[13px] left-[-1px] right-[-1px] h-[3px] bg-[#8C7B6A] rounded-[1px] opacity-75 shadow-xs" />
                    {/* Bottom slot */}
                    <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[1.5px] h-[8px] bg-[#8B5E3C]/70 rounded-full" />
                  </div>

                  {/* MINI BROWSER FRAME: Frame with 3 dots & domain text */}
                  <div className="w-full rounded-[5px] border border-[rgba(15,42,53,0.10)] overflow-hidden bg-white shadow-2xs">
                    <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#F4F6F8] border-b border-[rgba(15,42,53,0.08)] shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E57373]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFB74D]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#81C784]" />
                      </div>
                      <span className="text-[9px] font-mono text-[#5E6F77]/80 truncate max-w-[130px]">
                        {card.domain}
                      </span>
                      <div className="w-3" />
                    </div>

                    {/* Screenshot container with aspect-ratio 16/10 and background #EEF3F4 */}
                    <CardScreenshot card={card} index={idx % ROOFING_CARDS.length} />
                  </div>

                  {/* POLAROID CHIN (Bottom details) */}
                  <div className="mt-2.5 flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#8B5E3C] bg-[#F7EFE6] px-2 py-0.5 rounded-full">
                        {card.trade}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-medium text-[#1E4A5C] bg-[#DCE9EC] px-2 py-0.5 rounded-full">
                        Concept
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-1 mt-0.5">
                      <span className="text-[14px] sm:text-[15px] font-bold text-[#0F2A35] truncate">
                        {card.name}
                      </span>
                      {showLocation && card.location ? (
                        <span className="text-[12px] text-[#5E6F77] shrink-0">
                          {card.location}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-[11px] sm:text-[12px] text-[#5E6F77] line-clamp-1 italic">
                      {card.note}
                    </p>

                    {/* Button: Pure instant click without any drag/swipe interference */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDesign(card.trade as TradeName);
                      }}
                      className="w-full mt-1.5 py-1.5 px-3 rounded-lg bg-[#0F2A35] hover:bg-[#1E4A5C] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      <span>Get a design like this</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Bar (Updates when centered card changes with 250ms crossfade) */}
      <Container>
        <div className="max-w-2xl mx-auto mt-6 flex flex-col items-center text-center">
          {/* Centered card info with 250ms crossfade */}
          <div
            key={activeCard.id}
            style={{ transition: 'opacity 250ms ease-out' }}
            className="flex flex-col items-center mb-2"
          >
            {/* Counter e.g. "01 / 05" */}
            <div className="text-[13px] font-semibold text-[#1E4A5C] bg-[#F4F6F8] border border-[rgba(15,42,53,0.08)] px-3 py-0.5 rounded-full mb-2">
              {String(centeredIndex + 1).padStart(2, '0')} / {String(ROOFING_CARDS.length).padStart(2, '0')}
            </div>

            <h3 className="text-[20px] font-semibold text-[#0F2A35]">
              {activeCard.name}
              {showActiveLocation && activeCard.location ? (
                <span className="text-[#5E6F77] font-normal text-[16px]"> ({activeCard.location})</span>
              ) : null}
            </h3>

            <p className="text-[14px] text-[#5E6F77] mt-1 italic">
              {activeCard.note}
            </p>

            {/* Quick action link for current centered card */}
            <button
              type="button"
              onClick={() => handleGetDesign(activeCard.trade as TradeName)}
              className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1E4A5C] hover:text-[#0F2A35] underline decoration-[#1E4A5C]/40 underline-offset-4 cursor-pointer"
            >
              <span>Get a design like {activeCard.name}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Reduced motion indicator only when active */}
          {prefersReducedMotion && (
            <p className="text-[13px] text-[#5E6F77] text-center mt-3">
              Motion is off because your device prefers reduced motion.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
