import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Star, X } from 'lucide-react';
import { ShimmerImage } from './PremiumPrimitives';
import { getSmallAvatarSrc } from '../lib/images';

export interface CustomerReviewModalSlide {
  id: string;
  fullName: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  photo: string;
  sourceLabel: string;
  sourceUrl: string;
  date: string;
}

interface CustomersReviewModalProps {
  slide: CustomerReviewModalSlide;
  onClose: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'OH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function CustomersReviewModal({ slide, onClose }: CustomersReviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeModalButtonRef = useRef<HTMLButtonElement>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [slide.photo]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeModalButtonRef.current?.focus();
    }, 10);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
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
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const avatarSrc = getSmallAvatarSrc(slide.photo);
  const showImg = Boolean(avatarSrc && !imgFailed);

  return (
    <div
      className="oh-fade-in fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1B22]/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="oh-scale-in relative w-full max-w-[580px] max-h-[85vh] overflow-y-auto bg-white text-[#0B1B22] rounded-[28px] p-6 sm:p-8 shadow-[var(--e3)] border border-[rgba(11,27,34,0.12)]"
      >
        <button
          ref={closeModalButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close full review"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F3F5F3] hover:bg-[#DDF4EA] text-[#0B1B22] flex items-center justify-center transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-3.5 pr-10 mb-5">
          <div className="w-14 h-14 rounded-[16px] overflow-hidden shrink-0 bg-gradient-to-br from-[#0A3A30] to-[#050E0D] flex items-center justify-center">
            {showImg ? (
              <ShimmerImage
                src={avatarSrc}
                alt={slide.fullName}
                width={56}
                height={56}
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
                className="font-heading font-bold tracking-tight text-[#A8EBD3] select-none text-lg"
              >
                {getInitials(slide.fullName)}
              </span>
            )}
          </div>
          <div>
            <h3
              id="review-modal-title"
              className="font-heading text-[20px] sm:text-[22px] font-semibold leading-snug text-[#0B1B22]"
            >
              {slide.fullName}
            </h3>
            {(slide.role || slide.location) && (
              <p className="text-[13px] text-[#475754]">
                {[slide.role, slide.location].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>

        <blockquote className="font-serif text-[20px] sm:text-[23px] leading-[1.35] text-[#0B1B22] whitespace-pre-line mb-6">
          &ldquo;{slide.text}&rdquo;
        </blockquote>

        <div className="pt-4 border-t border-[rgba(11,27,34,0.1)] flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-[#475754]">
          {slide.rating > 0 ? (
            <div
              className="flex items-center gap-0.5 tabular-nums"
              role="img"
              aria-label={`Rated ${slide.rating} out of 5`}
            >
              {Array.from({ length: 5 }).map((_, starIdx) => (
                <Star
                  key={starIdx}
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className={`w-4 h-4 ${
                    starIdx < slide.rating
                      ? 'text-[#D99B26] fill-[#D99B26]'
                      : 'text-[rgba(11,27,34,0.2)]'
                  }`}
                />
              ))}
            </div>
          ) : (
            <span className="font-medium">Client feedback</span>
          )}

          <div className="flex items-center gap-2.5">
            {slide.sourceUrl ? (
              <a
                href={slide.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="oh-link-sweep inline-flex items-center gap-1 font-semibold text-[#0B1B22] hover:text-[#14624F] rounded-xs"
              >
                <span>{slide.sourceLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            ) : (
              slide.sourceLabel && (
                <span className="font-semibold text-[#0B1B22]">{slide.sourceLabel}</span>
              )
            )}
            {slide.date && (
              <span className="tabular-nums text-[#475754]">{slide.date}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
