import React from 'react';
import { Calendar, Clock, MapPin, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene6Rank({ progress, isMobile, palette }: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';

  // Autoplay Timeline (0.0 to 1.0)
  // Slowest scene (13s):
  // 1: Timeline bar & month milestones draw: 0.05 - 0.20
  // 2: Marker dot slowly moves along Month 1 -> Month 6: 0.15 - 0.85
  // 3: Search results list adapts as time passes:
  //    Week 1 (0.15 - 0.35): "Not listed"
  //    Month 2 (0.35 - 0.55): Enters bottom of visible listings
  //    Month 4 (0.55 - 0.75): Climbs up into standard local view (still below top competitors)
  //    Month 6 (0.75 - 0.90): Stable presence with reviews & website active
  // 4: Hold 0.90 - 1.0

  const timeTravelProgress = Math.min(1, Math.max(0, (progress - 0.15) / 0.70));
  const isLightening = timeTravelProgress > 0.5;

  const milestones = [
    { label: 'Week 1', desc: 'Groundwork & site launch', at: 0.0 },
    { label: 'Month 2', desc: 'Indexing & citations', at: 0.33 },
    { label: 'Month 4', desc: 'Local signals build', at: 0.66 },
    { label: 'Month 6', desc: 'Established presence', at: 1.0 },
  ];

  // Dynamic ranking list representation without fake numbers or #1 claims
  let statusText = 'Not listed yet';
  let yourBizPosition = 4; // off or at bottom
  if (timeTravelProgress > 0.66) {
    statusText = 'Visible in local results';
    yourBizPosition = 2;
  } else if (timeTravelProgress > 0.33) {
    statusText = 'Appearing in local list';
    yourBizPosition = 3;
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      <div className="absolute top-2 right-4 text-[10px] uppercase tracking-wider text-white/50 px-2 py-0.5 rounded bg-black/20 border border-white/10 z-20">
        Illustrative. Results vary and take time.
      </div>

      <div className="relative w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center gap-6 px-4 py-2">
        {/* Timeline Slider with Month Markers */}
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#F2B544]" /> Realistic Timeline
            </span>
            <span className="text-[11px] text-[#F2B544] font-mono">
              {timeTravelProgress < 0.25
                ? 'Week 1'
                : timeTravelProgress < 0.55
                ? 'Month 2'
                : timeTravelProgress < 0.8
                ? 'Month 4'
                : 'Month 6'}
            </span>
          </div>

          {/* Timeline Bar with flowing progress */}
          <div className="relative w-full h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-amber-400 to-[#F2B544] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, timeTravelProgress * 100)}%` }}
            />
          </div>

          {/* Month Marker Labels */}
          <div className="flex justify-between items-center text-[10px] text-white/70">
            {milestones.map((m) => (
              <div key={m.label} className="flex flex-col items-center">
                <span className="font-bold text-white/90">{m.label}</span>
                <span className="text-[9px] text-white/50 hidden sm:inline">{m.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Local Results Evolution Box */}
        <div className="w-full max-w-md bg-[#131933]/90 rounded-2xl p-4 border border-white/15 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs text-white/70">
            <span className="font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F2B544]" /> Local Search in {sampleTown}
            </span>
            <span className="text-[10px] text-white/50">Simulated progression</span>
          </div>

          {/* Sample competitor listings */}
          <div className="p-2 rounded-lg bg-white/5 text-xs text-white/80 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Sample Roofing Co. A</p>
              <p className="text-[10px] text-emerald-400">★ High rating · Website active</p>
            </div>
            <span className="text-[10px] text-white/40">Established</span>
          </div>

          <div className="p-2 rounded-lg bg-white/5 text-xs text-white/80 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Sample Roofing Co. B</p>
              <p className="text-[10px] text-emerald-400">★ High rating · Website active</p>
            </div>
            <span className="text-[10px] text-white/40">Established</span>
          </div>

          {/* "Your business" position evolving over time */}
          <div
            className={`p-2.5 rounded-xl border transition-all duration-500 ${
              timeTravelProgress > 0.35
                ? 'bg-[#F2B544]/15 border-[#F2B544] shadow-lg'
                : 'bg-white/5 border-dashed border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[#F2B544]">Your business</p>
                <p className="text-[10px] text-white/70 mt-0.5">
                  {timeTravelProgress > 0.66
                    ? '✓ Complete profile, active website, local citations'
                    : timeTravelProgress > 0.33
                    ? '✓ Google verified, initial signals indexing'
                    : 'Not yet visible in top local searches'}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  timeTravelProgress > 0.35
                    ? 'bg-[#F2B544] text-[#1B1F4B]'
                    : 'bg-white/10 text-white/50'
                }`}
              >
                {statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Permanent Honesty Notice */}
        <div className="px-4 py-2 rounded-xl bg-black/30 border border-white/15 text-[11px] text-white/80 max-w-lg text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#F2B544] shrink-0" />
          <span>Rankings take months. Nobody can promise a position.</span>
        </div>
      </div>
    </div>
  );
}
