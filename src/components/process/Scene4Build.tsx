import React from 'react';
import { Phone, Check } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene4Build({ isActive, animate = true }: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Sampletown';
  const animClass = animate && isActive ? 'oh-deliver-anim-rise' : 'oh-deliver-static';

  return (
    <div className="w-full flex flex-col justify-center gap-2.5 select-none">
      {/* Compact Trade Website Card */}
      <div className="w-full rounded-xl bg-[#0A3A30] border border-white/15 p-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
          <span className="text-[11.5px] font-semibold text-white truncate">Sample Roofing</span>
          <span className="px-2.5 py-1 rounded-full bg-[#DDF4EA] text-[#0F4A3E] font-bold text-[10px] inline-flex items-center gap-1 shrink-0">
            <Phone className="w-2.5 h-2.5" strokeWidth={2} />
            Call Now
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12.5px] font-semibold text-white leading-snug">
              Roof repairs in {sampleTown}
            </p>
            <p className="text-[10px] text-white/75">Written quotes sent fast</p>
          </div>
          <span className="px-2.5 py-1.5 rounded-lg bg-[#14624F] text-white text-[10px] font-semibold shrink-0">
            Get quote
          </span>
        </div>
      </div>

      {/* Confirmation Row */}
      <div
        className={`rounded-xl bg-white/10 border border-[#6FD6B0]/35 px-3 py-2 flex items-center justify-between gap-2 ${animClass}`}
      >
        <span className="text-[11px] font-medium text-white truncate">Enquiry saved &amp; replied</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#A8EBD3] shrink-0">
          <Check className="w-3 h-3" strokeWidth={2.2} />
          Logged
        </span>
      </div>
    </div>
  );
}
