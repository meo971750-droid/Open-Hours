import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Play, X } from 'lucide-react';
import { config, WorkItemConfig } from '../config';
import { ShimmerImage, Tilt3D } from '../components/PremiumPrimitives';
import { OH_DUR, OH_EASE } from '../lib/motion';
import DemoTag from '../components/DemoTag';

interface OurWorkMarqueeProps {
  onOpenAudit?: () => void;
}

function WorkShowcase3DIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className="inline-block w-9 h-9 sm:w-11 sm:h-11 align-middle -mt-1 ml-1 shrink-0 drop-shadow-[0_6px_12px_rgba(11,27,34,0.16)]"
    >
      {/* Back tilt card (Mint Accent) */}
      <rect
        x="8"
        y="6"
        width="28"
        height="22"
        rx="6"
        transform="rotate(-8 22 17)"
        fill="#6FD6B0"
      />
      {/* Main card body (Brand Green 3D block) */}
      <rect x="6" y="13" width="30" height="23" rx="6" fill="#0F4A3E" />
      <rect x="6" y="13" width="30" height="8" rx="4" fill="#14735A" />
      {/* Clapper/Showcase stripes in mint-100 */}
      <path d="M12 13L15.5 21H19.5L16 13H12Z" fill="#DDF4EA" />
      <path d="M21.5 13L25 21H29L25.5 13H21.5Z" fill="#DDF4EA" />
      {/* Center small glass accent dot */}
      <circle cx="21" cy="28" r="3.2" fill="#A8EBD3" fillOpacity="0.92" />
    </svg>
  );
}

interface WorkCardProps {
  item: WorkItemConfig;
  isDuplicate?: boolean;
  onOpenModal?: (item: WorkItemConfig, trigger: HTMLElement) => void;
}

function WorkCard({ item, isDuplicate = false, onOpenModal }: WorkCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed || !item.image) return null;

  const isConcept = !item.isClient;
  const hasVideo = Boolean(item.videoUrl && item.videoUrl.trim());
  const hasLive = Boolean(item.liveUrl && item.liveUrl.trim());

  const renderCenterAction = () => {
    const circleClass =
      'w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_12px_28px_rgba(63,209,165,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] ring-[6px] ring-white/30 backdrop-blur-xs transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06] active:scale-[0.98]';
    const circleStyle: React.CSSProperties = {
      background: 'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
    };

    if (hasVideo) {
      return (
        <button
          type="button"
          tabIndex={isDuplicate ? -1 : undefined}
          onClick={(e) => onOpenModal?.(item, e.currentTarget)}
          aria-label={`Play video for ${item.title}`}
          className={`${circleClass} cursor-pointer`}
          style={circleStyle}
        >
          <Play className="w-6 h-6 fill-white text-white ml-0.5" strokeWidth={1.5} aria-hidden="true" />
        </button>
      );
    }

    if (hasLive) {
      return (
        <a
          href={item.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isDuplicate ? -1 : undefined}
          aria-label={`View ${item.title} in a new tab`}
          className={`${circleClass} cursor-pointer`}
          style={circleStyle}
        >
          <ArrowUpRight className="w-5 h-5 text-white oh-arrow-45" strokeWidth={1.5} aria-hidden="true" />
        </a>
      );
    }

    return (
      <button
        type="button"
        tabIndex={isDuplicate ? -1 : undefined}
        onClick={(e) => onOpenModal?.(item, e.currentTarget)}
        aria-label={`View larger preview of ${item.title}`}
        className={`${circleClass} cursor-pointer`}
        style={circleStyle}
      >
        <ArrowUpRight className="w-5 h-5 text-white oh-arrow-45" strokeWidth={1.5} aria-hidden="true" />
      </button>
    );
  };

  return (
    <Tilt3D maxDeg={4} disabled={isDuplicate} className="w-[clamp(260px,28vw,420px)] shrink-0">
      <article className="group w-full bg-white p-[6px] rounded-[20px] border border-[rgba(11,27,34,0.08)] shadow-[var(--e1)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:shadow-[var(--e2)] hover:border-[rgba(20,98,79,0.22)]">
        <div className="relative aspect-video w-full rounded-[16px] overflow-hidden bg-[#E9ECEA]">
          <ShimmerImage
            src={item.image}
            alt={isDuplicate ? '' : `${item.title}${item.trade ? ` — ${item.trade}` : ''}`}
            width={420}
            height={236}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            wrapperClassName="relative w-full h-full"
            className="w-full h-full object-cover object-top block"
          />

          {/* Subtle centre scrim so the green glass action circle stays legible over bright screenshots */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/10 group-hover:bg-black/18 transition-colors duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          />

          {/* Small Corner Concept Tag */}
          {isConcept && (
            <DemoTag
              variant="concept-badge"
              className="pointer-events-none absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#050E0D]/90 text-white backdrop-blur-xs border border-white/15"
            />
          )}

          {/* Centred 56px Action Button */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {renderCenterAction()}
          </div>
        </div>
      </article>
    </Tilt3D>
  );
}

interface MarqueeRowProps {
  categoryTitle: string;
  direction: 'rtl' | 'ltr';
  items: WorkItemConfig[];
  prefersReducedMotion: boolean;
  isModalOpen: boolean;
  onOpenModal: (item: WorkItemConfig, trigger: HTMLElement) => void;
}

function MarqueeCategoryRow({
  categoryTitle,
  direction,
  items,
  prefersReducedMotion,
  isModalOpen,
  onOpenModal,
}: MarqueeRowProps) {
  const duplicateRef = useRef<HTMLDivElement>(null);
  const [isTouching, setIsTouching] = useState(false);

  useEffect(() => {
    const el = duplicateRef.current;
    if (!el) return;
    el.setAttribute('inert', '');
  }, [prefersReducedMotion, items.length]);

  const animClass = direction === 'ltr' ? 'work-track-ltr' : 'work-track-rtl';
  const isPaused = prefersReducedMotion || isTouching || isModalOpen;

  return (
    <div className="space-y-6">
      {/* Category Sub-heading (~40px regular with tight tracking) */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="font-heading text-[clamp(26px,2.9vw,40px)] font-normal leading-[1.15] tracking-[-0.025em] text-[#0B1B22]">
          {categoryTitle}
        </h3>
      </div>

      {prefersReducedMotion ? (
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 no-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="snap-center shrink-0">
                <WorkCard item={item} onOpenModal={onOpenModal} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="work-marquee-wrap oh-marquee-fade relative w-full overflow-hidden py-2"
          onTouchStart={() => setIsTouching(true)}
          onTouchEnd={() => setIsTouching(false)}
          onTouchCancel={() => setIsTouching(false)}
        >
          <div
            className={`work-marquee-track ${animClass} flex w-max items-center`}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {/* Set 1 (Interactive & Accessible) */}
            <div className="flex items-center gap-4 pr-4 shrink-0">
              {items.map((item) => (
                <WorkCard key={item.id} item={item} onOpenModal={onOpenModal} />
              ))}
            </div>

            {/* Set 2 (Seamless Loop Duplicate — aria-hidden & inert) */}
            <div
              ref={duplicateRef}
              aria-hidden="true"
              className="flex items-center gap-4 pr-4 shrink-0"
            >
              {items.map((item) => (
                <WorkCard key={`${item.id}-dup`} item={item} isDuplicate />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OurWorkMarquee({ onOpenAudit: _onOpenAudit }: OurWorkMarqueeProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const motionReduce = useReducedMotion() ?? false;
  const [activeModalItem, setActiveModalItem] = useState<WorkItemConfig | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Accessible Modal Dialog: Escape close, scroll lock, focus trap & focus restore
  useEffect(() => {
    if (!activeModalItem) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 10);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveModalItem(null);
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      window.requestAnimationFrame(() => {
        triggerRef.current?.focus({ preventScroll: true });
      });
    };
  }, [activeModalItem]);

  const populatedCategories = useMemo(() => {
    const workItems = (config.work?.items || []).filter((item) => Boolean(item.image));
    const cats = config.work?.categories || [];

    return cats
      .map((cat, idx) => ({
        ...cat,
        direction: (idx % 2 === 0 ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
        items: workItems.filter((item) => item.category === cat.id),
      }))
      .filter((cat) => cat.items.length > 0);
  }, []);

  if (populatedCategories.length === 0) return null;

  const hasAnyClientProject = populatedCategories.some((cat) =>
    cat.items.some((item) => Boolean(item.isClient))
  );

  const handleOpenModal = (item: WorkItemConfig, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setActiveModalItem(item);
  };

  return (
    <section
      id="work"
      aria-label="Our Work"
      className="relative bg-[#E9ECEA] text-[#0B1B22] py-[var(--section-py)] overflow-x-clip"
    >
      <style>{`
        @keyframes workMarqueeRtl {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes workMarqueeLtr {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .work-track-rtl {
          animation: workMarqueeRtl 60s linear infinite;
          will-change: transform;
        }
        .work-track-ltr {
          animation: workMarqueeLtr 60s linear infinite;
          will-change: transform;
        }
        .work-marquee-wrap:hover .work-marquee-track,
        .work-marquee-wrap:has(:focus-visible) .work-marquee-track {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .work-track-rtl,
          .work-track-ltr {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Centred Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-14">
        <h2 className="font-heading text-[clamp(38px,4.6vw,60px)] font-bold leading-[1.06] tracking-[-0.03em] mb-4 inline-flex items-center justify-center flex-wrap gap-x-2.5">
          <span className="oh-line-mask">
            <span className="oh-line-reveal">
              <span className="text-[#475754]">Our</span>{' '}
              <span className="text-[#0B1B22]">Work</span>
            </span>
          </span>
          <WorkShowcase3DIcon />
        </h2>

        {config.work?.subtitle && (
          <p className="text-[clamp(16px,1.15vw,18px)] leading-[1.6] text-[#475754] max-w-[640px] mx-auto">
            {config.work.subtitle}
          </p>
        )}
      </div>

      {/* Category Rows */}
      <div className="space-y-14">
        {populatedCategories.map((cat) => (
          <MarqueeCategoryRow
            key={cat.id}
            categoryTitle={cat.title}
            direction={cat.direction}
            items={cat.items}
            prefersReducedMotion={prefersReducedMotion}
            isModalOpen={Boolean(activeModalItem)}
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>

      {/* Honest Concept Footer Note */}
      {!hasAnyClientProject && (
        <p className="mt-8 px-4 text-center text-[13px] text-[#475754] max-w-[600px] mx-auto">
          <DemoTag variant="concept" />
        </p>
      )}

      {/* Accessible Video / Image Preview Modal Dialog */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={motionReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={motionReduce ? undefined : { opacity: 0 }}
            transition={{ duration: motionReduce ? 0 : OH_DUR.base, ease: OH_EASE }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1B22]/78 backdrop-blur-xs"
            onClick={() => setActiveModalItem(null)}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="work-modal-title"
              initial={motionReduce ? false : { opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={motionReduce ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: motionReduce ? 0 : OH_DUR.base, ease: OH_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[920px] bg-white text-[#0B1B22] rounded-[28px] p-4 sm:p-6 shadow-[var(--e3)] border border-[rgba(11,27,34,0.12)]"
            >
              <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-[rgba(11,27,34,0.08)]">
                <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                  <h3
                    id="work-modal-title"
                    className="font-heading text-[20px] sm:text-[22px] font-semibold text-[#0B1B22] truncate"
                  >
                    {activeModalItem.title}
                  </h3>
                  {activeModalItem.trade && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3F5F3] text-[#0B1B22] border border-[rgba(11,27,34,0.1)]">
                      {activeModalItem.trade}
                    </span>
                  )}
                  {!activeModalItem.isClient && (
                    <DemoTag
                      variant="concept-badge"
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0F4A3E] text-white"
                    />
                  )}
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  aria-label="Close preview"
                  className="w-9 h-9 rounded-full bg-[#F3F5F3] hover:bg-[#DDF4EA] active:scale-[0.98] text-[#0B1B22] flex items-center justify-center transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              <div className="relative aspect-video w-full rounded-[18px] overflow-hidden bg-[#0B1B22]">
                {activeModalItem.videoUrl ? (
                  <video
                    src={activeModalItem.videoUrl}
                    poster={activeModalItem.image}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={activeModalItem.image}
                    alt={activeModalItem.title}
                    width={920}
                    height={518}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
