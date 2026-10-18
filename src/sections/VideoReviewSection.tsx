import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Video, Play, ArrowRight, AlertCircle, Upload, RotateCcw } from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { VIDEO_REVIEW, FOUNDER, CTA } from '../content';
import { getCustomVideo, saveCustomVideo, removeCustomVideo } from '../lib/videoStorage';

interface VideoReviewSectionProps {
  onOpenAudit: () => void;
}

export default function VideoReviewSection({ onOpenAudit }: VideoReviewSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>(VIDEO_REVIEW.src);
  const [isCustomVideo, setIsCustomVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [captionsExist, setCaptionsExist] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // If written permission is not confirmed, render nothing
  if (!VIDEO_REVIEW.permissionConfirmed) {
    return null;
  }

  // Load custom persisted video if user has uploaded one
  useEffect(() => {
    let objectUrl: string | null = null;
    getCustomVideo().then((blob) => {
      if (blob) {
        objectUrl = URL.createObjectURL(blob);
        setVideoSrc(objectUrl);
        setIsCustomVideo(true);
        setHasError(false);
      }
    });

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  // Load Vimeo player script
  useEffect(() => {
    const scriptSrc = 'https://player.vimeo.com/api/player.js';
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Check if captions file exists
  useEffect(() => {
    if (VIDEO_REVIEW.captions) {
      fetch(VIDEO_REVIEW.captions, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) setCaptionsExist(true);
        })
        .catch(() => {
          setCaptionsExist(false);
        });
    }
  }, []);

  // IntersectionObserver: Pause and show poster again when section leaves the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            videoRef.current.load(); // Reset to poster
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePlayClick = () => {
    if (!videoRef.current) return;
    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setHasError(true);
      });
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load(); // Reset to show poster
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('video/')) return;
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setIsCustomVideo(true);
    setHasError(false);
    setIsPlaying(false);
    await saveCustomVideo(file);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleResetVideo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await removeCustomVideo();
    setVideoSrc(VIDEO_REVIEW.src);
    setIsCustomVideo(false);
    setHasError(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const reviewerDisplay = VIDEO_REVIEW.reviewerName.trim() || 'A past client';
  const initialChar = (VIDEO_REVIEW.reviewerName.trim()[0] || 'C').toUpperCase();

  return (
    <section
      id="video-review"
      ref={sectionRef}
      className="w-full bg-white py-12 sm:py-20 md:py-24 scroll-mt-24"
    >
      <Container>
        {/* Light mist panel (mist #EEF3F4, radius 40px, padding 64px 40px; 40px 20px mobile) */}
        <div className="rounded-[32px] sm:rounded-[40px] bg-[#EEF3F4] border border-[rgba(15,42,53,0.06)] px-5 py-10 sm:px-10 sm:py-16">
          {/* Header (Centred, same style as other sections) */}
          <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-semibold text-[#1E4A5C]">
              <Video className="w-3.5 h-3.5 text-[#1E4A5C]" />
              <span>Video review</span>
            </div>

            <h2 className="text-[clamp(32px,4.4vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-3xl mb-4">
              A past client on working with <Accent>{FOUNDER.name}</Accent>
            </h2>

            <p className="text-[17px] sm:text-[19px] text-[#5E6F77] max-w-xl mx-auto font-normal">
              A short video from a past client about working with the founder of Open Hours.
            </p>
          </div>

          {/* Two columns >= 1024px (video 44% | text 56%), stacked below (video first, max-width 420px, centred) */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* LEFT: Portrait video card, aspect-ratio 4/5, max-width 460px, radius 28px */}
            <div className="w-full max-w-[420px] lg:max-w-[460px] lg:w-[44%] shrink-0">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/5] w-full rounded-[28px] overflow-hidden bg-[#0F2A35] shadow-[0_16px_36px_rgba(15,42,53,0.12)] border border-[rgba(15,42,53,0.08)] transition-all duration-200"
              >
                {/* Hidden File Input for video selection in dev mode */}
                {import.meta.env.DEV && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="Upload video file"
                  />
                )}

                {isCustomVideo ? (
                  <>
                    <video
                      ref={videoRef}
                      key={videoSrc}
                      src={videoSrc}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {import.meta.env.DEV && (
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-medium text-white/90">
                          Custom video loaded
                        </span>
                        <button
                          type="button"
                          onClick={handleResetVideo}
                          title="Reset to default video"
                          className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <iframe
                    src="https://player.vimeo.com/video/1236873609?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                    className="absolute inset-0 w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Another happy client #freewebsite"
                  />
                )}
              </motion.div>

              {/* DEV ONLY file picker link */}
              {import.meta.env.DEV && (
                <div className="mt-3 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-[12px] text-[#5E6F77] hover:text-[#0F2A35] transition-colors py-1 px-2 rounded-md hover:bg-black/5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#1E4A5C]" />
                    <span>DEV: Test custom video file</span>
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: White card (radius 24px, padding 28px) */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="w-full lg:w-[56%] bg-white rounded-[24px] p-6 sm:p-7 md:p-8 border border-[rgba(15,42,53,0.06)] shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Header line: Initials tile, Reviewer name, optional reviewer line */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full bg-[#E3B896] text-[#0F2A35] flex items-center justify-center text-[20px] font-bold shrink-0 shadow-xs">
                    {initialChar}
                  </div>
                  <div>
                    <h3 className="text-[22px] font-semibold text-[#0F2A35] leading-snug">
                      {reviewerDisplay}
                    </h3>
                    {VIDEO_REVIEW.reviewerLine.trim() && (
                      <p className="text-[16px] text-[#5E6F77] mt-0.5">
                        {VIDEO_REVIEW.reviewerLine.trim()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Neutral statement without quotes or invented content */}
                <p className="text-[17px] text-[#0F2A35] leading-relaxed mb-4">
                  {reviewerDisplay} recorded this video about working with {FOUNDER.name}, founder of Open Hours.
                </p>

                {/* Disclosure Chip (only if non-empty) */}
                {VIDEO_REVIEW.disclosure.trim() && (
                  <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#DCE9EC] text-[#1E4A5C] text-[15px] font-semibold mb-4">
                    <span>{VIDEO_REVIEW.disclosure.trim()}</span>
                  </div>
                )}

                {/* Dev mode reminder if disclosure is empty */}
                {import.meta.env.DEV && !VIDEO_REVIEW.disclosure.trim() && (
                  <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[12px] font-medium border border-amber-500/20">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>TODO: add an incentive disclosure if it applies</span>
                  </div>
                )}

                {/* Shared with permission */}
                <p className="text-[14px] text-[#5E6F77] mb-6">
                  Shared with permission.
                </p>
              </div>

              <div>
                {/* Primary Button */}
                <button
                  type="button"
                  onClick={onOpenAudit}
                  className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full bg-[#0F2A35] text-white hover:bg-[#1E4A5C] text-[15px] font-semibold shadow-md transition-colors cursor-pointer"
                >
                  <span>{CTA.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#E3B896]" />
                </button>

                {/* Captions note (only if captions exist) */}
                {captionsExist && (
                  <p className="text-[13px] text-[#5E6F77] mt-3">
                    Video has captions.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
