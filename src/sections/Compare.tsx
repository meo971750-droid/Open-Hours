import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Scale,
  CheckCircle2,
  Clock,
  PhoneCall,
  FileCheck,
  ShieldCheck,
  Globe,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { CTA } from '../content';

interface CompareProps {
  onOpenAudit: () => void;
}

interface RowItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  openHours: {
    type: 'check';
    note?: string;
  };
  diyBuilders: {
    type: 'check' | 'na' | 'varies';
  };
  freelance: {
    type: 'check' | 'na' | 'varies';
  };
  agencies: {
    type: 'check' | 'na' | 'varies';
  };
}

const COMPARISON_ROWS: RowItem[] = [
  {
    id: 'row-1',
    label: 'Replies to enquiries after hours',
    icon: Clock,
    openHours: { type: 'check', note: 'Standard and Growth' },
    diyBuilders: { type: 'varies' },
    freelance: { type: 'varies' },
    agencies: { type: 'varies' },
  },
  {
    id: 'row-2',
    label: 'Texts back missed calls',
    icon: PhoneCall,
    openHours: { type: 'check', note: 'Standard and Growth' },
    diyBuilders: { type: 'varies' },
    freelance: { type: 'varies' },
    agencies: { type: 'varies' },
  },
  {
    id: 'row-3',
    label: 'Fixed price before you start',
    icon: FileCheck,
    openHours: { type: 'check' },
    diyBuilders: { type: 'check' },
    freelance: { type: 'varies' },
    agencies: { type: 'varies' },
  },
  {
    id: 'row-4',
    label: 'Deposit only after you approve the concept',
    icon: ShieldCheck,
    openHours: { type: 'check' },
    diyBuilders: { type: 'na' },
    freelance: { type: 'varies' },
    agencies: { type: 'varies' },
  },
  {
    id: 'row-5',
    label: 'You own the domain and the site',
    icon: Globe,
    openHours: { type: 'check' },
    diyBuilders: { type: 'varies' },
    freelance: { type: 'varies' },
    agencies: { type: 'varies' },
  },
  {
    id: 'row-6',
    label: 'Monthly enquiry report',
    icon: BarChart3,
    openHours: { type: 'check', note: 'Standard care and Growth' },
    diyBuilders: { type: 'varies' },
    freelance: { type: 'varies' },
    agencies: { type: 'varies' },
  },
];

export default function Compare({ onOpenAudit }: CompareProps) {
  const shouldReduceMotion = useReducedMotion();

  const renderCell = (
    cell: { type: 'check' | 'na' | 'varies'; note?: string },
    isOpenHours = false
  ) => {
    if (cell.type === 'check') {
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-1.5 text-[#52D489]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          </div>
          {cell.note && (
            <span
              className={`text-[11px] leading-tight text-center ${
                isOpenHours ? 'text-[#E3B896]' : 'text-white/60'
              }`}
            >
              {cell.note}
            </span>
          )}
        </div>
      );
    }
    if (cell.type === 'varies') {
      return (
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-[#F5B544] text-[12px] font-medium">
          <span className="font-semibold text-xs leading-none">~</span>
          <span>Varies</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center px-2 py-0.5 text-white/40 text-[12px] font-medium tracking-wide">
        N/A
      </div>
    );
  };

  return (
    <section
      id="compare"
      className="w-full bg-white py-12 sm:py-20 md:py-24 scroll-mt-24"
    >
      <Container>
        {/* Dark full-width rounded panel */}
        <div
          className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden p-6 sm:p-10 md:p-16 text-white shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #0F2A35 0%, #1E4A5C 100%)',
          }}
        >
          {/* Soft peach glow top-right at 14% */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-[100px]"
            style={{ background: 'rgba(227, 184, 150, 0.14)' }}
            aria-hidden="true"
          />

          {/* Header in white */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/25 bg-white/5 backdrop-blur-xs mb-4 text-[13px] font-medium text-white shadow-xs">
              <Scale className="w-3.5 h-3.5 text-[#E3B896]" />
              <span>Honest comparison</span>
            </div>

            <h2 className="text-[30px] sm:text-[42px] md:text-[52px] font-normal tracking-[-0.03em] leading-[1.08] text-white mb-4">
              Questions to ask <Accent className="text-[#E3B896]">any provider</Accent>
            </h2>

            <p className="text-[15px] sm:text-[17px] text-white/75 max-w-xl">
              A general comparison. Every provider is different, so check what each one includes.
            </p>
          </div>

          {/* Desktop Table (>= 900px) */}
          <div className="relative z-10 hidden min-[900px]:block overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 text-[13px] sm:text-[14px]">
                  <th scope="col" className="py-4 px-4 font-semibold text-white/60 w-[34%]">
                    Comparison criteria
                  </th>
                  {/* Highlighted Open Hours Column */}
                  <th
                    scope="col"
                    className="py-4 px-4 text-center font-bold text-[#E3B896] w-[20%] rounded-t-2xl border-t-[1.5px] border-x-[1.5px] border-[#E3B896]/70 bg-[rgba(227,184,150,0.08)] shadow-sm"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[15px] tracking-tight">Open Hours</span>
                      <span className="text-[10px] text-[#E3B896]/80 font-normal uppercase tracking-wider">
                        Trades Specialist
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="py-4 px-4 text-center font-medium text-white/80 w-[15%]">
                    DIY website builders
                  </th>
                  <th scope="col" className="py-4 px-4 text-center font-medium text-white/80 w-[15%]">
                    Freelance marketplaces
                  </th>
                  <th scope="col" className="py-4 px-4 text-center font-medium text-white/80 w-[16%]">
                    Typical web agencies
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {COMPARISON_ROWS.map((row, idx) => {
                  const RowIcon = row.icon;
                  const isLast = idx === COMPARISON_ROWS.length - 1;
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="py-4 px-4 text-[17px] font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(227,184,150,0.12)] border border-[#E3B896]/20 flex items-center justify-center shrink-0 text-[#E3B896]">
                            <RowIcon className="w-4 h-4" />
                          </div>
                          <span>{row.label}</span>
                        </div>
                      </td>
                      {/* Highlighted column cell */}
                      <td
                        className={`py-4 px-4 text-center bg-[rgba(227,184,150,0.08)] border-x-[1.5px] border-[#E3B896]/70 ${
                          isLast ? 'border-b-[1.5px] rounded-b-2xl' : ''
                        }`}
                      >
                        {renderCell(row.openHours, true)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {renderCell(row.diyBuilders)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {renderCell(row.freelance)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {renderCell(row.agencies)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View (< 900px): Each row becomes a card */}
          <div className="relative z-10 block min-[900px]:hidden space-y-4">
            {COMPARISON_ROWS.map((row) => {
              const RowIcon = row.icon;
              return (
                <div
                  key={row.id}
                  className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 sm:p-5 flex flex-col gap-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(227,184,150,0.12)] border border-[#E3B896]/20 flex items-center justify-center shrink-0 text-[#E3B896]">
                      <RowIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[16px] font-semibold text-white leading-snug">
                      {row.label}
                    </span>
                  </div>

                  {/* Open Hours line - highlighted */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[rgba(227,184,150,0.1)] border border-[#E3B896]/40">
                    <span className="text-[13px] font-bold text-[#E3B896]">Open Hours</span>
                    <div className="flex items-center gap-2">
                      {renderCell(row.openHours, true)}
                    </div>
                  </div>

                  {/* Other 3 options */}
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02]">
                      <span className="text-[12px] text-white/70">DIY builders</span>
                      {renderCell(row.diyBuilders)}
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02]">
                      <span className="text-[12px] text-white/70">Freelancers</span>
                      {renderCell(row.freelance)}
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02]">
                      <span className="text-[12px] text-white/70">Agencies</span>
                      {renderCell(row.agencies)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Under the table footer */}
          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-[14px] sm:text-[15px] text-white/75 max-w-xl">
              Not a ranking. &apos;Varies&apos; means it depends on the provider and the plan, so ask before you buy.
            </p>
            <motion.button
              type="button"
              onClick={onOpenAudit}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-white text-[#0F2A35] hover:bg-[#FBF8F3] text-[15px] font-semibold shadow-lg transition-colors shrink-0 cursor-pointer"
            >
              <span>{CTA.label}</span>
              <ArrowRight className="w-4 h-4 text-[#1E4A5C]" />
            </motion.button>
          </div>
        </div>
      </Container>
    </section>
  );
}
