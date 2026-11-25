import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useConsent } from '../lib/consent';
import { subscribeScroll } from '../lib/scrollHub';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [bottomBarVisible, setBottomBarVisible] = useState(false);
  const [widgetState, setWidgetState] = useState<{
    visible: boolean;
    mode: 'card' | 'form' | 'pill';
  }>({ visible: false, mode: 'pill' });
  const [isSmallMobile, setIsSmallMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const consent = useConsent();

  useEffect(() => {
    const unsubScroll = subscribeScroll(({ scrollY, winWidth }) => {
      const nextVis = scrollY > 400;
      const nextMob = winWidth < 640;
      setVisible((prev) => (prev === nextVis ? prev : nextVis));
      setIsSmallMobile((prev) => (prev === nextMob ? prev : nextMob));
    });

    const onBottomBar = (event: Event) => {
      const custom = event as CustomEvent<{ visible?: boolean }>;
      setBottomBarVisible(Boolean(custom.detail?.visible));
    };

    const onWidgetMode = (event: Event) => {
      const custom = event as CustomEvent<{
        visible?: boolean;
        mode?: 'card' | 'form' | 'pill';
      }>;
      setWidgetState({
        visible: Boolean(custom.detail?.visible),
        mode: custom.detail?.mode ?? 'pill',
      });
    };

    window.addEventListener('openhours:bottombar', onBottomBar);
    window.addEventListener('openhours:widget-mode', onWidgetMode);

    return () => {
      unsubScroll();
      window.removeEventListener('openhours:bottombar', onBottomBar);
      window.removeEventListener('openhours:widget-mode', onWidgetMode);
    };
  }, []);

  const scrollToTop = () => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  const hideWhileFormOpen = widgetState.visible && widgetState.mode === 'form';
  const showButton = visible && !hideWhileFormOpen && !(isSmallMobile && !consent.decided);

  if (!showButton) return null;

  const mobileBottomClass = bottomBarVisible
    ? widgetState.visible
      ? 'bottom-[138px]'
      : 'bottom-[76px]'
    : widgetState.visible
      ? 'bottom-[78px]'
      : 'bottom-4';

  const desktopBottomClass = widgetState.visible
    ? widgetState.mode === 'card'
      ? 'md:bottom-[204px]'
      : 'md:bottom-[94px]'
    : 'md:bottom-6';

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`oh-scale-in fixed ${mobileBottomClass} ${desktopBottomClass} right-4 md:right-6 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0F4A3E] text-white hover:bg-[#14624F] active:scale-[0.98] transition-[bottom,background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-[0_10px_28px_rgba(10,58,48,0.34)] border border-[#6FD6B0]/30 flex items-center justify-center cursor-pointer group`}
    >
      <ArrowUp
        className="w-5 h-5 text-white transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-0.5"
        strokeWidth={1.5}
      />
    </button>
  );
}
