import React from 'react';
import { motion, useTransform } from 'motion/react';
import { Search, AlertCircle, Phone, Globe, MapPin } from 'lucide-react';
import { SceneProps, useSceneVisibility } from './types';

export default function Scene1Search({
  scrollYProgress,
  onescene = false,
  staticMode = false,
  isActive = false,
}: SceneProps) {
  const { opacity, y, scale, pointerEvents, visibility, b } = useSceneVisibility(
    scrollYProgress,
    0,
    onescene,
    staticMode
  );

  // Search input typing: "roofers in Galway" (17 chars) over b = 0 to 0.25
  const typedQuery = useTransform(b, (v: number) => {
    if (staticMode) return 'roofers in Galway';
    const progress = Math.min(1, Math.max(0, v / 0.25));
    const chars = Math.floor(progress * 17);
    return 'roofers in Galway'.slice(0, chars);
  });

  const cursorVisible = useTransform(b, (v: number) => {
    if (staticMode) return false;
    return v <= 0.28;
  });

  // Competitor cards slide in (b 0.25 to 0.55)
  const card1Progress = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.25) / 0.10))
  );
  const card1Y = useTransform(card1Progress, (p: number) => 16 * (1 - p));
  const card1Opacity = useTransform(card1Progress, (p: number) => p);

  const card2Progress = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.35) / 0.10))
  );
  const card2Y = useTransform(card2Progress, (p: number) => 16 * (1 - p));
  const card2Opacity = useTransform(card2Progress, (p: number) => p);

  const card3Progress = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.45) / 0.10))
  );
  const card3Y = useTransform(card3Progress, (p: number) => 16 * (1 - p));
  const card3Opacity = useTransform(card3Progress, (p: number) => p);

  // 4th Card: "Your business" slides in with spring (b 0.55 to 0.8)
  const card4Progress = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.55) / 0.25))
  );
  const card4Y = useTransform(card4Progress, (p: number) => 24 * (1 - p));
  const card4Opacity = useTransform(card4Progress, (p: number) => p);
  const card4Scale = useTransform(card4Progress, (p: number) => 0.95 + 0.09 * p); // up to 1.04

  // Dashed border draw (stroke-dashoffset 0 to 120) over b 0.65 to 0.80
  const dashOffset = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.65) / 0.15));
    return 120 * (1 - p);
  });

  // Red chip pops above "Your business" (b 0.8 to 0.9)
  const chipPopProgress = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.80) / 0.10))
  );
  const chipPopOpacity = useTransform(chipPopProgress, (p: number) => p);
  const chipPopScale = useTransform(chipPopProgress, (p: number) => 0.7 + 0.3 * p);
  const chipPopY = useTransform(chipPopProgress, (p: number) => 8 * (1 - p));

  // Map pins dropping 150ms apart (b 0.30 to 0.55)
  const pin1Y = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.30) / 0.08));
    return -18 * (1 - p);
  });
  const pin1Opacity = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.30) / 0.08));
  });

  const pin2Y = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.38) / 0.08));
    return -18 * (1 - p);
  });
  const pin2Opacity = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.38) / 0.08));
  });

  const pin3Y = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.46) / 0.08));
    return -18 * (1 - p);
  });
  const pin3Opacity = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.46) / 0.08));
  });

  return (
    <motion.div
      data-scene="search-v2"
      style={{
        opacity,
        y,
        scale,
        pointerEvents: pointerEvents as any,
        visibility: visibility as any,
      }}
      className="absolute inset-0 w-[960px] h-[480px] p-4 select-none overflow-hidden"
    >
      {/* Background card container */}
      <div className="w-full h-full bg-[#112933]/90 border border-white/10 rounded-3xl p-5 shadow-2xl relative flex flex-col justify-between">
        {/* Top persistent furniture: Story chip top-left & Night clock top-right */}
        <div className="w-full flex items-center justify-between shrink-0 mb-3">
          {/* Story chip: "Before" slate #8FA3AB */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#8FA3AB]/15 border border-[#8FA3AB]/40 text-[#8FA3AB] text-[16px] font-semibold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8FA3AB]" />
            <span>Before</span>
          </div>

          {/* Night clock top-right: 8:40 pm (analogue & digital, ~100px wide) */}
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" fill="#0F2A35" stroke="#8FA3AB" strokeWidth="1.5" />
              <line x1="16" y1="4" x2="16" y2="6.5" stroke="#8FA3AB" strokeWidth="1.5" />
              <line x1="28" y1="16" x2="25.5" y2="16" stroke="#8FA3AB" strokeWidth="1.5" />
              <line x1="16" y1="28" x2="16" y2="25.5" stroke="#8FA3AB" strokeWidth="1.5" />
              <line x1="4" y1="16" x2="6.5" y2="16" stroke="#8FA3AB" strokeWidth="1.5" />
              {/* Hour hand (pointing to ~8:40) */}
              <line x1="16" y1="16" x2="9.5" y2="20" stroke="#E3B896" strokeWidth="2" strokeLinecap="round" />
              {/* Minute hand (pointing to 40 min mark) */}
              <line x1="16" y1="16" x2="7.5" y2="22.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="16" r="1.5" fill="#E3B896" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[14px] font-mono font-bold text-white leading-none">8:40 PM</span>
              <span className="text-[10px] text-white/50 tracking-wider uppercase font-medium">Evening search</span>
            </div>
          </div>
        </div>

        {/* Main Stage Grid: Left 58% (Search & Results) + Right 38% (Mini-map) */}
        <div className="w-full flex-1 min-h-0 flex items-stretch gap-5">
          {/* Left 58%: Search bar + Results Stack */}
          <div className="w-[58%] flex flex-col justify-between">
            {/* Search Bar (b 0 to 0.25) */}
            <div className="w-full bg-white rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-md shrink-0">
              <Search className="w-5 h-5 text-[#0F2A35]/60 shrink-0" />
              <div className="flex-1 font-mono text-[16px] text-[#0F2A35] font-medium flex items-center">
                <motion.span>{typedQuery}</motion.span>
                <motion.span
                  style={{ opacity: cursorVisible ? 1 : 0 }}
                  className="w-0.5 h-4 bg-[#0F2A35] ml-0.5 inline-block"
                />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#0F2A35]/5 rounded-lg text-[#0F2A35]/70">
                Google
              </span>
            </div>

            {/* Results Stack */}
            <div className="flex flex-col gap-2 mt-2 flex-1 justify-center">
              {/* Result 1: Galway Roofing Services */}
              <motion.div
                style={{ opacity: card1Opacity, y: card1Y }}
                className="w-full bg-white rounded-xl px-4 py-2 flex items-center justify-between shadow-sm border border-slate-200"
              >
                <div>
                  <h4 className="text-[22px] font-bold text-[#0F2A35] leading-snug">
                    Galway Roofing Services
                  </h4>
                  <p className="text-[16px] text-[#5E6F77] leading-tight">Standard listing</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#0F2A35] text-[16px] font-medium">
                  <Globe className="w-4 h-4 text-[#0F2A35]" />
                  <span>Website</span>
                </div>
              </motion.div>

              {/* Result 2: Corrib Slate & Tile */}
              <motion.div
                style={{ opacity: card2Opacity, y: card2Y }}
                className="w-full bg-white rounded-xl px-4 py-2 flex items-center justify-between shadow-sm border border-slate-200"
              >
                <div>
                  <h4 className="text-[22px] font-bold text-[#0F2A35] leading-snug">
                    Corrib Slate & Tile
                  </h4>
                  <p className="text-[16px] text-[#5E6F77] leading-tight">Standard listing</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#0F2A35] text-[16px] font-medium">
                  <Globe className="w-4 h-4 text-[#0F2A35]" />
                  <span>Website</span>
                </div>
              </motion.div>

              {/* Result 3: Western Roofing */}
              <motion.div
                style={{ opacity: card3Opacity, y: card3Y }}
                className="w-full bg-white rounded-xl px-4 py-2 flex items-center justify-between shadow-sm border border-slate-200"
              >
                <div>
                  <h4 className="text-[22px] font-bold text-[#0F2A35] leading-snug">
                    Western Roofing
                  </h4>
                  <p className="text-[16px] text-[#5E6F77] leading-tight">Standard listing</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#0F2A35] text-[16px] font-medium">
                  <Globe className="w-4 h-4 text-[#0F2A35]" />
                  <span>Website</span>
                </div>
              </motion.div>

              {/* 4th Card: "Your business" (Spring slide in b 0.55 to 0.80) */}
              <div className="relative mt-1">
                {/* Red popped chip above card (b 0.8 to 0.9) */}
                <motion.div
                  style={{
                    opacity: chipPopOpacity,
                    scale: chipPopScale,
                    y: chipPopY,
                  }}
                  className="absolute -top-3.5 right-6 z-30 flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#D9444A] text-white text-[16px] font-bold shadow-lg"
                >
                  <AlertCircle className="w-4 h-4 text-white" />
                  <span>Missing website link</span>
                  <div className="absolute -bottom-1 right-5 w-2 h-2 bg-[#D9444A] rotate-45" />
                </motion.div>

                {/* Breathing card */}
                <motion.div
                  style={{
                    opacity: card4Opacity,
                    y: card4Y,
                    scale: card4Scale,
                    boxShadow: '0 0 0 6px rgba(217,68,74,0.18)',
                  }}
                  className={`w-full bg-white rounded-xl px-4 py-2.5 flex items-center justify-between border-[3px] border-[#D9444A] ${
                    isActive ? 'animate-[pulse_1.6s_ease-in-out_infinite] ambient' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="text-[24px] font-bold text-[#0F2A35] leading-snug">
                        Your business
                      </h4>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[#5E6F77] text-[16px] font-medium mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-[#5E6F77]" />
                        <span>Phone only</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashed rounded box with dashed #D9444A border that draws itself */}
                  <div className="relative px-3 py-1.5 flex items-center gap-2">
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 190 38"
                      preserveAspectRatio="none"
                    >
                      <motion.rect
                        x="2"
                        y="2"
                        width="186"
                        height="34"
                        rx="8"
                        fill="none"
                        stroke="#D9444A"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        style={{ strokeDashoffset: dashOffset }}
                      />
                    </svg>
                    <AlertCircle className="w-4 h-4 text-[#B42318] shrink-0" />
                    <span className="text-[17px] font-bold text-[#B42318] whitespace-nowrap">
                      Missing website link
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right 38%: Mini-map card titled "Galway" */}
          <div className="w-[38%] bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5 text-white font-semibold text-[18px]">
                <MapPin className="w-5 h-5 text-[#E3B896]" />
                <span>Galway</span>
              </div>
              <span className="text-xs text-white/50 font-medium">Map view</span>
            </div>

            {/* Stylized street lines SVG */}
            <div className="relative flex-1 my-2 rounded-xl bg-[#0F2A35]/60 border border-white/5 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 320 200" fill="none">
                {/* River Corrib & Coastline */}
                <path
                  d="M0 60 C80 80, 140 130, 200 170 C240 195, 280 200, 320 200"
                  stroke="#163847"
                  strokeWidth="24"
                  strokeLinecap="round"
                />
                <path
                  d="M0 60 C80 80, 140 130, 200 170 C240 195, 280 200, 320 200"
                  stroke="#1B4254"
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                {/* Main Arterials */}
                <path d="M40 0 L120 200" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
                <path d="M110 0 L190 200" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
                <path d="M0 110 L320 70" stroke="rgba(255,255,255,0.14)" strokeWidth="5" />
                <path d="M20 160 L300 130" stroke="rgba(255,255,255,0.10)" strokeWidth="3" />
                <path d="M220 0 L310 180" stroke="rgba(255,255,255,0.10)" strokeWidth="3" />

                {/* Secondary street grid */}
                <path d="M60 40 L160 50" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                <path d="M140 85 L260 95" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                <path d="M50 140 L150 150" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                <path d="M190 30 L290 40" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              </svg>

              {/* 3 Peach Pins dropping 150ms apart (b 0.30 to 0.55) */}
              {/* Pin 1: Competitor 1 */}
              <motion.div
                style={{ y: pin1Y, opacity: pin1Opacity }}
                className="absolute top-[35%] left-[32%] flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-full bg-[#E3B896] shadow-lg flex items-center justify-center text-[#0F2A35] font-bold">
                  <MapPin className="w-5 h-5 fill-[#0F2A35] text-[#0F2A35]" />
                </div>
                <div className="w-2.5 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5" />
              </motion.div>

              {/* Pin 2: Competitor 2 */}
              <motion.div
                style={{ y: pin2Y, opacity: pin2Opacity }}
                className="absolute top-[22%] left-[64%] flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-full bg-[#E3B896] shadow-lg flex items-center justify-center text-[#0F2A35] font-bold">
                  <MapPin className="w-5 h-5 fill-[#0F2A35] text-[#0F2A35]" />
                </div>
                <div className="w-2.5 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5" />
              </motion.div>

              {/* Pin 3: Competitor 3 */}
              <motion.div
                style={{ y: pin3Y, opacity: pin3Opacity }}
                className="absolute top-[62%] left-[48%] flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-full bg-[#E3B896] shadow-lg flex items-center justify-center text-[#0F2A35] font-bold">
                  <MapPin className="w-5 h-5 fill-[#0F2A35] text-[#0F2A35]" />
                </div>
                <div className="w-2.5 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5" />
              </motion.div>
            </div>

            <div className="text-[12px] text-white/50 flex items-center justify-between">
              <span>Local service radius</span>
              <span className="text-[#E3B896]">3 listings mapped</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
