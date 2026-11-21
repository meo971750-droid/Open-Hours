import React, { useEffect, useRef, useState } from 'react';
import { config, TestimonialItem } from '../config';
import { ShimmerImage, Tilt3D } from '../components/PremiumPrimitives';
import { getResponsiveImageProps } from '../lib/images';
import { mountHeroCloth } from '../lib/heroClothShader';

interface HeroGrewProps {
  onOpenAudit: (email?: string, trade?: string) => void;
  onOpenPrivacy?: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'OH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Small green-palette source mark (14px) */
function ReviewSourceIcon({ sourceLabel }: { sourceLabel?: string }) {
  const lower = (sourceLabel || '').toLowerCase();
  if (lower.includes('google')) {
    return (
      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] shrink-0" aria-hidden="true">
        <path
          d="M12 2.5c-4.14 0-7.5 3.36-7.5 7.5 0 5.38 7.5 11.5 7.5 11.5s7.5-6.12 7.5-11.5c0-4.14-3.36-7.5-7.5-7.5Zm0 10.25a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5Z"
          fill="#14624F"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] shrink-0" aria-hidden="true">
      <path
        d="M12 2.6 14.7 8.1l6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 2.6Z"
        fill="#1E9E6A"
      />
    </svg>
  );
}

/** Google Business Profile circular mini-badge (36px) */
function GoogleProfileBadge() {
  return (
    <span
      className="w-9 h-9 rounded-full ring-2 ring-white bg-[#0F4A3E] text-white shadow-[0_2px_6px_rgba(11,27,34,0.16)] flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M4 9l1.5-4h13L20 9" />
        <path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 6 0" />
        <path d="M6 12v7h12v-7" />
      </svg>
    </span>
  );
}

/** WhatsApp circular mini-badge (36px) */
function WhatsAppBadge() {
  return (
    <span
      className="w-9 h-9 rounded-full ring-2 ring-white bg-[#14735A] text-white shadow-[0_2px_6px_rgba(11,27,34,0.16)] flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.2A8 8 0 1 1 20 11.5Z" />
        <path d="M9.6 9.3c.3-.3.7-.3 1 0l.9.9c.2.2.2.6 0 .8l-.5.5c.5.9 1.2 1.6 2.1 2.1l.5-.5c.2-.2.6-.2.8 0l.9.9c.3.3.3.7 0 1-.8.8-2.2.9-3.6.1a9.4 9.4 0 0 1-3.3-3.3c-.8-1.4-.7-2.8 1.2-3.5Z" />
      </svg>
    </span>
  );
}

interface FloatingSlot {
  key: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  positionClass: string;
  sizeClass: string;
  depth: number;
  floatClass: string;
}

// A–F exact layout matching the reference positions and responsive visibility:
// Desktop (>=1200px): 6 cards (A, B, C, D, E, F)
// Tablet (768–1199px): 4 cards (A, D top corners + C, E lower corners)
// Mobile (<768px): 2 cards (A, D top corners behind nav)
const DESKTOP_SLOTS: FloatingSlot[] = [
  {
    key: 'A',
    positionClass: 'left-[4%] top-[14px] md:left-[4%] md:top-[2%] min-[1200px]:left-[18.7%] min-[1200px]:top-[2%]',
    sizeClass: 'w-[70px] h-[70px] md:w-[86px] md:h-[86px] min-[1200px]:w-[clamp(90px,6.6vw,125px)] min-[1200px]:h-[clamp(90px,6.6vw,125px)]',
    depth: 0.4,
    floatClass: 'oh-portrait-drift-0',
  },
  {
    key: 'B',
    positionClass: 'hidden min-[1200px]:block left-[5.6%] top-[23.5%]',
    sizeClass: 'w-[clamp(96px,7.4vw,138px)] h-[clamp(96px,7.4vw,138px)]',
    depth: 0.95,
    floatClass: 'oh-portrait-drift-1',
  },
  {
    key: 'C',
    positionClass: 'hidden md:block md:left-[3.5%] md:bottom-[7%] min-[1200px]:bottom-auto min-[1200px]:left-[12%] min-[1200px]:top-[59%] 2xl:left-[18%] 2xl:top-[55%]',
    sizeClass: 'md:w-[88px] md:h-[88px] min-[1200px]:w-[clamp(100px,7.9vw,150px)] min-[1200px]:h-[clamp(100px,7.9vw,150px)]',
    depth: 0.72,
    floatClass: 'oh-portrait-drift-2',
  },
  {
    key: 'D',
    positionClass: 'right-[4%] top-[12px] md:right-[4%] md:top-[1.5%] min-[1200px]:right-[16.8%] min-[1200px]:top-[1%]',
    sizeClass: 'w-[72px] h-[72px] md:w-[90px] md:h-[90px] min-[1200px]:w-[clamp(100px,7.9vw,150px)] min-[1200px]:h-[clamp(100px,7.9vw,150px)]',
    depth: 0.46,
    floatClass: 'oh-portrait-drift-3',
  },
  {
    key: 'E',
    positionClass: 'hidden md:block md:right-[3.5%] md:bottom-[9%] min-[1200px]:bottom-auto min-[1200px]:right-[4.5%] min-[1200px]:top-[32.7%]',
    sizeClass: 'md:w-[88px] md:h-[88px] min-[1200px]:w-[clamp(130px,10.6vw,200px)] min-[1200px]:h-[clamp(130px,10.6vw,200px)]',
    depth: 1.0,
    floatClass: 'oh-portrait-drift-4',
  },
  {
    key: 'F',
    positionClass: 'hidden min-[1200px]:block right-[15%] top-[61%] 2xl:right-[23.5%] 2xl:top-[57%]',
    sizeClass: 'w-[clamp(90px,6.7vw,126px)] h-[clamp(90px,6.7vw,126px)]',
    depth: 0.65,
    floatClass: 'oh-portrait-drift-5',
  },
];

// Balanced slot subset ordering when fewer than 6 portrait photos exist
const SLOT_ORDER_BY_COUNT: Record<number, number[]> = {
  2: [0, 3],
  3: [0, 3, 1],
  4: [0, 3, 2, 4],
  5: [0, 1, 2, 3, 4],
  6: [0, 1, 2, 3, 4, 5],
};

function renderHeadlineWithAccent(title: string, accentWord?: string) {
  if (!accentWord) return title;
  const idx = title.toLowerCase().indexOf(accentWord.toLowerCase());
  if (idx === -1) return title;
  const before = title.slice(0, idx);
  const match = title.slice(idx, idx + accentWord.length);
  const after = title.slice(idx + accentWord.length);
  return (
    <>
      {before}
      <span className="font-serif italic font-normal text-[#14624F]">{match}</span>
      {after}
    </>
  );
}

export default function HeroGrew({ onOpenAudit }: HeroGrewProps) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clothReady, setClothReady] = useState(false);
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});
  const [failedTrustAvatars, setFailedTrustAvatars] = useState<Record<string, boolean>>({});

  // Initialize raw WebGL cloth shader after first paint
  useEffect(() => {
    const section = heroRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || typeof window === 'undefined') return;

    let cancelled = false;
    let cleanupCloth = () => {};
    let idleKind: 'idle' | 'raf' | null = null;
    let idleId = 0;

    const rafId = window.requestAnimationFrame(() => {
      if (cancelled) return;
      const start = () => {
        if (cancelled) return;
        cleanupCloth = mountHeroCloth({
          section,
          canvas,
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          onFirstFrame: () => {
            if (!cancelled) setClothReady(true);
          },
        });
      };

      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      if (w.requestIdleCallback) {
        idleKind = 'idle';
        idleId = w.requestIdleCallback(start, { timeout: 300 });
      } else {
        idleKind = 'raf';
        idleId = window.requestAnimationFrame(start);
      }
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      const w = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (idleKind === 'idle' && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (idleKind === 'raf') window.cancelAnimationFrame(idleId);
      cleanupCloth();
    };
  }, []);

  // Desktop-only gentle pointer parallax (+/- 6px max), disabled under reduced motion
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine) and (min-width: 1200px)');
    if (reducedMotion.matches || !finePointer.matches) return;

    let rafId = 0;
    let tx = 0;
    let ty = 0;

    const flush = () => {
      rafId = 0;
      el.style.setProperty('--hx', `${tx.toFixed(2)}px`);
      el.style.setProperty('--hy', `${ty.toFixed(2)}px`);
    };

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      tx = Math.max(-6, Math.min(6, nx * 6));
      ty = Math.max(-6, Math.min(6, ny * 6));
      if (!rafId) rafId = window.requestAnimationFrame(flush);
    };

    const handleLeave = () => {
      tx = 0;
      ty = 0;
      if (!rafId) rafId = window.requestAnimationFrame(flush);
    };

    el.addEventListener('pointermove', handleMove, { passive: true });
    el.addEventListener('pointerleave', handleLeave);
    return () => {
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerleave', handleLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToReviews = (e?: React.MouseEvent, clientId?: string) => {
    if (e) e.preventDefault();
    const specificTarget = clientId ? document.getElementById(`review-${clientId}`) : null;
    const target = specificTarget || document.getElementById('reviews') || document.getElementById('proof');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenAudit();
    }
  };

  // Real client photos from config.testimonials
  const clientsWithPhotos: TestimonialItem[] = (config.testimonials || []).filter(
    (item) => Boolean(item.photo && item.photo.trim())
  );

  // Up to 6 trust-pill circular avatars
  const trustAvatars = clientsWithPhotos
    .filter((c) => !failedTrustAvatars[c.id])
    .slice(0, 6);

  // Portrait cards: only clients with photos, max 6, balanced slots if fewer than 6 (min 2)
  const cardCount = Math.min(6, clientsWithPhotos.length);
  const slotIndices = cardCount >= 2 ? SLOT_ORDER_BY_COUNT[cardCount] || [0, 1, 2, 3, 4, 5] : [];
  const floatingEntries = slotIndices.map((slotIndex, i) => ({
    slot: DESKTOP_SLOTS[slotIndex],
    client: clientsWithPhotos[i],
    orderIndex: i,
  }));

  const usesGbp = Boolean(config.features?.googleBusinessProfile);
  const usesWhatsapp =
    Boolean(config.whatsapp && config.whatsapp.trim()) ||
    Boolean(config.socials?.whatsapp && config.socials.whatsapp.trim()) ||
    Boolean(config.heroTools?.some((t) => t.id === 'whatsapp'));

  const heroTitle = config.hero?.title || "The website that answers while you're on the job";
  const heroAccent = config.hero?.accentWord || 'answers';
  const heroSubtitle =
    config.hero?.subtitle ||
    "Your website replies to quote requests, texts back missed calls and tracks incoming enquiries, so nothing slips while you're on the job.";
  const heroCtaLabel = config.hero?.ctaLabel || 'Talk to Us';
  const proofLine1 = config.heroProof?.line1 || 'Trusted by Professionals Like You';
  const proofLine2 = (config.heroProof?.line2 || '').trim();
  const photoNote = (config.heroProof?.photoNote || '').trim();

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Introduction"
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#EDF3F0] text-[#0B1B22]"
      style={{ '--hx': '0px', '--hy': '0px' } as React.CSSProperties}
    >
      {/* 1. SILK BACKGROUND: Base #EDF3F0 + 6 Pre-Softened Elongated Radial Silk Waves + 5% Tiled SVG Grain */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        {/* Wave 1: Top-left mint fold (-25deg) */}
        <div
          className="oh-silk-drift-a absolute -top-[28%] -left-[18%] w-[82vw] max-w-[1300px] h-[52vh] min-h-[420px] opacity-[0.75]"
          style={{
            background:
              'radial-gradient(ellipse 68% 48% at 50% 50%, #DDF4EA 0%, rgba(168, 235, 211, 0.52) 48%, rgba(237, 243, 240, 0) 76%)',
          }}
        />
        {/* Wave 2: Top-right sage-teal fold (+24deg) */}
        <div
          className="oh-silk-drift-b absolute -top-[22%] -right-[16%] w-[78vw] max-w-[1250px] h-[58vh] min-h-[460px] opacity-[0.72]"
          style={{
            background:
              'radial-gradient(ellipse 70% 45% at 50% 50%, #A8EBD3 0%, rgba(221, 244, 234, 0.56) 52%, rgba(237, 243, 240, 0) 78%)',
          }}
        />
        {/* Wave 3: Mid-left diagonal silk fold (-22deg) */}
        <div
          className="oh-silk-drift-c absolute top-[20%] -left-[22%] w-[74vw] max-w-[1150px] h-[48vh] min-h-[380px] opacity-[0.62]"
          style={{
            background:
              'radial-gradient(ellipse 72% 42% at 50% 50%, #DDF4EA 0%, rgba(168, 235, 211, 0.42) 55%, rgba(237, 243, 240, 0) 78%)',
          }}
        />
        {/* Wave 4: Mid-right diagonal silk fold (+25deg) */}
        <div
          className="oh-silk-drift-d absolute top-[28%] -right-[20%] w-[76vw] max-w-[1200px] h-[54vh] min-h-[420px] opacity-[0.65]"
          style={{
            background:
              'radial-gradient(ellipse 66% 44% at 50% 50%, #A8EBD3 0%, rgba(221, 244, 234, 0.48) 54%, rgba(237, 243, 240, 0) 78%)',
          }}
        />
        {/* Wave 5: Lower diagonal mint-sage fold (-25deg) */}
        <div
          className="oh-silk-drift-a absolute -bottom-[26%] left-[4%] w-[86vw] max-w-[1380px] h-[50vh] min-h-[400px] opacity-[0.68]"
          style={{
            background:
              'radial-gradient(ellipse 70% 48% at 50% 50%, rgba(111, 214, 176, 0.32) 0%, rgba(168, 235, 211, 0.54) 46%, rgba(237, 243, 240, 0) 78%)',
          }}
        />
        {/* Wave 6: Bottom deep green soft ambient glow */}
        <div
          className="oh-silk-drift-b absolute -bottom-[18%] left-1/2 -translate-x-1/2 w-[115vw] max-w-[1800px] h-[44vh] min-h-[340px] opacity-[0.8]"
          style={{
            background:
              'radial-gradient(ellipse 64% 62% at 50% 88%, rgba(63, 209, 165, 0.32) 0%, rgba(168, 235, 211, 0.38) 46%, rgba(237, 243, 240, 0) 78%)',
          }}
        />
        {/* Tiny Tiled SVG Noise Grain Layer (~5% opacity, no SVG <filter>) */}
        <div className="absolute inset-0 oh-silk-noise" />
      </div>

      {/* Interactive WebGL Satin Cloth Shader (fades in 400ms after first frame, CSS placeholder underneath) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 w-full h-full z-0 transition-opacity duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          clothReady ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 4. FLOATING PORTRAIT CARDS (6 Desktop, 4 Tablet, 2 Mobile; Cards A & D partly behind top glass nav) */}
      {floatingEntries.map(({ slot, client, orderIndex }) => {
        const photoMissing = failedPhotos[client.id];
        const hasRating = typeof client.rating === 'number' && client.rating > 0;
        return (
          <div
            key={`${slot.key}-${client.id}`}
            className={`absolute z-10 ${slot.positionClass} oh-hero-enter oh-hero-delay-card-${orderIndex}`}
          >
            {/* Outer desktop pointer parallax wrapper */}
            <div
              style={{
                transform: `translate3d(calc(var(--hx, 0px) * ${slot.depth}), calc(var(--hy, 0px) * ${slot.depth}), 0)`,
                willChange: 'transform',
              }}
            >
              {/* Inner autonomous vertical drift wrapper */}
              <div className={slot.floatClass}>
                <Tilt3D maxDeg={4}>
                  <button
                    type="button"
                    onClick={() => scrollToReviews(undefined, client.id)}
                    aria-label={`Read feedback from ${client.fullName}${client.role ? `, ${client.role}` : ''}`}
                    className="group flex flex-col items-center text-left transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 active:scale-[0.98] cursor-pointer rounded-[24px]"
                  >
                    {/* Square 24px-radius portrait card */}
                    <div
                      className={`${slot.sizeClass} rounded-[18px] min-[1200px]:rounded-[24px] overflow-hidden bg-[#DDF4EA] shadow-[0_18px_40px_-12px_rgba(11,27,34,0.18)] border border-white/80 flex items-center justify-center`}
                    >
                      {!photoMissing ? (
                        <ShimmerImage
                          {...getResponsiveImageProps(
                            client.photo,
                            [160, 280, 400],
                            '(max-width: 767px) 72px, 160px'
                          )}
                          alt={client.fullName}
                          width={150}
                          height={150}
                          loading="eager"
                          decoding="sync"
                          fetchPriority="high"
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedPhotos((prev) => ({ ...prev, [client.id]: true }))
                          }
                          wrapperClassName="relative w-full h-full"
                          className="w-full h-full object-cover object-top block transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="font-heading font-bold text-lg sm:text-2xl text-[#14624F]"
                        >
                          {getInitials(client.fullName)}
                        </span>
                      )}
                    </div>

                    {/* Two small white badge pills underneath (radius 8px, h-22px, 11-12px text, 6px gap) */}
                    <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center justify-center gap-[6px] max-w-[230px]">
                      {hasRating && (
                        <span className="h-[22px] px-2 rounded-[8px] bg-white shadow-[0_4px_12px_rgba(11,27,34,0.08)] inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-medium text-[#0B1B22] whitespace-nowrap leading-none">
                          <ReviewSourceIcon sourceLabel={client.sourceLabel} />
                          <span className="tabular-nums">{client.rating.toFixed(1)}</span>
                        </span>
                      )}
                      {client.role && (
                        <span className="h-[22px] px-2 rounded-[8px] bg-white shadow-[0_4px_12px_rgba(11,27,34,0.08)] inline-flex items-center text-[11px] sm:text-[12px] font-medium text-[#0B1B22] whitespace-nowrap leading-none">
                          {client.role}
                        </span>
                      )}
                    </div>
                  </button>
                </Tilt3D>
              </div>
            </div>
          </div>
        );
      })}

      {/* 3, 5, 6. VERTICALLY CENTRED HERO STACK */}
      <div className="relative z-20 w-full max-w-[1040px] mx-auto px-4 sm:px-6 pt-36 pb-16 sm:pt-40 sm:pb-20 lg:pt-28 lg:pb-16 flex flex-col items-center text-center">
        {/* 3. TRUST PILL (top centre, below nav pill) */}
        <a
          href="#reviews"
          onClick={(e) => scrollToReviews(e)}
          className={`oh-hero-enter oh-hero-delay-pill min-h-[58px] py-2 ${trustAvatars.length > 0 ? 'pl-2.5 pr-5' : 'px-6'} bg-white/95 hover:bg-white rounded-full shadow-[0_10px_28px_-10px_rgba(11,27,34,0.12)] border border-white inline-flex items-center gap-3 mb-7 sm:mb-9 transition-[transform,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer`}
        >
          {trustAvatars.length > 0 && (
            <span className="flex items-center -space-x-2.5 shrink-0">
              {trustAvatars.map((avatar) => (
                <img
                  key={avatar.id}
                  {...getResponsiveImageProps(avatar.photo, [72, 144], '36px')}
                  alt={avatar.fullName}
                  width={36}
                  height={36}
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedTrustAvatars((prev) => ({ ...prev, [avatar.id]: true }))
                  }
                  className="w-9 h-9 rounded-full object-cover object-top ring-2 ring-white bg-[#DDF4EA] shadow-[0_1px_2px_rgba(11,27,34,0.1)]"
                />
              ))}
              {usesGbp && <GoogleProfileBadge />}
              {usesWhatsapp && <WhatsAppBadge />}
            </span>
          )}

          <span className="flex flex-col text-left leading-[1.25]">
            <span className="text-[13.5px] font-semibold text-[#0B1B22]">
              {proofLine1}
            </span>
            {proofLine2 && (
              <span className="text-[12.5px] font-medium text-[#475754]">
                {proofLine2}
              </span>
            )}
          </span>
        </a>

        {/* 5. HEADLINE */}
        <h1
          className="oh-hero-enter oh-hero-delay-h1 font-sans font-normal text-[#0B1B22] max-w-[980px] min-[1200px]:max-w-[680px] min-[1440px]:max-w-[820px] 2xl:max-w-[980px] mx-auto"
          style={{
            fontSize: 'clamp(40px, 5.8vw, 92px)',
            lineHeight: 0.98,
            letterSpacing: '-0.03em',
          }}
        >
          {renderHeadlineWithAccent(heroTitle, heroAccent)}
        </h1>

        {/* SUBTITLE */}
        <p
          className="oh-hero-enter oh-hero-delay-sub text-[#0B1B22]/85 max-w-[640px] min-[1200px]:max-w-[520px] min-[1440px]:max-w-[640px] mx-auto mt-5 sm:mt-6 mb-8 sm:mb-10"
          style={{
            fontSize: 'clamp(17px, 1.5vw, 22px)',
            lineHeight: 1.4,
            textWrap: 'pretty',
          }}
        >
          {heroSubtitle}
        </p>

        {/* 6. CTA BUTTON (white pill, green-gradient circle on left expanding on hover) */}
        <div className="oh-hero-enter oh-hero-delay-cta flex flex-col items-center">
          <button
            type="button"
            onClick={scrollToContact}
            className="group min-w-[266px] sm:min-w-[278px] p-[8px] pr-[28px] bg-white rounded-full shadow-[0_16px_38px_-12px_rgba(11,27,34,0.16)] border border-white inline-flex items-center justify-between gap-3.5 active:scale-[0.98] transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:shadow-[0_20px_44px_-12px_rgba(11,27,34,0.22)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E9E6A] focus-visible:outline-offset-[3px]"
          >
            <span
              className="w-[120px] sm:w-[132px] group-hover:w-[136px] sm:group-hover:w-[148px] h-[56px] rounded-full shrink-0 flex items-center justify-center transition-[width,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                background: 'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
                boxShadow:
                  'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 24px -6px rgba(63, 209, 165, 0.45)',
              }}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 28 16"
                fill="none"
                className="w-7 h-4 text-white transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-x-[6px]"
              >
                <path
                  d="M2 8h22M18 2l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span className="text-[20px] font-medium text-[#0B1B22] whitespace-nowrap leading-none">
              {heroCtaLabel}
            </span>
          </button>

          {photoNote && (
            <p className="mt-4 text-[12px] text-[#475754]">
              {photoNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
