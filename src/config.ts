/**
 * Open Hours Studio - Master Configuration File
 * All editable content lives in this single CONFIG object.
 *
 * Rules:
 * - Pre-filled from the existing site wherever content already exists.
 * - Empty fields stay as empty strings or empty arrays (never render placeholder tokens).
 * - Empty fields log a warning in development mode and are cleanly hidden in the UI.
 */

export const CONFIG = {
  // Studio & Founder
  studioName: "Open Hours",
  founderName: "Zuhayer",
  founderTitle: "Founder",
  founderPhoto: "https://i.ibb.co.com/6cJH7T24/Profile-Pic.png",
  workingModelLine: "Remote studio, working Irish and Maltese business hours",

  // Business & Legal (leave empty if not yet assigned; UI hides empty lines)
  legalName: "",
  companyAddress: "",
  companyRegNumber: "",
  email: "",
  phone: "",
  bookingUrl: "#contact", // Used by primary CTA buttons
  liveDemoUrl: "", // If set, displays "Open a live demo site" under Section 5 carousel
  socials: {
    linkedin: "",
    twitter: "",
  },

  // Target markets & trades
  markets: ["Ireland", "Malta"],
  trades: [
    "Roofers",
    "Kitchen fitters",
    "Extension builders",
    "Windows & doors",
    "Landscapers",
    "Heating installers",
    "Painters & decorators",
    "Bathroom fitters",
  ],

  // Section 2: Hero Content
  hero: {
    badge: "1-Page website concept",
    headline: "The website that catches your enquiries while you're on the job.",
    subtext:
      "Quote requests, site visits and enquiries organized in one place, so nothing slips while your tools are up.",
    emailPlaceholder: "Your email address",
    ctaText: "Get your 1-page website",
  },

  // Section 3: Facts Strip
  facts: [
    {
      label: "Fixed price",
      value: "From €790 fixed price",
      detail: "Starter build with written quote before start",
    },
    {
      label: "Turnaround",
      value: "Live in about 10 working days",
      detail: "Counted from when photos and details are ready",
    },
    {
      label: "Ownership",
      value: "You own your domain and content",
      detail: "100% yours, take your files whenever you want",
    },
    {
      label: "Specialisation",
      value: "Built for Irish & Maltese trades",
      detail: "Local search foundations & service areas",
    },
  ],

  // Section 5: Roofing Concept Sites
  portfolio: [
    {
      id: 1,
      name: "XYZ Roofing",
      image: "/roofing-sites/1-xyz-roofing.png?v=1",
      domain: "xyzroofing.com",
      trade: "Roofers",
      location: "",
      note: "Concept for a roofing business",
    },
    {
      id: 2,
      name: "ABC Roofing",
      image: "/roofing-sites/2-abc-roofing.png?v=1",
      domain: "abcroofing.com",
      trade: "Roofers",
      location: "",
      note: "Concept for a roofing business",
    },
    {
      id: 3,
      name: "Alex Roofing",
      image: "/roofing-sites/3-alex-roofing.png?v=1",
      domain: "alexroofing.com",
      trade: "Roofers",
      location: "",
      note: "Concept for a roofing business",
    },
    {
      id: 4,
      name: "Roofen",
      image: "/roofing-sites/4-roofen.png?v=1",
      domain: "roofen.com",
      trade: "Roofers",
      location: "",
      note: "Concept for a roofing business",
    },
    {
      id: 5,
      name: "Atlantic Slate Roofing",
      image: "/roofing-sites/5-atlantic-slate-roofing.png?v=1",
      domain: "atlanticslateroofing.com",
      trade: "Roofers",
      location: "",
      note: "Concept for a roofing business",
    },
  ],

  // Section 6: Concept Case Studies (up to 3 cards, strictly no invented results)
  caseStudies: [
    {
      id: "atlantic-slate",
      conceptName: "Atlantic Slate Roofing",
      trade: "Roofers",
      image: "/roofing-sites/5-atlantic-slate-roofing.png?v=1",
      domain: "atlanticslateroofing.com",
      brief:
        "A roofer whose only online presence is a Facebook page where message notifications get buried.",
      problems: [
        "Enquiry messages get lost inside noisy social media notifications",
        "No presence on Google when local homeowners search for slate roof repairs",
        "Callers cannot easily verify past completed jobs or insurance coverage",
      ],
      decisions: [
        "Prominent click-to-call button and simple quote form above the fold",
        "Clear service-area coverage list highlighting local towns and counties",
        "Structured photo gallery showcasing heritage slate and ridge work",
        "Review block prominently displaying customer feedback and proof of work",
      ],
    },
    {
      id: "alex-roofing",
      conceptName: "Alex Roofing",
      trade: "Roofers",
      image: "/roofing-sites/3-alex-roofing.png?v=1",
      domain: "alexroofing.com",
      brief:
        "A roofing contractor relying solely on word of mouth who needs predictable, year-round job flow.",
      problems: [
        "Referred customers search the name online and find an inactive, unverified listing",
        "Homeowners dealing with urgent leaks have no direct photo-upload quote route",
        "After-hours inquiries left on voicemail go unanswered until next morning",
      ],
      decisions: [
        "Emergency call action button with one-tap dialling on mobile screens",
        "Structured quote form with service selection for tile, slate and flat roofs",
        "Clear visual breakdown of repairs, guttering, and full roof replacements",
        "Immediate confirmation note reassuring the customer their request was logged",
      ],
    },
    {
      id: "roofen",
      conceptName: "Roofen",
      trade: "Roofers",
      image: "/roofing-sites/4-roofen.png?v=1",
      domain: "roofen.com",
      brief:
        "An established trade business wanting to modernise its web presence for domestic and commercial re-roofing.",
      problems: [
        "Previous website took 6+ seconds to load on mobile and was cluttered with text",
        "Property managers could not locate safety certifications or public liability",
        "No organized enquiry log to track and follow up on submitted quotes",
      ],
      decisions: [
        "Lightweight, mobile-first design that loads in under a second",
        "Prominent trade credentials, warranty highlights, and insurance badges",
        "Straightforward enquiry form requesting roof type, urgency, and location",
        "Clean project overview sections with high-contrast before-and-after visuals",
      ],
    },
  ],

  // Pricing Tiers (ongoing support while on care plan; no "lifetime" or "bonus gifts")
  pricing: [
    {
      id: "first",
      name: "1-Page Website",
      tag: "Start here",
      highlighted: false,
      price: "At no cost",
      description: "One clear page with your services, area and contact details.",
      timeline: "Live in about 5 working days",
      careLine: "After 12 months: care plan from €39/month, or take your files with you.",
      features: [
        "1 mobile-first page: services, area and contact details",
        "Call button and quote request form",
        "Website link added to your Google Business Profile",
        "Hosting included for 12 months",
        "One round of revisions included",
      ],
    },
    {
      id: "starter",
      name: "Starter",
      highlighted: false,
      price: "from €790 setup",
      description: "A small, complete website for your trade.",
      timeline: "Live in about 7 working days",
      careLine: "Care plan from €39/month: hosting, updates and backups.",
      features: [
        "3 to 5 pages, mobile-first",
        "Quote and site-visit request form, with call buttons",
        "Google Business Profile set-up and tidy-up",
        "HTTPS and spam-protected forms",
        "Ongoing support while you're on a care plan",
      ],
    },
    {
      id: "standard",
      name: "Standard",
      tag: "Recommended",
      highlighted: true,
      price: "from €1,290 setup",
      description: "A fuller site that handles enquiries, even after hours.",
      timeline: "Live in about 10 working days",
      careLine: "Care plan from €69/month: updates, monthly Google profile refresh, enquiry summary.",
      features: [
        "5 to 8 pages with project gallery and service-area pages",
        "Copy written for each service, with FAQs",
        "Photo quote requests: customers can attach a photo of the job",
        "Instant confirmation email to the visitor upon form submit",
        "Local search foundations for Irish counties or Maltese localities",
        "Ongoing support while you're on a care plan",
      ],
    },
    {
      id: "growth",
      name: "Growth",
      highlighted: false,
      price: "from €2,200 setup",
      description: "For more services, more areas and bigger projects.",
      timeline: "Live in about 14 working days",
      careLine: "Care plan from €129/month: hosting, priority updates and monthly report.",
      features: [
        "Tailored page count agreed in your written quote",
        "Dedicated page for each core service and regional town",
        "Google Business Profile optimisation",
        "Enquiry tracking log and monthly summary",
        "Ongoing support while you're on a care plan",
      ],
    },
  ],

  // Free Starter Offer Terms
  freeStarterOffer: {
    headline: "1-Page Website",
    price: "At no cost",
    terms:
      "Hosting included for 12 months. You register the domain in your own name (about €10 to 15 a year). After the first 12 months, choose a care plan from €39/month or take your files with you.",
    turnaround: "Live in about 5 working days",
  },

  // Care Plan & Add-ons
  carePlan: { starter: 39, standard: 69, growth: 129 },
  addOns: [
    { title: "Google Ads set-up", desc: "Targeted local campaign set up cleanly (ad spend paid directly to Google)" },
    { title: "Additional service-area pages", desc: "Detailed geographic landing pages for neighbouring towns" },
  ],

  // Studio Promises
  promises: [
    "No lock-in: your domain, website files and content remain 100% yours",
    "Clear, fixed-price written quotes before any paid work starts",
    "Direct video calls and email with Zuhayer (no middlemen or account reps)",
    "Built for fast mobile loading without slow bloat or plugins",
  ],

  // Section 7: Video Testimonial (Real client video proof)
  videoTestimonial: {
    src: "/zuhayer-review.mp4",
    poster: "/zuhayer-review-poster.jpg",
    name: "Aaron Freedman",
    business: "A2Z Fitness",
    sourceUrl: "",
  },

  // Written Testimonials (Only real entries, no invented reviews)
  testimonials: [
    {
      fullName: "Aaron Freedman",
      business: "A2Z Fitness",
      location: "",
      rating: 5,
      text: "Working with Zuhayer was straightforward from day one. Clear communication, fast turnaround, and a website built properly for real enquiries.",
      sourceLabel: "Video review",
      sourceUrl: "",
      date: "",
    },
  ],

  // Review Summary (shown only if both rating/count and sourceUrl are provided)
  reviewSummary: {
    rating: "",
    count: "",
    sourceUrl: "",
  },

  // Site Metrics (Lighthouse)
  siteMetrics: {
    performance: 99,
    accessibility: 100,
    bestPractices: 100,
    seo: 100,
    measuredOn: "Mobile Chrome",
    reportUrl: "",
  },

  // Milestones
  milestones: [
    { date: "Day 0", text: "Walkthrough of your current web presence and scope agreement", url: "" },
    { date: "Day 3", text: "Homepage concept shared for your review", url: "" },
    { date: "Day 5", text: "1-Page website live with domain connected", url: "" },
    { date: "Day 10", text: "Full build live with service areas and Google profile tidy-up", url: "" },
  ],

  // Fit criteria
  fit: {
    goodFit: [
      "Trades who take pride in quality work and want clear, honest pricing",
      "Builders looking for a dependable local presence in Ireland or Malta",
      "Owners who want straightforward direct contact with the person building their site",
    ],
    notAFit: [
      "Businesses looking for cheap overseas volume agencies with hidden traps",
      "Anyone wanting unrealistic guarantees of #1 Google ranking or overnight leads",
    ],
  },

  // Provider Questions
  providerQuestions: [
    "Will I own my domain name, website code and files 100% outright?",
    "Is the price fixed in a written contract before we start?",
    "Who actually does the design and code work, and can I speak with them directly?",
    "Will my site load instantly on mobile phones without heavy templates?",
  ],

  // FAQs
  faqs: [
    {
      q: "Do I need a website if I already get work by word of mouth?",
      a: "Word of mouth is the best lead source, but customers still look you up online before deciding to call. A clear, fast site validates that you are active, insured and professional, making referrals much easier to convert into quotes.",
    },
    {
      q: "Where are you based and how do we work together?",
      a: "Open Hours is run by Zuhayer, working directly during Irish and Maltese business hours. We coordinate via video calls, email and WhatsApp. You get a written contract, official euro invoices, and full ownership of your site.",
    },
    {
      q: "How long does it take from start to finish?",
      a: "A 1-page website goes live in about 5 working days once we have your photos and details. Full builds typically take about 10 working days once you approve the concept.",
    },
    {
      q: "Is the 1-page website truly at no cost?",
      a: "Yes. The 1-page website design and build is at no cost, and hosting is included for 12 months. You register your domain name yourself (about €10 to 15 a year). After 12 months, choose a care plan from €39/month or take your files with you.",
    },
    {
      q: "Do I own my website and domain?",
      a: "Yes. Your domain, website code, imagery and copy are 100% yours. If you ever wish to host elsewhere, you can take your files with you with zero lock-in.",
    },
    {
      q: "What do I need to provide to get started?",
      a: "5 to 10 photos of recent completed jobs, a list of your core services and towns you cover, and your phone and email details. We handle the design, copy and technical setup.",
    },
  ],

  // Footer Links
  footer: {
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Work", href: "#designs" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },

  // Feature Flags (Strictly controls claim rendering)
  features: {
    enquiryInbox: true,
    sourceBreakdown: false,
    missedCallTextBack: false,
    autoTextSeconds: "",
  },
} as const;

// Development validation: warn about empty fields so developers know what is hidden
if (typeof window !== "undefined" && import.meta.env.DEV) {
  const emptyKeys: string[] = [];
  if (!CONFIG.legalName) emptyKeys.push("legalName");
  if (!CONFIG.companyAddress) emptyKeys.push("companyAddress");
  if (!CONFIG.companyRegNumber) emptyKeys.push("companyRegNumber");
  if (!CONFIG.email) emptyKeys.push("email");
  if (!CONFIG.phone) emptyKeys.push("phone");
  if (!CONFIG.liveDemoUrl) emptyKeys.push("liveDemoUrl");
  if (!CONFIG.socials.linkedin) emptyKeys.push("socials.linkedin");
  if (emptyKeys.length > 0) {
    console.warn("[Open Hours Config] Empty fields (UI elements safely hidden):", emptyKeys);
  }
}
