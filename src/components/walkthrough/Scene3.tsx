import React from 'react';
import { FIRST_PAGE } from '../../content';

export interface Scene3Props {
  // progress: 0 to 1 across Scene 3 duration (3.8s)
  progress: number;
}

export default function Scene3({ progress }: Scene3Props) {
  // Timeline breakdown (duration = 3.8s):
  // Dark stage with soft peach spotlight behind a gift box (inline SVG about 150px: body in #1E4A5C, lid slightly wider, gold ribbon cross and bow)
  // 0.1 - 0.6s: box drops in with a bounce (spring) and squash & stretch.
  // 0.8 - 2.6s: hops twice (translateY -14px with squash on landing) and wobbles (rotate +-6deg)
  //             lid lifts a few pixels and settles, warm light leaks from under lid (radial gradient pulsing), bow wiggles, four 4-point sparkles twinkle around it.
  //             The box NEVER opens and nothing comes out of it.
  // Text timeline:
  //   0.9s: "A surprise is waiting for you" (26px, weight 600, white)
  //   1.4s: "{FIRST_PAGE.extrasLine}" (22px, weight 600, gold #E3B896)
  //   1.8s: "{FIRST_PAGE.extrasNote}" (14px, white at 75%)
  // 2.6 - 3.8s: box keeps gentle bounce (small ambient motion, transform only), text holds.
  // No details, months, packages or numbers about the gifts.

  const curSec = progress * 3.8;

  // Drop-in bounce (0.1 - 0.6s)
  let boxY = 0;
  let boxScaleX = 1;
  let boxScaleY = 1;
  let boxRotate = 0;

  if (curSec < 0.1) {
    boxY = -120;
    boxScaleX = 0.9;
    boxScaleY = 1.1;
  } else if (curSec >= 0.1 && curSec < 0.6) {
    const t = (curSec - 0.1) / 0.5;
    // Damped harmonic bounce
    const decay = Math.exp(-4 * t);
    const bounce = Math.cos(t * Math.PI * 4.5);
    boxY = -120 * decay * bounce;
    // Squash & stretch on landing near t=0.5
    if (t > 0.4 && t < 0.7) {
      boxScaleX = 1.08;
      boxScaleY = 0.92;
    } else {
      boxScaleX = 1;
      boxScaleY = 1;
    }
  } else if (curSec >= 0.8 && curSec < 2.6) {
    // Two hops: Hop 1 (0.8 - 1.5s), Hop 2 (1.7 - 2.4s)
    const tHop1 = Math.min(1, Math.max(0, (curSec - 0.8) / 0.7));
    const tHop2 = Math.min(1, Math.max(0, (curSec - 1.7) / 0.7));

    let activeHopT = 0;
    if (curSec < 1.6) {
      activeHopT = tHop1;
    } else if (curSec >= 1.7 && curSec < 2.5) {
      activeHopT = tHop2;
    }

    if (activeHopT > 0 && activeHopT < 1) {
      // Parabolic jump: -14px peak
      boxY = -Math.sin(activeHopT * Math.PI) * 14;
      // Wobble rotate +-6 deg
      boxRotate = Math.sin(activeHopT * Math.PI * 2) * 6;
      // Slight squash on landing
      if (activeHopT > 0.85) {
        boxScaleX = 1.05;
        boxScaleY = 0.95;
      }
    }
  } else if (curSec >= 2.6) {
    // Ambient gentle floating bounce (2.6 - 3.8s)
    const tAmb = (curSec - 2.6) / 1.2;
    boxY = -Math.sin(tAmb * Math.PI * 2) * 3;
    boxRotate = Math.sin(tAmb * Math.PI * 2) * 1.5;
  }

  // Lid lift: a few pixels (2-4px) during 1.0-2.4s
  let lidLift = 0;
  let lightLeakOpacity = 0;
  if (curSec >= 0.9 && curSec <= 2.5) {
    const lidCycle = (curSec - 0.9) / 1.6;
    lidLift = Math.sin(lidCycle * Math.PI * 3) * 3.5;
    lightLeakOpacity = Math.max(0, Math.sin(lidCycle * Math.PI * 3) * 0.85);
  }

  // Bow wiggle: +-4deg
  const bowWiggle = curSec >= 0.8 && curSec <= 2.5
    ? Math.sin((curSec - 0.8) * Math.PI * 5) * 4
    : 0;

  // Text appearances
  const text1Opacity = Math.min(1, Math.max(0, (curSec - 0.9) / 0.3));
  const text2Opacity = Math.min(1, Math.max(0, (curSec - 1.4) / 0.3));
  const text3Opacity = Math.min(1, Math.max(0, (curSec - 1.8) / 0.3));

  // 4-point Sparkles twinkle (0.8s - 3.5s)
  const showSparkles = curSec >= 0.8;
  const sparkCycle = curSec * 4;
  const spark1Scale = showSparkles ? (Math.sin(sparkCycle) + 1) / 2 : 0;
  const spark2Scale = showSparkles ? (Math.cos(sparkCycle + 1) + 1) / 2 : 0;
  const spark3Scale = showSparkles ? (Math.sin(sparkCycle + 2) + 1) / 2 : 0;
  const spark4Scale = showSparkles ? (Math.cos(sparkCycle + 3) + 1) / 2 : 0;

  return (
    <div className="relative w-[560px] h-[420px] overflow-hidden select-none flex flex-col items-center justify-center">
      {/* Soft Peach Spotlight Glow behind the gift box */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[260px] h-[260px] bg-[#E3B896]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Sparkles Layer */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Sparkle 1: Top-Left */}
          <div
            className="absolute top-[80px] left-[150px] transition-transform"
            style={{ transform: `scale(${spark1Scale})` }}
          >
            <SparkleSvg size={22} color="#E3B896" />
          </div>
          {/* Sparkle 2: Top-Right */}
          <div
            className="absolute top-[70px] right-[145px] transition-transform"
            style={{ transform: `scale(${spark2Scale})` }}
          >
            <SparkleSvg size={26} color="#FFFFFF" />
          </div>
          {/* Sparkle 3: Bottom-Left */}
          <div
            className="absolute top-[180px] left-[130px] transition-transform"
            style={{ transform: `scale(${spark3Scale})` }}
          >
            <SparkleSvg size={18} color="#FFFFFF" />
          </div>
          {/* Sparkle 4: Mid-Right */}
          <div
            className="absolute top-[175px] right-[135px] transition-transform"
            style={{ transform: `scale(${spark4Scale})` }}
          >
            <SparkleSvg size={20} color="#E3B896" />
          </div>
        </div>
      )}

      {/* Gift Box Container (about 150px wide) */}
      <div
        className="relative z-10 flex flex-col items-center mt-2 mb-4"
        style={{
          transform: `translateY(${boxY}px) rotate(${boxRotate}deg) scale(${boxScaleX}, ${boxScaleY})`,
          transformOrigin: 'bottom center',
        }}
      >
        {/* Soft shadow under the box */}
        <div className="w-[130px] h-[14px] bg-black/40 rounded-full blur-sm -mb-2" />

        {/* Inline SVG Gift Box */}
        <svg
          width="150"
          height="140"
          viewBox="0 0 150 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Warm Light Leak from under lid (never opens completely) */}
          {lightLeakOpacity > 0 && (
            <ellipse
              cx="75"
              cy="48"
              rx="55"
              ry="10"
              fill="url(#peachLightLeak)"
              opacity={lightLeakOpacity}
            />
          )}

          {/* BOX BODY: Teal #1E4A5C */}
          <rect
            x="20"
            y="48"
            width="110"
            height="82"
            rx="8"
            fill="#1E4A5C"
            stroke="#2B647B"
            strokeWidth="2"
          />

          {/* Gold Vertical Ribbon on Body */}
          <rect x="67" y="48" width="16" height="82" fill="#E3B896" />
          {/* Inner ribbon detail */}
          <rect x="73" y="48" width="4" height="82" fill="#F4D8C4" />

          {/* Gold Horizontal Ribbon on Body */}
          <rect x="20" y="82" width="110" height="15" fill="#E3B896" />
          <rect x="20" y="87" width="110" height="4" fill="#F4D8C4" />

          {/* LID & BOW GROUP (lifts slightly) */}
          <g transform={`translate(0, ${-Math.max(0, lidLift)})`}>
            {/* Bow */}
            <g
              transform={`translate(75, 28) rotate(${bowWiggle}) translate(-75, -28)`}
            >
              {/* Left loop */}
              <path
                d="M75 28 C60 12, 42 18, 52 28 C59 34, 70 30, 75 28 Z"
                fill="#E3B896"
                stroke="#CFA27E"
                strokeWidth="1.5"
              />
              <circle cx="56" cy="24" r="3" fill="#FAF7F2" opacity="0.6" />

              {/* Right loop */}
              <path
                d="M75 28 C90 12, 108 18, 98 28 C91 34, 80 30, 75 28 Z"
                fill="#E3B896"
                stroke="#CFA27E"
                strokeWidth="1.5"
              />
              <circle cx="94" cy="24" r="3" fill="#FAF7F2" opacity="0.6" />

              {/* Center bow knot */}
              <rect
                x="69"
                y="23"
                width="12"
                height="10"
                rx="4"
                fill="#F4D8C4"
                stroke="#CFA27E"
                strokeWidth="1.5"
              />
            </g>

            {/* Lid: slightly wider (124px vs 110px) */}
            <rect
              x="13"
              y="32"
              width="124"
              height="18"
              rx="5"
              fill="#1E4A5C"
              stroke="#2B647B"
              strokeWidth="2"
            />
            {/* Gold Vertical Ribbon on Lid */}
            <rect x="67" y="32" width="16" height="18" fill="#E3B896" />
            <rect x="73" y="32" width="4" height="18" fill="#F4D8C4" />
          </g>

          <defs>
            <radialGradient
              id="peachLightLeak"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(75 48) scale(60 15)"
            >
              <stop stopColor="#FFF2E5" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#E3B896" stopOpacity="0.8" />
              <stop offset="1" stopColor="#E3B896" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Text Group below Box */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-[480px]">
        {/* 0.9s: "A surprise is waiting for you" (26px, weight 600, white) */}
        <h3
          className="text-[26px] font-semibold text-white tracking-tight leading-tight transition-opacity duration-300"
          style={{ opacity: text1Opacity }}
        >
          A surprise is waiting for you
        </h3>

        {/* 1.4s: "{FIRST_PAGE.extrasLine}" (22px, weight 600, gold #E3B896) */}
        <div
          className="text-[22px] font-semibold text-[#E3B896] tracking-tight mt-1.5 transition-opacity duration-300"
          style={{ opacity: text2Opacity }}
        >
          {FIRST_PAGE.extrasLine}
        </div>

        {/* 1.8s: "{FIRST_PAGE.extrasNote}" (14px, white at 75%) */}
        <p
          className="text-[14px] text-white/75 font-normal mt-1 max-w-[380px] transition-opacity duration-300"
          style={{ opacity: text3Opacity }}
        >
          {FIRST_PAGE.extrasNote}
        </p>
      </div>
    </div>
  );
}

function SparkleSvg({ size = 20, color = '#E3B896' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 0 C12 7, 17 12, 24 12 C17 12, 12 17, 12 24 C12 17, 7 12, 0 12 C7 12, 12 7, 12 0 Z"
        fill={color}
      />
    </svg>
  );
}
