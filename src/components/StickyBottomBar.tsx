import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Video, MessageCircle } from 'lucide-react';
import { whatsappLink, CTA } from '../content';

interface StickyBottomBarProps {
  onOpenAudit: () => void;
}

export default function StickyBottomBar({ onOpenAudit }: StickyBottomBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;

      // Show after scrolling past hero (350px)
      const isPastHero = scrollY > 350;

      // Hide completely whenever the footer is in view
      const footerEl = document.querySelector('footer');
      const isFooterInView = footerEl ? footerEl.getBoundingClientRect().top <= winHeight : false;

      setVisible(isPastHero && !isFooterInView);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 70, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-3 inset-x-3 z-30 md:hidden flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto w-full max-w-sm bg-[#0F2A35]/95 backdrop-blur-md rounded-full p-1.5 shadow-[0_12px_32px_rgba(15,42,53,0.3)] border border-white/10 flex items-center justify-between gap-3">
            <div className="pl-3.5 flex items-center gap-2 text-white/90 text-xs font-medium">
              <Video className="w-3.5 h-3.5 text-[#E3B896] shrink-0" />
              <span>1-page website</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {whatsappLink() && (
                <a
                  href={whatsappLink()!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message us on WhatsApp"
                  className="w-10 h-10 rounded-full bg-[#2E9E6B] text-white flex items-center justify-center hover:bg-[#25855A] transition-colors shrink-0"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </a>
              )}
              <button
                type="button"
                onClick={onOpenAudit}
                className="h-10 px-4 bg-[#E3B896] text-[#0F2A35] font-semibold text-xs rounded-full flex items-center gap-1.5 hover:bg-white transition-colors cursor-pointer shrink-0"
              >
                <span>{CTA.short}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
