import React from 'react';
import { Calendar, MapPin, ShieldAlert } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene6Rank({
  progress,
  stepIndex,
  stepProgress,
  activeHighlight,
  isMobile,
  palette,
}: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';

  // 3 Steps mapping:
  // Step 0: 'start': Local rankings build slowly
  // Step 1: 'month2': Groundwork adds up, month by month
  // Step 2: 'honesty': Nobody can promise a position. We never do.

  const milestones = [
    { label: 'Week 1', desc: 'Setup', at: 0 },
    { label: 'Month 2', desc: 'Indexing', at: 1 },
    { label: 'Month 4–6', desc: 'Signals build', at: 2 },
  ];

  const timeTravelPct = stepIndex === 0 ? 25 : stepIndex === 1 ? 65 : 100;
  const isVisibleInList = stepIndex >= 1;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none px-2">
      <div className="absolute top-1 right-2 text-[10px] uppercase tracking-wider text-white/50 px-2 py-0.5 rounded bg-black/20 border border-white/10 z-20">
        Illustrative. Results vary and take time.
      </div>

      <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-3 py-1">
        {/* Timeline Slider with Month Markers */}
        <div
          className={`w-full max-w-xl bg-white/10 backdrop-blur-md rounded-xl p-3 border shadow-md flex flex-col gap-2 transition-all duration-300 ${
            activeHighlight === 'month2'
              ? 'border-[#F2B544] ring-2 ring-[#F2B544]/25'
              : 'border-white/20'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#F2B544]" /> Realistic Timeline
            </span>
            <span className="text-[10px] text-[#F2B544] font-mono">
              {stepIndex === 0 ? 'Week 1' : stepIndex === 1 ? 'Month 2' : 'Month 4 – Month 6'}
            </span>
          </div>

          {/* Timeline Bar */}
          <div className="relative w-full h-2 bg-black/30 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-amber-400 to-[#F2B544] rounded-full transition-all duration-500"
              style={{ width: `${timeTravelPct}%` }}
            />
          </div>

          {/* Month Marker Labels */}
          <div className="flex justify-between items-center text-[9.5px] text-white/70">
            {milestones.map((m) => (
              <div key={m.label} className="flex flex-col items-center">
                <span className="font-bold text-white/90">{m.label}</span>
                <span className="text-[8.5px] text-white/50">{m.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Local Results Evolution Box */}
        <div className="w-full max-w-md bg-[#131933]/90 rounded-xl p-3 border border-white/15 shadow-xl space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[11px] text-white/70">
            <span className="font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#F2B544]" /> Local Search in {sampleTown}
            </span>
            <span className="text-[9.5px] text-white/50">Results build over time</span>
          </div>

          <div className="p-1.5 rounded bg-white/5 text-[11px] text-white/80 flex items-center justify-between">
            <span className="font-medium text-white">Sample Roofing Co. A</span>
            <span className="text-[9.5px] text-white/40">Established</span>
          </div>

          {/* "Your business" position evolving over time */}
          <div
            className={`p-2 rounded-lg border transition-all duration-300 ${
              isVisibleInList
                ? 'bg-[#F2B544]/15 border-[#F2B544] shadow ring-1 ring-[#F2B544]/30'
                : 'bg-white/5 border-dashed border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-[#F2B544]">Your business</p>
                <p className="text-[9.5px] text-white/70 mt-0.5">
                  {isVisibleInList ? '✓ Profile, site, and citations active' : 'Not yet visible in top searches'}
                </p>
              </div>
              <span
                className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                  isVisibleInList ? 'bg-[#F2B544] text-[#1B1F4B]' : 'bg-white/10 text-white/50'
                }`}
              >
                {isVisibleInList ? 'Appearing' : 'Starting'}
              </span>
            </div>
          </div>
        </div>

        {/* Permanent Honesty Notice */}
        <div
          className={`px-3 py-1.5 rounded-lg border text-[10.5px] max-w-md text-center flex items-center justify-center gap-1.5 transition-all duration-300 ${
            activeHighlight === 'honesty'
              ? 'bg-[#F2B544]/20 border-[#F2B544] text-white ring-2 ring-[#F2B544]/40 font-medium'
              : 'bg-black/30 border-white/15 text-white/80'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#F2B544] shrink-0" />
          <span>Nobody can promise a position. We never do.</span>
        </div>
      </div>
    </div>
  );
}
