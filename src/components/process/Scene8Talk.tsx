import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SceneProps } from './types';

export default function Scene8Talk({ isActive, animate = true, onOpenAudit }: SceneProps) {
  const animClass = animate && isActive ? 'oh-deliver-anim-rise' : 'oh-deliver-static';

  const handleCtaClick = () => {
    if (onOpenAudit) {
      onOpenAudit();
      return;
    }
    const target =
      document.getElementById('contact') ||
      document.getElementById('about') ||
      document.getElementById('final-cta');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 text-center select-none">
      {/* Three Crisp Outcome Chips (pure HTML/CSS, zero foreignObject) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {['Found on Google', 'Fast reply', 'Booked job'].map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] font-medium text-[#A8EBD3]"
          >
            <Check className="w-3 h-3 text-[#6FD6B0]" strokeWidth={2} />
            {item}
          </span>
        ))}
      </div>

      {/* Primary Action */}
      <div className={`flex flex-col items-center gap-2 ${animClass}`}>
        <button
          type="button"
          onClick={handleCtaClick}
          className="oh-btn-primary px-5 py-2.5 rounded-full text-white font-semibold text-[13px] inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Talk to Us</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>

        <p className="max-w-[240px] text-[10px] text-white/75 leading-relaxed">
          We check your area and show you what customers see today.
        </p>
      </div>
    </div>
  );
}
