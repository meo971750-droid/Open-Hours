import { MotionValue, useTransform } from 'motion/react';

export const PROCESS_SCENES_VERSION = 'client-story-v2';

export const SCENE_WEIGHTS = [1, 1, 1.25, 1.35, 1.2, 1.4];
export const totalWeight = SCENE_WEIGHTS.reduce((a, b) => a + b, 0);

export const SCENE_RANGES = SCENE_WEIGHTS.reduce((acc, weight, i) => {
  const start = i === 0 ? 0 : acc[i - 1].end;
  const end = i === SCENE_WEIGHTS.length - 1 ? 1 : start + weight / totalWeight;
  acc.push({ start, end });
  return acc;
}, [] as { start: number; end: number }[]);

export interface SceneProps {
  scrollYProgress: MotionValue<number>;
  onescene?: boolean;
  staticMode?: boolean;
  isActive?: boolean;
}

// Normalized crossfade calculation with hard boundaries (8% crossfade window)
// Ensures at most two scenes are visible simultaneously during crossfade; outside crossfade exactly one is visible.
export function getSceneTransitionState(p: number, index: number, onescene: boolean = false) {
  const { start, end } = SCENE_RANGES[index];

  if (onescene) {
    const isCurrent = p >= start && p < (index === SCENE_RANGES.length - 1 ? 1.001 : end);
    return {
      isVisible: isCurrent,
      opacity: isCurrent ? 1 : 0,
      y: 0,
      scale: 1,
      pointerEvents: isCurrent ? ('auto' as const) : ('none' as const),
    };
  }

  // Crossfade duration = 8% of neighbouring scene ranges
  const prevRange = index > 0 ? SCENE_RANGES[index - 1] : null;
  const nextRange = index < SCENE_RANGES.length - 1 ? SCENE_RANGES[index + 1] : null;

  const fadePrev = prevRange ? 0.08 * Math.min(end - start, prevRange.end - prevRange.start) : 0;
  const fadeNext = nextRange ? 0.08 * Math.min(end - start, nextRange.end - nextRange.start) : 0;

  // Window bounds where this scene is rendered
  const visibleStart = index === 0 ? 0 : start - fadePrev / 2;
  const visibleEnd = index === SCENE_RANGES.length - 1 ? 1 : end + fadeNext / 2;

  if (p < visibleStart || p > visibleEnd) {
    return {
      isVisible: false,
      opacity: 0,
      y: p < visibleStart ? 16 : -12,
      scale: 0.98,
      pointerEvents: 'none' as const,
    };
  }

  let opacity = 1;
  let y = 0;
  let scale = 1;

  // Incoming transition at start boundary
  if (index > 0 && p < start + fadePrev / 2) {
    const t = Math.max(0, Math.min(1, (p - visibleStart) / fadePrev));
    opacity = t;
    y = 16 * (1 - t);
    scale = 0.98 + 0.02 * t;
  }
  // Outgoing transition at end boundary
  else if (index < SCENE_RANGES.length - 1 && p > end - fadeNext / 2) {
    const t = Math.max(0, Math.min(1, (p - (end - fadeNext / 2)) / fadeNext));
    opacity = 1 - t;
    y = -12 * t;
    scale = 1 - 0.02 * t;
  }

  return {
    isVisible: opacity > 0.001,
    opacity: Math.max(0, Math.min(1, opacity)),
    y,
    scale,
    pointerEvents: (opacity > 0.1 ? 'auto' : 'none') as 'auto' | 'none',
  };
}

export function useSceneVisibility(
  scrollYProgress: MotionValue<number>,
  sceneIndex: number,
  onescene: boolean = false,
  staticMode: boolean = false
) {
  const { start, end } = SCENE_RANGES[sceneIndex];

  const state = useTransform(scrollYProgress, (p: number) => {
    if (staticMode) {
      return {
        isVisible: true,
        opacity: 1,
        y: 0,
        scale: 1,
        pointerEvents: 'auto' as const,
      };
    }
    return getSceneTransitionState(p, sceneIndex, onescene);
  });

  const opacity = useTransform(state, (s) => s.opacity);
  const y = useTransform(state, (s) => s.y);
  const scale = useTransform(state, (s) => s.scale);
  const pointerEvents = useTransform(state, (s) => s.pointerEvents);
  const visibility = useTransform(state, (s) => (s.isVisible ? 'visible' : 'hidden'));

  const sceneProgress = useTransform(scrollYProgress, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - start) / (end - start)));
  });

  // Local build-up progress b (0 to 1): first 60% is build-up, last 40% is hold (b = 1)
  const b = useTransform(sceneProgress, (sp: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, sp / 0.6));
  });

  return { opacity, y, scale, pointerEvents, visibility, sceneProgress, b, start, end };
}
