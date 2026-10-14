import React from 'react';
import { motion, useTransform } from 'motion/react';
import { CheckCircle2, Bell, Mail, Send, Check } from 'lucide-react';
import { SceneProps, useSceneVisibility } from './types';
import { SAMPLE_ORDER } from '../../content';
import Logo from '../Logo';

export default function Scene2Apply({
  scrollYProgress,
  onescene = false,
  staticMode = false,
  isActive = false,
}: SceneProps) {
  const { opacity, y, scale, pointerEvents, visibility, b } = useSceneVisibility(
    scrollYProgress,
    1,
    onescene,
    staticMode
  );

  // Left 2x2 picker: Cursor glide to "Starter" (b 0.10 to 0.35)
  const cursorProgress = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.10) / 0.25));
  });

  // Cursor moves from lower-left to top-right tile ("Starter")
  const cursorX = useTransform(cursorProgress, (p: number) => 40 + p * 155);
  const cursorY = useTransform(cursorProgress, (p: number) => 180 - p * 115);
  const cursorOpacity = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    if (v < 0.08) return 0;
    if (v > 0.45) return 0;
    return 1;
  });

  const isStarterSelected = useTransform(b, (v: number) => {
    if (staticMode) return true;
    return v >= 0.35;
  });

  // Click ripple at b 0.35
  const rippleScale = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    if (v < 0.35 || v > 0.45) return 0;
    const p = (v - 0.35) / 0.10;
    return 1 + p * 1.5;
  });
  const rippleOpacity = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    if (v < 0.35 || v > 0.45) return 0;
    const p = (v - 0.35) / 0.10;
    return 1 - p;
  });

  // Centre Form card slides up (b 0.35 to 0.45)
  const formProgress = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.35) / 0.10));
  });
  const formY = useTransform(formProgress, (p: number) => 24 * (1 - p));
  const formOpacity = useTransform(formProgress, (p: number) => p);

  // Typing field 1: Business name (b 0.40 to 0.50)
  const typedBusiness = useTransform(b, (v: number) => {
    if (staticMode) return SAMPLE_ORDER.business;
    const full = SAMPLE_ORDER.business;
    const p = Math.min(1, Math.max(0, (v - 0.40) / 0.10));
    return full.slice(0, Math.floor(p * full.length));
  });

  // Typing field 2: Trade (b 0.50 to 0.60)
  const typedTrade = useTransform(b, (v: number) => {
    if (staticMode) return SAMPLE_ORDER.trade;
    const full = SAMPLE_ORDER.trade;
    const p = Math.min(1, Math.max(0, (v - 0.50) / 0.10));
    return full.slice(0, Math.floor(p * full.length));
  });

  // Typing field 3: Town (b 0.60 to 0.70)
  const typedTown = useTransform(b, (v: number) => {
    if (staticMode) return SAMPLE_ORDER.town;
    const full = SAMPLE_ORDER.town;
    const p = Math.min(1, Math.max(0, (v - 0.60) / 0.10));
    return full.slice(0, Math.floor(p * full.length));
  });

  // Button pressed at b = 0.72
  const buttonPressed = useTransform(b, (v: number) => {
    if (staticMode) return true;
    return v >= 0.72;
  });

  // Envelope flying from button to right dashboard bell (b 0.75 to 0.92)
  const flyProgress = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.75) / 0.17));
  });

  const envelopeVisible = useTransform(b, (v: number) => {
    if (staticMode) return false;
    return v >= 0.75 && v <= 0.93;
  });

  // Parabolic flight arc from Centre (x ~520, y ~350) to Right (x ~820, y ~160)
  const envelopeX = useTransform(flyProgress, (p: number) => 500 + p * 280);
  const envelopeY = useTransform(flyProgress, (p: number) => {
    // Parabolic curve: arc upward then down to bell
    const arc = Math.sin(p * Math.PI) * 70;
    return 340 - p * 190 - arc;
  });
  const envelopeScale = useTransform(flyProgress, (p: number) => 0.8 + 0.4 * Math.sin(p * Math.PI));

  // Trail stroke-dashoffset (total length ~340)
  const trailOffset = useTransform(flyProgress, (p: number) => 340 * (1 - p));

  // Right dashboard brightness (dimmed at 55% until b 0.85, then 100%)
  const dashboardOpacity = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    if (v < 0.85) return 0.55;
    const p = Math.min(1, (v - 0.85) / 0.08);
    return 0.55 + 0.45 * p;
  });

  // Bell ring (rotate +-14deg, 3 swings at b 0.88 to 0.95)
  const bellRotate = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    if (v < 0.88 || v > 0.97) return 0;
    const p = (v - 0.88) / 0.09;
    return Math.sin(p * Math.PI * 6) * 14;
  });

  // Toast slide in (b 0.92 to 1.0)
  const toastProgress = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.92) / 0.08));
  });
  const toastY = useTransform(toastProgress, (p: number) => 20 * (1 - p));
  const toastOpacity = useTransform(toastProgress, (p: number) => p);

  return (
    <motion.div
      data-scene="apply-v2"
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      className="absolute inset-0 w-[960px] h-[480px] p-4 select-none overflow-hidden"
    >
      <div className="w-full h-full bg-[#112933]/90 border border-white/10 rounded-3xl p-5 shadow-2xl relative flex flex-col justify-between">
        {/* Top persistent furniture: Story chip top-left */}
        <div className="w-full flex items-center justify-between shrink-0 mb-2">
          {/* Story chip: "Our work" peach #E3B896 */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3B896]/15 border border-[#E3B896]/40 text-[#E3B896] text-[16px] font-semibold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E3B896]" />
            <span>Our work</span>
          </div>

          <div className="text-[14px] text-white/50 font-mono flex items-center gap-2">
            <span>Fast, straightforward application</span>
          </div>
        </div>

        {/* 3-Column Layout: Left (Package Picker) | Centre (Details Form) | Right (Studio Dashboard) */}
        <div className="w-full flex-1 min-h-0 grid grid-cols-12 gap-4 items-stretch relative">
          {/* Left Column: 2 x 2 package picker (cols 1-4) */}
          <div className="col-span-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative">
            <div>
              <span className="text-[16px] font-semibold text-white/80 uppercase tracking-wider block mb-2">
                1. Select Package
              </span>
              <p className="text-[14px] text-white/50 mb-3">Choose any package to get started</p>
            </div>

            {/* 2 x 2 Tile Grid */}
            <div className="grid grid-cols-2 gap-2.5 relative flex-1">
              {/* Tile 1: 1-page website */}
              <div className="rounded-xl border border-white/15 bg-white/5 p-3 flex flex-col justify-center items-center text-center">
                <span className="text-[22px] font-bold text-white/90 leading-tight">
                  1-page website
                </span>
              </div>

              {/* Tile 2: Starter (Selected) */}
              <motion.div
                className="rounded-xl border transition-all p-3 flex flex-col justify-center items-center text-center relative"
                style={{
                  borderColor: useTransform(isStarterSelected, (s) => (s ? '#E3B896' : 'rgba(255,255,255,0.15)')),
                  backgroundColor: useTransform(isStarterSelected, (s) =>
                    s ? 'rgba(227,184,150,0.18)' : 'rgba(255,255,255,0.05)'
                  ),
                  boxShadow: useTransform(isStarterSelected, (s) =>
                    s ? '0 0 0 2px rgba(227,184,150,0.4)' : 'none'
                  ),
                }}
              >
                <motion.div
                  style={{ opacity: useTransform(isStarterSelected, (s) => (s ? 1 : 0)) }}
                  className="absolute top-1.5 right-1.5 text-[#E3B896]"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#E3B896]" />
                </motion.div>
                <span className="text-[22px] font-bold text-white leading-tight">Starter</span>
              </motion.div>

              {/* Tile 3: Standard */}
              <div className="rounded-xl border border-white/15 bg-white/5 p-3 flex flex-col justify-center items-center text-center">
                <span className="text-[22px] font-bold text-white/90 leading-tight">Standard</span>
              </div>

              {/* Tile 4: Growth */}
              <div className="rounded-xl border border-white/15 bg-white/5 p-3 flex flex-col justify-center items-center text-center">
                <span className="text-[22px] font-bold text-white/90 leading-tight">Growth</span>
              </div>

              {/* Gliding Cursor & Click Ripple */}
              <motion.div
                style={{
                  x: cursorX,
                  y: cursorY,
                  opacity: cursorOpacity,
                }}
                className="absolute top-0 left-0 pointer-events-none z-30 flex items-center justify-center"
              >
                {/* Ripple */}
                <motion.div
                  style={{
                    scale: rippleScale,
                    opacity: rippleOpacity,
                  }}
                  className="absolute w-8 h-8 rounded-full border-2 border-white pointer-events-none"
                />
                {/* Cursor dot */}
                <div className="w-5 h-5 rounded-full bg-white shadow-xl border-2 border-[#0F2A35]" />
              </motion.div>
            </div>

            <div className="text-[12px] text-white/40 mt-2 text-center">
              No prices shown here · Transparent scope
            </div>
          </div>

          {/* Centre Column: Details Form (cols 5-8) */}
          <motion.div
            style={{ y: formY, opacity: formOpacity }}
            className="col-span-4 bg-white/10 border border-white/15 rounded-2xl p-4 flex flex-col justify-between"
          >
            <div>
              <span className="text-[16px] font-semibold text-[#E3B896] uppercase tracking-wider block mb-1">
                2. Details
              </span>
              <h3 className="text-[22px] font-bold text-white mb-3">Your details</h3>
            </div>

            <div className="space-y-2.5 flex-1">
              {/* Field 1: Business name */}
              <div>
                <label className="text-[13px] text-white/70 block mb-0.5">Business name</label>
                <div className="w-full bg-[#0F2A35]/80 border border-white/20 rounded-xl px-3 py-1.5 font-mono text-[16px] text-white flex items-center min-h-[38px]">
                  <motion.span>{typedBusiness}</motion.span>
                </div>
              </div>

              {/* Field 2: Trade */}
              <div>
                <label className="text-[13px] text-white/70 block mb-0.5">Trade</label>
                <div className="w-full bg-[#0F2A35]/80 border border-white/20 rounded-xl px-3 py-1.5 font-mono text-[16px] text-white flex items-center min-h-[38px]">
                  <motion.span>{typedTrade}</motion.span>
                </div>
              </div>

              {/* Field 3: Town */}
              <div>
                <label className="text-[13px] text-white/70 block mb-0.5">Town</label>
                <div className="w-full bg-[#0F2A35]/80 border border-white/20 rounded-xl px-3 py-1.5 font-mono text-[16px] text-white flex items-center min-h-[38px]">
                  <motion.span>{typedTown}</motion.span>
                </div>
              </div>
            </div>

            {/* Submit button "Send my request" */}
            <motion.div
              style={{
                scale: useTransform(buttonPressed, (p) => (p ? 0.97 : 1)),
                backgroundColor: useTransform(buttonPressed, (p) => (p ? '#ebd0b9' : '#E3B896')),
              }}
              className="w-full rounded-xl py-2.5 px-4 text-[#0F2A35] font-bold text-[17px] flex items-center justify-center gap-2 shadow-lg cursor-default mt-2 transition-transform"
            >
              {buttonPressed.get() ? (
                <>
                  <Check className="w-5 h-5 text-[#0F2A35]" />
                  <span>Request sent</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#0F2A35]" />
                  <span>Send my request</span>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right Column: Dashboard Card (cols 9-12) */}
          <motion.div
            style={{ opacity: dashboardOpacity }}
            className="col-span-4 bg-[#0F2A35] border border-white/15 rounded-2xl p-4 flex flex-col justify-between relative shadow-inner"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <Logo size="sm" />
                </div>
                {/* Bell Icon that rings */}
                <motion.div
                  style={{ rotate: bellRotate }}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#E3B896]"
                >
                  <Bell className="w-5 h-5" />
                </motion.div>
              </div>

              <span className="text-[16px] font-semibold text-white/90 block mb-1">
                Studio Notifications
              </span>
              <p className="text-[14px] text-white/60">
                Direct route to team · Immediate confirmation
              </p>
            </div>

            {/* Notification Toast sliding in (b 0.92 to 1.0) */}
            <motion.div
              style={{ y: toastY, opacity: toastOpacity }}
              className="bg-white rounded-xl p-3 shadow-xl border border-slate-200 text-[#0F2A35] my-auto"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E3B896]/30 flex items-center justify-center text-[#0F2A35]">
                    <CheckCircle2 className="w-4 h-4 text-[#0F2A35]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[16px] leading-tight">New request</h5>
                    <p className="text-[13px] text-slate-600">{SAMPLE_ORDER.business}</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">Just now</span>
              </div>
            </motion.div>

            <div className="text-[12px] text-[#E3B896] text-center pt-2 border-t border-white/10">
              We confirm next steps directly with you
            </div>
          </motion.div>

          {/* Flying Envelope with dashed flight path (b 0.75 to 0.92) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible"
            viewBox="0 0 920 380"
          >
            {/* Dashed trail */}
            <motion.path
              d="M 500 340 Q 660 140, 820 160"
              fill="none"
              stroke="#E3B896"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              style={{ strokeDashoffset: trailOffset }}
            />
          </svg>

          {/* Flying Envelope Icon */}
          <motion.div
            style={{
              x: envelopeX,
              y: envelopeY,
              scale: envelopeScale,
              opacity: useTransform(envelopeVisible, (v) => (v ? 1 : 0)),
            }}
            className="absolute top-0 left-0 pointer-events-none z-50 w-9 h-9 rounded-full bg-[#E3B896] text-[#0F2A35] shadow-2xl flex items-center justify-center"
          >
            <Mail className="w-5 h-5 text-[#0F2A35]" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
