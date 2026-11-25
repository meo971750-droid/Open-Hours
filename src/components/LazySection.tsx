import React, { Suspense, useEffect, useRef, useState } from 'react';
import { getSmallAvatarSrc, preloadResponsiveImage } from '../lib/images';
import { notifyScrollLayoutChanged } from '../lib/scrollHub';

export interface LazyImageHint {
  src: string;
  type?: 'avatar' | 'responsive';
  widths?: number[];
  sizes?: string;
}

interface RegisteredSection {
  id: string;
  loadChunk: () => Promise<unknown>;
  forceMount: () => void;
  firstImages?: LazyImageHint[];
}

const sectionRegistry = new Map<string, RegisteredSection>();
const preloadedSectionIds = new Set<string>();
const elementToId = new WeakMap<Element, string>();
let sharedNearObserver: IntersectionObserver | null = null;

function preloadSectionResources(id: string): void {
  if (preloadedSectionIds.has(id)) return;
  const rec = sectionRegistry.get(id);
  if (!rec) return;
  preloadedSectionIds.add(id);

  rec.loadChunk().catch(() => {});

  if (rec.firstImages) {
    for (const hint of rec.firstImages) {
      if (!hint.src) continue;
      if (hint.type === 'avatar') {
        const avatarSrc = getSmallAvatarSrc(hint.src);
        if (avatarSrc && typeof window !== 'undefined') {
          const img = new Image();
          img.decoding = 'async';
          img.src = avatarSrc;
        }
      } else {
        preloadResponsiveImage(
          hint.src,
          hint.widths || [320, 640, 960],
          hint.sizes || '(max-width: 767px) 92vw, 640px'
        );
      }
    }
  }
}

export function preloadSectionAndNext(id: string, nextId?: string): void {
  preloadSectionResources(id);
  if (nextId) {
    preloadSectionResources(nextId);
  }
}

function getNearObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  if (!sharedNearObserver) {
    sharedNearObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = elementToId.get(entry.target);
          if (!id) continue;
          const rec = sectionRegistry.get(id);
          if (rec) {
            rec.forceMount();
          }
        }
      },
      { rootMargin: '1200px 0px', threshold: 0 }
    );
  }
  return sharedNearObserver;
}

interface LazySectionProps {
  id: string;
  nextId?: string;
  placeholderClassName: string;
  children: React.ReactNode;
  loadChunk: () => Promise<unknown>;
  firstImages?: LazyImageHint[];
}

export default function LazySection({
  id,
  nextId,
  placeholderClassName,
  children,
  loadChunk,
  firstImages,
}: LazySectionProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const sentinelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    sectionRegistry.set(id, {
      id,
      loadChunk,
      firstImages,
      forceMount: () => setShouldRender(true),
    });

    if (shouldRender) {
      preloadSectionResources(id);
      if (nextId) {
        preloadSectionResources(nextId);
      }
      notifyScrollLayoutChanged();
      return;
    }

    const el = sentinelRef.current;
    if (!el) return;
    const observer = getNearObserver();
    if (!observer) {
      setShouldRender(true);
      return;
    }

    elementToId.set(el, id);
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      elementToId.delete(el);
    };
  }, [id, nextId, shouldRender, loadChunk, firstImages]);

  useEffect(() => {
    if (!shouldRender) return;
    // Notify cached scroll geometry after suspended section mounts
    const raf = window.requestAnimationFrame(() => notifyScrollLayoutChanged());
    return () => window.cancelAnimationFrame(raf);
  }, [shouldRender]);

  const placeholder = (
    <section
      ref={sentinelRef}
      id={id}
      aria-hidden="true"
      className={`w-full ${placeholderClassName}`}
    />
  );

  if (!shouldRender) {
    return placeholder;
  }

  return <Suspense fallback={placeholder}>{children}</Suspense>;
}
