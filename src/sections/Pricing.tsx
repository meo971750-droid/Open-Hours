import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Tag, Check, ArrowRight, Clock, MessageCircle, Mail } from 'lucide-react';
import Accent from '../components/Accent';
import { Link } from 'react-router-dom';
import {
  PRICING_CONTENT,
  SHOW_PRICING,
  PACKAGES,
  ADS_MANAGEMENT_FROM,
  CONTACT,
  whatsappLink,
  SUPPORT,
} from '../content';
import { getPackagePagePath } from '../lib/links';

interface PricingProps {
  onOpenAudit: () => void;
}

export default function Pricing({ onOpenAudit }: PricingProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!SHOW_PRICING) {
    return null;
  }

  const hasWhatsApp = Boolean(whatsappLink());
  const hasEmail = Boolean(
    CONTACT.email && !CONTACT.email.startsWith('[') && CONTACT.email.includes('@')
  );

  return (
    <section
      id="pricing"
      className="w-full bg-[#EEF3F4] py-20 sm:py-28 md:py-32 overflow-visible scroll-mt-24"
    >
      {/* Section Container: Max-width 1320px, side padding 24px (20px at 1024-1279px) */}
      <div className="w-full max-w-[1320px] mx-auto px-6 max-[1279px]:min-[1024px]:px-5 overflow-visible">
        {/* Label Pill & Heading */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-medium text-[#1E4A5C]">
            <Tag className="w-3.5 h-3.5" />
            <span>{PRICING_CONTENT.pill}</span>
          </div>

          <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-2xl mb-4">
            Fixed prices. <Accent>No surprises.</Accent>
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#5E6F77] max-w-2xl">
            {PRICING_CONTENT.subtext}
          </p>
        </div>

        {/* Four Cards Grid:
            - 4 equal columns >= 1024px (gap 20px, 14px at 1024-1279px)
            - 2 columns at 768-1023px (gap 20px)
            - 1 column below 768px
            - align-items: stretch for equal heights
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-[1279px]:min-[1024px]:gap-3.5 items-stretch mb-14 overflow-visible">
          {PACKAGES.map((tier, idx) => {
            const isStandard = tier.id === 'standard';
            const isFirst = tier.id === 'first';

            return (
              <motion.article
                key={tier.id}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -4,
                        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                      }
                }
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={
                  'relative rounded-[24px] p-7 sm:px-6 sm:py-7 max-[1279px]:min-[1024px]:px-[18px] max-[1279px]:min-[1024px]:py-[22px] flex flex-col justify-between overflow-visible transition-shadow duration-[220ms] ease-out ' +
                  (isStandard
                    ? 'bg-[#EEF4F6] border-2 border-[#1E4A5C] shadow-[0_18px_44px_rgba(30,74,92,0.18)] hover:shadow-[0_26px_54px_rgba(30,74,92,0.24)]'
                    : 'bg-[#FFFFFF] border border-[#0F2A35]/[0.08] shadow-[0_12px_32px_rgba(15,42,53,0.08)] hover:shadow-[0_20px_42px_rgba(15,42,53,0.13)]')
                }
              >
                {/* Highlight Badge (Standard): "Recommended" top edge near right corner */}
                {isStandard && tier.tag && (
                  <div className="absolute -top-3.5 right-5 z-20 bg-[#1E4A5C] text-white text-[13px] font-bold px-3.5 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                    <span>{tier.tag}</span>
                  </div>
                )}

                {/* Peach Badge (1-page website): "Start here" top edge near right corner */}
                {isFirst && tier.tag && (
                  <div className="absolute -top-3.5 right-5 z-20 bg-[#E3B896] text-[#0F2A35] text-[13px] font-bold px-3.5 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                    <span>{tier.tag}</span>
                  </div>
                )}

                {/* Top Section (Reserved heights keep buttons aligned across the row) */}
                <div>
                  {/* Name Row */}
                  <div className="h-[32px] flex items-center mb-2">
                    <h3 className="text-[26px] max-[1279px]:min-[1024px]:text-[24px] font-semibold tracking-[-0.02em] text-[#0F2A35]">
                      {tier.name}
                    </h3>
                  </div>

                  {/* Description Area (Reserved min-height) */}
                  <div className="min-h-[4.5rem] max-[1279px]:min-[1024px]:min-h-[5.5rem] flex items-start mb-4">
                    <p className="text-[15px] leading-[1.5] text-[#5E6F77]">
                      {tier.description}
                    </p>
                  </div>

                  {/* Price Block (Reserved min-height 96px) */}
                  <div className="min-h-[96px] flex flex-col justify-end mb-3">
                    {isFirst ? (
                      <div
                        className="flex items-baseline"
                        aria-label="At no cost"
                      >
                        <span className="text-[34px] font-semibold text-[#0F2A35] tracking-tight leading-none">
                          At no cost
                        </span>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col"
                        aria-label={`from ${tier.setupAmount?.toLocaleString('en-IE')} euro setup`}
                      >
                        <span className="text-[14px] text-[#5E6F77] block mb-1 font-normal">
                          from
                        </span>
                        <div className="flex items-baseline">
                          <span className="text-[38px] font-semibold tabular-nums text-[#0F2A35] leading-none">
                            €{tier.setupAmount?.toLocaleString('en-IE')}
                          </span>
                          <span className="text-[15px] text-[#5E6F77] ml-1.5 align-baseline font-normal">
                            setup
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Care Line Area (Reserved min-height) */}
                  <div className="min-h-[3.25rem] max-[1279px]:min-[1024px]:min-h-[4.25rem] flex flex-col justify-start mb-3 text-[14px] text-[#5E6F77] leading-snug">
                    {tier.mutedLine && (
                      <p className="text-[12.5px] text-[#5E6F77] leading-snug mb-1">
                        {tier.mutedLine}
                      </p>
                    )}
                    <p className="text-[14px] text-[#5E6F77] leading-snug">
                      {tier.careLine}
                    </p>
                  </div>

                  {/* Timeline Line with Clock Icon */}
                  <div className="h-6 flex items-center gap-2 mb-5 text-[13.5px] font-medium text-[#0F2A35]">
                    <Clock className="w-4 h-4 text-[#1E4A5C] shrink-0" />
                    <span className="leading-snug">{tier.timeline}</span>
                  </div>

                  {/* Wide Solid Action Button (52px tall, radius 14px, 17px weight 600) */}
                  <button
                    type="button"
                    onClick={onOpenAudit}
                    className={
                      'w-full h-[52px] rounded-[14px] text-[17px] font-semibold flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] focus-visible:ring-offset-2 cursor-pointer ' +
                      (isStandard
                        ? 'bg-gradient-to-r from-[#1E4A5C] to-[#2B6A80] text-white shadow-[0_8px_24px_rgba(30,74,92,0.28)]'
                        : 'bg-gradient-to-r from-[#17323D] to-[#0F2A35] text-white shadow-[0_4px_16px_rgba(15,42,53,0.12)]')
                    }
                  >
                    <span>{tier.button}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="mt-2.5 text-center">
                    <Link
                      to={getPackagePagePath(tier.id)}
                      className="text-[15px] text-[#1E4A5C] hover:underline"
                    >
                      See what's included
                    </Link>
                  </div>
                </div>

                {/* Divider 1px rgba(15,42,53,.08) between button and features (20px spacing) */}
                <div className="my-5 border-t border-[rgba(15,42,53,0.08)]" />

                {/* Features Section */}
                <div className="flex-1 flex flex-col">
                  {/* Features Heading (Standard & Growth) */}
                  {tier.featuresHeading ? (
                    <h4 className="text-[15px] font-semibold text-[#0F2A35] mb-3 leading-snug">
                      {tier.featuresHeading}
                    </h4>
                  ) : (
                    /* Maintain spacing for first two cards if needed, or compact */
                    <div className="h-0" />
                  )}

                  {/* Feature Items List with 22px Circular Tiles */}
                  <ul className="space-y-3">
                    {tier.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-start gap-3 text-[15px] max-[1279px]:min-[1024px]:text-[14.5px] leading-[1.45] text-[#1B1F27]"
                      >
                        <div className="w-[22px] h-[22px] rounded-full bg-[#DCE9EC] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-[#1E4A5C]" strokeWidth={2.5} />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Centered Notes under the Grid (Exact specified order & styling) */}
        <div className="max-w-3xl mx-auto text-center space-y-2.5">
          {/* (1) 16px text with WhatsApp and Email links if configured */}
          <p className="text-[16px] text-[#0F2A35] font-medium leading-relaxed">
            Prefer to go straight to a full build? Message us and we&apos;ll quote it.
            {hasWhatsApp && (
              <>
                {' '}
                <a
                  href={whatsappLink()!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#1E4A5C] hover:text-[#0F2A35] inline-flex items-center gap-1 ml-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 inline" />
                  WhatsApp
                </a>
              </>
            )}
            {hasWhatsApp && hasEmail && ' or '}
            {hasEmail && (
              <>
                {' '}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="underline text-[#1E4A5C] hover:text-[#0F2A35] inline-flex items-center gap-1 ml-1"
                >
                  <Mail className="w-3.5 h-3.5 inline" />
                  email
                </a>
              </>
            )}
          </p>

          {/* (2) 13px muted: Prices are starting points... */}
          <p className="text-[13px] text-[#5E6F77] leading-relaxed">
            Prices are starting points. You get a fixed written quote before any paid build,
            and timelines start once we have your photos and details.
          </p>

          {/* (3) 13px muted: Google Ads management is separate... */}
          <p className="text-[13px] text-[#5E6F77] leading-relaxed">
            Google Ads management is separate: from €{ADS_MANAGEMENT_FROM}/month, with ad spend
            paid directly to Google. We never promise rankings or a set number of enquiries.
          </p>

          {/* (4) 13px muted: Domain registration is paid by you. */}
          <p className="text-[13px] text-[#5E6F77] leading-relaxed">
            Domain registration is paid by you.
          </p>

          {/* (5) 13px muted: SUPPORT.terms */}
          <p className="text-[13px] text-[#5E6F77] leading-relaxed">
            {SUPPORT.terms}
          </p>
        </div>
      </div>
    </section>
  );
}
