import React from 'react';
import { Mail, Bell } from 'lucide-react';
import { SAMPLE_ORDER } from '../../content';
import { LogoMark } from '../Logo';

export interface Scene1Props {
  // progress: 0 to 1 across Scene 1 duration (4.2s)
  progress: number;
}

export default function Scene1({ progress }: Scene1Props) {
  // Timeline breakdown (duration = 4.2s):
  // 0.0 - 0.3s (progress 0.000 -> 0.071): both appear
  // 0.3 - 0.9s (progress 0.071 -> 0.214): cursor glides to "Talk to Us"; ripple at 0.9s
  // 1.0 - 1.3s (progress 0.238 -> 0.310): form card slides up over browser
  // 1.3 - 2.2s (progress 0.310 -> 0.524): three fields typing in sequence: Business, Trade, Town
  // 2.3s (progress ~0.548): button "Send my request" pressed (scale 0.96, drawn check)
  // 2.4 - 3.1s (progress 0.571 -> 0.738): gold envelope flies along dashed curved path to dashboard bell
  // 3.1s (progress >= 0.738): dashboard brightens to 100%, bell rings (+-14deg), peach dot, toast slides down
  // 3.4 - 4.2s (progress 0.810 -> 1.000): hold

  const curSec = progress * 4.2;

  // Intro fade/scale
  const introOpacity = Math.min(1, curSec / 0.3);

  // Cursor position (moving from ~ (180, 260) to Talk to Us button ~ (145, 195))
  const cursorActive = curSec >= 0.3 && curSec <= 1.0;
  const cursorProgress = Math.min(1, Math.max(0, (curSec - 0.3) / 0.6));
  // Ease in-out
  const cursorEase = cursorProgress * cursorProgress * (3 - 2 * cursorProgress);
  const cursorX = 220 - cursorEase * 80; // from 220 to 140
  const cursorY = 250 - cursorEase * 55; // from 250 to 195
  const isClicking = curSec >= 0.85 && curSec <= 0.98;

  // Form slide up
  const formProgress = Math.min(1, Math.max(0, (curSec - 1.0) / 0.3));
  const formVisible = curSec >= 1.0;
  const formY = (1 - formProgress) * 70; // slides up from +70px
  const formOpacity = formProgress;

  // Field typing:
  // "Business name" = Atlantic Slate Roofing (22 chars) -> from 1.30s
  // "Trade" = Roofer (6 chars) -> from 1.60s
  // "Town" = Galway (6 chars) -> from 1.90s
  const businessFull = SAMPLE_ORDER.business;
  const tradeFull = SAMPLE_ORDER.trade;
  const townFull = SAMPLE_ORDER.town;

  const bChars = Math.min(
    businessFull.length,
    Math.max(0, Math.floor((curSec - 1.3) / 0.022))
  );
  const businessTyped = curSec >= 1.3 ? businessFull.slice(0, bChars) : '';

  const trChars = Math.min(
    tradeFull.length,
    Math.max(0, Math.floor((curSec - 1.6) / 0.022))
  );
  const tradeTyped = curSec >= 1.6 ? tradeFull.slice(0, trChars) : '';

  const twChars = Math.min(
    townFull.length,
    Math.max(0, Math.floor((curSec - 1.9) / 0.022))
  );
  const townTyped = curSec >= 1.9 ? townFull.slice(0, twChars) : '';

  // Button pressed at 2.3s
  const isButtonPressed = curSec >= 2.3;
  const buttonScale = curSec >= 2.3 && curSec < 2.45 ? 0.95 : 1;

  // Envelope flight (2.4s to 3.1s)
  const flyActive = curSec >= 2.4 && curSec < 3.15;
  const flyProgress = Math.min(1, Math.max(0, (curSec - 2.4) / 0.7));
  // Quadratic bezier path from (180, 275) through (280, 100) to bell at (485, 95)
  // P0 = (180, 275), P1 = (300, 70), P2 = (485, 95)
  const t = flyProgress;
  const p0x = 180, p0y = 275;
  const p1x = 310, p1y = 70;
  const p2x = 482, p2y = 95;
  const envX = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x;
  const envY = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y;
  const envScale = 1.1 - t * 0.45; // shrinks slightly
  const envRotate = (t - 0.5) * 28; // rotates slightly
  const envOpacity = curSec < 2.4 ? 0 : curSec > 3.1 ? 0 : 1;

  // Dashed curve path progress
  const dashTotalLength = 380;
  const dashOffset = (1 - flyProgress) * dashTotalLength;

  // Right dashboard state (brightens at 3.1s)
  const isDashboardBright = curSec >= 3.1;
  const dashOpacity = isDashboardBright ? 1 : 0.55;

  // Bell oscillation: 3.1 to 3.6 (500ms) -> 3 oscillations of +-14deg
  let bellAngle = 0;
  if (curSec >= 3.1 && curSec <= 3.65) {
    const bellProgress = (curSec - 3.1) / 0.5;
    bellAngle = Math.sin(bellProgress * Math.PI * 6) * 14 * (1 - bellProgress * 0.7);
  }

  // Toast slides down inside dashboard at 3.1s
  const toastProgress = Math.min(1, Math.max(0, (curSec - 3.1) / 0.3));
  const toastY = (1 - toastProgress) * -16;
  const toastOpacity = toastProgress;

  return (
    <div
      className="relative w-[560px] h-[420px] overflow-hidden select-none"
      style={{ opacity: introOpacity }}
    >
      {/* SVG Path Layer for dashed trail & envelope */}
      <svg
        className="absolute inset-0 w-[560px] h-[420px] pointer-events-none z-30"
        viewBox="0 0 560 420"
      >
        {curSec >= 2.4 && (
          <path
            d={`M ${p0x} ${p0y} Q ${p1x} ${p1y} ${p2x} ${p2y}`}
            fill="none"
            stroke="#E3B896"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            strokeDashoffset={dashOffset}
            opacity={curSec >= 3.2 ? Math.max(0, 1 - (curSec - 3.2) / 0.3) : 0.9}
          />
        )}
      </svg>

      {/* LEFT: Mini Browser Window (approx 55% width -> 300px) */}
      <div
        className="absolute left-[20px] top-[36px] w-[300px] h-[330px] rounded-[16px] bg-[#FAF7F2] border border-white/20 shadow-2xl overflow-hidden z-10 flex flex-col"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Browser Top Bar */}
        <div className="h-[32px] bg-[#EEF3F4] border-b border-[#0F2A35]/10 px-3 flex items-center gap-2 shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F2A35]/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F2A35]/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F2A35]/20" />
          </div>
          <div className="flex-1 bg-white px-2.5 py-0.5 rounded-md text-[11px] text-[#5E6F77] font-mono truncate text-center border border-[#0F2A35]/06">
            openhoursstudio.digital
          </div>
        </div>

        {/* Tiny Open Hours Page Content */}
        <div className="p-4 flex-1 flex flex-col justify-between bg-white relative">
          <div>
            {/* Wordmark logo */}
            <div className="flex items-center gap-1.5 mb-3">
              <LogoMark size={20} />
              <span className="text-[14px] font-bold text-[#0F2A35] tracking-tight">
                Open Hours
              </span>
            </div>

            {/* Two grey bars for headline */}
            <div className="space-y-1.5 mb-4">
              <div className="w-[190px] h-[10px] rounded-full bg-[#0F2A35]/15" />
              <div className="w-[130px] h-[10px] rounded-full bg-[#0F2A35]/10" />
            </div>

            {/* Dark button labelled "Talk to Us" (14px) */}
            <div className="mt-2">
              <div
                className={`inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#0F2A35] text-white text-[14px] font-semibold shadow-xs transition-transform ${
                  isClicking ? 'scale-95' : ''
                }`}
              >
                Talk to Us
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#5E6F77]/60">
            Fictional demo view
          </div>

          {/* Form card sliding up over browser (at 1.0s) */}
          {formVisible && (
            <div
              className="absolute inset-x-2.5 bottom-2.5 top-[44px] rounded-xl bg-white border border-[#0F2A35]/15 shadow-2xl p-3.5 flex flex-col justify-between z-20"
              style={{
                transform: `translateY(${formY}px)`,
                opacity: formOpacity,
              }}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#0F2A35]/10 mb-2">
                  <span className="text-[14px] font-bold text-[#0F2A35]">
                    Talk to us
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#DCE9EC] text-[#1E4A5C]">
                    Short Form
                  </span>
                </div>

                {/* 3 Fields: Business, Trade, Town */}
                <div className="space-y-2 text-[12px]">
                  <div>
                    <label className="text-[11px] font-medium text-[#5E6F77] block mb-0.5">
                      Business name
                    </label>
                    <div className="h-[28px] px-2.5 rounded-md bg-[#F4F6F8] border border-[#0F2A35]/10 flex items-center text-[12.5px] font-semibold text-[#0F2A35]">
                      {businessTyped}
                      {curSec >= 1.3 && curSec < 1.6 && (
                        <span className="inline-block w-1 h-3.5 bg-[#1E4A5C] ml-0.5 animate-pulse" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#5E6F77] block mb-0.5">
                      Trade
                    </label>
                    <div className="h-[28px] px-2.5 rounded-md bg-[#F4F6F8] border border-[#0F2A35]/10 flex items-center text-[12.5px] font-semibold text-[#0F2A35]">
                      {tradeTyped}
                      {curSec >= 1.6 && curSec < 1.9 && (
                        <span className="inline-block w-1 h-3.5 bg-[#1E4A5C] ml-0.5 animate-pulse" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#5E6F77] block mb-0.5">
                      Town
                    </label>
                    <div className="h-[28px] px-2.5 rounded-md bg-[#F4F6F8] border border-[#0F2A35]/10 flex items-center text-[12.5px] font-semibold text-[#0F2A35]">
                      {townTyped}
                      {curSec >= 1.9 && curSec < 2.2 && (
                        <span className="inline-block w-1 h-3.5 bg-[#1E4A5C] ml-0.5 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Button: Send my request */}
              <div className="mt-2">
                <div
                  className="w-full py-2 px-3 rounded-lg bg-[#1E4A5C] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-transform"
                  style={{ transform: `scale(${buttonScale})` }}
                >
                  {isButtonPressed ? (
                    <span className="inline-flex items-center gap-1.5 text-[#E3B896]">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 8.5 L6.5 12 L13 4" />
                      </svg>
                      Sent
                    </span>
                  ) : (
                    <span>Send my request</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Animated Cursor (0.3s - 1.0s) */}
      {cursorActive && (
        <div
          className="absolute z-40 pointer-events-none transition-transform"
          style={{
            left: `${cursorX}px`,
            top: `${cursorY}px`,
          }}
        >
          <div className="relative">
            {/* White circle cursor */}
            <div className="w-5 h-5 rounded-full bg-white border-2 border-[#0F2A35] shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0F2A35]" />
            </div>
            {/* Ripple when clicking */}
            {isClicking && (
              <div className="absolute -inset-2 rounded-full border-2 border-[#E3B896] animate-ping opacity-80" />
            )}
          </div>
        </div>
      )}

      {/* Flying Gold Envelope (2.4s - 3.1s) */}
      {flyActive && (
        <div
          className="absolute z-40 pointer-events-none"
          style={{
            left: `${envX - 14}px`,
            top: `${envY - 14}px`,
            transform: `scale(${envScale}) rotate(${envRotate}deg)`,
            opacity: envOpacity,
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-[#E3B896] text-[#0F2A35] shadow-xl flex items-center justify-center border border-white/60">
            <Mail className="w-5 h-5" strokeWidth={2.4} />
          </div>
        </div>
      )}

      {/* RIGHT: Mini Dashboard Card (approx 40% width -> 210px, radius 18px) */}
      <div
        className="absolute right-[20px] top-[36px] w-[210px] h-[330px] rounded-[18px] bg-white border border-[#0F2A35]/10 shadow-2xl p-4 flex flex-col justify-between transition-opacity duration-300 z-10"
        style={{
          opacity: dashOpacity,
          transform: 'translateZ(0)',
        }}
      >
        <div>
          {/* Header: Title "Open Hours" + bell icon */}
          <div className="flex items-center justify-between pb-3 border-b border-[#0F2A35]/10 mb-3">
            <span className="text-[14px] font-bold text-[#0F2A35] tracking-tight">
              Open Hours
            </span>
            <div className="relative">
              <div
                style={{
                  transform: `rotate(${bellAngle}deg)`,
                  transformOrigin: 'top center',
                }}
              >
                <Bell className="w-4 h-4 text-[#0F2A35]" />
              </div>
              {/* Peach dot appears on bell at 3.1s */}
              {isDashboardBright && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E3B896] border border-white" />
              )}
            </div>
          </div>

          {/* Faint sidebar of three dots & two placeholder grey rows */}
          <div className="flex gap-2 mb-3">
            <div className="flex flex-col gap-1.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F2A35]/25" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F2A35]/25" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F2A35]/25" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="w-full h-[8px] rounded-full bg-[#0F2A35]/10" />
              <div className="w-3/4 h-[8px] rounded-full bg-[#0F2A35]/06" />
            </div>
          </div>

          {/* Notification Toast sliding down at 3.1s */}
          {curSec >= 3.1 && (
            <div
              className="rounded-xl bg-[#EEF3F4] border border-[#1E4A5C]/20 p-2.5 shadow-sm mt-3"
              style={{
                transform: `translateY(${toastY}px)`,
                opacity: toastOpacity,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#2E9E6B]" />
                <span className="text-[15px] font-semibold text-[#0F2A35] leading-tight">
                  New request
                </span>
              </div>
              <div className="text-[14px] font-medium text-[#1E4A5C] leading-snug">
                {SAMPLE_ORDER.business}
              </div>
              <div className="text-[13px] text-[#5E6F77] mt-0.5">
                Just now
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-[#0F2A35]/06 flex items-center justify-between text-[11px] text-[#5E6F77]">
          <span>Galway enquiry</span>
          <span className="font-semibold text-[#1E4A5C]">Received</span>
        </div>
      </div>
    </div>
  );
}
