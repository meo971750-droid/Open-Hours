export interface HeroProofAvatar {
  src: string;
  localSrc?: string;
  name: string;
  business: string;
  consent: boolean;
}

export interface HeroProofConfig {
  avatars: HeroProofAvatar[];
  line: string;
  line1?: string;
  line2?: string;
  linkText: string;
  showStars: boolean;
  ratingSourceUrl: string;
  ratingLabel: string;
  rating?: number | string;
  source?: string;
  count?: number;
  photoNote?: string;
}

export interface HeroConfig {
  title: string;
  accentWord?: string;
  subtitle: string;
  ctaLabel: string;
}

export interface HeroCardConfig {
  id: string;
  variant: 'dark' | 'teal-tint' | 'peach-tint' | 'white' | 'dark-pill';
  label: string;
  subtitle?: string;
  meta?: string;
  tag: string;
  weekdays?: string[];
  activeDays?: number[];
  avatarMonogram?: string;
  requiresFlag?: keyof AppFeaturesConfig;
}

export interface HeroToolConfig {
  id: string;
  name: string;
  icon: string;
}

export interface AppFeaturesConfig {
  missedCallTextBack: boolean;
  sourceBreakdown: boolean;
  autoTextSeconds: number;
  voiceAgent: boolean;
  afterHoursAutoReply: boolean;
  enquiryTracking: boolean;
  serviceAreaPages: boolean;
  reviewRequests: boolean;
  googleBusinessProfile: boolean;
  enquiryInbox?: boolean;
  heroTools: boolean;
  localSeo: boolean;
  citations: boolean;
  aiLeadCapture: boolean;
  autoBooking: boolean;
  ownerAlerts: boolean;
  quoteFollowUp: boolean;
  photoEstimate: boolean;
  aeoFaq: boolean;
  oldClientReactivation: boolean;
  reviewEngine: boolean;
  geo: boolean;
  googleAds: boolean;
}

export interface FrictionPair {
  problem: string;
  fix: string;
  requiresFlag: string | null;
}

export interface WayOfWorkingPaletteItem {
  bg: string;
  bg2: string;
  ink: string;
  accent: string;
  accent2: string;
  [key: string]: any;
}

export interface WayOfWorkingPalette {
  searches: WayOfWorkingPaletteItem;
  journey: WayOfWorkingPaletteItem;
  solve: WayOfWorkingPaletteItem;
  build: WayOfWorkingPaletteItem;
  findable: WayOfWorkingPaletteItem;
  rank: WayOfWorkingPaletteItem;
  alwaysOn: WayOfWorkingPaletteItem;
  talk: WayOfWorkingPaletteItem;
  [key: string]: WayOfWorkingPaletteItem;
}

export interface WayOfWorkingPace {
  sceneSeconds: number;
  holdAfterBeat: number;
  sceneTransition: number;
  stagger: number;
  lineDraw: number;
  captionDwellPerWord: number;
  scrollVhPerScene: number;
  [key: string]: any;
}

export interface WayOfWorkingSceneItem {
  id: string;
  title: string;
  accentWord: string;
  captions: string[];
  enabledWhen?: string;
  [key: string]: any;
}

export type WayOfWorkingScene = WayOfWorkingSceneItem;

export interface WayOfWorkingConfig {
  title: string;
  studioVoice: string; // "we" or "I", not decided; leave empty, do not guess
  sampleTown: string;
  sampleTrade: string;
  voiceAgentTag: string;
  storyLabel: string;
  palette: WayOfWorkingPalette;
  pace: WayOfWorkingPace;
  scenes: WayOfWorkingSceneItem[];
  [key: string]: any;
}

export interface BentoTileA {
  heading: string;
  text: string;
}

export interface BentoTileB {
  inboxLabel: string;
  inboxHeading: string;
  inboxText: string;
  fallbackHeading: string;
  tag: string;
  businessName: string;
}

export interface BentoTileC {
  heading: string;
  text: string;
  tag: string;
}

export interface BentoTimeline {
  eyebrow: string;
  conceptDays: number;
  goLiveDays: number;
  footnote: string;
}

export interface BentoOwnershipItem {
  label: string;
  chip: string;
}

export interface BentoOwnership {
  eyebrow: string;
  heading: string;
  noLockIn: boolean;
  items: BentoOwnershipItem[];
  footer: string;
}

export interface BentoFixedPrice {
  eyebrow: string;
  heading: string;
  footer: string;
}

export interface BentoSupport {
  eyebrow: string;
  heading: string;
  text: string;
  chip: string;
  linkText: string;
  terms?: string;
}

export interface BentoConfig {
  title: string;
  subtitle: string;
  pill: string;
  tileA: BentoTileA;
  tileB: BentoTileB;
  tileC: BentoTileC;
  timeline: BentoTimeline;
  ownership: BentoOwnership;
  fixedPrice: BentoFixedPrice;
  support: BentoSupport;
}

export interface CoreEssentialItem {
  title: string;
  icon: string;
}

export interface WhoForPaletteItem {
  gradient: string;
  bgEnd: string;
}

export interface WhoForCard {
  stage: string;
  title: string;
  text: string;
  packageKey: string;
  secondaryLink?: string;
}

export interface WhoForConfig {
  pill: string;
  title: string;
  footer: string;
  palette: {
    stage1: WhoForPaletteItem;
    stage2: WhoForPaletteItem;
    stage3: WhoForPaletteItem;
  };
  cards: WhoForCard[];
}

export interface TestimonialItem {
  id: string;
  fullName: string;
  role: string;
  location: string;
  country?: string;
  rating: number;
  text: string;
  photo: string;
  sourceLabel: string;
  sourceUrl: string;
  date: string;
  isTrade: boolean;
  highlight?: string;
  logo?: string;
}

export interface PortfolioItem {
  id: string;
  name: string;
  trade: string;
  image: string;
  domain?: string;
}

export interface ProofConfig {
  note: string;
}

export interface GrowthCardsConfig {
  pages: {
    title: string;
    text: string;
  };
  profile: {
    title: string;
    text: string;
  };
  list: {
    title: string;
  };
}

export interface GrowthConfig {
  theme: 'dark' | 'light';
  pill: string;
  title: string;
  titleAccent: string;
  cards: GrowthCardsConfig;
}

export interface WhyChooseUsItem {
  number: string;
  question: string;
  answer: string;
}

export interface WhyChooseUsBannerConfig {
  headlinePrefix: string;
  headlineAccent: string;
  headlineSuffix: string;
  buttonText: string;
}

export interface WhyChooseUsConfig {
  titlePrefix: string;
  titleAccent: string;
  subtitle: string;
  items: WhyChooseUsItem[];
  banner?: WhyChooseUsBannerConfig;
}

export interface PricingItemConfig {
  label: string;
  flag?: keyof AppFeaturesConfig;
  aiDisclosure?: boolean;
}

export interface PricingTierConfig {
  id: string;
  name: string;
  price: number;
  monthlyPrice: number;
  days?: number;
  deliveryDays?: number;
  outcome: string;
  description: string;
  everythingInLabel?: string;
  priceNote?: string;
  setupItems: PricingItemConfig[];
  monthlyItems: PricingItemConfig[];
  features?: string[];
  tag?: string;
  highlighted?: boolean;
}

export interface PricingFaqItem {
  question: string;
  answer: string;
}

export interface PricingConfig {
  pill: string;
  title: string;
  titleAccent: string;
  subtext?: string;
  tiers: PricingTierConfig[];
  estimateNote?: string;
  termNote?: string;
  vatNote?: string;
  deliveryNote?: string;
  smallPrint?: string;
}

export type BuilderFeatureGroup = 'Website' | 'Get found on Google' | 'Handle enquiries' | 'Ongoing';

export interface BuilderFeatureConfig {
  id: string;
  name: string;
  description?: string;
  price: number;
  billing: 'one-time' | 'monthly';
  icon: string;
  group: BuilderFeatureGroup;
  flag?: string;
  includedInTiers: Array<'starter' | 'standard' | 'growth'>;
}

export interface BuilderConfig {
  title: string;
  subtext?: string;
  basePrice?: number;
  includedPages: number;
  pricePerExtraPage: number;
  minPages: number;
  maxPages: number;
  pageExamples: string[];
  features: BuilderFeatureConfig[];
  alwaysIncluded: string[];
  estimateNote: string;
}

export interface VideoTestimonialConfig {
  rating?: number;
  disclosure?: string;
  highlight?: string;
  logo?: string;
}

export interface WorkItemConfig {
  id: string;
  title: string;
  trade?: string;
  embedCode?: string;
  embedUrl?: string;
  poster?: string;
  aspectPaddingBottom?: string;
  isClient?: boolean;
  clientName?: string;
  clientPermission?: boolean;
  liveUrl?: string;
}

export interface WorkRowConfig {
  id: string;
  title: string;
  direction: 'rtl' | 'ltr';
  items: WorkItemConfig[];
}

export interface WorkConfig {
  subtitle: string;
  conceptFooterNote?: string;
  rows: WorkRowConfig[];
}

export interface ProcessStepConfig {
  id: string;
  stepLabel: string;
  title: string;
  description: string;
  timing?: string;
  visualType: 'intro' | 'quote' | 'build' | 'live';
}

export interface SocialsConfig {
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  x?: string;
}

export interface LegalLinksConfig {
  terms?: string;
  privacy?: string;
  cookies?: string;
}

export interface UiConfig {
  demoLabels: boolean;
}

export interface AppConfig {
  ui: UiConfig;
  studioName: string;
  legalName: string;
  registrationNumber?: string;
  email: string;
  phone: string;
  companyAddress: string;
  workingModelLine: string;
  contactSubtitle: string;
  responseTime: string;
  formEndpoint: string;
  bookingUrl: string;
  liveDemoUrl: string;
  socials: SocialsConfig;
  legalLinks: LegalLinksConfig;
  trades: string[];
  portfolio: PortfolioItem[];
  work: WorkConfig;
  processSubtitle: string;
  process: ProcessStepConfig[];
  proof: ProofConfig;
  features: AppFeaturesConfig;
  hero: HeroConfig;
  heroProof: HeroProofConfig;
  heroCards: HeroCardConfig[];
  heroTools: HeroToolConfig[];
  founderPhoto?: string;
  socialImage?: string;
  floatingCtaLabel?: string;
  missedCallText?: string;
  whatsapp?: string;
  wayOfWorking: WayOfWorkingConfig;
  bento: BentoConfig;
  whoFor: WhoForConfig;
  growth: GrowthConfig;
  whyChooseUs: WhyChooseUsConfig;
  pricing: PricingConfig;
  pricingFaqs: PricingFaqItem[];
  builder: BuilderConfig;
  promises: string[];
  coreEssentials: CoreEssentialItem[];
  testimonials: TestimonialItem[];
  videoTestimonial?: VideoTestimonialConfig;
  cta?: {
    text?: string;
    signature?: string;
  };
  whiteLabel: WhiteLabelConfig;
}

export interface WhiteLabelStepConfig {
  step: number;
  title: string;
  you: string;
  openHours: string;
  leadLane: 'you' | 'openHours';
}

export interface WhiteLabelConfig {
  headingLead: string;
  headingAccent: string;
  cardTitle: string;
  cardSubtitle: string;
  ctaLabel: string;
  image?: string;
  modalTitle: string;
  modalSubtitle: string;
  steps: WhiteLabelStepConfig[];
  whatYouGet: string[];
  whatWeAsk: string[];
  modalCtaLabel: string;
}

export const config: AppConfig = {
  ui: {
    demoLabels: true,
  },
  studioName: 'Open Hours',
  legalName: 'Open Hours Studio',
  registrationNumber: '',
  email: 'hello@openhours.studio',
  phone: '',
  companyAddress: '',
  workingModelLine: 'Direct with the founder. No account managers.',
  contactSubtitle: 'Tell us about your business and we will reply in writing.',
  responseTime: '24 hours',
  formEndpoint: '',
  bookingUrl: '',
  liveDemoUrl: '',
  founderPhoto: 'https://i.ibb.co.com/6cJH7T24/Profile-Pic.png',
  socialImage: '/roofing-sites/1-xyz-roofing.png',
  floatingCtaLabel: 'Any question?',
  missedCallText:
    "Sorry we missed you. We're on a job. Send your details and we'll reply today.",
  whatsapp: '',
  socials: {
    whatsapp: '',
    instagram: '',
    linkedin: '',
    facebook: '',
    x: '',
  },
  legalLinks: {
    terms: '#terms',
    privacy: '#privacy',
    cookies: '#cookies',
  },
  trades: [
    'Roofers',
    'Kitchen fitters',
    'Extension builders',
    'Windows & doors',
    'Landscapers',
    'Heating installers',
    'Electricians',
    'Plumbers',
  ],
  portfolio: [
    {
      id: 'xyz-roofing',
      name: 'XYZ Roofing',
      trade: 'Roofers',
      image: '/roofing-sites/1-xyz-roofing.png',
      domain: 'xyzroofing.com',
    },
    {
      id: 'alex-roofing',
      name: 'Alex Roofing',
      trade: 'Roofers',
      image: '/roofing-sites/3-alex-roofing.png',
      domain: 'alexroofing.com',
    },
    {
      id: 'roofen',
      name: 'Roofen',
      trade: 'Roofers',
      image: '/roofing-sites/4-roofen.png',
      domain: 'roofen.com',
    },
    {
      id: 'atlantic-slate-roofing',
      name: 'Atlantic Slate Roofing',
      trade: 'Roofers',
      image: '/roofing-sites/5-atlantic-slate-roofing.png',
      domain: 'atlanticslateroofing.com',
    },
  ],
  work: {
    subtitle:
      'Local trade websites and search layouts designed for builders and home-improvement trades across Ireland and Malta.',
    conceptFooterNote: '',
    rows: [
      {
        id: 'trade-websites',
        title: 'Websites built to catch inquiries',
        direction: 'rtl',
        items: [
          {
            id: 'work-video-1',
            title: 'Project video 1',
            poster: 'https://cdn-cf-east.streamable.com/image/f71s1j.jpg',
            aspectPaddingBottom: '52.812%',
            embedUrl: 'https://streamable.com/e/f71s1j?',
            isClient: false,
          },
          {
            id: 'work-video-2',
            title: 'Project video 2',
            poster: 'https://cdn-cf-east.streamable.com/image/m3d1tv.jpg',
            aspectPaddingBottom: '52.812%',
            embedUrl: 'https://streamable.com/e/m3d1tv?',
            isClient: false,
          },
          {
            id: 'work-video-3',
            title: 'Project video 3',
            poster: 'https://cdn-cf-east.streamable.com/image/bgicak.jpg',
            aspectPaddingBottom: '52.812%',
            embedUrl: 'https://streamable.com/e/bgicak?',
            isClient: false,
          },
        ],
      },
      {
        id: 'trade-websites-row-2',
        title: '',
        direction: 'ltr',
        items: [
          {
            id: 'work-video-4',
            title: 'Project video 4',
            poster: 'https://cdn-cf-east.streamable.com/image/jtrirj.jpg',
            aspectPaddingBottom: '52.812%',
            embedUrl: 'https://streamable.com/e/jtrirj?',
            isClient: false,
          },
          {
            id: 'work-video-5',
            title: 'Project video 5',
            poster: 'https://cdn-cf-east.streamable.com/image/kpc5l8.jpg',
            aspectPaddingBottom: '52.812%',
            embedUrl: 'https://streamable.com/e/kpc5l8?',
            isClient: false,
          },
          {
            id: 'work-video-6',
            title: 'Project video 6',
            poster: 'https://cdn-cf-east.streamable.com/image/mk8ej8.jpg',
            aspectPaddingBottom: '52.828%',
            embedUrl: 'https://streamable.com/e/mk8ej8?',
            isClient: false,
          },
        ],
      },
    ],
  },
  processSubtitle: 'What we do, how we do it, and why it matters for your trade.',
  process: [
    {
      id: 'intro-call',
      stepLabel: 'STEP 01',
      title: 'Free intro call',
      description:
        'Tell us your trade, your area and the jobs you want more of. We check what local customers currently find when they search for you.',
      timing: '',
      visualType: 'intro',
    },
    {
      id: 'written-quote',
      stepLabel: 'STEP 02',
      title: 'Written quote',
      description:
        'You receive a clear, fixed-price written quote and page structure agreed upfront before any work begins.',
      timing: '',
      visualType: 'quote',
    },
    {
      id: 'build-and-review',
      stepLabel: 'STEP 03',
      title: 'Build and review',
      description:
        'We build your homepage concept, full pages and Google Business Profile, then review everything with you for any edits.',
      timing: 'Concept in ~3 working days',
      visualType: 'build',
    },
    {
      id: 'go-live',
      stepLabel: 'STEP 04',
      title: 'Go live',
      description:
        'Your site, domain, quote form and call buttons go live together, with full ownership of every file and login.',
      timing: 'Live in ~10 working days',
      visualType: 'live',
    },
  ],
  proof: {
    note: 'Reviews from past clients of the founder, shared via Senja with permission.',
  },
  cta: {
    text: "Let's see what customers find when they look for your trade.",
    signature: 'Open Hours Studio',
  },
  videoTestimonial: {
    rating: 5,
    disclosure: '',
    highlight: 'Quick, clear build from start to finish',
  },
  testimonials: [
    {
      id: '73bd21c3-1c2b-41bf-b4b4-33d3104d10d3',
      fullName: 'Melbah Ndhlovu',
      role: 'Travel Agent',
      location: '',
      rating: 5,
      text: 'Great website! It is accurate, straight to the point, and I love it.',
      photo: 'https://senja-io.s3.us-west-1.amazonaws.com/public/avatar/bb7d457e-fcd6-44d4-9ea7-73f0ad946f09_Screenshot%202026-03-17%20021800.png',
      sourceLabel: 'Senja',
      sourceUrl: 'https://widget.senja.io/widget/f0f56735-a5f3-4083-8724-772691699647',
      date: '2026-03-16',
      isTrade: false,
    },
    {
      id: '051497ef-6557-4b0e-96e9-46ff1658f479',
      fullName: 'Aaron Freedman',
      role: 'Online Fitness Coach',
      location: '',
      rating: 5,
      text: 'Zuhayer has been a fantastic partner in building this website. From the get go, he’s been really good at turning my idea into a physical copy and progressing that into the fundamentals of what the website needs to represent.\n\nIn terms of just working together, he is absolutely outstanding. As for how the website actually looks it’s impeccable. It’s brilliant from start to finish, top to bottom; absolutely outstanding.\n\nIt has all the ins and outs that are needed, including a fun aspect that brings a bit more fitness fun to the site, which potentially draws more clients in and is laid out brilliantly. The usage of photos and coloration is brilliant. I can’t fault it whatsoever.\n\nSo definitely check him out and get your website looking top tier like mine!',
      photo: 'https://senja-io.s3.us-west-1.amazonaws.com/public/avatar/f88983ee-9bb7-48cc-9717-707810658a41_615259119_18554770060028654_1231039578777541797_n.jpg',
      sourceLabel: 'Senja',
      sourceUrl: 'https://widget.senja.io/widget/f0f56735-a5f3-4083-8724-772691699647',
      date: '2026-03-16',
      isTrade: false,
    },
    {
      id: '7be8dc3c-4fd4-4af9-98d7-a463b0488829',
      fullName: 'Rami Sam',
      role: 'Business Owner',
      location: '',
      rating: 5,
      text: 'A reliable partner for high-end web development. Great job, my friend. thank you!',
      photo: 'https://senja-io.s3.us-west-1.amazonaws.com/public/avatar/4e081c92-8a77-4a6f-b2c0-f4b0d76e7b25_586343696_10163383230189265_8923886729029917855_n.jpg',
      sourceLabel: 'Senja',
      sourceUrl: 'https://widget.senja.io/widget/f0f56735-a5f3-4083-8724-772691699647',
      date: '2026-03-16',
      isTrade: false,
    },
    {
      id: '264f0d5c-5f89-474f-a833-d9958a73a405',
      fullName: 'Jeanne M',
      role: 'Acting President',
      location: '',
      rating: 5,
      text: "Zuhayer was very attentive and asked questions to ensure he understood what I needed. He was very prompt and patient with my needed changes and my questions. The communication was probably the best I have had with website builders as he was always prompt and ready to make needed updates. Work was done on time, had to extend time because I was delayed in getting the information in a timely manner. I will definitely keep him on my list of go-to's.",
      photo: 'https://senja-io.s3.us-west-1.amazonaws.com/public/avatar/454e4e70-b56b-4de0-8e0a-2f1266182cb0_c47462ce-ab6b-458a-9737-254717831603.webp',
      sourceLabel: 'Senja',
      sourceUrl: 'https://widget.senja.io/widget/f0f56735-a5f3-4083-8724-772691699647',
      date: '2026-03-16',
      isTrade: false,
    },
    {
      id: '6cef374c-5bcd-4de4-905f-8efff44df2cc',
      fullName: 'Miclans Ivan',
      role: 'Travel Agent',
      location: '',
      rating: 5,
      text: 'I am very happy to have worked with Zuhayer on my website design. He is a true professional, and therefore, I recommend him highly! 🙏',
      photo: 'https://senja-io.s3.us-west-1.amazonaws.com/public/avatar/3098100c-108b-4f2a-8b72-0141a73a9261_472681867_1615349752417574_6177691725433224195_n.jpg',
      sourceLabel: 'Senja',
      sourceUrl: 'https://widget.senja.io/widget/f0f56735-a5f3-4083-8724-772691699647',
      date: '2026-03-15',
      isTrade: false,
    },
    {
      id: 'fba587a6-d218-4844-97a0-f6d11eff33e2',
      fullName: 'Samia Noman',
      role: 'Fitness trainer',
      location: '',
      rating: 0,
      text: 'My experience working with Zuhayer Anjum to build my website was excellent. They guided me through everything and explained each step in detail. I really appreciate their support and professionalism.⭐',
      photo: 'https://senja-io.s3.us-west-1.amazonaws.com/public/avatar/7afb3abc-92ea-4b52-b4ca-6b3bafc02fb8_481894813_9768690369816745_8458194433648554305_n.jpg',
      sourceLabel: 'Senja',
      sourceUrl: 'https://widget.senja.io/widget/f0f56735-a5f3-4083-8724-772691699647',
      date: '2026-03-15',
      isTrade: false,
    },
    {
      id: 'ab4ece8c-ee1a-4400-a305-fae48fc6bcc0',
      fullName: 'Nastasia Luca',
      role: 'Life Coach',
      location: '',
      rating: 5,
      text: 'I was pleasantly surprised by how quickly Zuhayer built and adjusted my website draft, which totally exceeded my expectations in terms of a smooth interface and he first-try even nailed the colours without me even picking a palette. I’ll just call that serendipitous 🌝. The design is clean, way to navigate, and professional. He also surprised me with how he filled it with content that gave me some new ideas for my niche, whilst I’m still working on defining it. He’s super helpful in providing ideas as well and is smooth to collaborate with. Definitely recommend 💯. Warmly, Nastasia',
      photo: 'https://senja-io.s3.us-west-1.amazonaws.com/public/avatar/7fcdb1d4-6c52-4722-9a22-1ba1e04d0803_461122624_8409118065798539_2975271779075124656_n.jpg',
      sourceLabel: 'Senja',
      sourceUrl: 'https://widget.senja.io/widget/f0f56735-a5f3-4083-8724-772691699647',
      date: '2026-03-11',
      isTrade: false,
    },
  ],
  features: {
    missedCallTextBack: true,
    sourceBreakdown: true,
    autoTextSeconds: 60,
    voiceAgent: true,
    afterHoursAutoReply: true,
    enquiryTracking: true,
    serviceAreaPages: true,
    reviewRequests: true,
    googleBusinessProfile: true,
    enquiryInbox: true,
    heroTools: false,
    localSeo: true,
    citations: true,
    aiLeadCapture: true,
    autoBooking: true,
    ownerAlerts: true,
    quoteFollowUp: true,
    photoEstimate: true,
    aeoFaq: true,
    oldClientReactivation: true,
    reviewEngine: true,
    geo: true,
    googleAds: true,
  },
  hero: {
    title: "The website that answers while you're on the job",
    accentWord: 'answers',
    subtitle:
      "Your website replies to quote requests, texts back missed calls and tracks incoming enquiries, so nothing slips while you're on the job.",
    ctaLabel: 'Talk to Us',
  },
  bento: {
    title: 'All in One Digital Growth Solution',
    subtitle:
      'The essentials your trade business needs to get found and turn visits into enquiries, in one fixed-price build.',
    pill: 'Included in every build',
    tileA: {
      heading: 'Your online presence, simplified in one build.',
      text: 'Website, Google profile and enquiry handling, set up to work together.',
    },
    tileB: {
      inboxLabel: 'Enquiry inbox',
      inboxHeading: 'Incoming enquiries in one place.',
      inboxText: 'Quote requests and messages from your site, listed in one simple inbox.',
      fallbackHeading: 'A website built to catch enquiries.',
      tag: 'Illustrative example',
      businessName: 'Sample Roofing Co.',
    },
    tileC: {
      heading: 'Quote requests confirmed, nothing gets lost in a pile.',
      text: 'Your customer gets a confirmation and you get the details straight away.',
      tag: 'Illustrative example',
    },
    timeline: {
      eyebrow: 'Speed and timeline',
      conceptDays: 3,
      goLiveDays: 10,
      footnote: 'Timelines start once we have your photos and details.',
    },
    ownership: {
      eyebrow: 'Ownership',
      heading: 'You own it.',
      noLockIn: true,
      items: [
        { label: 'Your domain', chip: 'Yours' },
        { label: 'Your website', chip: 'Yours' },
        { label: 'Your content', chip: 'Yours' },
      ],
      footer: 'No lock-in. If you leave, you take your files.',
    },
    fixedPrice: {
      eyebrow: 'Fixed price',
      heading: 'A written quote, no surprises.',
      footer: 'Everything spelled out in writing before you spend a cent.',
    },
    support: {
      eyebrow: 'Support',
      heading: 'Support after you go live.',
      text: "Fixes to what we build are covered while you're on a care plan.",
      chip: 'Care plan (optional)',
      linkText: 'See care plan',
    },
  },
  whoFor: {
    pill: 'Find your starting point',
    title: 'Who is this for?',
    footer: "Not sure where you fit? Talk to us and we'll tell you honestly.",
    palette: {
      stage1: {
        gradient: 'from-white to-[#CDE6EC]',
        bgEnd: '#CDE6EC',
      },
      stage2: {
        gradient: 'from-white to-[#F5DCCB]',
        bgEnd: '#F5DCCB',
      },
      stage3: {
        gradient: 'from-white to-[#D3EBDD]',
        bgEnd: '#D3EBDD',
      },
    },
    cards: [
      {
        stage: 'Stage 1',
        title: 'Found on Google, but no clear website',
        text: 'Customers can see your name, and you want them to find you easily and ask for a call or a quote in one tap.',
        packageKey: 'starter',
      },
      {
        stage: 'Stage 2',
        title: 'Getting enquiries, but missing calls on site',
        text: 'Enquiries arrive while you work, and you want automatic replies within about a minute plus calendar booking on supported channels.',
        packageKey: 'standard',
      },
      {
        stage: 'Stage 3',
        title: 'Established team, ready for steady growth',
        text: 'Your core site is solid and you want an ongoing system for enquiries, reviews and repeat work.',
        packageKey: 'growth',
      },
    ],
  },
  growth: {
    theme: 'light',
    pill: 'Full Growth Engine',
    title: 'Go Further',
    titleAccent: 'Full Growth Engine',
    cards: {
      pages: {
        title: 'Pages for every service and area',
        text: 'Clear, dedicated pages that help you show up when local customers search.',
      },
      profile: {
        title: 'Responsive & Google Setup',
        text: 'Our responsive approach ensures your website and Google profile adapt to every screen and search.',
      },
      list: {
        title: 'Everything in Full Growth Engine',
      },
    },
  },
  whyChooseUs: {
    titlePrefix: 'Why',
    titleAccent: 'Choose Us?',
    subtitle:
      "Every trade and local business journey is unique, so our approach is never one-size-fits-all. We tailor our entire build process to the specifics of your trade and goals.",
    items: [
      {
        number: '01',
        question: 'What Does Maximising Value Mean for You?',
        answer:
          'We focus on real enquiries rather than vanity metrics, agreeing on a clear written fixed price before work starts so there are never surprises.',
      },
      {
        number: '02',
        question: 'Control Your Future Involvement',
        answer:
          'You own your domain, code, design and assets from day one. No locked proprietary builders and complete freedom to take your site anywhere.',
      },
      {
        number: '03',
        question: 'Direct Access, No Middlemen',
        answer:
          'You work directly with the founder on video walkthroughs and WhatsApp. No endless ticket queues, junior hand-offs, or confusing tech jargon.',
      },
      {
        number: '04',
        question: 'How Do You Protect Your Reputation?',
        answer:
          "Your website honors your company's hard-earned reputation, ensuring it continues to win high-value jobs with lifetime support while hosted with us.",
      },
    ],
    banner: {
      headlinePrefix: 'Walk away',
      headlineAccent: 'with the highest return and',
      headlineSuffix: 'peace of mind.',
      buttonText: "Let's Talk About Your Business",
    },
  },
  pricing: {
    pill: 'Pricing',
    title: 'Simple pricing,',
    titleAccent: 'fixed in writing',
    subtext: 'Every build starts with a clear scope agreed in writing before work starts.',
    tiers: [
      {
        id: 'starter',
        name: 'Get Found & Get Called',
        price: 990,
        monthlyPrice: 79,
        outcome: 'People who search can find you, and ask for a call or a quote in one tap.',
        description: 'People who search can find you, and ask for a call or a quote in one tap.',
        setupItems: [
          { label: 'Premium website' },
          { label: 'Google Business Profile set-up', flag: 'googleBusinessProfile' },
          { label: 'Local SEO', flag: 'localSeo' },
          { label: 'Citations', flag: 'citations' },
          { label: 'Review link', flag: 'reviewRequests' },
          { label: 'Missed-call text-back', flag: 'missedCallTextBack' },
        ],
        monthlyItems: [
          { label: 'Google Business Profile updates', flag: 'googleBusinessProfile' },
          { label: 'Monthly report', flag: 'enquiryTracking' },
        ],
        features: [
          'Premium website',
          'Google Business Profile set-up',
          'Local SEO',
          'Citations',
          'Review link',
          'Missed-call text-back',
          'Google Business Profile updates (monthly)',
          'Monthly report (monthly)',
        ],
      },
      {
        id: 'standard',
        name: 'Fast Replies',
        price: 1790,
        monthlyPrice: 149,
        tag: 'Recommended',
        highlighted: true,
        outcome:
          'Enquiries get an automatic reply within about a minute, day or night, on supported channels, and qualified leads can book straight into your calendar.',
        description:
          'Enquiries get an automatic reply within about a minute, day or night, on supported channels, and qualified leads can book straight into your calendar.',
        everythingInLabel: 'Everything in Get Found & Get Called, plus:',
        setupItems: [
          { label: 'AI lead capture (email and WhatsApp)', flag: 'aiLeadCapture', aiDisclosure: true },
          { label: 'Automatic booking', flag: 'autoBooking' },
          { label: 'Owner alerts', flag: 'ownerAlerts' },
          { label: 'Quote follow-up', flag: 'quoteFollowUp' },
          { label: 'Photo quote', flag: 'photoEstimate' },
          { label: 'AEO FAQ', flag: 'aeoFaq' },
        ],
        monthlyItems: [
          { label: 'Monthly enquiry summary', flag: 'enquiryTracking' },
          { label: 'Follow-up tuning', flag: 'quoteFollowUp' },
        ],
        features: [
          'AI lead capture (email and WhatsApp)',
          'Automatic booking',
          'Owner alerts',
          'Quote follow-up',
          'Photo quote',
          'AEO FAQ',
          'Monthly enquiry summary (monthly)',
          'Follow-up tuning (monthly)',
        ],
      },
      {
        id: 'growth',
        name: 'Full Growth Engine',
        price: 2900,
        monthlyPrice: 299,
        priceNote: 'Voice call costs are charged separately.',
        outcome: 'An ongoing system for enquiries, reviews and repeat work.',
        description: 'An ongoing system for enquiries, reviews and repeat work.',
        everythingInLabel: 'Everything in Fast Replies, plus:',
        setupItems: [
          { label: 'Voice agent', flag: 'voiceAgent', aiDisclosure: true },
          { label: 'Old-client reactivation', flag: 'oldClientReactivation' },
          { label: 'Review engine', flag: 'reviewEngine' },
          { label: 'GEO', flag: 'geo' },
          { label: 'Google Ads set-up', flag: 'googleAds' },
        ],
        monthlyItems: [
          { label: 'Content and Google Business Profile posts', flag: 'googleBusinessProfile' },
          { label: 'Monthly strategy call' },
          { label: 'Reporting dashboard', flag: 'enquiryTracking' },
        ],
        features: [
          'Voice agent',
          'Old-client reactivation',
          'Review engine',
          'GEO',
          'Google Ads set-up',
          'Content and Google Business Profile posts (monthly)',
          'Monthly strategy call (monthly)',
          'Reporting dashboard (monthly)',
        ],
      },
    ],
    estimateNote: 'from prices; final price confirmed in writing before work starts',
    termNote: '',
    vatNote: '',
    deliveryNote: '',
    smallPrint: '',
  },
  pricingFaqs: [
    { question: 'What is the monthly fee for?', answer: '' },
    { question: 'Can I cancel the monthly plan?', answer: '' },
    { question: 'Are prices shown with or without VAT?', answer: '' },
    { question: "What does 'from' mean?", answer: '' },
    { question: 'Are voice call costs included?', answer: '' },
  ],
  builder: {
    title: 'Need something different?',
    subtext: 'Choose the pages and features you want. The estimate updates as you go.',
    basePrice: 790,
    includedPages: 1,
    pricePerExtraPage: 0, // OWNER: set your real price per extra page, hidden if 0
    minPages: 1,
    maxPages: 15,
    pageExamples: ['Home', 'Services', 'About', 'Contact', 'Service areas'],
    features: [
      // PROPOSED - owner to confirm: set-up and monthly prices calibrated to ~110% of each package price (rounded to €5 set-up / €1 monthly)

      // Group: Website
      {
        id: 'premiumWebsite',
        name: 'Premium website',
        description: 'Custom mobile-first website built to turn local visitors into enquiries',
        price: 100, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'globe',
        group: 'Website',
        includedInTiers: ['starter', 'standard', 'growth'],
      },

      // Group: Get found on Google
      {
        id: 'googleBusinessProfileSetup',
        name: 'Google Business Profile set-up',
        description: 'Profile set-up, categories and verification tidy-up for local Maps',
        price: 50, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'map-pin',
        group: 'Get found on Google',
        flag: 'googleBusinessProfile',
        includedInTiers: ['starter', 'standard', 'growth'],
      },
      {
        id: 'localSeo',
        name: 'Local SEO',
        description: 'Clean local page structure and town signals so Google knows where you work',
        price: 55, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'target',
        group: 'Get found on Google',
        flag: 'localSeo',
        includedInTiers: ['starter', 'standard', 'growth'],
      },
      {
        id: 'citations',
        name: 'Citations',
        description: 'Consistent name, address and phone details across key Irish and Maltese directories',
        price: 30, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'layers',
        group: 'Get found on Google',
        flag: 'citations',
        includedInTiers: ['starter', 'standard', 'growth'],
      },
      {
        id: 'reviewLink',
        name: 'Review link',
        description: 'Short direct Google review link you can send after finishing a job',
        price: 25, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'star',
        group: 'Get found on Google',
        flag: 'reviewRequests',
        includedInTiers: ['starter', 'standard', 'growth'],
      },
      {
        id: 'aeoFaq',
        name: 'AEO FAQ',
        description: 'Structured question-and-answer blocks built for answer engines and local search',
        price: 120, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'file-text',
        group: 'Get found on Google',
        flag: 'aeoFaq',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'reviewEngine',
        name: 'Review engine',
        description: 'Automated post-job follow-up sequence to grow steady Google reviews',
        price: 180, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'star',
        group: 'Get found on Google',
        flag: 'reviewEngine',
        includedInTiers: ['growth'],
      },
      {
        id: 'geo',
        name: 'GEO',
        description: 'Generative Engine Optimisation structure for AI search and assistant citations',
        price: 200, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'sparkles',
        group: 'Get found on Google',
        flag: 'geo',
        includedInTiers: ['growth'],
      },
      {
        id: 'googleAds',
        name: 'Google Ads set-up',
        description: 'Targeted local search campaign structure (ad spend paid directly to Google)',
        price: 280, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'target',
        group: 'Get found on Google',
        flag: 'googleAds',
        includedInTiers: ['growth'],
      },

      // Group: Handle enquiries
      {
        id: 'missedCallTextBack',
        name: 'Missed-call text-back',
        description: 'Automatic text sent shortly after an unanswered call so callers do not move on',
        price: 40, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'phone',
        group: 'Handle enquiries',
        flag: 'missedCallTextBack',
        includedInTiers: ['starter', 'standard', 'growth'],
      },
      {
        id: 'aiLeadCapture',
        name: 'AI lead capture (email and WhatsApp)',
        description: 'Automated reply within about a minute on email and WhatsApp; always says it is an AI',
        price: 250, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'message',
        group: 'Handle enquiries',
        flag: 'aiLeadCapture',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'autoBooking',
        name: 'Automatic booking',
        description: 'Qualified leads book available call or visit slots straight into your calendar',
        price: 150, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'calendar',
        group: 'Handle enquiries',
        flag: 'autoBooking',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'ownerAlerts',
        name: 'Owner alerts',
        description: 'Summary alerts sent to you when a new lead shares job details or books a slot',
        price: 80, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'bell',
        group: 'Handle enquiries',
        flag: 'ownerAlerts',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'quoteFollowUp',
        name: 'Quote follow-up',
        description: 'Polite scheduled check-ins sent after a quote so warm jobs do not go quiet',
        price: 150, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'clock',
        group: 'Handle enquiries',
        flag: 'quoteFollowUp',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'photoQuote',
        name: 'Photo quote',
        description: 'Lets customers attach photos of the job when requesting an estimate',
        price: 130, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'camera',
        group: 'Handle enquiries',
        flag: 'photoEstimate',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'voiceAgent',
        name: 'Voice agent',
        description: 'AI phone assistant that answers calls and logs details; always says it is an AI. Call costs charged separately.',
        price: 350, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'mic',
        group: 'Handle enquiries',
        flag: 'voiceAgent',
        includedInTiers: ['growth'],
      },
      {
        id: 'oldClientReactivation',
        name: 'Old-client reactivation',
        description: 'Tasteful check-in campaigns to re-engage past customers for repeat work',
        price: 210, // PROPOSED - owner to confirm
        billing: 'one-time',
        icon: 'refresh',
        group: 'Handle enquiries',
        flag: 'oldClientReactivation',
        includedInTiers: ['growth'],
      },

      // Group: Ongoing
      {
        id: 'gbpUpdates',
        name: 'Google Business Profile updates',
        description: 'Regular updates, photos and service checks to keep your profile active',
        price: 49, // PROPOSED - owner to confirm
        billing: 'monthly',
        icon: 'map-pin',
        group: 'Ongoing',
        flag: 'googleBusinessProfile',
        includedInTiers: ['starter', 'standard', 'growth'],
      },
      {
        id: 'monthlyReport',
        name: 'Monthly report',
        description: 'Clear monthly summary of calls, form enquiries and local visibility',
        price: 38, // PROPOSED - owner to confirm
        billing: 'monthly',
        icon: 'bar-chart',
        group: 'Ongoing',
        flag: 'enquiryTracking',
        includedInTiers: ['starter', 'standard', 'growth'],
      },
      {
        id: 'monthlyEnquirySummary',
        name: 'Monthly enquiry summary',
        description: 'Detailed breakdown of enquiry sources, reply speeds and booked slots',
        price: 37, // PROPOSED - owner to confirm
        billing: 'monthly',
        icon: 'file-text',
        group: 'Ongoing',
        flag: 'enquiryTracking',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'followUpTuning',
        name: 'Follow-up tuning',
        description: 'Monthly refinements to AI reply wording and quote follow-up timing',
        price: 40, // PROPOSED - owner to confirm
        billing: 'monthly',
        icon: 'refresh',
        group: 'Ongoing',
        flag: 'quoteFollowUp',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'contentAndGbpPosts',
        name: 'Content and Google Business Profile posts',
        description: 'Fresh project updates and regular Google Business Profile posts published for you',
        price: 65, // PROPOSED - owner to confirm
        billing: 'monthly',
        icon: 'images',
        group: 'Ongoing',
        flag: 'googleBusinessProfile',
        includedInTiers: ['growth'],
      },
      {
        id: 'monthlyStrategyCall',
        name: 'Monthly strategy call',
        description: 'Focused monthly review call covering leads, rankings and next priorities',
        price: 60, // PROPOSED - owner to confirm
        billing: 'monthly',
        icon: 'phone',
        group: 'Ongoing',
        includedInTiers: ['growth'],
      },
      {
        id: 'reportingDashboard',
        name: 'Reporting dashboard',
        description: 'Live view of enquiry activity, sources and campaign performance',
        price: 40, // PROPOSED - owner to confirm
        billing: 'monthly',
        icon: 'bar-chart',
        group: 'Ongoing',
        flag: 'enquiryTracking',
        includedInTiers: ['growth'],
      },
    ],
    alwaysIncluded: [
      'Fixed price agreed in writing before we start',
      'Domain and website owned outright by you',
      'Fast, mobile-friendly design',
      'HTTPS security and spam protection',
    ],
    estimateNote: 'This is an estimate. We confirm a fixed price in writing before we start.',
  },
  promises: [
    'Quote before we start',
    'Price stays the same unless the scope changes',
    'Deposit only after you approve the concept',
  ],
  coreEssentials: [
    { title: 'Google Business Profile tidy-up', icon: 'MapPin' },
    { title: 'Local search foundations', icon: 'Globe' },
    { title: 'Speed and mobile checks', icon: 'Zap' },
    { title: 'Enquiry tracking', icon: 'TrendingUp' },
    { title: 'Privacy and cookie basics', icon: 'ShieldCheck' },
    { title: 'Support after you go live', icon: 'Award' },
  ],
  heroProof: {
    avatars: [
      {
        src: 'https://i.ibb.co.com/KjqvTgXf/f88983ee-9bb7-48cc-9717-707810658a41-615259119-18554770060028654-1231039578777541797-n.webp',
        localSrc: '/clients/1.webp',
        name: '',
        business: '',
        consent: true,
      },
      {
        src: 'https://i.ibb.co.com/73Qk9w0/4e081c92-8a77-4a6f-b2c0-f4b0d76e7b25-586343696-10163383230189265-8923886729029917855-n.webp',
        localSrc: '/clients/2.webp',
        name: '',
        business: '',
        consent: true,
      },
      {
        src: 'https://i.ibb.co.com/7JK84cq1/7afb3abc-92ea-4b52-b4ca-6b3bafc02fb8-481894813-9768690369816745-8458194433648554305-n.webp',
        localSrc: '/clients/3.webp',
        name: '',
        business: '',
        consent: true,
      },
      {
        src: 'https://i.ibb.co.com/N2DDpWjD/454e4e70-b56b-4de0-8e0a-2f1266182cb0-c47462ce-ab6b-458a-9737-254717831603.webp',
        localSrc: '/clients/4.webp',
        name: '',
        business: '',
        consent: true,
      },
      {
        src: 'https://i.ibb.co.com/ZpYSS02t/7fcdb1d4-6c52-4722-9a22-1ba1e04d0803-461122624-8409118065798539-2975271779075124656-n.webp',
        localSrc: '/clients/5.webp',
        name: '',
        business: '',
        consent: true,
      },
    ],
    line: 'Trusted by Professionals Like You',
    line1: 'Trusted by Professionals Like You',
    line2: '',
    linkText: 'See what they say',
    showStars: false,
    ratingSourceUrl: '',
    ratingLabel: '',
    rating: '',
    source: '',
    count: undefined,
    photoNote: '',
  },
  heroCards: [
    {
      id: 'new-enquiry',
      variant: 'dark',
      label: 'New enquiry',
      subtitle: 'Roof repair, Cork',
      meta: '2 min ago',
      tag: 'Sample data',
    },
    {
      id: 'weekly-enquiries',
      variant: 'teal-tint',
      label: 'Enquiries this week',
      tag: 'Sample data',
    },
    {
      id: 'call-taps',
      variant: 'peach-tint',
      label: 'Call button taps',
      tag: 'Sample data',
    },
    {
      id: 'missed-call',
      variant: 'white',
      label: 'Missed call, text sent',
      weekdays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      activeDays: [1, 3, 5],
      requiresFlag: 'missedCallTextBack',
      tag: 'Sample data',
    },
    {
      id: 'google-enquiry',
      variant: 'dark-pill',
      label: 'Enquiry from Google',
      avatarMonogram: 'G',
      tag: 'Sample data',
    },
  ],
  heroTools: [
    { id: 'gemini', name: 'Gemini', icon: 'gemini' },
    { id: 'claude', name: 'Claude', icon: 'claude' },
    { id: 'chatgpt', name: 'ChatGPT', icon: 'chatgpt' },
    { id: 'figma', name: 'Figma', icon: 'figma' },
    { id: 'lovable', name: 'Lovable', icon: 'lovable' },
    { id: 'whatsapp', name: 'WhatsApp', icon: 'whatsapp' },
    { id: 'gbp', name: 'Google Business Profile', icon: 'gbp' },
    { id: 'vercel', name: 'Vercel', icon: 'vercel' },
    { id: 'github', name: 'GitHub', icon: 'github' },
  ],
  wayOfWorking: {
    title: 'The way we deliver',
    studioVoice: '', // "we" or "I", not decided; leave empty, do not guess
    sampleTown: 'Sampletown',
    sampleTrade: 'roofer',
    voiceAgentTag: 'Optional add-on',
    storyLabel: 'Illustrative story',
    sampleAreas: ['North District', 'West End', 'Harbour View'],
    palette: {
      searches: { bg: '#050E0D', bg2: '#0F2F2B', ink: '#F3F6F8', accent: '#E8B08F', accent2: '#C8642E' },
      journey:  { bg: '#FBF6EE', bg2: '#F3E9DA', ink: '#12303D', accent: '#C8642E', accent2: '#E8B08F' },
      solve:    { bg: '#EEF8F3', bg2: '#DDF1E7', ink: '#0F2F2B', accent: '#1E9E6A', accent2: '#A8EBD3' },
      build:    { bg: '#0B1B22', bg2: '#0F2F2B', ink: '#EAF1F6', accent: '#E8B08F', accent2: '#3FD1A5' },
      findable: { bg: '#EDF6F2', bg2: '#D8ECE3', ink: '#0F2F2B', accent: '#14574C', accent2: '#A8EBD3' },
      rank:     { bg: '#0B1B22', bg2: '#14574C', ink: '#FFF7EE', accent: '#E8B08F', accent2: '#A8EBD3' },
      alwaysOn: { bg: '#050E0D', bg2: '#0F2F2B', ink: '#E8EEF4', accent: '#3FD1A5', accent2: '#E8B08F' },
      talk:     { bg: '#0F2F2B', bg2: '#050E0D', ink: '#FFFFFF', accent: '#E8B08F', accent2: '#C8642E' },
    },
    pace: {
      sceneSeconds: 2.2,
      holdAfterBeat: 1.0,
      sceneTransition: 0.25,
      stagger: 0.1,
      lineDraw: 1.5,
      captionDwellPerWord: 0.3,
      scrollVhPerScene: 45,
    },
    scenes: [
      {
        id: 'searches',
        title: "Your customers are searching. They just can't find you.",
        accentWord: 'searching.',
        captions: ["A homeowner searches 'roofer near me'"],
      },
      {
        id: 'journey',
        title: 'We map your customer journey and find where it breaks.',
        accentWord: 'journey',
        captions: ['Clicks drop where contact gets hard'],
      },
      {
        id: 'solve',
        title: 'This is what we actually solve.',
        accentWord: 'solve.',
        captions: ['Each gap turns into a clear step'],
      },
      {
        id: 'build',
        title: 'We build a website made to catch enquiries.',
        accentWord: 'enquiries.',
        captions: ['Tap to call or request a quote'],
      },
      {
        id: 'findable',
        title: 'We make it easy for Google to understand you.',
        accentWord: 'Google',
        captions: ['Maps, areas and reviews work together'],
      },
      {
        id: 'rank',
        title: 'Ranking takes months, not days.',
        accentWord: 'days.',
        captions: ['Steady local signals build month by month'],
      },
      {
        id: 'alwaysOn',
        title: 'Enquiries get handled around the clock.',
        accentWord: 'around',
        captions: ['Night calls answered, job logged for morning'],
        enabledWhen: 'voiceAgent',
      },
      {
        id: 'talk',
        title: 'Want us to do this exact process with your business?',
        accentWord: 'process',
        subline: "Tell us your trade and your area, and we'll show you what your customers see today.",
        captions: ['Ready to see what customers see today?'],
      },
    ],
  },
  whiteLabel: {
    headingLead: 'Your white-label build partner',
    headingAccent: 'for agencies',
    cardTitle: 'Are you an agency that needs a white-label website partner?',
    cardSubtitle: 'We can help you with that.',
    ctaLabel: 'See full process',
    image: '',
    modalTitle: 'How white-label works',
    modalSubtitle:
      'You keep the client and the brand. We build the website behind the scenes, to a fixed price agreed in writing before work starts.',
    steps: [
      {
        step: 1,
        title: 'Intro call',
        you: 'Tell us about your agency, your clients and the websites you sell.',
        openHours: 'Listen, explain how we work, and say honestly whether we are a good fit.',
        leadLane: 'you',
      },
      {
        step: 2,
        title: 'Simple agreement',
        you: 'Confirm the scope and ground rules.',
        openHours:
          'Confirm in writing that your clients will not see the Open Hours name, and sign an NDA if you ask.',
        leadLane: 'you',
      },
      {
        step: 3,
        title: 'Project brief',
        you: "Send your client's brand, content and goals using our short brief form.",
        openHours: 'Check it and ask only for what is missing.',
        leadLane: 'you',
      },
      {
        step: 4,
        title: 'Fixed quote',
        you: 'Approve it.',
        openHours:
          'Send the price and delivery date in writing for each project before work starts.',
        leadLane: 'openHours',
      },
      {
        step: 5,
        title: 'Build under your brand',
        you: "Review it and send us your client's feedback in one go (rounds of changes are set in the quote).",
        openHours:
          'Design and build the site with no Open Hours branding, and share progress at agreed checkpoints.',
        leadLane: 'openHours',
      },
      {
        step: 6,
        title: 'Handover and launch',
        you: 'Present it to your client as your work. Your client owns the domain, code, design and assets from day one.',
        openHours:
          "Put the site live on your client's domain and hosting and hand over the files and logins.",
        leadLane: 'openHours',
      },
      {
        step: 7,
        title: 'Aftercare',
        you: 'Stay the single point of contact for your client.',
        openHours: 'Fix issues during the support period agreed in the quote; monthly care is optional.',
        leadLane: 'openHours',
      },
    ],
    whatYouGet: [
      'Your brand, not ours',
      'A fixed price in writing',
      'Sites your clients own',
    ],
    whatWeAsk: ['A clear brief', 'Feedback sent in one go'],
    modalCtaLabel: 'Talk about a white-label project',
  },
};

export const CONFIG = config;
export default config;
