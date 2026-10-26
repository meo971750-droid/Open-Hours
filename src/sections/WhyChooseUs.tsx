import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Container from '../components/Container';
import { config } from '../config';

interface WhyChooseUsProps {
  onOpenAudit?: () => void;
}

export default function WhyChooseUs({ onOpenAudit }: WhyChooseUsProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 });

  const data = config.whyChooseUs || {
    titlePrefix: 'Why',
    titleAccent: 'Choose Us?',
    subtitle:
      "Every trade and local business journey is unique, so our approach is never one-size-fits-all. We tailor our entire build process to the specifics of your trade and goals.",
    items: [
      {
        number: '01',
        question: 'What Does Maximising Value Mean for You?',
        answer:
          'We focus on real enquiries rather than vanity metrics, agreeing on a clear written fixed price before work starts so there are never surprises.',
      },
      {
        number: '02',
        question: 'Control Your Future Involvement',
        answer:
          'You own your domain, code, design and assets from day one. No locked proprietary builders and complete freedom to take your site anywhere.',
      },
      {
        number: '03',
        question: 'Direct Access, No Middlemen',
        answer:
          'You work directly with the founder on video walkthroughs and WhatsApp. No endless ticket queues, junior hand-offs, or confusing tech jargon.',
      },
      {
        number: '04',
        question: 'How Do You Protect Your Reputation?',
        answer:
          "Your website honors your company's hard-earned reputation, ensuring it continues to win high-value jobs with lifetime support while hosted with us.",
      },
    ],
    banner: {
      headlinePrefix: 'Walk away',
      headlineAccent: 'with the highest return and',
      headlineSuffix: 'peace of mind.',
      buttonText: "Let's Talk About Your Business",
    },
  };

  const items = data.items;
  const banner = data.banner || {
    headlinePrefix: 'Walk away',
    headlineAccent: 'with the highest return and',
    headlineSuffix: 'peace of mind.',
    buttonText: "Let's Talk About Your Business",
  };

  return (
    <section
      ref={sectionRef}
      id="why-choose-us"
      className="relative w-full bg-white py-16 sm:py-24 md:py-28 scroll-mt-24 overflow-hidden"
    >
      {/* Anchor alias for backward compatibility with previous sample-audit anchor */}
      <div id="sample-audit" className="sr-only" aria-hidden="true" tabIndex={-1} />

      <Container className="max-w-[920px] mx-auto px-4 sm:px-6">
        {/* Content sits directly on the page background */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 25 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* Top Block */}
          <div className="text-center">
            {/* Header Block */}
            <div className="max-w-xl mx-auto mb-14 sm:mb-18 md:mb-20">
              <h2 className="text-[clamp(2.5rem,5.5vw,4.25rem)] font-extrabold tracking-tight text-[#12303D] leading-[1.08] mb-4 sm:mb-5">
                <span>{data.titlePrefix} </span>
                <span className="text-[#C8642E]">
                  {data.titleAccent}
                </span>
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[#12303D]/85 leading-relaxed max-w-lg mx-auto font-normal">
                {data.subtitle}
              </p>
            </div>

            {/* 2x2 Bento Grid with subtle hairline cross-divider */}
            <div className="grid grid-cols-1 md:grid-cols-2 text-left">
              {items.map((item, index) => {
                const isTopRow = index < 2;
                const isLeftCol = index % 2 === 0;

                const borderClasses = `
                  ${isTopRow ? 'border-b border-[#12303D]/10' : 'border-b md:border-b-0 border-[#12303D]/10'}
                  ${isLeftCol ? 'md:border-r border-[#12303D]/10' : ''}
                `;

                const paddingClasses = `
                  ${isTopRow ? 'pb-10 sm:pb-14' : 'pt-10 sm:pt-14 pb-8 md:pb-0'}
                  ${isLeftCol ? 'md:pr-10 lg:pr-14 pr-0' : 'md:pl-10 lg:pl-14 pl-0 pt-8 md:pt-0'}
                `;

                return (
                  <div
                    key={item.number || index}
                    className={`relative flex flex-col ${borderClasses} ${paddingClasses}`}
                  >
                    {/* Numeral on its own line with terracotta accent and clean spacing below */}
                    <div
                      aria-hidden="true"
                      className="mb-2 sm:mb-3 select-none pointer-events-none"
                    >
                      <span className="font-extrabold text-5xl sm:text-6xl tracking-tight leading-none inline-block text-[#C8642E]">
                        {item.number}
                      </span>
                    </div>

                    {/* Question / Heading */}
                    <h3 className="text-xl sm:text-[22px] font-bold text-[#12303D] leading-snug mb-3 tracking-[-0.01em]">
                      {item.question}
                    </h3>

                    {/* Description Paragraph */}
                    <p className="text-[14.5px] sm:text-[15.5px] text-[#12303D]/80 leading-[1.65] font-normal">
                      {item.answer}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="mt-14 sm:mt-18 pt-10 sm:pt-14 text-center border-t border-[#12303D]/10">
            <h3 className="text-2xl sm:text-3xl md:text-[36px] font-extrabold text-[#12303D] tracking-tight leading-[1.15] max-w-xl mx-auto mb-6">
              <span>{banner.headlinePrefix} </span>
              <span className="text-[#C8642E]">
                {banner.headlineAccent}
              </span>
              <span> {banner.headlineSuffix}</span>
            </h3>

            <div>
              <button
                type="button"
                onClick={() => onOpenAudit?.()}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#C8642E] hover:bg-[#B55624] text-white text-[15px] sm:text-[16px] font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
              >
                <span>{banner.buttonText}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
