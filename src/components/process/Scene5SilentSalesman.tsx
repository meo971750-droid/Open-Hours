import React from 'react';
import { motion, useTransform } from 'motion/react';
import { Phone, MessageSquareReply, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SceneProps, useSceneVisibility } from './types';
import { SAMPLE_ORDER } from '../../content';

export default function Scene5SilentSalesman({
  scrollYProgress,
  onescene = false,
  staticMode = false,
}: SceneProps) {
  const { opacity, y, scale, pointerEvents, visibility, b } = useSceneVisibility(
    scrollYProgress,
    4,
    onescene,
    staticMode
  );

  // Silhouettes appear (b = 0 to 0.3)
  const silhouettesOpacity = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, v / 0.3))
  );

  // Interaction lines draw (b = 0.3 to 0.5)
  // Line A: from silhouettes to "Request a quote"
  const lineQuoteOffset = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.3) / 0.2));
    return 200 * (1 - p);
  });

  // Line B: from silhouettes to "Call now"
  const lineCallOffset = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.32) / 0.18));
    return 200 * (1 - p);
  });

  // Button tap reactions / ripple effect (b = 0.45 to 0.6)
  const quoteButtonScale = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    if (v < 0.42 || v > 0.65) return 1;
    const p = (v - 0.42) / 0.23;
    return 1 + 0.07 * Math.sin(p * Math.PI * 2);
  });

  const quoteRippleOpacity = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    if (v < 0.45 || v > 0.65) return 0;
    return Math.sin(((v - 0.45) / 0.2) * Math.PI);
  });

  const callButtonScale = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    if (v < 0.48 || v > 0.68) return 1;
    const p = (v - 0.48) / 0.2;
    return 1 + 0.06 * Math.sin(p * Math.PI * 2);
  });

  // Right chips connect and light up one after another (b = 0.5 to 0.75)
  // Chip A: "Quote request" (b 0.50 to 0.58)
  const chipQuoteOpacity = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.5) / 0.08))
  );
  const chipQuoteX = useTransform(b, (v: number) =>
    staticMode ? 0 : 20 * (1 - Math.min(1, Math.max(0, (v - 0.5) / 0.08)))
  );

  // Chip B: "Call" (b 0.58 to 0.66)
  const chipCallOpacity = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.58) / 0.08))
  );
  const chipCallX = useTransform(b, (v: number) =>
    staticMode ? 0 : 20 * (1 - Math.min(1, Math.max(0, (v - 0.58) / 0.08)))
  );

  // Chip C: "Auto-reply" + bubble (b 0.66 to 0.75)
  const chipReplyOpacity = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.66) / 0.09))
  );
  const chipReplyX = useTransform(b, (v: number) =>
    staticMode ? 0 : 20 * (1 - Math.min(1, Math.max(0, (v - 0.66) / 0.09)))
  );

  // From b = 0.65 the website window "turns on": gold border, soft glow, gold badge
  const websiteTurnOnProgress = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.65) / 0.25))
  );

  const websiteBorderColor = useTransform(websiteTurnOnProgress, (p: number) =>
    `rgba(227, 184, 150, ${0.2 + 0.8 * p})`
  );

  const websiteGlowShadow = useTransform(websiteTurnOnProgress, (p: number) =>
    `0 20px 45px -10px rgba(0, 0, 0, 0.5), 0 0 ${Math.round(28 * p)}px rgba(227, 184, 150, ${0.35 * p})`
  );

  const goldBadgeScale = useTransform(websiteTurnOnProgress, (p: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (p - 0.4) / 0.6))
  );

  // Ribbon label fades in under the window (b = 0.8 to 0.95)
  const ribbonOpacity = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.8) / 0.15))
  );
  const ribbonY = useTransform(b, (v: number) =>
    staticMode ? 0 : 12 * (1 - Math.min(1, Math.max(0, (v - 0.8) / 0.15)))
  );

  return (
    <motion.div
      data-scene="salesman-v2"
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      className="absolute inset-0 w-[960px] h-[480px] p-4 select-none overflow-hidden"
    >
      <div className="w-full h-full bg-[rgb(17,41,51)]/90 border border-white/10 rounded-3xl p-5 shadow-2xl relative flex flex-col justify-between">
        {/* Story chip bar */}
        <div className="w-full flex items-center justify-between shrink-0 mb-1">
          {/* Story chip: "After" green #2E9E6B */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E9E6B]/15 border border-[#2E9E6B]/40 text-[#2E9E6B] text-[16px] font-semibold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E9E6B]" />
            <span>After</span>
          </div>
          <div className="text-[12px] text-white/50 tracking-wide font-medium">
            Illustrative customer journey
          </div>
        </div>

        {/* Main Stage Grid: Left Silhouettes | Center Website Window | Right Live Leads Feed */}
        <div className="flex-1 w-full grid grid-cols-12 gap-3 items-center min-h-0 relative">
          {/* LEFT: Six anonymous silhouettes (Cols 1-3) */}
          <motion.div
            style={{ opacity: silhouettesOpacity }}
            className="col-span-3 flex flex-col justify-center h-full pr-1 relative"
          >
            <div className="text-[13px] font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Local visitors</span>
            </div>

            {/* Silhouette Avatars Grid (two columns of three silhouettes) */}
            <div className="grid grid-cols-2 gap-2.5 bg-white/[0.04] border border-white/10 rounded-2xl p-2.5">
              {[
                { label: 'Homeowner', highlight: 'quote' },
                { label: 'Landlord', highlight: 'quote' },
                { label: 'Resident', highlight: 'call' },
                { label: 'Neighbour', highlight: 'browse' },
                { label: 'Builder', highlight: 'browse' },
                { label: 'Commercial', highlight: 'browse' },
              ].map((person, idx) => (
                <div
                  key={person.label + idx}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
                    <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M4 21v-2a6 6 0 0 1 12 0v2H4z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-white/90 truncate leading-tight">
                      {person.label}
                    </p>
                    <p className="text-[9px] text-white/50 truncate">
                      {SAMPLE_ORDER.town}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-white/45 mt-2 leading-relaxed">
              Anonymous homeowners searching locally across Galway
            </p>
          </motion.div>

          {/* CENTRE: Browser Window (Cols 4-9, 6 columns) */}
          <div className="col-span-6 flex flex-col items-center justify-center h-full relative px-1">
            {/* Inline SVG drawing connection lines from silhouettes to buttons */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              style={{ overflow: 'visible' }}
            >
              {/* Connecting line A to Request a quote */}
              <motion.path
                d="M -30 140 C 20 140, 40 180, 85 180"
                fill="none"
                stroke="#E3B896"
                strokeWidth="2"
                strokeDasharray="6 4"
                strokeDashoffset={lineQuoteOffset}
              />
              {/* Connecting line B to Call */}
              <motion.path
                d="M -30 190 C 20 190, 60 180, 180 180"
                fill="none"
                stroke="#2E9E6B"
                strokeWidth="2"
                strokeDasharray="6 4"
                strokeDashoffset={lineCallOffset}
              />
            </svg>

            {/* The Browser Window Card */}
            <motion.div
              style={{
                borderColor: websiteBorderColor,
                boxShadow: websiteGlowShadow,
              }}
              className="w-full bg-[#0F2A35] rounded-2xl border transition-colors duration-300 relative flex flex-col overflow-hidden"
            >
              {/* Website Turned On: Gold badge at upper right */}
              <motion.div
                style={{ scale: goldBadgeScale }}
                className="absolute right-3 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-[#E3B896] text-[#0F2A35] shadow-lg flex items-center justify-center border-2 border-[#0F2A35]"
                style-origin="50% 50%"
              >
                <MessageSquareReply className="w-5 h-5 text-[#0F2A35]" />
              </motion.div>

              {/* Browser window chrome */}
              <div className="h-8 bg-black/30 border-b border-white/10 px-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                {/* Nav bar "Your business" */}
                <div className="text-[12px] font-semibold text-white/80 tracking-wide">
                  {SAMPLE_ORDER.business}
                </div>
                <div className="w-10" />
              </div>

              {/* Website content body */}
              <div className="p-4 flex flex-col gap-3">
                {/* Headline: "Roofing you can rely on" */}
                <div className="text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#E3B896] font-semibold">
                    {SAMPLE_ORDER.town} &middot; {SAMPLE_ORDER.trade}
                  </span>
                  <h4 className="text-[20px] font-bold text-white tracking-tight leading-tight mt-0.5">
                    Roofing you can rely on
                  </h4>
                </div>

                {/* Three Gallery Tiles */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[rgb(30,67,82)] to-[rgb(18,43,54)] border border-white/10 p-2 flex flex-col justify-end">
                    <span className="text-[10px] font-medium text-white/90">Slating</span>
                    <span className="text-[8px] text-white/50">Galway</span>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[rgb(30,67,82)] to-[rgb(18,43,54)] border border-white/10 p-2 flex flex-col justify-end">
                    <span className="text-[10px] font-medium text-white/90">Repairs</span>
                    <span className="text-[8px] text-white/50">Emergency</span>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[rgb(30,67,82)] to-[rgb(18,43,54)] border border-white/10 p-2 flex flex-col justify-end">
                    <span className="text-[10px] font-medium text-white/90">Flat Roofs</span>
                    <span className="text-[8px] text-white/50">Felt & Lead</span>
                  </div>
                </div>

                {/* Two Action Buttons: "Request a quote" & "Call now" */}
                <div className="grid grid-cols-2 gap-2 pt-1 relative">
                  {/* Button 1: Request a quote */}
                  <motion.div
                    style={{ scale: quoteButtonScale }}
                    className="relative"
                  >
                    <div className="w-full py-2.5 px-3 rounded-xl bg-[#E3B896] text-[#0F2A35] font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md">
                      <span>Request a quote</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    {/* Ripple aura */}
                    <motion.div
                      style={{ opacity: quoteRippleOpacity }}
                      className="absolute inset-0 rounded-xl border-2 border-[#E3B896] pointer-events-none scale-110"
                    />
                  </motion.div>

                  {/* Button 2: Call now */}
                  <motion.div
                    style={{ scale: callButtonScale }}
                    className="relative"
                  >
                    <div className="w-full py-2.5 px-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 hover:bg-white/15">
                      <Phone className="w-3.5 h-3.5 text-[#2E9E6B]" />
                      <span>Call now</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Ribbon Label under the window (24px, weight 600, white) */}
            <motion.div
              style={{ opacity: ribbonOpacity, y: ribbonY }}
              className="mt-2.5 text-center flex items-center gap-2"
            >
              <span className="h-px w-6 bg-[#E3B896]/40" />
              <span className="text-[24px] font-semibold text-white tracking-tight">
                Your silent salesman
              </span>
              <span className="h-px w-6 bg-[#E3B896]/40" />
            </motion.div>
          </div>

          {/* RIGHT: Three Live Enquiry Chips & Auto-reply Bubble (Cols 10-12) */}
          <div className="col-span-3 flex flex-col justify-center h-full pl-1 gap-2.5 relative">
            <div className="text-[13px] font-semibold text-white/70 uppercase tracking-wider mb-0.5">
              Enquiry responses
            </div>

            {/* Chip A: Quote request */}
            <motion.div
              style={{ opacity: chipQuoteOpacity, x: chipQuoteX }}
              className="p-2.5 rounded-xl bg-white/[0.06] border border-[#E3B896]/40 flex items-center gap-2.5 shadow-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-[#E3B896]/20 flex items-center justify-center text-[#E3B896] shrink-0 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#E3B896]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-white leading-tight">
                  Quote request
                </div>
                <div className="text-[10px] text-white/60 truncate">
                  Slate roof overhaul
                </div>
              </div>
            </motion.div>

            {/* Chip B: Call */}
            <motion.div
              style={{ opacity: chipCallOpacity, x: chipCallX }}
              className="p-2.5 rounded-xl bg-white/[0.06] border border-[#2E9E6B]/40 flex items-center gap-2.5 shadow-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-[#2E9E6B]/20 flex items-center justify-center text-[#2E9E6B] shrink-0 font-bold">
                <Phone className="w-4 h-4 text-[#2E9E6B]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-white leading-tight">
                  Call connected
                </div>
                <div className="text-[10px] text-white/60 truncate">
                  Direct tap from mobile
                </div>
              </div>
            </motion.div>

            {/* Chip C: Auto-reply */}
            <motion.div
              style={{ opacity: chipReplyOpacity, x: chipReplyX }}
              className="p-2.5 rounded-xl bg-white/[0.06] border border-white/20 flex flex-col gap-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#E3B896]" />
                  <span className="text-[13px] font-bold text-white leading-tight">
                    Auto-reply
                  </span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-semibold tracking-wider">
                  Sample
                </span>
              </div>
              {/* Message Bubble */}
              <div className="p-2 rounded-lg bg-[#0F2A35] border border-white/10 text-[11px] text-white/90 leading-snug">
                &ldquo;Thanks for your request. We&apos;ll be in touch.&rdquo;
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom persistent line */}
        <div className="w-full flex items-center justify-between shrink-0 pt-1 border-t border-white/5 text-[11px] text-white/40">
          <span>Live enquiry reception</span>
          <span>Illustrative client journey</span>
        </div>
      </div>
    </motion.div>
  );
}
