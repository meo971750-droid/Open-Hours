import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  PhoneCall,
  Clock,
  CheckCircle2,
  ArrowUp,
} from 'lucide-react';
import { SAMPLE_DASHBOARD } from '../content';
import { CONFIG } from '../config';

export interface MessageItem {
  id: string;
  title: string;
  location: string;
  time: string;
  status: 'New' | 'Replied';
  isHighlight?: boolean;
}

/**
 * Master clock timing constants in seconds
 * Total cycle: 8.5 seconds (compressed, starts earlier, smoother)
 */
export const GROWTH_TIMING = {
  zeroHold: 0.35, // 0.0s to 0.35s: zero-state hold on entry
  buildUp: 2.2, // total build-up duration (0.35s to 2.55s)
  countersDuration: 1.8, // counters 0->24, 0->7 in 1.8s (easeOutCubic)
  barsStart: 0.05, // bars start growing at 0.05s into buildup
  barsDuration: 0.45, // each bar grows over 0.45s with spring
  barsStagger: 0.045, // 45ms stagger per bar
  ringStart: 0.15, // ring starts drawing at 0.15s into buildup
  ringDuration: 1.5, // whole ring draws over 1.5s
  row1Slide: 0.55, // row 1 slides in at 0.55s into buildup
  row2Slide: 1.0, // row 2 slides in at 1.0s into buildup
  row3Slide: 1.45, // row 3 slides in at 1.45s into buildup
  buildupRowSlideDuration: 0.26, // 260ms per row
  buildupRepliedDelay: 0.35, // 350ms after slide-in
  revealsFade: 1.7, // +6 badge and auto-text row fade in at 1.7s
  livePhaseStart: 2.55, // buildup ends, live phase begins
  liveEventInterval: 1.7, // 3 events, one every 1.7s
  liveEvent1: 3.15, // Event 1 at 3.15s
  liveEvent2: 4.85, // Event 2 at 4.85s (3.15 + 1.7)
  liveEvent3: 6.55, // Event 3 at 6.55s (4.85 + 1.7)
  liveRowSlideDuration: 0.24, // 240ms per live row
  liveRepliedDelay: 0.9, // 0.9s until "New" turns "Replied"
  scalePopDuration: 0.3, // tick-up scale pop duration
  statusPulseDuration: 0.6, // status chip pulse duration
  peachFlashDuration: 0.6, // peach flash on missed calls recovered
  matureHoldEnd: 8.25, // hold mature state until 8.25s
  fadeOut: 0.25, // 8.25s to 8.50s: 0.25s fade-out
  totalCycle: 8.5, // total cycle length: exactly 8.5 seconds
} as const;

const BASE_SPARKLINE = [33, 50, 42, 62, 58, 75, 66, 92, 83, 100];
const RING_CIRCUMFERENCE = 88; // 2 * PI * 14 ≈ 87.96

export default function LiveMockup({
  isRowSliding,
}: {
  isRowSliding?: (sliding: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // DOM Refs for direct manipulation (smooth 60/120Hz rAF without per-frame React state)
  const enquiriesCountElRef = useRef<HTMLSpanElement>(null);
  const missedCallsCountElRef = useRef<HTMLSpanElement>(null);
  const dayChipElRef = useRef<HTMLSpanElement>(null);
  const sparklineBarElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const googleCircleRef = useRef<SVGCircleElement>(null);
  const facebookCircleRef = useRef<SVGCircleElement>(null);
  const directCircleRef = useRef<SVGCircleElement>(null);
  const googlePctRef = useRef<HTMLSpanElement>(null);
  const facebookPctRef = useRef<HTMLSpanElement>(null);
  const directPctRef = useRef<HTMLSpanElement>(null);
  const growthBadgeElRef = useRef<HTMLSpanElement>(null);
  const autoTextRowElRef = useRef<HTMLDivElement>(null);
  const statusChipElRef = useRef<HTMLSpanElement>(null);

  // React state only for discrete message rows / phases
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Animation lifecycle refs
  const clockTimeRef = useRef(0);
  const isVisibleRef = useRef(false);
  const isTabVisibleRef = useRef(!document.hidden);
  const messageStageRef = useRef(-1);

  // Direct DOM Parked Zero-State writer
  const applyZeroState = useCallback(() => {
    if (enquiriesCountElRef.current) enquiriesCountElRef.current.textContent = '0';
    if (missedCallsCountElRef.current) missedCallsCountElRef.current.textContent = '0';
    if (dayChipElRef.current) {
      dayChipElRef.current.textContent = 'Day 1';
      dayChipElRef.current.className =
        'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 bg-[#0F2A35]/5 text-[#5E6F77] border border-[rgba(15,42,53,0.08)]';
    }
    sparklineBarElsRef.current.forEach((bar) => {
      if (bar) bar.style.transform = 'scaleY(0)';
    });
    if (googleCircleRef.current) {
      googleCircleRef.current.style.strokeDasharray = '0 88';
      googleCircleRef.current.style.strokeDashoffset = '0';
    }
    if (facebookCircleRef.current) {
      facebookCircleRef.current.style.strokeDasharray = '0 88';
      facebookCircleRef.current.style.strokeDashoffset = '0';
    }
    if (directCircleRef.current) {
      directCircleRef.current.style.strokeDasharray = '0 88';
      directCircleRef.current.style.strokeDashoffset = '0';
    }
    if (googlePctRef.current) googlePctRef.current.textContent = 'Google 0%';
    if (facebookPctRef.current) facebookPctRef.current.textContent = 'Facebook 0%';
    if (directPctRef.current) directPctRef.current.textContent = 'Direct 0%';
    if (growthBadgeElRef.current) growthBadgeElRef.current.style.opacity = '0';
    if (autoTextRowElRef.current) {
      autoTextRowElRef.current.style.opacity = '0';
      autoTextRowElRef.current.classList.remove('bg-[#E3B896]/30', 'border-[#E3B896]', 'text-[#0F2A35]');
    }
    if (statusChipElRef.current) {
      statusChipElRef.current.classList.remove('scale-105', 'bg-[#2E9E6B]/20', 'ring-2', 'ring-[#2E9E6B]/30');
    }
    if (containerRef.current) containerRef.current.style.opacity = '1';
    setMessages([]);
    messageStageRef.current = 0;
  }, []);

  // Direct DOM Reduced-Motion Static State writer
  const applyFinalState = useCallback(() => {
    if (enquiriesCountElRef.current) enquiriesCountElRef.current.textContent = '24';
    if (missedCallsCountElRef.current) missedCallsCountElRef.current.textContent = '7';
    if (dayChipElRef.current) {
      dayChipElRef.current.textContent = 'Day 30';
      dayChipElRef.current.className =
        'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 bg-[#1E4A5C]/10 text-[#1E4A5C] border border-[#1E4A5C]/20';
    }
    sparklineBarElsRef.current.forEach((bar) => {
      if (bar) bar.style.transform = 'scaleY(1)';
    });
    const C = RING_CIRCUMFERENCE;
    if (googleCircleRef.current) {
      googleCircleRef.current.style.strokeDasharray = `${(C * 0.58).toFixed(1)} ${C}`;
      googleCircleRef.current.style.strokeDashoffset = '0';
    }
    if (facebookCircleRef.current) {
      facebookCircleRef.current.style.strokeDasharray = `${(C * 0.27).toFixed(1)} ${C}`;
      facebookCircleRef.current.style.strokeDashoffset = `${-(C * 0.58).toFixed(1)}`;
    }
    if (directCircleRef.current) {
      directCircleRef.current.style.strokeDasharray = `${(C * 0.15).toFixed(1)} ${C}`;
      directCircleRef.current.style.strokeDashoffset = `${-(C * 0.85).toFixed(1)}`;
    }
    if (googlePctRef.current) googlePctRef.current.textContent = 'Google 58%';
    if (facebookPctRef.current) facebookPctRef.current.textContent = 'Facebook 27%';
    if (directPctRef.current) directPctRef.current.textContent = 'Direct 15%';
    if (growthBadgeElRef.current) growthBadgeElRef.current.style.opacity = '1';
    if (autoTextRowElRef.current) autoTextRowElRef.current.style.opacity = '1';
    if (containerRef.current) containerRef.current.style.opacity = '1';
    setMessages([
      {
        id: 'init-1',
        title: 'Roof repair quote',
        location: 'Galway',
        time: '18m ago',
        status: 'Replied',
      },
      {
        id: 'init-2',
        title: 'Slate roof replacement',
        location: 'Navan',
        time: '1h ago',
        status: 'Replied',
      },
    ]);
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver: threshold [0, 0.15, 0.60] and rootMargin "0px 0px -6% 0px"
  useEffect(() => {
    if (reducedMotion) {
      applyFinalState();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting && entry.intersectionRatio >= 0.15;
          if (inView) {
            if (!isVisibleRef.current) {
              isVisibleRef.current = true;
              // If user scrolled fast and mockup is already >60% visible on entry, skip zero-hold
              if (entry.intersectionRatio >= 0.60) {
                clockTimeRef.current = GROWTH_TIMING.zeroHold;
              } else {
                clockTimeRef.current = 0.0;
              }
            }
          } else {
            // Out of viewport: park in exact zero state immediately
            isVisibleRef.current = false;
            clockTimeRef.current = 0.0;
            applyZeroState();
          }
        });
      },
      {
        threshold: [0, 0.15, 0.60],
        rootMargin: '0px 0px -6% 0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleVisChange = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisChange);
    };
  }, [reducedMotion, applyZeroState, applyFinalState]);

  // Master requestAnimationFrame Loop with delta time
  useEffect(() => {
    if (reducedMotion) {
      applyFinalState();
      return;
    }

    let animId: number;
    let lastTime = performance.now();
    const C = RING_CIRCUMFERENCE;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeOutSpring = (t: number) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return 1 + Math.sin(t * Math.PI * 2) * 0.08 * (1 - t);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (isVisibleRef.current && isTabVisibleRef.current) {
        clockTimeRef.current += dt;
        if (clockTimeRef.current >= GROWTH_TIMING.totalCycle) {
          clockTimeRef.current %= GROWTH_TIMING.totalCycle;
        }

        const t = clockTimeRef.current;
        const T = GROWTH_TIMING;

        // 1. Calculate values based on clock time
        if (t < T.zeroHold) {
          // Zero-hold: 0.0s to 0.35s
          if (enquiriesCountElRef.current) enquiriesCountElRef.current.textContent = '0';
          if (missedCallsCountElRef.current) missedCallsCountElRef.current.textContent = '0';
          if (dayChipElRef.current) {
            dayChipElRef.current.textContent = 'Day 1';
            dayChipElRef.current.className =
              'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 bg-[#0F2A35]/5 text-[#5E6F77] border border-[rgba(15,42,53,0.08)]';
          }
          sparklineBarElsRef.current.forEach((bar) => {
            if (bar) bar.style.transform = 'scaleY(0)';
          });
          if (googleCircleRef.current) googleCircleRef.current.style.strokeDasharray = '0 88';
          if (facebookCircleRef.current) facebookCircleRef.current.style.strokeDasharray = '0 88';
          if (directCircleRef.current) directCircleRef.current.style.strokeDasharray = '0 88';
          if (googlePctRef.current) googlePctRef.current.textContent = 'Google 0%';
          if (facebookPctRef.current) facebookPctRef.current.textContent = 'Facebook 0%';
          if (directPctRef.current) directPctRef.current.textContent = 'Direct 0%';
          if (growthBadgeElRef.current) growthBadgeElRef.current.style.opacity = '0';
          if (autoTextRowElRef.current) autoTextRowElRef.current.style.opacity = '0';
          if (containerRef.current) containerRef.current.style.opacity = '1';

          if (messageStageRef.current !== 0) {
            messageStageRef.current = 0;
            setMessages([]);
          }
        } else if (t < T.livePhaseStart) {
          // Build-up: 0.35s to 2.55s (2.2s total)
          const tRel = t - T.zeroHold;

          // Counters: run in 1.8s using easeOutCubic
          const counterProgress = Math.min(1, tRel / T.countersDuration);
          const pCounter = easeOutCubic(counterProgress);
          const enqVal = Math.floor(pCounter * 24);
          const missedVal = Math.floor(pCounter * 7);

          if (enquiriesCountElRef.current) {
            enquiriesCountElRef.current.textContent = String(enqVal);
          }
          if (missedCallsCountElRef.current) {
            missedCallsCountElRef.current.textContent = String(missedVal);
          }

          // Day chip eases with counter progress so it never runs ahead
          if (dayChipElRef.current) {
            if (pCounter >= 0.95) {
              dayChipElRef.current.textContent = 'Day 30';
              dayChipElRef.current.className =
                'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 bg-[#1E4A5C]/10 text-[#1E4A5C] border border-[#1E4A5C]/20';
            } else {
              const dayNum = Math.max(1, Math.min(30, Math.round(1 + pCounter * 29)));
              dayChipElRef.current.textContent = `Day ${dayNum}`;
              dayChipElRef.current.className =
                'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 bg-[#0F2A35]/5 text-[#5E6F77] border border-[rgba(15,42,53,0.08)]';
            }
          }

          // Bars: each bar grows over 0.45s with spring, 45ms stagger, starting at 0.05s
          sparklineBarElsRef.current.forEach((bar, idx) => {
            if (!bar) return;
            const barStart = T.barsStart + idx * T.barsStagger;
            const barElapsed = tRel - barStart;
            const barU = Math.min(1, Math.max(0, barElapsed / T.barsDuration));
            const barScale = easeOutSpring(barU);
            bar.style.transform = `scaleY(${barScale.toFixed(3)})`;
          });

          // Donut ring: draws over 1.5s, starting at 0.15s
          const ringElapsed = tRel - T.ringStart;
          const pRing = Math.min(1, Math.max(0, ringElapsed / T.ringDuration));

          const gArc = (58 * pRing * C) / 100;
          const fbArc = (27 * pRing * C) / 100;
          const dirArc = (15 * pRing * C) / 100;

          if (googleCircleRef.current) {
            googleCircleRef.current.style.strokeDasharray = `${gArc.toFixed(1)} ${C}`;
            googleCircleRef.current.style.strokeDashoffset = '0';
          }
          if (facebookCircleRef.current) {
            facebookCircleRef.current.style.strokeDasharray = `${fbArc.toFixed(1)} ${C}`;
            facebookCircleRef.current.style.strokeDashoffset = `${(-gArc).toFixed(1)}`;
          }
          if (directCircleRef.current) {
            directCircleRef.current.style.strokeDasharray = `${dirArc.toFixed(1)} ${C}`;
            directCircleRef.current.style.strokeDashoffset = `${(-(gArc + fbArc)).toFixed(1)}`;
          }

          if (googlePctRef.current) googlePctRef.current.textContent = `Google ${Math.round(58 * pRing)}%`;
          if (facebookPctRef.current) facebookPctRef.current.textContent = `Facebook ${Math.round(27 * pRing)}%`;
          if (directPctRef.current) directPctRef.current.textContent = `Direct ${Math.round(15 * pRing)}%`;

          // Reveals at 1.7s
          if (growthBadgeElRef.current) {
            growthBadgeElRef.current.style.opacity = tRel >= T.revealsFade ? '1' : '0';
          }
          if (autoTextRowElRef.current) {
            autoTextRowElRef.current.style.opacity = tRel >= T.revealsFade ? '1' : '0';
          }
          if (containerRef.current) containerRef.current.style.opacity = '1';

          // Message rows during buildup: slide in at 0.55s, 1.0s, 1.45s (260ms each), Replied chip 350ms after
          if (tRel < T.row1Slide) {
            if (messageStageRef.current !== 1) {
              messageStageRef.current = 1;
              setMessages([]);
            }
          } else if (tRel < T.row1Slide + T.buildupRepliedDelay) {
            if (messageStageRef.current !== 2) {
              messageStageRef.current = 2;
              setMessages([
                { id: 'b-1', title: 'Roof repair quote', location: 'Galway', time: '18m ago', status: 'New' },
              ]);
            }
          } else if (tRel < T.row2Slide) {
            if (messageStageRef.current !== 3) {
              messageStageRef.current = 3;
              setMessages([
                { id: 'b-1', title: 'Roof repair quote', location: 'Galway', time: '18m ago', status: 'Replied' },
              ]);
            }
          } else if (tRel < T.row2Slide + T.buildupRepliedDelay) {
            if (messageStageRef.current !== 4) {
              messageStageRef.current = 4;
              setMessages([
                { id: 'b-2', title: 'Slate roof replacement', location: 'Navan', time: '1h ago', status: 'New' },
                { id: 'b-1', title: 'Roof repair quote', location: 'Galway', time: '18m ago', status: 'Replied' },
              ]);
            }
          } else if (tRel < T.row3Slide) {
            if (messageStageRef.current !== 5) {
              messageStageRef.current = 5;
              setMessages([
                { id: 'b-2', title: 'Slate roof replacement', location: 'Navan', time: '1h ago', status: 'Replied' },
                { id: 'b-1', title: 'Roof repair quote', location: 'Galway', time: '18m ago', status: 'Replied' },
              ]);
            }
          } else if (tRel < T.row3Slide + T.buildupRepliedDelay) {
            if (messageStageRef.current !== 6) {
              messageStageRef.current = 6;
              setMessages([
                { id: 'b-3', title: 'Gutter and fascia quote', location: 'Bray', time: '3h ago', status: 'New' },
                { id: 'b-2', title: 'Slate roof replacement', location: 'Navan', time: '1h ago', status: 'Replied' },
                { id: 'b-1', title: 'Roof repair quote', location: 'Galway', time: '18m ago', status: 'Replied' },
              ]);
            }
          } else {
            if (messageStageRef.current !== 7) {
              messageStageRef.current = 7;
              setMessages([
                { id: 'b-3', title: 'Gutter and fascia quote', location: 'Bray', time: '3h ago', status: 'Replied' },
                { id: 'b-2', title: 'Slate roof replacement', location: 'Navan', time: '1h ago', status: 'Replied' },
                { id: 'b-1', title: 'Roof repair quote', location: 'Galway', time: '18m ago', status: 'Replied' },
              ]);
            }
          }
        } else if (t < T.matureHoldEnd) {
          // Live Phase: 2.55s to 8.25s (3 events @ 3.15s, 4.85s, 6.55s)
          if (containerRef.current) containerRef.current.style.opacity = '1';
          if (growthBadgeElRef.current) growthBadgeElRef.current.style.opacity = '1';
          if (autoTextRowElRef.current) autoTextRowElRef.current.style.opacity = '1';
          sparklineBarElsRef.current.forEach((bar) => {
            if (bar) bar.style.transform = 'scaleY(1)';
          });

          // Check live events
          if (t < T.liveEvent1) {
            // Pre-event 1 mature hold (2.55s to 3.15s)
            if (enquiriesCountElRef.current) enquiriesCountElRef.current.textContent = '24';
            if (missedCallsCountElRef.current) missedCallsCountElRef.current.textContent = '7';
          } else if (t < T.liveEvent2) {
            // Live Event 1 (3.15s to 4.85s)
            if (enquiriesCountElRef.current) enquiriesCountElRef.current.textContent = '25';
            if (missedCallsCountElRef.current) missedCallsCountElRef.current.textContent = '7';

            // Scale pop & Status pulse
            const isPop = t >= T.liveEvent1 && t < T.liveEvent1 + T.scalePopDuration;
            if (enquiriesCountElRef.current) {
              enquiriesCountElRef.current.classList.toggle('scale-110', isPop);
              enquiriesCountElRef.current.classList.toggle('text-[#1E4A5C]', isPop);
            }
            const isPulse = t >= T.liveEvent1 && t < T.liveEvent1 + T.statusPulseDuration;
            if (statusChipElRef.current) {
              statusChipElRef.current.classList.toggle('scale-105', isPulse);
              statusChipElRef.current.classList.toggle('bg-[#2E9E6B]/20', isPulse);
            }

            // Row 1 status: "New" turns "Replied" after 0.9s
            const isNew = t < T.liveEvent1 + T.liveRepliedDelay;
            const stageId = isNew ? 8 : 9;
            if (messageStageRef.current !== stageId) {
              messageStageRef.current = stageId;
              setMessages([
                {
                  id: 'live-1',
                  title: 'Emergency leak repair',
                  location: 'Galway',
                  time: 'Just now',
                  status: isNew ? 'New' : 'Replied',
                  isHighlight: true,
                },
                { id: 'b-3', title: 'Gutter and fascia quote', location: 'Bray', time: '2m ago', status: 'Replied' },
                { id: 'b-2', title: 'Slate roof replacement', location: 'Navan', time: '1h ago', status: 'Replied' },
              ]);
            }
          } else if (t < T.liveEvent3) {
            // Live Event 2 (4.85s to 6.55s): enquiries 26, missed calls 8 with peach flash
            if (enquiriesCountElRef.current) enquiriesCountElRef.current.textContent = '26';
            if (missedCallsCountElRef.current) missedCallsCountElRef.current.textContent = '8';

            const isPop = t >= T.liveEvent2 && t < T.liveEvent2 + T.scalePopDuration;
            if (enquiriesCountElRef.current) {
              enquiriesCountElRef.current.classList.toggle('scale-110', isPop);
              enquiriesCountElRef.current.classList.toggle('text-[#1E4A5C]', isPop);
            }
            const isPulse = t >= T.liveEvent2 && t < T.liveEvent2 + T.statusPulseDuration;
            if (statusChipElRef.current) {
              statusChipElRef.current.classList.toggle('scale-105', isPulse);
              statusChipElRef.current.classList.toggle('bg-[#2E9E6B]/20', isPulse);
            }
            const isFlash = t >= T.liveEvent2 && t < T.liveEvent2 + T.peachFlashDuration;
            if (autoTextRowElRef.current) {
              autoTextRowElRef.current.classList.toggle('bg-[#E3B896]/30', isFlash);
              autoTextRowElRef.current.classList.toggle('border-[#E3B896]', isFlash);
              autoTextRowElRef.current.classList.toggle('text-[#0F2A35]', isFlash);
            }

            const isNew = t < T.liveEvent2 + T.liveRepliedDelay;
            const stageId = isNew ? 10 : 11;
            if (messageStageRef.current !== stageId) {
              messageStageRef.current = stageId;
              setMessages([
                {
                  id: 'live-2',
                  title: 'Chimney flashing repair',
                  location: 'Ennis',
                  time: 'Just now',
                  status: isNew ? 'New' : 'Replied',
                  isHighlight: true,
                },
                { id: 'live-1', title: 'Emergency leak repair', location: 'Galway', time: '2m ago', status: 'Replied' },
                { id: 'b-3', title: 'Gutter and fascia quote', location: 'Bray', time: '4m ago', status: 'Replied' },
              ]);
            }
          } else {
            // Live Event 3 (6.55s to 8.25s): enquiries 27, missed calls 9 with peach flash
            if (enquiriesCountElRef.current) enquiriesCountElRef.current.textContent = '27';
            if (missedCallsCountElRef.current) missedCallsCountElRef.current.textContent = '9';

            const isPop = t >= T.liveEvent3 && t < T.liveEvent3 + T.scalePopDuration;
            if (enquiriesCountElRef.current) {
              enquiriesCountElRef.current.classList.toggle('scale-110', isPop);
              enquiriesCountElRef.current.classList.toggle('text-[#1E4A5C]', isPop);
            }
            const isPulse = t >= T.liveEvent3 && t < T.liveEvent3 + T.statusPulseDuration;
            if (statusChipElRef.current) {
              statusChipElRef.current.classList.toggle('scale-105', isPulse);
              statusChipElRef.current.classList.toggle('bg-[#2E9E6B]/20', isPulse);
            }
            const isFlash = t >= T.liveEvent3 && t < T.liveEvent3 + T.peachFlashDuration;
            if (autoTextRowElRef.current) {
              autoTextRowElRef.current.classList.toggle('bg-[#E3B896]/30', isFlash);
              autoTextRowElRef.current.classList.toggle('border-[#E3B896]', isFlash);
              autoTextRowElRef.current.classList.toggle('text-[#0F2A35]', isFlash);
            }

            const isNew = t < T.liveEvent3 + T.liveRepliedDelay;
            const stageId = isNew ? 12 : 13;
            if (messageStageRef.current !== stageId) {
              messageStageRef.current = stageId;
              setMessages([
                {
                  id: 'live-3',
                  title: 'Flat roof felt replacement',
                  location: 'Kilkenny',
                  time: 'Just now',
                  status: isNew ? 'New' : 'Replied',
                  isHighlight: true,
                },
                { id: 'live-2', title: 'Chimney flashing repair', location: 'Ennis', time: '2m ago', status: 'Replied' },
                { id: 'live-1', title: 'Emergency leak repair', location: 'Galway', time: '4m ago', status: 'Replied' },
              ]);
            }
          }
        } else {
          // Fade-out: 8.25s to 8.50s (0.25s fade)
          const fadeProgress = (T.totalCycle - t) / T.fadeOut;
          if (containerRef.current) {
            containerRef.current.style.opacity = String(Math.max(0, fadeProgress).toFixed(3));
          }
        }

        // Notify parent when a message row is sliding in (for laptop parallax pause)
        if (isRowSliding) {
          const tRel = t - T.zeroHold;
          const isSliding =
            (tRel >= T.row1Slide && tRel < T.row1Slide + T.buildupRowSlideDuration) ||
            (tRel >= T.row2Slide && tRel < T.row2Slide + T.buildupRowSlideDuration) ||
            (tRel >= T.row3Slide && tRel < T.row3Slide + T.buildupRowSlideDuration) ||
            (t >= T.liveEvent1 && t < T.liveEvent1 + T.liveRowSlideDuration) ||
            (t >= T.liveEvent2 && t < T.liveEvent2 + T.liveRowSlideDuration) ||
            (t >= T.liveEvent3 && t < T.liveEvent3 + T.liveRowSlideDuration);
          isRowSliding(isSliding);
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion, isRowSliding, applyFinalState]);

  return (
    <div
      ref={containerRef}
      className="transition-opacity duration-200"
      style={{ opacity: 1 }}
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Dashboard Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgba(15,42,53,0.06)]">
          <div>
            <h3 className="text-lg sm:text-2xl font-medium text-[#0F2A35]">
              {SAMPLE_DASHBOARD.greeting}
            </h3>
            <p className="text-xs sm:text-sm text-[#5E6F77]">
              Enquiry Inbox · Live activity overview
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* Timeline Chip: Day 1 morphs to Day 30 · +24 enquiries */}
            <span
              ref={dayChipElRef}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 bg-[#0F2A35]/5 text-[#5E6F77] border border-[rgba(15,42,53,0.08)]"
            >
              Day 1
            </span>

            {/* Soft "Live" green pulse dot at top right */}
            <span
              ref={statusChipElRef}
              className="inline-flex items-center gap-1.5 bg-[#2E9E6B]/10 text-[#2E9E6B] text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 opacity-100"
            >
              <span className="w-2 h-2 rounded-full bg-[#2E9E6B] animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* Cards Grid: Metric 1, Metric 2, Ring Chart */}
        <div
          className={`grid gap-3 sm:gap-4 items-stretch ${
            !CONFIG.features.missedCallTextBack && !CONFIG.features.sourceBreakdown
              ? 'grid-cols-1 max-w-sm mx-auto'
              : !CONFIG.features.missedCallTextBack || !CONFIG.features.sourceBreakdown
              ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
              : 'grid-cols-1 sm:grid-cols-3'
          }`}
        >
          {/* Card 1: Enquiries this month */}
          <div className="bg-[#EEF3F4]/80 p-3.5 sm:p-4 rounded-xl border border-[rgba(15,42,53,0.05)] h-[132px] sm:h-[136px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#5E6F77] font-medium">
                Enquiries this month
              </span>
              <TrendingUp className="w-4 h-4 text-[#1E4A5C]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                ref={enquiriesCountElRef}
                className="text-2xl sm:text-3xl font-heading font-semibold text-[#0F2A35] tabular-nums transition-transform duration-200 inline-block min-w-[1.8ch]"
              >
                0
              </span>
              <span
                ref={growthBadgeElRef}
                className="text-[11px] text-[#2E9E6B] font-medium inline-flex items-center gap-0.5 transition-opacity duration-300 opacity-0"
              >
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                <span>+6 vs last month</span>
              </span>
            </div>
            {/* Small sparkline: 10 bars grow with spring transform scaleY */}
            <div className="h-6 flex items-end gap-1.5 pt-1">
              {BASE_SPARKLINE.map((val, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    sparklineBarElsRef.current[idx] = el;
                  }}
                  className="flex-1 bg-[#1E4A5C]/35 rounded-t-xs will-change-transform origin-bottom"
                  style={{
                    height: `${val}%`,
                    transform: 'scaleY(0)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card 2: Missed calls recovered (hidden if features.missedCallTextBack is false) */}
          {CONFIG.features.missedCallTextBack && (
            <div className="bg-[#EEF3F4]/80 p-3.5 sm:p-4 rounded-xl border border-[rgba(15,42,53,0.05)] h-[132px] sm:h-[136px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5E6F77] font-medium">
                  Missed calls recovered
                </span>
                <PhoneCall className="w-4 h-4 text-[#2E9E6B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  ref={missedCallsCountElRef}
                  className="text-2xl sm:text-3xl font-heading font-semibold text-[#0F2A35] tabular-nums inline-block min-w-[1.4ch]"
                >
                  0
                </span>
                <span className="text-[11px] text-[#5E6F77]">Saved via SMS</span>
              </div>

              {/* Auto-text row with peach flash on event 2 and 3 */}
              <div className="min-h-[30px] flex items-center">
                <div
                  ref={autoTextRowElRef}
                  className="w-full p-1.5 px-2.5 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all duration-300 opacity-0 bg-white border-[rgba(15,42,53,0.06)] text-[#5E6F77]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9E6B] shrink-0" />
                  <span>
                    {CONFIG.features.autoTextSeconds
                      ? `Auto-text sent in <${CONFIG.features.autoTextSeconds}s`
                      : 'Auto-text sent'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Card 3: Ring chart "Where enquiries came from" (hidden if features.sourceBreakdown is false) */}
          {CONFIG.features.sourceBreakdown && (
            <div className="bg-[#EEF3F4]/80 p-3.5 sm:p-4 rounded-xl border border-[rgba(15,42,53,0.05)] h-[132px] sm:h-[136px] flex flex-col justify-between">
              <span className="text-xs text-[#5E6F77] font-medium">
                Where enquiries came from
              </span>
              <div className="flex items-center gap-3">
                {/* Ring SVG with clockwise sweeping segments */}
                <svg className="w-14 h-14 shrink-0 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#DCE9EC"
                    strokeWidth="4"
                  />
                  {/* Google segment */}
                  <circle
                    ref={googleCircleRef}
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#1E4A5C"
                    strokeWidth="4"
                    strokeDasharray="0 88"
                    strokeDashoffset="0"
                    className="will-change-[stroke-dasharray]"
                  />
                  {/* Facebook segment */}
                  <circle
                    ref={facebookCircleRef}
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#E3B896"
                    strokeWidth="4"
                    strokeDasharray="0 88"
                    strokeDashoffset="0"
                    className="will-change-[stroke-dasharray]"
                  />
                  {/* Direct segment */}
                  <circle
                    ref={directCircleRef}
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#5E6F77"
                    strokeWidth="4"
                    strokeDasharray="0 88"
                    strokeDashoffset="0"
                    className="will-change-[stroke-dasharray]"
                  />
                </svg>

                <div className="text-[11px] flex flex-col gap-0.5 tabular-nums">
                  <div className="flex items-center gap-1.5 text-[#0F2A35]">
                    <span className="w-2 h-2 rounded-full bg-[#1E4A5C]" />
                    <span ref={googlePctRef}>Google 0%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#0F2A35]">
                    <span className="w-2 h-2 rounded-full bg-[#E3B896]" />
                    <span ref={facebookPctRef}>Facebook 0%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#0F2A35]">
                    <span className="w-2 h-2 rounded-full bg-[#5E6F77]" />
                    <span ref={directPctRef}>Direct 0%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Inbound Messages List: sized to fit exactly 3 complete message rows */}
        <div className="bg-[#EEF3F4]/50 rounded-xl p-3 sm:p-4 border border-[rgba(15,42,53,0.05)] min-h-[240px] sm:min-h-[260px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#0F2A35]">
              Recent Inbound Messages
            </span>
            <span className="text-[11px] text-[#5E6F77]">Latest activity</span>
          </div>

          <div className="space-y-2">
            {messages.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#5E6F77]/70 font-medium italic">
                Awaiting first customer enquiries...
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: item.id.startsWith('live')
                        ? GROWTH_TIMING.liveRowSlideDuration
                        : GROWTH_TIMING.buildupRowSlideDuration,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={
                      'p-2.5 sm:p-3 rounded-lg flex items-center justify-between gap-3 shadow-xs border transition-colors duration-300 will-change-[transform,opacity] ' +
                      (item.isHighlight
                        ? 'bg-[#E3B896]/15 border-[#E3B896]/40'
                        : 'bg-white border-[rgba(15,42,53,0.04)]')
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#DCE9EC] flex items-center justify-center text-[#1E4A5C] text-xs font-semibold shrink-0">
                        {item.title[0]}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-[#0F2A35] leading-tight">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#5E6F77]">
                          {item.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-[#5E6F77] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                      <span
                        className={
                          'text-[11px] font-medium px-2 py-0.5 rounded-full transition-all duration-300 ' +
                          (item.status === 'New'
                            ? 'bg-[#E8943A]/20 text-[#E8943A] font-semibold'
                            : 'bg-[#2E9E6B]/15 text-[#2E9E6B]')
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
