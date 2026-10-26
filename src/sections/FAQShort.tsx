import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import { FAQ_CONTENT } from '../content';
import { getSectionHref } from '../lib/links';

const SHORT_FAQ_QUESTIONS = [
  'How long does it take?',
  'Is the 1-page website really at no cost?',
  'Do I own the website?',
  'Can you promise more enquiries?',
];

export default function FAQShort() {
  // Find each question from FAQ_CONTENT.items in exact requested order
  const shortItems = SHORT_FAQ_QUESTIONS.map((q) => {
    const found = FAQ_CONTENT.items.find((item) => item.question.trim().toLowerCase() === q.trim().toLowerCase());
    if (!found) {
      if (import.meta.env.DEV) {
        console.warn(`[FAQShort] Missing FAQ question: "${q}"`);
      }
      return null;
    }
    return found;
  }).filter(Boolean) as (typeof FAQ_CONTENT.items)[0][];

  // First item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq-short" className="w-full bg-white py-20 sm:py-28 md:py-32 overflow-hidden scroll-mt-24">
      <Container>
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-2xl mb-4">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3.5 mb-10">
          {shortItems.map((item, index) => {
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
                  aria-controls={'faq-short-answer-' + index}
                  id={'faq-short-question-' + index}
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
                      id={'faq-short-answer-' + index}
                      role="region"
                      aria-labelledby={'faq-short-question-' + index}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-[15px] sm:text-[16px] text-[#5E6F77] leading-relaxed border-t border-[rgba(15,42,53,0.04)] pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Text link: See all questions */}
        <div className="flex justify-center">
          <Link
            to={getSectionHref('faq')}
            className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#1E4A5C] hover:text-[#0F2A35] group transition-colors"
          >
            <span>See all questions</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
