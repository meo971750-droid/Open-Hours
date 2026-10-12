import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import Container from '../components/Container';
import { FAQ_CONTENT } from '../content';

export default function FAQ() {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="w-full bg-white py-20 sm:py-28 md:py-32 overflow-hidden scroll-mt-24">
      <Container>
        {/* Label Pill & Heading */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-medium text-[#1E4A5C]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{FAQ_CONTENT.pill}</span>
          </div>

          <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-2xl mb-4">
            {FAQ_CONTENT.headline}
          </h2>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {FAQ_CONTENT.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-[22px] border border-[rgba(15,42,53,0.06)] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={'faq-answer-' + index}
                  id={'faq-question-' + index}
                  className="w-full px-6 py-5 sm:py-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] cursor-pointer"
                >
                  <span className="text-[17px] sm:text-[18px] font-medium text-[#0F2A35] leading-snug">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={
                      'w-5 h-5 text-[#1E4A5C] shrink-0 transition-transform duration-300 ' +
                      (isOpen ? 'rotate-180' : '')
                    }
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={'faq-answer-' + index}
                      role="region"
                      aria-labelledby={'faq-question-' + index}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 pt-1 text-[15px] sm:text-[16px] leading-[1.65] text-[#5E6F77] border-t border-[rgba(15,42,53,0.04)]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
