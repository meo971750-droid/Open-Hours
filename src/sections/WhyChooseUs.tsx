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
                <span className="text-[#12303D]">
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
                  ${isTopRow ? 'pb-8 sm:pb-10 md:pb-12 pt-0' : 'pt-8 sm:pt-10 md:pt-12 pb-8 md:pb-0'}
                  ${isLeftCol ? 'md:pr-10 lg:pr-14' : 'md:pl-10 lg:pl-14'}
                `;

                return (
                  <div
                    key={item.number || index}
                    className={`relative flex flex-col ${borderClasses} ${paddingClasses}`}
                  >
                    {/* Big decorative numeral 01-04 with vertical fade in brand dark teal #12303D */}
                    <div
                      aria-hidden="true"
                      className="relative z-0 select-none pointer-events-none"
                    >
                      <span
                        className="font-extrabold tracking-tight leading-[0.8] inline-block text-[clamp(76px,16vw,96px)] md:text-[clamp(96px,11vw,150px)]"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(18, 48, 61, 1) 0%, rgba(18, 48, 61, 1) 35%, rgba(18, 48, 61, 0.15) 50%, rgba(18, 48, 61, 0.05) 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          color: 'rgba(18, 48, 61, 0.2)',
                        }}
                      >
                        {item.number}
                      </span>
                    </div>

                    {/* Question / Heading placed over lower half of numeral (negative margin-top) */}
                    <div className="relative z-10 -mt-[clamp(32px,5.5vw,56px)]">
                      <h3 className="text-xl sm:text-[22px] font-bold text-[#12303D] leading-snug mb-3 tracking-[-0.01em]">
                        {item.question}
                      </h3>

                      {/* Description Paragraph */}
                      <p className="text-[14.5px] sm:text-[15.5px] text-[#12303D]/80 leading-[1.65] font-normal">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="mt-14 sm:mt-18 pt-10 sm:pt-14 text-center border-t border-[#12303D]/10">
            <h3 className="text-2xl sm:text-3xl md:text-[36px] font-extrabold text-[#12303D] tracking-tight leading-[1.15] max-w-xl mx-auto mb-6">
              <span>{banner.headlinePrefix} </span>
              <span className="font-serif italic font-normal text-[#C8642E]">
                {banner.headlineAccent}
              </span>
              <span> {banner.headlineSuffix}</span>
            </h3>

            <div>
              <button
                type="button"
                onClick={() => onOpenAudit?.()}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#12303D] hover:bg-[#0B1B22] text-[#F7F9FA] text-[15px] sm:text-[16px] font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12303D] focus-visible:ring-offset-2"
              >
                <span>{banner.buttonText}</span>
                <ArrowRight className="w-4 h-4 ml-0.5 text-[#F7F9FA]" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
