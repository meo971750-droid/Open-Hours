import React, { Suspense, lazy, memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Play,
  Award,
  Star,
  ExternalLink,
} from 'lucide-react';
import { ShimmerImage, Tilt3D } from '../components/PremiumPrimitives';
import { config } from '../config';
import { VIDEO_REVIEW } from '../content';
import { useAnimationInView } from '../hooks/useAnimationInView';
import { getSmallAvatarSrc, optimizeImageUrl } from '../lib/images';

const ClientsVideoModal = lazy(() => import('../components/ClientsVideoModal'));

interface ProofCardItem {
  id: string;
  anchorId?: string;
  name: string;
  role: string;
  location?: string;
  country?: string;
  rating?: number;
  sourceLabel?: string;
  sourceUrl?: string;
  date?: string;
  stats?: string;
  legacyFlag?: string;
  type: 'video' | 'text' | 'stat';
  avatar?: string;
  image?: string;
  videoSrc?: string;
  videoEmbedUrl?: string;
  poster?: string;
  quote?: string;
  bullets?: string[];
  statNumber?: string;
  statLabel?: string;
  brandName?: string;
  brandRoleLine?: string;
  fullBleedVideo?: boolean;
  isConfigReview?: boolean;
}

const AARON_FREEDMAN_STREAMABLE_EMBED = 'https://streamable.com/e/36ovtq?';
const AARON_FREEDMAN_THUMBNAIL = '/assets/aistudio/image_9075c9cc.png';

function buildEmbedUrl(baseUrl: string, params: Record<string, string>): string {
  const query = new URLSearchParams(params).toString();
  if (baseUrl.endsWith('?') || baseUrl.endsWith('&')) {
    return `${baseUrl}${query}`;
  }
  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${query}`;
}

// Non-config cards retained as-is for user review (listed in Pass 20 report)
const LEGACY_NON_CONFIG_CARDS: ProofCardItem[] = [
  {
    id: 'stat-card',
    name: 'Trade Results Metric',
    role: 'Quarterly Growth Benchmark',
    legacyFlag: '🇲🇹 🇮🇪',
    stats: 'Across 42 trade builds',
    type: 'stat',
    statNumber: '+212%',
    statLabel: 'More inquiries in 90 days for a Malta roofing firm.',
    bullets: [
      'Page one for 14 local searches',
      '12 sec average first reply, day or night',
      '€38,400 quoted pipeline added',
    ],
  },
  {
    id: 'rob-o',
    name: "Rob O'Shaughnessy",
    role: 'Director of Switch Dimension',
    legacyFlag: '🇮🇪',
    stats: '42K community members',
    type: 'text',
    image: '/clients/2.webp',
    quote:
      'Choosing Open Hours was the right move for my business. They understood my brand perfectly and created a platform that brought more attention, engagement and inquiries.',
    bullets: [
      'Director of Switch Dimension',
      'Software & Web Architecture',
      'Fast, clear collaboration',
    ],
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'OH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function buildSectionCards(): ProofCardItem[] {
  const seenReviewers = new Set<string>();
  const videoReviewerName =
    VIDEO_REVIEW.permissionConfirmed && config.videoTestimonial
      ? (VIDEO_REVIEW.reviewerName || '').trim()
      : '';
  const videoReviewerKey = videoReviewerName.toLowerCase();

  const cards: ProofCardItem[] = [];

  for (const t of config.testimonials || []) {
    const normalized = t.fullName.trim().toLowerCase();
    if (!normalized || seenReviewers.has(normalized)) continue;
    seenReviewers.add(normalized);

    const isAaronFreedman = normalized === 'aaron freedman';
    const isMatchingVideoReviewer =
      isAaronFreedman || (Boolean(videoReviewerKey) && normalized === videoReviewerKey);
    const cardThumbnail = isAaronFreedman
      ? AARON_FREEDMAN_THUMBNAIL
      : isMatchingVideoReviewer
        ? VIDEO_REVIEW.poster || t.photo
        : undefined;

    cards.push({
      id: t.id,
      anchorId: `review-${t.id}`,
      name: t.fullName,
      role: t.role,
      location: t.location,
      country: t.country,
      rating:
        typeof t.rating === 'number' && t.rating > 0
          ? t.rating
          : isMatchingVideoReviewer &&
              typeof config.videoTestimonial?.rating === 'number' &&
              config.videoTestimonial.rating > 0
            ? config.videoTestimonial.rating
            : 0,
      sourceLabel: t.sourceLabel,
      sourceUrl: t.sourceUrl,
      date: t.date,
      type: isMatchingVideoReviewer ? 'video' : 'text',
      avatar: t.photo,
      videoSrc: isAaronFreedman
        ? undefined
        : isMatchingVideoReviewer
          ? VIDEO_REVIEW.src
          : undefined,
      videoEmbedUrl: isAaronFreedman ? AARON_FREEDMAN_STREAMABLE_EMBED : undefined,
      poster: isMatchingVideoReviewer ? cardThumbnail : undefined,
      image: cardThumbnail,
      quote: t.text,
      brandName: isAaronFreedman ? 'A2Z Fitness' : undefined,
      brandRoleLine: isAaronFreedman ? 'Online Coach @ A2Z Fitness' : undefined,
      fullBleedVideo: isAaronFreedman,
      isConfigReview: true,
    });
  }

  // If videoTestimonial belongs to a reviewer not in config.testimonials, include it once
  if (
    videoReviewerName &&
    !seenReviewers.has(videoReviewerKey) &&
    VIDEO_REVIEW.permissionConfirmed &&
    config.videoTestimonial
  ) {
    seenReviewers.add(videoReviewerKey);
    cards.unshift({
      id: 'video-testimonial',
      name: videoReviewerName,
      role: VIDEO_REVIEW.reviewerLine?.trim() || 'Client',
      rating:
        typeof config.videoTestimonial.rating === 'number' &&
        config.videoTestimonial.rating > 0
          ? config.videoTestimonial.rating
          : 0,
      sourceLabel: 'Video review',
      type: 'video',
      videoSrc: VIDEO_REVIEW.src,
      poster: VIDEO_REVIEW.poster,
      image: VIDEO_REVIEW.poster,
      isConfigReview: true,
    });
  }

  return [...cards, ...LEGACY_NON_CONFIG_CARDS];
}

function distributeMasonryColumns(items: ProofCardItem[], colCount: number): ProofCardItem[][] {
  const cols: ProofCardItem[][] = Array.from({ length: colCount }, () => []);
  const heights = Array.from({ length: colCount }, () => 0);

  // Place tall media/stat cards first cleanly across balanced columns
  const estimateWeight = (item: ProofCardItem) => {
    if (item.fullBleedVideo) return 1.85;
    if (item.type === 'video') return 2.4;
    if (item.type === 'stat') return 1.8;
    const len = item.quote?.length || 0;
    return len > 240 ? 1.55 : len > 120 ? 1.25 : 1.0;
  };

  for (const item of items) {
    let shortestCol = 0;
    for (let i = 1; i < colCount; i++) {
      if (heights[i] < heights[shortestCol]) {
        shortestCol = i;
      }
    }
    cols[shortestCol].push(item);
    heights[shortestCol] += estimateWeight(item);
  }

  return cols;
}

interface ClientsLoveUsProps {
  onOpenAudit?: () => void;
}

export default function ClientsLoveUs({ onOpenAudit: _onOpenAudit }: ClientsLoveUsProps) {
  const [activeVideoModal, setActiveVideoModal] = useState<ProofCardItem | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useAnimationInView(sectionRef, false);

  const cards = useMemo(() => buildSectionCards(), []);
  const desktopColumns = useMemo(() => distributeMasonryColumns(cards, 3), [cards]);

  const handlePlay = useCallback((item: ProofCardItem, trigger: HTMLElement | null) => {
    lastTriggerRef.current = trigger;
    setActiveVideoModal(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveVideoModal(null);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="proof"
      className="oh-cv-auto oh-anim-paused py-[var(--section-py)] bg-[#E9ECEA] text-[#0B1B22] overflow-x-clip"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-[760px] mx-auto mb-14 sm:mb-16">
          <h2 className="text-[36px] sm:text-[48px] md:text-[58px] font-normal leading-[1.05] tracking-[-0.02em] mb-4">
            <span className="oh-line-mask">
              <span className="oh-line-reveal text-[#475754] font-serif italic">Clients</span>
            </span>{' '}
            <span className="oh-line-mask">
              <span className="oh-line-reveal oh-line-reveal-delay-1 font-bold text-[#0B1B22] font-sans">Love Us</span>
            </span>
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#475754] leading-relaxed">
            Real clients. Real inquiries. Here's what changed when Open Hours took over their web and search.
          </p>
        </div>

        {/* Desktop (>=1024px): Adaptive 3-Column Balanced Masonry */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 items-start">
          {desktopColumns.map((colItems, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-6">
              {colItems.map((item) => (
                <TestimonialCard
                  key={item.id}
                  item={item}
                  onPlay={(trigger) => handlePlay(item, trigger)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile & Tablet (<1024px): Reflows cleanly across 1 or 2 columns with zero gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6 items-start">
          {cards.map((item) => (
            <TestimonialCard
              key={item.id}
              item={item}
              onPlay={(trigger) => handlePlay(item, trigger)}
            />
          ))}
        </div>
      </div>

      {/* Lazy Video Testimonial Modal Popup */}
      {activeVideoModal && (
        <Suspense fallback={null}>
          <ClientsVideoModal item={activeVideoModal} onClose={handleCloseModal} />
        </Suspense>
      )}
    </section>
  );
}

const TestimonialCard = memo(function TestimonialCard({
  item,
  onPlay,
}: {
  item: ProofCardItem;
  onPlay: (trigger: HTMLElement | null) => void;
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isHoverPlaying, setIsHoverPlaying] = useState(false);

  // Legacy Stat Card Variant (non-config card retained per Pass 20 Rule 4)
  if (item.type === 'stat') {
    return (
      <Tilt3D maxDeg={4}>
        <div
          data-spotlight=""
          className="oh-dark-card relative overflow-hidden text-white rounded-[28px] p-7 sm:p-8"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#A8EBD3] uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" strokeWidth={1.5} />
              <span>Real Client Results</span>
            </div>
            <div className="font-serif text-[64px] sm:text-[76px] font-bold leading-none text-[#A8EBD3] tabular-nums mb-3">
              {item.statNumber}
            </div>
            <p className="text-[17px] sm:text-[18px] text-white font-medium mb-6 leading-snug">
              {item.statLabel}
            </p>
            <div className="space-y-2.5 pt-4 border-t border-white/15">
              {item.bullets?.map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-[13px] text-white/85">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6FD6B0] shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Tilt3D>
    );
  }

  const rawAvatarSrc = item.avatar || (item.isConfigReview ? undefined : item.image);
  const avatarSrc = useMemo(() => getSmallAvatarSrc(rawAvatarSrc), [rawAvatarSrc]);
  const posterSrc = useMemo(
    () => optimizeImageUrl(item.poster || item.image || '', 480, 'good'),
    [item.poster, item.image]
  );
  const showAvatarImg = Boolean(avatarSrc && avatarSrc.trim() && !avatarFailed);
  const roleLocationLine = [item.role, item.location]
    .filter((v) => Boolean(v && v.trim()))
    .join(' · ');
  const flagToDisplay = item.isConfigReview ? item.country?.trim() : item.legacyFlag;
  const hasRating = typeof item.rating === 'number' && item.rating > 0;
  const isLongQuote = Boolean(
    item.isConfigReview &&
      item.quote &&
      (item.quote.length > 210 || item.quote.includes('\n'))
  );

  // Full-Bleed Portrait Video Card Variant (e.g. Aaron Freedman)
  if (item.fullBleedVideo && (item.videoEmbedUrl || item.videoSrc)) {
    return (
      <Tilt3D maxDeg={4}>
        <div
          id={item.anchorId}
          onPointerEnter={(e) => {
            if (e.pointerType !== 'touch' && item.videoEmbedUrl) {
              setIsHoverPlaying(true);
            }
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== 'touch') {
              setIsHoverPlaying(false);
            }
          }}
          className="relative w-full h-0 pb-[125%] rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[#0B1B22]/85 bg-black shadow-[0_18px_42px_-16px_rgba(11,27,34,0.28)] scroll-mt-24"
        >
          {isHoverPlaying && item.videoEmbedUrl ? (
            <iframe
              title={`Client video review from ${item.name}`}
              src={buildEmbedUrl(item.videoEmbedUrl, { autoplay: '1', muted: '1' })}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 overflow-hidden"
            />
          ) : (
            <button
              type="button"
              onClick={(e) => onPlay(e.currentTarget)}
              aria-label={`Play client video review from ${item.name}`}
              className="absolute inset-0 w-full h-full block text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FD6B0]"
            >
              {(item.poster || item.image) && (
                <ShimmerImage
                  src={posterSrc}
                  alt={`${item.name} video review`}
                  width={480}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  wrapperClassName="relative w-full h-full"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                />
              )}

              {/* Bottom Black Gradient Scrim */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_32%,rgba(0,0,0,0.45)_52%,rgba(0,0,0,0.88)_74%,#000000_92%)]"
              />

              {/* Centered Play Circle */}
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/60 border border-white/25 text-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.38)] group-hover:scale-110 transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-10"
              >
                <Play className="w-5 h-5 fill-white text-white translate-x-[1.5px]" strokeWidth={1.5} />
              </div>

              {/* Bottom Brand Badge, Clamped Quote, Name & Role */}
              <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-10 sm:px-7 sm:pb-7 flex flex-col text-left z-10">
                {item.brandName && (
                  <div className="flex items-center gap-2.5 mb-3">
                    {showAvatarImg ? (
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-white/25 bg-[#0F4A3E] shrink-0">
                        <ShimmerImage
                          src={avatarSrc!}
                          alt={item.name}
                          width={28}
                          height={28}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarFailed(true)}
                          wrapperClassName="relative w-full h-full"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="w-7 h-7 rounded-full bg-[#0F4A3E] text-[#A8EBD3] border border-white/25 flex items-center justify-center font-heading font-bold text-[11px] shrink-0"
                      >
                        {getInitials(item.name)}
                      </div>
                    )}
                    <span className="text-[13.5px] font-semibold text-white tracking-[-0.01em] truncate">
                      {item.brandName}
                    </span>
                  </div>
                )}

                {item.quote && (
                  <p className="text-[13.5px] sm:text-[14px] leading-[1.45] text-white/90 font-normal line-clamp-2 mb-3.5">
                    {item.quote}
                  </p>
                )}

                <div className="font-heading text-[20px] sm:text-[21px] font-bold leading-[1.15] tracking-[-0.02em] text-white mb-0.5">
                  {item.name}
                </div>

                {(item.brandRoleLine || roleLocationLine) && (
                  <p className="text-[13px] text-white/75 font-normal">
                    {item.brandRoleLine || roleLocationLine}
                  </p>
                )}
              </div>
            </button>
          )}
        </div>
      </Tilt3D>
    );
  }

  return (
    <Tilt3D maxDeg={4}>
      <div
        id={item.anchorId}
        className="oh-card rounded-[28px] p-6 sm:p-7 text-left scroll-mt-24"
      >
        {/* Header: Avatar (or Brand Monogram Tile), Name, Optional Country Flag, Role/Location */}
        <div className="flex items-center gap-3.5 mb-4">
          {showAvatarImg ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[rgba(11,27,34,0.12)] bg-[#0F4A3E] shrink-0">
              <ShimmerImage
                src={avatarSrc!}
                alt={item.name}
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                wrapperClassName="relative w-full h-full"
                className="w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="w-12 h-12 rounded-full bg-[#0F4A3E] text-[#A8EBD3] flex items-center justify-center font-heading font-bold text-[15px] tracking-tight shrink-0"
            >
              {getInitials(item.name)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 font-bold text-[15px] text-[#0B1B22]">
              <span className="truncate">{item.name}</span>
              {flagToDisplay && (
                <span className="text-base shrink-0" aria-hidden="true">
                  {flagToDisplay}
                </span>
              )}
            </div>

            {roleLocationLine && (
              <p className="text-xs text-[#475754] truncate">{roleLocationLine}</p>
            )}

            {/* Legacy card stats line (for untouched non-config card only) */}
            {!item.isConfigReview && item.stats && (
              <div className="flex items-center gap-1 text-[11px] text-[#475754] mt-0.5 tabular-nums">
                <span className="text-[#D99B26]" aria-hidden="true">★</span>
                <span>{item.stats}</span>
              </div>
            )}

            {/* Real config review star rating (only shown if rating > 0) */}
            {item.isConfigReview && hasRating && (
              <div
                className="flex items-center gap-0.5 mt-1 tabular-nums"
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
                        : 'text-[rgba(11,27,34,0.2)]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video Viewport (hover on thumbnail starts Streamable embed playback; click opens modal) */}
        {item.type === 'video' && (item.videoEmbedUrl || item.videoSrc) && (
          <div
            onPointerEnter={(e) => {
              if (e.pointerType !== 'touch' && item.videoEmbedUrl) {
                setIsHoverPlaying(true);
              }
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== 'touch') {
                setIsHoverPlaying(false);
              }
            }}
            className="relative w-full h-0 pb-[125%] rounded-[20px] overflow-hidden mb-4 border border-[rgba(11,27,34,0.1)] shadow-inner bg-[#050E0D]"
          >
            {isHoverPlaying && item.videoEmbedUrl ? (
              <iframe
                title={`Client video review from ${item.name}`}
                src={buildEmbedUrl(item.videoEmbedUrl, { autoplay: '1', muted: '1' })}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0 overflow-hidden"
              />
            ) : (
              <button
                type="button"
                onClick={(e) => onPlay(e.currentTarget)}
                aria-label={`Play client video review from ${item.name}`}
                className="absolute inset-0 w-full h-full block text-left group cursor-pointer active:scale-[0.99] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] bg-[#050E0D]"
              >
                {posterSrc ? (
                  <ShimmerImage
                    src={posterSrc}
                    alt={`${item.name} video review`}
                    width={400}
                    height={500}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    wrapperClassName="relative w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0F4A3E] to-[#050E0D]" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-150" />

                {/* Brand-Green Gradient Play Button */}
                <div
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  style={{
                    background: 'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 10px 26px rgba(63, 209, 165, 0.45)',
                  }}
                >
                  <Play className="w-6 h-6 fill-white translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* Review Text (Exact copy; long text clamped with Read more / Show less) */}
        {item.quote && (
          <div className={item.bullets?.length || item.isConfigReview ? 'mb-4' : ''}>
            <p
              className={`text-[14px] sm:text-[15px] text-[#0B1B22] leading-relaxed font-normal whitespace-pre-line ${
                isLongQuote && !expanded ? 'line-clamp-5' : ''
              }`}
            >
              {item.quote}
            </p>
            {isLongQuote && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
                className="mt-1.5 text-[12.5px] font-semibold text-[#14624F] hover:text-[#0A3A30] underline underline-offset-2 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer rounded-xs"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Bullet Points (for untouched legacy non-config card only) */}
        {!item.isConfigReview && item.bullets && item.bullets.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-[rgba(11,27,34,0.08)]">
            {item.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#475754]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14624F] mt-1.5 shrink-0" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        )}

        {/* Real config review footer: Source Link + Date */}
        {item.isConfigReview && (item.sourceLabel || item.date) && (
          <div className="pt-3 border-t border-[rgba(11,27,34,0.08)] flex items-center justify-between gap-2 text-[11.5px] text-[#475754]">
            {item.sourceUrl ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="oh-link-sweep inline-flex items-center gap-1 font-medium text-[#0B1B22] hover:text-[#14624F] rounded-xs"
              >
                <span>{item.sourceLabel || 'Source'}</span>
                <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
              </a>
            ) : (
              <span className="font-medium text-[#0B1B22]">
                {item.sourceLabel}
              </span>
            )}
            {item.date && <span className="tabular-nums">{item.date}</span>}
          </div>
        )}
      </div>
    </Tilt3D>
  );
});
