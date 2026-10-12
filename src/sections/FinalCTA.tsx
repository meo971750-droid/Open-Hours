import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Bell, PhoneCall, Star, MessageCircle } from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { LogoMark } from '../components/Logo';
import { FINAL_CTA_CONTENT, DELIVERY, whatsappLink } from '../content';

interface FinalCTAProps {
  onOpenAudit: () => void;
}

export default function FinalCTA({ onOpenAudit }: FinalCTAProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      id="final-cta"
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden py-24 sm:py-32 md:py-40 text-center flex flex-col items-center justify-center rounded-t-[32px] scroll-mt-24"
      style={{
        background: 'linear-gradient(180deg, #CFE0E4 0%, #FBF8F3 100%)',
      }}
    >
      {/* Faint peach radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[640px] h-[380px] sm:h-[640px] rounded-full blur-[90px] -z-10"
        style={{ background: 'rgba(227, 184, 150, 0.28)' }}
      />

      <Container className="relative z-10 flex flex-col items-center">
        {/* Centre "o + dot" Logo Mark */}
        <div className="mb-6 flex justify-center">
          <LogoMark size={48} className="shadow-sm" />
        </div>

        {/* H2 Headline */}
        <h2 className="text-[32px] sm:text-[46px] md:text-[56px] font-normal tracking-[-0.03em] leading-[1.06] text-[#0F2A35] max-w-2xl mb-4">
          Your phone rings. Your website{' '}
          <Accent className="text-[#1E4A5C]">answers</Accent>.
        </h2>

        <p className="text-[16px] sm:text-[18px] text-[#5E6F77] max-w-lg mb-8">
          {FINAL_CTA_CONTENT.subtext}
        </p>

        {/* Button: Talk to Us */}
        <button
          type="button"
          onClick={onOpenAudit}
          className="group inline-flex items-center gap-2 bg-[#0F2A35] text-white text-[15px] font-medium h-[52px] px-7 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] cursor-pointer"
        >
          <span>{FINAL_CTA_CONTENT.buttonText}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        {/* Secondary outline button: Message us on WhatsApp (only if configured) */}
        {whatsappLink() && (
          <a
            href={whatsappLink()!}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 inline-flex items-center gap-2 px-6 h-11 rounded-full border border-[#0F2A35] text-[#0F2A35] hover:bg-[#0F2A35]/5 text-[14px] font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#1E4A5C]" />
            <span>Message us on WhatsApp</span>
          </a>
        )}

        {/* Delivery timeline note: 15px white at 80% */}
        <p className="mt-4 text-[15px] text-white/80 drop-shadow-[0_1px_2px_rgba(15,42,53,0.85)]">
          Your 1-page website in about {DELIVERY.firstPageWorkingDays} working days. Full builds in about {DELIVERY.liveWorkingDays}.
        </p>

        {/* 4 Floating Tilted Cards Around the Panel */}

        {/* Card 1: Enquiry notification (top left, -6deg) */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
            x: isTouch ? 0 : mousePos.x * -12,
          }}
          whileHover={{ rotate: 0, y: -6, zIndex: 30 }}
          transition={{
            y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 0.2 },
          }}
          style={{ rotate: -6 }}
          className="absolute left-2 sm:left-6 lg:left-12 top-4 sm:top-10 w-[190px] sm:w-[230px] bg-white rounded-[20px] p-3.5 sm:p-4 text-left shadow-[0_12px_32px_rgba(15,42,53,0.08)] border border-[rgba(15,42,53,0.06)] cursor-default transition-shadow hover:shadow-xl hidden md:block"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(15,42,53,0.06)] mb-2">
            <div className="flex items-center gap-1.5 text-xs text-[#0F2A35] font-semibold">
              <Bell className="w-3.5 h-3.5 text-[#1E4A5C]" />
              <span>Enquiry Alert</span>
            </div>
            <span className="text-[10px] bg-[#EEF3F4] text-[#5E6F77] px-1.5 py-0.5 rounded-full font-medium">
              Sample
            </span>
          </div>
          <p className="text-xs font-medium text-[#0F2A35]">New quote request</p>
          <p className="text-[11px] text-[#5E6F77] mt-0.5">2 min ago · Roof repair</p>
        </motion.div>

        {/* Card 2: Small ring chart (top right, +5deg) */}
        <motion.div
          animate={{
            y: [8, -8, 8],
            x: isTouch ? 0 : mousePos.x * 10,
          }}
          whileHover={{ rotate: 0, y: -6, zIndex: 30 }}
          transition={{
            y: { duration: 7, delay: 0.8, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 0.2 },
          }}
          style={{ rotate: 5 }}
          className="absolute right-2 sm:right-6 lg:right-12 top-6 sm:top-12 w-[180px] sm:w-[220px] bg-white rounded-[20px] p-3.5 sm:p-4 text-left shadow-[0_12px_32px_rgba(15,42,53,0.08)] border border-[rgba(15,42,53,0.06)] cursor-default transition-shadow hover:shadow-xl hidden md:block"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(15,42,53,0.06)] mb-2">
            <span className="text-xs font-semibold text-[#0F2A35]">Lead Origin</span>
            <span className="text-[10px] bg-[#EEF3F4] text-[#5E6F77] px-1.5 py-0.5 rounded-full font-medium">
              Sample
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <svg className="w-10 h-10 -rotate-90 shrink-0" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#EEF3F4" strokeWidth="4.5" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#1E4A5C" strokeWidth="4.5" strokeDasharray="51 88" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#E3B896" strokeWidth="4.5" strokeDasharray="24 88" strokeDashoffset="-51" />
            </svg>
            <div className="text-[11px] text-[#0F2A35]">
              <div className="font-semibold text-xs">Google 58%</div>
              <div className="text-[#5E6F77] text-[10px]">Maps &amp; Local</div>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Missed-call text-back bubble (bottom left, +3deg) */}
        <motion.div
          animate={{
            y: [-7, 7, -7],
            x: isTouch ? 0 : mousePos.x * -10,
          }}
          whileHover={{ rotate: 0, y: -6, zIndex: 30 }}
          transition={{
            y: { duration: 6.8, delay: 1.2, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 0.2 },
          }}
          style={{ rotate: 3 }}
          className="absolute left-2 sm:left-8 lg:right-auto lg:left-14 bottom-4 sm:bottom-8 w-[210px] sm:w-[250px] bg-[#0F2A35] text-white rounded-[20px] p-3.5 sm:p-4 text-left shadow-[0_12px_32px_rgba(15,42,53,0.15)] border border-white/10 cursor-default transition-shadow hover:shadow-xl hidden lg:block"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-[#E3B896]">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Auto Text-Back</span>
            </div>
            <span className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded-full">
              Sample
            </span>
          </div>
          <p className="text-[11px] text-white/90 leading-relaxed">
            "Sorry we missed your call. We're on a job. Ringing you back shortly."
          </p>
        </motion.div>

        {/* Card 4: Reviews card showing "4.8 on Google (sample)" (bottom right, -4deg) */}
        <motion.div
          animate={{
            y: [7, -7, 7],
            x: isTouch ? 0 : mousePos.x * 12,
          }}
          whileHover={{ rotate: 0, y: -6, zIndex: 30 }}
          transition={{
            y: { duration: 7.2, delay: 0.5, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 0.2 },
          }}
          style={{ rotate: -4 }}
          className="absolute right-2 sm:right-8 lg:left-auto lg:right-14 bottom-4 sm:bottom-8 w-[180px] sm:w-[220px] bg-white rounded-[20px] p-3.5 sm:p-4 text-left shadow-[0_12px_32px_rgba(15,42,53,0.08)] border border-[rgba(15,42,53,0.06)] cursor-default transition-shadow hover:shadow-xl hidden lg:block"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(15,42,53,0.06)] mb-2">
            <span className="text-xs font-semibold text-[#0F2A35]">Reviews Profile</span>
            <span className="text-[10px] bg-[#EEF3F4] text-[#5E6F77] px-1.5 py-0.5 rounded-full font-medium">
              Sample
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#E8943A] mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <p className="text-xs font-medium text-[#0F2A35]">4.8 on Google (sample)</p>
          <p className="text-[10px] text-[#5E6F77] mt-0.5">Verified trade profile sync</p>
        </motion.div>
      </Container>
    </section>
  );
}
