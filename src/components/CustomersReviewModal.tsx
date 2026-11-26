import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Star, X } from 'lucide-react';
import { ShimmerImage } from './PremiumPrimitives';
import { getSmallAvatarSrc } from '../lib/images';
import { buildModalPlayEmbedSrc, parseVideoEmbed } from '../lib/videoEmbed';

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
  highlight?: string;
  service?: string;
  isVideo?: boolean;
  videoEmbedUrl?: string;
  videoSrc?: string;
  poster?: string;
  disclosure?: string;
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
            'a[href], button:not([disabled]), iframe, video, [tabindex]:not([tabindex="-1"])'
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

  const parsedVideo = useMemo(() => {
    if (!slide.isVideo || !slide.videoEmbedUrl) return null;
    const parsed = parseVideoEmbed(undefined, slide.videoEmbedUrl);
    if (!parsed.allowed || !parsed.embedSrc) return null;
    return {
      src: buildModalPlayEmbedSrc(parsed.embedSrc, parsed.hostKind, {
        muted: false,
        nocontrols: false,
      }),
      hostKind: parsed.hostKind,
    };
  }, [slide.isVideo, slide.videoEmbedUrl]);

  const avatarSrc = getSmallAvatarSrc(slide.photo);
  const showImg = Boolean(avatarSrc && !imgFailed);
  const roleLocation = [slide.role, slide.location].filter((v) => Boolean(v && v.trim())).join(' · ');

  const modalMarkup = (
    <div
      className="oh-fade-in fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#06251E]/78 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        onClick={(e) => e.stopPropagation()}
        className={`oh-scale-in relative w-full max-h-[86vh] overflow-y-auto bg-white text-[#0B1B22] rounded-[32px] p-6 sm:p-8 shadow-[var(--e3)] border border-[rgba(11,27,34,0.1)] ${
          slide.isVideo ? 'max-w-[600px]' : 'max-w-[600px]'
        }`}
      >
        <button
          ref={closeModalButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#F8F3EE] hover:bg-[#DDF4EA] text-[#0B1B22] flex items-center justify-center transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={1.75} />
        </button>

        {/* Reviewer Header */}
        <div className="flex items-center gap-3.5 pr-10 mb-5">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-[#06251E] to-[#14735A] flex items-center justify-center">
            {showImg ? (
              <ShimmerImage
                src={avatarSrc}
                alt={slide.fullName}
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
                className="font-heading font-bold tracking-tight text-[#A8EBD3] select-none text-lg"
              >
                {getInitials(slide.fullName)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3
              id="review-modal-title"
              className="font-heading text-[20px] sm:text-[22px] font-semibold leading-snug text-[#0B1B22]"
            >
              {slide.fullName}
            </h3>
            {roleLocation && (
              <p className="text-[15px] text-[#5E6A6F] leading-snug">{roleLocation}</p>
            )}
          </div>
        </div>

        {/* Optional Highlight or Worked-on Chip (only if non-empty) */}
        {(slide.highlight?.trim() || slide.service?.trim()) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {slide.highlight?.trim() && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#DDF4EA] text-[#06251E] text-[13px] font-medium">
                {slide.highlight.trim()}
              </span>
            )}
            {slide.service?.trim() && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#F8F3EE] text-[#0B1B22] text-[13px] font-medium">
                Worked on: {slide.service.trim()}
              </span>
            )}
          </div>
        )}

        {/* Video Player (iframe or local video mounted ONLY when dialog is open) */}
        {slide.isVideo ? (
          <div className="mb-5">
            {parsedVideo ? (
              <div className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-[#06251E]">
                <iframe
                  title={`Client video review from ${slide.fullName}`}
                  src={parsedVideo.src}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            ) : slide.videoSrc ? (
              <div className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-[#06251E]">
                <video
                  src={slide.videoSrc}
                  poster={slide.poster}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-[#06251E]"
                />
              </div>
            ) : null}
            {slide.text && (
              <p className="mt-4 text-[16px] leading-relaxed text-[#475754]">{slide.text}</p>
            )}
            {slide.disclosure && (
              <p className="mt-2 text-[12px] text-[#5E6A6F]">{slide.disclosure}</p>
            )}
          </div>
        ) : (
          <blockquote className="font-heading text-[20px] sm:text-[23px] font-normal leading-[1.38] text-[#0B1B22] whitespace-pre-line mb-6">
            &ldquo;{slide.text}&rdquo;
          </blockquote>
        )}

        {/* Footer Metadata */}
        <div className="pt-4 border-t border-[rgba(11,27,34,0.1)] flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#5E6A6F]">
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
                      ? 'text-[#FF5A1F] fill-[#FF5A1F]'
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
                <span>{slide.sourceLabel || 'Source'}</span>
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            ) : (
              slide.sourceLabel && (
                <span className="font-semibold text-[#0B1B22]">{slide.sourceLabel}</span>
              )
            )}
            {slide.date && (
              <span className="tabular-nums text-[#5E6A6F]">{slide.date}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalMarkup, document.body);
}
