import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Sparkles,
  Key,
  ShieldCheck,
  Check,
  Clock,
  Zap,
  Globe,
  Award,
} from 'lucide-react';
import Container from '../components/Container';
import { DELIVERY, FACTS, SUPPORT } from '../content';

// Simple count-up hook for smooth numeric animation when in view
function useCounter(target: number, durationMs: number = 1200, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      // easeOutExpo curve
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, durationMs, shouldStart]);

  return count;
}

export default function WhyOpenHours() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  // Animated counters for key metrics
  const countA = useCounter(DELIVERY.conceptWorkingDays, 1000, isInView);
  const countB = useCounter(DELIVERY.liveWorkingDays, 1200, isInView);

  // Bottom strip counter states
  const stripCount1 = useCounter(DELIVERY.firstPageWorkingDays, 1000, isInView);
  const stripCount2 = useCounter(DELIVERY.liveWorkingDays, 1200, isInView);
  const stripCount3 = useCounter(FACTS.essentials, 800, isInView);

  return (
    <section
      id="why-open-hours"
      ref={sectionRef}
      className="w-full bg-[#F7F9FA] py-20 sm:py-28 md:py-32 overflow-x-clip scroll-mt-24"
    >
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-semibold text-[#1E4A5C]">
            <Sparkles className="w-3.5 h-3.5 text-[#1E4A5C]" />
            <span>Why Open Hours</span>
          </div>

          <h2 className="text-[clamp(32px,4.4vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-3xl mb-3">
            Fast, clear and yours to keep
          </h2>

          <p className="text-[17px] sm:text-[19px] text-[#5E6F77] max-w-xl mx-auto font-normal">
            The essentials, in numbers.
          </p>
        </div>

        {/* 12-Column Bento Grid: max-width 1200px */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {/* =========================================================================
              CARD A (Light): Cols 1-4
              Label "SPEED" | Numeral = DELIVERY.conceptWorkingDays
              Text: "working days to a homepage concept"
              Title: "Fast, so you're not waiting"
              Chip: "After we speak"
              Decorative floating teal/peach glass orb (150px)
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F6] rounded-[28px] p-7 border border-[rgba(15,42,53,0.06)] shadow-[0_12px_32px_rgba(15,42,53,0.08)] relative overflow-hidden flex flex-col justify-between min-h-[340px]"
          >
            {/* Floating glass orb background decoration */}
            <div
              aria-hidden="true"
              className="absolute -right-6 -bottom-6 w-[150px] h-[150px] rounded-full pointer-events-none opacity-80 animate-bento-orb"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, rgba(227,184,150,0.55) 0%, rgba(30,74,92,0.3) 60%, rgba(15,42,53,0.05) 100%)',
                filter: 'blur(16px)',
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#1E4A5C]">
                  SPEED
                </span>
                <span className="text-[12px] font-medium text-[#1E4A5C] bg-[#DCE9EC] px-2.5 py-0.5 rounded-full">
                  After we speak
                </span>
              </div>

              {/* Big Numeral */}
              <div
                className="flex items-baseline gap-2 mb-2"
                aria-label={`${DELIVERY.conceptWorkingDays} working days to a homepage concept`}
              >
                <span className="text-[64px] sm:text-[72px] font-semibold text-[#0F2A35] tracking-tight leading-none">
                  {countA}
                </span>
              </div>
              <p className="text-[15px] font-medium text-[#0F2A35] leading-snug">
                working days to a homepage concept
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-[rgba(15,42,53,0.06)]">
              <h3 className="text-[19px] font-semibold text-[#0F2A35] mb-1">
                Fast, so you&apos;re not waiting
              </h3>
              <p className="text-[14px] text-[#5E6F77] leading-relaxed">
                See what your business looks like before you commit to building out the full site.
              </p>
            </div>
          </motion.div>

          {/* =========================================================================
              CARD B (Light): Cols 5-8
              Label "TIMELINE" | Numeral = DELIVERY.liveWorkingDays
              Text: "working days to go live (typical)"
              Title: "Typical build timeline"
              10 rising vertical staircase bars filling from #CBD6DA to #1E4A5C (last bar #E3B896) on scroll
              Labels "Day 1" and "Go live"
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F6] rounded-[28px] p-7 border border-[rgba(15,42,53,0.06)] shadow-[0_12px_32px_rgba(15,42,53,0.08)] relative overflow-hidden flex flex-col justify-between min-h-[340px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#1E4A5C]">
                  TIMELINE
                </span>
                <span className="text-[12px] font-medium text-[#5E6F77] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1E4A5C]" />
                  Standard build
                </span>
              </div>

              {/* Big Numeral */}
              <div
                className="flex items-baseline gap-2 mb-2"
                aria-label={`${DELIVERY.liveWorkingDays} working days to go live (typical)`}
              >
                <span className="text-[64px] sm:text-[72px] font-semibold text-[#0F2A35] tracking-tight leading-none">
                  {countB}
                </span>
              </div>
              <p className="text-[15px] font-medium text-[#0F2A35] leading-snug">
                working days to go live (typical)
              </p>
            </div>

            {/* Rising staircase bars */}
            <div className="pt-4">
              <div className="flex items-end justify-between gap-1.5 h-14 mb-2 px-1">
                {Array.from({ length: 10 }).map((_, i) => {
                  const isLast = i === 9;
                  const heightPercent = 20 + i * 8.5; // rising staircase from 20% to 100%
                  return (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.2 + i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        originY: 1,
                        height: `${heightPercent}%`,
                        backgroundColor: isLast ? '#E3B896' : i > 5 ? '#1E4A5C' : '#CBD6DA',
                      }}
                      className="flex-1 rounded-t-sm"
                      title={`Day ${i + 1}`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#5E6F77] font-medium px-1">
                <span>Day 1</span>
                <span className="text-[#0F2A35] font-semibold">Go live</span>
              </div>

              <div className="pt-4 mt-4 border-t border-[rgba(15,42,53,0.06)]">
                <h3 className="text-[18px] font-semibold text-[#0F2A35]">
                  Typical build timeline
                </h3>
              </div>
            </div>
          </motion.div>

          {/* =========================================================================
              CARD C (Dark): Cols 9-12
              Label "OWNERSHIP" | Title: "You own it" (Gold 28px)
              3 sliding white-pill rows ("Your domain", "Your website", "Your content")
              with key icons & gold "Yours" chips
              Text: "No lock-in. If you leave, you take everything."
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(180deg, #0F2A35 0%, #1E4A5C 100%)',
            }}
            className="lg:col-span-4 rounded-[28px] p-7 border border-[rgba(227,184,150,0.22)] shadow-[0_18px_40px_rgba(15,42,53,0.28)] relative overflow-hidden flex flex-col justify-between min-h-[340px] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_90%_10%,rgba(227,184,150,0.14)_0%,transparent_60%)] before:pointer-events-none"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#E3B896]">
                  OWNERSHIP
                </span>
                <span className="w-2 h-2 rounded-full bg-[#E3B896]" />
              </div>

              <h3 className="text-[28px] font-semibold text-[#E3B896] mb-5 tracking-tight">
                You own it
              </h3>

              {/* 3 Sliding White-Pill Rows */}
              <div className="space-y-2.5">
                {[
                  { label: 'Your domain', icon: Globe },
                  { label: 'Your website', icon: Key },
                  { label: 'Your content', icon: ShieldCheck },
                ].map((row, idx) => {
                  const RowIcon = row.icon;
                  return (
                    <motion.div
                      key={row.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.25 + idx * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="bg-white/95 backdrop-blur-xs rounded-full py-2 px-3.5 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2 text-[#0F2A35]">
                        <div className="w-6 h-6 rounded-full bg-[#DCE9EC] flex items-center justify-center shrink-0">
                          <RowIcon className="w-3.5 h-3.5 text-[#1E4A5C]" />
                        </div>
                        <span className="text-[13px] font-medium">{row.label}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#0F2A35] bg-[#F4E6D8] px-2 py-0.5 rounded-full">
                        Yours
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 pt-5 mt-5 border-t border-white/[0.12]">
              <p className="text-[14px] text-white/[0.88] leading-relaxed">
                No lock-in. If you leave, you take everything.
              </p>
            </div>
          </motion.div>

          {/* =========================================================================
              CARD D (Dark): Cols 1-4 (Row 2 Desktop)
              Label "FIXED PRICE"
              Title: "A written quote, no surprises" (Gold 22px)
              White mini-card with 3 sequential animated ticks (#2E9E6B, 350ms stagger):
                - "Quote before we start"
                - "Price stays the same unless the scope changes"
                - "Deposit only after you approve the concept"
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(180deg, #0F2A35 0%, #1E4A5C 100%)',
            }}
            className="lg:col-span-4 rounded-[28px] p-7 border border-[rgba(227,184,150,0.22)] shadow-[0_18px_40px_rgba(15,42,53,0.28)] relative overflow-hidden flex flex-col justify-between min-h-[340px] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_90%_10%,rgba(227,184,150,0.14)_0%,transparent_60%)] before:pointer-events-none"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#E3B896]">
                  FIXED PRICE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#E3B896]" />
              </div>

              <h3 className="text-[22px] font-semibold text-[#E3B896] mb-5 leading-snug">
                A written quote, no surprises
              </h3>

              {/* White mini-card with 3 rows ticking one after another */}
              <div className="bg-white rounded-[20px] p-4 shadow-md space-y-3">
                {[
                  'Quote before we start',
                  'Price stays the same unless the scope changes',
                  'Deposit only after you approve the concept',
                ].map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + idx * 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-start gap-2.5 text-left"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.3 + idx * 0.35,
                        type: 'spring',
                        stiffness: 400,
                        damping: 20,
                      }}
                      className="w-5 h-5 rounded-full bg-[#2E9E6B]/15 flex items-center justify-center shrink-0 mt-0.5"
                    >
                      <Check className="w-3.5 h-3.5 text-[#2E9E6B] stroke-[3]" />
                    </motion.div>
                    <span className="text-[13px] font-medium text-[#0F2A35] leading-snug">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-4 border-t border-white/[0.12]">
              <p className="text-[13px] text-white/[0.82]">
                Everything spelled out in writing before you spend a cent.
              </p>
            </div>
          </motion.div>

          {/* =========================================================================
              CARD E (Light Horizontal): Cols 5-12 (Row 2 Desktop)
              72px ShieldCheck icon tile (teal on #DCE9EC with entrance pulse ring)
              Label "PEACE OF MIND" | Numeral = FACTS.postLaunchFixDays (30)
              Text: "days of post-launch fixes included"
              Title: "Support after you go live"
              Description: "Any tweak, typo or photo swap within the first month is covered promptly."
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F6] rounded-[28px] p-7 sm:p-8 border border-[rgba(15,42,53,0.06)] shadow-[0_12px_32px_rgba(15,42,53,0.08)] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 min-h-[340px]"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {/* 72px ShieldCheck icon tile with pulse ring */}
                <div className="relative">
                  <div className="w-[72px] h-[72px] rounded-[22px] bg-[#DCE9EC] flex items-center justify-center relative z-10">
                    <ShieldCheck className="w-9 h-9 text-[#1E4A5C]" />
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[22px] bg-[#1E4A5C]/20 animate-ping opacity-60 pointer-events-none"
                    style={{ animationDuration: '3s' }}
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#1E4A5C] block mb-1">
                    PEACE OF MIND
                  </span>
                  <span className="text-[13px] font-medium text-[#5E6F77]">
                    {SUPPORT.label}
                  </span>
                </div>
              </div>

              <h3 className="text-[24px] sm:text-[28px] font-semibold text-[#0F2A35] mb-2 leading-tight">
                Support after you go live
              </h3>
              <p className="text-[15px] text-[#5E6F77] max-w-lg leading-relaxed">
                {SUPPORT.line}. Fixes to what we build are covered promptly at no extra charge, for as long as your website is hosted with us.
              </p>
            </div>

            {/* Big Stat Callout on the Right */}
            <div
              className="bg-white rounded-[22px] p-6 border border-[rgba(15,42,53,0.06)] shadow-xs flex flex-col items-center sm:items-end text-center sm:text-right shrink-0 w-full sm:w-auto"
              aria-label={SUPPORT.line}
            >
              <div className="text-[38px] sm:text-[46px] font-semibold text-[#0F2A35] tracking-tight leading-none mb-1">
                Lifetime
              </div>
              <span className="text-[14px] font-semibold text-[#1E4A5C]">
                Support included
              </span>
              <span className="text-[12px] text-[#5E6F77] mt-0.5">
                Zero extra charges
              </span>
            </div>
          </motion.div>

          {/* =========================================================================
              CARD F (Light Full-Width Strip): Cols 1-12 (Row 3 Desktop)
              Four prominent metrics side-by-side in a wide strip:
                1. Concept in {DELIVERY.conceptWorkingDays} working days
                2. Live in {DELIVERY.liveWorkingDays} working days (typical)
                3. {FACTS.essentials} essentials included
                4. {FACTS.postLaunchFixDays} days post-launch support
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-12 bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F6] rounded-[28px] p-6 sm:p-8 border border-[rgba(15,42,53,0.06)] shadow-[0_12px_32px_rgba(15,42,53,0.08)]"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-[rgba(15,42,53,0.08)]">
              {/* Metric 1 */}
              <div
                className="pt-4 md:pt-0 md:px-4 first:pt-0 first:px-0 flex flex-col items-center text-center"
                aria-label={`About ${DELIVERY.firstPageWorkingDays} working days to your 1-page website`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#DCE9EC] flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-[#1E4A5C]" />
                </div>
                <div className="text-[36px] sm:text-[44px] font-semibold text-[#0F2A35] tracking-tight leading-none mb-1">
                  ~{stripCount1}
                </div>
                <div className="text-[13px] sm:text-[14px] font-semibold text-[#0F2A35] mb-0.5">
                  Working days
                </div>
                <div className="text-[12px] text-[#5E6F77]">
                  To your 1-page website
                </div>
              </div>

              {/* Metric 2 */}
              <div
                className="pt-4 md:pt-0 md:px-4 flex flex-col items-center text-center"
                aria-label={`About ${DELIVERY.liveWorkingDays} working days to go live (typical)`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#DCE9EC] flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-[#1E4A5C]" />
                </div>
                <div className="text-[36px] sm:text-[44px] font-semibold text-[#0F2A35] tracking-tight leading-none mb-1">
                  ~{stripCount2}
                </div>
                <div className="text-[13px] sm:text-[14px] font-semibold text-[#0F2A35] mb-0.5">
                  Working days
                </div>
                <div className="text-[12px] text-[#5E6F77]">
                  To go live (typical)
                </div>
              </div>

              {/* Metric 3 */}
              <div
                className="pt-4 md:pt-0 md:px-4 flex flex-col items-center text-center"
                aria-label={`${FACTS.essentials} core essentials included with every build`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#DCE9EC] flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-[#1E4A5C]" />
                </div>
                <div className="text-[36px] sm:text-[44px] font-semibold text-[#0F2A35] tracking-tight leading-none mb-1">
                  {stripCount3}
                </div>
                <div className="text-[13px] sm:text-[14px] font-semibold text-[#0F2A35] mb-0.5">
                  Core essentials
                </div>
                <div className="text-[12px] text-[#5E6F77]">
                  Included in every build
                </div>
              </div>

              {/* Metric 4 */}
              <div
                className="pt-4 md:pt-0 md:px-4 flex flex-col items-center text-center"
                aria-label={SUPPORT.line}
              >
                <div className="w-9 h-9 rounded-xl bg-[#DCE9EC] flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#1E4A5C]" />
                </div>
                <div className="text-[clamp(30px,3.4vw,48px)] font-semibold text-[#0F2A35] tracking-tight leading-none mb-1">
                  Lifetime
                </div>
                <div className="text-[13px] sm:text-[14px] font-semibold text-[#0F2A35] mb-0.5">
                  support after you go live
                </div>
                <div className="text-[12px] text-[#5E6F77]">
                  On paid builds
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Note under Grid */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-[13px] sm:text-[14px] text-[#5E6F77]">
            Timelines are typical and start once we have your photos and details.
          </p>
          <p className="text-[13px] text-[#5E6F77] max-w-2xl mx-auto">
            {SUPPORT.terms}
          </p>
        </div>
      </Container>

      {/* Embedded Orb Float Animation */}
      <style>{`
        @keyframes bentoOrbFloat {
          0%, 100% {
            transform: translateY(-6px);
          }
          50% {
            transform: translateY(6px);
          }
        }
        .animate-bento-orb {
          animation: bentoOrbFloat 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-bento-orb {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
