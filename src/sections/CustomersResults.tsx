import React, { Suspense, lazy, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Play, Star } from 'lucide-react';
import { config } from '../config';
import { FOUNDER, VIDEO_REVIEW } from '../content';
import { ShimmerImage, Tilt3D } from '../components/PremiumPrimitives';
import { useAnimationInView } from '../hooks/useAnimationInView';
import { getSmallAvatarSrc } from '../lib/images';

const CustomersReviewModal = lazy(() => import('../components/CustomersReviewModal'));

interface CustomersResultsProps {
  onOpenAudit?: () => void;
}

interface ProofSlide {
  id: string;
  fullName: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  highlight?: string;
  photo: string;
  logo?: string;
  sourceLabel: string;
  sourceUrl: string;
  date: string;
  isVideo?: boolean;
  videoSrc?: string;
  disclosure?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'OH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function extractFirstSentenceHighlight(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'Client feedback';
  const sentenceMatch = cleaned.match(/^[^.!?]+[.!?]?/);
  const sentence = (sentenceMatch ? sentenceMatch[0] : cleaned).trim();
  if (sentence.length <= 58) return sentence;
  const sliced = sentence.slice(0, 58);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 24 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

function PhotoOrMonogram({
  src,
  alt,
  name,
  logo,
  className = '',
  textSize = 'text-xl',
}: {
  src?: string;
  alt: string;
  name: string;
  logo?: string;
  className?: string;
  textSize?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const showImg = Boolean(src && src.trim() && !imgFailed);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#0A3A30] to-[#050E0D] flex items-center justify-center ${className}`}
    >
      {showImg ? (
        <ShimmerImage
          src={getSmallAvatarSrc(src)}
          alt={alt}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          wrapperClassName="relative w-full h-full"
          className="w-full h-full object-cover object-top block"
        />
      ) : (
        <span
          aria-hidden="true"
          className={`font-heading font-bold tracking-tight text-[#A8EBD3] select-none ${textSize}`}
        >
          {getInitials(name)}
        </span>
      )}

      {logo && (
        <div className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/70 px-2.5 py-1 rounded-lg border border-white/15">
          <img
            src={logo}
            alt=""
            width={80}
            height={20}
            loading="lazy"
            className="h-5 w-auto object-contain brightness-0 invert"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}

interface ReviewCardProps {
  slide: ProofSlide;
  isDuplicate?: boolean;
  isPlayingVideo?: boolean;
  onPlayVideo?: () => void;
  onStopVideo?: () => void;
  onReadMore?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  snapClass?: string;
}

const ReviewCard = memo(function ReviewCard({
  slide,
  isDuplicate = false,
  isPlayingVideo = false,
  onPlayVideo,
  onStopVideo,
  onReadMore,
  snapClass = '',
}: ReviewCardProps) {
  const highlightLine =
    slide.highlight?.trim() || extractFirstSentenceHighlight(slide.text);
  const isLongQuote = slide.text.length > 175 || slide.text.includes('\n');
  const roleAndLocation = [slide.role, slide.location]
    .filter((v) => Boolean(v && v.trim()))
    .join(' · ');

  return (
    <Tilt3D maxDeg={4} disabled={isDuplicate} className={`w-[clamp(280px,30vw,520px)] shrink-0 ${snapClass}`}>
      <article
        className="w-full h-full bg-white text-[#0B1B22] rounded-[28px] p-5 sm:p-6 shadow-[0_20px_50px_-20px_rgba(5,14,13,0.42)] border border-[rgba(11,27,34,0.08)] flex flex-col justify-between gap-4 text-left"
      >
        {/* Top: Reviewer Visual (compact horizontal banner / video player) + Highlight */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] overflow-hidden shrink-0 bg-[#0A3A30]">
              {slide.isVideo && !isDuplicate && isPlayingVideo && slide.videoSrc ? (
                <video
                  src={slide.videoSrc}
                  poster={slide.photo}
                  controls
                  autoPlay
                  playsInline
                  onEnded={onStopVideo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <PhotoOrMonogram
                    src={slide.photo}
                    alt={isDuplicate ? '' : slide.fullName}
                    name={slide.fullName}
                    logo={slide.logo}
                    textSize="text-lg"
                  />
                  {slide.isVideo && !isDuplicate && onPlayVideo && (
                    <button
                      type="button"
                      onClick={onPlayVideo}
                      aria-label={`Play video review from ${slide.fullName}`}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
                    >
                      <span
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center shadow-[var(--accent-btn-shadow)]"
                        style={{
                          background: 'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
                        }}
                      >
                        <Play className="w-4 h-4 fill-white text-white ml-0.5" strokeWidth={1.5} />
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>

            <h3 className="font-heading text-[18px] sm:text-[21px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0B1B22] min-w-0">
              {highlightLine}
            </h3>
          </div>

          {/* Serif Quote clamped to 6 lines */}
          <div>
            <blockquote className="font-serif text-[19px] sm:text-[21px] leading-[1.32] text-[#0B1B22] line-clamp-6">
              &ldquo;{slide.text}&rdquo;
            </blockquote>

            {isLongQuote && (
              <button
                type="button"
                tabIndex={isDuplicate ? -1 : undefined}
                onClick={isDuplicate ? undefined : onReadMore}
                className="mt-1.5 text-[12.5px] font-semibold text-[#14624F] hover:text-[#0A3A30] underline underline-offset-2 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer rounded-xs"
              >
                Read full review
              </button>
            )}
          </div>
        </div>

        {/* Bottom: Two Chips + Stars / Source / Date */}
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-[12px] bg-[#F3F5F3] text-[#0B1B22] text-[12px] font-medium">
              {slide.fullName}
            </span>

            {roleAndLocation && (
              <span className="relative inline-flex items-center px-2.5 py-1 rounded-[12px] bg-[#F3F5F3] text-[#475754] text-[12px] font-medium">
                <span
                  aria-hidden="true"
                  className="hidden sm:block absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#F3F5F3] rotate-45"
                />
                <span className="relative z-10">{roleAndLocation}</span>
              </span>
            )}
          </div>

          <div className="pt-2.5 border-t border-[rgba(11,27,34,0.08)] flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#475754]">
            {slide.rating > 0 ? (
              <div
                className="flex items-center gap-0.5 tabular-nums"
                role={isDuplicate ? undefined : 'img'}
                aria-label={isDuplicate ? undefined : `Rated ${slide.rating} out of 5`}
              >
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <Star
                    key={starIdx}
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className={`w-3.5 h-3.5 ${
                      starIdx < slide.rating
                        ? 'text-[#D99B26] fill-[#D99B26]'
                        : 'text-[rgba(11,27,34,0.2)]'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-[11px] font-medium text-[#475754]">
                Client feedback
              </span>
            )}

            <div className="flex items-center gap-2">
              {slide.sourceUrl ? (
                <a
                  href={slide.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isDuplicate ? -1 : undefined}
                  className="oh-link-sweep inline-flex items-center gap-1 font-medium text-[#0B1B22] hover:text-[#14624F] rounded-xs"
                >
                  <span>{slide.sourceLabel}</span>
                  <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                </a>
              ) : (
                slide.sourceLabel && (
                  <span className="font-medium text-[#0B1B22]">
                    {slide.sourceLabel}
                  </span>
                )
              )}
              {slide.date && (
                <span className="text-[#475754] tabular-nums">
                  {slide.date}
                </span>
              )}
            </div>
          </div>

          {slide.disclosure && (
            <p className="text-[11px] text-[#475754]">
              {slide.disclosure}
            </p>
          )}
        </div>
      </article>
    </Tilt3D>
  );
});

export default function CustomersResults({ onOpenAudit: _onOpenAudit }: CustomersResultsProps) {
  const slides = useMemo<ProofSlide[]>(() => {
    const baseSlides: ProofSlide[] = (config.testimonials || []).map((t) => ({
      id: t.id,
      fullName: t.fullName,
      role: t.role,
      location: t.location,
      rating: t.rating,
      text: t.text,
      highlight: t.highlight,
      photo: t.photo,
      logo: t.logo,
      sourceLabel: t.sourceLabel,
      sourceUrl: t.sourceUrl,
      date: t.date,
    }));

    if (VIDEO_REVIEW.permissionConfirmed && config.videoTestimonial) {
      const reviewer = VIDEO_REVIEW.reviewerName?.trim() || 'Past client';
      baseSlides.push({
        id: 'video-testimonial',
        fullName: reviewer,
        role: VIDEO_REVIEW.reviewerLine?.trim() || 'Client video review',
        location: '',
        rating: config.videoTestimonial.rating ?? 0,
        text: `${reviewer} recorded this video about working with ${FOUNDER.name}, founder of Open Hours.`,
        highlight:
          config.videoTestimonial.highlight ||
          `Working with ${FOUNDER.name}`,
        photo: VIDEO_REVIEW.poster || '',
        logo: config.videoTestimonial.logo,
        sourceLabel: 'Video review',
        sourceUrl: '',
        date: '',
        isVideo: true,
        videoSrc: VIDEO_REVIEW.src,
        disclosure: (
          config.videoTestimonial.disclosure ||
          VIDEO_REVIEW.disclosure ||
          ''
        ).trim(),
      });
    }

    return baseSlides;
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  useAnimationInView(sectionRef, false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [modalSlide, setModalSlide] = useState<ProofSlide | null>(null);

  const duplicateSetRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Ensure duplicate marquee set is completely inert & non-focusable
  useEffect(() => {
    const el = duplicateSetRef.current;
    if (!el) return;
    el.setAttribute('inert', '');
  }, [prefersReducedMotion, slides.length]);

  const handleCloseModal = useCallback(() => {
    setModalSlide(null);
    window.requestAnimationFrame(() => triggerButtonRef.current?.focus());
  }, []);

  if (slides.length === 0) return null;

  const isMarqueePaused =
    prefersReducedMotion ||
    isTouching ||
    isUserPaused ||
    Boolean(playingVideoId) ||
    Boolean(modalSlide);

  const proofNote = config.proof?.note?.trim();

  return (
    <section
      ref={sectionRef}
      id="reviews"
      aria-label="Client feedback"
      className="oh-cv-auto oh-anim-paused oh-grain-dark relative w-full py-[var(--section-py)] overflow-x-clip text-white"
      style={{
        background:
          'radial-gradient(circle at 12% 16%, rgba(5, 14, 13, 0.96) 0%, transparent 55%), radial-gradient(circle at 86% 84%, rgba(63, 209, 165, 0.22) 0%, transparent 58%), radial-gradient(circle at 72% 24%, rgba(20, 98, 79, 0.36) 0%, transparent 52%), linear-gradient(135deg, #050E0D 0%, #0A3A30 58%, #0F4A3E 100%)',
      }}
    >
      <style>{`
        @keyframes reviewsMarqueeScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .reviews-marquee-track {
          animation: reviewsMarqueeScroll 70s linear infinite;
          will-change: transform;
        }
        .reviews-marquee-wrap:hover .reviews-marquee-track,
        .reviews-marquee-wrap:has(:focus-visible) .reviews-marquee-track {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .reviews-marquee-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Top Soft Light-to-Dark Boundary Bleed */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#E9ECEA]/15 to-transparent"
      />

      {/* Bottom Subtle Contrast & Light-Boundary Scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050E0D]/65 via-[#050E0D]/25 to-transparent"
      />

      <div className="relative z-10 w-full">
        {/* Centred Heading + Visually-Hidden Focusable Pause Control */}
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-12 relative">
          <h2 className="font-heading text-[clamp(36px,4.8vw,62px)] font-bold leading-[1.06] tracking-[-0.03em] text-white">
            <span className="oh-line-mask">
              <span className="oh-line-reveal">
                Real clients.{' '}
                <span className="font-serif italic font-normal text-[#A8EBD3]">
                  Real feedback.
                </span>
              </span>
            </span>
          </h2>

          {!prefersReducedMotion && (
            <button
              type="button"
              onClick={() => setIsUserPaused((prev) => !prev)}
              aria-pressed={isUserPaused}
              className="sr-only focus:not-sr-only focus:inline-flex focus:items-center focus:justify-center focus:mt-4 focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#0B1B22] focus:text-white focus:border focus:border-[#6FD6B0] focus:text-sm focus:font-semibold focus:outline-none cursor-pointer"
            >
              {isUserPaused ? 'Resume client reviews marquee' : 'Pause client reviews marquee'}
            </button>
          )}
        </div>

        {/* Reduced Motion: Horizontally Scrollable Snap Row (Set 1 Only, Zero Movement) */}
        {prefersReducedMotion ? (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar">
              {slides.map((slide) => (
                <ReviewCard
                  key={slide.id}
                  slide={slide}
                  snapClass="snap-center"
                  isPlayingVideo={playingVideoId === slide.id}
                  onPlayVideo={() => setPlayingVideoId(slide.id)}
                  onStopVideo={() => setPlayingVideoId(null)}
                  onReadMore={(e) => {
                    triggerButtonRef.current = e.currentTarget;
                    setModalSlide(slide);
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Infinite Right-to-Left CSS Marquee Track with Soft Horizontal Edge Fades */
          <div
            className="reviews-marquee-wrap oh-marquee-fade relative w-full overflow-hidden py-4"
            onTouchStart={() => setIsTouching(true)}
            onTouchEnd={() => setIsTouching(false)}
            onTouchCancel={() => setIsTouching(false)}
          >
            <div
              className="reviews-marquee-track flex w-max items-stretch"
              style={{
                animationPlayState: isMarqueePaused ? 'paused' : 'running',
              }}
            >
              {/* Set 1 (Interactive, Screen-Reader Accessible) */}
              <div className="flex items-stretch gap-5 pr-5 shrink-0">
                {slides.map((slide) => (
                  <ReviewCard
                    key={slide.id}
                    slide={slide}
                    isPlayingVideo={playingVideoId === slide.id}
                    onPlayVideo={() => setPlayingVideoId(slide.id)}
                    onStopVideo={() => setPlayingVideoId(null)}
                    onReadMore={(e) => {
                      triggerButtonRef.current = e.currentTarget;
                      setModalSlide(slide);
                    }}
                  />
                ))}
              </div>

              {/* Set 2 (Duplicate for Seamless Loop — aria-hidden, inert, non-focusable, empty image alt) */}
              <div
                ref={duplicateSetRef}
                aria-hidden="true"
                className="flex items-stretch gap-5 pr-5 shrink-0"
              >
                {slides.map((slide) => (
                  <ReviewCard
                    key={`${slide.id}-dup`}
                    slide={slide}
                    isDuplicate
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Config Transparency Note */}
        {proofNote && (
          <p className="mt-6 px-4 text-center text-[13px] text-white/85 max-w-[560px] mx-auto">
            {proofNote}
          </p>
        )}
      </div>

      {/* Lazy Full Review Modal Dialog */}
      {modalSlide && (
        <Suspense fallback={null}>
          <CustomersReviewModal slide={modalSlide} onClose={handleCloseModal} />
        </Suspense>
      )}
    </section>
  );
}
