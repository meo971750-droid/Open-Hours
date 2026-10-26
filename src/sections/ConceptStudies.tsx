import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
} from 'motion/react';
import { BookOpen, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import Accent from '../components/Accent';
import DesignPreview from '../components/DesignPreview';
import { getSectionHref } from '../lib/links';
import {
  CONCEPT_STUDIES,
  DESIGNS,
  DELIVERY,
  TradeName,
  DesignSlide,
} from '../content';

interface ConceptStudiesProps {
  onOpenAudit?: (trade?: TradeName) => void;
}

const TINT_MAP: Record<string, string> = {
  teal: '#DCE9EC',
  peach: '#F6E6D8',
  sage: '#E2EFE4',
  sand: '#F3EBDD',
};

// =============================================================================
// PINNED STAGE CONSTANTS
// Restored larger card dimensions with generous vertical presence
// =============================================================================
export const CONCEPT_PIN = {
  stepSvh: 70,
  stackTopPx: 80,
  offsetPx: 56,
  bottomPadPx: 12,
  minCardPx: 480,
  maxCardPx: 680,
  holdStart: 0.05,
  holdEnd: 0.07,
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Subcomponent for each pinned card in the stage
interface PinnedConceptCardProps {
  study: (typeof CONCEPT_STUDIES)[0];
  slide: DesignSlide;
  index: number;
  totalCards: number;
  smoothProgress: MotionValue<number>;
  a_i: number;
  b_i: number;
  restTop: number;
  cardHeight: number;
  stageHeight: number;
  scale: number;
  onOpenAudit?: (trade?: TradeName) => void;
}

function PinnedConceptCard({
  study,
  slide,
  index,
  totalCards,
  smoothProgress,
  a_i,
  b_i,
  restTop,
  cardHeight,
  stageHeight,
  scale,
  onOpenAudit,
}: PinnedConceptCardProps) {
  const isPreviewRight = index % 2 === 0;
  const bgTint = TINT_MAP[study.tint] || '#EEF3F4';
  const days = DELIVERY.tiers[study.tier.toLowerCase() as keyof typeof DELIVERY.tiers];
  const timelineText = `Live in about ${days} working days`;
  const initials = getInitials(slide.name);

  // Measure preview panel container dimensions to compute responsive previewScale
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const [panelDimensions, setPanelDimensions] = useState({ width: 500, height: 380 });

  useEffect(() => {
    const el = previewPanelRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setPanelDimensions({ width, height });
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Preview scale: min(panelWidth / 560, panelHeight / 420), capped at 1.25
  const rawPreviewScale = Math.min(
    panelDimensions.width / 560,
    panelDimensions.height / 420
  );
  const previewScale = Math.min(1.25, Math.max(0.72, rawPreviewScale));

  // Card 0 is always at rest (translateY 0). Cards 1+ slide up on their [a_i, b_i] segment
  const translateY = useTransform(smoothProgress, (p: number) => {
    if (index === 0) return 0;
    if (p <= a_i) return stageHeight - restTop + 32;
    if (p >= b_i) return 0;
    const q = (p - a_i) / (b_i - a_i);
    const e = 1 - Math.pow(1 - q, 3); // easeOutCubic
    return (1 - e) * (stageHeight - restTop + 32);
  });

  return (
    <motion.article
      style={{
        position: 'absolute',
        top: `${restTop}px`,
        left: 0,
        right: 0,
        height: `${cardHeight}px`,
        zIndex: 10 + index,
        y: translateY,
        willChange: 'transform',
        boxShadow:
          '0 -10px 28px rgba(15,42,53,.10), 0 12px 32px rgba(15,42,53,.08)',
        borderRadius: '32px',
        boxSizing: 'border-box',
      }}
      className="w-full"
    >
      {/* Inner background layer with overflow-hidden for rounded clipping */}
      <div
        style={{
          backgroundColor: bgTint,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
          width: scale < 1 ? `calc(100% / ${scale})` : '100%',
          height: scale < 1 ? `calc(100% / ${scale})` : '100%',
        }}
        className="w-full h-full rounded-[32px] border border-[rgba(15,42,53,0.06)] overflow-hidden p-6 sm:p-9 pt-5 flex flex-col justify-between relative"
      >
        {/* Counter chip inside top strip (top 14px, right 32px) */}
        <div className="absolute top-[14px] right-6 sm:right-8 bg-white/70 backdrop-blur-xs text-[#0F2A35] font-mono font-semibold text-[14px] px-3 py-1 rounded-full border border-black/5 shadow-xs z-20 pointer-events-none">
          {index + 1} / {totalCards}
        </div>

        {/* Two-column layout: Left text content & Right preview showcase */}
        <div
          className={`flex flex-col ${
            isPreviewRight ? 'lg:flex-row' : 'lg:flex-row-reverse'
          } gap-6 lg:gap-10 items-stretch h-full justify-between`}
        >
          {/* ===============================================================
              LEFT COLUMN: 46% - Height 100%, Space-between across 3 groups
             =============================================================== */}
          <div className="w-full lg:w-[46%] flex flex-col justify-between text-left h-full py-1">
            {/* TOP GROUP: Trade label, Title, Description */}
            <div>
              {/* First line: Trade label in serif italic 22px inside visible 56px top strip (pt-5 = 20px) */}
              <div className="mb-1 leading-none">
                <Accent className="text-[22px] text-[#1E4A5C]">
                  {study.tradeLabel}
                </Accent>
              </div>

              {/* Title: 30px, weight 600, tracking -0.02em */}
              <h3 className="text-[26px] sm:text-[30px] font-semibold text-[#0F2A35] leading-snug tracking-[-0.02em] mb-3 mt-1">
                {study.title}
              </h3>

              {/* Description: 17px text */}
              <p className="text-[16px] sm:text-[17px] text-[#33474F] leading-relaxed">
                {study.description}
              </p>
            </div>

            {/* MIDDLE GROUP: Scope and Typical timeline (eliminates awkward empty gaps) */}
            <div className="grid grid-cols-2 gap-4 py-3 sm:py-4 my-2 border-y border-[rgba(15,42,53,0.08)]">
              <div>
                <span className="block text-[14px] text-[#5E6F77] mb-1">
                  Scope
                </span>
                <span className="block text-[15px] sm:text-[16px] font-semibold text-[#0F2A35]">
                  {study.scope}
                </span>
              </div>
              <div>
                <span className="block text-[14px] text-[#5E6F77] mb-1">
                  Typical timeline
                </span>
                <span className="block text-[15px] sm:text-[16px] font-semibold text-[#0F2A35]">
                  {timelineText}
                </span>
              </div>
            </div>

            {/* BOTTOM GROUP: Business Pill & Audit Action Link */}
            <div>
              {/* Business Pill (16px weight 600, chips 13px) */}
              <div className="bg-white/90 backdrop-blur-xs rounded-[16px] p-2.5 sm:px-4 sm:py-3 border border-[rgba(15,42,53,0.06)] shadow-xs flex items-center justify-between gap-2.5 flex-wrap mb-3.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1E4A5C] text-white flex items-center justify-center text-[11px] sm:text-[12px] font-bold shrink-0">
                    {initials}
                  </div>
                  <span className="text-[15px] sm:text-[16px] font-semibold text-[#0F2A35] truncate">
                    {slide.name}, {slide.town}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DCE9EC] text-[#1E4A5C] text-[12px] sm:text-[13px] font-medium">
                    Concept
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF3F4] text-[#0F2A35] text-[12px] sm:text-[13px] font-semibold">
                    {study.tier} build
                  </span>
                </div>
              </div>

              {/* Action Link */}
              <div>
                <button
                  type="button"
                  onClick={() => onOpenAudit?.(slide.trade)}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#1E4A5C] hover:text-[#0F2A35] transition-colors group cursor-pointer"
                >
                  <span>Get a design like this</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ===============================================================
              RIGHT COLUMN: 54% - Preview Panel stretching full inner height
             =============================================================== */}
          <div className="w-full lg:w-[54%] self-stretch min-h-0 relative flex items-center justify-center">
            <div
              ref={previewPanelRef}
              className="w-full h-full bg-white/55 backdrop-blur-xs p-4 sm:p-5 lg:p-6 rounded-[24px] border border-white/60 shadow-xs relative flex items-center justify-center overflow-visible"
            >
              {/* Scaled preview frame container filling available panel space */}
              <div
                style={{
                  transform: previewScale !== 1 ? `scale(${previewScale})` : undefined,
                  transformOrigin: 'center center',
                }}
                className="relative w-full max-w-[500px] shrink-0"
              >
                {/* Desktop Browser Frame */}
                <div className="w-full rounded-[14px] bg-white border border-[rgba(15,42,53,0.10)] shadow-[0_12px_28px_rgba(15,42,53,0.08)] overflow-hidden">
                  <div className="px-3 py-2 bg-[#F6F8F9] border-b border-[rgba(15,42,53,0.06)] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                      <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="bg-white px-3 py-0.5 rounded text-[11px] font-mono text-[#5E6F77] border border-[rgba(15,42,53,0.06)] max-w-[180px] truncate">
                      https://{slide.town.toLowerCase()}.trade
                    </div>
                    <div className="w-6" />
                  </div>

                  <div className="w-full h-[220px] sm:h-[250px] lg:h-[270px] bg-[#F4F6F8] overflow-hidden relative">
                    <DesignPreview slide={slide} />
                  </div>
                </div>

                {/* Overlapping Phone Frame */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-3 w-[115px] sm:w-[130px] lg:w-[145px] h-[190px] sm:h-[220px] lg:h-[240px] rounded-[22px] border-[3px] border-[#0F2A35] bg-[#0F2A35] shadow-[0_16px_36px_rgba(15,42,53,0.22)] overflow-hidden z-20 pointer-events-none"
                >
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/30 z-30" />
                  <div className="w-full h-full rounded-[18px] overflow-hidden bg-white pt-3">
                    <DesignPreview slide={slide} isMobileMockup={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

interface PinnedStageStackProps {
  stageRef: React.RefObject<HTMLDivElement | null>;
  stageHeight: number;
  totalScrollSvh: number;
  cardHeight: number;
  scale: number;
  N: number;
  usableStart: number;
  segmentSize: number;
  onOpenAudit?: (trade?: TradeName) => void;
}

function PinnedStageStack({
  stageRef,
  stageHeight,
  totalScrollSvh,
  cardHeight,
  scale,
  N,
  usableStart,
  segmentSize,
  onOpenAudit,
}: PinnedStageStackProps) {
  const [targetNode, setTargetNode] = useState<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const setWrapperRef = useCallback((node: HTMLDivElement | null) => {
    wrapperRef.current = node;
    setTargetNode(node);
  }, []);

  // Framer Motion useScroll on the .pin-wrapper (offset: start start to end end)
  const { scrollYProgress: rawProgress } = useScroll(
    targetNode
      ? {
          target: wrapperRef,
          offset: ['start start', 'end end'],
        }
      : undefined
  );

  // Strip WAAPI accelerate config to prevent invalid offset browser errors
  delete (rawProgress as any).accelerate;

  const smoothProgress = useSpring(rawProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.5,
  });
  delete (smoothProgress as any).accelerate;

  return (
    <div
      ref={setWrapperRef}
      className="pin-wrapper relative w-full"
      style={{
        height: `${totalScrollSvh}svh`, // 310svh
      }}
    >
      {/* Sticky 100svh stage */}
      <div
        ref={stageRef}
        className="pin-stage sticky top-0 h-[100svh] w-full overflow-hidden"
      >
        {/* Same max-width (1200px) and side padding as other sections */}
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 w-full h-full">
          {CONCEPT_STUDIES.map((study, idx) => {
            const slide = DESIGNS.find(
              (d) => d.id === study.designId
            ) as DesignSlide;
            if (!slide) return null;

            const restTop_i =
              CONCEPT_PIN.stackTopPx + idx * CONCEPT_PIN.offsetPx;
            const a_i = usableStart + (idx - 1) * segmentSize;
            const b_i = usableStart + idx * segmentSize;

            return (
              <PinnedConceptCard
                key={study.id}
                study={study}
                slide={slide}
                index={idx}
                totalCards={N}
                smoothProgress={smoothProgress}
                a_i={a_i}
                b_i={b_i}
                restTop={restTop_i}
                cardHeight={cardHeight}
                stageHeight={stageHeight}
                scale={scale}
                onOpenAudit={onOpenAudit}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ConceptStudies({ onOpenAudit }: ConceptStudiesProps) {
  const shouldReduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  // Measured stage height cached via ResizeObserver
  const [stageHeight, setStageHeight] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerHeight : 850
  );

  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Debug param helper (?debug=stack)
  const [isDebug, setIsDebug] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsDebug(params.get('debug') === 'stack');
    }
  }, []);

  // Update viewport width on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Geometry calculations according to Section 1
  const N = CONCEPT_STUDIES.length; // 4
  const available =
    stageHeight -
    CONCEPT_PIN.stackTopPx -
    (N - 1) * CONCEPT_PIN.offsetPx -
    CONCEPT_PIN.bottomPadPx;

  let cardHeight = Math.min(
    CONCEPT_PIN.maxCardPx,
    Math.max(CONCEPT_PIN.minCardPx, available)
  );

  // Only apply scale s if available < minCardPx; otherwise s = 1
  let scale = 1;
  if (available < CONCEPT_PIN.minCardPx) {
    cardHeight = Math.max(available, 0);
    scale = Math.max(0.85, available / CONCEPT_PIN.minCardPx);
  }

  // Fallbacks: (a) viewport width < 768px, (b) prefers-reduced-motion, or (c) scale < 0.85
  // Viewport HEIGHT alone is NEVER the decision criteria
  let fallbackReason = '';
  if (viewportWidth < 768) {
    fallbackReason = 'width < 768px';
  } else if (shouldReduceMotion) {
    fallbackReason = 'prefers-reduced-motion';
  } else if (scale < 0.85) {
    fallbackReason = 'scale < 0.85';
  }

  const isStackMode = fallbackReason === '';

  // ResizeObserver on the sticky stage to measure cached stageHeight
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        if (h > 0) {
          setStageHeight(h);
        }
      }
    });

    ro.observe(stageEl);
    return () => ro.disconnect();
  }, [isStackMode]);

  // Segment ranges for each card i >= 1
  const usableStart = CONCEPT_PIN.holdStart;
  const usableEnd = 1 - CONCEPT_PIN.holdEnd;
  const segmentSize = (usableEnd - usableStart) / (N - 1);

  // Wrapper total height formula: calc(100svh + (N - 1) * stepSvh * 1svh)
  const totalScrollSvh = 100 + (N - 1) * CONCEPT_PIN.stepSvh; // 310svh

  const handleScrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#pricing');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="concept-studies"
      className="w-full bg-white py-20 sm:py-28 md:py-32 overflow-visible scroll-mt-24 relative"
    >
      {/* Debug Helper: Only visible when ?debug=stack */}
      {isDebug && (
        <div className="fixed bottom-4 left-4 z-50 px-3 py-1.5 rounded-lg bg-black/85 text-white font-mono text-xs shadow-lg border border-white/20 backdrop-blur-sm pointer-events-none">
          {isStackMode ? 'stack: on' : `list: ${fallbackReason}`} | stage:{' '}
          {Math.round(stageHeight)}px | card: {Math.round(cardHeight)}px
          {scale < 1 && ` | s: ${scale.toFixed(2)}`}
        </div>
      )}

      {/* Header (Centred, same style as other sections, normal flow) */}
      <Container>
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <h2 className="text-[clamp(32px,4.4vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-3xl mb-4">
            How a site could work for <Accent>your trade</Accent>
          </h2>

          <p className="text-[17px] sm:text-[19px] text-[#5E6F77] max-w-2xl mx-auto font-normal">
            Fictional examples that show the brief, what we'd set up and the
            typical timeline.
          </p>
        </div>
      </Container>

      {/* EITHER Pinned-Stage Stack Mode OR Normal Vertical List (never both at once) */}
      {isStackMode ? (
        <PinnedStageStack
          stageRef={stageRef}
          stageHeight={stageHeight}
          totalScrollSvh={totalScrollSvh}
          cardHeight={cardHeight}
          scale={scale}
          N={N}
          usableStart={usableStart}
          segmentSize={segmentSize}
          onOpenAudit={onOpenAudit}
        />
      ) : (
        /* =========================================================================
            NORMAL VERTICAL LIST (Mobile < 768px, reduced motion, or scale < 0.85)
           ========================================================================= */
        <Container>
          <div className="space-y-6 max-w-[1200px] mx-auto">
            {CONCEPT_STUDIES.map((study, idx) => {
              const slide = DESIGNS.find(
                (d) => d.id === study.designId
              ) as DesignSlide;
              if (!slide) return null;

              const isPreviewRight = idx % 2 === 0;
              const bgTint = TINT_MAP[study.tint] || '#EEF3F4';
              const days =
                DELIVERY.tiers[
                  study.tier.toLowerCase() as keyof typeof DELIVERY.tiers
                ];
              const timelineText = `Live in about ${days} working days`;
              const initials = getInitials(slide.name);

              return (
                <motion.article
                  key={study.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={
                    shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ backgroundColor: bgTint }}
                  className="rounded-[32px] p-6 sm:p-9 border border-[rgba(15,42,53,0.06)] shadow-[0_12px_32px_rgba(15,42,53,0.08)] relative"
                >
                  {/* Top-right counter chip */}
                  <div className="absolute top-4 right-5 sm:top-6 sm:right-7 bg-white/70 backdrop-blur-xs text-[#0F2A35] font-mono font-semibold text-[14px] px-3 py-1.5 rounded-full border border-black/5 shadow-xs z-10 pointer-events-none">
                    {idx + 1} / {N}
                  </div>

                  <div
                    className={`flex flex-col ${
                      isPreviewRight ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } gap-8 lg:gap-10 items-center`}
                  >
                    {/* CONTENT Column */}
                    <div className="w-full lg:w-[46%] flex flex-col justify-between text-left">
                      <div className="mb-2">
                        <Accent className="text-[22px] text-[#1E4A5C]">
                          {study.tradeLabel}
                        </Accent>
                      </div>

                      <h3 className="text-[26px] sm:text-[30px] font-semibold text-[#0F2A35] leading-snug tracking-[-0.02em] mb-3">
                        {study.title}
                      </h3>

                      <p className="text-[17px] text-[#33474F] leading-relaxed mb-6">
                        {study.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 mb-6 border-b border-[rgba(15,42,53,0.08)]">
                        <div>
                          <span className="block text-[14px] text-[#5E6F77] mb-1">
                            Scope
                          </span>
                          <span className="block text-[16px] font-semibold text-[#0F2A35]">
                            {study.scope}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[14px] text-[#5E6F77] mb-1">
                            Typical timeline
                          </span>
                          <span className="block text-[16px] font-semibold text-[#0F2A35]">
                            {timelineText}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/90 backdrop-blur-xs rounded-[16px] p-3 sm:px-4 sm:py-3 border border-[rgba(15,42,53,0.06)] shadow-xs flex items-center justify-between gap-2.5 flex-wrap mb-5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-[#1E4A5C] text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                            {initials}
                          </div>
                          <span className="text-[15px] sm:text-[16px] font-semibold text-[#0F2A35] truncate">
                            {slide.name}, {slide.town}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#DCE9EC] text-[#1E4A5C] text-[13px] font-medium">
                            Concept
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EEF3F4] text-[#0F2A35] text-[13px] font-semibold">
                            {study.tier} build
                          </span>
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => onOpenAudit?.(slide.trade)}
                          className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#1E4A5C] hover:text-[#0F2A35] transition-colors group cursor-pointer"
                        >
                          <span>Get a design like this</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </div>

                    {/* PREVIEW Column */}
                    <div className="w-full lg:w-[54%] relative">
                      <div className="bg-white/55 backdrop-blur-xs p-4 sm:p-6 md:p-7 rounded-[24px] border border-white/60 shadow-xs relative overflow-visible">
                        <div className="w-full rounded-[14px] bg-white border border-[rgba(15,42,53,0.10)] shadow-[0_12px_28px_rgba(15,42,53,0.08)] overflow-hidden">
                          <div className="px-3 py-2 bg-[#F6F8F9] border-b border-[rgba(15,42,53,0.06)] flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                              <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                              <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                            </div>
                            <div className="bg-white px-3 py-0.5 rounded text-[11px] font-mono text-[#5E6F77] border border-[rgba(15,42,53,0.06)] max-w-[180px] truncate">
                              https://{slide.town.toLowerCase()}.trade
                            </div>
                            <div className="w-6" />
                          </div>

                          <div className="w-full h-[220px] sm:h-[250px] md:h-[280px] bg-[#F4F6F8] overflow-hidden relative">
                            <DesignPreview slide={slide} />
                          </div>
                        </div>

                        <div
                          aria-hidden="true"
                          className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-3 w-[110px] sm:w-[130px] md:w-[145px] h-[190px] sm:h-[220px] md:h-[240px] rounded-[22px] border-[3px] border-[#0F2A35] bg-[#0F2A35] shadow-[0_16px_36px_rgba(15,42,53,0.22)] overflow-hidden z-20 pointer-events-none"
                        >
                          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/30 z-30" />
                          <div className="w-full h-full rounded-[18px] overflow-hidden bg-white pt-3">
                            <DesignPreview slide={slide} isMobileMockup={true} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </Container>
      )}

      {/* After the wrapper: normal flow with 56px spacing above (mt-14) */}
      <Container>
        <div className="flex flex-col items-center text-center mt-14">
          <Link
            to={getSectionHref('pricing')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[rgba(15,42,53,0.15)] bg-white text-[#0F2A35] font-semibold text-[15px] hover:bg-[#EEF3F4] transition-all duration-200 shadow-xs mb-3 group cursor-pointer"
          >
            <span>See pricing</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <p className="text-[13px] text-[#5E6F77] max-w-md">
            Fictional examples, not client projects. Features depend on your package.
          </p>
        </div>
      </Container>
    </section>
  );
}
