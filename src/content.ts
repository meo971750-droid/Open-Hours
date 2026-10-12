/**
 * Open Hours Studio - Master Content File
 * All editable copy, pricing, contact details, and site settings are centralized here.
 *
 * NOTE: Replace promises/quotes with real testimonials ONLY after real clients
 * have given explicit, signed written permission. No fabricated reviews or fake ratings.
 */

export const SHOW_PRICING = true;

export const CTA = {
  label: "Talk to Us",
  short: "Talk to Us",
  offer: "Get your 1-page website",
  version: "Get a 1-page version of this",
};

export const DELIVERY = {
  conceptWorkingDays: 3,   // homepage concept, counted from when we speak
  liveWorkingDays: 10,     // typical live date once we have photos and details (Standard)
  tiers: { starter: 7, standard: 10, growth: 14 },
  auditWorkingDays: 2,
  firstPageWorkingDays: 5,
};

export const FIRST_PAGE = {
  eligibilityNote: "Available to building and home-improvement trades in Ireland and Malta. We confirm the details with you before we start.",
  hostingMonths: 12,
  domainNote: "You register the domain in your own name (about €10 to 15 a year).", // write the euro sign instead of "EUR"
  // TODO verify the domain price before launch
  afterNote: "After the first 12 months, choose a care plan or take your files with you.",
  readyHours: 12,
  // Promise: write the terms of these bonus gifts clearly when launched. Never make a promise we cannot keep.
  extrasLine: "Plus Bonus Gifts",
  extrasNote: "Details are shared when you apply.",
};

// Fictional demo values. Never present them as real. readyHours is a promise: keep it true, and keep it consistent with the rest of the site.
export const SAMPLE_ORDER = {
  business: "Atlantic Slate Roofing",
  trade: "Roofer",
  town: "Galway",
  email: "name@example.com",
};

export const FACTS = {
  essentials: 6,
};

export const SUPPORT = {
  label: "Lifetime support",
  line: "Lifetime support after you go live",
  terms: "Lifetime support covers fixes to what we built, for as long as your website is hosted with us. New features and content changes are quoted separately.",
};

export const FORM_ENDPOINT: string = ""; // Default empty string

export const CONTACT = {
  whatsappNumber: "[WHATSAPP_NUMBER]",
  email: "[CONTACT_EMAIL]",
};

export function whatsappLink(message: string = "Hi Open Hours, I'd like a 1-page website for my business: "): string | null {
  const digitsOnly = CONTACT.whatsappNumber.replace(/\D/g, "");
  if (!digitsOnly || digitsOnly.length < 5) {
    return null;
  }
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

// Helper to display placeholders with a clear TODO indication in development mode
const isDev = import.meta.env.DEV;
export const devPlaceholder = (val: string) => isDev ? val : val.replace(/\[|\]/g, '');

export const FOUNDER = { name: "Zuhayer", photo: "" };

export const SITE_METADATA = {
  title: "Open Hours | Websites for builders and trades in Ireland and Malta",
  tagline: "The website that answers while you're on the job",
  description:
    `Open Hours builds fast, enquiry-focused websites and Google profiles for builders and home-improvement trades in Ireland and Malta. Live in about ${DELIVERY.liveWorkingDays} working days.`,
  founderName: FOUNDER.name,
  contactEmail: devPlaceholder("[CONTACT_EMAIL]"),
  linkedinUrl: devPlaceholder("[LINKEDIN_URL]"),
  companyLegalName: devPlaceholder("[COMPANY_LEGAL_NAME]"),
  companyAddress: devPlaceholder("[COMPANY_ADDRESS]"),
  locationStatement:
    "A small studio, openly based in Bangladesh, working in Irish and Maltese hours.",
};

export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "What you get", href: "#included" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const HERO_CONTENT = {
  badge: "Your 1-page website, at no cost",
  headline: "The website that answers while you're on the job",
  subtext:
    "Your website replies to quote requests, texts back missed calls and tracks every enquiry, so nothing slips while you're on the job.",
  emailPlaceholder: "Your email",
  ctaText: CTA.short,
  consentText:
    "We'll use your email only to reply about your 1-page website. No spam. Privacy policy.",
  trades: [
    { name: "Roofers", icon: "Hammer" },
    { name: "Kitchen fitters", icon: "ChefHat" },
    { name: "Extension builders", icon: "Home" },
    { name: "Windows & doors", icon: "Maximize" },
    { name: "Landscapers", icon: "Trees" },
    { name: "Heating installers", icon: "Flame" },
  ],
};

export const HERO_TICKERS = {
  left: {
    label: "BUILT FOR TRADES",
    direction: "up" as const,
    items: [
      { text: "Roofers", icon: "Home" },
      { text: "Kitchen fitters", icon: "CookingPot" },
      { text: "Extension builders", icon: "Ruler" },
      { text: "Windows & doors", icon: "DoorOpen" },
      { text: "Landscapers", icon: "Trees" },
      { text: "Heating installers", icon: "Flame" },
      { text: "Painters & decorators", icon: "PaintRoller" },
      { text: "Bathroom fitters", icon: "Bath" },
      { text: "Plasterers", icon: "Layers" },
      { text: "Garden rooms", icon: "Warehouse" },
      { text: "Paving & driveways", icon: "Route" },
      { text: "Attic conversions", icon: "Building2" },
    ],
  },
  right: {
    label: "WHAT YOUR SITE DOES",
    direction: "down" as const,
    items: [
      { text: "Click-to-call", icon: "Phone" },
      { text: "Quote request form", icon: "FileText" },
      { text: "WhatsApp button", icon: "MessageCircle" },
      { text: "Missed-call text-back", icon: "PhoneMissed" },
      { text: "After-hours auto-reply", icon: "Moon" },
      { text: "Google Business Profile", icon: "MapPin" },
      { text: "Service-area pages", icon: "Navigation" },
      { text: "Review requests", icon: "Star" },
      { text: "Enquiry tracking", icon: "BarChart3" },
      { text: "Fast on mobile", icon: "Smartphone" },
      { text: "Project gallery", icon: "Images" },
      { text: "Monthly report", icon: "FileBarChart" },
    ],
  },
};

export const WHAT_IT_DOES_CONTENT = {
  pill: "Silent Salesman",
  headline: "Your website handles the first reply",
  subtext: "So you can stay on the job.",
  cards: [
    {
      id: "answers",
      icon: "MessageSquareReply",
      title: "Answers",
      description:
        "When someone sends a quote request, the site replies straight away with your standard questions.",
    },
    {
      id: "catches",
      icon: "ClipboardList",
      title: "Catches",
      description:
        "A clear quote form asks for the project details you need, with call and message buttons one tap away. On Standard and Growth, customers can also send a photo of the job.",
    },
    {
      id: "records",
      icon: "ClipboardList",
      title: "Records",
      description:
        "Every enquiry, quote request and missed call is logged in one clean list, so nothing slips while you work.",
    },
    {
      id: "hands-over",
      icon: "Bell",
      title: "Hands over",
      description:
        "You get a tidy summary with the project details, ready for when your tools are down.",
    },
  ],
};

export const HOW_IT_WORKS_CONTENT = {
  pill: "How it works",
  headline: "From first look to live site, step by step",
  footnote: "Timelines start once we have your photos and details.",
  milestones: [
    {
      dayLabel: "Day 0",
      title: "Your audit video",
      description: "We record a short video of what customers see when they search for you.",
      chip: "Our turn",
      chipType: "our" as const,
    },
    {
      dayLabel: `Within ${DELIVERY.firstPageWorkingDays} days`,
      title: "Your 1-page website",
      description: "Once we have your photos and details, your 1-page website goes live.",
      chip: "Our turn",
      chipType: "our" as const,
    },
    {
      dayLabel: "Your go-ahead",
      title: "You choose what's next",
      description: "Happy with it? Choose a fuller build, then approve the quote and the concept.",
      chip: "Your turn",
      chipType: "your" as const,
    },
    {
      dayLabel: "Build",
      title: "We build, you review",
      description: "We build the site and tidy your Google profile. You review it and tell us any changes.",
      chip: "Our turn",
      chipType: "our" as const,
    },
    {
      dayLabel: `Day ${DELIVERY.liveWorkingDays}`,
      title: "Your site goes live",
      description: "Typical for the Standard build, once we have your photos and details.",
      chip: "Our turn",
      chipType: "our" as const,
    },
  ],
};

export const WHAT_YOU_GET_CONTENT = {
  pill: "What you get",
  headline: "Built to catch enquiries, not just look nice",
  columns: [
    {
      id: "enquiries",
      icon: "PhoneCall",
      title: "Never miss an enquiry",
      text: "Click-to-call, a quote form, a WhatsApp button and an automatic reply when you can't pick up.",
      sampleKicker: "Live capture suite",
    },
    {
      id: "craft",
      icon: "Sparkles",
      title: "Look as good as your work",
      text: "A fast, mobile-first site with your best project photos, service areas and reviews.",
      sampleKicker: "Mobile portfolio preview",
    },
    {
      id: "ownership",
      icon: "ShieldCheck",
      title: "You own everything",
      text: "Your domain, your site, your content. No lock-in, no hidden hosting traps.",
      sampleKicker: "Full export & domain ownership",
    },
  ],
  checklist: [
    { title: "Google Business Profile tidy-up", desc: "Categories, photos, service areas, and verification guidance." },
    { title: "Local search foundations", desc: "Clean geographic pages for Irish counties or Maltese localities." },
    { title: "Speed and mobile checks", desc: "Fast, mobile-first pages, with speed checked before launch." },
    { title: "Enquiry tracking", desc: "Know exactly which phone calls, WhatsApp messages, and forms arrived." },
    { title: "Privacy and cookie basics", desc: "GDPR-compliant cookie banner, clear consent, and legal drafts." },
    { title: "Lifetime support after you go live", desc: "Every minor tweak or photo swap handled promptly at no extra charge." },
  ],
};

// Prices are hypotheses to test; confirm before launch
export const SETUP_FROM = { starter: 790, standard: 1290, growth: 2200 };
export const CARE_FROM = { starter: 39, standard: 69, growth: 129 };
export const ADS_MANAGEMENT_FROM = 350;

export interface PackageTier {
  id: "first" | "starter" | "standard" | "growth";
  name: string;
  tag?: string;
  highlighted?: boolean;
  description: string;
  price: string;
  setupAmount?: number;
  mutedLine?: string;
  careLine: string;
  featuresHeading?: string;
  features: string[];
  timeline: string;
  button: string;
}

export const PACKAGES: PackageTier[] = [
  {
    id: "first",
    name: "1-page website",
    tag: "Start here",
    highlighted: false,
    description: "One clear page with your services, area and contact details.",
    price: "At no cost",
    mutedLine: `Hosting included for ${FIRST_PAGE.hostingMonths} months. ${FIRST_PAGE.domainNote}`,
    careLine: `After the first 12 months: a care plan from €${CARE_FROM.starter}/month, or take your files with you.`,
    features: [
      "1 mobile-first page: your services, area and contact details",
      "Call button and quote request form",
      "Your website link added to your Google profile",
      `Hosting included for ${FIRST_PAGE.hostingMonths} months`,
      "One round of changes",
    ],
    timeline: `Live in about ${DELIVERY.firstPageWorkingDays} working days`,
    button: CTA.offer,
  },
  {
    id: "starter",
    name: "Starter",
    highlighted: false,
    description: "A small, complete website for your trade.",
    price: `from €${SETUP_FROM.starter} setup`,
    setupAmount: SETUP_FROM.starter,
    careLine: `Care plan from €${CARE_FROM.starter}/month: hosting, updates and backups.`,
    features: [
      "3 to 5 pages, mobile-first",
      "Quote and site-visit request form, with call buttons",
      "Google Business Profile set-up and tidy-up",
      "HTTPS and spam-protected forms",
      "Lifetime support after you go live",
    ],
    timeline: `Live in about ${DELIVERY.tiers.starter} working days`,
    button: "Start with a 1-page website",
  },
  {
    id: "standard",
    name: "Standard",
    tag: "Recommended",
    highlighted: true,
    description: "A fuller site that handles enquiries, even after hours.",
    price: `from €${SETUP_FROM.standard} setup`,
    setupAmount: SETUP_FROM.standard,
    careLine: `Care plan from €${CARE_FROM.standard}/month: everything in the Starter plan, plus a monthly Google profile update and a simple enquiry summary.`,
    featuresHeading: "Everything in Starter, plus:",
    features: [
      "5 to 8 pages, with a project gallery and service-area pages",
      "Copy written for each service, with FAQs",
      "Photo quote requests: customers can send a picture of the job",
      "After-hours auto-reply and missed-call text-back",
      "Local search foundations",
      "Review-request link set-up",
    ],
    timeline: `Live in about ${DELIVERY.tiers.standard} working days`,
    button: "Start with a 1-page website",
  },
  {
    id: "growth",
    name: "Growth",
    highlighted: false,
    description: "For more services, more areas and bigger projects.",
    price: `from €${SETUP_FROM.growth} setup`,
    setupAmount: SETUP_FROM.growth,
    careLine: `Care plan from €${CARE_FROM.growth}/month: everything in the Standard plan, plus monthly reporting and priority support.`,
    featuresHeading: "Everything in Standard, plus:",
    features: [
      "As many pages as your business needs, agreed in your written quote",
      "A page for each service and area",
      "Advanced Google Business Profile optimisation",
      "Google Ads campaign set-up (ad spend paid by you directly to Google)",
      "Enquiry tracking and a monthly report",
      "Review-request flow",
    ],
    timeline: `Live in about ${DELIVERY.tiers.growth} working days`,
    button: "Start with a 1-page website",
  },
];

export const PRICING_CONTENT = {
  pill: "Pricing",
  headline: "Fixed prices. No surprises.",
  subtext:
    "Start with a 1-page website at no cost, then grow only if it makes sense. Every paid build starts with a fixed written quote.",
  tiers: PACKAGES,
};

export const ABOUT_CONTENT = {
  pill: "Who we are",
  headline: "A small studio, openly based in Bangladesh",
  bodyText:
    `Open Hours is run by ${FOUNDER.name}, working in Irish and Maltese hours. You get video calls, a written contract, euro invoices and a data processing agreement. No middlemen.`,
  initials: "OH",
  proofChips: [
    { title: "Video calls", desc: "Face-to-face walkthroughs in Irish & Maltese timezones" },
    { title: "Written contract", desc: "Clear scope, fixed euro pricing, full ownership" },
    { title: "Data protection terms", desc: "GDPR compliant data processing agreement" },
  ],
};

export const FAQ_CONTENT = {
  pill: "FAQ",
  headline: "Frequently asked questions",
  items: [
    {
      question: "Do I need a website if I get work by word of mouth?",
      answer:
        "Referrals are great, but customers still check Google and Facebook before they call. A clear, fast site validates that you are licensed, professional, and currently taking on work, making the referral much easier to convert into a booked quote.",
    },
    {
      question: "Where are you based and is that a problem?",
      answer:
        "Open Hours is openly based in Bangladesh, working directly during Irish and Maltese business hours. You get direct video calls, a written contract, official euro invoices, and a GDPR data processing agreement. Because you own your domain and code outright, there is very little risk.",
    },
    {
      question: "How long does it take?",
      answer:
        `Your 1-page website goes live in about ${DELIVERY.firstPageWorkingDays} working days once we have your photos and details. Full builds typically take about ${DELIVERY.liveWorkingDays} working days once you approve the concept.`,
    },
    {
      question: "Is the 1-page website really at no cost?",
      answer:
        `Yes. We build a 1-page website for you at no cost, and hosting is included for ${FIRST_PAGE.hostingMonths} months. You register the domain in your own name (about €10 to 15 a year). After the first ${FIRST_PAGE.hostingMonths} months you can choose a care plan or take your files with you.`,
    },
    {
      question: "What if I want more than one page?",
      answer:
        "We'll quote a fuller build in writing. You can start with the 1-page website and upgrade whenever you like, and the 1-page website can become the homepage of a larger build.",
    },
    {
      question: "What do I need to provide?",
      answer:
        "Photos of your recent completed work, a list of your services, the towns or counties you cover, and your phone/email details. Please do not send customer personal details.",
    },
    {
      question: "Do I own the website?",
      answer:
        "Yes: domain, site, and content are 100% yours. We never hold client assets hostage. If you ever decide to host elsewhere, you take everything with you.",
    },
    {
      question: "What if I already have a website?",
      answer:
        "We rebuild it cleanly and move your content across safely. We set up 301 redirects for every old page so you don't lose existing search visibility or broken links.",
    },
    {
      question: "Can you promise more enquiries?",
      answer:
        "No. We build the best foundation, ensure your site loads instantly and makes calling effortless, and show you real numbers; nobody honest can promise a set number of enquiries or rankings.",
    },
    {
      question: "Is there a contract?",
      answer:
        "Yes, a short written agreement for every project, including the 1-page website. Monthly care plans can be cancelled at any time.",
    },
  ],
};

export const FINAL_CTA_CONTENT = {
  headline: "Your phone rings. Your website answers.",
  subtext: "Let's see what customers find when they look for your trade.",
  buttonText: CTA.label,
  deliveryNote: `Your 1-page website in about ${DELIVERY.firstPageWorkingDays} working days. Full builds in about ${DELIVERY.liveWorkingDays}.`,
};

export const FOOTER_CONTENT = {
  columns: [
    {
      title: "Studio",
      links: [
        { label: "How it works", href: "#how-it-works" },
        { label: "What you get", href: "#included" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Cookie Policy", href: "#cookies" },
        { label: "Terms of Service", href: "#terms" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: devPlaceholder("[CONTACT_EMAIL]"), href: "mailto:" + devPlaceholder("[CONTACT_EMAIL]") },
        { label: "Founder LinkedIn", href: devPlaceholder("[LINKEDIN_URL]"), external: true },
      ],
    },
  ],
  companyLegal: devPlaceholder("[COMPANY_LEGAL_NAME]"),
  companyAddress: devPlaceholder("[COMPANY_ADDRESS]"),
  tagline: "Fast websites and Google profiles for building trades in Ireland & Malta",
};

export const SAMPLE_DASHBOARD = {
  businessName: "Murphy Roofing (sample)",
  greeting: "Good morning, Declan",
  tag: "Sample data",
  enquiriesThisMonth: "24",
  enquiriesGrowth: "+6 vs last month",
  missedCallsRecovered: "7",
  ringData: [
    { name: "Google", pct: 58, color: "#1E4A5C" },
    { name: "Facebook", pct: 27, color: "#E3B896" },
    { name: "Direct", pct: 15, color: "#5E6F77" },
  ],
  sparkline: [8, 12, 10, 15, 14, 18, 16, 22, 20, 24],
  enquiriesList: [
    { id: "1", title: "Kitchen quote request", time: "18m ago", status: "Replied", location: "Dublin 14" },
    { id: "2", title: "Roof leak call-back", time: "1h ago", status: "Replied", location: "Sliema" },
    { id: "3", title: "Extension enquiry", time: "3h ago", status: "Replied", location: "Cork" },
  ],
};

export type TradeName =
  | "Roofers"
  | "Kitchen fitters"
  | "Extension builders"
  | "Windows & doors"
  | "Landscapers"
  | "Painters & decorators"
  | "Heating installers"
  | "Garden rooms";

export interface DesignSlide {
  id: string;
  trade: TradeName;
  name: string;
  town: string;
  kind: "Concept" | "Client project";
  permissionConfirmed?: boolean;
  image?: string;
  mobileImage?: string;
  palette: {
    bg: string;
    primary: string;
    accent: string;
    ink: string;
  };
  headline: string;
  tagline: string;
}

export const DESIGNS: DesignSlide[] = [
  {
    id: "atlantic-slate-roofing",
    trade: "Roofers",
    name: "Atlantic Slate Roofing",
    town: "Galway",
    kind: "Concept",
    palette: {
      bg: "#F4F6F8",
      primary: "#2E3A46",
      accent: "#E8833A",
      ink: "#1C242B",
    },
    headline: "Roofing you can rely on",
    tagline: "Concept for a roofing business",
  },
  {
    id: "hearth-and-grain-kitchens",
    trade: "Kitchen fitters",
    name: "Hearth & Grain Kitchens",
    town: "Cork",
    kind: "Concept",
    palette: {
      bg: "#FAF7F2",
      primary: "#8A5A3B",
      accent: "#F5EDE0",
      ink: "#2B1D14",
    },
    headline: "Kitchens made for living",
    tagline: "Concept for a kitchen fitting business",
  },
  {
    id: "corrib-extensions",
    trade: "Extension builders",
    name: "Corrib Extensions",
    town: "Galway",
    kind: "Concept",
    palette: {
      bg: "#F3F6FA",
      primary: "#1F2F4A",
      accent: "#C9A24D",
      ink: "#101826",
    },
    headline: "More space for your home",
    tagline: "Concept for an extension building business",
  },
  {
    id: "clearview-windows",
    trade: "Windows & doors",
    name: "ClearView Windows",
    town: "Limerick",
    kind: "Concept",
    palette: {
      bg: "#F4F7F9",
      primary: "#2B2F33",
      accent: "#4DA3D9",
      ink: "#171A1C",
    },
    headline: "Light, warmth and security",
    tagline: "Concept for a windows & doors business",
  },
  {
    id: "green-acre-landscapes",
    trade: "Landscapers",
    name: "Green Acre Landscapes",
    town: "Sligo",
    kind: "Concept",
    palette: {
      bg: "#F3F7F4",
      primary: "#234D3A",
      accent: "#A4C93E",
      ink: "#12261D",
    },
    headline: "Gardens built to be lived in",
    tagline: "Concept for a landscaping business",
  },
  {
    id: "fresh-coat-decorators",
    trade: "Painters & decorators",
    name: "Fresh Coat Decorators",
    town: "Mosta",
    kind: "Concept",
    palette: {
      bg: "#F7F7F8",
      primary: "#333333",
      accent: "#F26B5B",
      ink: "#1A1A1A",
    },
    headline: "A finish you'll notice",
    tagline: "Concept for a painting & decorating business",
  },
  {
    id: "cosy-home-heating",
    trade: "Heating installers",
    name: "Cosy Home Heating",
    town: "Sliema",
    kind: "Concept",
    palette: {
      bg: "#FAF6F4",
      primary: "#7A2630",
      accent: "#F0D9B5",
      ink: "#361115",
    },
    headline: "Warm homes, all year",
    tagline: "Concept for a heating installation business",
  },
  {
    id: "garden-room-studio",
    trade: "Garden rooms",
    name: "Garden Room Studio",
    town: "Gozo",
    kind: "Concept",
    palette: {
      bg: "#F6F7F4",
      primary: "#4A5A3A",
      accent: "#C9A06B",
      ink: "#222A1A",
    },
    headline: "Your space at the end of the garden",
    tagline: "Concept for a garden room business",
  },
];

export interface ConceptStudy {
  id: string;
  designId: string;
  tint: "teal" | "peach" | "sage" | "sand";
  tradeLabel: string;
  title: string;
  description: string;
  scope: string;
  tier: "Starter" | "Standard" | "Growth";
}

export const CONCEPT_STUDIES: ConceptStudy[] = [
  {
    id: "study-roofers",
    designId: "atlantic-slate-roofing",
    tint: "teal",
    tradeLabel: "Roofers",
    title: "A roofer's website that replies after dark",
    description:
      "A clear quote form, a call button on every page and an automatic reply when the phone goes unanswered.",
    scope: "5 pages, quote form, Google profile tidy-up",
    tier: "Standard",
  },
  {
    id: "study-kitchen-fitters",
    designId: "hearth-and-grain-kitchens",
    tint: "peach",
    tradeLabel: "Kitchen fitters",
    title: "A showroom for the work you've already done",
    description:
      "A project gallery that does the talking, with a simple way to ask for a design visit.",
    scope: "5 pages, project gallery, quote form",
    tier: "Starter",
  },
  {
    id: "study-extension-builders",
    designId: "corrib-extensions",
    tint: "sage",
    tradeLabel: "Extension builders",
    title: "Space to explain a bigger project",
    description:
      "A page for each type of build, and a form that collects the project details you need.",
    scope: "8 pages, service pages, quote form",
    tier: "Growth",
  },
  {
    id: "study-heating-installers",
    designId: "cosy-home-heating",
    tint: "sand",
    tradeLabel: "Heating installers",
    title: "Easy to reach when the boiler stops",
    description:
      "A call button at the top of every page, service-area pages and an automatic reply after hours.",
    scope: "6 pages, service-area pages, call button",
    tier: "Standard",
  },
];

export const VIDEO_REVIEW = {
  src: "/zuhayer-review.mp4",
  poster: "/zuhayer-review-poster.jpg",
  captions: "/zuhayer-review.vtt", // optional; used only if the file exists
  reviewerName: "Aaron Freedman", // Founder of A2Z Fitness
  reviewerLine: "Online Coach, A2Z Fitness", // role and business from client project
  permissionConfirmed: true, // set to false if written permission is NOT in place; then the section renders nothing
  disclosure: "", // e.g. "This client received a website at no cost." Fill in if applicable
};

// Demo values only. Never present them as real prices or real availability.
export const SAMPLE_ESTIMATE = { low: 2400, high: 3200 }; // fictional, shown only in the sample demo
export const SAMPLE_AREAS = ["Galway", "Salthill", "Oranmore", "Barna", "Knocknacarra"]; // fictional coverage list for the demo
export const SAMPLE_SLOTS = { days: ["Tue", "Wed", "Thu", "Fri"], times: ["9:00", "11:00", "14:00", "16:00"] };

export interface InteractiveFeatureItem {
  id: string;
  number: string;
  title: string;
  description: string;
  scene: string;
}

export const INTERACTIVE_FEATURES: InteractiveFeatureItem[] = [
  {
    id: "photo-estimate",
    number: "01",
    title: "Photo estimate",
    description:
      "Customers send a photo of the job and see an indicative price range, based on ranges you set. You confirm the final price after an inspection.",
    scene: "photo-estimate",
  },
  {
    id: "before-after",
    number: "02",
    title: "Before and after slider",
    description:
      "Visitors drag a slider to compare a project before and after, on your own project photos.",
    scene: "before-after",
  },
  {
    id: "voice-agent",
    number: "03",
    title: "Voice agent",
    description:
      "An automated voice assistant answers calls you can't take, says that it is automated, collects the job details and passes them to you. Provided under a separate agreement.",
    scene: "voice-agent",
  },
  {
    id: "area-checker",
    number: "04",
    title: "Service-area checker",
    description:
      "Visitors type their town and see straight away whether you cover it.",
    scene: "area-checker",
  },
  {
    id: "visit-booking",
    number: "05",
    title: "Site-visit booking",
    description:
      "Customers pick a day and time from the slots you offer, and the request arrives in your inbox.",
    scene: "visit-booking",
  },
];


export const SENJA = {
  widgetId: "f0f56735-a5f3-4083-8724-772691699647",
  scriptSrc: "https://widget.senja.io/widget/f0f56735-a5f3-4083-8724-772691699647/platform.js",
};

export const REVIEWS_DISCLOSURE = ""; // fill in if reviewers received any discounted or complimentary work

export const COMMON_NEEDS: string[] = [
  "5 to 10 clear photos of your recent jobs",
  "A list of the core services and towns you cover",
  "Your business phone number and WhatsApp number",
  "Access to your domain registrar if you have an existing web address",
];

export const PAGES = [
  { id: "first", pill: "1-Page", h1: "1-Page Website", sub: "Everything on one page to get enquiries moving." },
  { id: "starter", pill: "Starter", h1: "Starter Website", sub: "Clean 3-page site for focused trades." },
  { id: "standard", pill: "Standard", h1: "Standard Website", sub: "Complete trade site with service areas." },
  { id: "growth", pill: "Growth", h1: "Growth Website", sub: "Full site for high-volume trade contractors." },
];


