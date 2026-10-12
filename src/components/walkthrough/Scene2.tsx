import React from 'react';
import { Check, Home, Key, ShieldCheck } from 'lucide-react';
import { SAMPLE_ORDER, FIRST_PAGE } from '../../content';

export interface Scene2Props {
  // progress: 0 to 1 across Scene 2 duration (4.8s)
  progress: number;
}

export default function Scene2({ progress }: Scene2Props) {
  // Timeline breakdown (duration = 4.8s):
  // 0.0 - 0.3s (progress 0.000 -> 0.063): Scene intro
  // Checklist drawn checks:
  //   - "Business details" at 0.3s
  //   - "Trade and area" at 0.7s
  //   - "Photos and details" at 1.1s
  // At 1.4s: status chip changes to "Verified" (green #2E9E6B with small pop)
  // Right side clock face:
  //   1.5 - 3.0s: hand sweeps quickly, thin ring fills with stroke-dashoffset.
  //   Above clock: "within {FIRST_PAGE.readyHours} hours" (20px, weight 600)
  //   Under clock: "once we have your details" (14px, white at 75%)
  // 3.0 - 3.6s: finished mini website assembles block by block, 90ms apart:
  //   - nav bar with SAMPLE_ORDER.business (3.00s)
  //   - headline "Roofing you can rely on" (3.09s)
  //   - "Call now" button (3.18s)
  //   - three gallery tiles (soft gradients, no photos) (3.27s)
  // 3.6 - 4.1s: site slides right toward house/owner icon tile; key icon appears;
  //   two small ticks:
  //   - "Your domain, in your name" (3.60s)
  //   - "Hosting included for {FIRST_PAGE.hostingMonths} months" (3.85s)
  //   Chip "Handed over" pops in at 4.1s
  // 4.1 - 4.8s: hold

  const curSec = progress * 4.8;

  // Checklist checks
  const check1 = curSec >= 0.3;
  const check2 = curSec >= 0.7;
  const check3 = curSec >= 1.1;

  // Chip status
  const isVerified = curSec >= 1.4;
  const chipPop = curSec >= 1.4 && curSec <= 1.6 ? 1.12 : 1.0;

  // Clock sweep (1.5s - 3.0s)
  const clockProgress = Math.min(1, Math.max(0, (curSec - 1.5) / 1.5));
  // Hand sweeps 2 full rotations (720 deg)
  const handAngle = clockProgress * 720;
  // Ring circumference for r=42 is 2 * PI * 42 = 263.89
  const ringCircumference = 263.89;
  const ringDashoffset = (1 - clockProgress) * ringCircumference;

  // Site assembly blocks (3.0s - 3.6s)
  const block1Nav = curSec >= 3.00;
  const block2Headline = curSec >= 3.09;
  const block3Cta = curSec >= 3.18;
  const block4Gallery = curSec >= 3.27;

  // Site slide right (3.6s - 4.1s)
  const siteSlideProgress = Math.min(1, Math.max(0, (curSec - 3.6) / 0.5));
  const siteX = siteSlideProgress * 22; // slides slightly right

  // Key icon appears (3.6s)
  const showKey = curSec >= 3.6;

  // Handover small ticks:
  const handoverTick1 = curSec >= 3.60;
  const handoverTick2 = curSec >= 3.85;

  // Handed over chip (4.1s)
  const showHandedOver = curSec >= 4.1;
  const handedOverScale = curSec >= 4.1 && curSec <= 4.25 ? 1.15 : 1.0;

  return (
    <div className="relative w-[560px] h-[420px] overflow-hidden select-none flex items-center justify-between px-5">
      {/* LEFT: Dashboard Card (approx 52% width -> 270px) */}
      <div
        className="w-[270px] h-[340px] rounded-[20px] bg-white border border-[#0F2A35]/12 shadow-2xl p-4 flex flex-col justify-between z-10"
        style={{ transform: 'translateZ(0)' }}
      >
        <div>
          {/* Header row: Request row */}
          <div className="flex items-center justify-between pb-3 border-b border-[#0F2A35]/10 mb-3">
            <div className="flex items-center gap-2.5">
              {/* Round initial tile */}
              <div className="w-8 h-8 rounded-full bg-[#1E4A5C] text-white flex items-center justify-center font-bold text-[13px] shadow-xs">
                {SAMPLE_ORDER.business.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-[13px] font-bold text-[#0F2A35] leading-tight truncate max-w-[125px]">
                  {SAMPLE_ORDER.business}
                </div>
                <div className="text-[11px] text-[#5E6F77]">
                  {SAMPLE_ORDER.town} · {SAMPLE_ORDER.trade}
                </div>
              </div>
            </div>

            {/* Status chip: "New" or "Verified" */}
            <div
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all duration-200 ${
                isVerified
                  ? 'bg-[#2E9E6B]/15 text-[#2E9E6B]'
                  : 'bg-[#E3B896]/30 text-[#0F2A35]'
              }`}
              style={{ transform: `scale(${chipPop})` }}
            >
              {isVerified ? 'Verified' : 'New'}
            </div>
          </div>

          {/* Checklist of three items */}
          <div className="space-y-2.5 mt-2">
            {/* Item 1 */}
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F4F6F8] border border-[#0F2A35]/05">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  check1 ? 'bg-[#2E9E6B] text-white' : 'bg-white border border-[#0F2A35]/20 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <span className="text-[12.5px] font-semibold text-[#0F2A35]">
                Business details
              </span>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F4F6F8] border border-[#0F2A35]/05">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  check2 ? 'bg-[#2E9E6B] text-white' : 'bg-white border border-[#0F2A35]/20 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <span className="text-[12.5px] font-semibold text-[#0F2A35]">
                Trade and area
              </span>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F4F6F8] border border-[#0F2A35]/05">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  check3 ? 'bg-[#2E9E6B] text-white' : 'bg-white border border-[#0F2A35]/20 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <span className="text-[12.5px] font-semibold text-[#0F2A35]">
                Photos and details
              </span>
            </div>
          </div>
        </div>

        {/* Bottom verification badge */}
        <div className="pt-2 border-t border-[#0F2A35]/08 flex items-center justify-between text-[11px] text-[#5E6F77]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E4A5C]" />
            Details checked
          </span>
          <span className="font-semibold text-[#2E9E6B]">
            {isVerified ? 'Confirmed' : 'Checking'}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Clock Face (1.5-3.0s) OR Assembled Website & Handover (3.0s-4.8s) */}
      <div className="w-[235px] h-[340px] flex flex-col items-center justify-center relative">
        {curSec < 3.0 ? (
          /* Clock Face Phase (1.5 - 3.0s) */
          <div className="flex flex-col items-center text-center">
            {/* Text above clock */}
            <div className="text-[20px] font-semibold text-white tracking-tight mb-1">
              within {FIRST_PAGE.readyHours} hours
            </div>
            <div className="text-[14px] text-white/75 font-normal mb-4">
              once we have your details
            </div>

            {/* Clock Face (110px) */}
            <div className="relative w-[110px] h-[110px] rounded-full bg-[#0F2A35]/80 border-2 border-white/20 shadow-2xl flex items-center justify-center">
              {/* Thin filling SVG ring */}
              <svg className="absolute inset-0 w-[110px] h-[110px] -rotate-90">
                <circle
                  cx="55"
                  cy="55"
                  r="42"
                  fill="none"
                  stroke="#E3B896"
                  strokeWidth="3.5"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              {/* Hour & Minute ticks */}
              <div className="w-2 h-2 rounded-full bg-[#E3B896] z-10" />

              {/* Clock Hand */}
              <div
                className="absolute top-1/2 left-1/2 w-[3px] h-[36px] bg-[#E3B896] rounded-full origin-bottom -translate-x-1/2 -translate-y-full"
                style={{
                  transform: `translate(-50%, -100%) rotate(${handAngle}deg)`,
                }}
              />
            </div>
          </div>
        ) : (
          /* Assembled Mini Website & Handover (3.0 - 4.8s) */
          <div
            className="w-full flex flex-col justify-between h-full py-1"
            style={{ transform: `translateX(${siteX}px)` }}
          >
            {/* Mini Website Browser Frame */}
            <div className="w-[220px] rounded-[14px] bg-white border border-[#0F2A35]/15 shadow-2xl overflow-hidden text-left">
              {/* Browser bar */}
              <div className="h-[22px] bg-[#EEF3F4] border-b border-[#0F2A35]/10 px-2 flex items-center justify-between">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                </div>
                <span className="text-[9px] font-mono text-[#5E6F77]">
                  atlanticslate.ie
                </span>
              </div>

              {/* Page body */}
              <div className="p-2.5 bg-[#FAF7F2] space-y-2">
                {/* Block 1: Nav Bar */}
                {block1Nav && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#0F2A35]/08">
                    <span className="text-[11px] font-bold text-[#0F2A35] truncate max-w-[130px]">
                      {SAMPLE_ORDER.business}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#2E9E6B]" />
                  </div>
                )}

                {/* Block 2: Headline */}
                {block2Headline && (
                  <div>
                    <div className="text-[12px] font-bold text-[#0F2A35] leading-snug">
                      Roofing you can rely on
                    </div>
                    <div className="text-[10px] text-[#5E6F77]">
                      Galway &amp; surrounds
                    </div>
                  </div>
                )}

                {/* Block 3: Call now button */}
                {block3Cta && (
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[#1E4A5C] text-white text-[10px] font-bold shadow-xs">
                    Call now
                  </div>
                )}

                {/* Block 4: Three Gallery tiles (soft gradients) */}
                {block4Gallery && (
                  <div className="grid grid-cols-3 gap-1 pt-1">
                    <div className="h-[26px] rounded bg-gradient-to-br from-[#DCE9EC] to-[#B8D5DB]" />
                    <div className="h-[26px] rounded bg-gradient-to-br from-[#E3B896]/30 to-[#E3B896]/60" />
                    <div className="h-[26px] rounded bg-gradient-to-br from-[#FAF7F2] to-[#DCE9EC]" />
                  </div>
                )}
              </div>
            </div>

            {/* Handover Details */}
            <div className="w-[220px] space-y-1.5 mt-2 text-left">
              {/* Handover Icon & Key */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5 text-white text-[12px] font-semibold">
                  <div className="w-6 h-6 rounded-md bg-[#1E4A5C] flex items-center justify-center text-white">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <span>Owner handover</span>
                </div>
                {showKey && (
                  <div className="w-6 h-6 rounded-full bg-[#E3B896] text-[#0F2A35] flex items-center justify-center shadow-md animate-bounce">
                    <Key className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Tick 1: Your domain, in your name */}
              {handoverTick1 && (
                <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#2E9E6B] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                  <span>Your domain, in your name</span>
                </div>
              )}

              {/* Tick 2: Hosting included for {FIRST_PAGE.hostingMonths} months */}
              {handoverTick2 && (
                <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#2E9E6B] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                  <span>Hosting included for {FIRST_PAGE.hostingMonths} months</span>
                </div>
              )}

              {/* Handed over chip */}
              {showHandedOver && (
                <div className="pt-1">
                  <span
                    className="inline-block px-3 py-1 rounded-full bg-[#2E9E6B] text-white text-[11px] font-bold shadow-md transition-transform"
                    style={{ transform: `scale(${handedOverScale})` }}
                  >
                    Handed over
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
