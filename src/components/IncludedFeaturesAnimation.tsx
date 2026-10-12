import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  MapPin,
  Search,
  Star,
  Check,
  CheckCircle2,
  ShieldCheck,
  Zap,
  PhoneCall,
  MessageCircle,
  FileText,
  Clock,
  Sparkles,
  Lock,
  Headphones,
  Award,
  Globe,
  Smartphone,
  Gauge,
  Sliders,
  Bell,
  TrendingUp,
} from 'lucide-react';

/* =========================================================================
   1. Google Business Profile Tidy-up Animation
   ========================================================================= */
export function GoogleProfileAnimation() {
  const shouldReduceMotion = useReducedMotion();
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setActivePhoto((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const photos = [
    { label: 'Slate Roof', desc: 'Galway City project' },
    { label: 'Chimney Flashing', desc: 'Salthill repair' },
    { label: 'Gutter Replacement', desc: 'Oranmore build' },
  ];

  return (
    <div className="w-full h-full p-3.5 flex flex-col justify-between select-none overflow-hidden relative font-sans">
      {/* Top Search & Verification Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[rgba(15,42,53,0.08)]">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-[#1E4A5C] flex items-center justify-center text-white text-[10px] font-bold">
            G
          </div>
          <span className="text-[11px] font-semibold text-[#0F2A35] truncate">
            Murphy Roofing · Galway
          </span>
        </div>
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : { scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }
          }
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#2E9E6B]/15 text-[#2E9E6B] text-[9.5px] font-semibold"
        >
          <ShieldCheck className="w-3 h-3" />
          <span>Verified ✓</span>
        </motion.div>
      </div>

      {/* Main Business Profile Card */}
      <div className="bg-white rounded-xl p-2.5 shadow-xs border border-[rgba(15,42,53,0.06)] space-y-2">
        {/* Rating & Category */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[12px] font-bold text-[#0F2A35]">5.0</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-[#5E6F77]">(48 reviews)</span>
            </div>
            <p className="text-[9.5px] text-[#5E6F77] mt-0.5">
              Roofing Contractor · Certified Trade
            </p>
          </div>

          <div className="flex items-center gap-1 text-[9.5px] text-[#2E9E6B] font-medium bg-[#2E9E6B]/10 px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E6B] animate-pulse" />
            <span>Open now</span>
          </div>
        </div>

        {/* Profile Strength Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[9px] text-[#5E6F77]">
            <span className="font-medium text-[#1E4A5C]">Profile Strength</span>
            <span className="font-bold text-[#2E9E6B]">100% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-[#EEF3F4] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '60%' }}
              animate={shouldReduceMotion ? { width: '100%' } : { width: ['70%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-[#1E4A5C] to-[#2E9E6B] rounded-full"
            />
          </div>
        </div>

        {/* Dynamic Project Photo Carousel Preview */}
        <div className="flex items-center gap-2 pt-0.5">
          {photos.map((item, idx) => (
            <motion.div
              key={idx}
              animate={activePhoto === idx ? { scale: 1.02, opacity: 1 } : { scale: 0.96, opacity: 0.6 }}
              transition={{ duration: 0.3 }}
              className={`flex-1 py-1 px-1.5 rounded-md text-center transition-all ${
                activePhoto === idx
                  ? 'bg-[#DCE9EC] border border-[#1E4A5C]/25 text-[#1E4A5C]'
                  : 'bg-[#F7F9FA] border border-transparent text-[#5E6F77]'
              }`}
            >
              <div className="text-[8.5px] font-semibold truncate">{item.label}</div>
              <div className="text-[7.5px] opacity-75 truncate">{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Areas & Call Action Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1 text-[9.5px] text-[#5E6F77]">
          <MapPin className="w-3 h-3 text-[#1E4A5C] shrink-0" />
          <span className="truncate">Galway City · Salthill · Oranmore</span>
        </div>
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="px-2 py-1 rounded-lg bg-[#0F2A35] text-white text-[9.5px] font-medium flex items-center gap-1 shadow-xs"
        >
          <PhoneCall className="w-2.5 h-2.5 text-[#E3B896]" />
          <span>Call Declan</span>
        </motion.div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. Local Search Foundations Animation
   ========================================================================= */
export function LocalSearchAnimation() {
  const shouldReduceMotion = useReducedMotion();
  const queries = ['roofers in Galway', 'emergency roofer Galway', 'roof repair Salthill'];
  const [queryIndex, setQueryIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setQueryIndex((prev) => (prev + 1) % queries.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div className="w-full h-full p-3.5 flex flex-col justify-between select-none overflow-hidden relative font-sans">
      {/* Animated Search Bar */}
      <div className="bg-white rounded-xl px-2.5 py-1.5 border border-[rgba(15,42,53,0.1)] shadow-xs flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-[#1E4A5C] shrink-0" />
        <div className="flex-1 text-[11px] font-medium text-[#0F2A35] truncate flex items-center">
          <span>{queries[queryIndex]}</span>
          <motion.span
            animate={shouldReduceMotion ? { opacity: 0 } : { opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.9 }}
            className="inline-block w-0.5 h-3.5 bg-[#1E4A5C] ml-0.5"
          />
        </div>
        <span className="text-[9px] font-bold text-[#1E4A5C] bg-[#DCE9EC] px-1.5 py-0.5 rounded">
          Local Pack
        </span>
      </div>

      {/* Radar Map & Geographic Pins */}
      <div className="relative h-[82px] bg-[#EAF0F2] rounded-xl overflow-hidden border border-[rgba(15,42,53,0.06)] flex items-center justify-center">
        {/* Subtle Map Grid Lines */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#1E4A5C 1px, transparent 1px), linear-gradient(90deg, #1E4A5C 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        {/* Sonar Radar Wave */}
        {!shouldReduceMotion && (
          <motion.div
            animate={{ scale: [0.6, 2.4], opacity: [0.7, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeOut' }}
            className="absolute w-12 h-12 rounded-full border-2 border-[#1E4A5C] pointer-events-none"
          />
        )}

        {/* Central Pin - Galway */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-[#1E4A5C] text-white flex items-center justify-center shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#E3B896]" />
          </div>
          <span className="bg-[#0F2A35] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full shadow-xs mt-0.5 whitespace-nowrap">
            Galway Central
          </span>
        </div>

        {/* Satellite Pin - Salthill */}
        <div className="absolute left-4 top-2 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#2E9E6B]" />
          <span className="text-[8px] font-semibold text-[#1E4A5C] bg-white/80 px-1 rounded shadow-2xs">
            Salthill
          </span>
        </div>

        {/* Satellite Pin - Oranmore */}
        <div className="absolute right-4 bottom-2 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#2E9E6B]" />
          <span className="text-[8px] font-semibold text-[#1E4A5C] bg-white/80 px-1 rounded shadow-2xs">
            Oranmore
          </span>
        </div>
      </div>

      {/* Organic Result Snippet Preview */}
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [0, -1.5, 0] }}
        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        className="bg-white rounded-lg p-2 shadow-xs border border-[rgba(15,42,53,0.06)] flex items-center justify-between"
      >
        <div className="truncate mr-2">
          <div className="flex items-center gap-1 text-[9px] text-[#5E6F77]">
            <Globe className="w-2.5 h-2.5 text-[#1E4A5C]" />
            <span className="truncate">murphyroofing.ie › galway-roofers</span>
          </div>
          <div className="text-[10px] font-semibold text-[#0F2A35] truncate">
            Murphy Roofing · Galway Roofers
          </div>
        </div>
        <div className="px-1.5 py-0.5 rounded bg-[#2E9E6B]/15 text-[#2E9E6B] text-[9px] font-bold whitespace-nowrap">
          Local Pack
        </div>
      </motion.div>
    </div>
  );
}

/* =========================================================================
   3. Speed & Mobile Checks Animation
   ========================================================================= */
export function SpeedMeterAnimation() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full h-full p-3.5 flex flex-col justify-between select-none overflow-hidden relative font-sans">
      {/* Top Header: Lighthouse & Core Web Vitals */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(15,42,53,0.08)]">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-[#2E9E6B]" />
          <span className="text-[11px] font-semibold text-[#0F2A35]">
            Google PageSpeed Score
          </span>
        </div>
        <span className="text-[9px] font-semibold text-[#2E9E6B] bg-[#2E9E6B]/10 px-1.5 py-0.5 rounded">
          Mobile-first
        </span>
      </div>

      {/* Main Meter Area: Circular Gauge + Metrics */}
      <div className="flex items-center gap-3 py-1">
        {/* Animated Circular SVG Meter */}
        <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            {/* Background ring */}
            <path
              className="text-[#EEF3F4]"
              strokeWidth="3.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Animated green progress ring */}
            <motion.path
              initial={{ strokeDasharray: '0, 100' }}
              animate={
                shouldReduceMotion
                  ? { strokeDasharray: '100, 100' }
                  : { strokeDasharray: ['85, 100', '100, 100'] }
              }
              transition={{ duration: 2.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              className="text-[#2E9E6B]"
              strokeWidth="3.4"
              strokeDasharray="100, 100"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#0F2A35] leading-none">100</span>
            <span className="text-[7.5px] font-bold text-[#2E9E6B] uppercase tracking-wider mt-0.5">
              Pass
            </span>
          </div>
        </div>

        {/* 3 Core Web Vitals Cards */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between bg-white px-2 py-1 rounded-md border border-[rgba(15,42,53,0.06)] shadow-2xs">
            <span className="text-[9.5px] font-medium text-[#5E6F77]">FCP (Paint)</span>
            <span className="text-[10px] font-bold text-[#2E9E6B]">0.38s ✓</span>
          </div>
          <div className="flex items-center justify-between bg-white px-2 py-1 rounded-md border border-[rgba(15,42,53,0.06)] shadow-2xs">
            <span className="text-[9.5px] font-medium text-[#5E6F77]">LCP (Content)</span>
            <span className="text-[10px] font-bold text-[#2E9E6B]">0.72s ✓</span>
          </div>
          <div className="flex items-center justify-between bg-white px-2 py-1 rounded-md border border-[rgba(15,42,53,0.06)] shadow-2xs">
            <span className="text-[9.5px] font-medium text-[#5E6F77]">CLS (Shift)</span>
            <span className="text-[10px] font-bold text-[#2E9E6B]">0.00 ✓</span>
          </div>
        </div>
      </div>

      {/* Simulated Mobile Load Speed Banner */}
      <div className="bg-[#1E4A5C] text-white rounded-lg px-2.5 py-1.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-1.5 text-[9.5px]">
          <Zap className="w-3 h-3 text-amber-300" />
          <span className="font-medium">Speed checked before launch</span>
        </div>
        <motion.div
          animate={shouldReduceMotion ? {} : { opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1.5 h-1.5 rounded-full bg-[#2E9E6B]"
        />
      </div>
    </div>
  );
}

/* =========================================================================
   4. Enquiry Tracking Animation
   ========================================================================= */
export function EnquiryTrackerAnimation() {
  const shouldReduceMotion = useReducedMotion();
  const [activeItem, setActiveItem] = useState(0);

  const leads = [
    {
      type: 'Phone Call',
      contact: '087 492 ****',
      src: 'Google Maps',
      time: '09:14 AM',
      icon: PhoneCall,
      color: '#1E4A5C',
    },
    {
      type: 'WhatsApp Lead',
      contact: 'Roof Leak Quote',
      src: 'Mobile Header',
      time: '11:28 AM',
      icon: MessageCircle,
      color: '#2E9E6B',
    },
    {
      type: 'Quote Form',
      contact: 'Attic Slate Repair',
      src: 'Website Form',
      time: '14:05 PM',
      icon: FileText,
      color: '#0F2A35',
    },
  ];

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % leads.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div className="w-full h-full p-3.5 flex flex-col justify-between select-none overflow-hidden relative font-sans">
      {/* Stream Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(15,42,53,0.08)]">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#1E4A5C]" />
          <span className="text-[11px] font-semibold text-[#0F2A35]">
            Attribution Event Log
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9.5px] font-semibold text-[#2E9E6B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E6B] animate-pulse" />
          <span>Live feed</span>
        </div>
      </div>

      {/* Incoming Lead Cards Stack */}
      <div className="space-y-1.5 py-0.5">
        {leads.map((lead, idx) => {
          const Icon = lead.icon;
          const isActive = idx === activeItem;
          return (
            <motion.div
              key={idx}
              animate={
                isActive
                  ? { scale: 1.02, x: 2, opacity: 1 }
                  : { scale: 0.98, x: 0, opacity: 0.65 }
              }
              transition={{ duration: 0.3 }}
              className={`p-1.5 rounded-lg border transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-white border-[#1E4A5C]/30 shadow-xs'
                  : 'bg-[#F4F7F8] border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: lead.color }}
                >
                  <Icon className="w-2.5 h-2.5" />
                </div>
                <div className="truncate">
                  <div className="text-[9.5px] font-bold text-[#0F2A35] truncate">
                    {lead.type}: <span className="font-normal">{lead.contact}</span>
                  </div>
                  <div className="text-[8px] text-[#5E6F77] truncate">
                    Via {lead.src} · {lead.time}
                  </div>
                </div>
              </div>

              <span className="text-[8.5px] font-semibold text-[#2E9E6B] bg-[#2E9E6B]/10 px-1 py-0.5 rounded whitespace-nowrap">
                Captured ✓
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Leads Counter Bar */}
      <div className="bg-[#DCE9EC] rounded-lg px-2 py-1 flex items-center justify-between text-[#1E4A5C] text-[9.5px]">
        <span className="font-medium">14 enquiries recorded this week</span>
        <span className="font-bold text-[#0F2A35]">100% Tracked</span>
      </div>
    </div>
  );
}

/* =========================================================================
   5. Privacy & Cookie Basics Animation
   ========================================================================= */
export function PrivacyComplianceAnimation() {
  const shouldReduceMotion = useReducedMotion();
  const [toggleState, setToggleState] = useState(true);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setToggleState((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div className="w-full h-full p-3.5 flex flex-col justify-between select-none overflow-hidden relative font-sans">
      {/* Header with GDPR shield */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(15,42,53,0.08)]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1E4A5C]" />
          <span className="text-[11px] font-semibold text-[#0F2A35]">
            GDPR Consent Framework
          </span>
        </div>
        <span className="text-[9px] font-bold text-[#1E4A5C] bg-[#DCE9EC] px-1.5 py-0.5 rounded">
          Privacy-first
        </span>
      </div>

      {/* Simulated Cookie Consent Module */}
      <div className="bg-white rounded-xl p-2.5 shadow-xs border border-[rgba(15,42,53,0.06)] space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-semibold text-[#0F2A35]">Clean Cookie Controls</span>
          <span className="text-[8.5px] text-[#5E6F77]">No tracking before consent</span>
        </div>

        {/* Toggle 1: Strictly Necessary (Always On) */}
        <div className="flex items-center justify-between bg-[#F7F9FA] p-1.5 rounded-md text-[9.5px]">
          <div className="flex items-center gap-1.5 text-[#0F2A35]">
            <Lock className="w-2.5 h-2.5 text-[#1E4A5C]" />
            <span>Essential Contact Forms</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-[#2E9E6B] font-semibold">Active</span>
            <div className="w-6 h-3 bg-[#2E9E6B] rounded-full p-0.5 flex justify-end">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Toggle 2: Privacy Analytics (Smooth Toggle) */}
        <div className="flex items-center justify-between bg-[#F7F9FA] p-1.5 rounded-md text-[9.5px]">
          <div className="flex items-center gap-1.5 text-[#0F2A35]">
            <Sliders className="w-2.5 h-2.5 text-[#1E4A5C]" />
            <span>Anonymous Visitor Count</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-medium text-[#5E6F77]">
              {toggleState ? 'Consented' : 'Optional'}
            </span>
            <motion.div
              animate={{ backgroundColor: toggleState ? '#2E9E6B' : '#CBD5E1' }}
              className="w-6 h-3 rounded-full p-0.5 flex items-center cursor-pointer"
            >
              <motion.div
                animate={{ x: toggleState ? 12 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-2 h-2 rounded-full bg-white shadow-xs"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Compliance Stamp Footer */}
      <div className="flex items-center justify-between text-[9px] text-[#5E6F77] pt-0.5">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-[#2E9E6B]" />
          <span>Full Legal Drafts Provided</span>
        </span>
        <span className="font-semibold text-[#1E4A5C]">100% Client Owned</span>
      </div>
    </div>
  );
}

/* =========================================================================
   6. 30 Days of Post-Launch Fixes Animation
   ========================================================================= */
export function WarrantySupportAnimation() {
  const shouldReduceMotion = useReducedMotion();
  const [ticketState, setTicketState] = useState<'request' | 'done'>('done');

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setTicketState((prev) => (prev === 'request' ? 'done' : 'request'));
    }, 3200);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div className="w-full h-full p-3.5 flex flex-col justify-between select-none overflow-hidden relative font-sans">
      {/* Header with Lifetime Support Stamp */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(15,42,53,0.08)]">
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#1E4A5C]" />
          <span className="text-[11px] font-semibold text-[#0F2A35]">
            Support after you go live
          </span>
        </div>
        <span className="text-[9px] font-bold text-[#2E9E6B] bg-[#2E9E6B]/15 px-1.5 py-0.5 rounded">
          €0 Extra Cost
        </span>
      </div>

      {/* Support Timeline Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[8.5px] font-medium text-[#5E6F77]">
          <span>Launch Day 1</span>
          <span className="text-[#1E4A5C] font-bold">Lifetime support</span>
          <span>Ongoing</span>
        </div>
        <div className="relative w-full h-2 bg-[#EEF3F4] rounded-full overflow-hidden">
          <motion.div
            animate={
              shouldReduceMotion
                ? { width: '80%' }
                : { width: ['30%', '90%', '50%'] }
            }
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#1E4A5C] to-[#2E9E6B] rounded-full"
          />
        </div>
      </div>

      {/* Mini Support Chat Exchange */}
      <div className="bg-white rounded-xl p-2 shadow-xs border border-[rgba(15,42,53,0.06)] space-y-1.5">
        <div className="flex items-start gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#DCE9EC] text-[#1E4A5C] text-[8px] font-bold flex items-center justify-center shrink-0">
            D
          </div>
          <div className="bg-[#EEF3F4] rounded-lg rounded-tl-none px-2 py-1 text-[8.5px] text-[#0F2A35] max-w-[85%]">
            "Can you update our Saturday hours and add our new insurance cert?"
          </div>
        </div>

        <motion.div
          animate={ticketState === 'done' ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-1.5 justify-end"
        >
          <div className="bg-[#1E4A5C] text-white rounded-lg rounded-tr-none px-2 py-1 text-[8.5px] max-w-[85%] flex items-center gap-1">
            <span>Updated & live in 18 minutes!</span>
            <Check className="w-2.5 h-2.5 text-[#2E9E6B]" />
          </div>
          <div className="w-4 h-4 rounded-full bg-[#0F2A35] text-white text-[8px] font-bold flex items-center justify-center shrink-0">
            OH
          </div>
        </motion.div>
      </div>

      {/* Support SLA Guarantee Footer */}
      <div className="flex items-center justify-between text-[9px] text-[#5E6F77] pt-0.5">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#1E4A5C]" />
          <span>Rapid Turnaround Guarantee</span>
        </span>
        <span className="font-semibold text-[#2E9E6B]">100% Peace of Mind</span>
      </div>
    </div>
  );
}
