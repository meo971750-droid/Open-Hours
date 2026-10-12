import React from 'react';
import { DesignSlide } from '../content';

interface DesignPreviewProps {
  slide: DesignSlide;
  className?: string;
  isMobileMockup?: boolean;
}

export default function DesignPreview({
  slide,
  className = '',
  isMobileMockup = false,
}: DesignPreviewProps) {
  // If the slide provides custom image assets
  if (isMobileMockup && slide.mobileImage) {
    return (
      <img
        src={slide.mobileImage}
        alt={`Mobile website preview for ${slide.name}`}
        className={`w-full h-full object-cover object-top select-none ${className}`}
      />
    );
  }

  if (!isMobileMockup && slide.image) {
    return (
      <img
        src={slide.image}
        alt={`Website design for ${slide.name}`}
        className={`w-full h-full object-cover object-top select-none ${className}`}
      />
    );
  }

  // Built-in crisp HTML/CSS trade website preview (matches polaroid exactly)
  return (
    <div
      style={{ backgroundColor: slide.palette.bg }}
      className={`w-full h-full flex flex-col justify-between p-3 select-none ${className}`}
    >
      {/* Browser Top Bar */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(15,42,53,0.06)] shrink-0">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E57373]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB74D]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#81C784]" />
        </div>
        <span className="text-[9px] font-mono text-[#5E6F77]/80 truncate max-w-[120px]">
          {slide.town.toLowerCase()}.trade
        </span>
        <div className="w-3" />
      </div>

      {/* Mini Site Hero */}
      <div className="my-auto py-1">
        <div
          style={{ color: slide.palette.ink }}
          className="text-[10px] font-bold tracking-tight truncate mb-0.5"
        >
          {slide.name}
        </div>
        <h4
          style={{ color: slide.palette.ink }}
          className="text-[13px] sm:text-[14px] font-bold leading-tight tracking-tight line-clamp-2 mb-1.5"
        >
          {slide.headline}
        </h4>
        <div className="flex items-center gap-1.5">
          <div
            style={{
              backgroundColor: slide.palette.primary,
              color: '#FFFFFF',
            }}
            className="px-2 py-0.5 rounded text-[9px] font-semibold shadow-2xs"
          >
            Call now
          </div>
          <div
            style={{
              backgroundColor: slide.palette.accent,
              color: slide.palette.primary,
            }}
            className="px-2 py-0.5 rounded text-[9px] font-bold shadow-2xs"
          >
            Quote
          </div>
        </div>
      </div>

      {/* 3 Project Preview Boxes */}
      <div className="grid grid-cols-3 gap-1 my-0.5 shrink-0">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            style={{
              background: `linear-gradient(135deg, ${slide.palette.primary}20, ${slide.palette.accent}35)`,
              borderColor: `${slide.palette.primary}20`,
            }}
            className="h-7 rounded border flex items-center justify-center"
          >
            <span className="text-[8px] font-medium text-[#5E6F77]">
              P{num}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Reviews Strip */}
      <div className="pt-1 border-t border-[rgba(15,42,53,0.06)] flex items-center justify-between text-[8px] text-[#5E6F77] shrink-0">
        <span>Google reviews appear here</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E6B]" />
      </div>
    </div>
  );
}
