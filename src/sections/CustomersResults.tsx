import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { config } from '../config';
import { FOUNDER, VIDEO_REVIEW } from '../content';
import { ShimmerImage } from '../components/PremiumPrimitives';
import { useAnimationInView } from '../hooks/useAnimationInView';
import { getSmallAvatarSrc } from '../lib/images';
import { parseVideoEmbed } from '../lib/videoEmbed';
import CustomersReviewModal, { type CustomerReviewModalSlide } from '../components/CustomersReviewModal';

const AARON_FREEDMAN_STREAMABLE_EMBED = 'https://streamable.com/e/36ovtq?';
const AARON_FREEDMAN_THUMBNAIL =
  'https://i.ibb.co.com/VcbcTXH9/ac6245a6-13a2-4716-bdfa-79220b85865b.png';

interface CustomersResultsProps {
  onOpenAudit?: () => void;
}

interface ReviewEntry {
  id: string;
  fullName: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  highlight?: string;
  service?: string;
  featured?: boolean;
  photo: string;
  logo?: string;
  sourceLabel: string;
  sourceUrl: string;
  date: string;
  isVideo?: boolean;
  videoEmbedUrl?: string;
  videoSrc?: string;
  poster?: string;
  disclosure?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'OH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getSourceKind(sourceUrl?: string): 'linkedin' | 'google' | 'link' | null {
  const trimmed = sourceUrl?.trim();
  if (!trimmed) return null;
  try {
    const host = new URL(trimmed).hostname.toLowerCase();
    if (host.includes('linkedin.com')) return 'linkedin';
    if (host.includes('google.') || host === 'g.page' || host.endsWith('.g.page')) return 'google';
  } catch {
    const lower = trimmed.toLowerCase();
    if (lower.includes('linkedin.com')) return 'linkedin';
    if (lower.includes('google.') || lower.includes('g.page')) return 'google';
  }
  return 'link';
}

function SourceGlyph({
  kind,
  className = 'w-5 h-5',
}: {
  kind: 'linkedin' | 'google' | 'link';
  className?: string;
}) {
  if (kind === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18.34H5.67V9.76h2.67v8.58ZM7 8.59a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Zm11.34 9.75h-2.66v-4.18c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.21v4.25h-2.66V9.76h2.56v1.17h.03c.36-.67 1.23-1.38 2.53-1.38 2.7 0 3.2 1.78 3.2 4.09v4.7Z" />
      </svg>
    );
  }
  if (kind === 'google') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
        <path d="M21.35 11.1h-9.17v2.98h5.27c-.45 2.33-2.46 3.74-5.27 3.74a5.98 5.98 0 0 1 0-11.96c1.54 0 2.93.56 4.01 1.49l2.14-2.14A9.03 9.03 0 0 0 12.18 3a9 9 0 1 0 0 18c5.19 0 8.63-3.65 8.63-8.79 0-.59-.06-1.15-.16-1.11Z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ClockCheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 12a9 9 0 1 0-9.97 8.94" />
      <polyline points="12 7 12 12 14.5 13.5" />
      <path d="m16 19 2 2 4-4" />
    </svg>
  );
}

function StarIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.25l2.92 5.91 6.53.95-4.72 4.6 1.11 6.5L12 17.14l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.25Z" />
    </svg>
  );
}

function AvatarCircle({
  src,
  alt,
  name,
  darkSurface = false,
}: {
  src?: string;
  alt: string;
  name: string;
  darkSurface?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const resolvedSrc = getSmallAvatarSrc(src);
  const showImg = Boolean(resolvedSrc && !imgFailed);

  return (
    <div
      className={`relative w-[60px] h-[60px] rounded-full overflow-hidden shrink-0 flex items-center justify-center ${
        darkSurface
          ? 'bg-[#06251E] ring-1 ring-white/25'
          : 'bg-gradient-to-br from-[#06251E] to-[#14735A]'
      }`}
    >
      {showImg ? (
        <ShimmerImage
          src={resolvedSrc}
          alt={alt}
          width={60}
          height={60}
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
          className="font-heading font-bold tracking-tight text-[#A8EBD3] select-none text-[18px]"
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

function getBigQuoteSizeClass(text: string): string {
  const len = text.trim().length;
  if (len <= 115) {
    return 'text-[26px] sm:text-[38px] min-[1100px]:text-[48px] leading-[1.1]';
  }
  if (len <= 210) {
    return 'text-[26px] sm:text-[32px] min-[1100px]:text-[38px] leading-[1.15]';
  }
  return 'text-[26px] sm:text-[28px] min-[1100px]:text-[30px] leading-[1.22]';
}

interface RightReviewCardProps {
  item: ReviewEntry;
  isDuplicate?: boolean;
  onReadMore?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  responsiveCardClass?: string;
}

const RightReviewCard = memo(function RightReviewCard({
  item,
  isDuplicate = false,
  onReadMore,
  responsiveCardClass = '',
}: RightReviewCardProps) {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const serviceLabel = item.service?.trim() || '';
  const roleLine = [item.role, item.location].filter((v) => Boolean(v && v.trim())).join(', ');
  const sourceKind = getSourceKind(item.sourceUrl);

  useEffect(() => {
    if (isDuplicate) return;
    const el = quoteRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollHeight > el.clientHeight + 2);
    };

    checkOverflow();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDuplicate, item.text]);

  const showReadMore = !isDuplicate && (isOverflowing || item.text.length > 180 || item.text.includes('\n\n'));

  return (
    <article
      className={`bg-[#F8F3EE] text-[#0B1B22] rounded-[40px] p-6 sm:px-[30px] sm:py-[26px] flex flex-col justify-between gap-3 border border-[rgba(11,27,34,0.04)] ${responsiveCardClass}`}
    >
      <div className="min-w-0">
        {serviceLabel && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] text-[#5E6A6F] font-medium">
              <ClockCheckIcon className="w-[18px] h-[18px] text-[#5E6A6F] shrink-0" />
              <span>Worked on:</span>
            </span>
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white text-[#0B1B22] text-[14px] font-medium shadow-[0_1px_2px_rgba(11,27,34,0.04)]">
              {serviceLabel}
            </span>
          </div>
        )}

        <blockquote
          ref={quoteRef}
          className="font-heading text-[21px] sm:text-[24px] font-normal leading-[1.24] tracking-[-0.02em] text-[#0B1B22] line-clamp-4"
        >
          &ldquo;{item.text}&rdquo;
        </blockquote>

        {showReadMore && (
          <button
            type="button"
            onClick={onReadMore}
            className="mt-1.5 inline-flex items-center text-[13.5px] font-semibold text-[#14624F] hover:text-[#06251E] underline underline-offset-4 cursor-pointer rounded-xs"
          >
            Read more
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3.5 min-w-0">
          <AvatarCircle
            src={item.photo}
            alt={isDuplicate ? '' : item.fullName}
            name={item.fullName}
          />
          <div className="min-w-0">
            <p className="font-heading text-[18px] sm:text-[20px] font-medium leading-[1.2] text-[#0B1B22] truncate">
              {item.fullName}
            </p>
            {roleLine && (
              <p className="text-[15px] sm:text-[18px] leading-[1.3] text-[#5E6A6F] truncate">
                {roleLine}
              </p>
            )}
          </div>
        </div>

        {sourceKind && item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isDuplicate ? -1 : undefined}
            aria-label={isDuplicate ? undefined : `View ${item.fullName}'s review source (${item.sourceLabel || 'external link'})`}
            className="w-7 h-7 shrink-0 inline-flex items-center justify-center text-[#8A9499] hover:text-[#0B1B22] transition-colors rounded-md"
          >
            <SourceGlyph kind={sourceKind} className="w-[22px] h-[22px]" />
          </a>
        )}
      </div>
    </article>
  );
});

export default function CustomersResults({ onOpenAudit: _onOpenAudit }: CustomersResultsProps) {
  const { uniqueReviews, featuredSlides, rightPool } = useMemo(() => {
    const seen = new Set<string>();
    const deduped: ReviewEntry[] = [];

    for (const t of config.testimonials || []) {
      const normalized = t.fullName.trim().toLowerCase();
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      deduped.push({
        id: t.id,
        fullName: t.fullName,
        role: t.role,
        location: t.location,
        rating: t.rating,
        text: t.text,
        highlight: t.highlight,
        service: t.service,
        featured: t.featured,
        photo: t.photo,
        logo: t.logo,
        sourceLabel: t.sourceLabel,
        sourceUrl: t.sourceUrl,
        date: t.date,
      });
    }

    const hasVideoTestimonial = Boolean(VIDEO_REVIEW.permissionConfirmed && config.videoTestimonial);
    const videoReviewerName = hasVideoTestimonial
      ? (VIDEO_REVIEW.reviewerName || '').trim() || 'Past client'
      : '';
    const videoReviewerKey = videoReviewerName.toLowerCase();

    // If the video testimonial reviewer also exists in config.testimonials, merge them into
    // one single video+text trailing slide so no reviewer appears twice across the section.
    const matchingTestimonial = hasVideoTestimonial
      ? deduped.find((item) => item.fullName.trim().toLowerCase() === videoReviewerKey)
      : undefined;

    const textOnlyReviews = matchingTestimonial
      ? deduped.filter((item) => item.id !== matchingTestimonial.id)
      : deduped;

    const explicitFeatured = textOnlyReviews.filter((item) => item.featured === true);
    const chosenTextFeatured =
      explicitFeatured.length > 0 ? explicitFeatured : textOnlyReviews.slice(0, 3);
    const chosenIds = new Set(chosenTextFeatured.map((item) => item.id));

    const slides: ReviewEntry[] = [...chosenTextFeatured];

    if (hasVideoTestimonial && config.videoTestimonial) {
      const isAaron = videoReviewerKey === 'aaron freedman';
      const preferredEmbed = isAaron ? AARON_FREEDMAN_STREAMABLE_EMBED : VIDEO_REVIEW.vimeoEmbedUrl;
      const parsedEmbed = preferredEmbed ? parseVideoEmbed(undefined, preferredEmbed) : null;
      const hasValidVideo = Boolean((parsedEmbed && parsedEmbed.allowed) || VIDEO_REVIEW.src);

      if (hasValidVideo) {
        slides.push({
          id: matchingTestimonial?.id || 'video-testimonial',
          fullName: matchingTestimonial?.fullName || videoReviewerName,
          role:
            matchingTestimonial?.role ||
            VIDEO_REVIEW.reviewerLine?.trim() ||
            'Client video review',
          location: matchingTestimonial?.location || '',
          rating: matchingTestimonial?.rating ?? config.videoTestimonial.rating ?? 0,
          text:
            matchingTestimonial?.text ||
            `${videoReviewerName} recorded this video about working with ${FOUNDER.name}, founder of Open Hours.`,
          highlight: config.videoTestimonial.highlight?.trim() || '',
          photo: matchingTestimonial?.photo || '',
          poster: isAaron
            ? AARON_FREEDMAN_THUMBNAIL
            : VIDEO_REVIEW.poster || '/zuhayer-review-poster.jpg',
          logo: config.videoTestimonial.logo,
          sourceLabel: matchingTestimonial?.sourceLabel || 'Video review',
          sourceUrl: matchingTestimonial?.sourceUrl || '',
          date: matchingTestimonial?.date || '',
          isVideo: true,
          videoEmbedUrl: parsedEmbed?.allowed ? preferredEmbed : undefined,
          videoSrc: isAaron ? undefined : VIDEO_REVIEW.src,
          disclosure: (
            config.videoTestimonial.disclosure ||
            VIDEO_REVIEW.disclosure ||
            ''
          ).trim(),
        });
      }
    }

    const remaining = textOnlyReviews.filter((item) => !chosenIds.has(item.id));
    const rightCards = remaining.length >= 3 ? remaining : textOnlyReviews;

    return {
      uniqueReviews: deduped,
      featuredSlides: slides,
      rightPool: rightCards,
    };
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  useAnimationInView(sectionRef, false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasKeyboardFocusInside, setHasKeyboardFocusInside] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [modalSlide, setModalSlide] = useState<CustomerReviewModalSlide | null>(null);
  const [bigQuoteOverflowing, setBigQuoteOverflowing] = useState(false);
  const [verticalDurationSec, setVerticalDurationSec] = useState(34);

  const bigQuoteRef = useRef<HTMLQuoteElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const set1Ref = useRef<HTMLDivElement>(null);
  const duplicateSetRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalOpenedByKeyboardRef = useRef(false);
  const lastInputWasKeyboardRef = useRef(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        lastInputWasKeyboardRef.current = true;
      }
    };
    const onPointerDown = () => {
      lastInputWasKeyboardRef.current = false;
    };
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (activeIndex >= featuredSlides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, featuredSlides.length]);

  const shouldLoopDesktop = !prefersReducedMotion && rightPool.length > 2;

  // Compute exact 40px/s loop duration from Set 1 height
  useEffect(() => {
    if (!shouldLoopDesktop) return;
    const el = set1Ref.current;
    if (!el) return;

    const updateDuration = () => {
      const h = el.offsetHeight;
      if (h > 0) {
        setVerticalDurationSec(Math.max(12, Number((h / 40).toFixed(2))));
      }
    };

    updateDuration();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateDuration);
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoopDesktop, rightPool.length]);

  // Keep Set 2 completely inert & non-focusable
  useEffect(() => {
    const el = duplicateSetRef.current;
    if (!el) return;
    el.setAttribute('inert', '');
  }, [shouldLoopDesktop, rightPool.length]);

  const activeSlide = featuredSlides[activeIndex] ?? featuredSlides[0];

  // Check overflow on active big quote
  useEffect(() => {
    const el = bigQuoteRef.current;
    if (!el || activeSlide?.isVideo) {
      setBigQuoteOverflowing(false);
      return;
    }

    const checkOverflow = () => {
      setBigQuoteOverflowing(el.scrollHeight > el.clientHeight + 2);
    };

    checkOverflow();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeSlide?.id, activeSlide?.isVideo, activeSlide?.text]);

  const goToSlide = useCallback(
    (nextIndex: number) => {
      if (featuredSlides.length <= 1) return;
      const wrapped =
        ((nextIndex % featuredSlides.length) + featuredSlides.length) %
        featuredSlides.length;
      if (wrapped === activeIndex) return;
      setSlideDir(nextIndex > activeIndex ? 'next' : 'prev');
      setActiveIndex(wrapped);
    },
    [activeIndex, featuredSlides.length]
  );

  const handleCarouselKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (featuredSlides.length <= 1) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(activeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(activeIndex - 1);
      }
    },
    [activeIndex, featuredSlides.length, goToSlide]
  );

  const handleTouchStartSlide = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  }, []);

  const handleTouchEndSlide = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const startX = touchStartXRef.current;
      const startY = touchStartYRef.current;
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      if (startX === null || startY === null || featuredSlides.length <= 1) return;

      const endX = e.changedTouches[0]?.clientX ?? startX;
      const endY = e.changedTouches[0]?.clientY ?? startY;
      const dx = endX - startX;
      const dy = endY - startY;

      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          goToSlide(activeIndex + 1);
        } else {
          goToSlide(activeIndex - 1);
        }
      }
    },
    [activeIndex, featuredSlides.length, goToSlide]
  );

  const handleOpenModal = useCallback(
    (item: ReviewEntry, e: React.MouseEvent<HTMLButtonElement>) => {
      modalOpenedByKeyboardRef.current = e.detail === 0;
      triggerButtonRef.current = e.currentTarget;
      setModalSlide({
        id: item.id,
        fullName: item.fullName,
        role: item.role,
        location: item.location,
        rating: item.rating,
        text: item.text,
        photo: item.photo,
        sourceLabel: item.sourceLabel,
        sourceUrl: item.sourceUrl,
        date: item.date,
        highlight: item.highlight,
        service: item.service,
        isVideo: item.isVideo,
        videoEmbedUrl: item.videoEmbedUrl,
        videoSrc: item.videoSrc,
        poster: item.poster,
        disclosure: item.disclosure,
      });
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    const shouldRestoreFocus = modalOpenedByKeyboardRef.current;
    modalOpenedByKeyboardRef.current = false;
    setModalSlide(null);
    if (shouldRestoreFocus) {
      window.requestAnimationFrame(() => triggerButtonRef.current?.focus());
    }
  }, []);

  if (uniqueReviews.length === 0 && featuredSlides.length === 0) return null;

  const proofRating = String(config.proof?.rating ?? '').trim();
  const proofSourceLabel = config.proof?.sourceLabel?.trim() || '';
  const proofSourceUrl = config.proof?.sourceUrl?.trim() || '';
  const showProofRatingRow = Boolean(proofRating && proofSourceLabel);

  const proofBadge = config.proof?.badge;
  const showProofBadge = Boolean(proofBadge && proofBadge.titleLine1?.trim());

  const proofNote = config.proof?.note?.trim() || '';

  const isVerticalPaused =
    !shouldLoopDesktop ||
    isHovered ||
    hasKeyboardFocusInside ||
    isTouching ||
    isUserPaused ||
    Boolean(modalSlide);

  const activeHighlight = activeSlide?.highlight?.trim() || '';
  const activeRoleLine = activeSlide
    ? [activeSlide.role, activeSlide.location].filter((v) => Boolean(v && v.trim())).join(', ')
    : '';
  const activeSourceKind = getSourceKind(activeSlide?.sourceUrl);
  const showBigReadMore =
    Boolean(activeSlide && !activeSlide.isVideo) &&
    (bigQuoteOverflowing ||
      (activeSlide?.text.length ?? 0) > 250 ||
      Boolean(activeSlide?.text.includes('\n\n')));

  const RatingRowContent = (
    <span className="inline-flex items-center gap-2.5">
      <span className="w-6 h-6 rounded-full bg-[#FF5A1F] text-white text-[11px] font-bold inline-flex items-center justify-center shrink-0">
        {proofSourceLabel.slice(0, 1).toUpperCase()}
      </span>
      <span className="inline-flex items-center gap-0.5 text-[#FF5A1F]" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="w-4 h-4" />
        ))}
      </span>
      <span className="text-[15px] font-bold text-[#0B1B22] tabular-nums">
        {proofRating} rating
      </span>
    </span>
  );

  return (
    <section
      ref={sectionRef}
      id="reviews"
      aria-label="Client feedback"
      className="oh-cv-auto oh-anim-paused relative w-full bg-white text-[#0B1B22] py-16 sm:py-24 overflow-x-clip"
    >
      <style>{`
        @keyframes reviewsVerticalScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, -50%, 0); }
        }
        @keyframes ohReviewSlideNext {
          from { opacity: 0; transform: translate3d(24px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes ohReviewSlidePrev {
          from { opacity: 0; transform: translate3d(-24px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .reviews-slide-next {
          animation: ohReviewSlideNext 500ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .reviews-slide-prev {
          animation: ohReviewSlidePrev 500ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .reviews-v-track {
          animation: reviewsVerticalScroll var(--reviews-v-duration, 34s) linear infinite;
          will-change: transform;
        }
        .reviews-v-wrap:hover .reviews-v-track {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .reviews-v-track,
          .reviews-slide-next,
          .reviews-slide-prev {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:justify-between gap-6 mb-9 sm:mb-12">
          <h2 className="font-heading text-[clamp(40px,5vw,72px)] font-bold leading-[1] tracking-[-0.03em] text-[#0B1B22]">
            <span className="block">Real clients.</span>
            <span className="block">Real feedback.</span>
          </h2>

          {(showProofRatingRow || showProofBadge) && (
            <div className="flex flex-wrap items-center gap-5 shrink-0 pt-1">
              {showProofRatingRow &&
                (proofSourceUrl ? (
                  <a
                    href={proofSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${proofRating} rating on ${proofSourceLabel}`}
                    className="inline-flex items-center hover:opacity-85 transition-opacity rounded-full"
                  >
                    {RatingRowContent}
                  </a>
                ) : (
                  <div aria-label={`${proofRating} rating on ${proofSourceLabel}`}>
                    {RatingRowContent}
                  </div>
                ))}

              {showProofBadge && proofBadge && (
                <div
                  className="relative w-[96px] h-[106px] select-none shrink-0 flex flex-col items-center justify-start"
                  aria-label={`${proofBadge.label || ''} ${proofBadge.titleLine1 || ''} ${proofBadge.titleLine2 || ''}`.trim()}
                >
                  <svg
                    viewBox="0 0 96 106"
                    fill="none"
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full drop-shadow-[0_2px_6px_rgba(11,27,34,0.06)]"
                  >
                    <path
                      d="M4 6C4 3.79086 5.79086 2 8 2H88C90.2091 2 92 3.79086 92 6V74.5C92 80.2 88.6 85.4 83.4 87.8L48 104L12.6 87.8C7.4 85.4 4 80.2 4 74.5V6Z"
                      fill="#FFFFFF"
                      stroke="#0B1B22"
                      strokeWidth="2"
                    />
                    {proofBadge.label?.trim() && (
                      <>
                        <path
                          d="M5 6C5 4.34315 6.34315 3 8 3H88C89.6569 3 91 4.34315 91 6V21H5V6Z"
                          fill="#EEF1F3"
                        />
                        <line x1="5" y1="21" x2="91" y2="21" stroke="#0B1B22" strokeWidth="1.5" />
                      </>
                    )}
                  </svg>
                  <div className="relative z-10 w-full flex flex-col items-center text-center px-2">
                    {proofBadge.label?.trim() && (
                      <div className="h-[20px] flex items-center justify-center text-[8.5px] font-bold tracking-[0.06em] uppercase text-[#0B1B22]">
                        {proofBadge.label.trim()}
                      </div>
                    )}
                    <div className={`${proofBadge.label?.trim() ? 'pt-2.5' : 'pt-4'} leading-[1.1]`}>
                      <div className="font-heading text-[12px] font-bold text-[#0B1B22]">
                        {proofBadge.titleLine1}
                      </div>
                      {proofBadge.titleLine2 && (
                        <div className="font-heading text-[12px] font-bold text-[#0B1B22]">
                          {proofBadge.titleLine2}
                        </div>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center justify-center gap-1 text-[#FF5A1F]" aria-hidden="true">
                      {Array.from({ length: proofBadge.stars ?? 2 }).map((_, i) => (
                        <StarIcon key={i} className="w-2.5 h-2.5" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Two-Column Asymmetric Grid */}
        <div className="grid grid-cols-1 min-[1100px]:grid-cols-[55fr_45fr] gap-[26px] items-stretch">
          {/* LEFT COLUMN: Single Large Feature Carousel Card */}
          {activeSlide && (
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Featured client feedback"
              tabIndex={0}
              onKeyDown={handleCarouselKeyDown}
              onTouchStart={handleTouchStartSlide}
              onTouchEnd={handleTouchEndSlide}
              className="relative rounded-[40px] overflow-hidden text-white min-h-[440px] sm:min-h-[540px] min-[1100px]:h-[660px] p-6 sm:p-10 flex flex-col justify-between outline-none focus-visible:ring-2 focus-visible:ring-[#1E9E6A] focus-visible:ring-offset-4"
              style={{
                background:
                  'radial-gradient(circle at 26% 90%, rgba(111, 214, 176, 0.34) 0%, transparent 56%), linear-gradient(180deg, #06251E 0%, #0D4B3B 52%, #3DBE93 100%)',
              }}
            >
              {/* Bottom Subtle Scrim for Crisp White Text Contrast Over Bright Mint Bottom */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#06251E]/55 via-[#06251E]/20 to-transparent"
              />

              {/* Live Region for Screen Readers */}
              <span className="sr-only" aria-live="polite">
                {`Review ${activeIndex + 1} of ${featuredSlides.length}: ${activeSlide.fullName}`}
              </span>

              {/* Active Slide Content with 500ms Cross-Fade + 24px Slide */}
              <div
                key={`${activeSlide.id}-${activeIndex}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${activeIndex + 1} of ${featuredSlides.length}`}
                className={`relative z-10 flex-1 flex flex-col ${
                  slideDir === 'next' ? 'reviews-slide-next' : 'reviews-slide-prev'
                }`}
              >
                {activeHighlight && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-[18px] py-[10px] rounded-full bg-white/12 text-[15px] sm:text-[17px] font-normal leading-snug text-white backdrop-blur-[2px]">
                      {activeHighlight}
                    </span>
                  </div>
                )}

                {activeSlide.isVideo ? (
                  <div
                    className={`flex-1 flex flex-col justify-center ${
                      activeHighlight ? 'mt-6 sm:mt-10' : 'mt-2'
                    }`}
                  >
                    <div className="relative w-full h-[260px] sm:h-[340px] min-[1100px]:h-[360px] rounded-[28px] overflow-hidden bg-[#06251E] border border-white/15 shadow-[0_20px_50px_-16px_rgba(6,37,30,0.65)]">
                      <ShimmerImage
                        src={activeSlide.poster || '/zuhayer-review-poster.jpg'}
                        alt={`Video review poster from ${activeSlide.fullName}`}
                        width={720}
                        height={450}
                        loading="lazy"
                        decoding="async"
                        wrapperClassName="relative w-full h-full"
                        className="w-full h-full object-cover object-top"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06251E]/55 via-black/15 to-transparent"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleOpenModal(activeSlide, e)}
                        aria-label={`Play video review from ${activeSlide.fullName}`}
                        className="group absolute inset-0 flex items-center justify-center cursor-pointer"
                      >
                        <span className="w-[72px] h-[72px] rounded-full bg-white text-[#06251E] flex items-center justify-center shadow-2xl transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-108 group-active:scale-95">
                          <Play className="w-7 h-7 fill-[#06251E] text-[#06251E] ml-0.5" strokeWidth={1.5} />
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${
                      activeHighlight
                        ? 'mt-8 sm:mt-16 min-[1100px]:mt-[84px]'
                        : 'mt-4 sm:mt-8 min-[1100px]:mt-12'
                    }`}
                  >
                    <blockquote
                      ref={bigQuoteRef}
                      className={`font-heading font-normal tracking-[-0.025em] text-white line-clamp-7 min-[1100px]:line-clamp-8 ${getBigQuoteSizeClass(
                        activeSlide.text
                      )}`}
                      style={{ textShadow: '0 1px 2px rgba(6, 37, 30, 0.25)' }}
                    >
                      &ldquo;{activeSlide.text}&rdquo;
                    </blockquote>

                    {showBigReadMore && (
                      <button
                        type="button"
                        onClick={(e) => handleOpenModal(activeSlide, e)}
                        className="mt-4 inline-flex items-center text-[15px] font-semibold text-white hover:text-[#DDF4EA] underline underline-offset-4 cursor-pointer rounded-xs"
                      >
                        Read more
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Attribution + Slide Dots */}
              <div className="relative z-10 pt-6 flex items-end justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <AvatarCircle
                    src={activeSlide.photo}
                    alt={activeSlide.fullName}
                    name={activeSlide.fullName}
                    darkSurface
                  />
                  <div className="min-w-0">
                    <p
                      className="font-heading text-[18px] sm:text-[20px] font-medium leading-[1.2] text-white"
                      style={{ textShadow: '0 1px 2px rgba(6, 37, 30, 0.28)' }}
                    >
                      {activeSlide.fullName}
                    </p>
                    {(activeRoleLine || (activeSourceKind && activeSlide.sourceUrl)) && (
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        {activeRoleLine && (
                          <span
                            className="text-[15px] sm:text-[18px] leading-[1.25] text-white/85"
                            style={{ textShadow: '0 1px 2px rgba(6, 37, 30, 0.28)' }}
                          >
                            {activeRoleLine}
                          </span>
                        )}
                        {activeSourceKind && activeSlide.sourceUrl && (
                          <a
                            href={activeSlide.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${activeSlide.fullName}'s review source (${activeSlide.sourceLabel || 'external link'})`}
                            className="w-7 h-7 inline-flex items-center justify-center text-white hover:text-[#DDF4EA] transition-colors shrink-0 rounded-md"
                          >
                            <SourceGlyph kind={activeSourceKind} className="w-[22px] h-[22px]" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {featuredSlides.length > 1 && (
                  <div className="flex items-center gap-2 shrink-0 pb-1">
                    {featuredSlides.map((s, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => goToSlide(idx)}
                          aria-label={`Show review ${idx + 1} of ${featuredSlides.length}: ${s.fullName}`}
                          aria-current={isActive ? 'true' : undefined}
                          className="p-1.5 -m-1.5 inline-flex items-center justify-center cursor-pointer rounded-full"
                        >
                          <span
                            className={`block h-[8px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                              isActive
                                ? 'w-[28px] bg-white'
                                : 'w-[8px] bg-white/40 hover:bg-white/70'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RIGHT COLUMN */}
          {rightPool.length > 0 && (
            <div className="relative min-w-0">
              {/* Desktop Vertical Loop or Static/Reduced-Motion Scrollable Stack (min 1100px) */}
              <div className="hidden min-[1100px]:block relative h-[660px]">
                {shouldLoopDesktop && (
                  <button
                    type="button"
                    onClick={() => setIsUserPaused((prev) => !prev)}
                    aria-pressed={isUserPaused}
                    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-30 focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#06251E] focus:text-white focus:text-[13px] focus:font-semibold focus:shadow-lg cursor-pointer"
                  >
                    {isUserPaused ? 'Play scrolling reviews' : 'Pause scrolling reviews'}
                  </button>
                )}

                <div
                  onPointerEnter={() => setIsHovered(true)}
                  onPointerLeave={() => {
                    setIsHovered(false);
                    setHasKeyboardFocusInside(false);
                  }}
                  onFocus={() => {
                    if (lastInputWasKeyboardRef.current) {
                      setHasKeyboardFocusInside(true);
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                      setHasKeyboardFocusInside(false);
                    }
                  }}
                  onTouchStart={() => setIsTouching(true)}
                  onTouchEnd={() => setIsTouching(false)}
                  onTouchCancel={() => setIsTouching(false)}
                  className={`reviews-v-wrap h-full ${
                    shouldLoopDesktop
                      ? 'overflow-hidden'
                      : rightPool.length <= 2
                        ? 'overflow-visible flex flex-col gap-[26px]'
                        : 'overflow-y-auto pr-1 space-y-[26px]'
                  }`}
                  style={
                    shouldLoopDesktop
                      ? {
                          maskImage:
                            'linear-gradient(to bottom, transparent 0px, #000 24px, #000 calc(100% - 24px), transparent 100%)',
                          WebkitMaskImage:
                            'linear-gradient(to bottom, transparent 0px, #000 24px, #000 calc(100% - 24px), transparent 100%)',
                        }
                      : undefined
                  }
                >
                  {shouldLoopDesktop ? (
                    <div
                      className="reviews-v-track flex flex-col"
                      style={
                        {
                          '--reviews-v-duration': `${verticalDurationSec}s`,
                          animationPlayState: isVerticalPaused ? 'paused' : 'running',
                        } as React.CSSProperties
                      }
                    >
                      {/* Set 1 (Interactive & Screen-Reader Accessible) */}
                      <div ref={set1Ref} className="flex flex-col gap-[26px] pb-[26px] shrink-0">
                        {rightPool.map((item) => (
                          <RightReviewCard
                            key={item.id}
                            item={item}
                            responsiveCardClass="h-[317px]"
                            onReadMore={(e) => handleOpenModal(item, e)}
                          />
                        ))}
                      </div>

                      {/* Set 2 (Duplicate for Seamless Loop — aria-hidden, inert, alt="") */}
                      <div
                        ref={duplicateSetRef}
                        aria-hidden="true"
                        className="flex flex-col gap-[26px] pb-[26px] shrink-0"
                      >
                        {rightPool.map((item) => (
                          <RightReviewCard
                            key={`${item.id}-dup`}
                            item={item}
                            isDuplicate
                            responsiveCardClass="h-[317px]"
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    rightPool.map((item) => (
                      <RightReviewCard
                        key={item.id}
                        item={item}
                        responsiveCardClass="h-[317px] shrink-0"
                        onReadMore={(e) => handleOpenModal(item, e)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Tablet & Mobile Horizontal Scroll-Snap Row (< 1100px) */}
              <div className="min-[1100px]:hidden flex gap-4 sm:gap-[26px] overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar">
                {rightPool.map((item) => (
                  <RightReviewCard
                    key={item.id}
                    item={item}
                    responsiveCardClass="w-[calc(100%-20px)] sm:w-[390px] shrink-0 snap-center min-h-[268px]"
                    onReadMore={(e) => handleOpenModal(item, e)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note Under Grid (Hidden if Empty) */}
        {proofNote && (
          <p className="mt-7 text-center text-[13.5px] text-[#5E6A6F] max-w-[600px] mx-auto">
            {proofNote}
          </p>
        )}
      </div>

      {/* Accessible Dialog Modal for Full Text or Video Review */}
      {modalSlide && (
        <CustomersReviewModal slide={modalSlide} onClose={handleCloseModal} />
      )}
    </section>
  );
}
