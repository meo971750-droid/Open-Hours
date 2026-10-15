import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Quote, Play, Star, ExternalLink } from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { CONFIG } from '../config';

export default function ClientProof() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  const video = CONFIG.videoTestimonial;
  const testimonials = CONFIG.testimonials || [];
  const featuredReview = testimonials[0];
  const remainingReviews = testimonials.slice(1);

  const handlePlayClick = () => {
    if (!videoRef.current) return;
    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setHasVideoError(true);
      });
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
    }
  };

  const showSummary = Boolean(
    CONFIG.reviewSummary &&
      CONFIG.reviewSummary.rating &&
      CONFIG.reviewSummary.sourceUrl
  );

  return (
    <section
      id="reviews"
      aria-label="Client testimonials and verified feedback"
      className="w-full bg-white py-20 sm:py-24 md:py-28 scroll-mt-24"
    >
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3F4] border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-semibold text-[#1E4A5C]">
            <Quote className="w-3.5 h-3.5 text-[#1E4A5C]" />
            <span>Client proof</span>
          </div>

          <h2 className="text-[clamp(32px,4.4vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-3xl mb-4">
            What past clients <Accent>say</Accent>
          </h2>

          <p className="text-[17px] sm:text-[19px] text-[#5E6F77] max-w-2xl mx-auto font-normal">
            Direct feedback from business owners who have had websites built by Open Hours.
          </p>

          {/* Optional Review Summary (shown only if both rating/count and sourceUrl are provided) */}
          {showSummary && (
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F6] border border-[rgba(15,42,53,0.08)] text-[13px] text-[#0F2A35]">
              <div className="flex items-center gap-1 text-[#E8943A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-semibold">{CONFIG.reviewSummary.rating}</span>
              {CONFIG.reviewSummary.count && (
                <span className="text-[#5E6F77]">({CONFIG.reviewSummary.count})</span>
              )}
              <a
                href={CONFIG.reviewSummary.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1E4A5C] underline inline-flex items-center gap-0.5 ml-1"
              >
                <span>Verify source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Top Section: Large Video Testimonial Card next to Featured Review */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 max-w-6xl mx-auto mb-10">
          {/* Large Video Testimonial Card */}
          <div className="lg:col-span-7 bg-[#0F2A35] rounded-3xl overflow-hidden shadow-[0_18px_48px_rgba(15,42,53,0.14)] flex flex-col justify-between text-white relative group">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#18262E] overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                src={video.src}
                poster={video.poster}
                controls={isPlaying}
                playsInline
                preload="metadata"
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover"
              />

              {/* Play overlay button if not playing */}
              {!isPlaying && !hasVideoError && (
                <button
                  type="button"
                  onClick={handlePlayClick}
                  className="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/45 transition-colors cursor-pointer group/btn"
                  aria-label={`Play review video from ${video.name}`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-[#0F2A35] flex items-center justify-center shadow-2xl transform transition-transform duration-200 group-hover/btn:scale-110 active:scale-95 pl-1">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-[#0F2A35]" />
                  </div>
                </button>
              )}
            </div>

            {/* Video footer info */}
            <div className="p-6 sm:p-7 bg-[#0F2A35] flex items-center justify-between gap-4 border-t border-white/10">
              <div>
                <h3 className="text-[18px] sm:text-[20px] font-semibold text-white">
                  {video.name}
                </h3>
                {video.business && (
                  <p className="text-[14px] text-white/70 mt-0.5">
                    {video.business}
                  </p>
                )}
              </div>

              {video.sourceUrl && (
                <a
                  href={video.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#E3B896] hover:text-white underline underline-offset-4"
                >
                  <span>Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Featured Written Review Card */}
          {featuredReview && (
            <div className="lg:col-span-5 bg-[#F4F6F8] rounded-3xl p-6 sm:p-8 border border-[rgba(15,42,53,0.08)] shadow-xs flex flex-col justify-between">
              <div>
                {/* Rating stars if provided */}
                {typeof featuredReview.rating === 'number' && (
                  <div className="flex items-center gap-1 text-[#E8943A] mb-4">
                    {[...Array(featuredReview.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                )}

                {/* Quote text */}
                <blockquote className="text-[16px] sm:text-[17px] text-[#0F2A35] font-normal leading-relaxed mb-6">
                  "{featuredReview.text}"
                </blockquote>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-[rgba(15,42,53,0.08)] flex items-center justify-between gap-3">
                <div>
                  <div className="text-[15px] font-semibold text-[#0F2A35]">
                    {featuredReview.fullName}
                  </div>
                  {(featuredReview.business || featuredReview.location) && (
                    <div className="text-[13px] text-[#5E6F77]">
                      {[featuredReview.business, featuredReview.location]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  )}
                </div>

                {featuredReview.sourceUrl && featuredReview.sourceLabel && (
                  <a
                    href={featuredReview.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[#1E4A5C] hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    <span>{featuredReview.sourceLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Staggered Masonry Wall for remaining written reviews if any */}
        {remainingReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {remainingReviews.map((rev, rIdx) => (
              <motion.article
                key={rIdx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: rIdx * 0.08 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[rgba(15,42,53,0.08)] shadow-xs flex flex-col justify-between"
              >
                <div>
                  {typeof rev.rating === 'number' && (
                    <div className="flex items-center gap-1 text-[#E8943A] mb-3">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  )}
                  <p className="text-[15px] text-[#0F2A35] leading-relaxed mb-5">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(15,42,53,0.06)] flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#0F2A35]">
                      {rev.fullName}
                    </h4>
                    {(rev.business || rev.location) && (
                      <p className="text-[12px] text-[#5E6F77]">
                        {[rev.business, rev.location].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>

                  {rev.sourceUrl && rev.sourceLabel && (
                    <a
                      href={rev.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-[#1E4A5C] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>{rev.sourceLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
