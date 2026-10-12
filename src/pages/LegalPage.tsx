import React from 'react';
import { ArrowLeft, AlertCircle, Shield, Cookie, FileText } from 'lucide-react';
import Container from '../components/Container';
import { SITE_METADATA } from '../content';

interface LegalPageProps {
  type: 'privacy' | 'cookies' | 'terms';
  onBack: () => void;
}

export default function LegalPage({ type, onBack }: LegalPageProps) {
  const getMeta = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: <Shield className="w-5 h-5 text-[#1E4A5C]" />,
          updated: 'October 2026',
        };
      case 'cookies':
        return {
          title: 'Cookie Policy',
          icon: <Cookie className="w-5 h-5 text-[#1E4A5C]" />,
          updated: 'October 2026',
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: <FileText className="w-5 h-5 text-[#1E4A5C]" />,
          updated: 'October 2026',
        };
    }
  };

  const meta = getMeta();

  return (
    <div className="min-h-screen py-16 bg-white">
      <Container>
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#1E4A5C] hover:text-[#0F2A35] transition-colors mb-8 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] rounded-md px-2 py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Open Hours</span>
      </button>

      {/* Draft notice badge as requested */}
      <div className="bg-[#E3B896]/20 border border-[#E3B896] text-[#0F2A35] p-4 rounded-2xl mb-8 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#E8943A] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-sm">Notice: Draft. Needs legal review before launch.</span>
          <p className="text-xs text-[#5E6F77] mt-0.5">
            This document outlines our preliminary data protection and operational guidelines for Ireland and Malta under GDPR.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[rgba(15,42,53,0.08)] shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF3F4] flex items-center justify-center">
            {meta.icon}
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#0F2A35]">
            {meta.title}
          </h1>
        </div>
        <p className="text-xs text-[#5E6F77] mb-8 pb-4 border-b border-[rgba(15,42,53,0.06)]">
          Last revised: {meta.updated} · Applicable to {SITE_METADATA.companyLegalName}
        </p>

        {type === 'privacy' && (
          <div className="space-y-6 text-[#5E6F77] text-[15px] leading-relaxed">
            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">1. Who We Are</h2>
              <p>
                Open Hours is operated by {SITE_METADATA.founderName} ({SITE_METADATA.companyLegalName}, {SITE_METADATA.companyAddress}). We provide web design and Google Business Profile optimization services for trade contractors across Ireland and Malta.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">2. Information We Collect</h2>
              <p>
                When you request a 1-page website or 2-minute video audit, we collect only your work email address and business details (e.g. current website or Google Business Profile URL). We do not collect unnecessary personal data or sell contact information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">3. Purpose of Processing</h2>
              <p>
                We use your email solely to deliver the requested website and Google profile audit, follow up on your questions, and coordinate project services if you choose to proceed.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">4. Data Processing Agreement &amp; Security</h2>
              <p>
                For all client build contracts, we supply a standard GDPR Data Processing Agreement (DPA). Client domains, code repositories, and account credentials remain 100% owned by the client.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">5. Third-Party Services</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Reviews widget: provided by Senja (senja.io). It loads only after you allow it, and may receive your IP address and device information.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">6. Contact &amp; Access Requests</h2>
              <p>
                To request access, correction, or deletion of your data, contact us directly at {SITE_METADATA.contactEmail}.
              </p>
            </section>
          </div>
        )}

        {type === 'cookies' && (
          <div className="space-y-6 text-[#5E6F77] text-[15px] leading-relaxed">
            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your browser when you visit websites. They help the website function smoothly and remember your basic preferences.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">2. Strict No-Tracking Default</h2>
              <p>
                By default, this site does not load any tracking pixels, external ad networks, or third-party behavioral analytics. We only store your local cookie choice (`open_hours_cookie_consent_v1`) to prevent re-prompting the banner on repeat visits.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">3. Third-Party Widgets</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Reviews widget: provided by Senja (senja.io). It loads only after you allow it, and may receive your IP address and device information.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">4. Managing Your Preferences</h2>
              <p>
                You can change your consent choice at any time or clear your browser cookies to reset preferences.
              </p>
            </section>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-6 text-[#5E6F77] text-[15px] leading-relaxed">
            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">1. Scope of Work</h2>
              <p>
                All web design, development, and Google Profile setup engagements are governed by a written, fixed-price project scope provided prior to deposit payment.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">2. Ownership and Intellectual Property</h2>
              <p>
                Upon completion and final settlement, you own 100% of your domain, website code, and creative assets. There are no lock-in clauses or exit penalties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-[#0F2A35] mb-2">3. Care Plans and Cancellation</h2>
              <p>
                Ongoing hosting and care plans are billed on a flexible monthly basis and may be cancelled at any time with 14 days written notice.
              </p>
            </section>
          </div>
        )}
      </div>
      </Container>
    </div>
  );
}
