import React from 'react';
import { MapPin, Globe, Star } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene5Findable({ isActive, animate = true }: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Sampletown';
  const animClass = animate && isActive ? 'oh-deliver-anim-rise' : 'oh-deliver-static';

  const signals = [
    { label: 'Google Maps', sub: 'Profile ready', icon: MapPin },
    { label: 'Area pages', sub: `${sampleTown} + nearby`, icon: Globe },
    { label: 'Review link', sub: 'Sent after jobs', icon: Star },
  ];

  return (
    <div className="w-full flex flex-col justify-center gap-2.5 select-none">
      {/* Core Business Signal */}
      <div className="rounded-xl bg-[#0F4A3E] text-white px-3 py-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold truncate">Sample Roofing</p>
          <p className="text-[10px] text-[#A8EBD3] truncate">{sampleTown}</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-white/15 text-white text-[9.5px] font-semibold shrink-0">
          Verified signals
        </span>
      </div>

      {/* 3 Connected Signals */}
      <div className={`grid grid-cols-1 gap-1.5 ${animClass}`}>
        {signals.map((sig) => (
          <div
            key={sig.label}
            className="rounded-xl bg-[#F9FAF9] border border-[rgba(11,27,34,0.1)] px-3 py-1.5 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded-md bg-[#DDF4EA] text-[#14624F] flex items-center justify-center shrink-0">
                <sig.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
              </span>
              <span className="text-[11px] font-semibold text-[#0B1B22] truncate">{sig.label}</span>
            </div>
            <span className="text-[10px] text-[#475754] shrink-0">{sig.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
