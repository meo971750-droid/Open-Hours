import React, { useState, useEffect, useRef } from 'react';
import { Quote, AlertCircle, RefreshCw } from 'lucide-react';
import Container from './Container';
import Accent from './Accent';
import { SENJA, REVIEWS_DISCLOSURE } from '../content';
import { getStoredConsent, setStoredConsent } from '../lib/cookieConsent';

interface SenjaEmbedProps {
  onOpenPrivacy?: () => void;
}

export default function SenjaEmbed({ onOpenPrivacy }: SenjaEmbedProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check stored cookie consent
  useEffect(() => {
    const current = getStoredConsent();
    if (current === 'accepted') {
      setHasConsent(true);
    }
  }, []);

  // IntersectionObserver: within 400px of viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
          }
        });
      },
      { rootMargin: '400px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Script injection logic: ONLY when BOTH consented AND within 400px of viewport
  useEffect(() => {
    if (!hasConsent || !isNearViewport) return;

    let retryTimeout: NodeJS.Timeout;
    let failTimeout: NodeJS.Timeout;

    const injectScript = () => {
      // Check if already injected
      let existing = document.querySelector(`script[src="${SENJA.scriptSrc}"]`) as HTMLScriptElement | null;
      if (!existing) {
        const script = document.createElement('script');
        script.src = SENJA.scriptSrc;
        script.async = true;
        script.onload = () => {
          setScriptLoaded(true);
        };
        script.onerror = () => {
          setLoadError(true);
        };
        document.body.appendChild(script);
      } else {
        setScriptLoaded(true);
      }
    };

    injectScript();

    // Verification check: if widget did not render inside container within 4s, re-add ONCE
    retryTimeout = setTimeout(() => {
      const embedDiv = containerRef.current?.querySelector('.senja-embed');
      const hasChildren = embedDiv && (embedDiv.children.length > 0 || (embedDiv as any).shadowRoot);
      if (!hasChildren && retryCount === 0) {
        setRetryCount(1);
        const existing = document.querySelector(`script[src="${SENJA.scriptSrc}"]`);
        if (existing) {
          existing.remove();
        }
        injectScript();
      }
    }, 4000);

    // If nothing renders within 8 seconds, show "Reviews could not be loaded right now."
    failTimeout = setTimeout(() => {
      const embedDiv = containerRef.current?.querySelector('.senja-embed');
      const hasChildren = embedDiv && (embedDiv.children.length > 0 || (embedDiv as any).shadowRoot);
      if (!hasChildren) {
        setLoadError(true);
      }
    }, 8000);

    return () => {
      clearTimeout(retryTimeout);
      clearTimeout(failTimeout);
    };
  }, [hasConsent, isNearViewport, retryCount]);

  const handleGrantConsent = () => {
    setStoredConsent('accepted');
    setHasConsent(true);
  };

  const handleRetry = () => {
    setLoadError(false);
    setRetryCount((prev) => prev + 1);
    const existing = document.querySelector(`script[src="${SENJA.scriptSrc}"]`);
    if (existing) {
      existing.remove();
    }
    const script = document.createElement('script');
    script.src = SENJA.scriptSrc;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setLoadError(true);
    document.body.appendChild(script);
  };

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="w-full bg-white py-20 sm:py-28 md:py-32 scroll-mt-24"
    >
      <Container>
        {/* Header (Centred, same style as other sections) */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3F4] border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-semibold text-[#1E4A5C]">
            <Quote className="w-3.5 h-3.5 text-[#1E4A5C]" />
            <span>Kind words</span>
          </div>

          <h2 className="text-[clamp(32px,4.4vw,56px)] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-3xl mb-4">
            What past clients <Accent>say</Accent>
          </h2>

          <p className="text-[17px] sm:text-[19px] text-[#5E6F77] max-w-xl mx-auto font-normal">
            Reviews from past clients.
          </p>
        </div>

        {/* Content Box */}
        <div ref={containerRef} className="w-full max-w-5xl mx-auto min-h-[320px] flex flex-col items-center justify-center">
          {!hasConsent ? (
            /* Before Consent: Card asking permission */
            <div className="w-full max-w-xl bg-white rounded-[24px] p-7 sm:p-9 border border-dashed border-[rgba(15,42,53,0.18)] shadow-sm text-center flex flex-col items-center">
              <h3 className="text-[20px] font-semibold text-[#0F2A35] mb-2">
                Reviews are shown by Senja
              </h3>
              <p className="text-[16px] text-[#5E6F77] mb-6 max-w-md">
                Senja is a third-party service. Allow it to load the reviews.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleGrantConsent}
                  className="px-6 h-12 rounded-full bg-[#0F2A35] text-white hover:bg-[#1E4A5C] text-[15px] font-semibold shadow-md transition-colors cursor-pointer"
                >
                  Load reviews
                </button>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="text-[14px] text-[#1E4A5C] hover:underline px-3 py-2 cursor-pointer font-medium"
                >
                  Privacy policy
                </button>
              </div>
            </div>
          ) : loadError ? (
            /* Error State with Retry */
            <div className="w-full max-w-md bg-white rounded-[24px] p-7 border border-[rgba(15,42,53,0.08)] shadow-sm text-center flex flex-col items-center">
              <p className="text-[16px] text-[#0F2A35] font-medium mb-4">
                Reviews could not be loaded right now.
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EEF3F4] text-[#0F2A35] hover:bg-[#DCE9EC] text-[14px] font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#1E4A5C]" />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            /* Consented: Render EXACT Senja embed element with shadow mode */
            <div className="w-full relative min-h-[320px]">
              {/* Fallback skeleton shimmer while script loads */}
              {!scriptLoaded && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl bg-[#F4F6F8] animate-pulse flex items-center justify-center text-xs text-[#5E6F77]"
                >
                  Loading verified reviews...
                </div>
              )}
              {/* EXACT element structure specified */}
              <div
                className="senja-embed"
                data-id={SENJA.widgetId}
                data-mode="shadow"
                data-lazyload="false"
                style={{ display: 'block', width: '100%' }}
              />
            </div>
          )}
        </div>

        {/* Reviews disclosure if non-empty */}
        {REVIEWS_DISCLOSURE.trim() && (
          <p className="text-[14px] text-[#5E6F77] text-center mt-6 max-w-xl mx-auto">
            {REVIEWS_DISCLOSURE.trim()}
          </p>
        )}

        {/* Dev mode reminder if disclosure is empty */}
        {import.meta.env.DEV && !REVIEWS_DISCLOSURE.trim() && (
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[12px] font-medium border border-amber-500/20">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>TODO: add an incentive disclosure if it applies</span>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
