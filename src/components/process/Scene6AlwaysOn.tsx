import React from 'react';
import { motion, useTransform } from 'motion/react';
import { Moon, Sparkles, Building, Globe, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import { SceneProps, useSceneVisibility } from './types';
import { SAMPLE_ORDER } from '../../content';

export default function Scene6AlwaysOn({
  scrollYProgress,
  onescene = false,
  staticMode = false,
}: SceneProps) {
  const { opacity, y, scale, pointerEvents, visibility, b } = useSceneVisibility(
    scrollYProgress,
    5,
    onescene,
    staticMode
  );

  // Time progression sweeping from 5:30 pm (17.5h) to 7:00 am next day (31h total)
  // b goes 0 -> 1: total hours span = 13.5 hours
  const clockHourAndMinute = useTransform(b, (v: number) => {
    if (staticMode) {
      return { timeStr: '11:20 PM', digitalStr: '11:20 PM', angleHour: 340, angleMin: 120 };
    }
    const currentHourFloat = 17.5 + v * 13.5; // 17.5 (5:30 PM) to 31.0 (7:00 AM)
    const normHour = currentHourFloat % 24; // 17.5 -> 23.99 -> 0 -> 7
    const h = Math.floor(normHour);
    const m = Math.floor((normHour - h) * 60);
    const isPM = h >= 12;
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m < 10 ? `0${m}` : `${m}`;
    const period = isPM ? 'PM' : 'AM';
    const timeStr = `${displayH}:${displayM} ${period}`;
    const digitalStr = `${displayH}:${displayM} ${period}`;

    // Angles for clock hands (360 degrees = 12 hours)
    const angleHour = (normHour % 12) * 30 + (m / 60) * 30;
    const angleMin = m * 6;

    return { timeStr, digitalStr, angleHour, angleMin };
  });

  const clockDigitalText = useTransform(clockHourAndMinute, (c) => c.digitalStr);
  const hourHandTransform = useTransform(clockHourAndMinute, (c) => `rotate(${c.angleHour} 16 16)`);
  const minuteHandTransform = useTransform(clockHourAndMinute, (c) => `rotate(${c.angleMin} 16 16)`);

  // Phone lockscreen time string (follows clock sweep)
  const phoneClockText = useTransform(clockHourAndMinute, (c) => c.timeStr);

  // Office door sign 3D-flip from "OPEN" to "CLOSED" at b = 0.1
  const officeFlipProgress = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.08) / 0.12))
  );
  const officeRotateX = useTransform(officeFlipProgress, (p: number) => p * 180);
  const officeSignOpacityOpen = useTransform(officeFlipProgress, (p: number) => (p > 0.5 ? 0 : 1));
  const officeSignOpacityClosed = useTransform(officeFlipProgress, (p: number) => (p > 0.5 ? 1 : 0));

  // Phone notifications stack in sequentially
  // Notification 1: 9:15 pm (b = 0.35 to 0.48)
  const notif1Progress = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.35) / 0.13))
  );
  const notif1Y = useTransform(notif1Progress, (p: number) => 16 * (1 - p));
  const notif1Opacity = useTransform(notif1Progress, (p: number) => p);

  // Notification 2: 11:40 pm (b = 0.52 to 0.65)
  const notif2Progress = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.52) / 0.13))
  );
  const notif2Y = useTransform(notif2Progress, (p: number) => 16 * (1 - p));
  const notif2Opacity = useTransform(notif2Progress, (p: number) => p);

  // Notification 3: 2:05 am (b = 0.68 to 0.81)
  const notif3Progress = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.68) / 0.13))
  );
  const notif3Y = useTransform(notif3Progress, (p: number) => 16 * (1 - p));
  const notif3Opacity = useTransform(notif3Progress, (p: number) => p);

  // Subtle star twinkling opacities (opacity only driven by b / math)
  const star1Opacity = useTransform(b, (v: number) => 0.35 + 0.5 * Math.sin(v * 12 + 1));
  const star2Opacity = useTransform(b, (v: number) => 0.4 + 0.5 * Math.sin(v * 14 + 2));
  const star3Opacity = useTransform(b, (v: number) => 0.3 + 0.6 * Math.sin(v * 10 + 3));
  const star4Opacity = useTransform(b, (v: number) => 0.45 + 0.45 * Math.sin(v * 16 + 4));
  const star5Opacity = useTransform(b, (v: number) => 0.25 + 0.65 * Math.sin(v * 11 + 5));
  const star6Opacity = useTransform(b, (v: number) => 0.35 + 0.55 * Math.sin(v * 13 + 6));
  const star7Opacity = useTransform(b, (v: number) => 0.4 + 0.5 * Math.sin(v * 15 + 7));
  const star8Opacity = useTransform(b, (v: number) => 0.3 + 0.6 * Math.sin(v * 12 + 8));

  return (
    <motion.div
      data-scene="always-on-v2"
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      className="absolute inset-0 w-[960px] h-[480px] p-4 select-none overflow-hidden"
    >
      {/* Night background: deeper teal #091D24 with soft stars */}
      <div className="w-full h-full bg-[rgb(9,29,36)]/95 border border-white/10 rounded-3xl p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden">
        {/* Eight soft background stars (opacity only) */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div style={{ opacity: star1Opacity }} className="absolute left-[12%] translate-y-[105px] w-1.5 h-1.5 bg-[#E3B896] rounded-full blur-[0.5px]" />
          <motion.div style={{ opacity: star2Opacity }} className="absolute left-[28%] translate-y-[72px] w-1 h-1 bg-white rounded-full" />
          <motion.div style={{ opacity: star3Opacity }} className="absolute left-[45%] translate-y-[57px] w-1.5 h-1.5 bg-white/80 rounded-full blur-[0.5px]" />
          <motion.div style={{ opacity: star4Opacity }} className="absolute left-[62%] translate-y-[96px] w-1 h-1 bg-[#E3B896] rounded-full" />
          <motion.div style={{ opacity: star5Opacity }} className="absolute left-[75%] translate-y-[67px] w-1.5 h-1.5 bg-white rounded-full blur-[0.5px]" />
          <motion.div style={{ opacity: star6Opacity }} className="absolute left-[88%] translate-y-[134px] w-1 h-1 bg-white/70 rounded-full" />
          <motion.div style={{ opacity: star7Opacity }} className="absolute left-[18%] translate-y-[312px] w-1 h-1 bg-white/60 rounded-full" />
          <motion.div style={{ opacity: star8Opacity }} className="absolute left-[52%] translate-y-[345px] w-1.5 h-1.5 bg-[#E3B896] rounded-full blur-[0.5px]" />
        </div>

        {/* Upper persistent furniture: Story chip at upper left & Night clock at upper right */}
        <div className="w-full flex items-center justify-between shrink-0 mb-1 relative z-10">
          <div className="flex items-center gap-3">
            {/* Story chip: "After" green #2E9E6B */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E9E6B]/15 border border-[#2E9E6B]/40 text-[#2E9E6B] text-[16px] font-semibold tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E9E6B]" />
              <span>After</span>
            </div>
            {/* Moon icon under story chip */}
            <div className="flex items-center gap-1.5 text-white/70 text-[13px] font-medium">
              <Moon className="w-4 h-4 text-[#E3B896]" />
              <span>Overnight lead capture</span>
            </div>
          </div>

          {/* Night clock at upper right (analogue & digital, sweeps with b) */}
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" fill="#0F2A35" stroke="#2E9E6B" strokeWidth="1.5" />
              <line x1="16" y1="4" x2="16" y2="6.5" stroke="#2E9E6B" strokeWidth="1.5" />
              <line x1="28" y1="16" x2="25.5" y2="16" stroke="#2E9E6B" strokeWidth="1.5" />
              <line x1="16" y1="28" x2="16" y2="25.5" stroke="#2E9E6B" strokeWidth="1.5" />
              <line x1="4" y1="16" x2="6.5" y2="16" stroke="#2E9E6B" strokeWidth="1.5" />
              {/* Driven hands */}
              <motion.line
                x1="16"
                y1="16"
                x2="16"
                y2="9"
                stroke="#E3B896"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ transform: hourHandTransform, transformOrigin: '16px 16px' }}
              />
              <motion.line
                x1="16"
                y1="16"
                x2="16"
                y2="6.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ transform: minuteHandTransform, transformOrigin: '16px 16px' }}
              />
              <circle cx="16" cy="16" r="1.5" fill="#E3B896" />
            </svg>
            <div className="flex flex-col text-left">
              <motion.span className="text-[14px] font-mono font-bold text-white leading-none">
                {clockDigitalText}
              </motion.span>
              <span className="text-[10px] text-white/50 tracking-wider uppercase font-medium">Always on</span>
            </div>
          </div>
        </div>

        {/* Main Stage Grid: Left Office & Website Cards | Right Phone Lockscreen Frame */}
        <div className="flex-1 w-full grid grid-cols-12 gap-6 items-center min-h-0 relative z-10">
          {/* LEFT: Two cards (Cols 1-6) */}
          <div className="col-span-6 flex flex-col justify-center gap-4 h-full pr-2">
            <div>
              <div className="text-[13px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                Availability comparison
              </div>
              <h4 className="text-[22px] font-bold text-white tracking-tight leading-tight">
                Your workshop rests. Your site works.
              </h4>
            </div>

            {/* Card 1: Your office */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                  <Building className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-white">Your office</div>
                  <div className="text-[12px] text-white/50">Telephone & workshop</div>
                </div>
              </div>

              {/* 3D-flipping door sign */}
              <div
                className="w-24 h-9 relative perspective-500"
                style={{ perspective: 600 }}
              >
                <motion.div
                  style={{
                    transformStyle: 'preserve-3d',
                    rotateX: officeRotateX,
                  }}
                  className="w-full h-full relative"
                >
                  {/* Front: OPEN */}
                  <motion.div
                    style={{ opacity: officeSignOpacityOpen }}
                    className="absolute inset-0 rounded-lg bg-[#2E9E6B]/20 border border-[#2E9E6B]/50 text-[#2E9E6B] font-bold text-[12px] flex items-center justify-center tracking-wider backface-hidden"
                  >
                    OPEN
                  </motion.div>
                  {/* Back: CLOSED */}
                  <motion.div
                    style={{
                      opacity: officeSignOpacityClosed,
                      transform: 'rotateX(180deg)',
                    }}
                    className="absolute inset-0 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 font-bold text-[12px] flex items-center justify-center tracking-wider backface-hidden"
                  >
                    CLOSED
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Card 2: Your website */}
            <div className="p-4 rounded-2xl bg-white/[0.06] border border-[#2E9E6B]/40 shadow-lg shadow-[#2E9E6B]/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2E9E6B]/20 border border-[#2E9E6B]/40 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#2E9E6B]" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-white">Your website</div>
                  <div className="text-[12px] text-white/60">Live quote intake</div>
                </div>
              </div>

              {/* Stays "OPEN · 24h" with soft glow */}
              <div className="px-3.5 py-1.5 rounded-lg bg-[#2E9E6B]/20 border border-[#2E9E6B]/60 text-[#2E9E6B] font-bold text-[12px] flex items-center gap-1.5 shadow-[0_0_12px_rgba(46,158,107,0.35)]">
                <span className="w-2 h-2 rounded-full bg-[#2E9E6B] animate-pulse" />
                <span>OPEN &middot; 24h</span>
              </div>
            </div>

            <p className="text-[12px] text-white/50 leading-relaxed">
              Homeowners who search late in the evening can review your previous projects, inspect your trade qualifications and submit their enquiry immediately without waiting for morning.
            </p>
          </div>

          {/* RIGHT: Large Phone Frame (Cols 7-12) - logical 250 x 400 within 24px canvas margins */}
          <div className="col-span-6 flex items-center justify-center h-full relative">
            <div className="w-[260px] h-[395px] bg-[#0A1A22] border-2 border-white/20 rounded-[36px] p-3 shadow-2xl relative flex flex-col justify-between overflow-hidden">
              {/* Phone speaker notch */}
              <div className="w-20 h-4 bg-black/60 rounded-full mx-auto mb-1 shrink-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-black/80 mr-2" />
                <div className="w-8 h-1 rounded-full bg-white/20" />
              </div>

              {/* Lockscreen Header: big dynamic clock and date */}
              <div className="text-center shrink-0 mb-1">
                <motion.div className="text-[34px] font-light text-white tracking-tight leading-none font-mono">
                  {phoneClockText}
                </motion.div>
                <div className="text-[11px] text-white/60 mt-1 font-medium">
                  Tuesday night &middot; Galway
                </div>
              </div>

              {/* Stack of three lockscreen notifications */}
              <div className="flex-1 flex flex-col justify-center gap-2 relative">
                {/* Notification 1: 9:15 pm */}
                <motion.div
                  style={{ opacity: notif1Opacity, y: notif1Y }}
                  className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left shadow-lg"
                >
                  <div className="flex items-center justify-between text-[10px] text-white/60 mb-1">
                    <div className="flex items-center gap-1 font-semibold text-[#E3B896]">
                      <Mail className="w-3 h-3" />
                      <span>New quote request</span>
                    </div>
                    <span>9:15 PM</span>
                  </div>
                  <div className="text-[12px] font-semibold text-white leading-tight">
                    Chimney repointing
                  </div>
                  <div className="text-[10px] text-white/70 truncate">
                    Taylor&apos;s Hill &middot; Photo attached
                  </div>
                </motion.div>

                {/* Notification 2: 11:40 pm */}
                <motion.div
                  style={{ opacity: notif2Opacity, y: notif2Y }}
                  className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left shadow-lg"
                >
                  <div className="flex items-center justify-between text-[10px] text-white/60 mb-1">
                    <div className="flex items-center gap-1 font-semibold text-[#2E9E6B]">
                      <Phone className="w-3 h-3" />
                      <span>Call-back requested</span>
                    </div>
                    <span>11:40 PM</span>
                  </div>
                  <div className="text-[12px] font-semibold text-white leading-tight">
                    Storm damage assessment
                  </div>
                  <div className="text-[10px] text-white/70 truncate">
                    Salthill &middot; Ready for morning call
                  </div>
                </motion.div>

                {/* Notification 3: 2:05 am */}
                <motion.div
                  style={{ opacity: notif3Opacity, y: notif3Y }}
                  className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left shadow-lg"
                >
                  <div className="flex items-center justify-between text-[10px] text-white/60 mb-1">
                    <div className="flex items-center gap-1 font-semibold text-[#E3B896]">
                      <Calendar className="w-3 h-3" />
                      <span>Site inspection booked</span>
                    </div>
                    <span>2:05 AM</span>
                  </div>
                  <div className="text-[12px] font-semibold text-white leading-tight">
                    Slate extension roof
                  </div>
                  <div className="text-[10px] text-white/70 truncate">
                    Clifden &middot; Preferred day Friday
                  </div>
                </motion.div>
              </div>

              {/* Phone bottom swipe bar */}
              <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-1 shrink-0" />
            </div>
          </div>
        </div>

        {/* Bottom persistent line */}
        <div className="w-full flex items-center justify-between shrink-0 pt-1 border-t border-white/5 text-[11px] text-white/40">
          <span>Continuous client reception</span>
          <span>Illustrative client journey</span>
        </div>
      </div>
    </motion.div>
  );
}
