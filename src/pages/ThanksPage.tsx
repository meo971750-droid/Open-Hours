import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Container from '../components/Container';

export default function ThanksPage() {
  return (
    <div className="w-full">
      <PageHeader
        pill="Thank you"
        h1="Thank you"
        sub="We've received your message and will reply shortly."
      />

      <div className="w-full bg-[#EEF3F4] py-16 sm:py-24 text-center">
        <Container>
          <div className="max-w-xl mx-auto bg-white rounded-[28px] p-8 sm:p-12 border border-[rgba(15,42,53,0.08)] shadow-[0_12px_32px_rgba(15,42,53,0.06)]">
            <div className="w-16 h-16 rounded-full bg-[#DCE9EC] text-[#1E4A5C] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-semibold text-[#0F2A35] mb-3">
              Enquiry received
            </h2>
            <p className="text-[16px] text-[#5E6F77] mb-8 leading-relaxed">
              We will review your details and get in touch within 1 working day.
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0F2A35] text-white font-semibold text-[15px] hover:bg-[#1E4A5C] transition-colors shadow-sm"
            >
              <span>Back to home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
