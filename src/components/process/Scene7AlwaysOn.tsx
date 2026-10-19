import React from 'react';
import { PhoneCall, Moon, Inbox, CheckCircle2, Clock } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene7AlwaysOn({
  progress,
  stepIndex,
  stepProgress,
  activeHighlight,
  isMobile,
  palette,
}: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';
  const hasVoice = Boolean(config.features.voiceAgent);
  const voiceAgentTag = config.wayOfWorking.voiceAgentTag || 'Optional add-on';

  // 4 Steps mapping:
  // Step 0: 'incoming-call': Homeowner calls late
  // Step 1: 'ai-intro': AI Assistant answers upfront
  // Step 2: 'ai-dialog': Takes name, job, postcode
  // Step 3: 'inbox-urgent': Logged and follow-up sent

  const isRinging = stepIndex === 0;
  const isDialogue = stepIndex >= 1;
  const isInboxVisible = stepIndex >= 3;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none px-2">
      <div className="absolute top-1 right-2 text-[10px] uppercase tracking-wider text-white/50 px-2 py-0.5 rounded bg-black/20 border border-white/10 z-20">
        Illustrative example
      </div>

      <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 py-1">
        {/* Left: Caller Phone UI */}
        <div className="w-full md:w-72 flex flex-col gap-2 shrink-0">
          <div
            className={`bg-[#101C2E] border rounded-2xl p-3 shadow-xl relative overflow-hidden transition-all duration-300 ${
              isRinging || activeHighlight === 'incoming-call'
                ? 'border-[#F4B860] ring-2 ring-[#F4B860]/40'
                : 'border-white/15'
            }`}
          >
            {/* Clock header */}
            <div className="flex items-center justify-between text-[11px] text-white/60 pb-2 border-b border-white/10">
              <span className="flex items-center gap-1 font-mono text-white/80">
                <Clock className="w-3 h-3 text-[#2DD4BF]" /> 9:42 PM
              </span>
              <span className="flex items-center gap-1 text-[9px] text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded-full">
                <Moon className="w-2.5 h-2.5" /> After Hours
              </span>
            </div>

            {/* Calling animation */}
            <div className="my-2 flex flex-col items-center text-center">
              <div className="relative">
                {isRinging && (
                  <div className="absolute -inset-1.5 rounded-full bg-[#F4B860] opacity-40 animate-ping" />
                )}
                <div className="w-10 h-10 rounded-full bg-[#F4B860] text-[#0A1220] flex items-center justify-center shadow">
                  <PhoneCall className={`w-4 h-4 ${isRinging ? 'animate-bounce' : ''}`} />
                </div>
              </div>
              <p className="font-bold text-xs text-white mt-1">Incoming Call</p>
              <p className="text-[10px] text-white/60">Homeowner in {sampleTown}</p>
            </div>

            {/* Conversation Flow or Missed Call Text-back */}
            {hasVoice ? (
              <div className="space-y-1.5 mt-1">
                {/* Voice waveform */}
                <div className="flex items-center justify-center gap-1 h-4">
                  {[4, 10, 18, 8, 14, 20, 12, 6, 16, 8].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-[#2DD4BF] rounded-full transition-all duration-200"
                      style={{
                        height: isDialogue ? `${h}px` : '3px',
                        opacity: isDialogue ? 0.9 : 0.3,
                      }}
                    />
                  ))}
                </div>

                {/* Subtitle Dialogue */}
                <div className="space-y-1 text-[9.5px]">
                  {stepIndex >= 1 && (
                    <div
                      className={`p-1.5 rounded-lg text-white/90 transition-all duration-300 ${
                        activeHighlight === 'ai-intro'
                          ? 'bg-[#2DD4BF]/20 ring-1 ring-[#2DD4BF]/40'
                          : 'bg-white/10'
                      }`}
                    >
                      <p className="text-[8.5px] text-[#2DD4BF] font-bold">AI Assistant ({voiceAgentTag})</p>
                      <p>"Hello! This is the AI assistant for Sample Roofing. How can I help tonight?"</p>
                    </div>
                  )}
                  {stepIndex >= 2 && (
                    <div
                      className={`p-1.5 rounded-lg text-white transition-all duration-300 ${
                        activeHighlight === 'ai-dialog'
                          ? 'bg-[#2DD4BF]/25 ring-1 ring-[#2DD4BF]/40 border border-[#2DD4BF]/40'
                          : 'bg-[#2DD4BF]/15 border border-[#2DD4BF]/30'
                      }`}
                    >
                      <p className="text-[8.5px] text-white/60 font-bold">Caller</p>
                      <p>"Water dripping from kitchen ceiling."</p>
                      <p className="text-[8.5px] text-[#2DD4BF] font-bold mt-0.5">AI Assistant</p>
                      <p>"Logged as urgent. May I have your name and postcode?"</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Text-only Auto Reply */
              <div className="space-y-1 mt-1 text-[10px]">
                <div className="p-1.5 rounded-lg bg-white/10 text-white/80">
                  <p className="text-[8.5px] text-[#2DD4BF] font-bold">Instant SMS Triggered</p>
                  <p>"Hi, we missed your call. We're on jobs right now. How can we help?"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Enquiry Inbox & Auto Follow-up */}
        <div className="w-full md:w-80 flex flex-col gap-2 shrink-0">
          {/* Live Inbox Card */}
          <div
            className={`bg-[#0C1726] border rounded-2xl p-3 shadow-xl transition-all duration-300 ${
              isInboxVisible
                ? 'border-[#2DD4BF] ring-2 ring-[#2DD4BF]/30 shadow-[0_0_20px_rgba(45,212,191,0.25)]'
                : 'border-white/15'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <Inbox className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span className="text-[11px] font-bold text-white">Live Enquiry Inbox</span>
              </div>
              <span className="text-[8.5px] bg-red-500/20 text-red-300 border border-red-500/40 px-1.5 py-0.2 rounded-full font-bold">
                Urgent Call Back
              </span>
            </div>

            <div className="mt-2 space-y-1 text-[11px] text-white/90">
              <div>
                <span className="text-[9px] text-white/50 block">Caller</span>
                <span className="font-semibold text-white">Tom Murphy</span>
              </div>
              <div>
                <span className="text-[9px] text-white/50 block">Scope of work</span>
                <span className="text-[#2DD4BF] font-medium">Emergency roof storm leak</span>
              </div>
              <div>
                <span className="text-[9px] text-white/50 block">Location</span>
                <span className="text-white/80">{sampleTown} (H91...)</span>
              </div>
            </div>
          </div>

          {/* Follow-up Sent Chip */}
          {isInboxVisible && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-2 flex items-center justify-between text-[11px] text-emerald-200 shadow">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Confirmation SMS dispatched</span>
              </div>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                Sent
              </span>
            </div>
          )}

          <div className="text-[9px] text-white/40 text-center">
            {voiceAgentTag} · Enquiries logged directly into your CRM
          </div>
        </div>
      </div>
    </div>
  );
}
