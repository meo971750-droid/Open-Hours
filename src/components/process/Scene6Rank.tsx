import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { SceneProps } from './types';

export default function Scene6Rank({ isActive, animate = true }: SceneProps) {
  const animClass = animate && isActive ? 'oh-deliver-anim-slide' : 'oh-deliver-static';
  const milestones = [
    { label: 'Week 1', value: 'Site & profile live' },
    { label: 'Month 2', value: 'Pages indexed' },
    { label: 'Month 4–6', value: 'Steady local trust' },
  ];

  return (
    <div className="w-full flex flex-col justify-center gap-2.5 select-none">
      {/* Steady Step-Up Bars */}
      <div className="rounded-xl bg-white/10 border border-white/15 p-3 space-y-2">
        <div className="flex items-end gap-2 h-14 pt-2" aria-hidden="true">
          <div className="flex-1 h-5 rounded-md bg-[#14624F]/70" />
          <div className="flex-1 h-8 rounded-md bg-[#1E9E6A]/80" />
          <div className={`flex-1 h-12 rounded-md bg-[#6FD6B0] ${animClass}`} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {milestones.map((m) => (
            <div key={m.label}>
              <p className="text-[10.5px] font-semibold text-white">{m.label}</p>
              <p className="text-[9px] text-white/75 leading-tight">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Honesty Notice */}
      <div className="rounded-xl bg-black/30 border border-white/15 px-3 py-2 flex items-center justify-center gap-1.5 text-[10.5px] text-white/90">
        <ShieldAlert className="w-3.5 h-3.5 text-[#A8EBD3] shrink-0" strokeWidth={1.75} />
        <span>Nobody can promise a ranking. We never do.</span>
      </div>
    </div>
  );
}
