import { useEffect, useState, RefObject } from 'react';

interface ObserverEntryRecord {
  onIntersect: (isInView: boolean) => void;
  inView: boolean;
}

const elementRecords = new WeakMap<Element, ObserverEntryRecord>();
const activeElements = new Set<Element>();
let sharedObserver: IntersectionObserver | null = null;
let docHidden = typeof document !== 'undefined' ? document.hidden : false;
let visListenerAttached = false;

function syncPausedClass(el: Element, active: boolean): void {
  if (active) {
    el.classList.remove('oh-anim-paused');
  } else {
    el.classList.add('oh-anim-paused');
  }
}

function handleVisibilityChange(): void {
  docHidden = document.hidden;
  activeElements.forEach((el) => {
    const rec = elementRecords.get(el);
    if (!rec) return;
    const isActive = rec.inView && !docHidden;
    syncPausedClass(el, isActive);
    rec.onIntersect(isActive);
  });
}

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  if (!visListenerAttached) {
    visListenerAttached = true;
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const rec = elementRecords.get(entry.target);
          if (!rec) continue;
          rec.inView = entry.isIntersecting;
          const isActive = entry.isIntersecting && !docHidden;
          syncPausedClass(entry.target, isActive);
          rec.onIntersect(isActive);
        }
      },
      { rootMargin: '300px 0px', threshold: 0 }
    );
  }
  return sharedObserver;
}

/**
 * Shared IntersectionObserver controller (rootMargin: 300px) that toggles
 * `.oh-anim-paused` on the section container and returns whether JS/CSS loops
 * should actively tick.
 */
export function useAnimationInView(
  ref: RefObject<HTMLElement | null>,
  initialActive = false
): boolean {
  const [isActive, setIsActive] = useState(initialActive);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = getSharedObserver();
    if (!observer) {
      syncPausedClass(el, true);
      setIsActive(true);
      return;
    }

    syncPausedClass(el, initialActive && !docHidden);

    elementRecords.set(el, {
      inView: initialActive,
      onIntersect: (next) => setIsActive(next),
    });
    activeElements.add(el);
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      activeElements.delete(el);
      elementRecords.delete(el);
    };
  }, [ref, initialActive]);

  return isActive;
}
