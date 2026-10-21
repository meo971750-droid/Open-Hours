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
        question: 'What Does Maximizing Value Mean for You?',
        answer:
          'We focus on more than price, structuring a deal that aligns with your financial goals and future involvement.',
      },
      {
        number: '02',
        question: 'Control Your Future Involvement',
        answer:
          'Do you want to stay involved, step away completely, or ease into retirement? The right deal should align with your lifestyle goals.',
      },
      {
        number: '03',
        question: 'What Happens to Your Employees?',
        answer:
          'We help you find buyers who value your employees, ensuring job security, continuity, and a workplace culture that remains strong.',
      },
      {
        number: '04',
        question: 'How Do You Protect Your Legacy?',
        answer:
          "The right deal should honor your company's identity, ensuring it continues to thrive while reflecting the values you've built it on.",
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
        {/* Main Card Container with pure white background */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 25 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[28px] sm:rounded-[36px] overflow-hidden bg-white shadow-[0_12px_44px_rgba(15,42,53,0.06)] border border-slate-200"
        >
          {/* Top Block with pure white background */}
          <div className="bg-white p-8 sm:p-12 md:p-16 lg:p-20 text-center">
            {/* Header Block */}
            <div className="max-w-xl mx-auto mb-14 sm:mb-18 md:mb-20">
              <h2 className="text-[clamp(2.5rem,5.5vw,4.25rem)] font-extrabold tracking-tight text-[#0F2A35] leading-[1.08] mb-4 sm:mb-5">
                <span>{data.titlePrefix} </span>
                <span className="bg-gradient-to-r from-[#FF5C38] via-[#F24E27] to-[#CF3517] bg-clip-text text-transparent">
                  {data.titleAccent}
                </span>
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[#5E6F77] leading-relaxed max-w-lg mx-auto font-normal">
                {data.subtitle}
              </p>
            </div>

            {/* 2x2 Bento Grid with hairline cross-divider */}
            <div className="grid grid-cols-1 md:grid-cols-2 text-left">
              {items.map((item, index) => {
                const isTopRow = index < 2;
                const isLeftCol = index % 2 === 0;

                const borderClasses = `
                  ${isTopRow ? 'border-b border-slate-200' : 'border-b md:border-b-0 border-slate-200'}
                  ${isLeftCol ? 'md:border-r border-slate-200' : ''}
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
                    {/* Background Number with bottom fade gradient & mask */}
                    <div
                      aria-hidden="true"
                      className="relative mb-[-36px] sm:mb-[-44px] select-none pointer-events-none z-0"
                    >
                      <span
                        className="font-black text-7xl sm:text-8xl lg:text-[98px] tracking-tight leading-none inline-block bg-gradient-to-b from-[#FF5E38] via-[#E24622] to-transparent bg-clip-text text-transparent"
                        style={{
                          WebkitMaskImage:
                            'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0.15) 85%, transparent 100%)',
                          maskImage:
                            'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0.15) 85%, transparent 100%)',
                        }}
                      >
                        {item.number}
                      </span>
                    </div>

                    {/* Question / Heading layered directly over the fading bottom of the number */}
                    <h3 className="relative z-10 text-xl sm:text-[22px] font-bold text-[#0F2A35] leading-snug mb-3 tracking-[-0.01em]">
                      {item.question}
                    </h3>

                    {/* Description Paragraph */}
                    <p className="relative z-10 text-[14.5px] sm:text-[15.5px] text-[#5E6F77] leading-[1.65] font-normal">
                      {item.answer}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Banner with pure white background */}
          <div className="bg-white px-6 py-10 sm:px-12 sm:py-14 text-center border-t border-slate-200">
            <h3 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-[#0F2A35] tracking-tight leading-[1.15] max-w-xl mx-auto mb-6">
              <span>{banner.headlinePrefix} </span>
              <span className="bg-gradient-to-r from-[#FF5C38] via-[#F24E27] to-[#CF3517] bg-clip-text text-transparent">
                {banner.headlineAccent}
              </span>
              <span> {banner.headlineSuffix}</span>
            </h3>

            <div>
              <button
                type="button"
                onClick={() => onOpenAudit?.()}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FF5C38] hover:bg-[#E84824] text-white text-[15px] sm:text-[16px] font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
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
