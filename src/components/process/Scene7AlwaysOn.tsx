import React from 'react';
import { PhoneCall, Moon, Bot, Inbox, CheckCircle2, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export default function Scene7AlwaysOn({ progress, isMobile, palette }: SceneProps) {
  const sampleTown = config.wayOfWorking.sampleTown || 'Galway';
  const hasVoice = Boolean(config.features.voiceAgent);
  const voiceAgentTag = config.wayOfWorking.voiceAgentTag || 'Optional add-on';

  // Autoplay Timeline (0.0 to 1.0)
  // 1: Phone rings late evening: 0.05 - 0.25
  // 2: Waveform & dialog unfolds: 0.25 - 0.65
  // 3: Live enquiry card builds in Inbox: 0.55 - 0.80
  // 4: Confirmation SMS flies to caller: 0.75 - 0.90
  // 5: Hold: 0.90 - 1.0

  const ringProgress = Math.min(1, Math.max(0, (progress - 0.05) / 0.20));
  const dialogProgress = Math.min(1, Math.max(0, (progress - 0.25) / 0.40));
  const inboxProgress = Math.min(1, Math.max(0, (progress - 0.55) / 0.25));
  const followUpProgress = Math.min(1, Math.max(0, (progress - 0.75) / 0.15));

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      <div className="absolute top-2 right-4 text-[10px] uppercase tracking-wider text-white/50 px-2 py-0.5 rounded bg-black/20 border border-white/10 z-20">
        Illustrative example
      </div>

      <div className="relative w-full max-w-5xl mx-auto flex-1 flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-2">
        {/* Left: Caller Phone UI */}
        <div className="w-full md:w-80 flex flex-col gap-3">
          <div className="bg-[#101C2E] border border-white/15 rounded-3xl p-4 shadow-2xl relative overflow-hidden">
            {/* Clock header */}
            <div className="flex items-center justify-between text-xs text-white/60 pb-3 border-b border-white/10">
              <span className="flex items-center gap-1 font-mono text-white/80">
                <Clock className="w-3.5 h-3.5 text-[#2DD4BF]" /> 9:42 PM
              </span>
              <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                <Moon className="w-3 h-3" /> After Hours
              </span>
            </div>

            {/* Calling animation */}
            <div className="my-4 flex flex-col items-center text-center">
              <div className="relative">
                {ringProgress < 0.8 && (
                  <div className="absolute -inset-2 rounded-full bg-[#F4B860] opacity-40 animate-ping" />
                )}
                <div className="w-14 h-14 rounded-full bg-[#F4B860] text-[#0A1220] flex items-center justify-center shadow-lg">
                  <PhoneCall className="w-6 h-6 animate-bounce" />
                </div>
              </div>
              <p className="font-bold text-sm text-white mt-2">Incoming Call</p>
              <p className="text-[11px] text-white/60">Homeowner in {sampleTown}</p>
            </div>

            {/* Conversation Flow or Missed Call Text-back */}
            {hasVoice ? (
              <div className="space-y-2 mt-2">
                {/* Voice waveform */}
                <div className="flex items-center justify-center gap-1 h-6">
                  {[4, 12, 22, 10, 18, 24, 14, 8, 20, 10].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-[#2DD4BF] rounded-full transition-all duration-200"
                      style={{
                        height: dialogProgress > 0.1 ? `${h}px` : '4px',
                        opacity: dialogProgress > 0.1 ? 0.9 : 0.3,
                      }}
                    />
                  ))}
                </div>

                {/* Subtitle Dialogue */}
                <div className="space-y-1.5 text-[10.5px]">
                  {dialogProgress > 0.2 && (
                    <div className="p-2 rounded-xl bg-white/10 text-white/90">
                      <p className="text-[9px] text-[#2DD4BF] font-bold">AI Assistant ({voiceAgentTag})</p>
                      <p>"Hello! This is the AI assistant for Sample Roofing. How can I help you tonight?"</p>
                    </div>
                  )}
                  {dialogProgress > 0.5 && (
                    <div className="p-2 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-white">
                      <p className="text-[9px] text-white/60 font-bold">Caller (Tom)</p>
                      <p>"Water is dripping through our kitchen ceiling from the storm."</p>
                    </div>
                  )}
                  {dialogProgress > 0.8 && (
                    <div className="p-2 rounded-xl bg-white/10 text-white/90">
                      <p className="text-[9px] text-[#2DD4BF] font-bold">AI Assistant</p>
                      <p>"I've logged this as an urgent repair for the team at 8 AM. May I take your phone and postcode?"</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Text-only Auto Reply */
              <div className="space-y-2 mt-2 text-[11px]">
                <div className="p-2 rounded-xl bg-white/10 text-white/80">
                  <p className="text-[9px] text-[#2DD4BF] font-bold">Instant SMS Triggered</p>
                  <p>"Hi, we missed your call. We're on jobs right now. How can we help?"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Enquiry Inbox & Auto Follow-up */}
        <div className="w-full md:w-96 flex flex-col gap-3">
          {/* Live Inbox Card */}
          <div
            style={{
              opacity: inboxProgress,
              transform: `translateY(${(1 - inboxProgress) * 16}px)`,
            }}
            className="bg-[#0C1726] border-2 border-[#2DD4BF]/60 rounded-3xl p-4 shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-[#2DD4BF]" />
                <span className="text-xs font-bold text-white">Live Enquiry Inbox</span>
              </div>
              <span className="text-[9px] bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold">
                Marked for call back (Urgent)
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs text-white/90">
              <div>
                <span className="text-[10px] text-white/50 block">Caller</span>
                <span className="font-semibold text-white">Tom Murphy</span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">Scope of work</span>
                <span className="text-[#2DD4BF] font-medium">Emergency roof storm leak</span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">Location</span>
                <span className="text-white/80">{sampleTown} (H91...)</span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">Time Recorded</span>
                <span className="text-white/60 text-[11px]">Tonight at 9:43 PM</span>
              </div>
            </div>
          </div>

          {/* Follow-up Sent Chip */}
          {followUpProgress > 0 && (
            <div
              style={{
                opacity: followUpProgress,
                transform: `translateX(${(1 - followUpProgress) * 15}px)`,
              }}
              className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-200 shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confirmation SMS dispatched to caller</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                Follow-up sent
              </span>
            </div>
          )}

          {/* Feature Tag */}
          <div className="text-[10px] text-white/40 text-center">
            {voiceAgentTag} · All messages logged directly into your private CRM / email
          </div>
        </div>
      </div>
    </div>
  );
}
