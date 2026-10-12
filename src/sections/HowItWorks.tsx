import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Route, Info } from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { HOW_IT_WORKS_CONTENT } from '../content';

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);

  // Scroll-linked motion: line draws as section scrolls into view
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'center 50%'],
  });

  // Clamp progress between 0 and 1
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative z-0 w-full bg-white py-16 overflow-x-clip scroll-mt-24"
    >
      <Container>
        {/* Section Header: Compact, no sub line */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3F4] border border-[rgba(15,42,53,0.08)] shadow-xs mb-3 text-[13px] font-semibold text-[#1E4A5C]">
            <Route className="w-3.5 h-3.5 text-[#1E4A5C]" />
            <span>{HOW_IT_WORKS_CONTENT.pill}</span>
          </div>

          <h2 className="text-[clamp(28px,3.6vw,44px)] font-normal tracking-[-0.03em] leading-[1.12] text-[#0F2A35] max-w-3xl">
            From first look to live site, <Accent>step by step</Accent>
          </h2>
        </div>

        {/* =========================================================================
            DESKTOP TIMELINE (Horizontal row, >=1024px)
            Descriptions appear ONLY in a tooltip on hover or keyboard focus
           ========================================================================= */}
        <div className="hidden lg:block relative max-w-[1140px] mx-auto px-4 mb-8">
          {/* Base Horizontal Track Line */}
          <div className="absolute top-[38px] left-[60px] right-[60px] h-[3px] bg-[#E1E8EA] rounded-full" />

          {/* Scroll-Linked Animated Fill Line */}
          <motion.div
            style={{
              scaleX: lineProgress,
              transformOrigin: 'left',
            }}
            className="absolute top-[38px] left-[60px] right-[60px] h-[3px] bg-[#1E4A5C] rounded-full z-0"
          />

          {/* 5 Milestone Columns */}
          <div className="grid grid-cols-5 gap-4 relative z-10">
            {HOW_IT_WORKS_CONTENT.milestones.map((item, idx) => {
              const isYourTurn = item.chipType === 'your';
              const isTooltipActive = hoveredIdx === idx || focusedIdx === idx;

              return (
                <div
                  key={idx}
                  className="group relative flex flex-col items-center text-center focus-within:outline-none"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Day Label above node: 14px, weight 700, teal */}
                  <span className="text-[14px] font-bold text-[#1E4A5C] mb-2.5 tracking-tight h-5 flex items-center">
                    {item.dayLabel}
                  </span>

                  {/* 44px Circle Node (Interactive with keyboard focus) */}
                  <motion.button
                    type="button"
                    tabIndex={0}
                    aria-describedby={`milestone-desc-${idx}`}
                    onFocus={() => setFocusedIdx(idx)}
                    onBlur={() => setFocusedIdx(null)}
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-5%' }}
                    transition={{
                      duration: 0.4,
                      delay: idx * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-[15px] border-2 shadow-xs transition-transform duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] group-hover:scale-105 ${
                      isYourTurn
                        ? 'bg-[#E3B896] text-[#0F2A35] border-[#D4A379]'
                        : 'bg-[#1E4A5C] text-white border-white'
                    }`}
                  >
                    {idx + 1}
                  </motion.button>

                  {/* Content Below Node: Turn Chip & Title */}
                  <div className="pt-4 flex flex-col items-center">
                    {/* Turn Chip */}
                    <div className="mb-2">
                      {isYourTurn ? (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[13px] font-bold bg-[#E3B896] text-[#0F2A35] shadow-2xs animate-pulse-turn">
                          {item.chip}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[13px] font-bold bg-[#DCE9EC] text-[#1E4A5C]">
                          {item.chip}
                        </span>
                      )}
                    </div>

                    {/* Title: 20px/22px, weight 600 */}
                    <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#0F2A35] leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Accessible Tooltip for Description: appears on hover or keyboard focus */}
                  <div
                    id={`milestone-desc-${idx}`}
                    role="tooltip"
                    className={`absolute bottom-[-10px] translate-y-full left-1/2 -translate-x-1/2 w-64 bg-[#0F2A35] text-white text-[13px] leading-relaxed p-3.5 rounded-xl shadow-xl border border-white/10 z-40 pointer-events-none transition-all duration-200 ${
                      isTooltipActive
                        ? 'opacity-100 scale-100 visible'
                        : 'opacity-0 scale-95 invisible'
                    }`}
                  >
                    {/* Tooltip triangle arrow */}
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0F2A35] rotate-45 border-t border-l border-white/10" />
                    <div className="flex items-start gap-2 relative z-10 text-left">
                      <Info className="w-4 h-4 text-[#E3B896] shrink-0 mt-0.5" />
                      <span>{item.description}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            MOBILE & TABLET TIMELINE (Compact vertical list with title & chip only)
           ========================================================================= */}
        <div className="lg:hidden relative max-w-xl mx-auto pl-4 sm:pl-6 mb-6">
          {/* Base Vertical Track Line */}
          <div className="absolute top-4 bottom-6 left-[28px] sm:left-[36px] w-[3px] bg-[#E1E8EA] rounded-full" />

          {/* Scroll-Linked Animated Fill Line */}
          <motion.div
            style={{
              scaleY: lineProgress,
              transformOrigin: 'top',
            }}
            className="absolute top-4 bottom-6 left-[28px] sm:left-[36px] w-[3px] bg-[#1E4A5C] rounded-full z-0"
          />

          {/* Vertical Milestone Items */}
          <div className="space-y-6 sm:space-y-8 relative z-10">
            {HOW_IT_WORKS_CONTENT.milestones.map((item, idx) => {
              const isYourTurn = item.chipType === 'your';

              return (
                <div key={idx} className="flex items-center gap-3.5 sm:gap-4">
                  {/* 44px Circle Node */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-5%' }}
                    transition={{
                      duration: 0.4,
                      delay: idx * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] border-2 shadow-xs shrink-0 ${
                      isYourTurn
                        ? 'bg-[#E3B896] text-[#0F2A35] border-[#D4A379]'
                        : 'bg-[#1E4A5C] text-white border-white'
                    }`}
                  >
                    {idx + 1}
                  </motion.div>

                  {/* Compact Info: Title & Chip */}
                  <div className="flex-1 text-left flex flex-wrap items-center justify-between gap-1.5">
                    <div>
                      <span className="text-[12px] font-bold text-[#1E4A5C] block">
                        {item.dayLabel}
                      </span>
                      <h3 className="text-[16px] sm:text-[17px] font-semibold text-[#0F2A35] leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    {/* Turn Chip */}
                    {isYourTurn ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#E3B896] text-[#0F2A35] shadow-2xs">
                        {item.chip}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#DCE9EC] text-[#1E4A5C]">
                        {item.chip}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footnote Below Timeline */}
        <p className="text-[14px] text-[#5E6F77] text-center mt-6">
          {HOW_IT_WORKS_CONTENT.footnote}
        </p>
      </Container>

      {/* Subtle pulse animation for Your turn chip */}
      <style>{`
        @keyframes pulseTurnOnce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse-turn {
          animation: pulseTurnOnce 2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-turn {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
