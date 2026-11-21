import React from 'react';
import { SceneProps } from './types';
import { config } from '../../config';

export function getActiveFrictionPairs() {
  const f = config.features;
  const base = [
    {
      nodeId: 'click',
      nodeIdx: 1,
      problem: 'No website to click: they move on.',
      fix: 'A clear website with one next step.',
    },
    {
      nodeId: 'website',
      nodeIdx: 2,
      problem: 'Hard to contact on mobile: they give up.',
      fix: 'Call and quote buttons on every page.',
    },
  ];

  if (f.missedCallTextBack || f.afterHoursAutoReply || f.voiceAgent) {
    base.push({
      nodeId: 'call',
      nodeIdx: 3,
      problem: 'Missed call after hours: they call someone else.',
      fix: 'Missed calls get handled.',
    });
  }

  if (f.enquiryTracking) {
    base.push({
      nodeId: 'followup',
      nodeIdx: 4,
      problem: 'No follow-up: the enquiry goes cold.',
      fix: 'Every enquiry is confirmed and logged.',
    });
  }

  return base;
}

export default function Scene2Journey({ isActive, animate = true }: SceneProps) {
  const animClass = animate && isActive ? 'oh-deliver-anim-slide' : 'oh-deliver-static';
  const steps = ['Search', 'Website', 'Call', 'Booked'];

  return (
    <div className="w-full flex flex-col justify-center gap-3 select-none">
      {/* Lightweight Inline SVG Path (no foreignObject, no filters) */}
      <svg className="w-full h-14" viewBox="0 0 320 56" fill="none" aria-hidden="true">
        <line x1="36" y1="28" x2="118" y2="28" stroke="#14624F" strokeWidth="2.5" strokeLinecap="round" />
        <line
          x1="126"
          y1="28"
          x2="284"
          y2="28"
          stroke="#A8EBD3"
          strokeWidth="2.5"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
        <circle cx="36" cy="28" r="8" fill="#14624F" />
        <circle cx="118" cy="28" r="8" fill="#FFFFFF" stroke="#0F4A3E" strokeWidth="2.5" />
        <circle cx="202" cy="28" r="7" fill="#F3F5F3" stroke="#475754" strokeWidth="1.5" />
        <circle cx="284" cy="28" r="7" fill="#F3F5F3" stroke="#475754" strokeWidth="1.5" />
      </svg>

      {/* Step Labels */}
      <div className="grid grid-cols-4 gap-1 text-center text-[10.5px] font-semibold text-[#0B1B22]">
        {steps.map((label, idx) => (
          <span key={label} className={idx >= 2 ? 'text-[#475754]' : 'text-[#0B1B22]'}>
            {label}
          </span>
        ))}
      </div>

      {/* Single Breakage Callout */}
      <div
        className={`rounded-xl bg-[#F3F5F3] border border-[rgba(11,27,34,0.1)] px-3 py-2.5 flex items-center justify-between gap-2 ${animClass}`}
      >
        <span className="text-[11.5px] font-semibold text-[#0B1B22]">Gap at step 2</span>
        <span className="px-2 py-0.5 rounded-full bg-[#0F4A3E] text-white text-[10px] font-semibold">
          Drop-off
        </span>
      </div>
    </div>
  );
}
