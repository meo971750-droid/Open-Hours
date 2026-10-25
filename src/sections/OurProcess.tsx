import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';
import { ChevronRight, Play } from 'lucide-react';
import { config, WayOfWorkingPaletteItem } from '../config';

interface OurProcessProps {
  onOpenAudit?: () => void;
}

// Camera coordinate targets per scene on the 1600x900 town map canvas
const CAMERA_PRESETS: Record<string, { x: number; y: number; zoom: number; mobileZoom: number }> = {
  searches: { x: 740, y: 460, zoom: 1.0, mobileZoom: 1.15 },
  journey: { x: 800, y: 450, zoom: 1.0, mobileZoom: 1.0 },
  solve: { x: 800, y: 450, zoom: 1.0, mobileZoom: 1.0 },
  build: { x: 800, y: 440, zoom: 1.0, mobileZoom: 1.0 },
  findable: { x: 800, y: 450, zoom: 1.4, mobileZoom: 1.55 },
  rank: { x: 800, y: 450, zoom: 1.0, mobileZoom: 1.0 },
  alwaysOn: { x: 800, y: 440, zoom: 1.2, mobileZoom: 1.2 },
  talk: { x: 800, y: 450, zoom: 0.88, mobileZoom: 0.92 },
};

export default function OurProcess({ onOpenAudit }: OurProcessProps) {
  const wwdConfig = config.wayOfWorking;
  const shouldReduceMotion = useReducedMotion() ?? false;
  const sampleTrade = wwdConfig.sampleTrade || 'roofer';
  const sampleTown = wwdConfig.sampleTown || 'Sampletown';

  const trackRef = useRef<HTMLElement>(null);
  const drawingContainerRef = useRef<HTMLDivElement>(null);

  // Ready & Enhanced state (only set after JS verifies without throwing)
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [userRequestedAnimation, setUserRequestedAnimation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stageScale, setStageScale] = useState(1);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scene animation progress in seconds (0 to 8s), driven frame-by-frame by user scroll position
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const scrollTargetRef = useRef({
    targetProgress: 0,
    currentProgress: 0,
  });

  // Active smooth camera state (updated via rAF lerp)
  const cameraRef = useRef({
    currentX: 800,
    currentY: 450,
    currentZoom: 1.0,
    targetX: 800,
    targetY: 450,
    targetZoom: 1.0,
  });

  const [cameraTransform, setCameraTransform] = useState({
    x: 800,
    y: 450,
    zoom: 1.0,
  });

  // Feature flag check: Scene 05 is hidden entirely if googleBusinessProfile, serviceAreaPages and reviewRequests are all false
  const isScene05Enabled = Boolean(
    config.features.googleBusinessProfile ||
    config.features.serviceAreaPages ||
    config.features.reviewRequests
  );

  // Feature flag check: Scene 07 is hidden entirely if voiceAgent, missedCallTextBack and afterHoursAutoReply are all false
  const isScene07Enabled = Boolean(
    config.features.voiceAgent ||
    config.features.missedCallTextBack ||
    config.features.afterHoursAutoReply
  );

  // Conditional flags for Scene 03 cards
  const canShowScene03Card3 = Boolean(
    config.features.missedCallTextBack || config.features.afterHoursAutoReply
  );
  const canShowScene03Card4 = Boolean(config.features.enquiryTracking);

  // Filtered visible scenes, numbered automatically
  const visibleScenes = useMemo(() => {
    return (wwdConfig.scenes || []).filter((s) => {
      if (s.id === 'findable') {
        return isScene05Enabled;
      }
      if (s.id === 'alwaysOn' || s.id === 'always-on') {
        return isScene07Enabled;
      }
      return true;
    });
  }, [wwdConfig.scenes, isScene05Enabled, isScene07Enabled]);

  const totalScenes = visibleScenes.length;
  const activeScene = visibleScenes[activeSceneIndex] || visibleScenes[0];
  const activePalette: WayOfWorkingPaletteItem =
    wwdConfig.palette[activeScene?.id] || {
      bg: '#0B1B2B',
      bg2: '#12303D',
      ink: '#FFFFFF',
      accent: '#F4B860',
      accent2: '#E5484D',
    };

  // Mobile viewport check
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Safe initialization of enhanced mode
  useEffect(() => {
    try {
      if (shouldReduceMotion && !userRequestedAnimation) {
        setIsEnhanced(false);
      } else {
        setIsEnhanced(true);
      }
    } catch {
      setIsEnhanced(false);
    }
  }, [shouldReduceMotion, userRequestedAnimation]);

  // Aspect-fit scale calculation via ResizeObserver on drawing container (1600x900 SVG)
  useEffect(() => {
    const el = drawingContainerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          const scale = Math.min(width / 1600, height / 900);
          setStageScale(scale);
        }
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [isEnhanced]);

  // Scroll listener & rAF loop: drives animations frame-by-frame from user scroll position
  useEffect(() => {
    if (!isEnhanced) {
      setSceneElapsed(8);
      return;
    }

    let isIntersecting = false;
    let rafId: number | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !rafId) {
            rafId = requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0 }
    );

    if (trackRef.current) {
      io.observe(trackRef.current);
    }

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const totalScrollableDistance = trackRef.current.offsetHeight - window.innerHeight;

      if (totalScrollableDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollableDistance));
      scrollTargetRef.current.targetProgress = progress;

      if (!rafId && isIntersecting) {
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const tick = () => {
      if (!isIntersecting) {
        rafId = null;
        return;
      }

      const st = scrollTargetRef.current;
      const progressDelta = st.targetProgress - st.currentProgress;

      // Responsive interpolation (0.22) smooths mouse wheel ticks while keeping tracking immediate
      if (Math.abs(progressDelta) < 0.0001) {
        st.currentProgress = st.targetProgress;
      } else {
        st.currentProgress += progressDelta * 0.22;
      }

      const progress = st.currentProgress;
      setScrollProgress(progress);

      // Map progress across totalScenes: each scene gets an equal segment of scroll
      const rawSceneProgress = progress * (totalScenes - 0.001);
      const nextIndex = Math.max(0, Math.min(totalScenes - 1, Math.floor(rawSceneProgress)));
      const fraction = Math.max(0, Math.min(1, rawSceneProgress - nextIndex));

      // 0 to 0.85 scrubs the scene animation frame-by-frame (0s to 8.0s); 0.85 to 1.0 is a stable hold at 8.0s
      const calculatedElapsed = fraction < 0.85 ? (fraction / 0.85) * 8.0 : 8.0;

      setActiveSceneIndex(nextIndex);
      setSceneElapsed(Math.round(calculatedElapsed * 100) / 100);

      // Camera coordinate target calculation based on active scene and scrubbed beat
      const currentSceneItem = visibleScenes[nextIndex] || visibleScenes[0];
      const basePreset = CAMERA_PRESETS[currentSceneItem?.id] || { x: 800, y: 450, zoom: 1.0, mobileZoom: 1.2 };
      let targetX = basePreset.x;
      let targetY = basePreset.y;
      let targetZoom = isMobile ? basePreset.mobileZoom : basePreset.zoom;

      if (currentSceneItem?.id === 'searches') {
        if (calculatedElapsed >= 2.2) {
          targetX = 640;
          targetY = 460;
          targetZoom = isMobile ? 1.45 : 1.4;
        } else {
          targetX = 740;
          targetY = 460;
          targetZoom = isMobile ? 1.15 : 1.0;
        }
      }

      const cam = cameraRef.current;
      cam.targetX = targetX;
      cam.targetY = targetY;
      cam.targetZoom = targetZoom;

      const camLerp = 0.12;
      cam.currentX += (cam.targetX - cam.currentX) * camLerp;
      cam.currentY += (cam.targetY - cam.currentY) * camLerp;
      cam.currentZoom += (cam.targetZoom - cam.currentZoom) * camLerp;

      setCameraTransform({
        x: Math.round(cam.currentX * 10) / 10,
        y: Math.round(cam.currentY * 10) / 10,
        zoom: Math.round(cam.currentZoom * 100) / 100,
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isEnhanced, totalScenes, visibleScenes, isMobile]);

  // Dynamic synchronized caption based on scene and elapsed beat (all <= 9 words, plain trade language)
  const activeCaption = useMemo(() => {
    if (!activeScene) return '';
    const captions = activeScene.captions || [];
    if (captions.length === 0) return '';

    if (activeScene.id === 'searches') {
      if (sceneElapsed < 2.2) return captions[0] || 'A homeowner needs a roofer tonight.';
      if (sceneElapsed < 4.6) return captions[1] || 'Local roofers show up, each with a website.';
      if (sceneElapsed < 6.4) return captions[2] || 'You are listed, but there is nothing to click.';
      return captions[3] || 'They tap a competitor instead.';
    }

    if (activeScene.id === 'journey') {
      if (sceneElapsed < 3.8) return captions[0] || 'We follow your customer from search to call.';
      return captions[1] || 'Four places where enquiries slip away.';
    }

    if (activeScene.id === 'solve') {
      if (sceneElapsed < 3.8) return captions[0] || 'A direct website guides the customer straight through.';
      return captions[1] || 'The customer reaches you.';
    }

    if (activeScene.id === 'build') {
      if (sceneElapsed < 2.0) return captions[0] || 'We draw the site around one goal.';
      if (sceneElapsed < 5.6) return captions[1] || 'Call button, headline, quote form.';
      return config.features.enquiryTracking
        ? (captions[2] || 'Every enquiry gets confirmed.')
        : 'The quote form takes under a minute.';
    }

    if (activeScene.id === 'findable') {
      const beats: string[] = [];
      if (config.features.googleBusinessProfile) {
        beats.push('Your business profile gets set up properly.');
      }
      if (config.features.serviceAreaPages) {
        beats.push('Pages for the areas you cover.');
      }
      if (config.features.reviewRequests) {
        beats.push('A simple way to ask happy customers.');
      }
      if (beats.length === 0) return '';
      const beatDur = 8.0 / beats.length;
      const bIdx = Math.min(beats.length - 1, Math.floor(sceneElapsed / beatDur));
      return beats[bIdx];
    }

    if (activeScene.id === 'rank') {
      if (sceneElapsed < 2.6) return captions[0] || 'Local rankings build slowly.';
      if (sceneElapsed < 5.2) return captions[1] || 'Groundwork adds up, month by month.';
      return captions[2] || 'Nobody can promise a position. We never do.';
    }

    if (activeScene.id === 'alwaysOn') {
      if (sceneElapsed < 2.0) return captions[0] || 'A call comes in at night.';
      if (sceneElapsed < 4.0) return captions[1] || 'The assistant says it is an AI.';
      if (sceneElapsed < 6.0) return captions[2] || 'Name, job and postcode are taken.';
      return captions[3] || 'The enquiry is logged for the morning.';
    }

    if (activeScene.id === 'talk') {
      if (sceneElapsed < 4.0) return captions[0] || 'Calls route, forms ping, quotes flow.';
      return captions[1] || 'Ready to get more local work?';
    }

    return captions[0] || '';
  }, [activeScene, sceneElapsed]);

  // Scroll to scene index
  const handleScrollToScene = useCallback(
    (sceneIdx: number) => {
      if (!trackRef.current) return;
      const trackRect = trackRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const trackTop = currentScrollY + trackRect.top;
      const totalScrollableDistance = trackRef.current.offsetHeight - window.innerHeight;

      const targetY = trackTop + (sceneIdx / totalScenes) * totalScrollableDistance;
      window.scrollTo({
        top: targetY,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    },
    [totalScenes, shouldReduceMotion]
  );

  // Skip story button: jumps directly to Scene 08 in one click
  const handleSkipStory = useCallback(() => {
    if (activeSceneIndex < totalScenes - 1) {
      handleScrollToScene(totalScenes - 1);
    } else {
      const nextSection = document.getElementById('included') || document.getElementById('pricing');
      if (nextSection) {
        nextSection.scrollIntoView({
          behavior: shouldReduceMotion ? 'auto' : 'smooth',
        });
      }
    }
  }, [activeSceneIndex, totalScenes, handleScrollToScene, shouldReduceMotion]);

  // Scroll vh per scene: 90vh desktop / 70vh mobile
  const scrollVhPerScene = isMobile
    ? wwdConfig.pace.scrollVhPerScene ? Math.min(70, wwdConfig.pace.scrollVhPerScene) : 70
    : (wwdConfig.pace.scrollVhPerScene || 90);
  const trackHeightVh = totalScenes * scrollVhPerScene + 100;

  return (
    <section
      id="process"
      aria-labelledby="wwd-section-title"
      ref={trackRef}
      data-wwd={isEnhanced ? 'enhanced' : undefined}
      className="relative w-full text-[#0F2A35]"
      style={
        isEnhanced
          ? {
              height: `${trackHeightVh}vh`,
              scrollPaddingTop: '1px',
            }
          : undefined
      }
    >
      <h2 id="wwd-section-title" className="sr-only">
        {wwdConfig.title}
      </h2>

      {/* Accessible Skip Link: first focusable element inside the section */}
      <a
        href="#included"
        onClick={(e) => {
          e.preventDefault();
          handleSkipStory();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-[#12303D] focus:text-white focus:text-[14px] focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F4B860]"
      >
        Skip the story and go to what you get
      </a>

      {/* Embedded CSS Engine Styles */}
      <style>{`
        #process {
          --ease-out: cubic-bezier(.22,.8,.24,1);
          --ease-in-out: cubic-bezier(.65,0,.35,1);
          --ease-spring-soft: cubic-bezier(.34,1.3,.5,1);
          --ease-draw: cubic-bezier(.5,0,.2,1);
        }

        /* Default fallback: full static stack visible */
        #process .wwd-fallback-stack {
          display: block;
        }
        #process .wwd-sticky-stage {
          display: none;
        }

        /* Enhanced Mode: pinned sticky stage active, fallback stack hidden */
        #process[data-wwd="enhanced"] .wwd-fallback-stack {
          display: none !important;
        }
        #process[data-wwd="enhanced"] .wwd-sticky-stage {
          display: grid !important;
        }

        @keyframes wwd-word-reveal {
          0% {
            transform: translateY(105%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes wwd-caret {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes wwd-pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @keyframes wwd-ring-pulse-1 {
          0% { transform: scale(1); opacity: 0.45; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes wwd-ring-pulse-2 {
          0% { transform: scale(1); opacity: 0.45; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes wwd-pulse-soft {
          0% { transform: scale(1); opacity: 0.45; }
          100% { transform: scale(1.35); opacity: 0; }
        }

        @keyframes wwd-scene-fade {
          0% { transform: scale(0.98); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes wwd-check-draw {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ========================================================= */}
      {/* 1. STATIC FALLBACK STACK (Always in DOM; readable default) */}
      {/* ========================================================= */}
      <div className="wwd-fallback-stack w-full max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12303D]/[0.06] text-[12px] font-semibold uppercase tracking-wider text-[#12303D] mb-3">
            <span>{wwdConfig.storyLabel}</span>
          </div>
          <h3 className="text-[28px] sm:text-[38px] font-normal tracking-[-0.02em] leading-tight text-[#0F2A35]">
            {wwdConfig.title}
          </h3>
          {shouldReduceMotion && (
            <button
              type="button"
              onClick={() => {
                setUserRequestedAnimation(true);
                setIsEnhanced(true);
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12303D] text-white text-[13px] font-medium hover:bg-[#1E4A5C] transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Show animated story</span>
            </button>
          )}
        </div>

        {visibleScenes.map((scene, idx) => {
          const pal = wwdConfig.palette[scene.id] || activePalette;
          const numStr = String(idx + 1).padStart(2, '0');
          const totalStr = String(totalScenes).padStart(2, '0');

          return (
            <article
              key={scene.id}
              className="rounded-[24px] p-6 sm:p-10 border transition-all duration-300"
              style={{
                backgroundColor: pal.bg,
                color: pal.ink,
                borderColor: `${pal.accent}33`,
                boxShadow:
                  pal.bg === '#0B1B2B' || pal.bg === '#12304A' || pal.bg === '#1B1F4B' || pal.bg === '#0A1220' || pal.bg === '#12303D'
                    ? '0 20px 40px -20px rgba(0,0,0,0.35)'
                    : '0 18px 36px -22px rgba(18,48,61,0.35)',
              }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${pal.accent}22`,
                    color: pal.accent,
                  }}
                >
                  {wwdConfig.storyLabel}
                </span>
                <span className="font-mono text-[14px] font-bold tabular-nums" style={{ color: pal.accent }}>
                  {numStr} / {totalStr}
                </span>
              </div>

              {/* Headline */}
              <h4 className="text-[24px] sm:text-[32px] font-semibold tracking-[-0.02em] leading-[1.12] mb-5">
                {scene.title.split(' ').map((word, wIdx) => {
                  const isAccent = word.toLowerCase().includes(scene.accentWord.toLowerCase().replace(/[^a-z]/g, ''));
                  return (
                    <span
                      key={wIdx}
                      className={isAccent ? 'font-serif italic mr-1.5' : 'mr-1.5'}
                      style={{ color: isAccent ? pal.accent : pal.ink }}
                    >
                      {word}
                    </span>
                  );
                })}
              </h4>

              {/* Static Canvas Representation */}
              <div
                className="w-full aspect-[16/9] rounded-[16px] overflow-hidden my-6 border flex items-center justify-center relative"
                style={{
                  backgroundColor: pal.bg2,
                  borderColor: `${pal.accent}26`,
                }}
              >
                <StylizedStageView
                  palette={pal}
                  activeSceneId={scene.id}
                  sceneElapsed={8}
                  isStatic={true}
                  camX={CAMERA_PRESETS[scene.id]?.x || 800}
                  camY={CAMERA_PRESETS[scene.id]?.y || 450}
                  camZoom={CAMERA_PRESETS[scene.id]?.zoom || 1.0}
                  sampleTrade={sampleTrade}
                  sampleTown={sampleTown}
                  sampleAreas={wwdConfig.sampleAreas}
                  canShowCard3={canShowScene03Card3}
                  canShowCard4={canShowScene03Card4}
                  onOpenAudit={onOpenAudit}
                  isMobile={false}
                />
              </div>

              {/* Caption */}
              <p className="text-[16px] sm:text-[18px] font-medium max-w-[44ch] leading-relaxed opacity-90">
                {scene.captions?.[scene.captions.length - 1] || scene.captions?.[0]}
              </p>
            </article>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 2. ENHANCED PINNED STAGE (Sticky 100svh viewport)         */}
      {/* ========================================================= */}
      <div
        className="wwd-sticky-stage sticky top-0 left-0 w-full overflow-hidden"
        style={{
          height: '100svh',
          backgroundColor: activePalette.bg,
          color: activePalette.ink,
          transition: `background-color ${wwdConfig.pace.sceneTransition * 1000}ms var(--ease-out), color ${wwdConfig.pace.sceneTransition * 1000}ms var(--ease-out)`,
          gridTemplateRows: isMobile ? '22% 52% 14% 12%' : '24% 56% 12% 8%',
          paddingLeft: 'clamp(20px, 5vw, 72px)',
          paddingRight: 'clamp(20px, 5vw, 72px)',
          '--bg': activePalette.bg,
          '--bg2': activePalette.bg2,
          '--ink': activePalette.ink,
          '--accent': activePalette.accent,
          '--accent2': activePalette.accent2,
        } as React.CSSProperties}
      >
        {/* Static 3% Grain Noise Overlay (SVG feTurbulence) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] select-none"
          aria-hidden="true"
        >
          <filter id="wwd-noise-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#wwd-noise-filter)" />
        </svg>

        {/* ------------------------------------------------------- */}
        {/* ZONE 1: HEADER (0 - 24% desktop / 0 - 22% mobile)       */}
        {/* ------------------------------------------------------- */}
        <header className="w-full h-full flex flex-col justify-end pb-3 text-center z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.08em] border"
              style={{
                backgroundColor: `${activePalette.accent}18`,
                color: activePalette.accent,
                borderColor: `${activePalette.accent}40`,
              }}
            >
              <span>{wwdConfig.storyLabel}</span>
            </div>

            <span
              className="font-mono text-[13px] sm:text-[14px] font-bold tabular-nums tracking-wide"
              style={{ color: activePalette.accent }}
            >
              {String(activeSceneIndex + 1).padStart(2, '0')} / {String(totalScenes).padStart(2, '0')}
            </span>
          </div>

          {/* Kinetic Headline */}
          <div className="max-w-4xl mx-auto px-2">
            <h3
              key={activeScene.id}
              className="font-heading font-semibold tracking-[-0.02em] leading-[1.08] text-center"
              style={{
                fontSize: isMobile ? 'clamp(20px, 5.5vw, 26px)' : 'clamp(26px, 3.4vw, 52px)',
              }}
              aria-label={activeScene.title}
            >
              <span className="inline-flex flex-wrap justify-center gap-x-[0.28em] gap-y-0.5" aria-hidden="true">
                {activeScene.title.split(' ').map((word, wIdx) => {
                  const isAccent = word.toLowerCase().includes(activeScene.accentWord.toLowerCase().replace(/[^a-z]/g, ''));
                  return (
                    <span key={`${activeScene.id}-${wIdx}-${word}`} className="inline-block overflow-hidden pb-0.5">
                      <span
                        className="inline-block"
                        style={{
                          animation: shouldReduceMotion
                            ? 'none'
                            : `wwd-word-reveal 520ms var(--ease-out) ${wIdx * 70}ms both`,
                        }}
                      >
                        <span
                          className={isAccent ? 'font-serif italic' : ''}
                          style={{
                            color: isAccent ? 'var(--accent)' : 'var(--ink)',
                          }}
                        >
                          {word}
                        </span>
                      </span>
                    </span>
                  );
                })}
              </span>
            </h3>
          </div>
        </header>

        {/* ------------------------------------------------------- */}
        {/* ZONE 2: DRAWING AREA (24 - 80% desktop / 22 - 74% mobile) */}
        {/* ------------------------------------------------------- */}
        <div
          ref={drawingContainerRef}
          className="w-full h-full flex items-center justify-center overflow-hidden relative"
        >
          {/* Aspect-fit container for 1600x900 canvas */}
          <div
            className="relative flex items-center justify-center rounded-[20px] overflow-hidden border shadow-lg"
            style={{
              width: 'min(100%, calc(100cqh * 16 / 9))',
              height: '100%',
              backgroundColor: activePalette.bg2,
              borderColor: `${activePalette.accent}26`,
              boxShadow:
                activePalette.bg === '#0B1B2B' || activePalette.bg === '#12304A' || activePalette.bg === '#1B1F4B' || activePalette.bg === '#0A1220' || activePalette.bg === '#12303D'
                  ? '0 20px 40px -20px rgba(0,0,0,0.35)'
                  : '0 18px 36px -22px rgba(18,48,61,0.35)',
            }}
          >
            {/* 1600x900 Coordinate Canvas scaled by stageScale */}
            <div
              className="absolute origin-center transition-transform duration-75 ease-out"
              style={{
                width: 1600,
                height: 900,
                transform: `scale(${stageScale})`,
              }}
            >
              <StylizedStageView
                palette={activePalette}
                activeSceneId={activeScene.id}
                sceneElapsed={sceneElapsed}
                camX={cameraTransform.x}
                camY={cameraTransform.y}
                camZoom={cameraTransform.zoom}
                sampleTrade={sampleTrade}
                sampleTown={sampleTown}
                sampleAreas={wwdConfig.sampleAreas}
                canShowCard3={canShowScene03Card3}
                canShowCard4={canShowScene03Card4}
                onOpenAudit={onOpenAudit}
                scrollProgress={scrollProgress}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* ZONE 3: CAPTION (80 - 92% desktop / 76 - 90% mobile)    */}
        {/* ------------------------------------------------------- */}
        <div className="w-full h-full flex items-center justify-center text-center px-4 z-10">
          <p
            className="font-medium leading-[1.35] transition-opacity duration-300"
            style={{
              fontSize: isMobile ? '16px' : '20px',
              maxWidth: isMobile ? '28ch' : '44ch',
              color: 'var(--ink)',
            }}
          >
            {activeCaption}
          </p>

          {/* Polite live region for accessibility (announces on scene/beat change) */}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {activeCaption}
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* ZONE 4: CONTROLS (94 - 98% desktop / 92 - 98% mobile)   */}
        {/* ------------------------------------------------------- */}
        <footer className="w-full h-full flex items-center justify-between gap-4 z-10 border-t border-[rgba(255,255,255,0.08)]">
          {/* Left: Active Scene Label */}
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.08em] truncate"
              style={{ color: activePalette.accent }}
            >
              {String(activeSceneIndex + 1).padStart(2, '0')} · {activeScene.id}
            </span>
          </div>

          {/* Center: Slim Progress Rail with clickable dots */}
          <nav
            aria-label="Scene progress"
            className="flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm"
          >
            {visibleScenes.map((s, dotIdx) => {
              const isActive = dotIdx === activeSceneIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleScrollToScene(dotIdx)}
                  aria-label={`Go to scene ${dotIdx + 1}: ${s.title}`}
                  className="group relative p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded-full cursor-pointer transition-transform duration-150 active:scale-95"
                  style={{
                    outlineColor: activePalette.accent,
                  }}
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive ? 'w-4 sm:w-5 h-2' : 'w-2 h-2 opacity-55 hover:opacity-95'
                    }`}
                    style={{
                      backgroundColor: isActive ? activePalette.accent : '#FFFFFF',
                    }}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right: Visible Skip Story Button (meets AA contrast across dark and light grades) */}
          <div>
            <button
              type="button"
              onClick={handleSkipStory}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer border shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor:
                  activePalette.bg === '#0B1B2B' ||
                  activePalette.bg === '#12304A' ||
                  activePalette.bg === '#1B1F4B' ||
                  activePalette.bg === '#0A1220' ||
                  activePalette.bg === '#12303D'
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(18,48,61,0.08)',
                color: activePalette.ink,
                borderColor: `${activePalette.ink}35`,
              }}
            >
              <span>Skip story</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}

// =========================================================================
// STYLIZED STAGE VIEW: 1600x900 Coordinate Canvas
// Handles scenes 01, 02, 03 and placeholders for 04-08
// =========================================================================
interface StylizedStageViewProps {
  palette: WayOfWorkingPaletteItem;
  activeSceneId: string;
  sceneElapsed: number;
  camX: number;
  camY: number;
  camZoom: number;
  sampleTrade: string;
  sampleTown?: string;
  sampleAreas?: string[];
  canShowCard3: boolean;
  canShowCard4: boolean;
  onOpenAudit?: () => void;
  scrollProgress?: number;
  isStatic?: boolean;
  isMobile?: boolean;
}

function StylizedStageView({
  palette,
  activeSceneId,
  sceneElapsed,
  camX,
  camY,
  camZoom,
  sampleTrade,
  sampleTown = 'Sampletown',
  sampleAreas,
  canShowCard3,
  canShowCard4,
  onOpenAudit,
  scrollProgress = 0,
  isStatic = false,
  isMobile = false,
}: StylizedStageViewProps) {
  const cameraTransformStyle = `translate(${800 - camX * camZoom}px, ${450 - camY * camZoom}px) scale(${camZoom})`;

  // Subtle scroll-driven parallax offsets (far 0.4x, near 1.0x, max 24px total offset)
  const farOffset = isStatic ? 0 : Math.round((scrollProgress - 0.5) * 24 * 0.4);
  const nearOffset = isStatic ? 0 : Math.round((scrollProgress - 0.5) * 24 * 1.0);

  // Search query text typed character by character in Scene 01 Beat 1
  const targetQuery = `${sampleTrade} near me`;
  const charsTyped = Math.max(0, Math.min(targetQuery.length, Math.floor(Math.max(0, sceneElapsed - 0.4) / 0.045)));
  const typedSearchText = sceneElapsed >= 2.0 ? targetQuery : targetQuery.slice(0, charsTyped);

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      <svg
        viewBox="0 0 1600 900"
        className="w-full h-full absolute inset-0"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="wwd-static-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* 1. PERSISTENT MAP LAYER (<g id="town">)                       */}
        {/* ------------------------------------------------------------- */}
        <g
          id="town"
          style={
            !isStatic
              ? {
                  transform: cameraTransformStyle,
                  transformOrigin: '0 0',
                  willChange: 'transform',
                  opacity:
                    activeSceneId === 'journey' || activeSceneId === 'solve'
                      ? 0.06
                      : activeSceneId === 'build' || activeSceneId === 'rank'
                      ? 0
                      : activeSceneId === 'alwaysOn'
                      ? 0.30
                      : activeSceneId === 'talk'
                      ? 0.12
                      : 1,
                  transition: 'opacity 800ms var(--ease-out)',
                }
              : {
                  opacity:
                    activeSceneId === 'journey' || activeSceneId === 'solve'
                      ? 0.06
                      : activeSceneId === 'build' || activeSceneId === 'rank'
                      ? 0
                      : activeSceneId === 'alwaysOn'
                      ? 0.30
                      : activeSceneId === 'talk'
                      ? 0.12
                      : 1,
                }
          }
        >
          {/* Far Layer: Town Land Backdrop and River with subtle 0.4x parallax */}
          <g id="town-far" transform={`translate(0, ${farOffset})`}>
            {/* Town Land Backdrop */}
            <rect x="0" y="0" width="1600" height="900" fill={palette.bg2} />

            {/* Calm River / Coast Curve */}
            <path
              d="M 0,260 C 350,220 620,310 950,240 C 1220,180 1450,240 1600,210 L 1600,320 C 1450,350 1220,290 950,350 C 620,420 350,330 0,370 Z"
              fill={`${palette.ink}0A`}
            />
          </g>

          {/* Near Layer: Street blocks, trees, and roadways with 1.0x parallax */}
          <g id="town-near" transform={`translate(0, ${nearOffset})`}>

          {/* Soft rounded street blocks & parcels */}
          <g stroke={`${palette.ink}15`} strokeWidth="1" fill={`${palette.ink}06`}>
            {/* North District */}
            <rect x="120" y="80" width="220" height="130" rx="12" />
            <rect x="380" y="70" width="260" height="140" rx="12" />
            <rect x="680" y="90" width="240" height="120" rx="12" />
            <rect x="960" y="60" width="280" height="130" rx="12" />
            <rect x="1280" y="80" width="220" height="120" rx="12" />

            {/* Central District */}
            <rect x="100" y="400" width="240" height="160" rx="14" />
            <rect x="380" y="390" width="180" height="170" rx="14" />
            <rect x="600" y="380" width="160" height="180" rx="14" />
            <rect x="880" y="380" width="190" height="180" rx="14" />
            <rect x="1110" y="390" width="200" height="160" rx="14" />
            <rect x="1350" y="410" width="180" height="150" rx="14" />

            {/* South District */}
            <rect x="140" y="620" width="260" height="190" rx="14" />
            <rect x="440" y="610" width="290" height="200" rx="14" />
            <rect x="770" y="620" width="310" height="190" rx="14" />
            <rect x="1120" y="600" width="360" height="210" rx="14" />
          </g>

          {/* 3 Tree Clusters as Simple Calm Circles */}
          <g fill={`${palette.accent}18`}>
            {/* Tree Cluster 1 (West Park) */}
            <circle cx="280" cy="330" r="28" />
            <circle cx="308" cy="342" r="22" />
            <circle cx="260" cy="348" r="18" />

            {/* Tree Cluster 2 (Central Riverside) */}
            <circle cx="860" cy="320" r="32" />
            <circle cx="896" cy="332" r="24" />
            <circle cx="832" cy="336" r="20" />

            {/* Tree Cluster 3 (East Hill) */}
            <circle cx="1320" cy="270" r="30" />
            <circle cx="1354" cy="284" r="22" />
            <circle cx="1292" cy="288" r="18" />
          </g>

          {/* Roadways: Main East-West & North-South Axis */}
          <line x1="0" y1="580" x2="1600" y2="580" stroke={`${palette.ink}1C`} strokeWidth="18" />
          <line x1="0" y1="580" x2="1600" y2="580" stroke={`${palette.accent}30`} strokeWidth="2" strokeDasharray="16 12" />

          <line x1="800" y1="0" x2="800" y2="900" stroke={`${palette.ink}1C`} strokeWidth="18" />
          <line x1="800" y1="0" x2="800" y2="900" stroke={`${palette.accent}30`} strokeWidth="2" strokeDasharray="16 12" />

          {/* Central Roundabout */}
          <circle cx="800" cy="580" r="48" fill={palette.bg2} stroke={`${palette.ink}2A`} strokeWidth="18" />
          <circle cx="800" cy="580" r="30" fill={`${palette.accent}14`} />

          {/* Subtle Night Window Light Dots in Scene 01 (12 dots, 2 pulsing) */}
          {activeSceneId === 'searches' && (
            <g fill="#F4B860">
              <circle cx="200" cy="140" r="2.5" opacity="0.6" />
              <circle cx="460" cy="120" r="2.5" opacity="0.7" />
              <circle cx="720" cy="130" r="3" style={{ animation: isStatic ? 'none' : 'wwd-pulse-slow 3.2s ease-in-out infinite' }} />
              <circle cx="1040" cy="110" r="2.5" opacity="0.5" />
              <circle cx="1360" cy="130" r="2.5" opacity="0.65" />

              <circle cx="180" cy="460" r="2.5" opacity="0.6" />
              <circle cx="430" cy="450" r="2.5" opacity="0.5" />
              <circle cx="940" cy="440" r="3" style={{ animation: isStatic ? 'none' : 'wwd-pulse-slow 3.2s ease-in-out infinite' }} />
              <circle cx="1200" cy="450" r="2.5" opacity="0.7" />
              <circle cx="1420" cy="460" r="2.5" opacity="0.5" />

              <circle cx="520" cy="680" r="2.5" opacity="0.6" />
              <circle cx="1220" cy="670" r="2.5" opacity="0.55" />
            </g>
          )}

          {/* Homeowner House with Lit Window (Beat 1: lit window + phone glow only, no person) */}
          {activeSceneId === 'searches' && (
            <g transform="translate(340, 460)">
              {/* House roof & wall */}
              <path d="M 0,-30 L 32,-6 L 32,24 L -32,24 L -32,-6 Z" fill={`${palette.ink}20`} stroke={`${palette.ink}35`} strokeWidth="2" />
              {/* Lit Window with warm glow */}
              <rect x="-12" y="-2" width="24" height="20" rx="3" fill="#F4B860" />
              {/* Phone glow beam */}
              <ellipse cx="0" cy="8" rx="20" ry="12" fill="#F4B860" opacity="0.3" />
            </g>
          )}

          {/* Scene 01 Pins on Town Map */}
          {activeSceneId === 'searches' && (
            <>
              {/* Competitor Pin A (Drops in Beat 2) */}
              <g
                transform="translate(680, 410)"
                style={{
                  opacity: sceneElapsed >= 2.2 ? 1 : 0,
                  transform: sceneElapsed >= 2.2 ? 'translate(680px, 410px) scale(1)' : 'translate(680px, 386px) scale(0.8)',
                  transition: 'transform 500ms var(--ease-spring-soft), opacity 400ms var(--ease-out)',
                }}
              >
                <TeardropPin
                  color="#5E6F77"
                  label={`Local ${sampleTrade} A`}
                  subline="Website"
                  hasWebsite
                  isDimmed={sceneElapsed >= 4.6}
                />
              </g>

              {/* Competitor Pin B (Drops in Beat 2, Tapped in Beat 4) */}
              <g
                transform="translate(860, 380)"
                style={{
                  opacity: sceneElapsed >= 2.34 ? 1 : 0,
                  transform:
                    sceneElapsed >= 6.4
                      ? 'translate(860px, 380px) scale(1.12)'
                      : sceneElapsed >= 2.34
                      ? 'translate(860px, 380px) scale(1)'
                      : 'translate(860px, 356px) scale(0.8)',
                  transition: 'transform 500ms var(--ease-spring-soft), opacity 400ms var(--ease-out)',
                }}
              >
                {/* Red tap ripple landing in Beat 4 */}
                {sceneElapsed >= 6.4 && (
                  <circle
                    cx="0"
                    cy="0"
                    r="40"
                    fill="none"
                    stroke="#E5484D"
                    strokeWidth="3"
                    opacity={0.4}
                  />
                )}
                <TeardropPin
                  color={sceneElapsed >= 6.4 ? '#E5484D' : '#5E6F77'}
                  label={`Local ${sampleTrade} B`}
                  subline="Website"
                  hasWebsite
                  isHighlighted={sceneElapsed >= 6.4}
                  isDimmed={false}
                />
              </g>

              {/* Competitor Pin C (Drops in Beat 2) */}
              <g
                transform="translate(1010, 440)"
                style={{
                  opacity: sceneElapsed >= 2.48 ? 1 : 0,
                  transform: sceneElapsed >= 2.48 ? 'translate(1010px, 440px) scale(1)' : 'translate(1010px, 416px) scale(0.8)',
                  transition: 'transform 500ms var(--ease-spring-soft), opacity 400ms var(--ease-out)',
                }}
              >
                <TeardropPin
                  color="#5E6F77"
                  label={`Local ${sampleTrade} C`}
                  subline="Website"
                  hasWebsite
                  isDimmed={sceneElapsed >= 4.6}
                />
              </g>

              {/* Your Business Pin (Drops in Beat 3 in Amber #F4B860 with broken link) */}
              <g
                transform="translate(780, 480)"
                style={{
                  opacity: sceneElapsed >= 4.6 ? 1 : 0,
                  transform: sceneElapsed >= 4.6 ? 'translate(780px, 480px) scale(1)' : 'translate(780px, 456px) scale(0.8)',
                  filter: sceneElapsed >= 6.4 ? 'saturate(0.6)' : 'none',
                  transition: 'transform 550ms var(--ease-spring-soft), opacity 450ms var(--ease-out), filter 500ms var(--ease-out)',
                }}
              >
                <TeardropPin
                  color="#F4B860"
                  label="Your business"
                  subline="Listed, no website"
                  hasBrokenLink
                  isYourBusiness
                  isDimmed={sceneElapsed >= 6.4}
                />
              </g>
            </>
          )}

          {/* Default Business Pin if any other scene */}
          {activeSceneId !== 'searches' &&
            activeSceneId !== 'journey' &&
            activeSceneId !== 'solve' &&
            activeSceneId !== 'build' &&
            activeSceneId !== 'findable' &&
            activeSceneId !== 'rank' &&
            activeSceneId !== 'alwaysOn' &&
            activeSceneId !== 'talk' && (
            <g transform="translate(820, 460)">
              <TeardropPin color={palette.accent} label="Your business" isYourBusiness />
            </g>
          )}
          </g>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 2. SCENE 01: PERSISTENT PHONE OBJECT (300x610)                */}
        {/* ------------------------------------------------------------- */}
        {activeSceneId === 'searches' && (
          <g
            transform={
              isMobile
                ? 'translate(800, 500) scale(0.78)'
                : 'translate(460, 490) scale(0.92)'
            }
            style={{
              transform:
                sceneElapsed >= 0.2
                  ? isMobile
                    ? 'translate(800px, 500px) scale(0.78)'
                    : 'translate(460px, 490px) scale(0.92)'
                  : isMobile
                  ? 'translate(800px, 540px) scale(0.78)'
                  : 'translate(460px, 530px) scale(0.92)',
              opacity: sceneElapsed >= 0.1 ? 1 : 0,
              transition: 'transform 700ms var(--ease-out), opacity 600ms var(--ease-out)',
            }}
          >
            {/* Phone Shadow */}
            <rect x="-156" y="-310" width="312" height="620" rx="46" fill="#000000" opacity="0.32" />

            {/* Phone 8px Bezel in near-black #0E151B */}
            <rect x="-150" y="-305" width="300" height="610" rx="44" fill="#0E151B" stroke={`${palette.accent}40`} strokeWidth="1.5" />

            {/* Inner Screen 284x594 with 36px radius */}
            <rect x="-142" y="-297" width="284" height="594" rx="36" fill="#0B1B2B" />

            {/* Punch-hole camera (notch-less) */}
            <circle cx="0" cy="-276" r="4.5" fill="#05080A" stroke="#1E2832" strokeWidth="1" />

            {/* Screen UI: Status bar */}
            <text x="-114" y="-272" fill="#FFFFFF" fontSize="11" fontWeight="600" opacity="0.8">9:41</text>
            <circle cx="118" cy="-275" r="3" fill="#FFFFFF" opacity="0.7" />
            <rect x="100" y="-278" width="12" height="6" rx="2" fill="#FFFFFF" opacity="0.7" />

            {/* Search Input Field */}
            <g transform="translate(0, -220)">
              <rect x="-124" y="-18" width="248" height="38" rx="19" fill="#162736" stroke="#253D50" strokeWidth="1" />
              {/* Search magnifying icon */}
              <circle cx="-100" cy="1" r="5" fill="none" stroke="#F4B860" strokeWidth="1.5" />
              <line x1="-96" y1="5" x2="-91" y2="10" stroke="#F4B860" strokeWidth="1.5" strokeLinecap="round" />

              {/* Typed Search Query with blinking caret */}
              <text x="-80" y="5" fill="#FFFFFF" fontSize="13.5" fontWeight="500">
                {typedSearchText}
              </text>

              {sceneElapsed < 2.2 && (
                <line
                  x1={-80 + typedSearchText.length * 7.5}
                  y1="-6"
                  x2={-80 + typedSearchText.length * 7.5}
                  y2="8"
                  stroke="#F4B860"
                  strokeWidth="2"
                  style={{ animation: 'wwd-caret 1s steps(1) infinite' }}
                />
              )}
            </g>

            {/* Map view on phone screen in Beat 2+ */}
            {sceneElapsed >= 2.0 && (
              <g transform="translate(0, 10)">
                <rect x="-126" y="-170" width="252" height="420" rx="16" fill="#122533" />
                {/* Mini road lines */}
                <line x1="-126" y1="-20" x2="126" y2="-20" stroke="#1F3647" strokeWidth="8" />
                <line x1="0" y1="-170" x2="0" y2="250" stroke="#1F3647" strokeWidth="8" />

                {/* Mini Pins on Phone Screen */}
                <circle cx="-45" cy="-70" r="7" fill="#5E6F77" />
                <circle cx="35" cy="-90" r="7" fill={sceneElapsed >= 6.4 ? '#E5484D' : '#5E6F77'} />
                <circle cx="50" cy="40" r="7" fill="#5E6F77" />
                <circle cx="-10" cy="-10" r="8" fill="#F4B860" />

                {/* Phone bottom search result pill */}
                <g transform="translate(0, 180)">
                  <rect x="-114" y="-30" width="228" height="52" rx="12" fill="#0B1B2B" stroke="#253D50" strokeWidth="1" />
                  <circle cx="-90" cy="-4" r="8" fill={sceneElapsed >= 6.4 ? '#E5484D' : '#5E6F77'} />
                  <text x="-74" y="-8" fill="#FFFFFF" fontSize="11" fontWeight="600">
                    Local {sampleTrade} B
                  </text>
                  <text x="-74" y="8" fill="#6B8594" fontSize="10">
                    4.9 ★ · Website
                  </text>
                  <line x1="-38" y1="10" x2="-4" y2="10" stroke="#F4B860" strokeWidth="1.5" />
                </g>
              </g>
            )}
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. SCENES 02 & 03: WAVE PATH & 4 CARDS (Horizontal / Vertical) */}
        {/* ------------------------------------------------------------- */}
        {(activeSceneId === 'journey' || activeSceneId === 'solve') && (
          <JourneySolveChoreography
            activeSceneId={activeSceneId}
            palette={palette}
            sceneElapsed={sceneElapsed}
            canShowCard3={canShowCard3}
            canShowCard4={canShowCard4}
            isMobile={isMobile}
            isStatic={isStatic}
          />
        )}

        {/* ------------------------------------------------------------- */}
        {/* 4. SCENE 04: BUILD (Blueprint, Wireframe, Form, Inbox)         */}
        {/* ------------------------------------------------------------- */}
        {activeSceneId === 'build' && (
          <SceneBuildChoreography
            palette={palette}
            sceneElapsed={sceneElapsed}
            sampleTown={sampleTown}
            sampleTrade={sampleTrade}
            hasEnquiryTracking={canShowCard4}
            isMobile={isMobile}
            isStatic={isStatic}
          />
        )}

        {/* ------------------------------------------------------------- */}
        {/* 5. SCENE 05: FINDABLE (Daylight Map, GBP, Areas, Reviews)     */}
        {/* ------------------------------------------------------------- */}
        {activeSceneId === 'findable' && (
          <SceneFindableChoreography
            palette={palette}
            sceneElapsed={sceneElapsed}
            sampleTrade={sampleTrade}
            sampleAreas={sampleAreas}
            features={{
              googleBusinessProfile: config.features.googleBusinessProfile,
              serviceAreaPages: config.features.serviceAreaPages,
              reviewRequests: config.features.reviewRequests,
            }}
            isMobile={isMobile}
            isStatic={isStatic}
          />
        )}

        {/* ------------------------------------------------------------- */}
        {/* 6. SCENE 06: RANK (Navy-to-Dawn Crossfade, Ladder Chart)      */}
        {/* ------------------------------------------------------------- */}
        {activeSceneId === 'rank' && (
          <SceneRankChoreography
            palette={palette}
            sceneElapsed={sceneElapsed}
            isMobile={isMobile}
            isStatic={isStatic}
          />
        )}

        {/* ------------------------------------------------------------- */}
        {/* 7. SCENE 07: ALWAYS ON (Night Phone, Voice Assistant, SMS)     */}
        {/* ------------------------------------------------------------- */}
        {activeSceneId === 'alwaysOn' && (
          <SceneAlwaysOnChoreography
            palette={palette}
            sceneElapsed={sceneElapsed}
            sampleTrade={sampleTrade}
            isMobile={isMobile}
            isStatic={isStatic}
          />
        )}

        {/* ------------------------------------------------------------- */}
        {/* 8. SCENE 08: TALK (Connected Network Map, 4 Pillars, Action)  */}
        {/* ------------------------------------------------------------- */}
        {activeSceneId === 'talk' && (
          <SceneTalkChoreography
            palette={palette}
            sceneElapsed={sceneElapsed}
            sampleTrade={sampleTrade}
            sampleTown={sampleTown}
            onOpenAudit={onOpenAudit}
            isMobile={isMobile}
            isStatic={isStatic}
          />
        )}
      </svg>
    </div>
  );
}

// =========================================================================
// CHOREOGRAPHY FOR SCENE 02 (Journey) & SCENE 03 (Solve)
// Reuses the wave path and cards with healing gap animation and crossfades
// =========================================================================
interface JourneySolveProps {
  activeSceneId: string;
  palette: WayOfWorkingPaletteItem;
  sceneElapsed: number;
  canShowCard3: boolean;
  canShowCard4: boolean;
  isMobile: boolean;
  isStatic?: boolean;
}

function JourneySolveChoreography({
  activeSceneId,
  palette,
  sceneElapsed,
  canShowCard3,
  canShowCard4,
  isMobile,
  isStatic = false,
}: JourneySolveProps) {
  const isSolve = activeSceneId === 'solve';

  // 4 friction points vs 4 fixes
  const rawCards = [
    {
      num: '01',
      frictionTitle: 'No website to click',
      fixTitle: 'A clear website with one next step',
      iconType: 'blank-page',
      fixIconType: 'check-circle',
      anchorX: 360,
      anchorY: 380,
      cardY: 170, // above path
      mobileY: 130,
    },
    {
      num: '02',
      frictionTitle: 'Hard to contact on mobile',
      fixTitle: 'Call and quote buttons on every page',
      iconType: 'dotted-phone',
      fixIconType: 'call-button',
      anchorX: 720,
      anchorY: 520,
      cardY: 570, // below path
      mobileY: 310,
    },
    {
      num: '03',
      frictionTitle: 'Missed call after hours',
      fixTitle: 'Missed calls handled',
      iconType: 'moon-phone',
      fixIconType: 'auto-reply',
      anchorX: 1080,
      anchorY: 380,
      cardY: 170, // above path
      mobileY: 490,
      enabled: isSolve ? canShowCard3 : true,
    },
    {
      num: '04',
      frictionTitle: 'No follow-up, so it goes cold',
      fixTitle: 'Every enquiry confirmed and logged',
      iconType: 'thermometer',
      fixIconType: 'inbox-log',
      anchorX: 1400,
      anchorY: 520,
      cardY: 570, // below path
      mobileY: 670,
      enabled: isSolve ? canShowCard4 : true,
    },
  ];

  // Filter cards if feature flags disable card 3 or 4 in Scene 03
  const cards = rawCards.filter((c) => c.enabled !== false);

  // Path drawing progress (0 to 1 over 3.2s)
  const drawProgress = isStatic ? 1 : Math.min(1, Math.max(0, sceneElapsed / 3.2));
  const pathColor = isSolve ? '#1E9E6A' : '#C8642E';

  return (
    <g transform="translate(0, 0)">
      {/* 1. Blurred Numerals Background Layer (Static blur filter, 140px, 10% opacity) */}
      <g>
        {cards.map((c, idx) => {
          // Card visibility timing based on draw progress
          const triggerProgress = (idx + 0.3) / cards.length;
          const isTriggered = isStatic || isSolve || drawProgress >= triggerProgress;

          const xPos = c.anchorX;
          const yPos = c.cardY < 400 ? c.cardY + 80 : c.cardY + 140;

          return (
            <text
              key={`num-${c.num}`}
              x={xPos}
              y={yPos}
              textAnchor="middle"
              fill={pathColor}
              fontSize={isMobile ? '96' : '140'}
              fontWeight="800"
              opacity={isTriggered ? 0.10 : 0}
              filter="url(#wwd-static-blur)"
              className="transition-opacity duration-500 ease-out select-none"
            >
              {c.num}
            </text>
          );
        })}
      </g>

      {/* 2. Wave Path Layer */}
      {/* Horizontal on Desktop, Single Clean SVG Wave Path */}
      {!isMobile ? (
        <path
          d="M 120,450 C 260,340 380,340 540,450 C 680,560 800,560 940,450 C 1080,340 1200,340 1340,450 L 1520,450"
          fill="none"
          stroke={pathColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1600"
          strokeDashoffset={isStatic ? 0 : 1600 * (1 - drawProgress)}
          className="transition-colors duration-700 ease-out"
        />
      ) : (
        /* Vertical on Mobile */
        <path
          d="M 60,60 C 140,200 40,360 120,500 C 40,640 140,760 80,860"
          fill="none"
          stroke={pathColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={isStatic ? 0 : 1000 * (1 - drawProgress)}
          className="transition-colors duration-700 ease-out"
        />
      )}

      {/* Break Marks (Scene 02: gaps with 2 ticks; Scene 03: healing closure) */}
      {cards.map((c, idx) => {
        const triggerProgress = (idx + 0.35) / cards.length;
        const isTriggered = isStatic || isSolve || drawProgress >= triggerProgress;
        if (!isTriggered) return null;

        // In Scene 03, the gap ticks slide together (healing animation)
        const tickSpread = isSolve ? (sceneElapsed >= 1.2 ? 0 : 6) : 6;

        return (
          <g
            key={`break-${c.num}`}
            transform={`translate(${c.anchorX}, ${c.anchorY})`}
            className="transition-transform duration-500 ease-out"
          >
            {/* Break mask / gap circle */}
            <circle cx="0" cy="0" r={tickSpread + 5} fill={palette.bg2} />

            {/* Tick 1 */}
            <line
              x1={-tickSpread}
              y1="-10"
              x2={-tickSpread}
              y2="10"
              stroke={pathColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
            {/* Tick 2 */}
            <line
              x1={tickSpread}
              y1="-10"
              x2={tickSpread}
              y2="10"
              stroke={pathColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </g>
        );
      })}

      {/* 3. Cards Layer (Alternating Above/Below Desktop; 232px width, white card, soft shadow) */}
      {cards.map((c, idx) => {
        const triggerProgress = (idx + 0.35) / cards.length;
        const isTriggered = isStatic || isSolve || drawProgress >= triggerProgress;
        const isLatestCard = idx === Math.min(cards.length - 1, Math.floor(drawProgress * cards.length));
        const cardOpacity = !isTriggered ? 0 : isSolve ? 1 : isLatestCard ? 1 : 0.7;

        return (
          <g
            key={`card-${c.num}`}
            transform={`translate(${c.anchorX - 116}, ${c.cardY})`}
            style={{
              opacity: cardOpacity,
              transform: isTriggered
                ? `translate(${c.anchorX - 116}px, ${c.cardY}px)`
                : `translate(${c.anchorX - 116}px, ${c.cardY + 24}px)`,
              transition: 'transform 600ms var(--ease-out), opacity 400ms var(--ease-out)',
            }}
          >
            {/* Card Background (White, radius 20px, soft shadow) */}
            <rect
              x="0"
              y="0"
              width="232"
              height="164"
              rx="20"
              fill="#FFFFFF"
              stroke={isSolve ? '#1E9E6A33' : '#C8642E25'}
              strokeWidth="1.5"
              filter="drop-shadow(0px 14px 28px rgba(18,48,61,0.12))"
            />

            {/* Connecting Stem to Wave Path */}
            <line
              x1="116"
              y1={c.cardY < 400 ? '164' : '0'}
              x2="116"
              y2={c.cardY < 400 ? String(c.anchorY - c.cardY) : String(c.anchorY - c.cardY)}
              stroke={pathColor}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.4"
            />

            {/* Custom 28px Line Icon */}
            <g transform="translate(24, 24)">
              <div style={{ width: 36, height: 36 }}>
                <CustomLineIcon
                  type={isSolve ? c.fixIconType : c.iconType}
                  color={isSolve ? '#1E9E6A' : '#C8642E'}
                />
              </div>
            </g>

            {/* Friction vs Fix Title (Crossfade transition) */}
            <text
              x="24"
              y="94"
              fill="#0F2A35"
              fontSize="14.5"
              fontWeight="600"
              className="leading-snug transition-all duration-500"
            >
              {/* Multiline split */}
              {((isSolve ? c.fixTitle : c.frictionTitle).split(' ')).reduce<string[][]>(
                (acc, word) => {
                  const lastLine = acc[acc.length - 1];
                  if (!lastLine || lastLine.join(' ').length + word.length > 20) {
                    acc.push([word]);
                  } else {
                    lastLine.push(word);
                  }
                  return acc;
                },
                []
              ).map((lineWords, lIdx) => (
                <tspan key={lIdx} x="24" dy={lIdx === 0 ? 0 : 20}>
                  {lineWords.join(' ')}
                </tspan>
              ))}
            </text>

            {/* Small status indicator pill */}
            <g transform="translate(24, 136)">
              <rect
                x="0"
                y="-10"
                width={isSolve ? "68" : "74"}
                height="18"
                rx="9"
                fill={isSolve ? "#1E9E6A14" : "#C8642E14"}
              />
              <text
                x={isSolve ? "34" : "37"}
                y="3"
                textAnchor="middle"
                fill={isSolve ? "#1E9E6A" : "#C8642E"}
                fontSize="10"
                fontWeight="700"
                letterSpacing="0.04em"
              >
                {isSolve ? "SOLVED" : "FRICTION"}
              </text>
            </g>
          </g>
        );
      })}

      {/* Scene 03 Finish: Pin glyph & "The customer reaches you." (Focal moment) */}
      {isSolve && (
        <g
          transform="translate(1520, 450)"
          style={{
            transform:
              sceneElapsed >= 3.6
                ? 'translate(1520px, 450px) scale(1)'
                : 'translate(1520px, 450px) scale(0.96)',
            opacity: sceneElapsed >= 3.4 ? 1 : 0,
            transition: 'transform 500ms var(--ease-out), opacity 400ms var(--ease-out)',
          }}
        >
          {/* Finish teardrop badge */}
          <circle cx="0" cy="0" r="24" fill="#1E9E6A" />
          <path d="M -7,0 L -2,5 L 8,-5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* End Callout */}
          <g transform="translate(-10, -38)">
            <rect x="-90" y="-14" width="180" height="26" rx="13" fill="#143828" stroke="#1E9E6A" strokeWidth="1.5" />
            <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="600">
              The customer reaches you
            </text>
          </g>
        </g>
      )}
    </g>
  );
}

// =========================================================================
// TEARDROP PIN COMPONENT (Teardrop SVG with white inner dot & small pill)
// =========================================================================
interface TeardropPinProps {
  color: string;
  label: string;
  subline?: string;
  hasWebsite?: boolean;
  hasBrokenLink?: boolean;
  isYourBusiness?: boolean;
  isDimmed?: boolean;
  isHighlighted?: boolean;
}

function TeardropPin({
  color,
  label,
  subline,
  hasWebsite = false,
  hasBrokenLink = false,
  isYourBusiness = false,
  isDimmed = false,
  isHighlighted = false,
}: TeardropPinProps) {
  return (
    <g className="transition-opacity duration-300" opacity={isDimmed ? 0.55 : 1}>
      {/* Pin Shadow */}
      <ellipse cx="0" cy="18" rx="14" ry="5" fill="#000000" opacity="0.25" />

      {/* Teardrop SVG Pin */}
      <path
        d="M 0,-28 C -14,-28 -24,-17 -24,-2 C -24,14 0,28 0,28 C 0,28 24,14 24,-2 C 24,-17 14,-28 0,-28 Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />

      {/* White inner dot */}
      <circle cx="0" cy="-6" r="6" fill="#FFFFFF" />

      {/* Result Chip Pill */}
      <g transform="translate(0, -42)">
        <rect
          x="-65"
          y="-13"
          width="130"
          height={subline ? "34" : "24"}
          rx="12"
          fill="#0B1B2B"
          stroke={color}
          strokeWidth="1.5"
          filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.25))"
        />

        <text x="0" y="2" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
          {label}
        </text>

        {subline && (
          <g transform="translate(0, 14)">
            {hasBrokenLink && (
              /* Custom Broken Link Icon */
              <g transform="translate(-50, -4)">
                <path d="M 0,0 L 4,0 M 8,0 L 12,0" stroke="#E5484D" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}
            <text
              x={hasBrokenLink ? "4" : "0"}
              y="0"
              textAnchor="middle"
              fill={hasBrokenLink ? "#E5484D" : "#A1B5C1"}
              fontSize="9.5"
              fontWeight="500"
            >
              {subline}
            </text>

            {hasWebsite && (
              /* 2px underline bar under 'Website' */
              <line x1="-18" y1="3" x2="18" y2="3" stroke="#F4B860" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>
        )}
      </g>
    </g>
  );
}

// =========================================================================
// CUSTOM 28px LINE ICONS (Inline SVG, 1.75px stroke, no emoji, no icons-font)
// =========================================================================
function CustomLineIcon({ type, color }: { type: string; color: string }) {
  switch (type) {
    // 1. Pointer hitting a blank page
    case 'blank-page':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="4" width="14" height="18" rx="2" />
          <path d="M 15,15 L 21,21 M 15,15 L 18,15 M 15,15 L 15,18" />
        </svg>
      );

    // 2. Phone with a dotted outline, no button
    case 'dotted-phone':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="3" width="14" height="22" rx="4" strokeDasharray="3 3" />
          <line x1="12" y1="21" x2="16" y2="21" strokeDasharray="2 2" />
        </svg>
      );

    // 3. Phone with crescent moon (after hours)
    case 'moon-phone':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="4" width="12" height="20" rx="3" />
          <path d="M 21,9 A 5,5 0 0,1 18,16 A 5,5 0 0,0 22,8 Z" />
        </svg>
      );

    // 4. Thermometer-style cooling bar
    case 'thermometer':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 14,5 L 14,17 A 4,4 0 1,0 18,20 L 18,5 A 2,2 0 1,0 14,5 Z" />
          <line x1="16" y1="11" x2="16" y2="18" strokeWidth="2.5" />
        </svg>
      );

    // Fix 1: Check circle
    case 'check-circle':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="14" cy="14" r="10" />
          <path d="M 9,14 L 12.5,17.5 L 19,10.5" />
        </svg>
      );

    // Fix 2: Active call & quote buttons
    case 'call-button':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5" width="20" height="18" rx="4" />
          <path d="M 8,11 C 8,15 13,17 16,17" />
          <line x1="8" y1="17" x2="12" y2="17" strokeWidth="2" />
        </svg>
      );

    // Fix 3: Auto-reply / missed calls handled
    case 'auto-reply':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 4,7 C 4,5.5 5.5,4 7,4 L 21,4 C 22.5,4 24,5.5 24,7 L 24,17 C 24,18.5 22.5,20 21,20 L 9,20 L 4,24 Z" />
          <line x1="8" y1="10" x2="16" y2="10" strokeWidth="1.5" />
          <line x1="8" y1="14" x2="13" y2="14" strokeWidth="1.5" />
        </svg>
      );

    // Fix 4: Inbox log / confirmed
    case 'inbox-log':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="4" width="18" height="20" rx="3" />
          <path d="M 9,10 L 11,12 L 15,8" strokeWidth="1.5" />
          <line x1="9" y1="16" x2="19" y2="16" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.75">
          <circle cx="14" cy="14" r="10" />
        </svg>
      );
  }
}

// =========================================================================
// SCENE 04: BUILD CHOREOGRAPHY
// Blueprint world: bg #12304A to #0B1F31, peach #E8B08F, lines #7FA6C2
// =========================================================================
interface SceneBuildProps {
  palette: WayOfWorkingPaletteItem;
  sceneElapsed: number;
  sampleTown: string;
  sampleTrade: string;
  hasEnquiryTracking: boolean;
  isMobile: boolean;
  isStatic?: boolean;
}

function SceneBuildChoreography({
  palette,
  sceneElapsed,
  sampleTown,
  sampleTrade,
  hasEnquiryTracking,
  isMobile,
  isStatic = false,
}: SceneBuildProps) {
  const isFilled = isStatic || sceneElapsed >= 2.0;
  const isFormComplete = isStatic || sceneElapsed >= 3.8;
  const isSubmitted = isStatic || (sceneElapsed >= 4.8 && sceneElapsed < 5.4);
  const isConfirmed = isStatic || sceneElapsed >= 5.6;

  // Wipe transition for Beat 2 (flood from line to solid left-to-right 700ms ease-out)
  const fillWipeWidth = isStatic ? 284 : sceneElapsed >= 2.0 ? Math.min(284, ((sceneElapsed - 2.0) / 0.7) * 284) : 0;

  // Phone positioning: Desktop shifts slightly left if inbox card slides in on the right
  const phoneX = isMobile ? 800 : hasEnquiryTracking ? 690 : 800;
  const phoneY = isMobile ? 360 : 440;
  const phoneScale = isMobile ? 0.72 : 0.92;

  return (
    <g id="scene-build">
      {/* 40px Blueprint Grid Pattern (static SVG pattern at 8% opacity) */}
      <defs>
        <pattern id="wwd-blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7FA6C2" strokeWidth="0.8" opacity="0.14" />
        </pattern>
        <clipPath id="phone-screen-clip">
          <rect x="-142" y="-297" width="284" height="594" rx="36" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="1600" height="900" fill="url(#wwd-blueprint-grid)" opacity="0.6" />

      {/* Main Centred Phone Object */}
      <g transform={`translate(${phoneX}, ${phoneY}) scale(${phoneScale})`}>
        {/* Phone Shadow */}
        <rect x="-156" y="-310" width="312" height="620" rx="46" fill="#000000" opacity="0.4" />

        {/* 8px Bezel in near-black #0E151B with subtle blueprint stroke */}
        <rect x="-150" y="-305" width="300" height="610" rx="44" fill="#0E151B" stroke="#7FA6C2" strokeWidth="1.5" />

        {/* Inner Screen 284x594 with 36px radius */}
        <rect x="-142" y="-297" width="284" height="594" rx="36" fill="#0B1F31" />

        {/* ------------------------------------------------------------- */}
        {/* BEAT 1: WIREFRAME LINE-WORK (STROKE 1.5px #7FA6C2)            */}
        {/* ------------------------------------------------------------- */}
        <g clipPath="url(#phone-screen-clip)">
          {/* Base Screen Blueprint Tint */}
          <rect x="-142" y="-297" width="284" height="594" fill="#0E2337" />

          {/* Wireframe Outline Blocks */}
          <g stroke="#7FA6C2" strokeWidth="1.5" fill="none">
            {/* Header bar */}
            <rect
              x="-122"
              y="-240"
              width="244"
              height="34"
              rx="6"
              strokeDasharray="300"
              strokeDashoffset={isStatic ? 0 : Math.max(0, 300 - Math.min(1.4, sceneElapsed) * 220)}
            />
            {/* Headline blocks (2 lines) */}
            <rect
              x="-122"
              y="-185"
              width="180"
              height="12"
              rx="3"
              strokeDasharray="200"
              strokeDashoffset={isStatic ? 0 : Math.max(0, 200 - Math.max(0, sceneElapsed - 0.12) * 180)}
            />
            <rect
              x="-122"
              y="-165"
              width="130"
              height="10"
              rx="3"
              strokeDasharray="150"
              strokeDashoffset={isStatic ? 0 : Math.max(0, 150 - Math.max(0, sceneElapsed - 0.24) * 150)}
            />
            {/* Primary button outline */}
            <rect
              x="-122"
              y="-135"
              width="110"
              height="30"
              rx="15"
              strokeDasharray="180"
              strokeDashoffset={isStatic ? 0 : Math.max(0, 180 - Math.max(0, sceneElapsed - 0.36) * 180)}
            />
            {/* 3-row services list */}
            <rect
              x="-122"
              y="-85"
              width="244"
              height="22"
              rx="4"
              strokeDasharray="280"
              strokeDashoffset={isStatic ? 0 : Math.max(0, 280 - Math.max(0, sceneElapsed - 0.48) * 240)}
            />
            <rect
              x="-122"
              y="-55"
              width="244"
              height="22"
              rx="4"
              strokeDasharray="280"
              strokeDashoffset={isStatic ? 0 : Math.max(0, 280 - Math.max(0, sceneElapsed - 0.6) * 240)}
            />
            <rect
              x="-122"
              y="-25"
              width="244"
              height="22"
              rx="4"
              strokeDasharray="280"
              strokeDashoffset={isStatic ? 0 : Math.max(0, 280 - Math.max(0, sceneElapsed - 0.72) * 240)}
            />
            {/* Quote form box */}
            <rect
              x="-122"
              y="15"
              width="244"
              height="185"
              rx="8"
              strokeDasharray="450"
              strokeDashoffset={isStatic ? 0 : Math.max(0, 450 - Math.max(0, sceneElapsed - 0.84) * 350)}
            />
          </g>

          {/* ------------------------------------------------------------- */}
          {/* BEAT 2+: FILLED WEBSITE ON PHONE (CLIP-PATH WIPE LEFT TO RIGHT) */}
          {/* ------------------------------------------------------------- */}
          {(isStatic || sceneElapsed >= 1.9) && (
            <g clipPath="url(#phone-screen-clip)">
              {/* Wipe rectangle defining revealed area */}
              <g style={{ clipPath: `inset(0px ${Math.max(0, 284 - fillWipeWidth)}px 0px 0px)` }}>
                {/* Surface White */}
                <rect x="-142" y="-297" width="284" height="594" fill="#FFFFFF" />

                {/* Mobile Status Bar */}
                <text x="-114" y="-272" fill="#12303D" fontSize="11" fontWeight="600" opacity="0.8">9:41</text>
                <circle cx="118" cy="-275" r="3" fill="#12303D" opacity="0.7" />
                <rect x="100" y="-278" width="12" height="6" rx="2" fill="#12303D" opacity="0.7" />

                {/* Header bar (Real content) */}
                <g transform="translate(0, -242)">
                  <rect x="-124" y="0" width="248" height="36" rx="8" fill="#F4F8FA" stroke="#E2ECF0" strokeWidth="1" />
                  <text x="-110" y="23" fill="#12303D" fontSize="13" fontWeight="700">Open Hours</text>
                  {/* Mini phone button */}
                  <rect x="74" y="6" width="38" height="24" rx="12" fill="#12303D" />
                  <circle cx="93" cy="18" r="4" fill="#FFFFFF" />
                </g>

                {/* Headline (Teal #12303D) & Subtext */}
                <g transform="translate(0, -188)">
                  <text x="-122" y="0" fill="#12303D" fontSize="16" fontWeight="700" letterSpacing="-0.02em">
                    Roof repairs in {sampleTown}
                  </text>
                  <text x="-122" y="18" fill="#5E6F77" fontSize="10.5" fontWeight="500">
                    Call or request a quote in a minute.
                  </text>
                </g>

                {/* Action Buttons: Terracotta #C8642E Call Button + Secondary Quote */}
                <g transform="translate(0, -145)">
                  {/* Call now button */}
                  <rect x="-122" y="0" width="112" height="32" rx="16" fill="#C8642E" />
                  <text x="-66" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="600">
                    Call now
                  </text>
                  {/* Secondary quote button */}
                  <rect x="-2" y="0" width="112" height="32" rx="16" fill="#F0F4F7" stroke="#D3DFE6" strokeWidth="1" />
                  <text x="54" y="20" textAnchor="middle" fill="#12303D" fontSize="11.5" fontWeight="600">
                    Get a quote
                  </text>
                </g>

                {/* 3 Services Row (Chips) */}
                <g transform="translate(0, -96)">
                  <rect x="-122" y="0" width="76" height="22" rx="11" fill="#F4F8FA" stroke="#D8E2E6" strokeWidth="1" />
                  <text x="-84" y="15" textAnchor="middle" fill="#12303D" fontSize="9.5" fontWeight="600">Leak repairs</text>

                  <rect x="-40" y="0" width="86" height="22" rx="11" fill="#F4F8FA" stroke="#D8E2E6" strokeWidth="1" />
                  <text x="3" y="15" textAnchor="middle" fill="#12303D" fontSize="9.5" fontWeight="600">Tile replace</text>

                  <rect x="52" y="0" width="70" height="22" rx="11" fill="#F4F8FA" stroke="#D8E2E6" strokeWidth="1" />
                  <text x="87" y="15" textAnchor="middle" fill="#12303D" fontSize="9.5" fontWeight="600">Gutters</text>
                </g>

                {/* Quote Form Container (Beat 3: Placeholders & Typed Ink Values) */}
                <g transform="translate(0, -58)">
                  <rect x="-124" y="0" width="248" height="195" rx="12" fill="#F9FBFC" stroke="#E1EBF0" strokeWidth="1.25" />

                  {/* Form Header */}
                  <text x="-110" y="22" fill="#12303D" fontSize="12" fontWeight="700">Request a quick quote</text>

                  {/* Field 1: Name */}
                  <g transform="translate(-112, 32)">
                    <rect x="0" y="0" width="224" height="28" rx="6" fill="#FFFFFF" stroke="#D3DFE6" strokeWidth="1" />
                    <text x="10" y="18" fill={isFormComplete ? '#12303D' : '#94A3B8'} fontSize="11" fontWeight={isFormComplete ? '600' : '400'}>
                      {isFormComplete ? 'A. Murphy' : 'Name'}
                    </text>
                  </g>

                  {/* Field 2: Job */}
                  <g transform="translate(-112, 68)">
                    <rect x="0" y="0" width="224" height="28" rx="6" fill="#FFFFFF" stroke="#D3DFE6" strokeWidth="1" />
                    <text x="10" y="18" fill={isFormComplete ? '#12303D' : '#94A3B8'} fontSize="11" fontWeight={isFormComplete ? '600' : '400'}>
                      {isFormComplete ? 'Roof leak' : 'Job description'}
                    </text>
                  </g>

                  {/* Field 3: Postcode */}
                  <g transform="translate(-112, 104)">
                    <rect x="0" y="0" width="224" height="28" rx="6" fill="#FFFFFF" stroke="#D3DFE6" strokeWidth="1" />
                    <text x="10" y="18" fill={isFormComplete ? '#12303D' : '#94A3B8'} fontSize="11" fontWeight={isFormComplete ? '600' : '400'}>
                      {isFormComplete ? 'Sample postcode' : 'Postcode'}
                    </text>
                  </g>

                  {/* Send Button (Press effect at ~4.8s) */}
                  <g
                    transform="translate(0, 158)"
                    style={{
                      transform: isSubmitted ? 'translate(0px, 158px) scale(0.96)' : 'translate(0px, 158px) scale(1)',
                      transition: 'transform 160ms ease-out',
                    }}
                  >
                    <rect x="-112" y="0" width="224" height="30" rx="15" fill="#12303D" />
                    <text x="0" y="19" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="600">
                      Send enquiry
                    </text>
                  </g>
                </g>

                {/* --------------------------------------------------------- */}
                {/* BEAT 4: CONFIRMATION TOAST SLIDES UP ON PHONE SCREEN      */}
                {/* --------------------------------------------------------- */}
                <g
                  transform="translate(0, 168)"
                  style={{
                    transform: isConfirmed ? 'translate(0px, 168px)' : 'translate(0px, 230px)',
                    opacity: isConfirmed ? 1 : 0,
                    transition: 'transform 450ms var(--ease-spring-soft), opacity 400ms var(--ease-out)',
                  }}
                >
                  <rect
                    x="-120"
                    y="0"
                    width="240"
                    height="42"
                    rx="10"
                    fill="#12303D"
                    stroke="#1E9E6A"
                    strokeWidth="1.5"
                    filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
                  />
                  <circle cx="-96" cy="21" r="8" fill="#1E9E6A" />
                  <path d="M -99,21 L -97,23 L -93,19" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="-80" y="25" fill="#FFFFFF" fontSize="11.5" fontWeight="600">
                    Thanks, we got your enquiry.
                  </text>
                </g>
              </g>
            </g>
          )}
        </g>

        {/* Punch-hole Camera */}
        <circle cx="0" cy="-276" r="4.5" fill="#05080A" stroke="#1E2832" strokeWidth="1" />

        {/* Label under phone: Illustrative example */}
        <text x="0" y="334" textAnchor="middle" fill="#7FA6C2" fontSize="11" fontWeight="500" opacity="0.85">
          Illustrative example
        </text>

        {/* Dimension marks & Real Text Technical Labels (around phone in Beat 1) */}
        <g stroke="#7FA6C2" opacity={isStatic || sceneElapsed < 2.0 ? 0.9 : 0.4} className="transition-opacity duration-500">
          {/* Top dimension line */}
          <line x1="-150" y1="-325" x2="150" y2="-325" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="-150" y1="-330" x2="-150" y2="-320" strokeWidth="1.5" />
          <line x1="150" y1="-330" x2="150" y2="-320" strokeWidth="1.5" />
          <text x="0" y="-330" textAnchor="middle" fill="#7FA6C2" fontSize="10" fontWeight="600" stroke="none">300mm</text>

          {/* Pointer to Header: right side */}
          <path d="M 124,-225 L 180,-225" fill="none" strokeWidth="1.25" />
          <text x="188" y="-221" fill="#7FA6C2" fontSize="11" fontWeight="700" letterSpacing="0.08em" stroke="none">
            HEADER
          </text>

          {/* Pointer to Call Button: left side */}
          <path d="M -124,-130 L -180,-130" fill="none" strokeWidth="1.25" />
          <text x="-266" y="-126" fill="#7FA6C2" fontSize="11" fontWeight="700" letterSpacing="0.08em" stroke="none">
            CALL BUTTON
          </text>

          {/* Pointer to Quote Form: right side */}
          <path d="M 124,35 L 180,35" fill="none" strokeWidth="1.25" />
          <text x="188" y="39" fill="#7FA6C2" fontSize="11" fontWeight="700" letterSpacing="0.08em" stroke="none">
            QUOTE FORM
          </text>
        </g>
      </g>

      {/* ------------------------------------------------------------- */}
      {/* BEAT 4: INBOX CARD SLIDES IN (Desktop: right / Mobile: below)  */}
      {/* ------------------------------------------------------------- */}
      {hasEnquiryTracking && (
        <g
          transform={
            isMobile
              ? `translate(800, 680) scale(0.9)`
              : `translate(1060, 440) scale(1)`
          }
          style={{
            transform: isConfirmed
              ? isMobile
                ? 'translate(800px, 680px) scale(0.9)'
                : 'translate(1060px, 440px) scale(1)'
              : isMobile
              ? 'translate(800px, 720px) scale(0.9)'
              : 'translate(1120px, 440px) scale(0.95)',
            opacity: isConfirmed ? 1 : 0,
            transition: 'transform 600ms var(--ease-spring-soft), opacity 500ms var(--ease-out)',
          }}
        >
          {/* Card Frame */}
          <rect
            x="-140"
            y="-65"
            width="280"
            height="130"
            rx="16"
            fill="#FFFFFF"
            stroke="#7FA6C244"
            strokeWidth="1.5"
            filter="drop-shadow(0 14px 34px rgba(11,31,49,0.35))"
          />

          {/* Header */}
          <g transform="translate(-120, -40)">
            <text x="0" y="10" fill="#12303D" fontSize="13" fontWeight="700">Enquiry Inbox</text>
            {/* Live emerald status dot */}
            <circle cx="190" cy="6" r="4.5" fill="#1E9E6A" />
            <text x="202" y="10" fill="#1E9E6A" fontSize="10.5" fontWeight="600">Active</text>
          </g>

          {/* Divider */}
          <line x1="-120" y1="-15" x2="120" y2="-15" stroke="#E6EEF2" strokeWidth="1" />

          {/* New Enquiry Row */}
          <g transform="translate(-120, 12)">
            <circle cx="16" cy="14" r="14" fill="#C8642E18" />
            <path d="M 11,11 L 21,11 L 16,16 Z" fill="#C8642E" />

            <text x="38" y="10" fill="#12303D" fontSize="13" fontWeight="700">
              New enquiry: Roof leak
            </text>
            <text x="38" y="27" fill="#6B8594" fontSize="11" fontWeight="500">
              A. Murphy · Just now
            </text>

            {/* Status dot / Pill */}
            <g transform="translate(180, 5)">
              <rect x="0" y="0" width="56" height="20" rx="10" fill="#1E9E6A18" />
              <circle cx="12" cy="10" r="3" fill="#1E9E6A" />
              <text x="21" y="14" fill="#1E9E6A" fontSize="10" fontWeight="700">Logged</text>
            </g>
          </g>
        </g>
      )}
    </g>
  );
}

// =========================================================================
// SCENE 05: FINDABLE CHOREOGRAPHY
// Sky world: bg #EAF3FF to #D7E7FB, blue #2F6BFF
// Light daytime map returns with neutral profile, areas, and review requests
// =========================================================================
interface SceneFindableProps {
  palette: WayOfWorkingPaletteItem;
  sceneElapsed: number;
  sampleTrade: string;
  sampleAreas?: string[];
  features: {
    googleBusinessProfile: boolean;
    serviceAreaPages: boolean;
    reviewRequests: boolean;
  };
  isMobile: boolean;
  isStatic?: boolean;
}

function SceneFindableChoreography({
  palette,
  sceneElapsed,
  sampleTrade,
  sampleAreas,
  features,
  isMobile,
  isStatic = false,
}: SceneFindableProps) {
  const hasGbp = features.googleBusinessProfile;
  const hasAreas = features.serviceAreaPages;
  const hasReviews = features.reviewRequests;

  const isGbpActive = isStatic || (hasGbp && sceneElapsed >= 0.2);
  const isAreasActive = isStatic || (hasAreas && sceneElapsed >= 2.6);
  const isReviewsActive = isStatic || (hasReviews && sceneElapsed >= 5.0);

  const areasList = sampleAreas && sampleAreas.length > 0 ? sampleAreas : ['Area 1', 'Area 2', 'Area 3'];

  return (
    <g id="scene-findable">
      {/* ------------------------------------------------------------- */}
      {/* BEAT 2 [features.serviceAreaPages]: OVERLAPPING AREA CIRCLES  */}
      {/* ------------------------------------------------------------- */}
      {hasAreas && (
        <g id="service-areas">
          {/* Circle 1 */}
          <g
            style={{
              transform: isAreasActive ? 'scale(1)' : 'scale(0.6)',
              opacity: isAreasActive ? 0.22 : 0,
              transformOrigin: '800px 450px',
              transition: 'transform 700ms var(--ease-spring-soft), opacity 600ms var(--ease-out)',
            }}
          >
            <circle cx="800" cy="450" r="185" fill="#2F6BFF" stroke="#2F6BFF" strokeWidth="2" strokeDasharray="6 4" />
          </g>

          {/* Circle 2 */}
          <g
            style={{
              transform: isAreasActive ? 'scale(1)' : 'scale(0.6)',
              opacity: isAreasActive ? 0.18 : 0,
              transformOrigin: '670px 390px',
              transition: 'transform 700ms var(--ease-spring-soft) 140ms, opacity 600ms var(--ease-out) 140ms',
            }}
          >
            <circle cx="670" cy="390" r="145" fill="#2F6BFF" stroke="#2F6BFF" strokeWidth="2" strokeDasharray="6 4" />
          </g>

          {/* Circle 3 */}
          <g
            style={{
              transform: isAreasActive ? 'scale(1)' : 'scale(0.6)',
              opacity: isAreasActive ? 0.19 : 0,
              transformOrigin: '940px 500px',
              transition: 'transform 700ms var(--ease-spring-soft) 280ms, opacity 600ms var(--ease-out) 280ms',
            }}
          >
            <circle cx="940" cy="500" r="155" fill="#2F6BFF" stroke="#2F6BFF" strokeWidth="2" strokeDasharray="6 4" />
          </g>

          {/* Soft Area Labels */}
          {isAreasActive && (
            <g fontSize="11" fontWeight="700" textAnchor="middle">
              {areasList[0] && (
                <g transform="translate(800, 250)">
                  <rect x="-45" y="-12" width="90" height="24" rx="12" fill="#FFFFFF" stroke="#2F6BFF" strokeWidth="1.25" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.12))" />
                  <text x="0" y="4" fill="#2F6BFF">{areasList[0]}</text>
                </g>
              )}
              {areasList[1] && (
                <g transform="translate(620, 390)">
                  <rect x="-45" y="-12" width="90" height="24" rx="12" fill="#FFFFFF" stroke="#2F6BFF" strokeWidth="1.25" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.12))" />
                  <text x="0" y="4" fill="#2F6BFF">{areasList[1]}</text>
                </g>
              )}
              {areasList[2] && (
                <g transform="translate(980, 500)">
                  <rect x="-45" y="-12" width="90" height="24" rx="12" fill="#FFFFFF" stroke="#2F6BFF" strokeWidth="1.25" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.12))" />
                  <text x="0" y="4" fill="#2F6BFF">{areasList[2]}</text>
                </g>
              )}
            </g>
          )}
        </g>
      )}

      {/* Center Business Pin */}
      <g transform="translate(800, 450)">
        <TeardropPin color="#2F6BFF" label="Your business" isYourBusiness />
      </g>

      {/* ------------------------------------------------------------- */}
      {/* BEAT 1 [features.googleBusinessProfile]: BUSINESS PROFILE CARD */}
      {/* (Neutral card: NO Google logo or trademarked artwork)        */}
      {/* ------------------------------------------------------------- */}
      {hasGbp && (
        <g
          transform="translate(800, 290)"
          style={{
            transform: isGbpActive ? 'translate(800px, 290px)' : 'translate(800px, 320px)',
            opacity: isGbpActive ? 1 : 0,
            transition: 'transform 700ms var(--ease-spring-soft), opacity 600ms var(--ease-out)',
          }}
        >
          {/* Card Container */}
          <rect
            x="-150"
            y="-75"
            width="300"
            height="150"
            rx="14"
            fill="#FFFFFF"
            stroke="#2F6BFF33"
            strokeWidth="1.5"
            filter="drop-shadow(0 14px 34px rgba(16,40,74,0.16))"
          />

          {/* Business Profile pill */}
          <g transform="translate(-130, -56)">
            <rect x="0" y="0" width="102" height="18" rx="9" fill="#2F6BFF18" />
            <text x="51" y="13" textAnchor="middle" fill="#2F6BFF" fontSize="10" fontWeight="700">Business profile</text>
          </g>

          {/* Title */}
          <text x="-130" y="-16" fill="#10284A" fontSize="15" fontWeight="700">
            Your business
          </text>

          {/* Category & Status */}
          <g transform="translate(-130, 4)">
            <text x="0" y="0" fill="#5E6F77" fontSize="11" fontWeight="500">
              {sampleTrade.charAt(0).toUpperCase() + sampleTrade.slice(1)} ·
            </text>
            <circle cx="56" cy="-4" r="3.5" fill="#1E9E6A" />
            <text x="66" y="0" fill="#1E9E6A" fontSize="11" fontWeight="600">
              Open today
            </text>
          </g>

          {/* Action Buttons: Call, Directions, Website */}
          <g transform="translate(-130, 30)">
            {/* Call */}
            <rect x="0" y="0" width="70" height="28" rx="14" fill="#F4F8FA" stroke="#D3DFE6" strokeWidth="1" />
            <text x="35" y="18" textAnchor="middle" fill="#10284A" fontSize="11" fontWeight="600">Call</text>

            {/* Directions */}
            <rect x="80" y="0" width="86" height="28" rx="14" fill="#F4F8FA" stroke="#D3DFE6" strokeWidth="1" />
            <text x="123" y="18" textAnchor="middle" fill="#10284A" fontSize="11" fontWeight="600">Directions</text>

            {/* Website: Solid Blue Active */}
            <rect x="176" y="0" width="84" height="28" rx="14" fill="#2F6BFF" />
            <text x="218" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">Website</text>
          </g>
        </g>
      )}

      {/* ------------------------------------------------------------- */}
      {/* BEAT 3 [features.reviewRequests]: REVIEW REQUEST CARD         */}
      {/* (NO filled stars, NO ratings numbers, NO fake reviews)       */}
      {/* ------------------------------------------------------------- */}
      {hasReviews && (
        <g
          transform={isMobile ? 'translate(800, 590)' : 'translate(1140, 380)'}
          style={{
            transform: isReviewsActive
              ? isMobile
                ? 'translate(800px, 590px)'
                : 'translate(1140px, 380px)'
              : isMobile
              ? 'translate(800px, 620px)'
              : 'translate(1180px, 380px)',
            opacity: isReviewsActive ? 1 : 0,
            transition: 'transform 700ms var(--ease-spring-soft), opacity 600ms var(--ease-out)',
          }}
        >
          <rect
            x="-125"
            y="-55"
            width="250"
            height="110"
            rx="14"
            fill="#FFFFFF"
            stroke="#2F6BFF33"
            strokeWidth="1.5"
            filter="drop-shadow(0 12px 30px rgba(16,40,74,0.16))"
          />

          {/* Title */}
          <text x="-105" y="-30" fill="#10284A" fontSize="13" fontWeight="700">
            Review request
          </text>
          <text x="-105" y="-14" fill="#6B8594" fontSize="10.5">
            Ask happy clients after the job
          </text>

          {/* Star Outline Row (Strictly unfilled stars, NO numbers, NO fake ratings) */}
          <g transform="translate(-105, 5)">
            {[0, 1, 2, 3, 4].map((sIdx) => (
              <path
                key={sIdx}
                d="M 8,0 L 10.5,5 L 16,5.8 L 12,9.7 L 13,15.2 L 8,12.5 L 3,15.2 L 4,9.7 L 0,5.8 L 5.5,5 Z"
                transform={`translate(${sIdx * 20}, 0)`}
                fill="none"
                stroke="#2F6BFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Send request pill button */}
          <g transform="translate(15, 6)">
            <rect x="0" y="0" width="90" height="26" rx="13" fill="#2F6BFF" />
            <text x="45" y="17" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="700">
              Send request
            </text>
          </g>
        </g>
      )}
    </g>
  );
}

// =========================================================================
// SCENE 06: RANK CHOREOGRAPHY
// Deep navy-indigo to dawn peach: #1B1F4B to #F6C9A5, gold #F2B544.
// Strictly navy, never purple/violet. Crossfades dawn layers over 6s.
// =========================================================================
interface SceneRankProps {
  palette: WayOfWorkingPaletteItem;
  sceneElapsed: number;
  isMobile: boolean;
  isStatic?: boolean;
}

function SceneRankChoreography({
  palette,
  sceneElapsed,
  isMobile,
  isStatic = false,
}: SceneRankProps) {
  // Dawn crossfades over 6s using two stacked layers (opacity crossfade, no gradient animation)
  const dawnOpacity = isStatic ? 0.72 : Math.min(1, Math.max(0, sceneElapsed / 6)) * 0.72;

  // 4 months on mobile (390px), 6 on desktop
  const monthCount = isMobile ? 4 : 6;
  const monthLabels = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'].slice(0, monthCount);

  // Abstract groundwork heights in gold
  const groundworkHeights = [60, 85, 110, 135, 152, 172].slice(0, monthCount);

  // Gold marker Y offsets: settles mid-pack, NEVER top, NEVER #1
  const yourYOffsets = [-65, -80, -74, -94, -88, -106].slice(0, monthCount);

  const colWidth = isMobile ? 180 : 145;
  const startX = isMobile ? 530 : 435;
  const baselineY = 660;

  return (
    <g id="scene-rank">
      <defs>
        {/* Dawn Layer Linear Gradient (crossfaded via layer opacity, not animating gradient) */}
        <linearGradient id="wwd-dawn-overlay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B1F4B" stopOpacity="0" />
          <stop offset="55%" stopColor="#252A60" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F6C9A5" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Layer 1: Solid Deep Navy-Indigo Base Rect */}
      <rect x="0" y="0" width="1600" height="900" fill="#1B1F4B" />

      {/* Layer 2: Dawn Overlay Crossfaded over 6s */}
      <rect
        x="0"
        y="0"
        width="1600"
        height="900"
        fill="url(#wwd-dawn-overlay)"
        opacity={dawnOpacity}
        style={{
          transition: isStatic ? 'none' : 'opacity 600ms linear',
        }}
      />

      {/* Chart Baseline */}
      <line x1="260" y1={baselineY} x2="1340" y2={baselineY} stroke="#FFF7EE" strokeWidth="1.5" opacity="0.25" />

      {/* Month Columns */}
      {monthLabels.map((mLabel, idx) => {
        const colX = startX + idx * colWidth;
        const barH = groundworkHeights[idx];
        const yourY = yourYOffsets[idx];

        // Choreography: stagger 260ms, bars grow scaleY 0 -> 1, 600ms ease-out
        const barStartSec = idx * 0.26;
        const isBarGrown = isStatic || sceneElapsed >= barStartSec;
        const barProgress = isStatic ? 1 : Math.min(1, Math.max(0, (sceneElapsed - barStartSec) / 0.6));

        // Gentle marker wobble
        const wobbleY = isStatic ? 0 : Math.sin(sceneElapsed * 2.2 + idx) * 4;

        return (
          <g key={mLabel} transform={`translate(${colX}, 0)`}>
            {/* Faint dotted vertical result tracker line */}
            <line
              x1="0"
              y1={baselineY - 260}
              x2="0"
              y2={baselineY}
              stroke="#FFF7EE"
              strokeWidth="1.25"
              strokeDasharray="4 4"
              opacity="0.18"
            />

            {/* Abstract Groundwork Bar in Gold #F2B544 */}
            <rect
              x="-24"
              y={baselineY - barH * barProgress}
              width="48"
              height={barH * barProgress}
              rx="8"
              fill="#F2B544"
              opacity={0.88}
            />

            {/* Month Label below baseline */}
            <text
              x="0"
              y={baselineY + 32}
              textAnchor="middle"
              fill="#FFF7EE"
              fontSize="13"
              fontWeight="600"
              opacity={isBarGrown ? 0.9 : 0.2}
              style={{ transition: 'opacity 400ms ease-out' }}
            >
              {mLabel}
            </text>

            {/* Faint Competitor Dots (Grey Markers #8496B0) */}
            <circle cx="0" cy={baselineY - 220} r="5" fill="#8496B0" opacity="0.5" />
            <circle cx="0" cy={baselineY - 180} r="5.5" fill="#8496B0" opacity="0.6" />
            <circle cx="0" cy={baselineY - 145} r="5" fill="#8496B0" opacity="0.55" />
            <circle cx="0" cy={baselineY - 50} r="4.5" fill="#8496B0" opacity="0.4" />

            {/* YOUR Gold Marker (#F2B544) — Settles mid-pack, NEVER top, NEVER #1 */}
            {isBarGrown && (
              <g
                transform={`translate(0, ${baselineY + yourY + wobbleY})`}
                style={{
                  transition: 'transform 1.2s cubic-bezier(.65,0,.35,1)',
                }}
              >
                {/* Gold glow pulse ring */}
                <circle cx="0" cy="0" r="14" fill="#F2B544" opacity="0.22" />
                <circle cx="0" cy="0" r="7.5" fill="#F2B544" stroke="#FFF7EE" strokeWidth="1.5" />

                {/* You badge pill */}
                <g transform="translate(18, -10)">
                  <rect x="0" y="0" width="38" height="20" rx="10" fill="#1B1F4B" stroke="#F2B544" strokeWidth="1.25" />
                  <text x="19" y="14" textAnchor="middle" fill="#F2B544" fontSize="10.5" fontWeight="700">
                    You
                  </text>
                </g>
              </g>
            )}
          </g>
        );
      })}

      {/* Small Footnote inside the scene */}
      <text
        x="800"
        y="755"
        textAnchor="middle"
        fill="#F6C9A5"
        fontSize="12"
        fontWeight="500"
        opacity="0.85"
      >
        Illustrative example. Results vary.
      </text>
    </g>
  );
}

// =========================================================================
// SCENE 07: ALWAYS ON CHOREOGRAPHY
// Midnight world: bg #0A1220, teal #2DD4BF, amber #F4B860
// Render ONLY beats whose flags are on.
// Entire scene hidden if features.voiceAgent, missedCallTextBack and afterHoursAutoReply are all false.
// =========================================================================
interface SceneAlwaysOnProps {
  palette: WayOfWorkingPaletteItem;
  sceneElapsed: number;
  sampleTrade: string;
  isMobile: boolean;
  isStatic?: boolean;
}

function SceneAlwaysOnChoreography({
  palette,
  sceneElapsed,
  sampleTrade,
  isMobile,
  isStatic = false,
}: SceneAlwaysOnProps) {
  const hasVoiceAgent = Boolean(config.features.voiceAgent);
  const hasInboxTracking = Boolean(config.features.enquiryTracking || config.features.voiceAgent);
  const hasAutoReply = Boolean(config.features.missedCallTextBack || config.features.afterHoursAutoReply);

  // Beat milestones
  const isBeat2 = isStatic || (hasVoiceAgent && sceneElapsed >= 2.0);
  const isBeat3 = isStatic || (hasVoiceAgent && sceneElapsed >= 3.8);
  const isBeat4 = isStatic || (hasInboxTracking && sceneElapsed >= 5.4);
  const isBeat5 = isStatic || (hasAutoReply && sceneElapsed >= 6.4);

  // Desktop positioning: if inbox/SMS cards slide in on right, phone shifts slightly left
  const phoneX = isMobile ? 800 : (hasInboxTracking || hasAutoReply) ? 660 : 800;
  const phoneY = isMobile ? 360 : 440;
  const phoneScale = isMobile ? 0.72 : 0.92;

  // 24-bar audio waveform heights
  const waveformHeights = [
    12, 22, 34, 18, 26, 38, 44, 30, 16, 28, 42, 24,
    14, 32, 40, 22, 16, 30, 36, 22, 14, 26, 18, 10
  ];

  return (
    <g id="scene-always-on" className="transition-all duration-400 ease-out">
      <defs>
        <clipPath id="phone-alwayson-clip">
          <rect x="-142" y="-297" width="284" height="594" rx="36" />
        </clipPath>
      </defs>

      {/* Midnight Background & Subtle Sky Radial Glow */}
      <rect x="0" y="0" width="1600" height="900" fill="#0A1220" />
      <ellipse cx="800" cy="220" rx="600" ry="280" fill="#2DD4BF" opacity="0.035" />

      {/* Clock Chip "11:42 pm" (sample, labelled in footnote) with Crescent Moon */}
      <g transform="translate(140, 60)">
        <rect x="-66" y="-16" width="132" height="32" rx="16" fill="#0E1B2C" stroke="#2DD4BF33" strokeWidth="1" />
        {/* Crescent Moon SVG */}
        <path d="M -46,-4 A 6.5,6.5 0 0,1 -46,5 A 4.8,4.8 0 0,0 -46,-4 Z" fill="#F4B860" />
        <text x="-24" y="5" fill="#E8EEF4" fontSize="11.5" fontWeight="700" fontFamily="monospace">
          11:42 pm
        </text>
        <text x="35" y="5" fill="#6A8296" fontSize="8.5" fontWeight="500">
          sample
        </text>
      </g>

      {/* Tag Pill "Optional add-on" at top-right of drawing area */}
      <g transform="translate(1420, 60)">
        <rect x="-70" y="-16" width="140" height="32" rx="16" fill="#2DD4BF1A" stroke="#2DD4BF55" strokeWidth="1.25" />
        <text x="0" y="5" textAnchor="middle" fill="#2DD4BF" fontSize="11.5" fontWeight="700" letterSpacing="0.04em">
          {config.wayOfWorking.voiceAgentTag || 'Optional add-on'}
        </text>
      </g>

      {/* Main Centred Phone Object */}
      <g transform={`translate(${phoneX}, ${phoneY}) scale(${phoneScale})`}>
        {/* Contact Shadow Under Phone (scales with lift/tilt) */}
        <ellipse cx="0" cy="324" rx="146" ry="16" fill="#000000" opacity="0.45" filter="url(#wwd-static-blur)" />

        {/* Phone Case Shadow */}
        <rect x="-156" y="-310" width="312" height="620" rx="46" fill="#000000" opacity="0.4" />

        {/* 8px Bezel in near-black #0E151B with teal night stroke */}
        <rect x="-150" y="-305" width="300" height="610" rx="44" fill="#0E151B" stroke="#2DD4BF40" strokeWidth="1.5" />

        {/* Inner Screen 284x594 with 36px radius */}
        <rect x="-142" y="-297" width="284" height="594" rx="36" fill="#0B131F" />

        {/* Screen Content */}
        <g clipPath="url(#phone-alwayson-clip)">
          {/* Midnight gradient screen background */}
          <rect x="-142" y="-297" width="284" height="594" fill="#091322" />

          {/* Status Bar */}
          <g transform="translate(0, -270)">
            <text x="-114" y="0" fill="#E8EEF4" fontSize="11" fontWeight="600" opacity="0.85">11:42 PM</text>
            <path d="M -50,-6 A 4,4 0 0,1 -53,-1 A 4,4 0 0,0 -50,-8 Z" fill="#F4B860" opacity="0.85" />
            <circle cx="118" cy="-3" r="3" fill="#E8EEF4" opacity="0.7" />
            <rect x="100" y="-6" width="12" height="6" rx="2" fill="#E8EEF4" opacity="0.7" />
          </g>

          {/* ----------------------------------------------------------- */}
          {/* BEAT 1: INCOMING CALL CARD (Caller: Unknown number)         */}
          {/* Ring animation = two concentric rings scaling 1 -> 1.5      */}
          {/* ----------------------------------------------------------- */}
          <g transform="translate(0, -180)">
            {/* Call Icon with Animated Concentric Rings (max 3 repeats) */}
            <g transform="translate(0, 0)">
              {!isBeat2 && !isStatic && (
                <>
                  <circle
                    cx="0"
                    cy="0"
                    r="32"
                    fill="none"
                    stroke="#F4B860"
                    strokeWidth="1.5"
                    className="wwd-ring-1"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="32"
                    fill="none"
                    stroke="#F4B860"
                    strokeWidth="1.5"
                    className="wwd-ring-2"
                  />
                </>
              )}

              <circle
                cx="0"
                cy="0"
                r="32"
                fill={isBeat2 ? '#13283E' : '#2A2518'}
                stroke={isBeat2 ? '#2DD4BF' : '#F4B860'}
                strokeWidth="2"
              />
              <path
                d="M -8,-6 C -8,-2 -2,4 2,4 L 5,1 L 9,5 L 6,8 C 0,8 -8,0 -8,-6 Z"
                fill={isBeat2 ? '#2DD4BF' : '#F4B860'}
                transform="translate(1, -2)"
              />
            </g>

            {/* Call State Tag */}
            <g transform="translate(0, 50)">
              <rect
                x="-68"
                y="-12"
                width="136"
                height="22"
                rx="11"
                fill={isBeat2 ? '#2DD4BF18' : '#F4B86018'}
                stroke={isBeat2 ? '#2DD4BF44' : '#F4B86044'}
                strokeWidth="1"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fill={isBeat2 ? '#2DD4BF' : '#F4B860'}
                fontSize="9.5"
                fontWeight="700"
                letterSpacing="0.04em"
              >
                {isBeat2 ? 'AI ASSISTANT CONNECTED' : 'INCOMING CALL'}
              </text>
            </g>

            {/* Caller Name: "Unknown number" */}
            <text x="0" y="92" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="700">
              Unknown number
            </text>
            <text x="0" y="110" textAnchor="middle" fill="#7E96AA" fontSize="11">
              {isBeat2 ? 'Call answered automatically' : 'Calling at 11:42 PM...'}
            </text>
          </g>

          {/* ----------------------------------------------------------- */}
          {/* BEAT 2 [features.voiceAgent]: WAVEFORM & TRANSCRIPT         */}
          {/* 24 bars (scaleY loop, transform only, 900ms staggered)      */}
          {/* Transcript identifies itself as AI in first line            */}
          {/* ----------------------------------------------------------- */}
          {hasVoiceAgent && isBeat2 && (
            <g transform="translate(0, -22)">
              {/* 24-Bar Waveform */}
              <g transform="translate(-64, 0)">
                {waveformHeights.map((h, wIdx) => {
                  const animScale = isStatic || isBeat3
                    ? 0.55
                    : 0.35 + 0.65 * Math.abs(Math.sin(sceneElapsed * 5.5 + wIdx * 0.4));
                  return (
                    <rect
                      key={wIdx}
                      x={wIdx * 5.5}
                      y={-h / 2}
                      width="3"
                      height={h}
                      rx="1.5"
                      fill="#2DD4BF"
                      opacity={0.88}
                      style={{
                        transformOrigin: `${wIdx * 5.5 + 1.5}px 0px`,
                        transform: `scaleY(${animScale})`,
                        transition: 'transform 80ms ease-out',
                      }}
                    />
                  );
                })}
              </g>

              {/* Spoken Transcript Card */}
              <g transform="translate(0, 32)">
                <rect
                  x="-126"
                  y="0"
                  width="252"
                  height="76"
                  rx="12"
                  fill="#0E1E30"
                  stroke="#2DD4BF33"
                  strokeWidth="1.25"
                />
                {/* AI Assistant Disclosure (REQUIRED in first line) */}
                <text x="-114" y="22" fill="#2DD4BF" fontSize="10.5" fontWeight="700">
                  "Hello, this is an AI assistant
                </text>
                <text x="-114" y="38" fill="#E8EEF4" fontSize="10.5" fontWeight="600">
                  for the business.
                </text>
                <text x="-114" y="58" fill="#A0B6C7" fontSize="10">
                  Can I take your name, the job and postcode?"
                </text>
              </g>

              {/* ------------------------------------------------------- */}
              {/* BEAT 3 [features.voiceAgent]: 3 FIELD CHIPS WITH CHECKS */}
              {/* Name: "A. Murphy", Job: "Roof leak", Postcode: "Sample" */}
              {/* ------------------------------------------------------- */}
              {isBeat3 && (
                <g transform="translate(0, 122)">
                  <rect
                    x="-126"
                    y="0"
                    width="252"
                    height="110"
                    rx="12"
                    fill="#0E1B2C"
                    stroke="#2DD4BF22"
                    strokeWidth="1"
                  />

                  {/* Field 1: Name */}
                  <g transform="translate(-112, 22)">
                    <circle cx="8" cy="-3" r="6" fill="#1E9E6A" />
                    <path
                      d="M 5,-3 L 7,-1 L 11,-5"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <text x="22" y="0" fill="#E8EEF4" fontSize="11" fontWeight="600">
                      Name: A. Murphy
                    </text>
                  </g>

                  {/* Field 2: Job */}
                  <g transform="translate(-112, 52)">
                    <circle cx="8" cy="-3" r="6" fill="#1E9E6A" />
                    <path
                      d="M 5,-3 L 7,-1 L 11,-5"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <text x="22" y="0" fill="#E8EEF4" fontSize="11" fontWeight="600">
                      Job: Roof leak
                    </text>
                  </g>

                  {/* Field 3: Postcode */}
                  <g transform="translate(-112, 82)">
                    <circle cx="8" cy="-3" r="6" fill="#1E9E6A" />
                    <path
                      d="M 5,-3 L 7,-1 L 11,-5"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <text x="22" y="0" fill="#E8EEF4" fontSize="11" fontWeight="600">
                      Postcode: Sample
                    </text>
                  </g>
                </g>
              )}
            </g>
          )}
        </g>

        {/* Punch-hole Camera */}
        <circle cx="0" cy="-276" r="4.5" fill="#05080A" stroke="#1E2832" strokeWidth="1" />

        {/* Label under phone: Illustrative example */}
        <text x="0" y="334" textAnchor="middle" fill="#6A8296" fontSize="11" fontWeight="500" opacity="0.85">
          Illustrative example
        </text>
      </g>

      {/* ------------------------------------------------------------- */}
      {/* BEAT 4 [features.enquiryTracking || voiceAgent]: INBOX ROW    */}
      {/* "New enquiry, follow-up due in the morning" with status dot   */}
      {/* ------------------------------------------------------------- */}
      {hasInboxTracking && (
        <g
          transform={
            isMobile
              ? `translate(800, 680) scale(0.9)`
              : `translate(1080, 360) scale(1)`
          }
          style={{
            transform: isBeat4
              ? isMobile
                ? 'translate(800px, 680px) scale(0.9)'
                : 'translate(1080px, 360px) scale(1)'
              : isMobile
              ? 'translate(800px, 720px) scale(0.9)'
              : 'translate(1140px, 360px) scale(0.95)',
            opacity: isBeat4 ? 1 : 0,
            transition: 'transform 600ms var(--ease-spring-soft), opacity 500ms var(--ease-out)',
          }}
        >
          <rect
            x="-150"
            y="-55"
            width="300"
            height="110"
            rx="16"
            fill="#0E1B2C"
            stroke="#2DD4BF44"
            strokeWidth="1.5"
            filter="drop-shadow(0 14px 34px rgba(0,0,0,0.5))"
          />

          <g transform="translate(-130, -32)">
            <text x="0" y="10" fill="#FFFFFF" fontSize="13" fontWeight="700">Enquiry Inbox</text>
            <g transform="translate(195, 0)">
              <rect x="0" y="0" width="56" height="18" rx="9" fill="#1E9E6A1A" />
              <circle cx="10" cy="9" r="2.5" fill="#1E9E6A" />
              <text x="18" y="12" fill="#1E9E6A" fontSize="9.5" fontWeight="700">Logged</text>
            </g>
          </g>

          <line x1="-130" y1="-10" x2="130" y2="-10" stroke="#1D2E42" strokeWidth="1" />

          <g transform="translate(-130, 8)">
            {/* Status dot */}
            <circle cx="6" cy="10" r="4" fill="#2DD4BF" />
            <text x="18" y="14" fill="#E8EEF4" fontSize="11" fontWeight="600">
              New enquiry, follow-up due in the morning
            </text>
            <text x="18" y="32" fill="#6A8296" fontSize="10">
              A. Murphy · Roof leak · Postcode: Sample
            </text>
          </g>
        </g>
      )}

      {/* ------------------------------------------------------------- */}
      {/* BEAT 5 [missedCallTextBack || afterHoursAutoReply]: SMS CARD  */}
      {/* "Thanks for calling. We'll get back to you first thing."      */}
      {/* ------------------------------------------------------------- */}
      {hasAutoReply && (
        <g
          transform={
            isMobile
              ? `translate(800, 800) scale(0.9)`
              : `translate(1080, 520) scale(1)`
          }
          style={{
            transform: isBeat5
              ? isMobile
                ? 'translate(800px, 800px) scale(0.9)'
                : 'translate(1080px, 520px) scale(1)'
              : isMobile
              ? 'translate(800px, 840px) scale(0.9)'
              : 'translate(1140px, 520px) scale(0.95)',
            opacity: isBeat5 ? 1 : 0,
            transition: 'transform 600ms var(--ease-spring-soft), opacity 500ms var(--ease-out)',
          }}
        >
          <rect
            x="-150"
            y="-55"
            width="300"
            height="110"
            rx="16"
            fill="#0E1B2C"
            stroke="#F4B86044"
            strokeWidth="1.5"
            filter="drop-shadow(0 14px 34px rgba(0,0,0,0.5))"
          />

          <g transform="translate(-130, -32)">
            <text x="0" y="10" fill="#FFFFFF" fontSize="13" fontWeight="700">Automated SMS</text>
            <g transform="translate(205, 0)">
              <rect x="0" y="0" width="46" height="18" rx="9" fill="#F4B86018" />
              <circle cx="10" cy="9" r="2.5" fill="#F4B860" />
              <text x="18" y="12" fill="#F4B860" fontSize="9.5" fontWeight="700">Sent</text>
            </g>
          </g>

          <line x1="-130" y1="-10" x2="130" y2="-10" stroke="#1D2E42" strokeWidth="1" />

          <g transform="translate(-130, 4)">
            <rect x="0" y="0" width="260" height="38" rx="8" fill="#14263B" stroke="#253D58" strokeWidth="1" />
            <text x="12" y="24" fill="#E8EEF4" fontSize="10.5" fontWeight="500">
              "Thanks for calling. We'll get back to you first thing."
            </text>
          </g>
        </g>
      )}

      {/* Footnote (exact text required by user) */}
      <text
        x="800"
        y="865"
        textAnchor="middle"
        fill="#7E96AA"
        fontSize="11.5"
        fontWeight="500"
        opacity="0.85"
      >
        Illustrative example. Optional add-on. Check call-recording and consent rules.
      </text>
    </g>
  );
}

// =========================================================================
// SCENE 08: TALK CHOREOGRAPHY
// Wrap world, calm, sunrise gold tint.
// The whole town map zooms out and dims to 12%.
// Pin remains glowing softly (pulse 2.4s, max 4 repeats then rest).
// Calm settled state — not another complex animation.
// =========================================================================
interface SceneTalkProps {
  palette: WayOfWorkingPaletteItem;
  sceneElapsed: number;
  sampleTrade: string;
  sampleTown: string;
  onOpenAudit?: () => void;
  isMobile: boolean;
  isStatic?: boolean;
}

function SceneTalkChoreography({
  palette,
  sceneElapsed,
  sampleTrade,
  sampleTown,
  onOpenAudit,
  isMobile,
  isStatic = false,
}: SceneTalkProps) {
  const pinX = 800;
  const pinY = isMobile ? 220 : 260;

  // Primary action button handler: triggers audit modal if available, or scrolls to contact and focuses input
  const handleTalkToUs = () => {
    if (onOpenAudit) {
      onOpenAudit();
    } else {
      const contactInput = document.querySelector<HTMLInputElement>(
        '#hero input[type="email"], #final-cta input, #pricing input, input[name="name"], input[type="text"]'
      );
      if (contactInput) {
        contactInput.scrollIntoView({ behavior: 'smooth' });
        contactInput.focus();
      } else {
        const contactSection = document.getElementById('final-cta') || document.getElementById('pricing');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Secondary action button handler: scrolls smoothly to #pricing
  const handleSeePricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <g id="scene-talk" className="transition-all duration-400 ease-out">
      {/* Center Business Pin with Soft Ambient Glow (pulse 2.4s, max 4 repeats then rest) */}
      <g transform={`translate(${pinX}, ${pinY})`}>
        {!isStatic && (
          <>
            <circle
              cx="0"
              cy="0"
              r="40"
              fill="none"
              stroke="#C8642E"
              strokeWidth="1.5"
              style={{
                animation: 'wwd-pulse-soft 2.4s ease-out 4',
                opacity: 0,
              }}
            />
            <circle
              cx="0"
              cy="0"
              r="54"
              fill="none"
              stroke="#C8642E"
              strokeWidth="1"
              style={{
                animation: 'wwd-pulse-soft 2.4s ease-out 300ms 4',
                opacity: 0,
              }}
            />
          </>
        )}
        <circle cx="0" cy="0" r="32" fill="#C8642E" opacity="0.2" />
        <TeardropPin color="#C8642E" label="Your business" isYourBusiness />
      </g>

      {/* Main Calm Settlement Card */}
      <g
        transform={
          isMobile
            ? 'translate(800, 560)'
            : 'translate(800, 520)'
        }
      >
        <rect
          x={isMobile ? -170 : -360}
          y={isMobile ? -130 : -110}
          width={isMobile ? 340 : 720}
          height={isMobile ? 260 : 230}
          rx="24"
          fill="#0B1B24"
          stroke="#E8B08F38"
          strokeWidth="1.5"
          filter="drop-shadow(0 20px 44px rgba(0,0,0,0.45))"
        />

        {/* Card Header & Headline */}
        <g transform={isMobile ? 'translate(0, -90)' : 'translate(0, -70)'} textAnchor="middle">
          <text
            x="0"
            y="0"
            fill="#E8B08F"
            fontSize="10.5"
            fontWeight="700"
            letterSpacing="0.08em"
          >
            THE WAY WE DELIVER
          </text>

          {/* Headline: "Want us to do this exact process with your business?" with italic accent word */}
          <text
            x="0"
            y={isMobile ? 24 : 28}
            fill="#FFFFFF"
            fontSize={isMobile ? '16' : '22'}
            fontWeight="700"
            letterSpacing="-0.01em"
          >
            Want us to do this exact{' '}
            <tspan fill="#E8B08F" fontStyle="italic">
              process
            </tspan>{' '}
            with your business?
          </text>

          {/* Subline: "Tell us your trade and your area, and we'll show you what your customers see today." */}
          <text
            x="0"
            y={isMobile ? 48 : 54}
            fill="#A0B6C7"
            fontSize={isMobile ? '11.5' : '13.5'}
            fontWeight="500"
          >
            Tell us your trade and your area, and we'll show you what your customers see today.
          </text>
        </g>

        {/* Action Buttons Row */}
        <g
          transform={isMobile ? 'translate(0, 20)' : 'translate(0, 22)'}
        >
          {/* Primary Button: Dark pill with arrow "Talk to Us" */}
          <g
            onClick={handleTalkToUs}
            className="cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleTalkToUs();
            }}
          >
            <rect
              x={isMobile ? -145 : -170}
              y="-22"
              width={isMobile ? 140 : 160}
              height="44"
              rx="22"
              fill="#0E151B"
              stroke="#E8B08F"
              strokeWidth="1.5"
              className="transition-transform duration-200 group-hover:scale-[1.03]"
              filter="drop-shadow(0 6px 16px rgba(0,0,0,0.4))"
            />
            <text
              x={isMobile ? -75 : -90}
              y="5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="13.5"
              fontWeight="700"
              letterSpacing="0.02em"
            >
              Talk to Us →
            </text>
          </g>

          {/* Secondary Button: Outline "See pricing" (scrolls to #pricing) */}
          <g
            onClick={handleSeePricing}
            className="cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleSeePricing();
            }}
          >
            <rect
              x={isMobile ? 5 : 10}
              y="-22"
              width={isMobile ? 140 : 160}
              height="44"
              rx="22"
              fill="transparent"
              stroke="#E8B08F66"
              strokeWidth="1.5"
              className="transition-transform duration-200 group-hover:scale-[1.03] group-hover:stroke-[#E8B08F]"
            />
            <text
              x={isMobile ? 75 : 90}
              y="5"
              textAnchor="middle"
              fill="#E8B08F"
              fontSize="13.5"
              fontWeight="600"
              letterSpacing="0.01em"
            >
              See pricing
            </text>
          </g>
        </g>

        {/* Footnote (max 56ch constraint) */}
        <g transform={isMobile ? 'translate(0, 84)' : 'translate(0, 88)'} textAnchor="middle">
          <text fill="#7E96AA" fontSize={isMobile ? '9' : '10.5'} fontWeight="500">
            Illustrative story. Search results vary and take time to build.
          </text>
          <text y="14" fill="#7E96AA" fontSize={isMobile ? '9' : '10.5'} fontWeight="500">
            We never promise rankings or a set number of enquiries.
          </text>
        </g>
      </g>
    </g>
  );
}


