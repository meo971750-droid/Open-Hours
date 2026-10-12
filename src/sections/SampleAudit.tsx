import React, { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  PackageCheck,
  Check,
  ArrowRight,
} from 'lucide-react';
import Accent from '../components/Accent';
import { CTA, FIRST_PAGE } from '../content';
import GetPageWalkthrough from '../components/walkthrough/GetPageWalkthrough';

interface SampleAuditProps {
  onOpenAudit?: () => void;
}

export default function SampleAudit({ onOpenAudit }: SampleAuditProps) {
  const shouldReduceMotion = useReducedMotion();
  const [highlightedRow, setHighlightedRow] = useState<number>(-1);

  const rightCardRows = [
    {
      title: 'Apply on our website',
      desc: 'Send your business details through the short form.',
    },
    {
      title: 'We confirm your details',
      desc: 'We check the details with you and agree what goes on your page.',
    },
    {
      title: `Your page is ready in about ${FIRST_PAGE.readyHours} hours`,
      desc: 'Once we have your photos and details.',
    },
    {
      title: 'We hand it over',
      desc: 'Your page goes live on your own domain, with hosting set up and ready to receive enquiries.',
    },
    {
      title: FIRST_PAGE.extrasLine,
      desc: FIRST_PAGE.extrasNote,
    },
  ];

  return (
    <section
      id="sample-audit"
      className="w-full bg-white py-16 sm:py-24 overflow-x-clip scroll-mt-24"
    >
      {/* 24px Page Margin, Radius 40px Panel with Soft Mist Background #EEF3F4 */}
      <div className="mx-4 sm:mx-6 max-w-[1240px] xl:mx-auto bg-[#EEF3F4] rounded-[40px] p-6 sm:p-10 md:p-14 border border-[rgba(15,42,53,0.06)] shadow-xs">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-semibold text-[#1E4A5C]">
            <PackageCheck className="w-3.5 h-3.5 text-[#1E4A5C]" />
            <span>Your 1-page website</span>
          </div>

          <h2 className="text-[clamp(32px,4.4vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-3xl mb-4">
            How to get your 1-page website <Accent>at no cost</Accent>
          </h2>

          <p className="text-[17px] sm:text-[19px] text-[#5E6F77] max-w-2xl mx-auto font-normal">
            From your first message to a live page, in three simple steps.
          </p>
        </div>

        {/* Two Columns (>= 1024px: animation 54% | card 46%; stacked below, animation first) */}
        <div className="grid grid-cols-1 lg:grid-cols-[54fr_46fr] gap-8 items-stretch">
          {/* LEFT: Animated Walkthrough (54%) */}
          <div className="w-full rounded-[24px] bg-[#0F2A35] border border-[rgba(15,42,53,0.14)] p-5 sm:p-7 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,42,53,0.16)] relative overflow-hidden select-none">
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#E3B896]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#1E4A5C]/30 rounded-full blur-3xl pointer-events-none" />

            {/* Screen Reader Ordered List of the 5 Row Texts */}
            <div className="sr-only">
              <h3>How to get your 1-page website at no cost</h3>
              <ol>
                {rightCardRows.map((r, i) => (
                  <li key={i}>
                    <strong>{r.title}</strong>: {r.desc}
                  </li>
                ))}
              </ol>
            </div>

            {/* Walkthrough Component (aria-hidden) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between">
              <GetPageWalkthrough
                onHighlightChange={(idx) => setHighlightedRow(idx)}
                shouldReduceMotion={shouldReduceMotion ?? false}
              />
            </div>
          </div>

          {/* RIGHT: White Card (46%) */}
          <div className="w-full bg-white rounded-[24px] p-7 sm:p-7 border border-[rgba(15,42,53,0.06)] shadow-xs flex flex-col justify-between text-left">
            <div>
              {/* Title (22px, weight 600) */}
              <h3 className="text-[22px] font-semibold text-[#0F2A35] leading-snug mb-6">
                How you can get your 1-page site at no cost
              </h3>

              {/* Five Rows: 28px Teal Tick Tile + 17px Title + 15px Sentence */}
              <div className="space-y-3.5 mb-7">
                {rightCardRows.map((row, idx) => {
                  const isHighlighted = !shouldReduceMotion && highlightedRow === idx;
                  const isDimmed = !shouldReduceMotion && highlightedRow !== -1 && !isHighlighted;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3.5 p-2.5 rounded-xl transition-all duration-250 relative ${
                        isHighlighted
                          ? 'bg-[#FAF2EB] shadow-xs'
                          : 'bg-transparent'
                      } ${isDimmed ? 'opacity-70' : 'opacity-100'}`}
                    >
                      {/* Gold left bar on highlight */}
                      {isHighlighted && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#E3B896]" />
                      )}

                      {/* 28px Teal Tick Tile */}
                      <div className="w-7 h-7 rounded-lg bg-[#DCE9EC] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-[#1E4A5C]" strokeWidth={2.6} />
                      </div>

                      {/* Title (17px, weight 600) and sentence (15px, #5E6F77) */}
                      <div>
                        <div className="text-[17px] font-semibold text-[#0F2A35] leading-snug">
                          {row.title}
                        </div>
                        <p className="text-[15px] text-[#5E6F77] leading-relaxed mt-0.5">
                          {row.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Button & Note */}
            <div className="pt-6 border-t border-[rgba(15,42,53,0.06)] mt-2">
              <button
                type="button"
                onClick={() => onOpenAudit?.()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1E4A5C] text-white text-[16px] font-semibold hover:bg-[#153846] transition-all duration-200 shadow-sm cursor-pointer group mb-3"
              >
                <span>{CTA.offer}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <p className="text-[13px] text-[#5E6F77] leading-relaxed">
                {FIRST_PAGE.eligibilityNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
