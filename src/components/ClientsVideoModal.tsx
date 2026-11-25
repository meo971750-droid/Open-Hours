import React, { useEffect, useRef } from 'react';
import { ExternalLink, Star, X } from 'lucide-react';

export interface ClientsVideoModalItem {
  name: string;
  role: string;
  location?: string;
  rating?: number;
  sourceLabel?: string;
  sourceUrl?: string;
  date?: string;
  videoSrc?: string;
  videoEmbedUrl?: string;
  poster?: string;
  image?: string;
  quote?: string;
}

interface ClientsVideoModalProps {
  item: ClientsVideoModalItem;
  onClose: () => void;
}

function buildEmbedUrl(baseUrl: string, params: Record<string, string>): string {
  const query = new URLSearchParams(params).toString();
  if (baseUrl.endsWith('?') || baseUrl.endsWith('&')) {
    return `${baseUrl}${query}`;
  }
  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${query}`;
}

export default function ClientsVideoModal({ item, onClose }: ClientsVideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus(), 10);

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
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const modalRoleLocation = [item.role, item.location]
    .filter((v) => Boolean(v && v.trim()))
    .join(' · ');

  return (
    <div
      className="oh-fade-in fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#050E0D]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Client review from ${item.name}`}
        onClick={(e) => e.stopPropagation()}
        className="oh-scale-in oh-dark-card relative w-full max-w-[460px] max-h-[90vh] overflow-y-auto text-white rounded-[28px] shadow-2xl"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#050E0D]/80 text-white flex items-center justify-center hover:bg-[#14624F] active:scale-[0.98] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {(item.videoEmbedUrl || item.videoSrc) && (
          <div className="bg-[#050E0D]">
            {item.videoEmbedUrl ? (
              <div className="relative w-full h-0 pb-[125%] max-h-[60vh] bg-black overflow-hidden">
                <iframe
                  title={`Client video review from ${item.name}`}
                  src={buildEmbedUrl(item.videoEmbedUrl, { autoplay: '1' })}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0 overflow-hidden"
                />
              </div>
            ) : (
              <div className="relative bg-black flex items-center justify-center">
                <video
                  src={item.videoSrc}
                  poster={item.poster || item.image}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[50vh] aspect-[4/5] object-contain bg-black"
                />
              </div>
            )}
            <div className="p-5 sm:p-6 text-left border-t border-white/10">
              <h3 className="font-heading text-xl font-bold text-white mb-1">{item.name}</h3>
              {modalRoleLocation && (
                <div className="text-xs text-[#A8EBD3] mb-2">{modalRoleLocation}</div>
              )}
              {item.quote && (
                <p className="text-white/85 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line max-h-[140px] overflow-y-auto mb-3">
                  {item.quote}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-white/75 pt-2.5 border-t border-white/10">
                {typeof item.rating === 'number' && item.rating > 0 && (
                  <div
                    className="flex items-center gap-0.5 tabular-nums"
                    role="img"
                    aria-label={`Rated ${item.rating} out of 5`}
                  >
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className={`w-3.5 h-3.5 ${
                          starIdx < (item.rating || 0)
                            ? 'text-[#D99B26] fill-[#D99B26]'
                            : 'text-white/25'
                        }`}
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  {item.sourceUrl ? (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-[#A8EBD3] hover:underline"
                    >
                      <span>{item.sourceLabel || 'Source'}</span>
                      <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                    </a>
                  ) : (
                    item.sourceLabel && <span>{item.sourceLabel}</span>
                  )}
                  {item.date && (
                    <span className="tabular-nums text-white/60">{item.date}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
