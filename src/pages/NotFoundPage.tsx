import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Container from '../components/Container';

export default function NotFoundPage() {
  return (
    <div className="w-full">
      <PageHeader
        pill="404"
        h1="Page not found"
        sub="The page you were looking for does not exist."
      />

      <div className="w-full bg-[#EEF3F4] py-16 sm:py-24 text-center">
        <Container>
          <div className="max-w-md mx-auto bg-white rounded-[28px] p-8 border border-[rgba(15,42,53,0.08)] shadow-[0_12px_32px_rgba(15,42,53,0.06)]">
            <p className="text-[16px] text-[#5E6F77] mb-6">
              Let&apos;s get you back to the main site.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0F2A35] text-white font-semibold text-[15px] hover:bg-[#1E4A5C] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
