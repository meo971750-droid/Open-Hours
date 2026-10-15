import React from 'react';
import { motion } from 'motion/react';
import { Euro, Clock, ShieldCheck, MapPin } from 'lucide-react';
import Container from '../components/Container';
import { CONFIG } from '../config';

const FACT_ICONS = [Euro, Clock, ShieldCheck, MapPin];

export default function FactsStrip() {
  return (
    <section
      id="facts"
      aria-label="Studio facts and trade specialisation"
      className="w-full bg-white py-12 sm:py-16 border-b border-[rgba(15,42,53,0.06)]"
    >
      <Container>
        {/* Row of 4 fact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {CONFIG.facts.map((fact, index) => {
            const Icon = FACT_ICONS[index % FACT_ICONS.length];
            return (
              <motion.div
                key={fact.label}
                initial={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="bg-[#F4F6F8] border border-[rgba(15,42,53,0.06)] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-white border border-[rgba(15,42,53,0.06)] flex items-center justify-center text-[#1E4A5C] mb-3 shadow-2xs">
                    <Icon className="w-4 h-4 text-[#1E4A5C]" />
                  </div>
                  <h3 className="text-[17px] sm:text-[18px] font-semibold text-[#0F2A35] leading-snug">
                    {fact.value}
                  </h3>
                  {fact.detail && (
                    <p className="text-[13px] text-[#5E6F77] mt-1.5 leading-relaxed">
                      {fact.detail}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Row of trade pill chips */}
        <div className="mt-8 pt-6 border-t border-[rgba(15,42,53,0.06)] flex flex-col sm:flex-row sm:items-center justify-center gap-3 text-center sm:text-left">
          <span className="text-[12px] font-semibold text-[#5E6F77] tracking-wider uppercase shrink-0">
            Trades we build for
          </span>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
            {CONFIG.trades.map((trade) => (
              <span
                key={trade}
                className="inline-flex items-center px-3 py-1 rounded-full bg-[#EEF3F4] text-[#1E4A5C] text-[12px] sm:text-[13px] font-medium border border-[rgba(15,42,53,0.06)]"
              >
                {trade}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
