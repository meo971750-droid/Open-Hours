import React, { useState } from 'react';
import { Search, MousePointer, Globe, PhoneCall, CheckCircle2, AlertTriangle, RotateCcw, User, UserX } from 'lucide-react';
import { SceneProps } from './types';
import { getActiveFrictionPairs } from './Scene3Solve';

interface JourneyStepData {
  id: string;
  stepNum: string;
  title: string;
  icon: any;
  customerThought: string;
  frictionProblem: string | null;
  frictionDetail: string;
}

export default function Scene2Journey({ progress, isActive, isMobile, onInteract }: SceneProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  // Timing: 20% entrance, 45% main animation (0.20 to 0.65), 20% HOLD (0.65 to 0.85), 15% exit (0.85 to 1.0)
  const enterProgress = Math.min(1, Math.max(0, progress / 0.2));
  const exitProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.15));

  const xOffset = isMobile ? 0 : (1 - enterProgress) * -40 + exitProgress * 40;
  const opacity = isMobile ? 1 : Math.min(enterProgress, 1 - exitProgress);

  // Homeowner traveling progression across 0.20 to 0.65
  const animProgress = isMobile ? 1 : Math.min(1, Math.max(0, (progress - 0.2) / 0.45));

  // Consistency rule: Scene 2 and Scene 3 share the exact same set of friction points
  const activePairs = getActiveFrictionPairs();
  const activeProblems = new Set(activePairs.map((p) => p.problem));

  const steps: JourneyStepData[] = [
    {
      id: 'search',
      stepNum: '01',
      title: 'Search',
      icon: Search,
      customerThought: 'Looking for a reliable local trade nearby.',
      frictionProblem: activeProblems.has('No website to click') ? 'No website to click' : null,
      frictionDetail: 'Searcher sees competitor links with photos and reviews, skips the profile with just a mobile number.',
    },
    {
      id: 'click',
      stepNum: '02',
      title: 'Click',
      icon: MousePointer,
      customerThought: 'Wants to see proof of recent work and verify insurance.',
      frictionProblem: activeProblems.has('Hard to contact on mobile') ? 'Hard to contact on mobile' : null,
      frictionDetail: 'Taps on phone but page is cluttered, slow, or has no direct tap-to-call button. Backs out.',
    },
    {
      id: 'website',
      stepNum: '03',
      title: 'Website',
      icon: Globe,
      customerThought: 'Wants an obvious, low-pressure way to request an estimate.',
      frictionProblem: null,
      frictionDetail: 'Clear photos and service towns reassure the homeowner they are in the right place.',
    },
    {
      id: 'enquiry',
      stepNum: '04',
      title: 'Call / form',
      icon: PhoneCall,
      customerThought: 'Calls at 8 PM after dinner or submits details.',
      frictionProblem: activeProblems.has('Missed call after hours') ? 'Missed call after hours' : null,
      frictionDetail: 'Tradesperson is resting or off duty. Unanswered call leaves homeowner looking for the next number.',
    },
    {
      id: 'followup',
      stepNum: '05',
      title: 'Follow-up',
      icon: CheckCircle2,
      customerThought: 'Expects quick confirmation that their message was received.',
      frictionProblem: activeProblems.has('No follow-up') ? 'No follow-up' : null,
      frictionDetail: 'Without instant confirmation, homeowner reaches out to two other contractors before morning.',
    },
  ];

  // Which step the homeowner figure is currently visiting along the track
  const currentStepIndex = Math.min(steps.length - 1, Math.floor(animProgress * steps.length));
  const currentActiveStep = steps[currentStepIndex];

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteract) onInteract();
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(null);
    setReplayKey((k) => k + 1);
  };

  const activeStep = steps.find((s) => s.id === selectedNodeId) || currentActiveStep;

  return (
    <div
      key={replayKey}
      style={{
        transform: `translateX(${xOffset}px)`,
        opacity,
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease-out',
      }}
      className="w-full max-w-4xl mx-auto flex flex-col gap-5 select-none"
    >
      {/* Top Banner with Replay & Hotspot micro-label */}
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="font-semibold text-[#E3B896] uppercase tracking-wider text-[11px]">
          Customer Journey Audit
        </span>

        <div className="flex items-center gap-2">
          {!hasInteracted && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E3B896]/20 border border-[#E3B896]/40 text-[#E3B896] text-[11px] font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E3B896]" />
              <span>Tap any step to inspect friction</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay journey animation"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Main Journey Stage Canvas */}
      <div className="relative bg-[#13242C] rounded-2xl border border-white/10 p-5 sm:p-7 min-h-[380px] flex flex-col justify-between overflow-x-auto shadow-xl">
        {/* Thought Bubble Display for Current / Selected Step */}
        <div className="bg-[#18313D] rounded-xl p-3 border border-white/10 flex items-start gap-3 shadow-md">
          <div className="w-8 h-8 rounded-full bg-[#E3B896] text-[#0F2A35] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            💭
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#E3B896]">
                Step {activeStep.stepNum}: {activeStep.title} — Homeowner's Thought:
              </span>
              <span className="text-white/40 text-[10px]">Tap steps below to compare</span>
            </div>
            <p className="text-sm text-white font-medium italic mt-0.5">
              "{activeStep.customerThought}"
            </p>
            {activeStep.frictionProblem && (
              <div className="mt-2 text-xs text-rose-300 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                <strong>Where customers drop off:</strong> {activeStep.frictionDetail}
              </div>
            )}
          </div>
        </div>

        {/* SVG Track with Moving Figure and Dropping Copies */}
        <div className="relative my-8 py-4">
          {/* Horizontal Track Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-full h-8" preserveAspectRatio="none">
              <line
                x1="0"
                y1="16"
                x2="100%"
                y2="16"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
              <line
                x1="0"
                y1="16"
                x2={`${animProgress * 100}%`}
                y2="16"
                stroke="#E3B896"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Steps Node Row */}
          <div className="relative z-10 grid grid-cols-5 gap-2 items-center">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = selectedNodeId === step.id;
              const hasPassed = animProgress >= idx / (steps.length - 1);
              const hasFriction = Boolean(step.frictionProblem);

              return (
                <div key={step.id} className="flex flex-col items-center text-center relative group">
                  {/* Friction Warning Badge */}
                  {hasFriction && (
                    <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] text-rose-300 font-semibold whitespace-nowrap shadow-xs">
                      <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                      <span className="hidden sm:inline">{step.frictionProblem}</span>
                      <span className="sm:hidden">Drop-off</span>
                    </div>
                  )}

                  {/* Node Button */}
                  <button
                    type="button"
                    onClick={() => handleNodeClick(step.id)}
                    aria-label={`Inspect step ${step.title}`}
                    className={`min-w-[44px] min-h-[44px] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#E3B896] text-[#0F2A35] ring-4 ring-[#E3B896]/30 shadow-lg'
                        : hasPassed
                        ? 'bg-[#18313D] border-2 border-[#E3B896] text-[#E3B896]'
                        : 'bg-[#18313D] border-2 border-white/20 text-white/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-semibold text-white mt-2">{step.title}</span>

                  {/* Faded copy of the customer dropping away where friction occurs */}
                  {hasFriction && hasPassed && (
                    <div
                      style={{
                        transform: 'translateY(24px)',
                        opacity: 0.35,
                        transition: 'all 0.8s ease-out',
                      }}
                      className="absolute top-16 flex flex-col items-center text-[10px] text-rose-300 pointer-events-none"
                    >
                      <UserX className="w-4 h-4 text-rose-400" />
                      <span className="text-[9px] text-rose-400">Lost</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Explanatory Summary */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <span>Cause &amp; effect: Each unaddressed obstacle causes homeowners to abandon the journey</span>
          <span className="text-[#E3B896] font-medium">Click steps to see friction points</span>
        </div>
      </div>
    </div>
  );
}
