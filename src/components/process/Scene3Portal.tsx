// The personal portal is a promise. Keep this scene only if clients really get a portal.
import React from 'react';
import { motion, useTransform } from 'motion/react';
import { Check, Sparkles, Eye, Image as ImageIcon, Layout, ExternalLink } from 'lucide-react';
import { SceneProps, useSceneVisibility } from './types';

export default function Scene3Portal({
  scrollYProgress,
  onescene = false,
  staticMode = false,
  isActive = false,
}: SceneProps) {
  const { opacity, y, scale, pointerEvents, visibility, b } = useSceneVisibility(
    scrollYProgress,
    2,
    onescene,
    staticMode
  );

  // Vertical progress line fills from b = 0.10 to 0.80
  const lineProgress = useTransform(b, (v: number) => {
    if (staticMode) return 1;
    return Math.min(1, Math.max(0, (v - 0.10) / 0.70));
  });
  const lineHeightPercent = useTransform(lineProgress, (p: number) => `${p * 100}%`);

  // Five stages tick one by one with drawn checks
  // Stage A: Details received (b 0.10 -> 0.22)
  const stageAChecked = useTransform(b, (v: number) => (staticMode ? true : v >= 0.22));
  const stageAOffset = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.10) / 0.12));
    return 20 * (1 - p);
  });

  // Stage B: Content collected (b 0.22 -> 0.36)
  const stageBChecked = useTransform(b, (v: number) => (staticMode ? true : v >= 0.36));
  const stageBOffset = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.22) / 0.14));
    return 20 * (1 - p);
  });

  // Stage C: Design (b 0.36 -> 0.50)
  const stageCChecked = useTransform(b, (v: number) => (staticMode ? true : v >= 0.50));
  const stageCOffset = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.36) / 0.14));
    return 20 * (1 - p);
  });

  // Stage D: Your review (b 0.50 -> 0.64)
  const stageDChecked = useTransform(b, (v: number) => (staticMode ? true : v >= 0.64));
  const stageDOffset = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.50) / 0.14));
    return 20 * (1 - p);
  });

  // Stage E: Live (b 0.64 -> 0.78)
  const stageEChecked = useTransform(b, (v: number) => (staticMode ? true : v >= 0.78));
  const stageEOffset = useTransform(b, (v: number) => {
    if (staticMode) return 0;
    const p = Math.min(1, Math.max(0, (v - 0.64) / 0.14));
    return 20 * (1 - p);
  });

  // Active stage indicator (pulsing gold dot for current in-progress stage)
  const activeStageIndex = useTransform(b, (v: number) => {
    if (staticMode) return 4;
    if (v < 0.22) return 0;
    if (v < 0.36) return 1;
    if (v < 0.50) return 2;
    if (v < 0.64) return 3;
    return 4;
  });

  // Updates feed: three cards slide in at b 0.35, 0.60, 0.80
  const updateCardOneP = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.35) / 0.10))
  );
  const updateCardOneY = useTransform(updateCardOneP, (p: number) => 16 * (1 - p));
  const updateCardOneOpacity = useTransform(updateCardOneP, (p: number) => p);

  const updateCardTwoP = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.60) / 0.10))
  );
  const updateCardTwoY = useTransform(updateCardTwoP, (p: number) => 16 * (1 - p));
  const updateCardTwoOpacity = useTransform(updateCardTwoP, (p: number) => p);

  const updateCardThreeP = useTransform(b, (v: number) =>
    staticMode ? 1 : Math.min(1, Math.max(0, (v - 0.80) / 0.10))
  );
  const updateCardThreeY = useTransform(updateCardThreeP, (p: number) => 16 * (1 - p));
  const updateCardThreeOpacity = useTransform(updateCardThreeP, (p: number) => p);

  return (
    <motion.div
      data-scene="portal-v2"
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
          {/* Story chip: "Our work" peach #E3B896 */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3B896]/15 border border-[#E3B896]/40 text-[#E3B896] text-[16px] font-semibold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E3B896]" />
            <span>Our work</span>
          </div>

          <div className="text-[16px] text-white/50 font-medium">
            <span>Project tracking</span>
          </div>
        </div>

        {/* Portal Window (white card, radius 24px) */}
        <div className="w-full flex-1 min-h-0 bg-white text-[#0F2A35] rounded-[24px] shadow-2xl border border-white/40 p-5 flex flex-col justify-between relative overflow-hidden">
          {/* Header row inside portal window */}
          <div className="w-full shrink-0 flex items-center justify-between border-b border-[#0F2A35]/10 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#0F2A35]/5 border border-[#0F2A35]/15 text-[#0F2A35] text-[16px] font-semibold">
                Your personal portal
              </span>
              <h4 className="text-[22px] font-bold text-[#0F2A35] leading-none">
                Your project
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-[#E3B896]/30 border border-[#E3B896] text-[#0F2A35] text-[16px] font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E3B896]" />
                <span>In progress</span>
              </div>
              <span className="text-[16px] text-[#0F2A35]/60 font-medium">
                Illustrative
              </span>
            </div>
          </div>

          {/* Main 2-column body */}
          <div className="w-full flex-1 min-h-0 grid grid-cols-12 gap-5 items-stretch">
            {/* Left half: Stage list with progress line and 5 rows */}
            <div className="col-span-6 bg-[#0F2A35]/[0.02] border border-[#0F2A35]/10 rounded-2xl p-4 flex flex-col justify-between relative">
              <span className="text-[16px] font-semibold text-[#0F2A35]/80 uppercase tracking-wider block mb-1">
                Project stages
              </span>

              {/* Five rows container */}
              <div className="flex-1 min-h-0 relative flex flex-col justify-between py-1">
                {/* Background vertical track */}
                <div
                  className="absolute left-4 w-0.5 bg-[#0F2A35]/15 rounded-full"
                  style={{ insetBlockStart: 12, insetBlockEnd: 12 }}
                />
                {/* Active filling progress bar */}
                <motion.div
                  className="absolute left-4 w-0.5 bg-[#2E9E6B] rounded-full origin-[50%_0%]"
                  style={{
                    insetBlockStart: 12,
                    height: lineHeightPercent,
                    maxHeight: 'calc(100% - 24px)',
                  }}
                />

                {/* Stage Row A: Details received */}
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 bg-white"
                    style={{
                      borderColor: useTransform(stageAChecked, (c) => (c ? '#2E9E6B' : 'rgba(15,42,53,0.2)')),
                      backgroundColor: useTransform(stageAChecked, (c) => (c ? '#2E9E6B' : '#ffffff')),
                    }}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path d="M5 13l4 4L19 7" strokeDasharray="20" style={{ strokeDashoffset: stageAOffset }} />
                    </svg>
                  </motion.div>
                  <span className="text-[16px] font-semibold text-[#0F2A35]">
                    Details received
                  </span>
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full bg-[#E3B896] ambient animate-pulse motion-reduce:animate-none ml-auto"
                    style={{
                      display: useTransform(activeStageIndex, (idx) => (idx === 0 ? 'inline-block' : 'none')),
                    }}
                  />
                </div>

                {/* Stage Row B: Content collected */}
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 bg-white"
                    style={{
                      borderColor: useTransform(stageBChecked, (c) => (c ? '#2E9E6B' : 'rgba(15,42,53,0.2)')),
                      backgroundColor: useTransform(stageBChecked, (c) => (c ? '#2E9E6B' : '#ffffff')),
                    }}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path d="M5 13l4 4L19 7" strokeDasharray="20" style={{ strokeDashoffset: stageBOffset }} />
                    </svg>
                  </motion.div>
                  <span className="text-[16px] font-semibold text-[#0F2A35]">
                    Content collected
                  </span>
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full bg-[#E3B896] ambient animate-pulse motion-reduce:animate-none ml-auto"
                    style={{
                      display: useTransform(activeStageIndex, (idx) => (idx === 1 ? 'inline-block' : 'none')),
                    }}
                  />
                </div>

                {/* Stage Row C: Design */}
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 bg-white"
                    style={{
                      borderColor: useTransform(stageCChecked, (c) => (c ? '#2E9E6B' : 'rgba(15,42,53,0.2)')),
                      backgroundColor: useTransform(stageCChecked, (c) => (c ? '#2E9E6B' : '#ffffff')),
                    }}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path d="M5 13l4 4L19 7" strokeDasharray="20" style={{ strokeDashoffset: stageCOffset }} />
                    </svg>
                  </motion.div>
                  <span className="text-[16px] font-semibold text-[#0F2A35]">
                    Design
                  </span>
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full bg-[#E3B896] ambient animate-pulse motion-reduce:animate-none ml-auto"
                    style={{
                      display: useTransform(activeStageIndex, (idx) => (idx === 2 ? 'inline-block' : 'none')),
                    }}
                  />
                </div>

                {/* Stage Row D: Your review */}
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 bg-white"
                    style={{
                      borderColor: useTransform(stageDChecked, (c) => (c ? '#2E9E6B' : 'rgba(15,42,53,0.2)')),
                      backgroundColor: useTransform(stageDChecked, (c) => (c ? '#2E9E6B' : '#ffffff')),
                    }}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path d="M5 13l4 4L19 7" strokeDasharray="20" style={{ strokeDashoffset: stageDOffset }} />
                    </svg>
                  </motion.div>
                  <span className="text-[16px] font-semibold text-[#0F2A35]">
                    Your review
                  </span>
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full bg-[#E3B896] ambient animate-pulse motion-reduce:animate-none ml-auto"
                    style={{
                      display: useTransform(activeStageIndex, (idx) => (idx === 3 ? 'inline-block' : 'none')),
                    }}
                  />
                </div>

                {/* Stage Row E: Live */}
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 bg-white"
                    style={{
                      borderColor: useTransform(stageEChecked, (c) => (c ? '#2E9E6B' : 'rgba(15,42,53,0.2)')),
                      backgroundColor: useTransform(stageEChecked, (c) => (c ? '#2E9E6B' : '#ffffff')),
                    }}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path d="M5 13l4 4L19 7" strokeDasharray="20" style={{ strokeDashoffset: stageEOffset }} />
                    </svg>
                  </motion.div>
                  <span className="text-[16px] font-semibold text-[#0F2A35]">
                    Live
                  </span>
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full bg-[#E3B896] ambient animate-pulse motion-reduce:animate-none ml-auto"
                    style={{
                      display: useTransform(activeStageIndex, (idx) => (idx === 4 && !stageEChecked.get() ? 'inline-block' : 'none')),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right half: Updates feed with three cards */}
            <div className="col-span-6 flex flex-col justify-between">
              <span className="text-[16px] font-semibold text-[#0F2A35]/80 uppercase tracking-wider block mb-1">
                Updates
              </span>

              <div className="flex-1 min-h-0 flex flex-col justify-between gap-2.5">
                {/* Card A: Photos received */}
                <motion.div
                  style={{ y: updateCardOneY, opacity: updateCardOneOpacity }}
                  className="bg-[#0F2A35]/[0.03] border border-[#0F2A35]/15 rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#2E9E6B]/15 text-[#2E9E6B] flex items-center justify-center shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[16px] font-semibold text-[#0F2A35]">
                        Photos received
                      </h5>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E9E6B]" />
                </motion.div>

                {/* Card B: Homepage concept ready with chip "Your turn" */}
                <motion.div
                  style={{ y: updateCardTwoY, opacity: updateCardTwoOpacity }}
                  className="bg-[#E3B896]/15 border border-[#E3B896]/60 rounded-xl p-3 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#E3B896]/30 text-[#0F2A35] flex items-center justify-center shrink-0">
                      <Layout className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[16px] font-semibold text-[#0F2A35]">
                        Homepage concept ready
                      </h5>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E3B896] text-[#0F2A35] text-[16px] font-bold shadow-sm">
                    Your turn
                  </span>
                </motion.div>

                {/* Card C: Your website is live with green chip "Live" */}
                <motion.div
                  style={{ y: updateCardThreeY, opacity: updateCardThreeOpacity }}
                  className="bg-[#2E9E6B]/10 border border-[#2E9E6B]/40 rounded-xl p-3 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#2E9E6B] text-white flex items-center justify-center shrink-0">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[16px] font-semibold text-[#0F2A35]">
                        Your website is live
                      </h5>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#2E9E6B] text-white text-[16px] font-bold shadow-sm">
                    Live
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
