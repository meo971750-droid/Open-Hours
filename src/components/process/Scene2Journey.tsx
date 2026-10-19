import React from 'react';
import { Search, MousePointer, Globe, PhoneCall, CheckCircle2 } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export function getActiveFrictionPairs() {
  const f = config.features;
  const base = [
    {
      nodeId: 'click',
      nodeIdx: 1,
      problem: 'No website to click: they move on.',
      fix: 'A clear website with one next step.',
    },
    {
      nodeId: 'website',
      nodeIdx: 2,
      problem: 'Hard to contact on mobile: they give up.',
      fix: 'Call and quote buttons on every page.',
    },
  ];

  if (f.missedCallTextBack || f.afterHoursAutoReply || f.voiceAgent) {
    base.push({
      nodeId: 'call',
      nodeIdx: 3,
      problem: 'Missed call after hours: they call someone else.',
      fix: 'Missed calls get handled.',
    });
  }

  if (f.enquiryTracking) {
    base.push({
      nodeId: 'followup',
      nodeIdx: 4,
      problem: 'No follow-up: the enquiry goes cold.',
      fix: 'Every enquiry is confirmed and logged.',
    });
  }

  return base;
}

export default function Scene2Journey({
  progress,
  stepIndex,
  stepProgress,
  activeHighlight,
  isMobile,
  palette,
}: SceneProps) {
  const activePairs = getActiveFrictionPairs();
  const activeProblems = new Set(activePairs.map((p) => p.nodeId));

  // 5 Steps mapping:
  // Step 0 ('intro'): Overview
  // Step 1 ('click'): Node 2 friction
  // Step 2 ('website'): Node 3 friction
  // Step 3 ('call'): Node 4 friction (if active)
  // Step 4 ('followup'): Node 5 friction (if active)

  const nodes = [
    {
      id: 'search',
      numeral: '1',
      title: 'Search',
      desc: 'Looking for a trade nearby',
      icon: Search,
      x: 100,
      y: 165,
      isTop: false,
      friction: null,
      thought: 'Looks for a roofer nearby',
      stepNum: 0,
    },
    {
      id: 'click',
      numeral: '2',
      title: 'Click',
      desc: 'Checks who you are',
      icon: MousePointer,
      x: 310,
      y: 100,
      isTop: true,
      friction: activeProblems.has('click') ? 'No website to click' : null,
      thought: 'Wants to see work',
      stepNum: 1,
    },
    {
      id: 'website',
      numeral: '3',
      title: 'Website',
      desc: 'Tries on mobile phone',
      icon: Globe,
      x: 520,
      y: 185,
      isTop: false,
      friction: activeProblems.has('website') ? 'Hard to contact on mobile' : null,
      thought: 'Tries to find phone button',
      stepNum: 2,
    },
    {
      id: 'call',
      numeral: '4',
      title: 'Call or form',
      desc: 'Calls late in the evening',
      icon: PhoneCall,
      x: 730,
      y: 105,
      isTop: true,
      friction: activeProblems.has('call') ? 'Missed call after hours' : null,
      thought: 'Calls at 7:30 PM',
      stepNum: 3,
    },
    {
      id: 'followup',
      numeral: '5',
      title: 'Follow-up',
      desc: 'Waiting for confirmation',
      icon: CheckCircle2,
      x: 940,
      y: 175,
      isTop: false,
      friction: activeProblems.has('followup') ? 'No follow-up' : null,
      thought: 'Waits for reply',
      stepNum: 4,
    },
  ];

  const currentStep = nodes.find((n) => n.id === activeHighlight) || nodes[0];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none px-2">
      <div className="absolute top-1 right-2 text-[10px] uppercase tracking-wider text-[#1B2B34]/50 px-2 py-0.5 rounded bg-black/5 border border-black/10 z-20">
        Illustrative example
      </div>

      <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center py-1">
        <svg className="w-full h-auto max-h-[330px]" viewBox="0 0 1060 330" preserveAspectRatio="xMidYMid meet">
          {/* Base Wavy Journey Line */}
          <path
            d="M 40 165 Q 180 65, 310 100 T 520 185 T 730 105 T 1020 175"
            fill="none"
            stroke="#C8642E"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Dashed Red Friction Segments */}
          <g stroke="#D64545" strokeWidth="4" strokeDasharray="8 6" fill="none">
            {stepIndex >= 1 && <path d="M 100 165 Q 200 100, 310 100" opacity={0.9} />}
            {stepIndex >= 2 && <path d="M 310 100 Q 420 185, 520 185" opacity={0.9} />}
            {stepIndex >= 3 && activeProblems.has('call') && <path d="M 520 185 Q 630 105, 730 105" opacity={0.9} />}
            {stepIndex >= 4 && activeProblems.has('followup') && <path d="M 730 105 Q 840 175, 940 175" opacity={0.9} />}
          </g>

          {/* 5 Nodes with Numerals and Icon Cards */}
          {nodes.map((node) => {
            const isCurrentNode = node.id === activeHighlight;
            const hasPassed = stepIndex >= node.stepNum && node.stepNum > 0;
            const hasFriction = Boolean(node.friction) && (hasPassed || isCurrentNode);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                opacity={isCurrentNode || activeHighlight === 'intro' ? 1 : 0.75}
                style={{ transition: 'opacity 0.3s ease' }}
              >
                {/* Big Faint Numeral behind card */}
                <text
                  x="0"
                  y={node.isTop ? 24 : -18}
                  textAnchor="middle"
                  fill="#E9DFD2"
                  fontSize="64"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  {node.numeral}
                </text>

                {/* Soft pulse ring if active */}
                {isCurrentNode && (
                  <circle
                    r="30"
                    fill="none"
                    stroke={hasFriction ? '#D64545' : '#C8642E'}
                    strokeWidth="2"
                    className="animate-pulse"
                    opacity="0.4"
                  />
                )}

                {/* White Rounded-2xl Icon Card */}
                <g filter="drop-shadow(0 6px 14px rgba(27, 43, 52, 0.08))">
                  <rect
                    x="-23"
                    y="-23"
                    width="46"
                    height="46"
                    rx="16"
                    fill="#FFFFFF"
                    stroke={hasFriction ? '#D64545' : isCurrentNode ? '#C8642E' : '#E9DFD2'}
                    strokeWidth={hasFriction || isCurrentNode ? '2.5' : '1'}
                  />
                  <foreignObject x="-14" y="-14" width="28" height="28">
                    <div className="w-full h-full flex items-center justify-center text-[#1B2B34]">
                      <node.icon className={`w-4 h-4 ${hasFriction ? 'text-[#D64545]' : 'text-[#C8642E]'}`} />
                    </div>
                  </foreignObject>
                </g>

                {/* Title & Description strictly within bounded height */}
                <g transform={`translate(0, ${node.isTop ? -38 : 38})`}>
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fill="#1B2B34"
                    fontSize="12"
                    fontWeight={isCurrentNode ? '800' : '700'}
                  >
                    {node.title}
                  </text>
                  <text
                    x="0"
                    y="14"
                    textAnchor="middle"
                    fill="#1B2B34"
                    opacity={isCurrentNode ? 0.9 : 0.6}
                    fontSize="9.5"
                    fontWeight="500"
                  >
                    {node.desc}
                  </text>
                </g>

                {/* Red Friction Marker */}
                {hasFriction && (
                  <g transform={`translate(0, ${node.isTop ? 38 : -40})`}>
                    <rect
                      x="-65"
                      y="-10"
                      width="130"
                      height="20"
                      rx="5"
                      fill="#D64545"
                      filter="drop-shadow(0 3px 8px rgba(214, 69, 69, 0.3))"
                    />
                    <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700">
                      {node.friction}
                    </text>
                  </g>
                )}

                {/* Faded customer dropping away */}
                {hasFriction && (
                  <g transform="translate(0, 48)" opacity="0.65">
                    <line x1="0" y1="0" x2="0" y2="18" stroke="#D64545" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="0" cy="22" r="4" fill="#D64545" />
                    <text x="0" y="34" textAnchor="middle" fill="#D64545" fontSize="8" fontWeight="600">
                      Drops off
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Traveling Homeowner Dot with Thought Bubble */}
          {currentStep && (
            <g transform={`translate(${currentStep.x}, ${currentStep.y + (currentStep.isTop ? -8 : 8)})`}>
              <circle r="12" fill="#C8642E" opacity="0.25" className="animate-ping" />
              <circle r="6.5" fill="#C8642E" stroke="#FFFFFF" strokeWidth="2" />
              <g transform="translate(0, -28)">
                <rect x="-65" y="-12" width="130" height="20" rx="5" fill="#FFFFFF" stroke="#C8642E" strokeWidth="1" />
                <text x="0" y="2" textAnchor="middle" fill="#1B2B34" fontSize="8.5" fontWeight="600">
                  "{currentStep.thought}"
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
