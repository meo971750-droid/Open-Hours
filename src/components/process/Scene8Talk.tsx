import React, { useState } from 'react';
import { ArrowRight, Search, RotateCcw, MapPin, Wrench } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene8Talk({ progress, isActive, isMobile, onOpenAudit, onInteract }: SceneProps) {
  const [selectedTrade, setSelectedTrade] = useState('Roofers');
  const [town, setTown] = useState('Galway');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const sampleTrades = [
    'Roofers',
    'Kitchen fitters',
    'Extension builders',
    'Windows & doors',
    'Electricians',
    'Plumbers',
  ];

  // Timing: 20% entrance, 45% main animation (0.20 to 0.65), 20% HOLD (0.65 to 0.85), 15% exit (0.85 to 1.0)
  const enterProgress = Math.min(1, Math.max(0, progress / 0.2));
  const xOffset = isMobile ? 0 : (1 - enterProgress) * -40;
  const opacity = isMobile ? 1 : enterProgress;

  const handleTradeSelect = (trade: string) => {
    setSelectedTrade(trade);
    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteract) onInteract();
    }
  };

  const handleTownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTown(e.target.value);
    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteract) onInteract();
    }
  };

  const handleCtaClick = () => {
    const formattedMsg = `I'm a ${selectedTrade.toLowerCase()} in ${town.trim() || 'Galway'} and I'd like to see what my customers see today.`;

    // Try scrolling directly to the about / contact form section
    const contactSection = document.getElementById('about') || document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Preselect trade if possible
      const tradeBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === selectedTrade
      );
      tradeBtn?.click();

      // Prefill message input if found
      const messageTextarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
      if (messageTextarea) {
        messageTextarea.value = formattedMsg;
        messageTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else if (onOpenAudit) {
      onOpenAudit(formattedMsg, selectedTrade);
    }
  };

  const handleScrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#pricing');
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTrade('Roofers');
    setTown('Galway');
    setReplayKey((k) => k + 1);
  };

  return (
    <div
      key={replayKey}
      style={{
        transform: `translateX(${xOffset}px)`,
        opacity,
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease-out',
      }}
      className="w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-5 select-none"
    >
      {/* Top Banner with Replay */}
      <div className="w-full flex items-center justify-between text-xs text-white/70">
        <span className="font-semibold text-[#E3B896] uppercase tracking-wider text-[11px]">
          Personalized Customer View
        </span>

        <button
          type="button"
          onClick={handleReplay}
          aria-label="Reset fields"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* "Tell us about you" interactive strip */}
      <div className="w-full bg-[#13242C] rounded-2xl border border-white/10 p-5 sm:p-6 shadow-xl flex flex-col gap-4 text-left">
        <div>
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
            Tell us about your trade &amp; location:
          </span>
          <p className="text-xs text-white/70">
            Pick your trade and town to simulate how your business appears to homeowners right now.
          </p>
        </div>

        {/* Trade Chips Selection */}
        <div className="flex flex-wrap gap-2">
          {sampleTrades.map((trade) => {
            const isSelected = selectedTrade === trade;
            return (
              <button
                key={trade}
                type="button"
                onClick={() => handleTradeSelect(trade)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E3B896] text-[#0F2A35] border-[#E3B896] shadow-sm scale-105'
                    : 'bg-[#18313D] text-white/80 border-white/15 hover:border-white/30'
                }`}
              >
                {trade}
              </button>
            );
          })}
        </div>

        {/* Town Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <label htmlFor="town-input" className="text-xs text-white/70 font-medium shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#E3B896]" />
            <span>Town or City:</span>
          </label>
          <input
            id="town-input"
            type="text"
            value={town}
            onChange={handleTownChange}
            placeholder="e.g. Galway, Limerick, Cork..."
            className="flex-1 bg-[#18313D] border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E3B896] focus:ring-1 focus:ring-[#E3B896]"
          />
        </div>

        {/* Visual Mock Search Bar typing out live */}
        <div className="mt-1 bg-[#0F2027] rounded-xl p-3 border border-white/10 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-[#E3B896] shrink-0" />
          <div className="font-mono text-xs text-white/90 truncate">
            Search: <span className="text-[#E3B896] font-bold">{selectedTrade.toLowerCase()} in {town || 'Galway'}</span>
          </div>
          <span className="text-[10px] text-white/40 ml-auto hidden sm:inline">Visual simulation only</span>
        </div>
      </div>

      {/* Action CTA Block */}
      <div className="flex flex-col items-center gap-3 mt-1">
        <button
          type="button"
          onClick={handleCtaClick}
          className="min-h-[50px] inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#E3B896] hover:bg-[#D4A379] text-[#0F2A35] font-bold text-sm sm:text-base transition-all duration-200 shadow-xl hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3B896]"
        >
          <span>Talk to Us</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <a
          href="#pricing"
          onClick={handleScrollToPricing}
          className="text-xs text-white/70 hover:text-white underline decoration-white/30 underline-offset-4 transition-colors cursor-pointer"
        >
          See pricing &amp; packages
        </a>

        {/* Footnote statement */}
        <p className="text-[11px] text-white/50 max-w-lg mt-2 leading-relaxed">
          Illustrative story. Search results vary and take time to build. We never promise rankings or a set number of enquiries.
        </p>
      </div>
    </div>
  );
}
