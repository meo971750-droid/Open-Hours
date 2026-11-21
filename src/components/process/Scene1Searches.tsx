import React from 'react';
import { Search, MapPin, Globe } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene1Searches({ isActive, animate = true }: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Sampletown';
  const sampleTrade = config.wayOfWorking.sampleTrade || 'roofer';
  const animClass = animate && isActive ? 'oh-deliver-anim-rise' : 'oh-deliver-static';

  return (
    <div className="w-full flex flex-col justify-center gap-2.5 select-none">
      {/* Clean Maps Search Bar */}
      <div className="w-full bg-white text-[#0B1B22] rounded-xl px-3 py-2 flex items-center gap-2 border border-white/20">
        <Search className="w-3.5 h-3.5 text-[#14624F] shrink-0" strokeWidth={1.75} />
        <span className="text-[12px] font-medium truncate flex-1">
          {sampleTrade} near me · {sampleTown}
        </span>
        <span className="text-[9.5px] font-semibold text-white bg-[#14624F] px-2 py-0.5 rounded-full shrink-0">
          Maps
        </span>
      </div>

      {/* Competitor vs Your Listing */}
      <div className="flex flex-col gap-2">
        <div className="bg-white text-[#0B1B22] rounded-xl px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-md bg-[#DDF4EA] text-[#14624F] flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
            </span>
            <span className="text-[11.5px] font-semibold truncate">Local Competitor</span>
          </div>
          <span className="px-2 py-0.5 bg-[#0F4A3E] text-white text-[9.5px] font-semibold rounded-md flex items-center gap-1 shrink-0">
            <Globe className="w-2.5 h-2.5 text-[#A8EBD3]" strokeWidth={1.75} />
            Website
          </span>
        </div>

        <div
          className={`bg-[#0A3A30] text-white rounded-xl px-3 py-2 border border-dashed border-[#A8EBD3]/45 flex items-center justify-between gap-2 ${animClass}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-md bg-white/10 text-[#A8EBD3] flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold text-[#A8EBD3] truncate">Your business</p>
              <p className="text-[9.5px] text-white/75">Phone only</p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-white/10 text-white border border-white/20 text-[9.5px] font-semibold rounded-md shrink-0">
            No website
          </span>
        </div>
      </div>
    </div>
  );
}
