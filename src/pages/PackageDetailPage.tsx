import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Container from '../components/Container';
import { PAGES, PACKAGES, SETUP_FROM, CARE_FROM } from '../content';

interface PackageDetailPageProps {
  packageId: 'first' | 'starter' | 'standard' | 'growth';
  onOpenAudit: () => void;
}

export default function PackageDetailPage({ packageId, onOpenAudit }: PackageDetailPageProps) {
  const pageMeta = PAGES.find((p) => p.id === packageId);
  const pkg = PACKAGES.find((p) => p.id === packageId) || PACKAGES[0];

  return (
    <div className="w-full">
      <PageHeader
        pill={pageMeta?.pill || pkg.name}
        h1={pageMeta?.h1 || pkg.name}
        sub={pageMeta?.sub || pkg.description}
      />

      <div className="w-full bg-[#EEF3F4] py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl mx-auto bg-white rounded-[28px] p-6 sm:p-10 border border-[rgba(15,42,53,0.08)] shadow-[0_12px_32px_rgba(15,42,53,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(15,42,53,0.08)] mb-6">
              <div>
                <span className="text-sm font-semibold text-[#1E4A5C] uppercase tracking-wider">
                  Package Overview
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2A35] mt-1">
                  {pkg.name}
                </h2>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold text-[#0F2A35]">
                  {pkg.price}
                </div>
                <div className="text-xs text-[#5E6F77] mt-1">
                  {pkg.careLine}
                </div>
              </div>
            </div>

            {pkg.mutedLine && (
              <p className="text-sm text-[#5E6F77] mb-6 italic">
                {pkg.mutedLine}
              </p>
            )}

            <div className="mb-8">
              <h3 className="text-base font-semibold text-[#0F2A35] mb-4">
                What&apos;s included:
              </h3>
              <ul className="space-y-3">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[15px] text-[#0F2A35]">
                    <div className="w-5 h-5 rounded-full bg-[#DCE9EC] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#1E4A5C]" strokeWidth={2.5} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#5E6F77] mb-8 pb-6 border-b border-[rgba(15,42,53,0.08)]">
              <Clock className="w-4 h-4 text-[#1E4A5C]" />
              <span>{pkg.timeline}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#5E6F77] hover:text-[#0F2A35] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All packages</span>
              </Link>

              <button
                type="button"
                onClick={onOpenAudit}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0F2A35] text-white font-semibold text-[15px] hover:bg-[#1E4A5C] transition-colors shadow-sm cursor-pointer"
              >
                <span>{pkg.button}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
