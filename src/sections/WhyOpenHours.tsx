import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Check,
  Clock,
  Zap,
  Globe,
  Award,
  MapPin,
  TrendingUp,
  Key,
  MessageSquare,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Inbox,
  Laptop,
} from 'lucide-react';
import Container from '../components/Container';
import { config } from '../config';

// Twinkling dots decoration for Tile A and Tile B (deterministic positions, CSS animated)
const TWINKLE_DOTS_A = [
  { top: '14%', left: '12%', size: 3, delay: '0s', opacity: 0.35 },
  { top: '22%', left: '85%', size: 2, delay: '1.2s', opacity: 0.25 },
  { top: '45%', left: '20%', size: 2.5, delay: '0.6s', opacity: 0.4 },
  { top: '70%', left: '78%', size: 3, delay: '1.8s', opacity: 0.3 },
  { top: '82%', left: '15%', size: 2, delay: '2.4s', opacity: 0.25 },
  { top: '35%', left: '60%', size: 2.5, delay: '0.9s', opacity: 0.35 },
  { top: '58%', left: '90%', size: 2, delay: '1.5s', opacity: 0.3 },
  { top: '88%', left: '45%', size: 2.5, delay: '2.1s', opacity: 0.25 },
  { top: '12%', left: '48%', size: 2, delay: '0.4s', opacity: 0.3 },
  { top: '65%', left: '32%', size: 3, delay: '1.1s', opacity: 0.35 },
  { top: '28%', left: '35%', size: 2, delay: '2.0s', opacity: 0.25 },
  { top: '78%', left: '65%', size: 2, delay: '0.8s', opacity: 0.3 },
];

const TWINKLE_DOTS_B = [
  { top: '10%', left: '15%', size: 3, delay: '0.2s', opacity: 0.3 },
  { top: '18%', left: '80%', size: 2, delay: '1.4s', opacity: 0.25 },
  { top: '40%', left: '92%', size: 2.5, delay: '0.8s', opacity: 0.35 },
  { top: '68%', left: '10%', size: 3, delay: '2.1s', opacity: 0.25 },
  { top: '85%', left: '75%', size: 2, delay: '1.0s', opacity: 0.3 },
  { top: '30%', left: '40%', size: 2, delay: '1.7s', opacity: 0.2 },
  { top: '55%', left: '25%', size: 2.5, delay: '2.5s', opacity: 0.35 },
  { top: '75%', left: '50%', size: 3, delay: '0.5s', opacity: 0.25 },
  { top: '25%', left: '65%', size: 2, delay: '1.9s', opacity: 0.3 },
  { top: '90%', left: '30%', size: 2, delay: '0.7s', opacity: 0.2 },
  { top: '12%', left: '45%', size: 2.5, delay: '2.3s', opacity: 0.35 },
  { top: '50%', left: '85%', size: 2, delay: '1.3s', opacity: 0.25 },
];

export default function WhyOpenHours() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-8%' });
  const shouldReduceMotion = useReducedMotion();

  const bento = config.bento;
  const features = config.features;
  const promises = config.promises || [];
  const coreEssentials = config.coreEssentials || [];

  const handleScrollToCarePlan = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  };

  const getEssentialIcon = (name: string) => {
    switch (name) {
      case 'MapPin':
        return MapPin;
      case 'Globe':
        return Globe;
      case 'Zap':
        return Zap;
      case 'TrendingUp':
        return TrendingUp;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Award':
        return Award;
      default:
        return Sparkles;
    }
  };

  // Sample inbox rows for Tile B (all fictional, no KPI numbers or percentages)
  const sampleEnquiries = [
    {
      avatar: 'T',
      title: 'Roof repair quote',
      client: 'Tom M. · Galway',
      status: 'New',
      time: 'Just now',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      avatar: 'S',
      title: 'Slate roof replacement',
      client: 'Sarah C. · Oranmore',
      status: 'New',
      time: '14m ago',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      avatar: 'P',
      title: 'Gutter inspection',
      client: 'Patrick B. · Salthill',
      status: 'Replied',
      time: '1h ago',
      color: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
    {
      avatar: 'M',
      title: 'Chimney flashing leak',
      client: 'Michael K. · Athenry',
      status: 'Replied',
      time: '3h ago',
      color: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
  ];

  return (
    <section
      id="why-open-hours"
      ref={sectionRef}
      className="relative w-full bg-white py-20 sm:py-28 md:py-32 overflow-hidden scroll-mt-24"
    >
      {/* Anchor for backward compatibility with navbar "What you get" links */}
      <div id="what-you-get" className="sr-only scroll-mt-24" />

      <Container>
        {/* =========================================================================
            SECTION HEADER: Centered on white background
           ========================================================================= */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E3B896]/20 border border-[#E3B896]/40 shadow-xs mb-4 text-xs font-semibold uppercase tracking-wider text-[#9E5D2A]">
            <Sparkles className="w-3.5 h-3.5 text-[#C8642E]" />
            <span>{bento.pill}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F2A35] max-w-3xl leading-[1.12]">
            {bento.title}
          </h2>

          <p className="text-base sm:text-lg text-[#5E6F77] max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
            {bento.subtitle}
          </p>
        </div>

        {/* =========================================================================
            12-COLUMN BENTO GRID: Solid Opaque Tiles with Drop Shadows on White
            Row 1: Tile A (4 cols) | Tile B (8 cols)
            Row 2: Tile C (5 cols) | Tile D (4 cols) | Tile E (3 cols)
            Row 3: Tile F (5 cols) | Tile G (7 cols)
            Row 4: Full-width Chip Row (12 cols)
           ========================================================================= */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 relative z-10">
          {/* =========================================================================
              TILE A: Vivid Accent Tile (4 cols)
              Peach/terracotta gradient with dark text & twinkling dots
             ========================================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 bg-gradient-to-br from-[#E8B08F] via-[#E3B896] to-[#C8642E] rounded-3xl p-7 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(11,27,34,0.18),0_2px_6px_rgba(11,27,34,0.08),inset_0_1px_0_rgba(255,255,255,0.35)] border border-white/20 min-h-[360px] group transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Subtle Twinkling Dots inside Tile A */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
              {TWINKLE_DOTS_A.map((dot, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-white animate-twinkle"
                  style={{
                    top: dot.top,
                    left: dot.left,
                    width: `${dot.size}px`,
                    height: `${dot.size}px`,
                    opacity: dot.opacity,
                    animationDelay: dot.delay,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/10 border border-black/10 text-xs font-bold text-[#0F2A35] uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5 text-[#0F2A35]" />
                <span>All-in-one</span>
              </div>

              <h3 className="text-2xl sm:text-[28px] font-extrabold text-[#0F2A35] tracking-tight leading-tight mb-3">
                {bento.tileA.heading}
              </h3>

              <p className="text-sm sm:text-base text-[#0F2A35]/85 leading-relaxed font-medium">
                {bento.tileA.text}
              </p>
            </div>

            {/* Interconnected 3-element strip at the bottom */}
            <div className="relative z-10 pt-6 mt-6 border-t border-black/10 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-[#0F2A35]">
              <div className="p-2 rounded-xl bg-white/40 backdrop-blur-xs flex flex-col items-center gap-1 shadow-xs">
                <Globe className="w-4 h-4 text-[#0F2A35]" />
                <span>Website</span>
              </div>
              <div className="p-2 rounded-xl bg-white/40 backdrop-blur-xs flex flex-col items-center gap-1 shadow-xs">
                <MapPin className="w-4 h-4 text-[#0F2A35]" />
                <span>Google Profile</span>
              </div>
              <div className="p-2 rounded-xl bg-white/40 backdrop-blur-xs flex flex-col items-center gap-1 shadow-xs">
                <PhoneCall className="w-4 h-4 text-[#0F2A35]" />
                <span>Enquiries</span>
              </div>
            </div>
          </motion.div>

          {/* =========================================================================
              TILE B: Large Solid Dark Tile with Tilted Dashboard Mockup (8 cols)
              If features.enquiryInbox: clean inbox mockup
              If false: sample trade website mockup
             ========================================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6%' }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(145deg, #102835 0%, #0C202B 100%)',
            }}
            className="lg:col-span-8 rounded-3xl p-7 sm:p-8 border border-white/10 shadow-[0_20px_50px_rgba(11,27,34,0.18),0_2px_6px_rgba(11,27,34,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] relative overflow-hidden flex flex-col justify-between min-h-[360px] group transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Twinkling dots behind dashboard inside Tile B */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
              {TWINKLE_DOTS_B.map((dot, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-white animate-twinkle"
                  style={{
                    top: dot.top,
                    left: dot.left,
                    width: `${dot.size}px`,
                    height: `${dot.size}px`,
                    opacity: dot.opacity,
                    animationDelay: dot.delay,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#E3B896] block mb-1">
                  {features.enquiryInbox ? bento.tileB.inboxLabel : 'Website'}
                </span>
                <h3 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight leading-snug">
                  {features.enquiryInbox ? bento.tileB.inboxHeading : bento.tileB.fallbackHeading}
                </h3>
                <p className="text-sm sm:text-base text-white/75 mt-1.5 max-w-lg leading-relaxed">
                  {bento.tileB.inboxText}
                </p>
              </div>

              <span className="shrink-0 text-[10px] uppercase font-mono tracking-wider text-white/40 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                {bento.tileB.tag}
              </span>
            </div>

            {/* Tilted Dashboard Window */}
            <div className="relative z-10 pt-2 perspective-[1200px] overflow-hidden sm:overflow-visible">
              <div
                className={`w-full bg-[#081822] rounded-2xl border border-white/15 shadow-2xl p-3.5 transition-all duration-500 ${
                  shouldReduceMotion ? '' : 'sm:rotate-x-[6deg] sm:-rotate-y-[6deg] sm:hover:rotate-x-0 sm:hover:rotate-y-0'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Window header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                    <span className="text-[11px] font-mono text-white/60 ml-2">
                      {bento.tileB.businessName} — {features.enquiryInbox ? 'Enquiry Inbox' : 'Live Website'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-white/50">
                    {features.enquiryInbox ? (
                      <>
                        <Inbox className="w-3.5 h-3.5 text-[#E3B896]" />
                        <span>Real-time</span>
                      </>
                    ) : (
                      <>
                        <Laptop className="w-3.5 h-3.5 text-[#E3B896]" />
                        <span>Responsive</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Sample enquiries list (or clean website preview fallback) */}
                {features.enquiryInbox ? (
                  <div className="space-y-1.5">
                    {sampleEnquiries.map((enq) => (
                      <div
                        key={enq.title + enq.client}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/5 transition-colors gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-[#1E4A5C] text-[#E3B896] text-[11px] font-bold flex items-center justify-center shrink-0">
                            {enq.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {enq.title}
                            </p>
                            <p className="text-[11px] text-white/60 truncate">
                              {enq.client}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${enq.color}`}
                          >
                            {enq.status}
                          </span>
                          <span className="text-[10px] font-mono text-white/50 hidden sm:inline">
                            {enq.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/5 text-center">
                    <Laptop className="w-8 h-8 text-[#E3B896] mx-auto mb-2" />
                    <p className="text-xs font-bold text-white mb-1">Modern trade website</p>
                    <p className="text-[11px] text-white/60">Fast, clear and built to catch enquiries.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* =========================================================================
              TILE C: Solid Dark Tile with Floating UI Cards (5 cols)
              Soft fade at edges with gentle drifting notification cards
             ========================================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6%' }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(145deg, #102835 0%, #0C202B 100%)',
            }}
            className="lg:col-span-5 rounded-3xl p-7 sm:p-8 border border-white/10 shadow-[0_20px_50px_rgba(11,27,34,0.18),0_2px_6px_rgba(11,27,34,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] relative overflow-hidden flex flex-col justify-between min-h-[380px] group transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#E3B896] block mb-1">
                  Enquiry Routing
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {bento.tileC.heading}
                </h3>
                <p className="text-sm text-white/75 mt-1.5 leading-relaxed">
                  {bento.tileC.text}
                </p>
              </div>

              <span className="shrink-0 text-[10px] uppercase font-mono tracking-wider text-white/40 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                {bento.tileC.tag}
              </span>
            </div>

            {/* Floating Drift Cards */}
            <div className="relative z-10 space-y-3 pt-2">
              {/* Card 1: New quote request */}
              <div
                className={`p-3.5 rounded-2xl bg-[#081822] border border-white/12 shadow-lg flex items-center justify-between gap-3 ${
                  shouldReduceMotion ? '' : 'animate-card-drift-1'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white">New quote request</div>
                    <div className="text-[11px] text-white/60 truncate">
                      Slate roof leak repair · Tom Murphy, Galway
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  New
                </span>
              </div>

              {/* Card 2: Confirmation sent to customer */}
              <div
                className={`p-3.5 rounded-2xl bg-[#081822] border border-white/12 shadow-lg flex items-center justify-between gap-3 ${
                  shouldReduceMotion ? '' : 'animate-card-drift-2'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white">Confirmation sent to customer</div>
                    <div className="text-[11px] text-white/60 truncate">
                      Automatic email & SMS confirmation dispatched
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0">
                  Sent
                </span>
              </div>

              {/* Card 3: Follow-up queued (conditioned on flags) */}
              {(features.enquiryTracking || features.afterHoursAutoReply || features.missedCallTextBack) && (
                <div
                  className={`p-3.5 rounded-2xl bg-[#081822] border border-white/12 shadow-lg flex items-center justify-between gap-3 ${
                    shouldReduceMotion ? '' : 'animate-card-drift-3'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white">Follow-up queued</div>
                      <div className="text-[11px] text-white/60 truncate">
                        Next morning follow-up ready in queue
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    Queued
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* =========================================================================
              TILE D: Solid Dark Tile with Speed and Timeline (4 cols)
              Numbers from config.bento.timeline (conceptDays, goLiveDays)
             ========================================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6%' }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(145deg, #102835 0%, #0C202B 100%)',
            }}
            className="lg:col-span-4 rounded-3xl p-7 sm:p-8 border border-white/10 shadow-[0_20px_50px_rgba(11,27,34,0.18),0_2px_6px_rgba(11,27,34,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] relative overflow-hidden flex flex-col justify-between min-h-[380px] group transition-transform duration-300 hover:-translate-y-1"
          >
            <div>
              <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#E3B896] block mb-1">
                {bento.timeline.eyebrow}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                About {bento.timeline.conceptDays} working days to a homepage concept. About {bento.timeline.goLiveDays} to go live.
              </h3>
            </div>

            {/* 2-Node Animated Timeline Graphic */}
            <div className="py-6 my-auto">
              <div className="relative flex items-center justify-between mb-2">
                {/* Track background */}
                <div className="absolute top-1/2 left-4 right-4 h-1.5 -translate-y-1/2 bg-white/10 rounded-full" />
                {/* Animated connecting fill */}
                <motion.div
                  initial={{ width: '0%' }}
                  animate={isInView ? { width: '100%' } : { width: '0%' }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-1/2 left-4 h-1.5 -translate-y-1/2 bg-gradient-to-r from-[#E3B896] to-emerald-400 rounded-full max-w-[calc(100%-2rem)]"
                />

                {/* Left Node: Concept */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-[#1E4A5C] border-2 border-[#E3B896] flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {bento.timeline.conceptDays}d
                  </div>
                  <span className="text-xs font-bold text-white mt-1.5">Concept</span>
                  <span className="text-[10px] text-white/60">Day {bento.timeline.conceptDays}</span>
                </div>

                {/* Right Node: Go Live */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {bento.timeline.goLiveDays}d
                  </div>
                  <span className="text-xs font-bold text-emerald-300 mt-1.5">Go live</span>
                  <span className="text-[10px] text-white/60">Day {bento.timeline.goLiveDays}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/65 leading-relaxed">
                {bento.timeline.footnote}
              </p>
            </div>
          </motion.div>

          {/* =========================================================================
              TILE E: Solid Dark Tile with Ownership (3 cols)
              Rows with "Yours" chip: Your domain, Your website, Your content
             ========================================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6%' }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(145deg, #102835 0%, #0C202B 100%)',
            }}
            className="lg:col-span-3 rounded-3xl p-7 border border-white/10 shadow-[0_20px_50px_rgba(11,27,34,0.18),0_2px_6px_rgba(11,27,34,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] relative overflow-hidden flex flex-col justify-between min-h-[380px] group transition-transform duration-300 hover:-translate-y-1"
          >
            <div>
              <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#E3B896] block mb-1">
                {bento.ownership.eyebrow}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-5">
                {bento.ownership.heading}
              </h3>

              {/* 3 Rows with Icons and "Yours" Chips */}
              <div className="space-y-2.5">
                {bento.ownership.items.map((row, idx) => {
                  const RowIcon = idx === 0 ? Globe : idx === 1 ? Key : ShieldCheck;
                  return (
                    <div
                      key={row.label}
                      className="px-3 py-2 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2 text-white min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#1E4A5C] flex items-center justify-center shrink-0">
                          <RowIcon className="w-3.5 h-3.5 text-[#E3B896]" />
                        </div>
                        <span className="text-xs font-semibold truncate">{row.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#0F2A35] bg-[#E3B896] px-2 py-0.5 rounded-full shrink-0">
                        {row.chip}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {bento.ownership.noLockIn && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/75 leading-relaxed font-medium">
                  {bento.ownership.footer}
                </p>
              </div>
            )}
          </motion.div>

          {/* =========================================================================
              TILE F: Solid Dark Tile with Fixed Price (5 cols)
              Check rows from config.promises
             ========================================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6%' }}
            transition={{ duration: 0.55, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(145deg, #102835 0%, #0C202B 100%)',
            }}
            className="lg:col-span-5 rounded-3xl p-7 sm:p-8 border border-white/10 shadow-[0_20px_50px_rgba(11,27,34,0.18),0_2px_6px_rgba(11,27,34,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] relative overflow-hidden flex flex-col justify-between min-h-[300px] group transition-transform duration-300 hover:-translate-y-1"
          >
            <div>
              <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#E3B896] block mb-1">
                {bento.fixedPrice.eyebrow}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-5">
                {bento.fixedPrice.heading}
              </h3>

              {/* Check rows from config.promises */}
              <div className="space-y-3">
                {promises.map((promise) => (
                  <div key={promise} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    </div>
                    <span className="text-sm font-medium text-white/90 leading-snug">
                      {promise}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-white/10">
              <p className="text-xs text-white/70 leading-relaxed">
                {bento.fixedPrice.footer}
              </p>
            </div>
          </motion.div>

          {/* =========================================================================
              TILE G: Solid Dark Tile with Support (7 cols)
              Support after you go live with link to care plan
              "Lifetime" / "Zero extra charges" / "Support included" removed completely
             ========================================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6%' }}
            transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(145deg, #102835 0%, #0C202B 100%)',
            }}
            className="lg:col-span-7 rounded-3xl p-7 sm:p-8 border border-white/10 shadow-[0_20px_50px_rgba(11,27,34,0.18),0_2px_6px_rgba(11,27,34,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] relative overflow-hidden flex flex-col justify-between min-h-[300px] group transition-transform duration-300 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#E3B896]">
                  {bento.support.eyebrow}
                </span>
                <span className="text-[11px] font-semibold text-[#E3B896] bg-[#E3B896]/15 px-2.5 py-0.5 rounded-full border border-[#E3B896]/30">
                  {bento.support.chip}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-3">
                {bento.support.heading}
              </h3>

              <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
                {bento.support.text}
              </p>

              {bento.support.terms ? (
                <p className="text-xs text-white/55 mt-2 leading-relaxed">
                  {bento.support.terms}
                </p>
              ) : null}
            </div>

            <div className="pt-5 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-white/60">
                Transparent monthly hosting, security & updates.
              </span>
              <a
                href="#pricing"
                onClick={handleScrollToCarePlan}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#0F2A35] bg-white hover:bg-[#E3B896] transition-colors shadow-sm cursor-pointer"
              >
                <span>{bento.support.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* =========================================================================
              ROW 4: "Included in every build" Chip Row (Full-width, 12 cols)
              Solid Dark Tile with derived count from config.coreEssentials.length
             ========================================================================= */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-4%' }}
            transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(145deg, #102835 0%, #0C202B 100%)',
            }}
            className="lg:col-span-12 rounded-3xl p-6 sm:p-7 border border-white/10 shadow-[0_20px_50px_rgba(11,27,34,0.18),0_2px_6px_rgba(11,27,34,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] mt-2"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#E3B896]" />
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight uppercase">
                  Included in every build
                </h4>
                <span className="text-xs font-semibold text-[#E3B896] bg-[#E3B896]/15 px-2.5 py-0.5 rounded-full border border-[#E3B896]/30">
                  {coreEssentials.length} essentials
                </span>
              </div>
              <span className="text-xs text-white/50">
                Ready on day one with zero hidden setup fees
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {coreEssentials.map((item) => {
                const ItemIcon = getEssentialIcon(item.icon);
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#1E4A5C]/40 border border-[#E3B896]/20 flex items-center justify-center shrink-0">
                      <ItemIcon className="w-4 h-4 text-[#E3B896]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-white/90">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Embedded Animations for Twinkle and Card Drift */}
      <style>{`
        @keyframes twinkleAnim {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.9);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }
        .animate-twinkle {
          animation: twinkleAnim 4s ease-in-out infinite;
        }

        @keyframes cardDrift1 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-card-drift-1 {
          animation: cardDrift1 5s ease-in-out infinite;
        }

        @keyframes cardDrift2 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(4px);
          }
        }
        .animate-card-drift-2 {
          animation: cardDrift2 6s ease-in-out infinite 0.5s;
        }

        @keyframes cardDrift3 {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-card-drift-3 {
          animation: cardDrift3 5.5s ease-in-out infinite 1s;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-twinkle,
          .animate-card-drift-1,
          .animate-card-drift-2,
          .animate-card-drift-3 {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
