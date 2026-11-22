import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Laptop,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  PhoneCall,
  Search,
  TrendingUp,
} from 'lucide-react';
import { config, WayOfWorkingSceneItem } from '../config';
import Scene1Searches from '../components/process/Scene1Searches';
import { ScenePalette, SceneProps } from '../components/process/types';
import DemoTag from '../components/DemoTag';

const TIER_B_SCENES = new Set(['build', 'findable', 'alwaysOn', 'always-on']);

interface DeliverScrollProps {
  onOpenAudit?: () => void;
}

const SCENE_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  searches: Search,
  journey: MapIcon,
  solve: CheckCircle2,
  build: Laptop,
  findable: MapPin,
  rank: TrendingUp,
  alwaysOn: PhoneCall,
  talk: MessageSquare,
};

const DARK_CARD_SCENES = new Set(['searches', 'build', 'rank', 'alwaysOn', 'talk']);

const FRAME_BACKGROUNDS: Record<string, string> = {
  searches: 'linear-gradient(145deg, #050E0D 0%, #0A3A30 55%, #14624F 100%)',
  journey: 'linear-gradient(145deg, #DDF4EA 0%, #A8EBD3 55%, #6FD6B0 100%)',
  solve: 'linear-gradient(145deg, #0A3A30 0%, #14624F 60%, #A8EBD3 100%)',
  build: 'linear-gradient(145deg, #050E0D 0%, #0F4A3E 58%, #1E9E6A 100%)',
  findable: 'linear-gradient(145deg, #0A3A30 0%, #14735A 55%, #DDF4EA 100%)',
  rank: 'linear-gradient(145deg, #050E0D 0%, #0A3A30 55%, #1E9E6A 100%)',
  alwaysOn: 'linear-gradient(145deg, #050E0D 0%, #0F4A3E 58%, #14735A 100%)',
  talk: 'linear-gradient(145deg, #0A3A30 0%, #14624F 55%, #6FD6B0 100%)',
};

const DEFAULT_CAPTIONS: Record<string, string> = {
  searches: "A homeowner searches 'roofer near me'",
  journey: 'Clicks drop where contact gets hard',
  solve: 'Each gap turns into a clear step',
  build: 'Tap to call or request a quote',
  findable: 'Maps, areas and reviews work together',
  rank: 'Steady local signals build month by month',
  alwaysOn: 'Night calls answered, job logged for morning',
  talk: 'Ready to see what customers see today?',
};

type SceneComponent = React.ComponentType<SceneProps>;

const SCENE_LOADERS: Record<string, () => Promise<{ default: SceneComponent }>> = {
  journey: () => import('../components/process/Scene2Journey'),
  solve: () => import('../components/process/Scene3Solve'),
  build: () => import('../components/process/Scene4Build'),
  findable: () => import('../components/process/Scene5Findable'),
  rank: () => import('../components/process/Scene6Rank'),
  alwaysOn: () => import('../components/process/Scene7AlwaysOn'),
  talk: () => import('../components/process/Scene8Talk'),
};

const RESOLVED_SCENES: Record<string, SceneComponent> = {
  searches: Scene1Searches,
};

const LAZY_SCENES: Record<string, React.LazyExoticComponent<SceneComponent>> = Object.fromEntries(
  Object.entries(SCENE_LOADERS).map(([id, loader]) => [
    id,
    React.lazy(async () => {
      const mod = await loader();
      RESOLVED_SCENES[id] = mod.default;
      return mod;
    }),
  ])
);

const PRELOADING_SCENES = new Set<string>();

function preloadScene(sceneId?: string) {
  if (!sceneId || RESOLVED_SCENES[sceneId] || PRELOADING_SCENES.has(sceneId)) return;
  const loader = SCENE_LOADERS[sceneId];
  if (!loader) return;
  PRELOADING_SCENES.add(sceneId);
  loader()
    .then((mod) => {
      RESOLVED_SCENES[sceneId] = mod.default;
    })
    .catch(() => {
      PRELOADING_SCENES.delete(sceneId);
    });
}

function SceneReservedSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <div className="w-full space-y-2.5" aria-hidden="true">
      <div className={`h-9 rounded-xl ${isDark ? 'bg-white/10' : 'bg-[#F3F5F3]'}`} />
      <div className={`h-9 rounded-xl ${isDark ? 'bg-white/10' : 'bg-[#F3F5F3]'}`} />
      <div className={`h-9 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#F3F5F3]/70'}`} />
    </div>
  );
}

function SceneVisualRenderer({
  sceneId,
  isDark,
  sceneProps,
}: {
  sceneId: string;
  isDark: boolean;
  sceneProps: SceneProps;
}) {
  const SyncComp = RESOLVED_SCENES[sceneId];
  if (SyncComp) {
    return <SyncComp {...sceneProps} />;
  }
  const LazyComp = LAZY_SCENES[sceneId];
  if (!LazyComp) {
    return <Scene1Searches {...sceneProps} />;
  }
  return (
    <Suspense fallback={<SceneReservedSkeleton isDark={isDark} />}>
      <LazyComp {...sceneProps} />
    </Suspense>
  );
}

function buildScenePalette(sceneId: string): ScenePalette {
  const isDark = DARK_CARD_SCENES.has(sceneId);
  const raw = config.wayOfWorking.palette[sceneId];
  return {
    id: sceneId,
    bg: raw?.bg || (isDark ? '#050E0D' : '#FFFFFF'),
    bg2: raw?.bg2 || '#0A3A30',
    textPrimary: isDark ? '#FFFFFF' : '#0B1B22',
    textSecondary: isDark ? 'rgba(255,255,255,0.75)' : '#475754',
    pillBg: isDark ? 'rgba(255,255,255,0.1)' : '#F3F5F3',
    pillText: isDark ? '#A8EBD3' : '#0B1B22',
    pillBorder: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(11,27,34,0.1)',
    isDark,
  };
}

function getSceneDescription(scene: WayOfWorkingSceneItem): string {
  if (typeof scene.subline === 'string' && scene.subline.trim()) {
    return scene.subline;
  }
  return scene.captions[0] || DEFAULT_CAPTIONS[scene.id] || '';
}

function getSceneCaption(scene: WayOfWorkingSceneItem): string {
  if (scene.id === 'alwaysOn' && !config.features.voiceAgent && config.features.missedCallTextBack) {
    return 'Missed calls get an automatic text back';
  }
  const raw = scene.captions?.[0] || DEFAULT_CAPTIONS[scene.id] || '';
  return raw;
}

export default function DeliverScroll({ onOpenAudit }: DeliverScrollProps) {
  const wwdConfig = config.wayOfWorking;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLDivElement>(null);
  const lastIdxRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mobileVisibleIndices, setMobileVisibleIndices] = useState<Set<number>>(() => new Set([0, 1]));
  const [mobileAnimatedIndices, setMobileAnimatedIndices] = useState<Set<number>>(() => new Set());

  // Feature flag visibility matching config.wayOfWorking
  const isFindableEnabled = Boolean(
    config.features.googleBusinessProfile ||
      config.features.serviceAreaPages ||
      config.features.reviewRequests
  );
  const isAlwaysOnEnabled = Boolean(
    config.features.voiceAgent ||
      config.features.missedCallTextBack ||
      config.features.afterHoursAutoReply
  );

  const visibleScenes = useMemo(() => {
    return (wwdConfig.scenes || []).filter((scene) => {
      if (scene.id === 'findable') return isFindableEnabled;
      if (scene.id === 'alwaysOn' || scene.id === 'always-on') return isAlwaysOnEnabled;
      return true;
    });
  }, [wwdConfig.scenes, isFindableEnabled, isAlwaysOnEnabled]);

  const totalScenes = visibleScenes.length;
  const safeIndex = Math.min(activeSceneIndex, Math.max(0, totalScenes - 1));
  const activeScene = visibleScenes[safeIndex] || visibleScenes[0];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Idle preload remaining scene chunks so they are ready before user reaches them
  useEffect(() => {
    const queue = visibleScenes.map((s) => s.id).filter((id) => id !== 'searches');
    if (queue.length === 0) return;

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let idleHandle: number | undefined;
    let timerHandle: number | undefined;

    const runPreload = () => {
      queue.forEach((id) => preloadScene(id));
    };

    if (typeof win.requestIdleCallback === 'function') {
      idleHandle = win.requestIdleCallback(runPreload, { timeout: 1500 });
    } else {
      timerHandle = window.setTimeout(runPreload, 350);
    }

    return () => {
      if (idleHandle !== undefined && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleHandle);
      }
      if (timerHandle !== undefined) {
        window.clearTimeout(timerHandle);
      }
    };
  }, [visibleScenes]);

  // Ensure current + next scene are always eagerly requested
  useEffect(() => {
    preloadScene(visibleScenes[safeIndex]?.id);
    if (safeIndex + 1 < totalScenes) {
      preloadScene(visibleScenes[safeIndex + 1]?.id);
    }
  }, [safeIndex, totalScenes, visibleScenes]);

  // Single passive scroll listener with requestAnimationFrame (no resize/loop churn)
  useEffect(() => {
    if (prefersReducedMotion || totalScenes === 0) {
      return;
    }

    let rafId: number | null = null;

    const updateFromScroll = () => {
      rafId = null;
      const el = wrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const stickyOffset = 96;
      const totalScrollable = rect.height - (window.innerHeight - stickyOffset);
      if (totalScrollable <= 0) return;

      const progress = Math.min(1, Math.max(0, (stickyOffset - rect.top) / totalScrollable));
      if (Math.abs(progress - lastProgressRef.current) >= 0.008) {
        lastProgressRef.current = progress;
        setScrollProgress(progress);
      }

      const nextIndex = Math.min(totalScenes - 1, Math.max(0, Math.floor(progress * totalScenes)));
      if (nextIndex !== lastIdxRef.current) {
        lastIdxRef.current = nextIndex;
        setActiveSceneIndex(nextIndex);
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateFromScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [prefersReducedMotion, totalScenes]);

  // Single IntersectionObserver for mobile sequential cards (renders visible + next, plays once on view)
  useEffect(() => {
    const container = mobileListRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') return;

    const articles = Array.from(container.querySelectorAll<HTMLElement>('[data-deliver-mobile-idx]'));
    if (articles.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const toMount: number[] = [];
        const toAnimate: number[] = [];

        entries.forEach((entry) => {
          const idxStr = entry.target.getAttribute('data-deliver-mobile-idx');
          if (!idxStr) return;
          const idx = Number(idxStr);
          if (entry.isIntersecting) {
            toMount.push(idx);
            if (idx + 1 < totalScenes) {
              toMount.push(idx + 1);
            }
            if (entry.intersectionRatio >= 0.15) {
              toAnimate.push(idx);
            }
          }
        });

        if (toMount.length > 0) {
          setMobileVisibleIndices((prev) => {
            const next = new Set(prev);
            let changed = false;
            toMount.forEach((idx) => {
              if (!next.has(idx)) {
                next.add(idx);
                changed = true;
              }
            });
            return changed ? next : prev;
          });
        }

        if (toAnimate.length > 0) {
          setMobileAnimatedIndices((prev) => {
            const next = new Set(prev);
            let changed = false;
            toAnimate.forEach((idx) => {
              if (!next.has(idx)) {
                next.add(idx);
                changed = true;
              }
            });
            return changed ? next : prev;
          });
        }
      },
      { rootMargin: '240px 0px', threshold: [0, 0.2] }
    );

    articles.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [totalScenes]);

  const handleSelectScene = useCallback(
    (idx: number) => {
      lastIdxRef.current = idx;
      setActiveSceneIndex(idx);

      if (prefersReducedMotion) {
        return;
      }

      const el = wrapperRef.current;
      if (!el) return;

      const stickyOffset = 96;
      const totalScrollable = el.offsetHeight - (window.innerHeight - stickyOffset);
      if (totalScrollable <= 0) return;

      const wrapperTop = window.scrollY + el.getBoundingClientRect().top - stickyOffset;
      const targetProgress = (idx + 0.15) / Math.max(1, totalScenes);
      const targetScrollY = wrapperTop + targetProgress * totalScrollable;

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    },
    [prefersReducedMotion, totalScenes]
  );

  // Mount ONLY active scene's demo and the next one on desktop (unmount others, reserved container)
  const mountedDesktopIndices = useMemo(() => {
    if (totalScenes === 0) return [];
    const list = [safeIndex];
    if (safeIndex + 1 < totalScenes) {
      list.push(safeIndex + 1);
    }
    return list;
  }, [safeIndex, totalScenes]);

  if (totalScenes === 0) return null;

  const activeBackdrop = FRAME_BACKGROUNDS[activeScene.id] || FRAME_BACKGROUNDS.searches;
  const outerHeight = prefersReducedMotion ? undefined : `calc(${totalScenes} * 45vh + 100vh)`;

  return (
    <section
      id="deliver"
      className="relative z-0 bg-[#F3F5F3] text-[#0B1B22] overflow-x-clip"
      style={{ paddingTop: 'var(--section-py)', paddingBottom: 'clamp(48px, 6vw, 88px)' }}
    >
      {/* Normal-Flow Section Heading & One-Line Intro BEFORE Sticky Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 mb-8 lg:mb-10">
        <h2 className="font-serif font-normal text-[clamp(36px,4vw,58px)] leading-[1.06] tracking-[-0.025em] text-[#0B1B22]">
          {wwdConfig.title}
        </h2>
        <p className="mt-3 text-[16px] sm:text-[17px] text-[#475754] leading-relaxed">
          From a homeowner&apos;s search to a booked job in {totalScenes} short steps.
        </p>
      </div>

      {/* Desktop Sticky Split Layout (>= 900px) */}
      <div
        ref={wrapperRef}
        className="hidden min-[900px]:block relative w-full"
        style={outerHeight ? { height: outerHeight } : undefined}
      >
        <div
          className={`${
            prefersReducedMotion ? 'relative pb-16' : 'sticky top-24 h-[calc(100svh-96px)]'
          } w-full flex items-center px-6 lg:px-10 py-4`}
        >
          <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between gap-10 xl:gap-14">
            {/* Left Column (~48%): Progress Line & Clickable Step List */}
            <div className="w-[48%] shrink-0 flex flex-col justify-center">
              <div className="relative pl-5">
                {/* Vertical Left-Edge Progress Track */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-[rgba(11,27,34,0.12)] overflow-hidden"
                >
                  <div
                    className="w-full h-full bg-[#14624F] origin-top rounded-full"
                    style={{
                      transform: `scaleY(${
                        prefersReducedMotion
                          ? (safeIndex + 1) / totalScenes
                          : Math.max(0.06, scrollProgress)
                      })`,
                    }}
                  />
                </div>

                {/* Hairline-Divided Scene Rows */}
                <div className="border-t border-b border-[rgba(11,27,34,0.1)] divide-y divide-[rgba(11,27,34,0.1)]">
                  {visibleScenes.map((scene, idx) => {
                    const isActive = idx === safeIndex;
                    const IconComp = SCENE_ICONS[scene.id] || Search;
                    const isVoiceScene = scene.id === 'alwaysOn' || scene.id === 'always-on';

                    return (
                      <button
                        key={scene.id}
                        type="button"
                        aria-current={isActive ? 'step' : undefined}
                        onClick={() => handleSelectScene(idx)}
                        className={`group w-full text-left py-1.5 flex items-start justify-between gap-3 cursor-pointer transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.99] ${
                          isActive ? 'opacity-100' : 'opacity-[0.72] hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className={`mt-0.5 shrink-0 ${isActive ? 'text-[#14624F]' : 'text-[#0B1B22]'}`}>
                            <IconComp className="w-[18px] h-[18px]" strokeWidth={1.6} />
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-heading font-semibold text-[15.5px] xl:text-[17px] leading-[1.25] tracking-[-0.015em] text-[#0B1B22]">
                                {scene.title}
                              </span>
                              {isVoiceScene && wwdConfig.voiceAgentTag && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#DDF4EA] text-[#14624F] border border-[#6FD6B0]/60 shrink-0">
                                  {wwdConfig.voiceAgentTag}
                                </span>
                              )}
                            </div>

                            {isActive && (
                              <p className="mt-1 text-[13.5px] xl:text-[14.5px] leading-[1.45] text-[#475754] max-w-[44ch]">
                                {getSceneDescription(scene)}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          aria-hidden="true"
                          className={`w-7 h-7 xl:w-8 xl:h-8 rounded-[10px] border flex items-center justify-center shrink-0 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                            isActive
                              ? 'bg-[#14624F] border-[#14624F] text-white'
                              : 'bg-white/85 border-[rgba(11,27,34,0.12)] text-[#0B1B22] group-hover:border-[#14624F]/40'
                          }`}
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.6} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column (~52%): Compact Demo Frame (~68% of prior size, clean breathing room, no decorative bars) */}
            <div className="w-[52%] flex items-center justify-center lg:justify-end">
              <div
                className="relative w-full max-w-[336px] xl:max-w-[352px] aspect-square rounded-[28px] p-5 sm:p-6 flex items-center justify-center shadow-[var(--e2)] border border-[rgba(11,27,34,0.08)]"
                style={{
                  background: activeBackdrop,
                  transition: prefersReducedMotion ? 'none' : 'background 300ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                {/* Reserved Fixed Slot: mounts ONLY active scene + next scene, pure 250ms opacity cross-fade */}
                <div className="relative w-full h-full">
                  {mountedDesktopIndices.map((idx) => {
                    const scene = visibleScenes[idx];
                    if (!scene) return null;
                    const isSceneActive = idx === safeIndex;
                    const isDarkCard = DARK_CARD_SCENES.has(scene.id);
                    const isVoiceScene = scene.id === 'alwaysOn' || scene.id === 'always-on';
                    const caption = getSceneCaption(scene);

                    return (
                      <div
                        key={scene.id}
                        aria-hidden={!isSceneActive}
                        className={`absolute inset-0 rounded-[20px] p-4 flex flex-col justify-between transition-opacity duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                          isSceneActive
                            ? 'opacity-100 z-10 pointer-events-auto'
                            : 'opacity-0 z-0 pointer-events-none'
                        } ${
                          isDarkCard
                            ? 'bg-[#050E0D] text-white border border-white/15'
                            : 'bg-white text-[#0B1B22] border border-[rgba(11,27,34,0.1)]'
                        }`}
                      >
                        {/* Header: Step Badge, Tag & Sample Demo Label */}
                        <div
                          className={`flex items-center justify-between gap-2 pb-2 border-b ${
                            isDarkCard ? 'border-white/10' : 'border-[rgba(11,27,34,0.08)]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold tabular-nums shrink-0 ${
                                isDarkCard
                                  ? 'bg-[#0A3A30] text-[#A8EBD3]'
                                  : 'bg-[#DDF4EA] text-[#14624F]'
                              }`}
                            >
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            {isVoiceScene && wwdConfig.voiceAgentTag && (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#1E9E6A]/20 text-[#A8EBD3] truncate">
                                {wwdConfig.voiceAgentTag}
                              </span>
                            )}
                          </div>

                          {TIER_B_SCENES.has(scene.id) && (
                            <DemoTag tone={isDarkCard ? 'dark' : 'light'} />
                          )}
                        </div>

                        {/* Single Clear Visual */}
                        <div className="flex-1 min-h-0 flex items-center justify-center py-2">
                          <SceneVisualRenderer
                            sceneId={scene.id}
                            isDark={isDarkCard}
                            sceneProps={{
                              isActive: isSceneActive,
                              animate: !prefersReducedMotion,
                              isMobile: false,
                              caption,
                              palette: buildScenePalette(scene.id),
                              onOpenAudit,
                            }}
                          />
                        </div>

                        {/* One Short <=7-Word Plain-Language Caption Inside Frame */}
                        <div
                          className={`pt-2 border-t text-[11.5px] font-medium text-center ${
                            isDarkCard
                              ? 'border-white/10 text-white/85'
                              : 'border-[rgba(11,27,34,0.08)] text-[#475754]'
                          }`}
                        >
                          {caption}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Sequential Layout (< 900px): No Sticky, Final State Visible, 1-Time Animation on View */}
      <div className="min-[900px]:hidden px-4 sm:px-6" ref={mobileListRef}>
        <div className="max-w-[640px] mx-auto space-y-10">
          {visibleScenes.map((scene, idx) => {
            const IconComp = SCENE_ICONS[scene.id] || Search;
            const isVoiceScene = scene.id === 'alwaysOn' || scene.id === 'always-on';
            const isDarkCard = DARK_CARD_SCENES.has(scene.id);
            const backdrop = FRAME_BACKGROUNDS[scene.id] || FRAME_BACKGROUNDS.searches;
            const caption = getSceneCaption(scene);
            const shouldMountDemo = mobileVisibleIndices.has(idx);
            const hasEnteredView = mobileAnimatedIndices.has(idx);

            return (
              <article
                key={scene.id}
                data-deliver-mobile-idx={idx}
                className="pt-6 border-t border-[rgba(11,27,34,0.1)] space-y-5"
              >
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-[12px] bg-white border border-[rgba(11,27,34,0.1)] text-[#14624F] flex items-center justify-center shrink-0 mt-0.5">
                    <IconComp className="w-5 h-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#14624F] tabular-nums">
                        Step {String(idx + 1).padStart(2, '0')}
                      </span>
                      {isVoiceScene && wwdConfig.voiceAgentTag && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DDF4EA] text-[#14624F] border border-[#6FD6B0]/60">
                          {wwdConfig.voiceAgentTag}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-[20px] leading-snug text-[#0B1B22] mt-1">
                      {scene.title}
                    </h3>
                    <p className="mt-1.5 text-[15.5px] leading-[1.55] text-[#475754]">
                      {getSceneDescription(scene)}
                    </p>
                  </div>
                </div>

                {/* Compact Framed Demo with Reserved Dimensions (zero layout shift) */}
                <div
                  className="relative w-full max-w-[348px] mx-auto aspect-square rounded-[24px] p-4 sm:p-5 flex items-center justify-center shadow-[var(--e2)] border border-[rgba(11,27,34,0.08)]"
                  style={{ background: backdrop }}
                >
                  <div
                    className={`w-full h-full rounded-[18px] p-3.5 flex flex-col justify-between ${
                      isDarkCard
                        ? 'bg-[#050E0D] text-white border border-white/15'
                        : 'bg-white text-[#0B1B22] border border-[rgba(11,27,34,0.1)]'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between gap-2 pb-2 border-b ${
                        isDarkCard ? 'border-white/10' : 'border-[rgba(11,27,34,0.08)]'
                      }`}
                    >
                      <span className="text-[10.5px] font-semibold tabular-nums opacity-85">
                        Step {String(idx + 1).padStart(2, '0')}
                      </span>
                      {TIER_B_SCENES.has(scene.id) && (
                        <DemoTag tone={isDarkCard ? 'dark' : 'light'} />
                      )}
                    </div>

                    <div className="flex-1 min-h-0 flex items-center justify-center py-2">
                      {shouldMountDemo ? (
                        <SceneVisualRenderer
                          sceneId={scene.id}
                          isDark={isDarkCard}
                          sceneProps={{
                            isActive: true,
                            animate: !prefersReducedMotion && hasEnteredView,
                            isMobile: true,
                            caption,
                            palette: buildScenePalette(scene.id),
                            onOpenAudit,
                          }}
                        />
                      ) : (
                        <SceneReservedSkeleton isDark={isDarkCard} />
                      )}
                    </div>

                    <div
                      className={`pt-2 border-t text-[11px] font-medium text-center ${
                        isDarkCard
                          ? 'border-white/10 text-white/85'
                          : 'border-[rgba(11,27,34,0.08)] text-[#475754]'
                      }`}
                    >
                      {caption}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
