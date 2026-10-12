import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowRight } from 'lucide-react';
import Container from '../components/Container';
import Accent from '../components/Accent';
import { PACKAGES, SETUP_FROM } from '../content';
import { getPackagePagePath } from '../lib/links';

export default function PackagesSummary() {
  return (
    <section id="packages-summary" className="w-full bg-[#EEF3F4] py-20 sm:py-28 scroll-mt-24">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[13px] font-medium text-[#1E4A5C]">
            <Tag className="w-3.5 h-3.5" />
            <span>Packages</span>
          </div>

          <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] max-w-2xl mb-4">
            Start small, <Accent>grow</Accent> when it makes sense
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#5E6F77] max-w-2xl">
            Four ways to work with us.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-12">
          {PACKAGES.map((pkg) => {
            const isFirst = pkg.id === 'first';
            const isStandard = pkg.id === 'standard';
            const priceDisplay = isFirst
              ? 'At no cost'
              : `from €${SETUP_FROM[pkg.id as keyof typeof SETUP_FROM]?.toLocaleString() ?? ''} setup`;

            return (
              <article
                key={pkg.id}
                className="bg-white rounded-[24px] p-6 border border-[rgba(15,42,53,0.08)] shadow-[0_8px_24px_rgba(15,42,53,0.06)] flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,42,53,0.1)]"
              >
                <div>
                  {/* Tag if applicable */}
                  <div className="h-7 mb-2 flex items-center">
                    {isFirst && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F6E6D8] text-[#8A5A3B]">
                        Start here
                      </span>
                    )}
                    {isStandard && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCE9EC] text-[#1E4A5C]">
                        Recommended
                      </span>
                    )}
                  </div>

                  <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-[#0F2A35] mb-2">
                    {pkg.name}
                  </h3>

                  <div className="text-[18px] font-semibold text-[#0F2A35] mb-3">
                    {priceDisplay}
                  </div>

                  <p className="text-[14.5px] leading-relaxed text-[#5E6F77] mb-6">
                    {pkg.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[rgba(15,42,53,0.06)]">
                  <Link
                    to={getPackagePagePath(pkg.id)}
                    className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#1E4A5C] hover:text-[#0F2A35] group transition-colors"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Centred secondary button */}
        <div className="flex justify-center">
          <Link
            to="/packages"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[rgba(15,42,53,0.18)] bg-white text-[#0F2A35] font-semibold text-[15px] hover:bg-[#EEF3F4] transition-colors shadow-xs group"
          >
            <span>Compare packages</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
