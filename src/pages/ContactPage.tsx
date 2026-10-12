import React from 'react';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Container from '../components/Container';
import { CONTACT, whatsappLink } from '../content';

interface ContactPageProps {
  onOpenAudit: () => void;
}

export default function ContactPage({ onOpenAudit }: ContactPageProps) {
  const hasWhatsApp = Boolean(whatsappLink());

  return (
    <div className="w-full">
      <PageHeader
        pill="Contact"
        h1="Get in touch"
        sub="Ask a question or request your 1-page website."
      />

      <div className="w-full bg-[#EEF3F4] py-16 sm:py-24">
        <Container>
          <div className="max-w-2xl mx-auto bg-white rounded-[28px] p-8 sm:p-12 border border-[rgba(15,42,53,0.08)] shadow-[0_12px_32px_rgba(15,42,53,0.06)] text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2A35] mb-4">
              We&apos;re ready to help
            </h2>
            <p className="text-[16px] text-[#5E6F77] mb-8 leading-relaxed">
              Whether you want to start with a 1-page website or discuss a fuller build for your trade, we reply promptly during Irish and Maltese business hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                type="button"
                onClick={onOpenAudit}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0F2A35] text-white font-semibold text-[15px] hover:bg-[#1E4A5C] transition-colors shadow-sm cursor-pointer"
              >
                <span>Request your 1-page website</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {hasWhatsApp && (
                <a
                  href={whatsappLink()!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[rgba(15,42,53,0.2)] bg-white text-[#0F2A35] font-semibold text-[15px] hover:bg-[#EEF3F4] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#1E4A5C]" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>

            {CONTACT.email && !CONTACT.email.startsWith('[') && (
              <div className="pt-6 border-t border-[rgba(15,42,53,0.06)] text-sm text-[#5E6F77]">
                Email: <a href={`mailto:${CONTACT.email}`} className="text-[#1E4A5C] hover:underline font-medium">{CONTACT.email}</a>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
