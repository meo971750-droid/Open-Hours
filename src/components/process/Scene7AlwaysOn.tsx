import React, { useState } from 'react';
import { PhoneCall, Moon, Bot, Inbox, CheckCircle2, Clock, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

type CallerOption = 'quote' | 'leak' | 'pricing';

export default function Scene7AlwaysOn({ progress, isActive, isMobile, onInteract }: SceneProps) {
  const [selectedOption, setSelectedOption] = useState<CallerOption>('leak');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const hasVoice = Boolean(config.features.voiceAgent);
  const hasTextBack = Boolean(config.features.missedCallTextBack || config.features.afterHoursAutoReply);
  const voiceAgentTag = config.wayOfWorking.voiceAgentTag || 'Optional add-on';

  // Timing: 20% entrance, 45% main animation (0.20 to 0.65), 20% HOLD (0.65 to 0.85), 15% exit (0.85 to 1.0)
  const enterProgress = Math.min(1, Math.max(0, progress / 0.2));
  const exitProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.15));

  const xOffset = isMobile ? 0 : (1 - enterProgress) * -40 + exitProgress * 40;
  const opacity = isMobile ? 1 : Math.min(enterProgress, 1 - exitProgress);

  const optionDetails = {
    leak: {
      callerLabel: 'Leak after hours',
      callerSay: 'We have water dripping through the ceiling from the storm.',
      callerName: 'Tom Murphy',
      callerJob: 'Emergency roof leak repair',
      isUrgent: true,
      tag: 'Marked for call back (Urgent)',
    },
    quote: {
      callerLabel: 'Quote request',
      callerSay: 'Looking for an estimate to re-slate an extension.',
      callerName: 'Sarah Higgins',
      callerJob: 'Extension slate re-roofing',
      isUrgent: false,
      tag: 'Quote requested',
    },
    pricing: {
      callerLabel: 'Question about pricing',
      callerSay: 'Just wondering how your call-out charges or estimates work.',
      callerName: 'Michael Conneely',
      callerJob: 'Pricing & call-out inquiry',
      isUrgent: false,
      tag: 'Pricing inquiry',
    },
  };

  const handleSelectOption = (opt: CallerOption) => {
    setSelectedOption(opt);
    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteract) onInteract();
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReplayKey((k) => k + 1);
  };

  const currentOption = optionDetails[selectedOption];

  return (
    <div
      key={replayKey}
      style={{
        transform: `translateX(${xOffset}px)`,
        opacity,
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease-out',
      }}
      className="w-full max-w-4xl mx-auto flex flex-col gap-4 select-none"
    >
      {/* Top Banner with Option Chips & Replay */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold">
            <Moon className="w-3.5 h-3.5" />
            <span>After-Hours System</span>
          </span>
          {hasVoice && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#E3B896]/20 text-[#E3B896] border border-[#E3B896]/30 text-[11px] font-medium">
              {voiceAgentTag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!hasInteracted && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E3B896]/20 border border-[#E3B896]/40 text-[#E3B896] text-[11px] font-medium animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>Tap a scenario to test</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay call demo"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Scenario Chooser Chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-white/60 mr-1">Choose caller need:</span>
        {(['leak', 'quote', 'pricing'] as CallerOption[]).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleSelectOption(opt)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              selectedOption === opt
                ? 'bg-[#E3B896] text-[#0F2A35] border-[#E3B896] shadow-md scale-105'
                : 'bg-[#18313D] text-white/80 border-white/15 hover:border-white/30'
            }`}
          >
            {optionDetails[opt].callerLabel}
          </button>
        ))}
      </div>

      {/* Main Conversation & Inbox Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Left Side: Subtitled Conversation Canvas */}
        <div className="md:col-span-7 bg-[#13242C] rounded-2xl border border-white/10 p-5 flex flex-col justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs text-white/70">
              <span className="font-semibold text-white/90">After-Hours Subtitled Call</span>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/50">
                <Clock className="w-3 h-3 text-[#E3B896]" />
                <span>9:15 PM · Evening</span>
              </div>
            </div>

            {hasVoice ? (
              <div className="mt-3 flex flex-col gap-2.5">
                {/* Assistant Introduction with Waveform */}
                <div className="bg-[#18313D] rounded-xl p-3 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E3B896] text-[#0F2A35] flex items-center justify-center font-bold">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">AI Phone Assistant</span>
                      <span className="text-[10px] text-emerald-300">Live conversation (No audio)</span>
                    </div>
                  </div>
                  {/* Subtle waveform animation */}
                  <div className="flex items-center gap-1 h-5">
                    {[8, 18, 12, 22, 10, 16, 8, 20].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}px` }}
                        className="w-1 bg-[#E3B896] rounded-full animate-pulse"
                      />
                    ))}
                  </div>
                </div>

                {/* Subtitle 1: Assistant statement */}
                <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10 text-xs animate-in fade-in">
                  <strong className="text-[#E3B896] block text-[11px] mb-0.5">
                    AI Assistant:
                  </strong>
                  <p className="text-white/90 italic">
                    "Hi, I'm an AI assistant for Sample Roofing Co. The team is off duty right now. Could I take your name, the job you need, and your postcode?"
                  </p>
                </div>

                {/* Subtitle 2: Caller response based on selected chip */}
                <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10 text-xs ml-4 animate-in fade-in">
                  <strong className="text-white/60 block text-[11px] mb-0.5">
                    Caller ({currentOption.callerName}):
                  </strong>
                  <p className="text-white/90">
                    "{currentOption.callerSay} Postcode H91."
                  </p>
                </div>
              </div>
            ) : hasTextBack ? (
              <div className="mt-3 flex flex-col gap-2.5">
                <div className="bg-[#18313D] p-3 rounded-xl border border-white/10 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-rose-400" />
                    <span className="text-white font-medium">Missed call at 9:15 PM</span>
                  </div>
                  <span className="text-white/50 text-[11px]">{currentOption.callerName}</span>
                </div>
                <div className="bg-[#1A3745] p-3 rounded-xl border border-[#E3B896]/30 text-xs">
                  <span className="text-[#E3B896] font-bold block text-[11px] mb-0.5">
                    Automated SMS Response:
                  </span>
                  <p className="text-white/90">
                    "Hi {currentOption.callerName}, saw you called! The team is off duty right now. Reply with your job details and postcode and we'll reply first thing in the morning."
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="text-[11px] text-white/50 border-t border-white/10 pt-2">
            Transparent disclosure · AI assistants introduce themselves with complete honesty
          </div>
        </div>

        {/* Right Side: Live Enquiry Inbox building up */}
        <div className="md:col-span-5 bg-[#172D38] rounded-2xl border border-white/10 p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs mb-3">
              <span className="font-semibold text-white/80 flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-[#E3B896]" />
                <span>Enquiry Inbox</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Live Log
              </span>
            </div>

            {/* Live enquiry card built from the caller choice */}
            <div className="bg-[#10222A] rounded-xl p-3.5 border border-white/10 flex flex-col gap-2 shadow-md animate-in slide-in-from-left duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{currentOption.callerName}</h4>
                  <span className="text-xs text-[#E3B896]">{currentOption.callerJob}</span>
                </div>
                {currentOption.isUrgent ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                    Urgent
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/60">
                    H91 Area
                  </span>
                )}
              </div>

              <div className="text-xs text-white/70 space-y-1 bg-white/[0.02] p-2 rounded border border-white/5">
                <div><strong>Phone:</strong> 087 123 4567</div>
                <div><strong>Status:</strong> {currentOption.tag}</div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-white/60">Automated Follow-up:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Follow-up sent</span>
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/65 mt-4 leading-relaxed border-t border-white/10 pt-2.5">
            Cause &amp; effect: Enquiries are logged and acknowledged immediately, ensuring customers don't call three other competitors while you sleep.
          </p>
        </div>
      </div>
    </div>
  );
}
