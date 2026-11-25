import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageSquareText, MessageCircle } from 'lucide-react';
import { whatsappLink } from '../content';
import { useConsent } from '../lib/consent';
import { subscribeScroll } from '../lib/scrollHub';

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
    return subscribeScroll(({ scrollY, winWidth, winHeight, getBounds }) => {
      const smallMob = winWidth < 640;
      setIsSmallMobile((prev) => (prev === smallMob ? prev : smallMob));

      const heroBounds = getBounds('hero');
      const heroPassed = heroBounds
        ? heroBounds.bottom - scrollY <= Math.min(200, winHeight * 0.45)
        : scrollY > 380;

      const contactBounds = getBounds('contact');
      const isContactInView = contactBounds
        ? contactBounds.top - scrollY <= winHeight - 60 && contactBounds.bottom - scrollY >= 80
        : false;

      const footerBounds = getBounds('footer');
      const isFooterInView = footerBounds ? footerBounds.top - scrollY <= winHeight : false;

      const nextVisible = heroPassed && !isContactInView && !isFooterInView;
      setVisible((prev) => (prev === nextVisible ? prev : nextVisible));
    });
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

  if (!showBar) return null;

  return (
    <div className="oh-slide-up-in fixed bottom-3 inset-x-3 z-30 md:hidden flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm bg-[#050E0D]/98 rounded-full p-1.5 shadow-[0_12px_32px_rgba(5,14,13,0.4)] border border-white/15 flex items-center justify-between gap-3">
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
            className="h-10 px-4 text-white font-semibold text-xs rounded-full flex items-center gap-1.5 active:scale-[0.98] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer shrink-0"
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
    </div>
  );
}
