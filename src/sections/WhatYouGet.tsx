import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Globe,
  Zap,
  TrendingUp,
  Award,
} from 'lucide-react';
import Container from '../components/Container';
import { WHAT_YOU_GET_CONTENT } from '../content';
import {
  GoogleProfileAnimation,
  LocalSearchAnimation,
  SpeedMeterAnimation,
  EnquiryTrackerAnimation,
  PrivacyComplianceAnimation,
  WarrantySupportAnimation,
} from '../components/IncludedFeaturesAnimation';

export default function WhatYouGet() {
  return (
    <section
      id="included"
      className="w-full bg-[#EEF3F4] py-20 sm:py-28 md:py-32 overflow-x-clip scroll-mt-24"
    >
      <div id="what-you-get" className="sr-only" />
      <Container>
        {/* 'Included in every trade build' Animated Showcase */}
        <div>
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(15,42,53,0.08)] shadow-xs mb-3 text-[12px] font-semibold text-[#1E4A5C] tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#1E4A5C]" />
              <span>Standard with every site</span>
            </div>

            <h3 className="text-[28px] sm:text-[38px] md:text-[46px] font-normal tracking-[-0.03em] leading-[1.12] text-[#0F2A35] max-w-2xl mb-3">
              Included in every trade build
            </h3>

            <p className="text-[15px] sm:text-[16px] text-[#5E6F77] max-w-xl mx-auto leading-relaxed">
              Every Starter, Standard and Growth build comes with these six essentials ready on day one. Extras are quoted in writing before we start.
            </p>

            {/* Note under section subtext (Section C) */}
            <p className="text-[13px] text-[#5E6F77] text-center mt-2.5">
              Examples on these cards use a fictional business.
            </p>
          </div>

          {/* 6-Part Grid: Restyled with dark gradient, golden border */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 pt-6 overflow-visible">
            {WHAT_YOU_GET_CONTENT.checklist.map((item, i) => {
              const renderAnimatedImage = (index: number) => {
                switch (index) {
                  case 0:
                    return <GoogleProfileAnimation />;
                  case 1:
                    return <LocalSearchAnimation />;
                  case 2:
                    return <SpeedMeterAnimation />;
                  case 3:
                    return <EnquiryTrackerAnimation />;
                  case 4:
                    return <PrivacyComplianceAnimation />;
                  case 5:
                    return <WarrantySupportAnimation />;
                  default:
                    return <GoogleProfileAnimation />;
                }
              };

              const getPartIcon = (index: number) => {
                switch (index) {
                  case 0:
                    return <MapPin className="w-5 h-5 text-[#E3B896]" />;
                  case 1:
                    return <Globe className="w-5 h-5 text-[#E3B896]" />;
                  case 2:
                    return <Zap className="w-5 h-5 text-[#E3B896]" />;
                  case 3:
                    return <TrendingUp className="w-5 h-5 text-[#E3B896]" />;
                  case 4:
                    return <ShieldCheck className="w-5 h-5 text-[#E3B896]" />;
                  case 5:
                    return <Award className="w-5 h-5 text-[#E3B896]" />;
                  default:
                    return <CheckCircle2 className="w-5 h-5 text-[#E3B896]" />;
                }
              };

              const getPartBadge = (index: number) => {
                const badges = [
                  'Google Maps & Search',
                  'Local SEO Foundation',
                  'Core Web Vitals',
                  'Real-Time Attribution',
                  'Irish & EU GDPR',
                  '30-Day Guarantee',
                ];
                return badges[index] || 'Included';
              };

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8%' }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="trade-card-wrapper relative overflow-visible rounded-[28px] p-[1.5px] transition-all duration-[220ms] ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,42,53,0.38)] focus-within:ring-2 focus-within:ring-[#F3DDB8] group"
                >
                  {/* INNER card: border-radius 26.5px, dark gradient + peach radial glow top-right */}
                  <div
                    style={{
                      background: 'linear-gradient(180deg, #0F2A35 0%, #1E4A5C 100%)',
                      boxShadow: '0 18px 40px rgba(15, 42, 53, 0.28)',
                    }}
                    className="relative rounded-[26.5px] overflow-hidden flex flex-col h-full before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_90%_10%,rgba(227,184,150,0.14)_0%,transparent_60%)] before:pointer-events-none"
                  >
                    {/* TOP "screen" area: 14px dark margin on top/left/right, radius 18px, 1px border rgba(227,184,150,.35) */}
                    <div className="pt-3.5 px-3.5 pb-0">
                      <div className="h-[195px] sm:h-[210px] rounded-[18px] border border-[rgba(227,184,150,0.35)] overflow-hidden bg-gradient-to-b from-[#F9FBFC] to-[#EEF3F4] relative flex items-center justify-center">
                        {renderAnimatedImage(i)}
                      </div>
                    </div>

                    {/* BOTTOM text area on the dark background */}
                    <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between text-left">
                      <div>
                        {/* Icon & Category Tag */}
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="w-11 h-11 rounded-[14px] bg-[rgba(227,184,150,0.14)] flex items-center justify-center shrink-0">
                            {getPartIcon(i)}
                          </div>
                          <span className="text-[14px] font-semibold text-[#E3B896] bg-[rgba(227,184,150,0.14)] border border-[rgba(227,184,150,0.35)] px-3 py-1 rounded-full">
                            {getPartBadge(i)}
                          </span>
                        </div>

                        {/* Title: colour #E3B896 */}
                        <h4 className="text-[18px] sm:text-[19px] font-semibold text-[#E3B896] leading-snug mb-2">
                          {item.title}
                        </h4>
                        {/* Description: white at 88% */}
                        <p className="text-[14px] text-white/[0.88] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      {/* Divider & Standard Inclusion Footer */}
                      <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/[0.12] text-[13px]">
                        <span className="flex items-center gap-1.5 text-[#5ED1A0] font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-[#5ED1A0]" />
                          <span>Included as standard</span>
                        </span>
                        <span className="text-white/70 font-medium">
                          Ready on day 1
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Embedded CSS for trade cards hover and floating badge animations */}
      <style>{`
        .trade-card-wrapper {
          background: linear-gradient(135deg, #F3DDB8, #E3B896 45%, #C99A66);
        }
        .trade-card-wrapper:hover {
          background: linear-gradient(135deg, #FFF0D6, #F3DDB8 45%, #E3B896);
        }
        @media (prefers-reduced-motion: reduce) {
          .trade-card-wrapper {
            transition: none !important;
          }
          .trade-card-wrapper:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

