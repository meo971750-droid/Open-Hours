import React from 'react';
import { Cookie } from 'lucide-react';
import { useConsent, setConsent } from '../lib/consent';

interface CookieBannerProps {
  onOpenCookiesPage: () => void;
}

export default function CookieBanner({ onOpenCookiesPage }: CookieBannerProps) {
  const consent = useConsent();

  const handleChoice = (decision: 'accepted' | 'rejected') => {
    if (decision === 'accepted') {
      setConsent({
        decided: true,
        accepted: true,
        thirdPartyReviews: true,
        at: new Date().toISOString(),
      });
    } else {
      setConsent({
        decided: true,
        accepted: false,
        thirdPartyReviews: false,
        at: new Date().toISOString(),
      });
    }
  };

  if (consent.decided) {
    return null;
  }

  return (
    <div
      className="oh-slide-up-in fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-[390px] z-50 bg-white rounded-[24px] p-5 shadow-[0_16px_40px_rgba(11,27,34,0.18)] border border-[rgba(11,27,34,0.09)]"
      role="region"
      aria-label="Cookie consent banner"
    >
      <div className="flex items-start gap-3.5 mb-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#DDF4EA] text-[#14624F] flex items-center justify-center shrink-0 mt-0.5 border border-[rgba(20,98,79,0.18)]">
          <Cookie className="w-4 h-4" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#0B1B22]">
            Privacy &amp; Cookie Preferences
          </p>
          <p className="text-[13px] text-[#475754] leading-relaxed mt-1">
            We use essential storage to run this site. If you accept, we also load customer reviews from Senja (a third-party service), which may receive your IP address.{' '}
            <a
              href="/cookies"
              onClick={(e) => {
                e.preventDefault();
                onOpenCookiesPage();
              }}
              className="underline text-[#14624F] hover:text-[#0F4A3E]"
            >
              Cookie Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Accept and Reject given EQUAL prominence */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => handleChoice('rejected')}
          className="w-full h-[42px] rounded-full border border-[rgba(11,27,34,0.2)] text-[#0B1B22] text-[13px] font-medium hover:bg-[#F3F5F3] active:scale-[0.98] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => handleChoice('accepted')}
          className="w-full h-[42px] rounded-full text-white text-[13px] font-medium active:scale-[0.98] transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #0F4A3E 0%, #14624F 65%, #14735A 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 8px 20px -6px rgba(63,209,165,0.4)',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
