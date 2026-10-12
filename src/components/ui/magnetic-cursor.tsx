// Fluid Magnetic Cursor scoped to container: peach dot cursor while pointer is inside section and NOT over a card
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

interface Vec2 {
  x: number;
  y: number;
}

const v = {
  create: (x = 0, y = 0): Vec2 => ({ x, y }),
  lerp: (a: Vec2, b: Vec2, t: number): Vec2 => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  }),
};

export interface MagneticCursorProps {
  children?: React.ReactNode;
  scopeRef: React.RefObject<HTMLElement | null>;
  lerpAmount?: number;
}

export default function MagneticCursor({
  children,
  scopeRef,
  lerpAmount = 0.16,
}: MagneticCursorProps) {
  const [canHover, setCanHover] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);

  // Check pointer capability & reduced motion
  useEffect(() => {
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    setCanHover(hoverMq.matches);
    setPrefersReducedMotion(motionMq.matches);
    setMounted(true);

    const handleHoverChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    hoverMq.addEventListener('change', handleHoverChange);
    motionMq.addEventListener('change', handleMotionChange);

    return () => {
      hoverMq.removeEventListener('change', handleHoverChange);
      motionMq.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!canHover || prefersReducedMotion || !mounted) return;
    const scope = scopeRef.current;
    const cursor = cursorRef.current;
    if (!scope || !cursor) return;

    // Vector state
    const mouse = v.create(0, 0);
    const target = v.create(0, 0);
    const current = v.create(0, 0);

    let isInsideScope = false;
    let isOverCard = false;
    let tickerActive = false;

    // Set initial cursor style: peach dot cursor (12px, border-radius 6px in px, not %)
    gsap.set(cursor, {
      opacity: 0,
      width: 12,
      height: 12,
      borderRadius: '6px',
      backgroundColor: '#E3B896',
      mixBlendMode: 'normal',
      boxShadow: '0 2px 8px rgba(15, 42, 53, 0.15)',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
    });

    // Ticker callback: moves peach dot to mouse position only while inside section
    const onTick = () => {
      if (!isInsideScope) return;

      target.x = mouse.x;
      target.y = mouse.y;

      const next = v.lerp(current, target, lerpAmount);
      current.x = next.x;
      current.y = next.y;

      gsap.set(cursor, {
        x: current.x,
        y: current.y,
      });
    };

    const startTicker = () => {
      if (!tickerActive) {
        tickerActive = true;
        gsap.ticker.add(onTick);
      }
    };

    const stopTicker = () => {
      if (tickerActive) {
        tickerActive = false;
        gsap.ticker.remove(onTick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isInsideScope) {
        isInsideScope = true;
        current.x = mouse.x;
        current.y = mouse.y;
        target.x = mouse.x;
        target.y = mouse.y;
        startTicker();
        if (!isOverCard) {
          gsap.to(cursor, { opacity: 1, duration: 0.15, overwrite: 'auto' });
        }
      }

      // Check if hovering a [data-magnetic] element within scope
      const el = (e.target as HTMLElement | null)?.closest?.('[data-magnetic]') as HTMLElement | null;
      const hoveredCard = Boolean(el && scope.contains(el));

      if (hoveredCard !== isOverCard) {
        isOverCard = hoveredCard;
        if (isOverCard) {
          // Fades out (opacity 0, 0.15s) when a card is hovered
          gsap.to(cursor, { opacity: 0, duration: 0.15, overwrite: 'auto' });
        } else {
          // Back in when pointer leaves the card
          gsap.to(cursor, { opacity: 1, duration: 0.15, overwrite: 'auto' });
        }
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      isInsideScope = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      current.x = mouse.x;
      current.y = mouse.y;
      target.x = mouse.x;
      target.y = mouse.y;
      startTicker();

      const el = (e.target as HTMLElement | null)?.closest?.('[data-magnetic]') as HTMLElement | null;
      isOverCard = Boolean(el && scope.contains(el));
      if (!isOverCard) {
        gsap.to(cursor, { opacity: 1, duration: 0.15, overwrite: 'auto' });
      }
    };

    const onPointerLeave = () => {
      isInsideScope = false;
      isOverCard = false;

      gsap.to(cursor, {
        opacity: 0,
        duration: 0.15,
        overwrite: 'auto',
        onComplete: stopTicker,
      });
    };

    scope.addEventListener('pointerenter', onPointerEnter);
    scope.addEventListener('pointerleave', onPointerLeave);
    scope.addEventListener('pointermove', onPointerMove);

    return () => {
      stopTicker();
      scope.removeEventListener('pointerenter', onPointerEnter);
      scope.removeEventListener('pointerleave', onPointerLeave);
      scope.removeEventListener('pointermove', onPointerMove);

      if (cursor) {
        gsap.killTweensOf(cursor);
      }
    };
  }, [canHover, prefersReducedMotion, scopeRef, lerpAmount, mounted]);

  return (
    <>
      {children}
      {canHover &&
        !prefersReducedMotion &&
        mounted &&
        createPortal(
          <div
            ref={cursorRef}
            aria-hidden="true"
            className="fixed top-0 left-0 z-50 pointer-events-none select-none"
            style={{
              willChange: 'transform, opacity',
            }}
          />,
          document.body
        )}
    </>
  );
}
