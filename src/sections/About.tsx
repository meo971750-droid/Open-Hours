import React, { useState } from 'react';
import { Compass, Video, FileText, Shield, Clock, Euro } from 'lucide-react';
import Container from '../components/Container';
import { ABOUT_CONTENT, FOUNDER } from '../content';

export default function About() {
  const [imageError, setImageError] = useState(false);
  const showPortrait = Boolean(FOUNDER.photo && FOUNDER.photo.trim() && !imageError);

  const getProofIcon = (title: string) => {
    switch (title) {
      case 'Video calls':
        return <Video className="w-4 h-4 text-[#1E4A5C]" />;
      case 'Written contract':
        return <FileText className="w-4 h-4 text-[#1E4A5C]" />;
      case 'Data protection terms':
        return <Shield className="w-4 h-4 text-[#1E4A5C]" />;
      default:
        return <FileText className="w-4 h-4 text-[#1E4A5C]" />;
    }
  };

  return (
    <section id="about" className="w-full bg-[#EEF3F4] py-20 sm:py-28 overflow-hidden scroll-mt-24">
      <Container>
        {/* Label Pill & Heading */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-medium text-[#1E4A5C]">
            <Compass className="w-3.5 h-3.5" />
            <span>{ABOUT_CONTENT.pill}</span>
          </div>

          <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-2xl mb-4">
            Who we are
          </h2>
        </div>

        <div className="max-w-3xl lg:max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-[28px] border border-[rgba(15,42,53,0.06)] shadow-sm flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Founder portrait card (or circular initials placeholder fallback) */}
          {showPortrait ? (
            <div
              className="relative shrink-0 overflow-hidden rounded-[28px] border border-[rgba(15,42,53,0.08)] shadow-[0_18px_44px_rgba(15,42,53,0.18)] w-[min(78vw,300px)] md:w-[280px]"
              style={{ aspectRatio: '4 / 5' }}
            >
              <img
                src={FOUNDER.photo}
                alt={`Portrait of ${FOUNDER.name}, founder of Open Hours`}
                width="900"
                height="1125"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div
                className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 text-left pointer-events-none"
                style={{
                  height: '38%',
                  background: 'linear-gradient(to top, rgba(15, 42, 53, 0.78) 0%, transparent 100%)',
                }}
              >
                <div className="text-[24px] font-semibold text-white leading-tight">
                  {FOUNDER.name}
                </div>
                <div className="text-[15px] text-white/85 mt-0.5 leading-snug">
                  Founder, Open Hours
                </div>
              </div>
            </div>
          ) : (
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#DCE9EC] border-2 border-[#1E4A5C]/20 flex items-center justify-center text-[#1E4A5C] text-3xl sm:text-4xl font-heading font-semibold shadow-inner">
                {ABOUT_CONTENT.initials}
              </div>
              <span className="text-xs text-[#5E6F77] mt-3 font-medium">Founder Lead</span>
              {import.meta.env.DEV && (
                <span className="mt-2 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30">
                  missing: founder photo
                </span>
              )}
            </div>
          )}

          {/* Text & Proof Chips */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-[17px] sm:text-[19px] leading-[1.65] text-[#0F2A35] font-normal mb-6">
              {ABOUT_CONTENT.bodyText}
            </p>

            {/* Three small proof chips */}
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
              {ABOUT_CONTENT.proofChips.map((chip) => (
                <div
                  key={chip.title}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#EEF3F4] border border-[rgba(15,42,53,0.06)] text-[13px] text-[#0F2A35]"
                >
                  {getProofIcon(chip.title)}
                  <span className="font-medium">{chip.title}</span>
                </div>
              ))}
            </div>

            {/* Practical details bar */}
            <div className="mt-6 pt-6 border-t border-[rgba(15,42,53,0.06)] flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#5E6F77]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1E4A5C]" />
                <span>Irish &amp; Maltese business hours</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Euro className="w-3.5 h-3.5 text-[#1E4A5C]" />
                <span>Standard SEPA euro bank transfers</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
