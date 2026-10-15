import React, { useState } from 'react';
import { motion } from 'motion/react';
import LiveMockup from '../components/LiveMockup';
import { SAMPLE_DASHBOARD } from '../content';

export default function SeeItWork() {
  const [, setRowSliding] = useState(false);

  return (
    <section
      id="see-it-work"
      className="relative z-1 w-full overflow-x-clip overflow-y-visible py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#FBF8F3] to-[#CFE0E4] scroll-mt-24"
    >
      {/* Centred Title Block directly ABOVE Mockup Card
          Spacing: 40px (>= 1280px), 32px (768-1279px), 24px (mobile) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.07,
            },
          },
        }}
        className="flex flex-col items-center text-center mb-[24px] md:mb-[32px] xl:mb-[40px] px-4 relative z-20"
      >
        <motion.span
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="inline-flex items-center text-[12px] font-semibold text-[#1E4A5C] bg-[#DCE9EC] tracking-[0.14em] uppercase px-[14px] py-[6px] rounded-full"
        >
          SEE IT WORK
        </motion.span>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="mt-[12px] text-[30px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-medium tracking-[-0.03em] leading-[1.12] text-[#0F2A35] max-w-[900px]"
          style={{ textWrap: 'balance' }}
        >
          Imagine seeing your website performing like this
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="mt-[12px] text-[15px] text-[#5E6F77] max-w-xl"
        >
          Quote requests, missed calls and messages, all in one simple inbox.
        </motion.p>
      </motion.div>

      {/* Hero Laptop Mockup (Animated Live Enquiry Inbox):
          - max-w-[1000px] on desktop
          - Rise-in ends at resting position (y: 0) and never overlaps sub line */}
      <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-0"
        >
          {/* Laptop Shell */}
          <div className="bg-[#18262E] p-2.5 sm:p-4 rounded-t-[24px] sm:rounded-t-[32px] shadow-[0_25px_60px_-15px_rgba(15,42,53,0.35)] border border-[rgba(255,255,255,0.1)]">
            {/* Top Bar with Camera & SAMPLE DATA Tag */}
            <div className="flex items-center justify-between px-3 py-1.5 sm:py-2 mb-2 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D9444A]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#E8943A]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#2E9E6B]/80" />
              </div>

              {/* Business name shown & higher-contrast SAMPLE DATA badge */}
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] sm:text-xs text-white/70 font-medium">
                  {SAMPLE_DASHBOARD.businessName}
                </span>
                <span className="bg-[#E3B896] text-[#0F2A35] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  SAMPLE DATA
                </span>
              </div>
              <div className="w-3 h-3 rounded-full bg-white/10" />
            </div>

            {/* Screen Display Container */}
            <div className="bg-white rounded-[16px] sm:rounded-[20px] overflow-hidden p-3 sm:p-6 shadow-inner text-left relative">
              <LiveMockup isRowSliding={setRowSliding} />
            </div>
          </div>

          {/* Laptop Base Stand */}
          <div className="bg-[#0C151B] h-3.5 sm:h-5 rounded-b-[18px] max-w-[102%] -mx-[1%] shadow-xl flex justify-center">
            <div className="w-20 sm:w-28 h-1 bg-white/20 rounded-b-md" />
          </div>

          {/* Exact caption under the frame as requested */}
          <p className="text-[12px] text-[#5E6F77] text-center mt-3">
            Example only. Not a real client's results.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
