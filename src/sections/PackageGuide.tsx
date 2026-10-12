import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';

const GUIDE_ITEMS = [
  {
    text: 'You have no website, or only a social media page.',
    label: '1-page website',
    to: '/packages/1-page-website',
  },
  {
    text: 'You need a small, complete website.',
    label: 'Starter',
    to: '/packages/starter',
  },
  {
    text: 'You miss calls on site and want enquiries handled.',
    label: 'Standard',
    to: '/packages/standard',
  },
  {
    text: 'You have many services, areas or bigger projects.',
    label: 'Growth',
    to: '/packages/growth',
  },
];

export default function PackageGuide() {
  return (
    <section id="package-guide" className="w-full bg-[#FFFFFF] py-16 sm:py-24 scroll-mt-24">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3F4] border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-medium text-[#1E4A5C]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Which one?</span>
          </div>

          <h2 className="text-[30px] sm:text-[40px] md:text-[48px] font-normal tracking-[-0.03em] leading-[1.1] text-[#0F2A35] max-w-2xl mb-3">
            Which package is <Accent>right for you</Accent>?
          </h2>
        </div>

        {/* 4 Rows */}
        <div className="max-w-3xl mx-auto space-y-3.5 mb-6">
          {GUIDE_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#EEF3F4] rounded-[20px] p-5 sm:p-6 border border-[rgba(15,42,53,0.06)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <p className="text-[16px] sm:text-[17px] text-[#0F2A35] font-medium leading-snug">
                {item.text}
              </p>
              <Link
                to={item.to}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0F2A35] text-white font-semibold text-[14px] hover:bg-[#1E4A5C] transition-colors shrink-0 group"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* Muted note */}
        <p className="text-[14px] sm:text-[15px] text-[#5E6F77] text-center max-w-xl mx-auto">
          Not sure? Start with the 1-page website. You can upgrade at any time.
        </p>
      </Container>
    </section>
  );
}
