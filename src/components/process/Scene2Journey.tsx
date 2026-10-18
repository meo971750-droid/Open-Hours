import React from 'react';
import { Search, MousePointer, Globe, PhoneCall, CheckCircle2, User, UserX, AlertTriangle } from 'lucide-react';
import { SceneProps } from './types';
import { config } from '../../config';

export function getActiveFrictionPairs() {
  const f = config.features;
  const base = [
    {
      nodeId: 'search',
      nodeIdx: 0,
      problem: 'No website to click',
      fix: 'A clear website with one next step',
    },
    {
      nodeId: 'click',
      nodeIdx: 1,
      problem: 'Hard to contact on mobile',
      fix: 'Call and quote buttons on every page',
    },
  ];

  if (f.missedCallTextBack || f.afterHoursAutoReply || f.voiceAgent) {
    base.push({
      nodeId: 'call',
      nodeIdx: 3,
      problem: 'Missed call after hours',
      fix: 'After-hours handling',
    });
  }

  if (f.enquiryTracking) {
    base.push({
      nodeId: 'followup',
      nodeIdx: 4,
      problem: 'No follow-up',
      fix: 'Every enquiry confirmed and logged',
    });
  }

  return base;
}

export default function Scene2Journey({ progress, isMobile, palette }: SceneProps) {
  // Autoplay Timeline (0.0 to 1.0)
  // 1: Wavy line draws: 0.05 to 0.25
  // 2: 5 nodes & white icon cards pop in: 0.15 to 0.45
  // 3: Homeowner dot travels & encounters friction points: 0.40 to 0.85
  // 4: Hold: 0.85 to 1.0

  const lineProgress = Math.min(1, Math.max(0, (progress - 0.05) / 0.20));
  const nodesProgress = Math.min(1, Math.max(0, (progress - 0.15) / 0.30));
  const travelProgress = Math.min(1, Math.max(0, (progress - 0.35) / 0.50));

  const activePairs = getActiveFrictionPairs();
  const activeFrictionProblems = new Set(activePairs.map((p) => p.problem));

  // Node positions along a wide 1200 x 420 viewBox
  const nodes = [
    {
      id: 'search',
      numeral: '1',
      title: 'Search',
      desc: 'Looking for a reliable trade nearby',
      icon: Search,
      x: 120,
      y: 200,
      isTop: false,
      friction: activeFrictionProblems.has('No website to click') ? 'No website to click' : null,
      thought: 'Looks for a roofer nearby',
    },
    {
      id: 'click',
      numeral: '2',
      title: 'Click',
      desc: 'Wants to see proof of recent work',
      icon: MousePointer,
      x: 360,
      y: 120,
      isTop: true,
      friction: activeFrictionProblems.has('Hard to contact on mobile') ? 'Hard to contact on mobile' : null,
      thought: 'Wants to see their work',
    },
    {
      id: 'website',
      numeral: '3',
      title: 'Website',
      desc: 'Checking services and location',
      icon: Globe,
      x: 600,
      y: 240,
      isTop: false,
      friction: null,
      thought: 'Wants an easy way to get in touch',
    },
    {
      id: 'call',
      numeral: '4',
      title: 'Call or form',
      desc: 'Reaching out for a quote or repair',
      icon: PhoneCall,
      x: 840,
      y: 130,
      isTop: true,
      friction: activeFrictionProblems.has('Missed call after hours') ? 'Missed call after hours' : null,
      thought: 'Calling after 6 PM',
    },
    {
      id: 'followup',
      numeral: '5',
      title: 'Follow-up',
      desc: 'Awaiting confirmation & booking',
      icon: CheckCircle2,
      x: 1080,
      y: 220,
      isTop: false,
      friction: activeFrictionProblems.has('No follow-up') ? 'No follow-up' : null,
      thought: 'Waiting for a response',
    },
  ];

  // Current position of traveling homeowner
  const currentStepIdx = Math.min(4, Math.floor(travelProgress * 5));
  const activeNode = nodes[currentStepIdx] || nodes[0];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      <div className="absolute top-2 right-4 text-[10px] uppercase tracking-wider text-[#1B2B34]/50 px-2 py-0.5 rounded bg-black/5 border border-black/10 z-20">
        Illustrative example
      </div>

      <div className="relative w-full max-w-6xl mx-auto flex-1 flex items-center justify-center px-4 py-2">
        <svg
          className="w-full h-auto max-h-[460px]"
          viewBox="0 0 1200 420"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Base Wavy Journey Line */}
          <path
            d="M 60 210 Q 240 70, 360 120 T 600 240 T 840 130 T 1140 230"
            fill="none"
            stroke="#C8642E"
            strokeWidth="3.5"
            strokeDasharray="1400"
            strokeDashoffset={(1 - lineProgress) * 1400}
            strokeLinecap="round"
          />

          {/* Dashed Red Friction Segments along the line */}
          {lineProgress > 0.6 && (
            <g stroke="#D64545" strokeWidth="4" strokeDasharray="8 6" fill="none">
              <path d="M 120 200 Q 240 120, 360 120" opacity={travelProgress > 0.15 ? 0.9 : 0.2} />
              <path d="M 360 120 Q 480 240, 600 240" opacity={travelProgress > 0.35 ? 0.9 : 0.2} />
              {activeFrictionProblems.has('Missed call after hours') && (
                <path d="M 600 240 Q 720 130, 840 130" opacity={travelProgress > 0.6 ? 0.9 : 0.2} />
              )}
            </g>
          )}

          {/* 5 Nodes with Big Faint Numerals, White Cards & Alternating Labels */}
          {nodes.map((node, idx) => {
            const nodeReveal = Math.min(1, Math.max(0, (nodesProgress - idx * 0.18) / 0.28));
            if (nodeReveal <= 0) return null;
            const isFrictionHit = travelProgress >= (idx / 5) && Boolean(node.friction);
            const isPastFriction = travelProgress > ((idx + 0.5) / 5) && Boolean(node.friction);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                opacity={nodeReveal}
                style={{ transition: 'opacity 0.4s ease' }}
              >
                {/* Big Faint Numeral behind card */}
                <text
                  x="0"
                  y={node.isTop ? 28 : -22}
                  textAnchor="middle"
                  fill="#E9DFD2"
                  fontSize="76"
                  fontWeight="900"
                  fontFamily="sans-serif"
                  style={{ userSelect: 'none' }}
                >
                  {node.numeral}
                </text>

                {/* White Rounded-2xl Icon Card sitting on line */}
                <g filter="drop-shadow(0 8px 18px rgba(27, 43, 52, 0.08))">
                  <rect
                    x="-26"
                    y="-26"
                    width="52"
                    height="52"
                    rx="18"
                    fill="#FFFFFF"
                    stroke={isFrictionHit ? '#D64545' : '#E9DFD2'}
                    strokeWidth={isFrictionHit ? '2' : '1'}
                  />
                  <foreignObject x="-16" y="-16" width="32" height="32">
                    <div className="w-full h-full flex items-center justify-center text-[#1B2B34]">
                      <node.icon className="w-5 h-5 text-[#C8642E]" />
                    </div>
                  </foreignObject>
                </g>

                {/* Title & One-line Description placed alternately above & below */}
                <g transform={`translate(0, ${node.isTop ? -45 : 48})`}>
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fill="#1B2B34"
                    fontSize="13"
                    fontWeight="700"
                  >
                    {node.title}
                  </text>
                  <text
                    x="0"
                    y="16"
                    textAnchor="middle"
                    fill="#1B2B34"
                    opacity="0.65"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {node.desc}
                  </text>
                </g>

                {/* Red Friction Marker (Pulses with label) */}
                {isFrictionHit && (
                  <g transform={`translate(0, ${node.isTop ? 42 : -46})`}>
                    <rect
                      x="-65"
                      y="-12"
                      width="130"
                      height="24"
                      rx="6"
                      fill="#D64545"
                      filter="drop-shadow(0 4px 10px rgba(214, 69, 69, 0.3))"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9.5"
                      fontWeight="700"
                    >
                      {node.friction}
                    </text>
                  </g>
                )}

                {/* Faded customer dropping away (lost visitor) */}
                {isPastFriction && (
                  <g transform="translate(0, 50)" opacity="0.45">
                    <line x1="0" y1="0" x2="0" y2="24" stroke="#D64545" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="0" cy="30" r="5" fill="#D64545" />
                    <text x="0" y="44" textAnchor="middle" fill="#D64545" fontSize="8.5" fontWeight="600">
                      Customer leaves
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Traveling Homeowner Dot with Thought Bubble */}
          {travelProgress > 0 && (
            <g
              transform={`translate(${120 + travelProgress * (1080 - 120)}, ${
                200 + Math.sin(travelProgress * Math.PI * 3.5) * -50
              })`}
            >
              <circle r="14" fill="#C8642E" opacity="0.2" className="animate-ping" />
              <circle r="7.5" fill="#C8642E" stroke="#FFFFFF" strokeWidth="2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.2))" />

              {/* Thought Bubble */}
              <g transform="translate(0, -28)">
                <rect
                  x="-75"
                  y="-14"
                  width="150"
                  height="22"
                  rx="6"
                  fill="#FFFFFF"
                  stroke="#C8642E"
                  strokeWidth="1"
                  filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
                />
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  fill="#1B2B34"
                  fontSize="9.5"
                  fontWeight="600"
                >
                  "{activeNode.thought}"
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
