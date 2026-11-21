import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  X,
  Volume2,
  Award,
} from 'lucide-react';
import { ShimmerImage, Tilt3D } from '../components/PremiumPrimitives';
import { VIDEO_REVIEW } from '../content';
import { OH_DUR, OH_EASE } from '../lib/motion';
import { getResponsiveImageProps } from '../lib/images';
import seanByrneImg from '../assets/images/irish_electrician_portrait_1794505961851.jpg';
import marijaImg from '../assets/images/malta_plumber_portrait_1794506006630.jpg';
import conorWalshImg from '../assets/images/galway_roofer_work_1794506004419.jpg';
import lukeBuilderImg from '../assets/images/atlantic_slate_roofing_1791980952151.jpg';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  flag: string;
  stats: string;
  type: 'video' | 'text' | 'stat';
  avatar?: string;
  image?: string;
  videoSrc?: string;
  embedUrl?: string;
  brandLabel?: string;
  portraitOverlayCard?: boolean;
  poster?: string;
  quote?: string;
  bullets?: string[];
  statNumber?: string;
  statLabel?: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'sean-byrne',
    name: 'Seán Byrne',
    role: 'Founder at Byrne Electrical',
    flag: '🇮🇪',
    stats: 'Google 5.0 ★ · 42 reviews',
    type: 'video',
    image: seanByrneImg,
    quote:
      '"Three new jobs in the first week. Finally a site that looks like our work and actually brings in quotes."',
    bullets: [
      'Certified Electrical Contractor, Dublin',
      'Page 1 for "electrician Dublin"',
      'Automated WhatsApp inquiry replies',
    ],
  },
  {
    id: 'dr-robin',
    name: 'Marija Camilleri',
    role: 'Owner at Camilleri Plumbing',
    flag: '🇲🇹',
    stats: 'Google 5.0 ★ · Valletta & Sliema',
    type: 'text',
    image: marijaImg,
    quote:
      "I'm really happy and still working with Open Hours. They delivered creative work that not only looked great but also helped my brand grow online. Customers now say they found us on ChatGPT.",
    bullets: [
      'Master Plumber & Heating Specialist',
      'ChatGPT & Gemini citations verified',
      '12s automatic first response setup',
    ],
  },
  {
    id: 'conor-walsh',
    name: 'Conor Walsh',
    role: 'Director at Walsh Roofing',
    flag: '🇮🇪',
    stats: 'Google 4.9 ★ · Galway & Connacht',
    type: 'video',
    image: conorWalshImg,
    quote:
      '"The assistant answers while we are on the roof. Saves 12 hours every week and stops leads going elsewhere."',
    bullets: [
      'Specialist Slate & Tile Roofing',
      '#1 in Galway Google Maps',
      'Quote deposit collection online',
    ],
  },
  {
    id: 'stat-card',
    name: 'Trade Results Metric',
    role: 'Quarterly Growth Benchmark',
    flag: '🇲🇹 🇮🇪',
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
    flag: '🇮🇪',
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
  {
    id: 'luke-builder',
    name: 'Luke Farrugia',
    role: 'Lead Builder, Coastal Extensions',
    flag: '🇲🇹',
    stats: 'Over 28 completed builds',
    type: 'video',
    image: lukeBuilderImg,
    quote:
      '"Customers tell us our website is the clearest and most professional trade website in Malta."',
    bullets: [
      'Modern home extensions & renovations',
      'High-res project portfolio gallery',
      'Zero maintenance headaches',
    ],
  },
  {
    id: 'aaron-freedman',
    name: VIDEO_REVIEW.reviewerName || 'Aaron Freedman',
    role: 'Online Coach @ A2Z Fitness',
    brandLabel: 'A2Z Fitness',
    flag: '🇮🇪',
    stats: 'Verified Video Client',
    type: 'video',
    portraitOverlayCard: true,
    avatar: '/clients/1.webp',
    image: 'https://i.ibb.co.com/PzMx0tJK/ac6245a6-13a2-4716-bdfa-79220b85865b.png',
    poster: 'https://i.ibb.co.com/PzMx0tJK/ac6245a6-13a2-4716-bdfa-79220b85865b.png',
    embedUrl: 'https://streamable.com/e/36ovtq?loop=0',
    quote:
      'Zuhayer has been a fantastic partner in building this website. As for how the website actually looks, it’s impeccable.',
    bullets: [
      'Impeccable visual layout',
      'Clear, strategic content structure',
      'Smooth collaboration from day one',
    ],
  },
  {
    id: 'jeanne-m',
    name: 'Jeanne M',
    role: 'Acting President',
    flag: '🇮🇪',
    stats: 'Verified Client · Senja',
    type: 'text',
    image: '/clients/4.webp',
    quote:
      'Zuhayer was very attentive and asked questions to ensure he understood what I needed. The communication was probably the best I have had with website builders.',
    bullets: [
      'Prompt, patient revisions',
      'Delivered cleanly on schedule',
      'Direct founder communication',
    ],
  },
];

interface ClientsLoveUsProps {
  onOpenAudit?: () => void;
}

export default function ClientsLoveUs({ onOpenAudit: _onOpenAudit }: ClientsLoveUsProps) {
  const [activeVideoModal, setActiveVideoModal] = useState<TestimonialItem | null>(null);

  const lastTriggerRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!activeVideoModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideoModal(null);
        window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoModal]);

  // Balanced 3-column masonry distribution (~equal visual height across all columns):
  // Col 1: Aaron Freedman (video) + Marija Camilleri (text) + Rob O'Shaughnessy (text)
  // Col 2: Seán Byrne (video) + Stat Card + Jeanne M (text)
  // Col 3: Conor Walsh (video) + Luke Farrugia (video)
  const col1 = [TESTIMONIALS[6], TESTIMONIALS[1], TESTIMONIALS[4]];
  const col2 = [TESTIMONIALS[0], TESTIMONIALS[3], TESTIMONIALS[7]];
  const col3 = [TESTIMONIALS[2], TESTIMONIALS[5]];

  return (
    <section id="proof" className="oh-cv-auto py-[var(--section-py)] bg-[#E9ECEA] text-[#0B1B22] overflow-x-clip">
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

        {/* 3-Column Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            {col1.map((item) => (
              <TestimonialCard
                key={item.id}
                item={item}
                onPlay={(trigger) => {
                  lastTriggerRef.current = trigger;
                  setActiveVideoModal(item);
                }}
              />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            {col2.map((item) => (
              <TestimonialCard
                key={item.id}
                item={item}
                onPlay={(trigger) => {
                  lastTriggerRef.current = trigger;
                  setActiveVideoModal(item);
                }}
              />
            ))}
          </div>

          {/* Column 3 (2-up grid on tablet md, stacked column on desktop lg) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-6 md:col-span-2 lg:col-span-1">
            {col3.map((item) => (
              <TestimonialCard
                key={item.id}
                item={item}
                onPlay={(trigger) => {
                  lastTriggerRef.current = trigger;
                  setActiveVideoModal(item);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Testimonial Modal Popup */}
      <AnimatePresence>
        {activeVideoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050E0D]/80 backdrop-blur-sm"
            onClick={() => setActiveVideoModal(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Client story from ${activeVideoModal.name}`}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: OH_DUR.base, ease: OH_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="oh-dark-card relative w-full max-w-[460px] text-white rounded-[28px] overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveVideoModal(null);
                  window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
                }}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#050E0D]/80 text-white flex items-center justify-center hover:bg-[#14624F] active:scale-[0.98] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {activeVideoModal.embedUrl ? (
                <div className="bg-[#050E0D]">
                  <div className="relative bg-black w-full max-h-[68vh] overflow-hidden">
                    <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '125.000%' }}>
                      <iframe
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        height="100%"
                        src={`${activeVideoModal.embedUrl}${activeVideoModal.embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
                        width="100%"
                        title={`Client video review from ${activeVideoModal.name}`}
                        style={{
                          border: 'none',
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          left: '0px',
                          top: '0px',
                          overflow: 'hidden',
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 text-left border-t border-white/10">
                    <div className="inline-flex items-center gap-2 bg-[#DDF4EA] text-[#0F4A3E] text-xs font-bold px-3 py-1 rounded-full mb-2.5">
                      <Volume2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Verified Client Video Review</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white mb-1">
                      {activeVideoModal.name}
                    </h3>
                    <div className="text-xs text-[#A8EBD3] mb-2">
                      {activeVideoModal.role} · {activeVideoModal.stats}
                    </div>
                    {activeVideoModal.quote && (
                      <p className="text-white/85 text-xs sm:text-[13px] italic leading-relaxed">
                        {activeVideoModal.quote}
                      </p>
                    )}
                  </div>
                </div>
              ) : activeVideoModal.videoSrc ? (
                <div className="bg-[#050E0D]">
                  <div className="relative bg-black flex items-center justify-center">
                    <video
                      src={activeVideoModal.videoSrc}
                      poster={activeVideoModal.poster || activeVideoModal.image}
                      controls
                      autoPlay
                      playsInline
                      className="w-full max-h-[62vh] aspect-[4/5] object-contain bg-black"
                    />
                  </div>
                  <div className="p-5 sm:p-6 text-left border-t border-white/10">
                    <div className="inline-flex items-center gap-2 bg-[#DDF4EA] text-[#0F4A3E] text-xs font-bold px-3 py-1 rounded-full mb-2.5">
                      <Volume2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Verified Client Video Review</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white mb-1">
                      {activeVideoModal.name}
                    </h3>
                    <div className="text-xs text-[#A8EBD3] mb-2">
                      {activeVideoModal.role} · {activeVideoModal.stats}
                    </div>
                    {activeVideoModal.quote && (
                      <p className="text-white/85 text-xs sm:text-[13px] italic leading-relaxed">
                        {activeVideoModal.quote}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[9/14] bg-[#050E0D]">
                  {activeVideoModal.image && (
                    <ShimmerImage
                      src={activeVideoModal.image}
                      alt={activeVideoModal.name}
                      loading="lazy"
                      wrapperClassName="relative w-full h-full"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050E0D] via-[#050E0D]/35 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-left z-10">
                    <div className="inline-flex items-center gap-2 bg-[#DDF4EA] text-[#0F4A3E] text-xs font-bold px-3 py-1 rounded-full mb-3">
                      <Volume2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Verified Trade Client Story</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      {activeVideoModal.name}
                    </h3>
                    <p className="text-white/90 text-sm italic mb-4">
                      {activeVideoModal.quote}
                    </p>
                    <div className="text-xs text-white/75">
                      {activeVideoModal.role} · {activeVideoModal.stats}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function TestimonialCard({
  item,
  onPlay,
}: {
  item: TestimonialItem;
  onPlay: (trigger: HTMLElement | null) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Full-bleed Portrait Video Overlay Card (matches focused selector card layout)
  if (item.portraitOverlayCard && item.embedUrl) {
    const hoverPlaySrc = `${item.embedUrl}${item.embedUrl.includes('?') ? '&' : '?'}autoplay=1&muted=1`;
    return (
      <Tilt3D maxDeg={4}>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative rounded-[24px] overflow-hidden bg-[#050E0D] shadow-[var(--e2)] border border-[rgba(11,27,34,0.1)] group text-left"
        >
          <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '125.000%' }}>
            {/* Thumbnail Base Layer */}
            {item.image && (
              <img
                {...getResponsiveImageProps(item.image, [400, 640], '(max-width: 767px) 92vw, 390px')}
                alt={`${item.name} video review thumbnail`}
                width={400}
                height={500}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.02]"
              />
            )}

            {/* Hover-to-Play Streamable Video Embed */}
            {isHovered && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 20,
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '0px', paddingBottom: '125.000%' }}>
                  <iframe
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    height="100%"
                    src={hoverPlaySrc}
                    width="100%"
                    title={`${item.name} video review`}
                    style={{
                      border: 'none',
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      left: '0px',
                      top: '0px',
                      overflow: 'hidden',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Interactive Thumbnail Overlay (Play button + Bottom Gradient Scrim + Text) */}
            <button
              type="button"
              onClick={(e) => onPlay(e.currentTarget)}
              aria-label={`Play video review from ${item.name}`}
              className={`absolute inset-0 z-10 w-full h-full text-left cursor-pointer transition-opacity duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* Bottom Dark Scrim for AA Legibility */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.08) 44%, rgba(0, 0, 0, 0.72) 72%, rgba(0, 0, 0, 0.94) 100%)',
                }}
              />

              {/* Centered Translucent Play Button */}
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 backdrop-blur-[3px] border border-white/25 text-white flex items-center justify-center shadow-[0_10px_28px_rgba(0,0,0,0.4)] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110"
              >
                <Play className="w-6 h-6 fill-white translate-x-0.5" strokeWidth={1.5} />
              </span>

              {/* Bottom Metadata & Quote Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 flex flex-col items-start">
                {(item.avatar || item.brandLabel) && (
                  <div className="flex items-center gap-2.5 mb-3">
                    {item.avatar && (
                      <img
                        src={item.avatar}
                        alt={item.brandLabel || item.name}
                        width={24}
                        height={24}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover border border-white/30 shrink-0"
                      />
                    )}
                    {item.brandLabel && (
                      <span className="text-[14px] font-medium text-white/95 tracking-tight">
                        {item.brandLabel}
                      </span>
                    )}
                  </div>
                )}

                {item.quote && (
                  <p className="text-[13.5px] sm:text-[14.5px] leading-[1.45] text-white/90 font-normal line-clamp-2 mb-3.5">
                    {item.quote}
                  </p>
                )}

                <h3 className="font-heading text-[18px] sm:text-[19px] font-bold text-white leading-tight">
                  {item.name}
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-white/75 mt-1 font-normal">
                  {item.role}
                </p>
              </div>
            </button>
          </div>
        </div>
      </Tilt3D>
    );
  }

  // Stat Card Variant (Unified Dark-Card Recipe)
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

  const avatarSrc = item.avatar || item.image;

  return (
    <Tilt3D maxDeg={4}>
      <div className="oh-card rounded-[28px] p-6 sm:p-7 text-left">
        {/* Header: Avatar, Name, Flag, Role, Stats */}
        <div className="flex items-center gap-3.5 mb-4">
          {avatarSrc ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[rgba(11,27,34,0.12)] shrink-0">
              <ShimmerImage
                src={avatarSrc}
                alt={item.name}
                width={48}
                height={48}
                loading="lazy"
                wrapperClassName="relative w-full h-full"
                className="w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#DDF4EA] text-[#14624F] flex items-center justify-center font-bold text-lg shrink-0">
              {item.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 font-bold text-[15px] text-[#0B1B22]">
              <span className="truncate">{item.name}</span>
              <span className="text-base" aria-hidden="true">{item.flag}</span>
            </div>
            <p className="text-xs text-[#475754] truncate">{item.role}</p>
            <div className="flex items-center gap-1 text-[11px] text-[#475754] mt-0.5 tabular-nums">
              <span className="text-[#D99B26]" aria-hidden="true">★</span>
              <span>{item.stats}</span>
            </div>
          </div>
        </div>

        {/* Video Thumbnail Viewport if video type */}
        {item.type === 'video' && item.image && (
          <button
            type="button"
            onClick={(e) => onPlay(e.currentTarget)}
            aria-label={`Play client video review from ${item.name}`}
            className="block w-full text-left relative aspect-[4/5] rounded-[20px] overflow-hidden mb-4 group cursor-pointer border border-[rgba(11,27,34,0.1)] shadow-inner active:scale-[0.99] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          >
            <ShimmerImage
              src={item.image}
              alt={`${item.name} video review`}
              width={400}
              height={500}
              loading="lazy"
              wrapperClassName="relative w-full h-full"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            />
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

        {/* Quote / Testimonial Text */}
        {item.quote && (
          <p className="text-[14px] sm:text-[15px] text-[#0B1B22] leading-relaxed mb-4 font-normal">
            {item.quote}
          </p>
        )}

        {/* Bullet Points */}
        {item.bullets && item.bullets.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-[rgba(11,27,34,0.08)]">
            {item.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#475754]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14624F] mt-1.5 shrink-0" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Tilt3D>
  );
}
