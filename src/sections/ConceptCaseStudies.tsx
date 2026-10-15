import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { CONFIG } from '../config';

interface ConceptCaseStudiesProps {
  onOpenAudit?: (trade?: string, cardName?: string) => void;
}

export default function ConceptCaseStudies({ onOpenAudit }: ConceptCaseStudiesProps) {
  if (!CONFIG.caseStudies || (CONFIG.caseStudies as readonly unknown[]).length === 0) {
    return null;
  }

  const handleGetDesign = (trade: string, conceptName: string) => {
    if (onOpenAudit) {
      onOpenAudit(trade, conceptName);
    } else {
      const input = document.getElementById('audit-email-input');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <section
      id="concept-studies"
      aria-label="Concept case studies"
      className="w-full bg-[#FAF9F6] py-20 sm:py-24 md:py-28 scroll-mt-24 border-t border-[rgba(15,42,53,0.06)]"
    >
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3F4] border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-semibold text-[#1E4A5C]">
            <BookOpen className="w-3.5 h-3.5 text-[#1E4A5C]" />
            <span>Concept case studies</span>
          </div>

          <h2 className="text-[clamp(32px,4.4vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-3xl mb-4">
            How a trade site is designed to <Accent>catch enquiries</Accent>
          </h2>

          <p className="text-[17px] sm:text-[19px] text-[#5E6F77] max-w-2xl mx-auto font-normal">
            Real trade websites lose enquiries through confusing menus, missing phone buttons, and slow pages. Here is how we design around those problems.
          </p>
        </div>

        {/* Case Studies Stack */}
        <div className="flex flex-col gap-10 sm:gap-14 max-w-6xl mx-auto">
          {CONFIG.caseStudies.map((study, idx) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[rgba(15,42,53,0.08)] shadow-[0_12px_36px_rgba(15,42,53,0.04)] hover:shadow-[0_18px_48px_rgba(15,42,53,0.08)] transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left Column: Brief, Problems, Decisions */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    {/* Tags row */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-semibold text-[#1E4A5C] bg-[#DCE9EC] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Concept
                      </span>
                      <span className="text-[11px] font-medium text-[#8B5E3C] bg-[#F7EFE6] px-2.5 py-0.5 rounded-full">
                        {study.trade}
                      </span>
                    </div>

                    <h3 className="text-[24px] sm:text-[28px] font-normal tracking-[-0.02em] text-[#0F2A35] mb-3">
                      {study.conceptName}
                    </h3>

                    {/* The Brief */}
                    <div className="bg-[#F8FAFB] border-l-3 border-[#1E4A5C] px-4 py-2.5 rounded-r-xl mb-6">
                      <p className="text-[14px] text-[#0F2A35] font-medium leading-relaxed">
                        <span className="text-[#5E6F77] font-normal">The brief: </span>
                        {study.brief}
                      </p>
                    </div>

                    {/* Problems Typically Seen */}
                    <div className="mb-6">
                      <h4 className="text-[13px] font-semibold text-[#0F2A35] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-[#D9444A]" />
                        <span>Problems typically seen</span>
                      </h4>
                      <ul className="space-y-2">
                        {study.problems.map((prob, pIdx) => (
                          <li
                            key={pIdx}
                            className="text-[14px] text-[#5E6F77] leading-relaxed flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D9444A]/80 mt-2 shrink-0" />
                            <span>{prob}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Design Decisions */}
                    <div className="mb-6">
                      <h4 className="text-[13px] font-semibold text-[#0F2A35] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2E9E6B]" />
                        <span>Design decisions</span>
                      </h4>
                      <ul className="space-y-2">
                        {study.decisions.map((dec, dIdx) => (
                          <li
                            key={dIdx}
                            className="text-[14px] text-[#0F2A35] leading-relaxed flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E6B] mt-2 shrink-0" />
                            <span>{dec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleGetDesign(study.trade, study.conceptName)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F2A35] text-white hover:bg-[#1E4A5C] text-[14px] font-medium transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                    >
                      <span>Get a design like this</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </div>

                {/* Right Column: Screenshot in browser frame */}
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div className="w-full rounded-2xl overflow-hidden border border-[rgba(15,42,53,0.12)] bg-[#F4F6F8] shadow-md">
                    {/* Browser top chrome */}
                    <div className="flex items-center justify-between px-3.5 py-2 bg-[#EAEFF1] border-b border-[rgba(15,42,53,0.08)]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E57373]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#81C784]" />
                      </div>
                      <span className="text-[11px] font-mono text-[#5E6F77] truncate max-w-[200px]">
                        {study.domain}
                      </span>
                      <span className="text-[10px] font-semibold text-[#1E4A5C] bg-white px-2 py-0.5 rounded-full border border-[rgba(15,42,53,0.06)]">
                        Concept
                      </span>
                    </div>

                    {/* Screenshot image */}
                    <div className="relative aspect-[16/10] bg-[#EEF3F4] overflow-hidden">
                      <img
                        src={study.image}
                        alt={`${study.conceptName} concept website layout`}
                        width={1400}
                        height={875}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="text-[12px] text-[#5E6F77] text-center mt-2.5 italic">
                    Concept for illustration. Not a client project.
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
