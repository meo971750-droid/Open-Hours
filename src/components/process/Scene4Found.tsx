import React from 'react';
import { motion, useTransform } from 'motion/react';
import { Search, Globe, Clock, Check, Building2, MapPin } from 'lucide-react';
import { SceneProps, useSceneVisibility } from './types';
import { SAMPLE_ORDER } from '../../content';

export default function Scene4Found({
  scrollYProgress,
  onescene = false,
  staticMode = false,
  isActive = false,
}: SceneProps) {
  const { opacity, y, scale, pointerEvents, visibility, b } = useSceneVisibility(
    scrollYProgress,
    3,
    onescene,
    staticMode
  );

  // Teal "Website" chip appears over b = 0 to 0.20
  const websiteChipOpacity = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, v / 0.20));
  });

  // Border color transitions from red #D9444A to peach #E3B896 over b = 0 to 0.20
  // After b = 0.20, absolutely no red remains in this scene
  const businessBorderColor = useTransform(b, (v: number) => {
    if (staticMode) return '#E3B896';
    if (v >= 0.20) return '#E3B896';
    const progress = Math.min(1, Math.max(0, v / 0.20));
    // Interpolate RGB from #D9444A (217, 68, 74) to #E3B896 (227, 184, 150)
    const redVal = Math.round(217 + (227 - 217) * progress);
    const greenVal = Math.round(68 + (184 - 68) * progress);
    const blueVal = Math.round(74 + (150 - 74) * progress);
    return `rgb(${redVal}, ${greenVal}, ${blueVal})`;
  });

  // Row climbing step distance (row height + margin)
  const ROW_DISTANCE = 56;

  // Climbing over b 0.20 to 0.80 in three smooth steps with short pauses
  // Step A: passes Western Roofing (b 0.22 -> 0.38, pause 0.38 -> 0.42)
  const climbStepAP = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.22) / 0.16));
  });

  // Step B: passes Corrib Slate & Tile (b 0.42 -> 0.58, pause 0.58 -> 0.62)
  const climbStepBP = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.42) / 0.16));
  });

  // Step C: passes Galway Roofing Services (b 0.62 -> 0.78, pause 0.78 -> 1.0)
  const climbStepCP = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.62) / 0.16));
  });

  // Translate Y for "Your business" (starts at bottom row, index 3, y = 168)
  const yourBusinessY = useTransform(
    [climbStepAP, climbStepBP, climbStepCP],
    ([pA, pB, pC]: number[]) => {
      const stepOffset = (pA + pB + pC) * ROW_DISTANCE;
      return 168 - stepOffset;
    }
  );

  // Translate Y for competitor Western Roofing
  const westernRoofingY = useTransform(climbStepAP, (p: number) => 112 + p * ROW_DISTANCE);

  // Translate Y for competitor Corrib Slate & Tile
  const corribRoofingY = useTransform(climbStepBP, (p: number) => 56 + p * ROW_DISTANCE);

  // Translate Y for competitor Galway Roofing Services
  const galwayRoofingY = useTransform(climbStepCP, (p: number) => 0 + p * ROW_DISTANCE);

  // Pulse peach ring after the last step (b >= 0.78)
  const pulseRingShadow = useTransform(b, (v: number) => {
    if (staticMode) return '0 0 0 3px rgba(227,184,150,0.7)';
    if (v < 0.78) return '0 0 0 1px rgba(227,184,150,0.4)';
    const pulseP = Math.min(1, (v - 0.78) / 0.15);
    const ringSpread = 1 + pulseP * 3;
    const ringAlpha = 0.4 + pulseP * 0.4;
    return `0 0 0 ${ringSpread}px rgba(227,184,150,${ringAlpha})`;
  });

  // "Over time" progress bar fills in sync with b (0.20 to 0.78)
  const overTimeProgress = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.20) / 0.58));
  });
  const overTimeWidthPercent = useTransform(overTimeProgress, (p: number) => `${p * 100}%`);
  const clockTranslateX = useTransform(overTimeProgress, (p: number) => `${p * 100}%`);

  // Right card: checklist rows tick one after another
  const tickHours = useTransform(b, (v: number) => (staticMode ? true : v >= 0.25));
  const tickServices = useTransform(b, (v: number) => (staticMode ? true : v >= 0.45));
  const tickPhotos = useTransform(b, (v: number) => (staticMode ? true : v >= 0.65));
  const tickWebsite = useTransform(b, (v: number) => (staticMode ? true : v >= 0.80));

  return (
    <motion.div
      data-scene="found-v2"
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
        <div className="w-full flex items-center justify-between shrink-0 mb-2">
          {/* Story chip: "After" green #2E9E6B */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E9E6B]/15 border border-[#2E9E6B]/40 text-[#2E9E6B] text-[16px] font-semibold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E9E6B]" />
            <span>After</span>
          </div>

          <div className="text-[16px] text-white/50 font-medium">
            <span>Customer search view</span>
          </div>
        </div>

        {/* 2-Column Layout: Left (Search Window & Over time bar) | Right (Google Profile Card) */}
        <div className="w-full flex-1 min-h-0 grid grid-cols-12 gap-5 items-stretch">
          {/* Left: Search Window (col-span-7) */}
          <div className="col-span-7 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Search Bar with query */}
            <div className="w-full bg-white rounded-full px-4 py-2.5 flex items-center gap-2.5 shadow-md mb-3 shrink-0">
              <Search className="w-5 h-5 text-[#0F2A35]/60 shrink-0" />
              <span className="text-[16px] font-medium text-[#0F2A35]">
                roofers in Galway
              </span>
            </div>

            {/* Four rows stack (height: 228px) */}
            <div className="w-full flex-1 relative min-h-[228px] overflow-hidden">
              {/* Row: Galway Roofing Services (starts at y = 0) */}
              <motion.div
                style={{ y: galwayRoofingY }}
                className="absolute inset-x-0 h-[50px] bg-white rounded-xl px-3.5 flex items-center justify-between shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0F2A35]/5 text-[#0F2A35] flex items-center justify-center font-bold text-[16px]">
                    G
                  </div>
                  <div>
                    <h5 className="text-[16px] font-bold text-[#0F2A35] leading-none">
                      Galway Roofing Services
                    </h5>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[16px] text-slate-500 font-medium">Galway</span>
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
              </motion.div>

              {/* Row: Corrib Slate & Tile (starts at y = 56) */}
              <motion.div
                style={{ y: corribRoofingY }}
                className="absolute inset-x-0 h-[50px] bg-white rounded-xl px-3.5 flex items-center justify-between shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0F2A35]/5 text-[#0F2A35] flex items-center justify-center font-bold text-[16px]">
                    C
                  </div>
                  <div>
                    <h5 className="text-[16px] font-bold text-[#0F2A35] leading-none">
                      Corrib Slate & Tile
                    </h5>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[16px] text-slate-500 font-medium">Galway</span>
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
              </motion.div>

              {/* Row: Western Roofing (starts at y = 112) */}
              <motion.div
                style={{ y: westernRoofingY }}
                className="absolute inset-x-0 h-[50px] bg-white rounded-xl px-3.5 flex items-center justify-between shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0F2A35]/5 text-[#0F2A35] flex items-center justify-center font-bold text-[16px]">
                    W
                  </div>
                  <div>
                    <h5 className="text-[16px] font-bold text-[#0F2A35] leading-none">
                      Western Roofing
                    </h5>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[16px] text-slate-500 font-medium">Galway</span>
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
              </motion.div>

              {/* Row: Your business (starts at y = 168) */}
              <motion.div
                style={{
                  y: yourBusinessY,
                  borderColor: businessBorderColor,
                  boxShadow: pulseRingShadow,
                }}
                className="absolute inset-x-0 h-[50px] bg-white rounded-xl px-3.5 flex items-center justify-between shadow-md border-2 z-20"
              >
                <div className="flex items-center gap-3">
                  {/* Website thumbnail */}
                  <div className="w-8 h-8 rounded-lg bg-[#0F2A35] text-[#E3B896] flex items-center justify-center font-bold text-[16px] shrink-0 overflow-hidden shadow-inner">
                    <span className="scale-75 origin-center font-black">A</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-[16px] font-bold text-[#0F2A35] leading-none">
                      {SAMPLE_ORDER.business}
                    </h5>
                    <span className="px-2 py-0.5 rounded-full bg-[#E3B896]/30 text-[#0F2A35] text-[16px] font-medium">
                      Your business
                    </span>
                  </div>
                </div>

                {/* Teal Website chip appearing over b = 0 to 0.20 */}
                <motion.div
                  style={{ opacity: websiteChipOpacity }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D9488]/15 border border-[#0D9488]/40 text-[#0D9488]"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-[16px] font-bold">Website</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Over time bar */}
            <div className="w-full shrink-0 pt-2 border-t border-white/10 mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[16px] font-semibold text-white/80">
                  Over time
                </span>
                <span className="text-[16px] text-white/50">
                  Steady climbing
                </span>
              </div>
              <div className="h-[6px] w-full rounded-full bg-white/15 relative overflow-visible flex items-center">
                <motion.div
                  className="h-full rounded-full bg-[#E3B896]"
                  style={{ width: overTimeWidthPercent }}
                />
                <motion.div
                  className="absolute pointer-events-none -ml-2 text-[#E3B896]"
                  style={{ left: clockTranslateX }}
                >
                  <Clock className="w-4 h-4 drop-shadow" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right: Google Profile Card (col-span-5) */}
          <div className="col-span-5 flex flex-col justify-between">
            <div className="w-full flex-1 bg-white rounded-2xl p-5 shadow-xl border border-white/30 flex flex-col justify-between">
              {/* Profile Card Header */}
              <div className="border-b border-[#0F2A35]/10 pb-3">
                <span className="text-[16px] font-semibold text-[#0F2A35]/60 uppercase tracking-wider block mb-1">
                  Business profile
                </span>
                <h4 className="text-[22px] font-bold text-[#0F2A35] leading-snug">
                  {SAMPLE_ORDER.business}
                </h4>
                <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-[16px]">{SAMPLE_ORDER.trade} in {SAMPLE_ORDER.town}</span>
                </div>
              </div>

              {/* Four profile checklist rows */}
              <div className="flex flex-col gap-2.5 py-2">
                {/* Checklist item: Opening hours */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0F2A35]/[0.02]">
                  <span className="text-[16px] font-semibold text-[#0F2A35]">
                    Opening hours
                  </span>
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: useTransform(tickHours, (t) => (t ? '#2E9E6B' : 'rgba(15,42,53,0.1)')),
                      color: '#ffffff',
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                </div>

                {/* Checklist item: Services */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0F2A35]/[0.02]">
                  <span className="text-[16px] font-semibold text-[#0F2A35]">
                    Services
                  </span>
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: useTransform(tickServices, (t) => (t ? '#2E9E6B' : 'rgba(15,42,53,0.1)')),
                      color: '#ffffff',
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                </div>

                {/* Checklist item: Photos */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0F2A35]/[0.02]">
                  <span className="text-[16px] font-semibold text-[#0F2A35]">
                    Photos
                  </span>
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: useTransform(tickPhotos, (t) => (t ? '#2E9E6B' : 'rgba(15,42,53,0.1)')),
                      color: '#ffffff',
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                </div>

                {/* Checklist item: Website link */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0F2A35]/[0.02]">
                  <span className="text-[16px] font-semibold text-[#0F2A35]">
                    Website link
                  </span>
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: useTransform(tickWebsite, (t) => (t ? '#2E9E6B' : 'rgba(15,42,53,0.1)')),
                      color: '#ffffff',
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>

              {/* Status pill inside profile card */}
              <div className="pt-2 border-t border-[#0F2A35]/10 flex items-center justify-between">
                <span className="text-[16px] text-[#0F2A35]/70 font-medium">Profile status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#2E9E6B]/15 text-[#2E9E6B] text-[16px] font-semibold">
                  Complete
                </span>
              </div>
            </div>

            {/* Persistent footnote: 16px text */}
            <div className="text-[16px] text-white/60 font-normal mt-3 shrink-0">
              Illustrative. Search results vary and take time to build.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
