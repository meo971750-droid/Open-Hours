import React from 'react';
import { Check } from 'lucide-react';
import { SceneProps } from './types';
import { getActiveFrictionPairs } from './Scene2Journey';

export { getActiveFrictionPairs };

export default function Scene3Solve({ isActive, animate = true }: SceneProps) {
  const animClass = animate && isActive ? 'oh-deliver-anim-rise' : 'oh-deliver-static';
  const rows = [
    { gap: 'No site to click', fix: 'Clear local site' },
    { gap: 'Missed call', fix: 'Fast text-back' },
    { gap: 'Lost quote', fix: 'Logged to inbox' },
  ];

  return (
    <div className="w-full flex flex-col justify-center gap-2 select-none">
      {rows.map((row, idx) => (
        <div
          key={row.gap}
          className={`rounded-xl border border-[rgba(11,27,34,0.1)] bg-[#F9FAF9] px-3 py-2 flex items-center justify-between gap-2 ${
            idx === 2 ? animClass : ''
          }`}
        >
          <span className="text-[11px] text-[#475754] line-through truncate">{row.gap}</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0F4A3E] bg-[#DDF4EA] px-2.5 py-0.5 rounded-full shrink-0">
            <Check className="w-3 h-3 text-[#14624F]" strokeWidth={2.2} />
            {row.fix}
          </span>
        </div>
      ))}
    </div>
  );
}
