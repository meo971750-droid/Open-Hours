import React from 'react';
import { Search, MapPin, CheckCircle2, Laptop, Globe, Clock, Bot, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene8Talk({ progress, isMobile, palette, onOpenAudit }: SceneProps) {
  // Recap Icons along the curved summary line
  const recapSteps = [
    { name: 'Searches', icon: Search },
    { name: 'Journey', icon: MapPin },
    { name: 'Solve', icon: CheckCircle2 },
    { name: 'Build', icon: Laptop },
    { name: 'Findable', icon: Globe },
    { name: 'Ranking', icon: Clock },
    { name: 'Always on', icon: Bot },
  ];

  // In Scene 8, recap line draws across first 4 seconds (0.0 to 0.45)
  // CTA button emerges at 0.45 - 0.70 and stays permanently
  const recapProgress = Math.min(1, Math.max(0, (progress - 0.05) / 0.40));
  const ctaProgress = Math.min(1, Math.max(0, (progress - 0.40) / 0.25));

  const handleCtaClick = () => {
    if (onOpenAudit) {
      onOpenAudit();
      return;
    }
    const target = document.getElementById('about') || document.getElementById('final-cta');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      <div className="absolute top-2 right-4 text-[10px] uppercase tracking-wider text-white/50 px-2 py-0.5 rounded bg-black/20 border border-white/10 z-20">
        Illustrative story
      </div>

      <div className="relative w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center gap-6 px-4 py-2">
        {/* 7 Recap Icons on Flowing Curve */}
        <div className="w-full max-w-4xl py-4">
          <svg className="w-full h-24" viewBox="0 0 1000 120" preserveAspectRatio="xMidYMid meet">
            <path
              d="M 50 60 Q 250 15, 500 60 T 950 60"
              fill="none"
              stroke="#E8B08F"
              strokeWidth="2.5"
              strokeDasharray="1000"
              strokeDashoffset={(1 - recapProgress) * 1000}
              strokeLinecap="round"
              opacity="0.8"
            />
            {recapSteps.map((step, idx) => {
              const stepFraction = (idx + 0.5) / recapSteps.length;
              const isRevealed = recapProgress >= stepFraction;
              const cx = 80 + idx * (840 / (recapSteps.length - 1));
              const cy = 60 + Math.sin(idx * 0.8) * 15;

              return (
                <g
                  key={step.name}
                  transform={`translate(${cx}, ${cy})`}
                  opacity={isRevealed ? 1 : 0.2}
                  style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
                >
                  <circle r="18" fill="#183B4A" stroke="#E8B08F" strokeWidth="1.5" />
                  <foreignObject x="-10" y="-10" width="20" height="20">
                    <div className="w-full h-full flex items-center justify-center text-[#E8B08F]">
                      <step.icon className="w-3.5 h-3.5" />
                    </div>
                  </foreignObject>
                  <text
                    x="0"
                    y="32"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    opacity={isRevealed ? 0.9 : 0.4}
                    fontSize="9.5"
                    fontWeight="600"
                  >
                    {step.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* CTA & Next Step Block */}
        <div
          style={{
            opacity: ctaProgress,
            transform: `translateY(${(1 - ctaProgress) * 20}px)`,
          }}
          className="flex flex-col items-center gap-4 text-center z-10"
        >
          {/* Main Pill Button */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="group px-7 py-3.5 rounded-full bg-[#E8B08F] hover:bg-[#F3C4A8] text-[#12303D] font-bold text-sm sm:text-base tracking-tight shadow-[0_10px_30px_rgba(232,176,143,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
          >
            <span>Talk to Us</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Pricing Link */}
          <button
            type="button"
            onClick={handlePricingClick}
            className="text-xs text-white/70 hover:text-white underline decoration-white/30 hover:decoration-white transition-colors cursor-pointer"
          >
            Or see pricing breakdown first →
          </button>

          {/* Final Honest Footnote */}
          <p className="max-w-xl text-[11px] text-white/50 leading-relaxed mt-2">
            Illustrative story. Search results vary and take time to build. We never promise rankings or a set number of enquiries.
          </p>
        </div>
      </div>
    </div>
  );
}
