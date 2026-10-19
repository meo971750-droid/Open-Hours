import React from 'react';
import { Search, MapPin, CheckCircle2, Laptop, Globe, Clock, Bot, ArrowRight } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene8Talk({
  progress,
  stepIndex,
  stepProgress,
  activeHighlight,
  isMobile,
  palette,
  onOpenAudit,
}: SceneProps) {
  const recapSteps = [
    { name: 'Searches', icon: Search },
    { name: 'Journey', icon: MapPin },
    { name: 'Solve', icon: CheckCircle2 },
    { name: 'Build', icon: Laptop },
    { name: 'Findable', icon: Globe },
    { name: 'Ranking', icon: Clock },
    { name: 'Always on', icon: Bot },
  ];

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

  const isCtaStep = stepIndex >= 1 || activeHighlight === 'cta';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      <div className="absolute top-2 right-4 text-[10px] uppercase tracking-wider text-white/50 px-2 py-0.5 rounded bg-black/20 border border-white/10 z-20">
        Illustrative story
      </div>

      <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center gap-3 px-4 py-1">
        {/* 7 Recap Icons on Flowing Curve */}
        <div className="w-full max-w-3xl py-1">
          <svg className="w-full h-20" viewBox="0 0 1000 110" preserveAspectRatio="xMidYMid meet">
            <path
              d="M 50 55 Q 250 15, 500 55 T 950 55"
              fill="none"
              stroke="#E8B08F"
              strokeWidth="2.5"
              strokeDasharray="1000"
              strokeDashoffset={stepIndex === 0 ? (1 - stepProgress) * 1000 : 0}
              strokeLinecap="round"
              opacity="0.8"
            />
            {recapSteps.map((step, idx) => {
              const cx = 80 + idx * (840 / (recapSteps.length - 1));
              const cy = 55 + Math.sin(idx * 0.8) * 14;
              const isRevealed = stepIndex > 0 || stepProgress >= (idx / recapSteps.length);

              return (
                <g
                  key={step.name}
                  transform={`translate(${cx}, ${cy})`}
                  opacity={isRevealed ? 1 : 0.3}
                  style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
                >
                  <circle r="16" fill="#183B4A" stroke="#E8B08F" strokeWidth="1.5" />
                  <foreignObject x="-9" y="-9" width="18" height="18">
                    <div className="w-full h-full flex items-center justify-center text-[#E8B08F]">
                      <step.icon className="w-3 h-3" />
                    </div>
                  </foreignObject>
                  <text
                    x="0"
                    y="28"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    opacity={isRevealed ? 0.9 : 0.4}
                    fontSize="9"
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
          className={`flex flex-col items-center gap-2.5 text-center z-10 transition-all duration-300 ${
            isCtaStep ? 'opacity-100 scale-100' : 'opacity-85'
          }`}
        >
          {/* Main Pill Button */}
          <button
            type="button"
            onClick={handleCtaClick}
            className={`group px-6 py-2.5 rounded-full bg-[#E8B08F] hover:bg-[#F3C4A8] text-[#12303D] font-bold text-sm tracking-tight transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer ${
              isCtaStep
                ? 'shadow-[0_8px_25px_rgba(232,176,143,0.45)] ring-4 ring-[#E8B08F]/30 scale-105'
                : 'shadow-md'
            }`}
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
          <p className="max-w-xl text-[10.5px] text-white/50 leading-relaxed">
            Illustrative story. Search results vary and take time to build. We never promise rankings or a set number of enquiries.
          </p>
        </div>
      </div>
    </div>
  );
}
