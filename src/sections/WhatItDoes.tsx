import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import {
  MessageSquareReply,
  PhoneCall,
  ClipboardList,
  Bell,
} from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import MagneticCursor from '../components/ui/magnetic-cursor';
import { WHAT_IT_DOES_CONTENT } from '../content';

export default function WhatItDoes() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // References for cards and halos
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const haloRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqHover = window.matchMedia('(hover: hover) and (pointer: fine)');

    setReducedMotion(mqMotion.matches);
    setCanHover(mqHover.matches);

    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    const hoverHandler = (e: MediaQueryListEvent) => setCanHover(e.matches);

    mqMotion.addEventListener('change', motionHandler);
    mqHover.addEventListener('change', hoverHandler);

    return () => {
      mqMotion.removeEventListener('change', motionHandler);
      mqHover.removeEventListener('change', hoverHandler);
    };
  }, []);

  // Per-card magnetic movement and halo interactions
  useEffect(() => {
    if (!canHover || reducedMotion) return;

    const cleanupFns: (() => void)[] = [];

    cardRefs.current.forEach((wrapper, idx) => {
      const halo = haloRefs.current[idx];
      if (!wrapper || !halo) return;

      // QuickTo setters for smooth elastic magnetic effect
      const xTo = gsap.quickTo(wrapper, 'x', { duration: 0.35, ease: 'elastic.out(1, 0.35)' });
      const yTo = gsap.quickTo(wrapper, 'y', { duration: 0.35, ease: 'elastic.out(1, 0.35)' });

      const onPointerEnter = () => {
        // Raise wrapper z-index to 5 (others 1)
        wrapper.style.zIndex = '5';
        gsap.to(halo, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };

      const onPointerMove = (e: PointerEvent) => {
        const rect = wrapper.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);

        // Factor 0.14, clamp +-10px per axis
        const factor = 0.14;
        const clampedX = Math.max(-10, Math.min(10, relX * factor));
        const clampedY = Math.max(-10, Math.min(10, relY * factor));

        xTo(clampedX);
        yTo(clampedY);
      };

      const onPointerLeave = () => {
        xTo(0);
        yTo(0);
        gsap.to(halo, {
          opacity: 0,
          scale: 0.96,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => {
            // Restore z-index after tween if not focused
            if (!wrapper.matches(':focus-within')) {
              wrapper.style.zIndex = '1';
            }
          },
        });
      };

      const onFocusIn = () => {
        wrapper.style.zIndex = '5';
        gsap.to(halo, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };

      const onFocusOut = () => {
        gsap.to(halo, {
          opacity: 0,
          scale: 0.96,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => {
            wrapper.style.zIndex = '1';
          },
        });
      };

      wrapper.addEventListener('pointerenter', onPointerEnter);
      wrapper.addEventListener('pointermove', onPointerMove);
      wrapper.addEventListener('pointerleave', onPointerLeave);
      wrapper.addEventListener('focusin', onFocusIn);
      wrapper.addEventListener('focusout', onFocusOut);

      cleanupFns.push(() => {
        wrapper.removeEventListener('pointerenter', onPointerEnter);
        wrapper.removeEventListener('pointermove', onPointerMove);
        wrapper.removeEventListener('pointerleave', onPointerLeave);
        wrapper.removeEventListener('focusin', onFocusIn);
        wrapper.removeEventListener('focusout', onFocusOut);
        gsap.killTweensOf([wrapper, halo]);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [canHover, reducedMotion]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquareReply':
        return <MessageSquareReply className="w-7 h-7 text-[#1E4A5C]" />;
      case 'PhoneCall':
        return <PhoneCall className="w-7 h-7 text-[#1E4A5C]" />;
      case 'ClipboardList':
        return <ClipboardList className="w-7 h-7 text-[#1E4A5C]" />;
      case 'Bell':
        return <Bell className="w-7 h-7 text-[#1E4A5C]" />;
      default:
        return <MessageSquareReply className="w-7 h-7 text-[#1E4A5C]" />;
    }
  };

  return (
    <section
      id="what-it-does"
      ref={sectionRef}
      className="relative w-full bg-white pt-10 sm:pt-10 md:pt-14 pb-20 sm:pb-28 md:pb-32 overflow-visible scroll-mt-24"
    >
      <MagneticCursor scopeRef={sectionRef}>
        <Container>
          {/* Header: Centred, same style as other sections */}
          <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE9EC] text-[#1E4A5C] text-[13px] font-semibold mb-4">
              <MessageSquareReply className="w-3.5 h-3.5 text-[#1E4A5C]" />
              <span>{WHAT_IT_DOES_CONTENT.pill}</span>
            </div>

            <h2 className="text-[clamp(32px,4.4vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-3xl mb-4">
              Your website handles the <Accent>first reply</Accent>
            </h2>

            <p className="text-[17px] sm:text-[19px] text-[#5E6F77] max-w-xl mx-auto font-normal">
              {WHAT_IT_DOES_CONTENT.subtext}
            </p>
          </div>

          {/* Section content wrapper with padding-inline >= 28px and padding-block >= 28px so halo is never cut */}
          <div className="relative max-w-[1240px] mx-auto px-7 py-7 overflow-visible">
            {/* Thin dashed connector with traveling peach dot (desktop >= 1100px only) */}
            <div
              aria-hidden="true"
              className="hidden min-[1100px]:block absolute top-[84px] left-[84px] right-[84px] h-[2px] pointer-events-none z-0"
            >
              {/* Dashed background track */}
              <div className="w-full h-full border-t border-dashed border-[#CBD6DA]" />

              {/* Traveling peach dot across the line (transform only) */}
              {!reducedMotion && (
                <motion.div
                  initial={{ transform: 'translateX(0px)' }}
                  whileInView={{ transform: 'translateX(calc(1200px - 140px))' }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -top-[5px] left-0 w-3 h-3 rounded-full bg-[#E3B896] shadow-sm"
                />
              )}
            </div>

            {/* Cards Grid:
                Gap: 40px at >= 1024px, 32px at 640-1023px, 28px below 640px
                Columns: 4 cols >= 1100px, 2 cols 640-1099px, 1 col below
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 min-[1100px]:grid-cols-4 gap-7 sm:gap-8 lg:gap-10 relative z-10 overflow-visible">
              {WHAT_IT_DOES_CONTENT.cards.map((card, idx) => (
                <div
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  data-magnetic
                  className="halo-wrap group"
                  style={{
                    position: 'relative',
                    isolation: 'isolate',
                    borderRadius: 'var(--card-radius, 24px)',
                    zIndex: 1,
                    ['--card-radius' as string]: '24px',
                    ['--halo-pad' as string]: '14px',
                  }}
                >
                  {/* Per-card halo frame: dark green gradient background, concentric radius */}
                  <span
                    ref={(el) => {
                      haloRefs.current[idx] = el;
                    }}
                    data-halo
                    aria-hidden="true"
                    className="halo"
                    style={{
                      position: 'absolute',
                      inset: 'calc(var(--halo-pad) * -1)',
                      borderRadius: 'calc(var(--card-radius) + var(--halo-pad))',
                      background: 'linear-gradient(180deg, #0F2A35, #1E4A5C)',
                      border: '1.5px solid rgba(227, 184, 150, 0.55)',
                      boxShadow: '0 18px 40px rgba(15, 42, 53, 0.30), 0 0 0 1px rgba(15, 42, 53, 0.25)',
                      zIndex: 0,
                      pointerEvents: 'none',
                      opacity: 0,
                      transform: 'scale(0.94)',
                      transformOrigin: 'center',
                      willChange: 'transform, opacity',
                    }}
                  />

                  {/* The Framer Motion card itself stays fully visible, unchanged on top with position: relative, zIndex: 1 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: reducedMotion ? 0 : idx * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative z-[1] bg-gradient-to-b from-white to-[#F1F5F6] p-7 border border-[rgba(15,42,53,0.06)] shadow-[0_12px_32px_rgba(15,42,53,0.06)] flex flex-col justify-start h-full"
                    style={{
                      borderRadius: 'var(--card-radius, 24px)',
                    }}
                  >
                    {/* 56px Icon Tile */}
                    <div className="w-14 h-14 rounded-2xl bg-[#DCE9EC] flex items-center justify-center text-[#1E4A5C] mb-6 shadow-xs shrink-0">
                      {getIcon(card.icon)}
                    </div>

                    {/* Title */}
                    <h3 className="text-[22px] font-semibold text-[#0F2A35] leading-snug mb-2.5">
                      {card.title}
                    </h3>

                    {/* Body */}
                    <p className="text-[16px] text-[#5E6F77] leading-relaxed">
                      {card.description}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </MagneticCursor>
    </section>
  );
}
