import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { WorkItemConfig } from '../config';
import { getResponsiveImageProps } from '../lib/images';
import { buildModalPlayEmbedSrc, ParsedVideoEmbed } from '../lib/videoEmbed';

export interface OurWorkModalData {
  item: WorkItemConfig;
  parsed: ParsedVideoEmbed;
  posterUrl: string | null;
}

interface OurWorkModalProps {
  data: OurWorkModalData;
  playKey: number;
  onClose: () => void;
}

export default function OurWorkModal({ data, playKey, onClose }: OurWorkModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIframeLoaded(false);
  }, [data.item.id, playKey]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
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
            'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
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
    };
  }, [onClose]);

  const posterProps = data.posterUrl
    ? getResponsiveImageProps(data.posterUrl, [640, 960, 1280], '94vw', 'good')
    : null;

  return (
    <div
      className="oh-fade-in fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-[#050E0D]/80"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={data.item.title}
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(1120px, 94vw)' }}
        className="oh-scale-in relative max-h-[92vh] bg-black rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[var(--e3)] border border-white/15"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 rounded-full bg-black/75 border border-white/20 hover:bg-[#14624F] active:scale-[0.98] text-white flex items-center justify-center transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" strokeWidth={1.75} />
        </button>

        {/* Aspect-matched Player Container: autoplay from start, muted by default, no sound controls */}
        <div
          style={{ paddingBottom: data.item.aspectPaddingBottom || '52.812%' }}
          className="relative w-full h-0 overflow-hidden bg-black"
        >
          {posterProps && (
            <img
              src={posterProps.src}
              srcSet={posterProps.srcSet}
              sizes={posterProps.sizes}
              alt={data.item.title}
              width={1280}
              height={676}
              decoding="async"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {data.parsed.allowed && data.parsed.embedSrc ? (
            <>
              {!iframeLoaded && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/45"
                >
                  <div className="w-9 h-9 rounded-full border-[3px] border-[#A8EBD3]/35 border-t-[#3FD1A5] animate-spin" />
                </div>
              )}
              <iframe
                key={`${data.item.id}-${playKey}`}
                title={data.item.title}
                src={buildModalPlayEmbedSrc(data.parsed.embedSrc, data.parsed.hostKind, {
                  muted: true,
                  nocontrols: true,
                })}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setIframeLoaded(true)}
                className={`absolute inset-0 z-20 w-full h-full border-0 transition-opacity duration-200 ${
                  iframeLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          ) : (
            <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 z-10 flex items-center justify-between gap-3 rounded-xl bg-[#072A24]/90 px-3.5 py-2 text-[12px] text-white/90 border border-white/15">
              <span>
                Embedded video playback requires YouTube, Vimeo, Loom, Wistia, Bunny Stream, Cloudflare Stream, or Streamable.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
