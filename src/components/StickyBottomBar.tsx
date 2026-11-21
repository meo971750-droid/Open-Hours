import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MessageSquareText, MessageCircle } from 'lucide-react';
import { whatsappLink } from '../content';
import { OH_DUR, OH_EASE } from '../lib/motion';
import { useConsent } from '../lib/consent';

interface StickyBottomBarProps {
  onOpenAudit: () => void;
}

export default function StickyBottomBar({ onOpenAudit }: StickyBottomBarProps) {
  const [visible, setVisible] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const consent = useConsent();

  useEffect(() => {
    let rafId = 0;

    const updateVisibility = () => {
      rafId = 0;
      const smallMob = window.innerWidth < 640;
      setIsSmallMobile(smallMob);
      const winHeight = window.innerHeight;
      const heroEl = document.getElementById('hero');
      const heroPassed = heroEl
        ? heroEl.getBoundingClientRect().bottom <= Math.min(200, winHeight * 0.45)
        : window.scrollY > 380;

      const contactEl = document.getElementById('contact');
      const contactRect = contactEl?.getBoundingClientRect();
      const isContactInView = contactRect
        ? contactRect.top <= winHeight - 60 && contactRect.bottom >= 80
        : false;

      const footerEl = document.querySelector('footer');
      const footerRect = footerEl?.getBoundingClientRect();
      const isFooterInView = footerRect ? footerRect.top <= winHeight : false;

      const nextVisible = heroPassed && !isContactInView && !isFooterInView;
      setVisible(nextVisible);
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const showBar = visible && !(isSmallMobile && !consent.decided);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('openhours:bottombar', { detail: { visible: showBar } })
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent('openhours:bottombar', { detail: { visible: false } })
      );
    };
  }, [showBar]);

  const handleTalkToUs = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    onOpenAudit();
  };

  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 70, opacity: 0 }}
          transition={{ duration: OH_DUR.base, ease: OH_EASE }}
          className="fixed bottom-3 inset-x-3 z-30 md:hidden flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto w-full max-w-sm bg-[#050E0D]/95 backdrop-blur-md rounded-full p-1.5 shadow-[0_12px_32px_rgba(5,14,13,0.4)] border border-white/15 flex items-center justify-between gap-3">
            <div className="pl-3.5 flex items-center gap-2 text-white/95 text-xs font-medium min-w-0">
              <MessageSquareText className="w-3.5 h-3.5 text-[#6FD6B0] shrink-0" strokeWidth={1.75} />
              <span className="truncate">Free quote &amp; reply</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {whatsappLink() && (
                <a
                  href={whatsappLink()!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message us on WhatsApp"
                  className="w-10 h-10 rounded-full bg-[#14735A] text-white flex items-center justify-center hover:bg-[#0F4A3E] active:scale-[0.98] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] shrink-0"
                >
                  <MessageCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
                </a>
              )}
              <button
                type="button"
                onClick={handleTalkToUs}
                className="h-10 px-4 text-white font-semibold text-xs rounded-full flex items-center gap-1.5 active:scale-[0.98] transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #0F4A3E 0%, #14624F 65%, #14735A 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 8px 20px -4px rgba(63,209,165,0.4)',
                }}
              >
                <span>Talk to Us</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
