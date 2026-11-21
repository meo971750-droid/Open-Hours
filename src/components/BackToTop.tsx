import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { OH_DUR, OH_EASE } from '../lib/motion';
import { useConsent } from '../lib/consent';

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
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
      setIsSmallMobile(window.innerWidth < 640);
    };

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('openhours:bottombar', onBottomBar);
    window.addEventListener('openhours:widget-mode', onWidgetMode);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('openhours:bottombar', onBottomBar);
      window.removeEventListener('openhours:widget-mode', onWidgetMode);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  // Never render behind/over expanded quick-question form or small-mobile cookie banner
  const hideWhileFormOpen = widgetState.visible && widgetState.mode === 'form';
  const showButton = visible && !hideWhileFormOpen && !(isSmallMobile && !consent.decided);

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
    <AnimatePresence>
      {showButton && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: OH_DUR.fast, ease: OH_EASE }}
          className={`fixed ${mobileBottomClass} ${desktopBottomClass} right-4 md:right-6 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0F4A3E] text-white hover:bg-[#14624F] active:scale-[0.98] transition-[bottom,background-color,transform,box-shadow] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-[0_10px_28px_rgba(10,58,48,0.34)] border border-[#6FD6B0]/30 flex items-center justify-center cursor-pointer group`}
        >
          <ArrowUp
            className="w-5 h-5 text-white transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
