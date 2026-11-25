import React, { Suspense, lazy, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { config, WorkItemConfig } from '../config';
import { Tilt3D } from '../components/PremiumPrimitives';
import { useAnimationInView } from '../hooks/useAnimationInView';
import { getResponsiveImageProps } from '../lib/images';
import {
  buildHoverPlayEmbedSrc,
  deriveStreamablePosterUrl,
  deriveYouTubePosterUrls,
  ParsedVideoEmbed,
  parseVideoEmbed,
  warmVideoOrigin,
} from '../lib/videoEmbed';

const OurWorkModal = lazy(() => import('../components/OurWorkModal'));

interface OurWorkMarqueeProps {
  onOpenAudit?: () => void;
}

interface ResolvedWorkItem {
  item: WorkItemConfig;
  parsed: ParsedVideoEmbed;
  posterUrl: string | null;
  posterFallbackUrl: string | null;
}

function resolveWorkItem(item: WorkItemConfig): ResolvedWorkItem {
  const parsed = parseVideoEmbed(item.embedCode, item.embedUrl);
  const explicitPoster = item.poster?.trim() || null;

  if (explicitPoster) {
    return {
      item,
      parsed,
      posterUrl: explicitPoster,
      posterFallbackUrl: null,
    };
  }

  if (parsed.allowed && parsed.hostKind === 'streamable' && parsed.streamableId) {
    return {
      item,
      parsed,
      posterUrl: deriveStreamablePosterUrl(parsed.streamableId),
      posterFallbackUrl: null,
    };
  }

  if (parsed.allowed && parsed.hostKind === 'youtube' && parsed.youtubeId) {
    const ytPosters = deriveYouTubePosterUrls(parsed.youtubeId);
    return {
      item,
      parsed,
      posterUrl: ytPosters.primary,
      posterFallbackUrl: ytPosters.fallback,
    };
  }

  return {
    item,
    parsed,
    posterUrl: null,
    posterFallbackUrl: null,
  };
}

function WorkShowcase3DIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className="inline-block w-9 h-9 sm:w-11 sm:h-11 align-middle -mt-1 ml-1 shrink-0"
    >
      <rect
        x="8"
        y="6"
        width="28"
        height="22"
        rx="6"
        transform="rotate(-8 22 17)"
        fill="#6FD6B0"
      />
      <rect x="6" y="13" width="30" height="23" rx="6" fill="#0F4A3E" />
      <rect x="6" y="13" width="30" height="8" rx="4" fill="#14735A" />
      <path d="M12 13L15.5 21H19.5L16 13H12Z" fill="#DDF4EA" />
      <path d="M21.5 13L25 21H29L25.5 13H21.5Z" fill="#DDF4EA" />
      <circle cx="21" cy="28" r="3.2" fill="#A8EBD3" fillOpacity="0.92" />
    </svg>
  );
}

interface WorkCardProps {
  resolved: ResolvedWorkItem;
  isDuplicate?: boolean;
  onOpenModal?: (resolved: ResolvedWorkItem, trigger: HTMLElement) => void;
}

const WorkCard = memo(function WorkCard({ resolved, isDuplicate = false, onOpenModal }: WorkCardProps) {
  const { item, parsed, posterUrl, posterFallbackUrl } = resolved;
  const [activeSrc, setActiveSrc] = useState<string | null>(posterUrl);
  const [triedFallback, setTriedFallback] = useState(false);
  const [isHoverPlaying, setIsHoverPlaying] = useState(false);

  useEffect(() => {
    setActiveSrc(posterUrl);
    setTriedFallback(false);
  }, [posterUrl]);

  const responsiveImg = useMemo(() => {
    if (!activeSrc) return null;
    return getResponsiveImageProps(
      activeSrc,
      [640, 960, 1280],
      '(max-width: 1023px) 80vw, 36vw',
      'good'
    );
  }, [activeSrc]);

  const handleWarmOrigin = () => {
    if (parsed.allowed && parsed.origin) {
      warmVideoOrigin(parsed.origin);
    }
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    handleWarmOrigin();
    if (e.pointerType !== 'touch' && parsed.allowed && parsed.embedSrc) {
      setIsHoverPlaying(true);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'touch') {
      setIsHoverPlaying(false);
    }
  };

  const handleImgError = () => {
    if (!triedFallback && posterFallbackUrl && activeSrc !== posterFallbackUrl) {
      setTriedFallback(true);
      setActiveSrc(posterFallbackUrl);
      return;
    }
    setActiveSrc(null);
  };

  const hoverPlaySrc = useMemo(() => {
    if (!isHoverPlaying || !parsed.allowed || !parsed.embedSrc) return null;
    return buildHoverPlayEmbedSrc(parsed.embedSrc, parsed.hostKind);
  }, [isHoverPlaying, parsed]);

  return (
    <Tilt3D
      maxDeg={4}
      disabled={isDuplicate}
      className="w-[clamp(260px,80vw,420px)] lg:w-[clamp(300px,36vw,560px)] shrink-0"
    >
      <article
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onTouchStart={handleWarmOrigin}
        style={{ paddingBottom: item.aspectPaddingBottom || '52.812%' }}
        className="group relative w-full h-0 rounded-[20px] sm:rounded-[24px] overflow-hidden border border-[#0B1B22]/85 bg-black shadow-[0_18px_42px_-16px_rgba(11,27,34,0.28)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:shadow-[var(--e2)]"
      >
        {/* Base Poster Thumbnail (always rendered underneath for instant first frame & zero flicker) */}
        {responsiveImg ? (
          <img
            src={responsiveImg.src}
            srcSet={responsiveImg.srcSet}
            sizes={responsiveImg.sizes}
            alt={isDuplicate ? '' : item.title}
            width={1280}
            height={676}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleImgError}
            className="absolute inset-0 w-full h-full object-cover block transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.02]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0B1B22] to-[#050E0D]"
          />
        )}

        {/* Hover-to-play Streamable / embedded video (muted by default, no sound controls) */}
        {hoverPlaySrc && (
          <iframe
            title={item.title}
            src={hoverPlaySrc}
            allow="autoplay; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 z-10 w-full h-full border-0 overflow-hidden pointer-events-none"
          />
        )}

        {/* Subtle Dark Scrim matching the card style in attached image */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[15] bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_40%,rgba(0,0,0,0.35)_100%)] transition-opacity duration-200"
        />

        {/* Clickable Play Button overlay — opens modal from beginning cleanly */}
        <button
          type="button"
          tabIndex={isDuplicate ? -1 : undefined}
          onFocus={handleWarmOrigin}
          onClick={(e) => {
            setIsHoverPlaying(false);
            onOpenModal?.(resolved, e.currentTarget);
          }}
          aria-label={`Play ${item.title}`}
          className="absolute inset-0 z-20 w-full h-full flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6FD6B0] rounded-[20px] sm:rounded-[24px]"
        >
          <span
            aria-hidden="true"
            className="w-14 h-14 rounded-full bg-black/60 border border-white/25 text-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.38)] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110 active:scale-[0.98]"
          >
            <Play
              className="w-5 h-5 fill-white text-white translate-x-[1.5px] pointer-events-none"
              strokeWidth={1.5}
            />
          </span>
        </button>
      </article>
    </Tilt3D>
  );
});

interface MarqueeRowProps {
  rowTitle: string;
  direction: 'rtl' | 'ltr';
  items: ResolvedWorkItem[];
  prefersReducedMotion: boolean;
  isModalOpen: boolean;
  onOpenModal: (resolved: ResolvedWorkItem, trigger: HTMLElement) => void;
}

function MarqueeCategoryRow({
  rowTitle,
  direction,
  items,
  prefersReducedMotion,
  isModalOpen,
  onOpenModal,
}: MarqueeRowProps) {
  const [isTouching, setIsTouching] = useState(false);
  const [durationSec, setDurationSec] = useState<number>(60);
  const set1Ref = useRef<HTMLDivElement>(null);

  const animClass = direction === 'ltr' ? 'work-track-ltr' : 'work-track-rtl';
  const isPaused = prefersReducedMotion || isTouching || isModalOpen;
  const repeatCount = items.length <= 3 ? 2 : 1;

  // Derive consistent marquee speed (px/sec) from actual rendered track width
  useEffect(() => {
    const el = set1Ref.current;
    if (!el || prefersReducedMotion) return;

    const updateDuration = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) {
        const pxPerSec = 42;
        const computed = Math.max(20, Number((width / pxPerSec).toFixed(2)));
        setDurationSec(computed);
      }
    };

    updateDuration();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateDuration);
      ro.observe(el);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', updateDuration, { passive: true });
    return () => window.removeEventListener('resize', updateDuration);
  }, [items.length, repeatCount, prefersReducedMotion]);

  return (
    <div className="space-y-8 sm:space-y-9">
      {rowTitle.trim().length > 0 && (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-heading text-[clamp(26px,2.9vw,40px)] font-normal leading-[1.15] tracking-[-0.025em] text-[#0B1B22]">
            {rowTitle}
          </h3>
        </div>
      )}

      {prefersReducedMotion ? (
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="oh-marquee-fade flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 px-2 no-scrollbar">
            {items.map((resolved) => (
              <div key={resolved.item.id} className="snap-center shrink-0">
                <WorkCard resolved={resolved} onOpenModal={onOpenModal} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="work-marquee-wrap oh-marquee-fade relative w-full overflow-hidden py-1.5"
          onTouchStart={() => setIsTouching(true)}
          onTouchEnd={() => setIsTouching(false)}
          onTouchCancel={() => setIsTouching(false)}
        >
          <div
            className={`work-marquee-track ${animClass} flex w-max items-center`}
            style={
              {
                '--work-duration': `${durationSec}s`,
                animationPlayState: isPaused ? 'paused' : 'running',
              } as React.CSSProperties
            }
          >
            {/* Set 1 */}
            <div ref={set1Ref} className="flex items-center gap-5 pr-5 shrink-0">
              {Array.from({ length: repeatCount }).map((_, repIdx) =>
                repIdx === 0 ? (
                  <React.Fragment key={repIdx}>
                    {items.map((resolved) => (
                      <WorkCard
                        key={`${resolved.item.id}-s1-${repIdx}`}
                        resolved={resolved}
                        onOpenModal={onOpenModal}
                      />
                    ))}
                  </React.Fragment>
                ) : (
                  <div
                    key={repIdx}
                    aria-hidden="true"
                    className="flex items-center gap-5 shrink-0"
                  >
                    {items.map((resolved) => (
                      <WorkCard
                        key={`${resolved.item.id}-s1-${repIdx}`}
                        resolved={resolved}
                        isDuplicate
                        onOpenModal={onOpenModal}
                      />
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Set 2: Seamless loop duplicate — hidden from screen readers & keyboard tab order */}
            <div
              aria-hidden="true"
              className="flex items-center gap-5 pr-5 shrink-0"
            >
              {Array.from({ length: repeatCount }).map((_, repIdx) => (
                <React.Fragment key={repIdx}>
                  {items.map((resolved) => (
                    <WorkCard
                      key={`${resolved.item.id}-s2-${repIdx}`}
                      resolved={resolved}
                      isDuplicate
                      onOpenModal={onOpenModal}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OurWorkMarquee({ onOpenAudit: _onOpenAudit }: OurWorkMarqueeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useAnimationInView(sectionRef, false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeModal, setActiveModal] = useState<ResolvedWorkItem | null>(null);
  const [modalPlayKey, setModalPlayKey] = useState(0);

  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const rows = useMemo(() => {
    const configuredRows = config.work?.rows || [];
    return configuredRows
      .map((row, idx) => ({
        id: row.id,
        title: row.title,
        direction: (row.direction || (idx % 2 === 0 ? 'rtl' : 'ltr')) as 'rtl' | 'ltr',
        items: (row.items || []).map(resolveWorkItem),
      }))
      .filter((row) => row.items.length > 0);
  }, []);

  const handleOpenModal = useCallback((resolved: ResolvedWorkItem, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    if (resolved.parsed.allowed && resolved.parsed.origin) {
      warmVideoOrigin(resolved.parsed.origin);
    }
    setModalPlayKey((k) => k + 1);
    setActiveModal(resolved);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  }, []);

  if (rows.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Our Work"
      className="oh-cv-auto oh-anim-paused relative bg-[#E9ECEA] text-[#0B1B22] py-[var(--section-py)] overflow-x-clip"
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
          animation: workMarqueeRtl var(--work-duration, 60s) linear infinite;
          will-change: transform;
        }
        .work-track-ltr {
          animation: workMarqueeLtr var(--work-duration, 60s) linear infinite;
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

      {/* Marquee Rows */}
      <div className="space-y-10 sm:space-y-12">
        {rows.map((row) => (
          <MarqueeCategoryRow
            key={row.id}
            rowTitle={row.title}
            direction={row.direction}
            items={row.items}
            prefersReducedMotion={prefersReducedMotion}
            isModalOpen={Boolean(activeModal)}
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>

      {/* Lazy Click-to-Play Video Modal Dialog */}
      {activeModal && (
        <Suspense fallback={null}>
          <OurWorkModal
            data={activeModal}
            playKey={modalPlayKey}
            onClose={handleCloseModal}
          />
        </Suspense>
      )}
    </section>
  );
}
