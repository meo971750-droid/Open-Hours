export interface SectionBounds {
  top: number;
  height: number;
  bottom: number;
}

export interface ScrollSnapshot {
  scrollY: number;
  winWidth: number;
  winHeight: number;
  docHeight: number;
  scrollProgress: number;
  getBounds: (id: string) => SectionBounds | null;
}

type ScrollListener = (snapshot: ScrollSnapshot) => void;

const TRACKED_SECTION_IDS = [
  'hero',
  'services',
  'proof',
  'deliver',
  'best-in',
  'reviews',
  'work',
  'framework',
  'built-fast',
  'pricing',
  'contact',
  'faq',
  'white-label',
  'final-cta',
  'footer',
];

const listeners = new Set<ScrollListener>();
const boundsCache = new Map<string, SectionBounds>();

let started = false;
let rafId = 0;
let measureRafId = 0;
let resizeObserver: ResizeObserver | null = null;
let cachedWinWidth = 0;
let cachedWinHeight = 0;
let cachedDocHeight = 0;

function computeBounds(): void {
  measureRafId = 0;
  if (typeof window === 'undefined') return;

  const y = window.scrollY;
  cachedWinWidth = window.innerWidth;
  cachedWinHeight = window.innerHeight;
  cachedDocHeight = Math.max(0, document.documentElement.scrollHeight - cachedWinHeight);

  boundsCache.clear();
  for (const id of TRACKED_SECTION_IDS) {
    const el =
      id === 'footer'
        ? document.getElementById('footer') || document.querySelector('footer')
        : document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const top = rect.top + y;
    const height = rect.height;
    boundsCache.set(id, { top, height, bottom: top + height });
  }
}

function getBounds(id: string): SectionBounds | null {
  return boundsCache.get(id) ?? null;
}

function createSnapshot(): ScrollSnapshot {
  const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  const scrollProgress =
    cachedDocHeight > 0 ? Math.min(1, Math.max(0, scrollY / cachedDocHeight)) : 0;
  return {
    scrollY,
    winWidth: cachedWinWidth,
    winHeight: cachedWinHeight,
    docHeight: cachedDocHeight,
    scrollProgress,
    getBounds,
  };
}

function emit(): void {
  rafId = 0;
  if (listeners.size === 0) return;
  const snapshot = createSnapshot();
  listeners.forEach((fn) => fn(snapshot));
}

function scheduleEmit(): void {
  if (!rafId && typeof window !== 'undefined') {
    rafId = window.requestAnimationFrame(emit);
  }
}

export function notifyScrollLayoutChanged(): void {
  if (typeof window === 'undefined' || !started) return;
  if (!measureRafId) {
    measureRafId = window.requestAnimationFrame(() => {
      computeBounds();
      scheduleEmit();
    });
  }
}

function onResize(): void {
  notifyScrollLayoutChanged();
}

function ensureStarted(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  computeBounds();

  window.addEventListener('scroll', scheduleEmit, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      notifyScrollLayoutChanged();
    });
    const main = document.getElementById('main-content') || document.body;
    if (main) resizeObserver.observe(main);
  }
}

function stopIfIdle(): void {
  if (!started || listeners.size > 0 || typeof window === 'undefined') return;
  started = false;
  window.removeEventListener('scroll', scheduleEmit);
  window.removeEventListener('resize', onResize);
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (rafId) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
  if (measureRafId) {
    window.cancelAnimationFrame(measureRafId);
    measureRafId = 0;
  }
}

export function subscribeScroll(listener: ScrollListener): () => void {
  ensureStarted();
  listeners.add(listener);
  // Refresh bounds once synchronously if cache is empty (e.g. route swap)
  if (boundsCache.size === 0 && typeof window !== 'undefined') {
    computeBounds();
  }
  listener(createSnapshot());

  return () => {
    listeners.delete(listener);
    stopIfIdle();
  };
}
