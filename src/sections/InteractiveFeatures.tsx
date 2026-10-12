import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import {
  Wand2,
  Check,
  ArrowRight,
  Phone,
  Search,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import Accent from '../components/Accent';
import {
  INTERACTIVE_FEATURES,
  SAMPLE_ESTIMATE,
  SAMPLE_AREAS,
  SAMPLE_SLOTS,
  CONTACT,
  whatsappLink,
} from '../content';

interface InteractiveFeaturesProps {
  onOpenAudit: (variant?: 'page' | 'feature') => void;
}

/* =========================================================================
   SCENE 01: PHOTO ESTIMATE (Decorative / Autoplay Loop ~7s)
   ========================================================================= */
function PhotoEstimateScene({
  isPaused,
  reducedMotion,
}: {
  isPaused: boolean;
  reducedMotion: boolean;
}) {
  const [progress, setProgress] = useState(reducedMotion ? 5000 : 0);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (reducedMotion) {
      setProgress(5000);
      return;
    }

    const loopDuration = 7000;
    const animate = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!isPaused) {
        setProgress((prev) => (prev + delta) % loopDuration);
      }
      animRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPaused, reducedMotion]);

  // Phase calculations
  // 0 - 1200ms: Dashed box fills & roof ready
  // 1200 - 3200ms: Scan sweep (twice) + pulsing corner brackets
  // 3400 - 6500ms: Result card slides up, price counts up
  // 6500 - 7000ms: Fade/reset
  const scanSweep =
    progress >= 1200 && progress < 3200
      ? ((progress - 1200) % 1000) / 1000
      : -1;
  const isScanning = scanSweep >= 0;
  const showResult = progress >= 3400;
  const resultOpacity =
    progress >= 6500 ? Math.max(0, 1 - (progress - 6500) / 500) : showResult ? 1 : 0;

  // Count up value
  const countFactor = showResult
    ? Math.min(1, Math.max(0, (progress - 3400) / 800))
    : 0;
  const currentLow = Math.round(
    SAMPLE_ESTIMATE.low +
      (SAMPLE_ESTIMATE.high - SAMPLE_ESTIMATE.low) * 0.3 * countFactor
  );

  return (
    <div className="w-full h-full relative flex items-center justify-center p-4">
      {/* Phone-like frame */}
      <div className="relative w-[340px] h-[310px] rounded-2xl bg-[#08181F]/90 border border-white/15 p-4 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Top status header */}
        <div className="flex items-center justify-between text-xs text-white/50 border-b border-white/10 pb-2">
          <span className="font-medium text-white/80">Photo estimate</span>
          <span className="text-[11px] font-mono">Atlantic Slate</span>
        </div>

        {/* Drawn Roof Illustration inside viewfinder */}
        <div className="relative w-full h-[160px] rounded-xl bg-[#0F2A35]/60 border border-dashed border-white/20 flex items-center justify-center overflow-hidden">
          {/* Corner brackets */}
          <div
            className={`absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 transition-colors duration-300 ${
              isScanning ? 'border-[#E3B896]' : 'border-white/30'
            }`}
          />
          <div
            className={`absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 transition-colors duration-300 ${
              isScanning ? 'border-[#E3B896]' : 'border-white/30'
            }`}
          />
          <div
            className={`absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 transition-colors duration-300 ${
              isScanning ? 'border-[#E3B896]' : 'border-white/30'
            }`}
          />
          <div
            className={`absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 transition-colors duration-300 ${
              isScanning ? 'border-[#E3B896]' : 'border-white/30'
            }`}
          />

          {/* SVG Roof Illustration */}
          <svg
            viewBox="0 0 240 120"
            className="w-[200px] h-[100px] text-white/80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Chimney */}
            <path d="M165 40V24H182V52" stroke="#E3B896" strokeWidth="2" />
            <path d="M161 24H186" stroke="#E3B896" strokeWidth="2" />
            {/* Main sloped roof gable */}
            <path d="M30 90L120 28L210 90" stroke="currentColor" strokeWidth="3" />
            {/* Ridge line */}
            <path d="M120 28V90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            {/* Roof tiles pattern */}
            <path d="M55 72L120 40L185 72" stroke="#E3B896" opacity="0.4" strokeWidth="1.5" />
            <path d="M42 82L120 54L198 82" stroke="#E3B896" opacity="0.3" strokeWidth="1.5" />
            {/* Gutter / eaves */}
            <path d="M24 90H216" stroke="currentColor" strokeWidth="2.5" />
            {/* House wall hints */}
            <path d="M45 90V110" stroke="currentColor" opacity="0.4" />
            <path d="M195 90V110" stroke="currentColor" opacity="0.4" />
          </svg>

          {/* Scanning line sweep */}
          {isScanning && (
            <div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E3B896] to-transparent shadow-[0_0_12px_#E3B896]"
              style={{
                top: `${scanSweep * 100}%`,
              }}
            />
          )}

          {/* Instruction chip */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/60 text-[11px] font-mono text-[#E3B896] tracking-wider uppercase border border-white/10">
            {isScanning ? 'Analysing roof...' : 'Photo uploaded'}
          </div>
        </div>

        {/* Sliding Result Card */}
        <div
          className="w-full rounded-xl bg-gradient-to-b from-[#14363F] to-[#0A222B] border border-white/15 p-3.5 transition-all duration-500 ease-out"
          style={{
            opacity: resultOpacity,
            transform: showResult ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] font-medium text-white/70">
              Indicative range
            </span>
            <span className="text-[11px] font-medium text-[#4ADE80] bg-[#4ADE80]/15 px-2 py-0.5 rounded-full">
              Automated
            </span>
          </div>
          <div className="text-[26px] font-semibold text-white tabular-nums tracking-tight mb-1">
            €{currentLow.toLocaleString('en-IE')} to €
            {SAMPLE_ESTIMATE.high.toLocaleString('en-IE')}
          </div>
          <p className="text-[12px] text-white/75 leading-tight">
            Sample estimate. Final price confirmed after inspection.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 02: BEFORE AND AFTER SLIDER (Interactive with Keyboard & Drag)
   ========================================================================= */
function BeforeAfterScene({
  isPaused,
  onUserInteraction,
  reducedMotion,
}: {
  isPaused: boolean;
  onUserInteraction: () => void;
  reducedMotion: boolean;
}) {
  const [split, setSplit] = useState(50);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  // Autoplay glide (50% -> 20% -> 80% -> 50% over 5s)
  useEffect(() => {
    if (reducedMotion || isInteracting || isPaused) return;

    let startTime = performance.now();
    const duration = 5000;

    const animate = (time: number) => {
      const elapsed = (time - startTime) % duration;
      const t = elapsed / duration;

      // Smooth cosine oscillation: 50 -> 20 -> 80 -> 50
      // sin(2*pi*t) oscillates from 0 to 1 to -1 to 0
      const offset = Math.sin(t * Math.PI * 2) * 30; // +/- 30%
      setSplit(50 + offset);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [reducedMotion, isInteracting, isPaused]);

  const updateSplitFromClientX = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const raw = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(5, Math.min(95, raw));
      setSplit(clamped);
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsInteracting(true);
    onUserInteraction();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateSplitFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteracting) return;
    updateSplitFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsInteracting(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    onUserInteraction();
    setIsInteracting(true);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSplit((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSplit((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSplit(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSplit(100);
    }
  };

  return (
    <div
      role="group"
      aria-label="Demo: before and after slider"
      className="w-full h-full relative flex flex-col items-center justify-center p-5 select-none"
    >
      {/* Rounded window container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-[480px] h-[250px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl cursor-ew-resize touch-pan-y"
      >
        {/* Layer 1 (Bottom): AFTER - Clean slate blue roof */}
        <div className="absolute inset-0 bg-[#0F2A35]">
          <svg viewBox="0 0 480 250" className="w-full h-full" preserveAspectRatio="none">
            {/* Sky background */}
            <rect width="480" height="250" fill="#0C2028" />
            {/* Clean house wall */}
            <rect x="70" y="130" width="340" height="120" fill="#14343F" />
            <rect x="110" y="160" width="60" height="60" fill="#EAEFEF" rx="4" />
            <rect x="310" y="160" width="60" height="60" fill="#EAEFEF" rx="4" />
            {/* Clean chimney */}
            <rect x="320" y="30" width="36" height="50" fill="#844535" rx="2" />
            {/* Clean slate blue roof */}
            <polygon points="40,130 240,40 440,130" fill="#1E4A5C" stroke="#2B6A80" strokeWidth="2" />
            {/* Neat tiles rows */}
            <line x1="80" y1="112" x2="400" y2="112" stroke="#2B6A80" strokeWidth="2" />
            <line x1="120" y1="94" x2="360" y2="94" stroke="#2B6A80" strokeWidth="2" />
            <line x1="160" y1="76" x2="320" y2="76" stroke="#2B6A80" strokeWidth="2" />
            <line x1="200" y1="58" x2="280" y2="58" stroke="#2B6A80" strokeWidth="2" />
            {/* Tidy gutter */}
            <line x1="36" y1="131" x2="444" y2="131" stroke="#E3B896" strokeWidth="3" />
          </svg>
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-[12px] font-semibold border border-white/10 pointer-events-none">
            After
          </div>
        </div>

        {/* Layer 2 (Top): BEFORE - Weathered, mossy roof (revealed by clipPath) */}
        <div
          className="absolute inset-0 bg-[#0F2A35]"
          style={{
            clipPath: `inset(0 ${100 - split}% 0 0)`,
          }}
        >
          <svg viewBox="0 0 480 250" className="w-full h-full" preserveAspectRatio="none">
            {/* Faded sky */}
            <rect width="480" height="250" fill="#0A181E" />
            {/* Weathered house wall */}
            <rect x="70" y="130" width="340" height="120" fill="#11272F" />
            <rect x="110" y="160" width="60" height="60" fill="#8D9B9D" rx="4" />
            <rect x="310" y="160" width="60" height="60" fill="#8D9B9D" rx="4" />
            {/* Weathered chimney */}
            <rect x="320" y="30" width="36" height="50" fill="#5E382E" rx="2" />
            {/* Greyish, mossy roof */}
            <polygon points="40,130 240,40 440,130" fill="#243338" stroke="#3D4B50" strokeWidth="2" />
            {/* Crooked tile lines */}
            <line x1="80" y1="112" x2="400" y2="114" stroke="#3D4B50" strokeWidth="2" strokeDasharray="8 3" />
            <line x1="120" y1="94" x2="360" y2="92" stroke="#3D4B50" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="160" y1="76" x2="320" y2="78" stroke="#3D4B50" strokeWidth="2" />
            {/* Moss patches */}
            <ellipse cx="140" cy="100" rx="18" ry="8" fill="#4D5E3C" opacity="0.8" />
            <ellipse cx="260" cy="85" rx="24" ry="10" fill="#4D5E3C" opacity="0.85" />
            <ellipse cx="320" cy="110" rx="16" ry="7" fill="#4D5E3C" opacity="0.75" />
            <ellipse cx="200" cy="70" rx="12" ry="6" fill="#4D5E3C" opacity="0.9" />
            {/* Sagging gutter */}
            <line x1="36" y1="131" x2="444" y2="133" stroke="#68625B" strokeWidth="3" />
          </svg>
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-[12px] font-semibold border border-white/10 pointer-events-none">
            Before
          </div>
        </div>

        {/* Vertical divider line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none"
          style={{ left: `${split}%` }}
        />

        {/* 44px round handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split)}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[44px] h-[44px] rounded-full bg-white text-[#0F2A35] shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-ew-resize border border-white/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E3B896]"
          style={{ left: `${split}%` }}
        >
          <ChevronLeft className="w-4 h-4 -mr-1" />
          <ChevronRight className="w-4 h-4 -ml-1" />
        </div>
      </div>

      {/* Caption under the window */}
      <p className="mt-3 text-[14px] text-white/70 tracking-wide text-center">
        Illustrative. Drag to compare.
      </p>
    </div>
  );
}

/* =========================================================================
   SCENE 03: VOICE AGENT (Decorative / Autoplay Loop ~9s)
   ========================================================================= */
function VoiceAgentScene({
  isPaused,
  reducedMotion,
}: {
  isPaused: boolean;
  reducedMotion: boolean;
}) {
  const [progress, setProgress] = useState(reducedMotion ? 7500 : 0);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (reducedMotion) {
      setProgress(7500);
      return;
    }

    const loopDuration = 9000;
    const animate = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!isPaused) {
        setProgress((prev) => (prev + delta) % loopDuration);
      }
      animRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPaused, reducedMotion]);

  // Waveform oscillation heights
  const bars = [12, 22, 16, 28, 14, 24, 18, 26, 15];

  // Conversation stages
  // Stage 1: 0.6s
  // Stage 2: 1.8s
  // Stage 3: 3.0s
  // Stage 4: 4.2s
  // Stage 5: 5.4s
  // Summary: 6.8s
  const showM1 = progress >= 600;
  const showM2 = progress >= 1800;
  const showM3 = progress >= 3000;
  const showM4 = progress >= 4200;
  const showM5 = progress >= 5400;
  const showSummary = progress >= 6800;
  const timerSeconds = Math.min(18, Math.floor(progress / 400));
  const timerStr = `00:${timerSeconds < 10 ? '0' : ''}${timerSeconds}`;

  return (
    <div className="w-full h-full relative flex items-center justify-center p-4">
      <div className="w-[490px] h-[310px] rounded-2xl bg-[#08181F]/90 border border-white/15 p-4 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Call header bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E3B896]/20 text-[#E3B896] flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-white leading-tight">
                Atlantic Slate Roofing
              </div>
              <div className="text-[11px] text-[#4ADE80] flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                Call connected • {timerStr}
              </div>
            </div>
          </div>

          {/* 9-bar animated waveform */}
          <div className="flex items-center gap-1 h-6 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
            {bars.map((h, idx) => {
              const phase = (progress / 400 + idx * 0.4) % (Math.PI * 2);
              const osc = reducedMotion ? h : Math.max(6, Math.round(h * (0.5 + 0.5 * Math.sin(phase))));
              return (
                <div
                  key={idx}
                  className="w-[2.5px] rounded-full bg-[#E3B896]"
                  style={{ height: `${osc}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* Message transcript area */}
        <div className="flex-1 py-2.5 space-y-2 overflow-y-auto pr-1">
          {showM1 && (
            <div className="flex flex-col items-start max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="text-[10px] uppercase tracking-wider text-[#E3B896] font-semibold mb-0.5">
                Automated assistant
              </span>
              <div className="rounded-xl px-3 py-1.5 bg-white/12 text-white text-[13px] leading-snug">
                Hello, this is the automated assistant for Atlantic Slate Roofing. How can I help?
              </div>
            </div>
          )}

          {showM2 && (
            <div className="flex flex-col items-end max-w-[80%] ml-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl px-3 py-1.5 bg-[#E3B896]/15 border border-[#E3B896]/30 text-white text-[13px] leading-snug">
                I have a leak above the kitchen.
              </div>
            </div>
          )}

          {showM3 && (
            <div className="flex flex-col items-start max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl px-3 py-1.5 bg-white/12 text-white text-[13px] leading-snug">
                Thanks. Can I take your name and the best number to call you back?
              </div>
            </div>
          )}

          {showM4 && (
            <div className="flex flex-col items-end max-w-[80%] ml-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl px-3 py-1.5 bg-[#E3B896]/15 border border-[#E3B896]/30 text-white text-[13px] leading-snug">
                It's Mary, 087 000 0000.
              </div>
            </div>
          )}

          {showM5 && (
            <div className="flex flex-col items-start max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl px-3 py-1.5 bg-white/12 text-white text-[13px] leading-snug">
                Thank you. I've passed this on, and the team will ring you back.
              </div>
            </div>
          )}
        </div>

        {/* Bottom summary chip */}
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-all duration-300 ${
              showSummary
                ? 'bg-[#2E9E6B]/20 border border-[#2E9E6B]/40 text-[#4ADE80] opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Message sent to the team</span>
          </div>
          <span className="text-[11px] text-white/40">Demo audio transcript</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 04: SERVICE-AREA CHECKER (Interactive)
   ========================================================================= */
function AreaCheckerScene({
  isPaused,
  onUserInteraction,
  reducedMotion,
}: {
  isPaused: boolean;
  onUserInteraction: () => void;
  reducedMotion: boolean;
}) {
  const [inputVal, setInputVal] = useState(reducedMotion ? 'Salthill' : '');
  const [hasInteracted, setHasInteracted] = useState(false);
  const targetWord = 'Salthill';

  // Autoplay typing if user hasn't interacted
  useEffect(() => {
    if (reducedMotion || hasInteracted || isPaused) return;

    let idx = 0;
    let forward = true;
    let delay = 300;

    const interval = setInterval(() => {
      if (forward) {
        if (idx <= targetWord.length) {
          setInputVal(targetWord.slice(0, idx));
          idx++;
        } else {
          forward = false;
          delay = 2400; // Hold full word
        }
      } else {
        delay = 80;
        if (idx > 0) {
          idx--;
          setInputVal(targetWord.slice(0, idx));
        } else {
          forward = true;
          delay = 600;
        }
      }
    }, delay);

    return () => clearInterval(interval);
  }, [reducedMotion, hasInteracted, isPaused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasInteracted(true);
    onUserInteraction();
    setInputVal(e.target.value);
  };

  const trimmed = inputVal.trim();
  const matchedTown = SAMPLE_AREAS.find(
    (area) => area.toLowerCase() === trimmed.toLowerCase()
  );
  const isTooShort = trimmed.length < 2;

  return (
    <div
      role="group"
      aria-label="Demo: service-area checker"
      className="w-full h-full relative flex items-center justify-center p-4"
    >
      <div className="w-[460px] h-[300px] rounded-2xl bg-[#08181F]/90 border border-white/15 p-5 flex flex-col justify-between shadow-2xl">
        <div>
          <label className="block text-[15px] font-semibold text-white/90 mb-2">
            Check your town
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputVal}
              onChange={handleChange}
              onFocus={() => {
                setHasInteracted(true);
                onUserInteraction();
              }}
              placeholder="Type your town"
              aria-label="Your town"
              autoComplete="off"
              className="w-full h-[48px] rounded-[12px] bg-white/10 text-white placeholder-white/40 border border-white/15 px-4 pr-10 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#E3B896] transition-all"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Result & map display */}
        <div className="flex-1 flex flex-col justify-center py-2">
          {matchedTown ? (
            <div className="rounded-xl bg-[#2E9E6B]/15 border border-[#2E9E6B]/30 p-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0" />
              <div>
                <div className="text-[15px] font-semibold text-[#4ADE80]">
                  Yes, we cover {matchedTown}
                </div>
                <div className="text-[12px] text-white/70">
                  Standard travel and site inspections included.
                </div>
              </div>
            </div>
          ) : !isTooShort ? (
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-[14px] text-white/80 leading-snug">
                {trimmed} is not on our list yet. Ask us and we'll let you know.
              </div>
            </div>
          ) : (
            <div className="text-[13px] text-white/40 italic">
              Try: Salthill, Galway, Oranmore, Barna...
            </div>
          )}
        </div>

        {/* Stylised map with pulsing coverage dots */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span className="font-mono text-[11px]">Coverage map: Galway & surrounds</span>
          <div className="flex items-center gap-1.5">
            {SAMPLE_AREAS.map((town, i) => {
              const active = town.toLowerCase() === trimmed.toLowerCase();
              return (
                <div
                  key={town}
                  title={town}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    active
                      ? 'bg-[#4ADE80] scale-125 shadow-[0_0_8px_#4ADE80]'
                      : 'bg-[#E3B896]/60'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 05: SITE-VISIT BOOKING (Interactive)
   ========================================================================= */
function VisitBookingScene({
  isPaused,
  onUserInteraction,
  reducedMotion,
}: {
  isPaused: boolean;
  onUserInteraction: () => void;
  reducedMotion: boolean;
}) {
  const [selectedDay, setSelectedDay] = useState<string>('Wed');
  const [selectedTime, setSelectedTime] = useState<string>('11:00');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectDay = (day: string) => {
    onUserInteraction();
    setSelectedDay(day);
    setSubmitted(false);
    scheduleReset();
  };

  const handleSelectTime = (time: string) => {
    onUserInteraction();
    setSelectedTime(time);
    setSubmitted(false);
    scheduleReset();
  };

  const handleRequestVisit = () => {
    onUserInteraction();
    setSubmitted(true);
    scheduleReset();
  };

  const scheduleReset = () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <div
      role="group"
      aria-label="Demo: site-visit booking"
      className="w-full h-full relative flex items-center justify-center p-4 select-none"
    >
      <div className="w-[480px] h-[310px] rounded-2xl bg-[#08181F]/90 border border-white/15 p-4 flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-white">
            <Calendar className="w-4 h-4 text-[#E3B896]" />
            <span>Choose site-visit slot</span>
          </div>
          <span className="text-[11px] font-mono text-white/50">Atlantic Slate</span>
        </div>

        {/* Days Row: 4 buttons (each 56 x 64, radius 14px) */}
        <div>
          <div className="text-[12px] font-medium text-white/60 mb-1.5">Available days</div>
          <div className="grid grid-cols-4 gap-2">
            {SAMPLE_SLOTS.days.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectDay(day)}
                  className={`h-[56px] rounded-[14px] flex flex-col items-center justify-center text-[14px] font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3B896] ${
                    isSelected
                      ? 'bg-[#E3B896] text-[#0F2A35] shadow-[0_4px_16px_rgba(227,184,150,0.3)]'
                      : 'bg-white/8 text-white hover:bg-white/15 border border-white/10'
                  }`}
                >
                  <span className="text-[11px] opacity-75 font-normal">Next</span>
                  <span>{day}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Times Row: 4 buttons (44px high) */}
        <div>
          <div className="text-[12px] font-medium text-white/60 mb-1.5">Slots</div>
          <div className="grid grid-cols-4 gap-2">
            {SAMPLE_SLOTS.times.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectTime(time)}
                  className={`h-[40px] rounded-[12px] flex items-center justify-center text-[13px] font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3B896] ${
                    isSelected
                      ? 'bg-[#1E4A5C] text-white border-2 border-[#E3B896] shadow-sm'
                      : 'bg-white/8 text-white hover:bg-white/15 border border-white/10'
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1 text-[#E3B896]" />
                  <span>{time}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button & Confirmation */}
        <div className="pt-2 border-t border-white/10">
          {submitted ? (
            <div className="rounded-xl bg-[#2E9E6B]/20 border border-[#2E9E6B]/40 p-2.5 flex items-center justify-between text-left animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <div>
                  <div className="text-[13px] font-semibold text-[#4ADE80]">
                    Request sent to Atlantic Slate Roofing
                  </div>
                  <div className="text-[11px] text-white/60">
                    Sample only. Nothing is sent.
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#E3B896]">
                {selectedDay} {selectedTime}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRequestVisit}
              className="w-full h-[44px] rounded-[12px] bg-gradient-to-r from-[#17323D] to-[#0F2A35] hover:from-[#1E4A5C] hover:to-[#2B6A80] text-white text-[14px] font-semibold flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3B896]"
            >
              <span>Request visit for {selectedDay} at {selectedTime}</span>
              <ArrowRight className="w-4 h-4 text-[#E3B896]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE WRAPPER: Handles 560x350 Canvas Scaling, Observer & Glow
   ========================================================================= */
function DemoCardWrapper({
  children,
  isDecorative = false,
  srOnlyText = '',
}: {
  children: (props: {
    isPaused: boolean;
    onUserInteraction: () => void;
    reducedMotion: boolean;
  }) => React.ReactNode;
  isDecorative?: boolean;
  srOnlyText?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [userPauseUntil, setUserPauseUntil] = useState(0);
  const reducedMotion = Boolean(useReducedMotion());

  // ResizeObserver for 560 x 350 canvas scaling
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setScale(width / 560);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // IntersectionObserver (at least 40% visible)
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // VisibilityState check
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.visibilityState !== 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const triggerInteractionPause = useCallback(() => {
    setUserPauseUntil(Date.now() + 8000);
  }, []);

  const isPaused =
    !isVisible || isTabHidden || Date.now() < userPauseUntil;

  return (
    <div
      ref={containerRef}
      aria-hidden={isDecorative ? 'true' : undefined}
      className="relative w-full aspect-[16/10] rounded-[24px] overflow-hidden border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.3)] select-none"
      style={{
        background: 'linear-gradient(180deg, #0B1F28 0%, #14363F 100%)',
      }}
    >
      {isDecorative && srOnlyText && (
        <span className="sr-only">{srOnlyText}</span>
      )}

      {/* Soft bottom glow (radial gradient peach 22% to teal 18% to transparent) */}
      <div
        className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 w-[80%] h-[120px] rounded-full blur-[40px]"
        style={{
          background:
            'radial-gradient(circle, rgba(227, 184, 150, 0.22) 0%, rgba(30, 74, 92, 0.18) 60%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top-left chip "Sample demo" (12px weight 600, white at 80% on rgba(255,255,255,.10)) */}
      <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-md text-[12px] font-semibold text-white/80 bg-white/10 backdrop-blur-xs select-none pointer-events-none">
        Sample demo
      </div>

      {/* Logical 560 x 350 canvas with CSS transform scale */}
      <div
        className="absolute top-0 left-0 origin-top-left flex items-center justify-center"
        style={{
          width: 560,
          height: 350,
          transform: `scale(${scale})`,
        }}
      >
        {children({
          isPaused,
          onUserInteraction: triggerInteractionPause,
          reducedMotion,
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN SECTION COMPONENT: INTERACTIVE FEATURES
   ========================================================================= */
export default function InteractiveFeatures({
  onOpenAudit,
}: InteractiveFeaturesProps) {
  const reducedMotion = Boolean(useReducedMotion());
  const timelineRef = useRef<HTMLDivElement>(null);

  // Timeline track fill follows section scroll progress
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 60%'],
  });

  const smoothScaleY = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 35,
  });

  const [scrollVal, setScrollVal] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setScrollVal(latest);
    });
  }, [scrollYProgress]);

  return (
    <section
      id="interactive-features"
      className="w-full bg-white py-12 sm:py-20 md:py-24 scroll-mt-24"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Full-bleed dark panel (matching Compare section family) */}
        <div
          className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden px-5 py-14 sm:px-10 sm:py-20 text-white shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #0F2A35 0%, #1E4A5C 100%)',
          }}
        >
          {/* Soft peach glow top-right at 14% */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-[100px]"
            style={{ background: 'rgba(227, 184, 150, 0.14)' }}
            aria-hidden="true"
          />

          {/* Section Header: Centred, White */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            {/* Pill: Interactive features with Wand2 icon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/25 bg-white/5 backdrop-blur-xs mb-4 text-[13px] font-medium text-white shadow-xs">
              <Wand2 className="w-3.5 h-3.5 text-[#E3B896]" />
              <span>Interactive features</span>
            </div>

            {/* H2: Make your website a monster with interactive features */}
            <h2 className="text-[32px] sm:text-[44px] md:text-[56px] lg:text-[60px] font-semibold tracking-[-0.03em] leading-[1.1] text-white mb-4">
              Make your website a <Accent className="text-[#E3B896]">monster</Accent> with interactive features
            </h2>

            {/* Subline: Optional extras that help visitors get answers... */}
            <p className="text-[17px] sm:text-[19px] md:text-[21px] text-white/75 leading-relaxed max-w-2xl">
              Optional extras that help visitors get answers and take the next step.
            </p>
          </div>

          {/* Timeline Wrapper (Max width 1100px) */}
          <div ref={timelineRef} className="max-w-[1100px] mx-auto relative">
            {/* Vertical timeline track at left = 6px */}
            <div
              className="absolute left-[6px] top-4 bottom-4 w-[1px] bg-white/[0.18]"
              aria-hidden="true"
            >
              {/* Gold fill line whose scaleY follows scroll progress (never exceeds last node) */}
              <motion.div
                className="w-[2px] bg-[#E3B896] -ml-[0.5px] origin-top"
                style={{
                  height: '100%',
                  scaleY: reducedMotion ? 1 : smoothScaleY,
                }}
              />
            </div>

            {/* Rows of 5 features */}
            <div className="space-y-16 lg:space-y-24">
              {INTERACTIVE_FEATURES.map((item, idx) => {
                // Node activation progress threshold
                const nodeThreshold = idx / (INTERACTIVE_FEATURES.length - 1);
                const isNodeActive = reducedMotion || scrollVal >= nodeThreshold - 0.05;

                return (
                  <motion.div
                    key={item.id}
                    initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative pl-8 lg:pl-12"
                  >
                    {/* 14px Square Node at left = 0 */}
                    <div
                      className={`absolute left-0 top-3 w-3.5 h-3.5 rounded-[3px] transition-all duration-300 z-10 ${
                        isNodeActive
                          ? 'bg-[#E3B896] shadow-[0_0_12px_rgba(227,184,150,0.65)]'
                          : 'bg-white/35 border border-white/20'
                      }`}
                      aria-hidden="true"
                    />

                    {/* Two-column grid (Text 42% | Visual 58% on Desktop) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[42%_1fr] gap-8 lg:gap-[56px] items-center">
                      {/* Left: Text column */}
                      <div>
                        {/* Title with Monospace superscript number */}
                        <div className="flex items-start gap-1.5 flex-wrap">
                          <h3 className="text-[28px] sm:text-[30px] font-semibold text-white leading-tight">
                            {item.title}
                            <sup className="font-mono text-[13px] text-[#E3B896] ml-2 font-normal">
                              {item.number}
                            </sup>
                          </h3>
                        </div>

                        {/* Add-on Chip */}
                        <div className="mt-2.5">
                          <span className="inline-block px-3 py-0.5 rounded-full text-[13px] font-bold text-[#E3B896] bg-[#E3B896]/16">
                            Add-on
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[17px] leading-[1.6] text-white/72 max-w-[440px] mt-4">
                          {item.description}
                        </p>
                      </div>

                      {/* Right: Visual card with delayed entrance */}
                      <motion.div
                        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-8%' }}
                        transition={{
                          duration: 0.5,
                          delay: reducedMotion ? 0 : 0.12,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="w-full"
                      >
                        {item.id === 'photo-estimate' && (
                          <DemoCardWrapper
                            isDecorative
                            srOnlyText="Demonstration of photo estimate where a drawn roof illustration is scanned and shows an indicative estimate range of 2,400 to 3,200 euro."
                          >
                            {({ isPaused: p, reducedMotion: rm }) => (
                              <PhotoEstimateScene isPaused={p} reducedMotion={rm} />
                            )}
                          </DemoCardWrapper>
                        )}

                        {item.id === 'before-after' && (
                          <DemoCardWrapper>
                            {({ isPaused: p, onUserInteraction: ui, reducedMotion: rm }) => (
                              <BeforeAfterScene
                                isPaused={p}
                                onUserInteraction={ui}
                                reducedMotion={rm}
                              />
                            )}
                          </DemoCardWrapper>
                        )}

                        {item.id === 'voice-agent' && (
                          <DemoCardWrapper
                            isDecorative
                            srOnlyText="Demonstration of automated voice agent answering an after-hours call for Atlantic Slate Roofing and recording details."
                          >
                            {({ isPaused: p, reducedMotion: rm }) => (
                              <VoiceAgentScene isPaused={p} reducedMotion={rm} />
                            )}
                          </DemoCardWrapper>
                        )}

                        {item.id === 'area-checker' && (
                          <DemoCardWrapper>
                            {({ isPaused: p, onUserInteraction: ui, reducedMotion: rm }) => (
                              <AreaCheckerScene
                                isPaused={p}
                                onUserInteraction={ui}
                                reducedMotion={rm}
                              />
                            )}
                          </DemoCardWrapper>
                        )}

                        {item.id === 'visit-booking' && (
                          <DemoCardWrapper>
                            {({ isPaused: p, onUserInteraction: ui, reducedMotion: rm }) => (
                              <VisitBookingScene
                                isPaused={p}
                                onUserInteraction={ui}
                                reducedMotion={rm}
                              />
                            )}
                          </DemoCardWrapper>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Section Foot: New Glass Card CTA Block (Centred, max-width 760px, mt-[72px]) */}
          <div className="relative z-10 mt-[72px] max-w-[760px] mx-auto">
            {/* Faint peach radial glow behind the card at 16% opacity */}
            <div
              className="pointer-events-none absolute -inset-4 sm:-inset-6 rounded-[36px] blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(227, 184, 150, 0.16) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            <motion.div
              role="group"
              aria-labelledby="feature-idea-title"
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[28px] px-5 py-7 sm:px-8 sm:py-10 text-center shadow-[0_18px_44px_rgba(0,0,0,0.25)] backdrop-blur-xs overflow-hidden"
              style={{
                background:
                  'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)) padding-box, linear-gradient(135deg, rgba(243, 221, 184, 0.6), rgba(227, 184, 150, 0.6), rgba(201, 154, 102, 0.6)) border-box',
                border: '1px solid transparent',
              }}
            >
              {/* Small icon tile: 48px, radius 14px, background rgba(227,184,150,.16), Lightbulb in gold #E3B896 */}
              <div className="w-12 h-12 rounded-[14px] bg-[#E3B896]/16 flex items-center justify-center mx-auto mb-4">
                <motion.div
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          filter: [
                            'drop-shadow(0 0 0px rgba(227, 184, 150, 0))',
                            'drop-shadow(0 0 10px rgba(227, 184, 150, 0.75))',
                            'drop-shadow(0 0 0px rgba(227, 184, 150, 0))',
                          ],
                        }
                  }
                  transition={{ duration: 2.4, times: [0, 0.5, 1], repeat: 0 }}
                >
                  <Lightbulb className="w-6 h-6 text-[#E3B896]" />
                </motion.div>
              </div>

              {/* Title (H3, clamp(26px, 3vw, 38px), weight 600, tracking -0.02em, white, centred) */}
              <h3
                id="feature-idea-title"
                className="text-[26px] sm:text-[32px] md:text-[38px] font-semibold tracking-[-0.02em] text-white text-center mb-3 leading-tight"
              >
                Have a feature <Accent className="text-[#E3B896]">idea</Accent>?
              </h3>

              {/* Line (clamp(17px, 1.5vw, 20px), white at 80%, max-width 520px, centred) */}
              <p className="text-[17px] sm:text-[18.5px] md:text-[20px] text-white/80 text-center max-w-[520px] mx-auto mb-8 leading-relaxed">
                Tell us what you&apos;d like your website to do, and we&apos;ll quote it in writing.
              </p>

              {/* Primary button (light) */}
              <div className="flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={() => onOpenAudit('feature')}
                  className="group relative h-[56px] px-7 rounded-full bg-white text-[#0F2A35] text-[17px] font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3B896] focus-visible:ring-offset-3 focus-visible:ring-offset-[#0F2A35] cursor-pointer shadow-lg"
                >
                  <span>Get it done on your website</span>
                  <ArrowRight className="w-4 h-4 text-[#0F2A35] transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                {/* WhatsApp text link if configured */}
                {(() => {
                  const hasDigits = Boolean(
                    CONTACT.whatsappNumber &&
                      CONTACT.whatsappNumber.replace(/\D/g, '').length >= 5
                  );
                  const waUrl = hasDigits
                    ? whatsappLink('Hi Open Hours, I have a feature idea for my website: ')
                    : null;
                  return waUrl ? (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-[15px] text-white/80 hover:text-white hover:underline transition-colors block text-center"
                    >
                      Prefer WhatsApp? Message us
                    </a>
                  ) : null;
                })()}
              </div>
            </motion.div>

            {/* Muted line directly UNDER the new block, unchanged */}
            <p className="mt-6 text-[14px] text-white/70 text-center leading-relaxed">
              Interactive features are optional extras, quoted in writing. They are not part of the 1-page website.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
