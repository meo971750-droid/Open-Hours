import React from 'react';
import { Check, ClipboardList } from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { COMMON_NEEDS } from '../content';

export default function NeedFromYou() {
  return (
    <section id="need-from-you" className="w-full bg-[#FFFFFF] py-20 sm:py-28 scroll-mt-24">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3F4] border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-medium text-[#1E4A5C]">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Your part</span>
          </div>

          <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-2xl mb-4">
            What we need <Accent>from you</Accent>
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#5E6F77] max-w-2xl">
            Most delays come from photos and details, so here is the short list.
          </p>
        </div>

        {/* 2-Column Checklist with Check Tiles */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-8">
          {COMMON_NEEDS.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#EEF3F4] rounded-[20px] p-5 sm:p-6 border border-[rgba(15,42,53,0.06)] shadow-xs flex items-start gap-4 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="w-8 h-8 rounded-full bg-[#1E4A5C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <p className="text-[15px] sm:text-[16px] font-medium text-[#0F2A35] leading-snug pt-1">
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* Muted note */}
        <p className="text-[14px] sm:text-[15px] text-[#5E6F77] text-center max-w-xl mx-auto">
          Timelines start once we have your photos and details.
        </p>
      </Container>
    </section>
  );
}
