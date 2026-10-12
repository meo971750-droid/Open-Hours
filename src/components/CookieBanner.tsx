import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cookie } from 'lucide-react';
import { getStoredConsent, setStoredConsent, ConsentStatus } from '../lib/cookieConsent';

interface CookieBannerProps {
  onOpenCookiesPage: () => void;
}

export default function CookieBanner({ onOpenCookiesPage }: CookieBannerProps) {
  const [status, setStatus] = useState<ConsentStatus>('accepted'); // default until mounted

  useEffect(() => {
    setStatus(getStoredConsent());
  }, []);

  const handleChoice = (decision: 'accepted' | 'rejected') => {
    setStoredConsent(decision);
    setStatus(decision);
  };

  if (status !== 'undecided') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-white rounded-[24px] p-5 shadow-[0_16px_40px_rgba(15,42,53,0.18)] border border-[rgba(15,42,53,0.1)]"
        role="region"
        aria-label="Cookie consent banner"
      >
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#EEF3F4] text-[#1E4A5C] flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[15px] font-semibold text-[#0F2A35]">
              Privacy &amp; Cookie Preferences
            </h4>
            <p className="text-[13px] text-[#5E6F77] leading-relaxed mt-1">
              We only use strictly necessary cookies to keep this site working. No analytics or tracking scripts load without your explicit consent. Read our{' '}
              <button
                type="button"
                onClick={onOpenCookiesPage}
                className="underline text-[#1E4A5C] hover:text-[#0F2A35]"
              >
                Cookie Policy
              </button>
              .
            </p>
          </div>
        </div>

        {/* Accept and Reject given EQUAL prominence */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => handleChoice('rejected')}
            className="w-full h-[42px] rounded-full border border-[rgba(15,42,53,0.2)] text-[#0F2A35] text-[13px] font-medium hover:bg-[#EEF3F4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] cursor-pointer"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => handleChoice('accepted')}
            className="w-full h-[42px] rounded-full bg-[#0F2A35] text-white text-[13px] font-medium hover:bg-[#1E4A5C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] cursor-pointer"
          >
            Accept
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
