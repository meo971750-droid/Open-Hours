import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import Container from '../components/Container';
import { config } from '../config';
import { FAQ_CONTENT } from '../content';
import { OH_DUR, OH_EASE } from '../lib/motion';

export default function FAQ() {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const populatedPricingFaqs = (config.pricingFaqs || []).filter(
    (item) => item.question.trim().length > 0 && item.answer.trim().length > 0
  );
  const allFaqs = [...FAQ_CONTENT.items, ...populatedPricingFaqs];

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="oh-cv-auto w-full bg-[#F3F5F3] py-[var(--section-py)] overflow-x-clip">
      <Container>
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0B1B22] max-w-2xl mb-4">
            <span className="oh-line-mask">
              <span className="oh-line-reveal">{FAQ_CONTENT.headline}</span>
            </span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {allFaqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-[20px] border border-[rgba(11,27,34,0.08)] hover:-translate-y-0.5 hover:border-[rgba(20,98,79,0.22)] hover:shadow-[var(--e2)] overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-[var(--e1)]"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={'faq-answer-' + index}
                  id={'faq-question-' + index}
                  className="w-full px-6 py-5 sm:py-6 text-left flex items-center justify-between gap-4 cursor-pointer active:scale-[0.995] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  <span className="text-[17px] sm:text-[18px] font-medium text-[#0B1B22] leading-snug">
                    {item.question}
                  </span>
                  <ChevronDown
                    strokeWidth={1.5}
                    className={
                      'w-5 h-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ' +
                      (isOpen ? 'rotate-180 text-[#14624F]' : 'text-[#0B1B22]')
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
                      transition={{ duration: OH_DUR.base, ease: OH_EASE }}
                    >
                      <div className="px-6 pb-6 pt-1 text-[15px] sm:text-[16px] leading-[1.65] text-[#475754] border-t border-[rgba(11,27,34,0.06)]">
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
