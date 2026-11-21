import React from 'react';
import { PhoneCall, CheckCircle2, Clock } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene7AlwaysOn({ isActive, animate = true }: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Sampletown';
  const hasVoice = Boolean(config.features.voiceAgent);
  const voiceAgentTag = config.wayOfWorking.voiceAgentTag || 'Optional add-on';
  const animClass = animate && isActive ? 'oh-deliver-anim-rise' : 'oh-deliver-static';

  return (
    <div className="w-full flex flex-col justify-center gap-2.5 select-none">
      {/* Incoming After-Hours Call */}
      <div className="rounded-xl bg-[#0A3A30] border border-white/15 p-3 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-white/80">
          <span className="inline-flex items-center gap-1 font-mono tabular-nums text-white">
            <Clock className="w-3 h-3 text-[#6FD6B0]" strokeWidth={1.75} />
            9:42 PM
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#A8EBD3] text-[9.5px] font-semibold">
            {hasVoice ? voiceAgentTag : 'Auto text-back'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#14735A] text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[11.5px] font-semibold text-white truncate">
              {hasVoice ? 'AI assistant answered upfront' : 'Missed-call SMS sent'}
            </p>
            <p className="text-[10px] text-white/75 truncate">
              {hasVoice ? 'Always says it is an AI' : 'Automatic reply in seconds'}
            </p>
          </div>
        </div>
      </div>

      {/* Logged Morning Job */}
      <div
        className={`rounded-xl bg-white/10 border border-[#6FD6B0]/35 px-3 py-2 flex items-center justify-between gap-2 ${animClass}`}
      >
        <span className="text-[11px] font-medium text-white truncate">
          Tom M. · Roof leak · {sampleTown}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#A8EBD3] shrink-0">
          <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
          Logged
        </span>
      </div>
    </div>
  );
}
