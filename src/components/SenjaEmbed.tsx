import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, ExternalLink, ShieldCheck } from 'lucide-react';
import Container from './Container';
import Accent from './Accent';
import { config, TestimonialItem } from '../config';
import { REVIEWS_DISCLOSURE } from '../content';

interface ReviewsCarouselProps {
  onOpenPrivacy?: () => void;
}

export default function SenjaEmbed({ onOpenPrivacy }: ReviewsCarouselProps) {
  const testimonials = config.testimonials || [];
  const count = testimonials.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (count > 0 ? (prev + 1) % count : 0));
  }, [count]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (count > 0 ? (prev - 1 + count) % count : 0));
  }, [count]);

  // Auto-slide every 3.8s (slightly faster), paused on hover/focus or reduced-motion
  useEffect(() => {
    if (count <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 3800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count, isPaused, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      const minSwipeDistance = 50;
      if (distance > minSwipeDistance) {
        nextSlide();
      } else if (distance < -minSwipeDistance) {
        prevSlide();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setIsPaused(false);
  };

  if (count === 0) {
    return null;
  }

  // Calculate circular offset distance (-3 .. 0 .. +3)
  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    // Circular wrap
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  return (
    <section
      id="reviews"
      aria-label="What past clients say"
      className="w-full bg-white py-20 sm:py-28 md:py-32 scroll-mt-24 select-none relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3F4] border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-semibold text-[#1E4A5C]">
            <Quote className="w-3.5 h-3.5 text-[#1E4A5C]" />
            <span>Kind words</span>
          </div>

          <h2 className="text-[clamp(32px,4.4vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-3xl mb-4">
            What past clients <Accent>say</Accent>
          </h2>

          <p className="text-[17px] sm:text-[19px] text-[#5E6F77] max-w-xl mx-auto font-normal">
            Reviews from past clients.
          </p>
        </div>

        {/* 1. Avatars Row */}
        <div className="w-full max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 md:gap-5">
            {testimonials.map((item, idx) => {
              const offset = Math.abs(getOffset(idx));
              const isActive = idx === activeIndex;

              // Size & opacity grading
              // Center: w-16 h-16 sm:w-20 sm:h-20, border-2 border-[#1E4A5C], glow
              // Immediate neighbor (offset 1): w-12 h-12 sm:w-14 sm:h-14, opacity-75
              // Outer (offset >= 2): w-10 h-10 sm:w-11 sm:h-11, opacity-45
              let sizeClasses = 'w-9 h-9 sm:w-11 sm:h-11 opacity-40 scale-90';
              let borderClasses = 'border border-[rgba(15,42,53,0.15)]';

              if (isActive) {
                sizeClasses = 'w-16 h-16 sm:w-20 sm:h-20 opacity-100 scale-100 z-10 shadow-lg';
                borderClasses = 'ring-3 ring-[#1E4A5C] ring-offset-2 ring-offset-white border-2 border-white';
              } else if (offset === 1) {
                sizeClasses = 'w-11 h-11 sm:w-13 sm:h-13 opacity-75 scale-95';
                borderClasses = 'border-2 border-[rgba(15,42,53,0.2)] hover:opacity-100';
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show review from ${item.fullName}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group relative rounded-full overflow-hidden transition-all duration-400 ease-out flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] ${sizeClasses} ${borderClasses}`}
                >
                  <img
                    src={item.photo}
                    alt={item.fullName}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback initials if remote image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Subtle highlight ring on hover */}
                  <span className="absolute inset-0 rounded-full transition-colors group-hover:bg-[#1E4A5C]/10" />
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Review Cards Carousel */}
        <div
          className="relative w-full max-w-5xl mx-auto px-2 sm:px-6"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card Frame Window with increased height for full glanceability */}
          <div className="relative h-[500px] sm:h-[520px] flex items-center justify-center">
            {testimonials.map((item, idx) => {
              const offset = getOffset(idx);
              const isActive = idx === activeIndex;
              const isPrev = offset === -1 || (offset === count - 1 && count > 2);
              const isNext = offset === 1 || (offset === -(count - 1) && count > 2);
              const isVisible = isActive || isPrev || isNext;

              if (!isVisible) return null;

              // Position & scale classes based on offset
              // Reduced card width & shifted side cards so next and prev reviews are clearly visible
              let transformStyles: React.CSSProperties = {
                transform: 'translate3d(0, 0, 0) scale(1)',
                opacity: 1,
                zIndex: 20,
                pointerEvents: 'auto',
              };

              if (isPrev) {
                transformStyles = {
                  transform: 'translate3d(-62%, 0, 0) scale(0.92)',
                  opacity: 0.55,
                  zIndex: 10,
                  pointerEvents: 'auto',
                };
              } else if (isNext) {
                transformStyles = {
                  transform: 'translate3d(62%, 0, 0) scale(0.92)',
                  opacity: 0.55,
                  zIndex: 10,
                  pointerEvents: 'auto',
                };
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isPrev) prevSlide();
                    if (isNext) nextSlide();
                  }}
                  style={transformStyles}
                  className={`absolute top-0 w-[92vw] max-w-[440px] h-[480px] sm:h-[500px] transition-all duration-350 ease-out ${
                    !isActive
                      ? 'cursor-pointer hidden sm:block hover:opacity-85'
                      : ''
                  }`}
                  aria-hidden={!isActive}
                >
                  <article
                    className={`w-full h-full rounded-[28px] bg-white border border-[rgba(15,42,53,0.1)] p-6 sm:p-7 flex flex-col justify-between transition-shadow duration-300 ${
                      isActive
                        ? 'shadow-[0_20px_50px_rgba(15,42,53,0.12),0_4px_16px_rgba(15,42,53,0.06)] ring-1 ring-[rgba(15,42,53,0.05)]'
                        : 'shadow-md hover:shadow-lg'
                    }`}
                  >
                    {/* Top Row: Stars rating + Source badge */}
                    <div className="flex items-center justify-between gap-4 pb-3 border-b border-[rgba(15,42,53,0.06)] flex-shrink-0">
                      {/* Star Rating */}
                      <div className="flex items-center gap-1" aria-label={`Rating: ${item.rating || 5} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, starIdx) => {
                          const isFilled = starIdx < (item.rating > 0 ? item.rating : 5);
                          return (
                            <Star
                              key={starIdx}
                              className={`w-4 h-4 ${
                                isFilled
                                  ? 'text-[#E07A5F] fill-[#E07A5F]'
                                  : 'text-gray-300 fill-transparent'
                              }`}
                            />
                          );
                        })}
                        <span className="text-xs font-semibold text-[#0F2A35] ml-1.5">
                          {item.rating > 0 ? `${item.rating}.0` : '5.0'}
                        </span>
                      </div>

                      {/* Verified Source Pill */}
                      {item.sourceUrl ? (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs text-[#5E6F77] hover:text-[#1E4A5C] transition-colors"
                          title="Verified customer review on Senja"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#1E4A5C]" />
                          <span>Verified {item.sourceLabel || 'review'}</span>
                          <ExternalLink className="w-3 h-3 text-[#5E6F77]" />
                        </a>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-xs text-[#5E6F77]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#1E4A5C]" />
                          <span>Verified client</span>
                        </div>
                      )}
                    </div>

                    {/* Review Text - Full review visible at a glance */}
                    <div className="flex-1 flex flex-col justify-center my-3 overflow-y-auto pr-1">
                      <blockquote className="text-[14px] sm:text-[15px] leading-[1.65] text-[#243E48] font-normal whitespace-pre-line">
                        “{item.text}”
                      </blockquote>
                    </div>

                    {/* Reviewer Details Row */}
                    <div className="flex items-center justify-between gap-4 pt-3.5 border-t border-[rgba(15,42,53,0.06)] flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.photo}
                          alt={item.fullName}
                          loading="lazy"
                          className="w-10 h-10 rounded-full object-cover border border-[rgba(15,42,53,0.12)] shadow-xs flex-shrink-0"
                        />
                        <div className="text-left min-w-0">
                          <p className="text-[14px] font-semibold text-[#0F2A35] leading-snug truncate">
                            {item.fullName}
                          </p>
                          <p className="text-xs text-[#5E6F77] leading-tight truncate">
                            {item.role}
                            {item.location ? ` · ${item.location}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      {item.date && (
                        <span className="text-[11px] font-mono text-[#8C9BA2] flex-shrink-0">
                          {item.date}
                        </span>
                      )}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls: Prev / Next buttons & Dots */}
          <div className="flex items-center justify-between mt-8 pt-4 max-w-[440px] mx-auto">
            {/* Prev Button */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous review"
              className="w-11 h-11 rounded-full bg-white border border-[rgba(15,42,53,0.12)] hover:border-[#1E4A5C] hover:bg-[#EEF3F4] text-[#0F2A35] flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C]"
            >
              <ChevronLeft className="w-5 h-5 text-[#0F2A35]" />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Review selector">
              {testimonials.map((_, dotIdx) => {
                const isCurrent = dotIdx === activeIndex;
                return (
                  <button
                    key={dotIdx}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`Go to review ${dotIdx + 1}`}
                    onClick={() => setActiveIndex(dotIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isCurrent
                        ? 'w-7 bg-[#1E4A5C]'
                        : 'w-2 bg-[rgba(15,42,53,0.2)] hover:bg-[rgba(15,42,53,0.4)]'
                    }`}
                  />
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next review"
              className="w-11 h-11 rounded-full bg-white border border-[rgba(15,42,53,0.12)] hover:border-[#1E4A5C] hover:bg-[#EEF3F4] text-[#0F2A35] flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C]"
            >
              <ChevronRight className="w-5 h-5 text-[#0F2A35]" />
            </button>
          </div>
        </div>

        {/* Reviews disclosure / honesty note */}
        {typeof REVIEWS_DISCLOSURE === 'string' && REVIEWS_DISCLOSURE.trim().length > 0 && (
          <p className="text-[13px] text-[#5E6F77] text-center mt-8 max-w-xl mx-auto font-normal">
            {REVIEWS_DISCLOSURE.trim()}
          </p>
        )}
      </Container>
    </section>
  );
}
