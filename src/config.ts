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
  linkText: string;
  showStars: boolean;
  ratingSourceUrl: string;
  ratingLabel: string;
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
  rating: number;
  text: string;
  photo: string;
  sourceLabel: string;
  sourceUrl: string;
  date: string;
  isTrade: boolean;
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

export interface PricingTierConfig {
  id: string;
  name: string;
  price: number;
  days: number;
  description: string;
  features?: string[];
  tag?: string;
  highlighted?: boolean;
}

export interface PricingConfig {
  pill: string;
  title: string;
  titleAccent: string;
  subtext?: string;
  tiers: PricingTierConfig[];
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

export interface AppConfig {
  studioName: string;
  legalName: string;
  companyAddress: string;
  bookingUrl: string;
  liveDemoUrl: string;
  features: AppFeaturesConfig;
  heroProof: HeroProofConfig;
  wayOfWorking: WayOfWorkingConfig;
  bento: BentoConfig;
  whoFor: WhoForConfig;
  growth: GrowthConfig;
  whyChooseUs: WhyChooseUsConfig;
  pricing: PricingConfig;
  builder: BuilderConfig;
  promises: string[];
  coreEssentials: CoreEssentialItem[];
  testimonials: TestimonialItem[];
}

export const config: AppConfig = {
  studioName: 'Open Hours',
  legalName: 'Open Hours Studio',
  companyAddress: '',
  bookingUrl: '',
  liveDemoUrl: '',
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
      inboxHeading: 'Every enquiry in one place.',
      inboxText: 'Quote requests and messages from your site, listed in one simple inbox.',
      fallbackHeading: 'A website built to catch enquiries.',
      tag: 'Illustrative example',
      businessName: 'Sample Roofing Co.',
    },
    tileC: {
      heading: 'Every enquiry confirmed, nothing gets lost in a pile.',
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
        title: 'Found on Google, but no website yet',
        text: 'Customers can see your name, but have nothing to look at and no easy way to send you a quote request.',
        packageKey: 'starter',
        secondaryLink: 'Start with a 1-page website at no cost',
      },
      {
        stage: 'Stage 2',
        title: 'Website and profile, but neglected',
        text: "You have both, but they're out of date, hard to enquire from, or nobody has time to look after them.",
        packageKey: 'standard',
      },
      {
        stage: 'Stage 3',
        title: 'Working well, and ready for more',
        text: 'Your website and profile are solid. You want more visibility and a tighter path from search to enquiry.',
        packageKey: 'growth',
      },
    ],
  },
  growth: {
    theme: 'light',
    pill: 'Growth package',
    title: 'Go Further',
    titleAccent: 'Our Growth Package',
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
        title: 'Everything in Growth',
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
        question: 'What Does Maximizing Value Mean for You?',
        answer:
          'We focus on real enquiries rather than vanity metrics, agreeing on a clear written fixed price before work starts so there are never surprises.',
      },
      {
        number: '02',
        question: 'Control Your Future Involvement',
        answer:
          'You own your domain, code, design, and assets 100% from day one. No locked proprietary builders and complete freedom to take your site anywhere.',
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
    subtext: 'Every build starts with a written quote agreed before we start. No hidden extras.',
    tiers: [
      {
        id: 'starter',
        name: 'Starter',
        price: 790,
        days: 7,
        description: 'A small, complete website for your trade.',
        features: [
          '3 to 5 pages, mobile-first',
          'Quote and site-visit request form, with call buttons',
          'Google Business Profile set-up and tidy-up',
          'HTTPS and spam-protected forms',
          'Support after you go live',
        ],
      },
      {
        id: 'standard',
        name: 'Standard',
        price: 1290,
        days: 10,
        tag: 'Recommended',
        highlighted: true,
        description: 'A fuller site that handles enquiries, even after hours.',
        features: [
          '5 to 8 pages, with a project gallery and service-area pages',
          'Copy written for each service, with FAQs',
          'Photo quote requests: customers can send a picture of the job',
          'After-hours auto-reply and missed-call text-back',
          'Local search foundations',
          'Review-request link set-up',
        ],
      },
      {
        id: 'growth',
        name: 'Growth',
        price: 2200,
        days: 14,
        description: 'For more services, more areas and bigger projects.',
        features: [
          'As many pages as your business needs, agreed in your written quote',
          'A page for each service and area',
          'Advanced Google Business Profile optimisation',
          'Google Ads campaign set-up (ad spend paid directly to Google)',
          'Enquiry tracking and a monthly report',
          'Review-request flow',
        ],
      },
    ],
    smallPrint: "Ad spend is paid to Google directly. Domain is registered in the client's name.",
  },
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
      // OWNER: set real prices, rows with price 0 stay hidden

      // Group: Website
      {
        id: 'projectGallery',
        name: 'Project gallery',
        description: 'Showcase photos of recent work to build confidence',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'images',
        group: 'Website',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'serviceCopyFaqs',
        name: 'Copy written for each service, with FAQs',
        description: 'Clear, plain-language text and common questions for each service',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'file-text',
        group: 'Website',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'securitySpam',
        name: 'HTTPS and spam-protected forms',
        description: 'SSL encryption and spam-protected enquiry forms',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'lock',
        group: 'Website',
        includedInTiers: ['starter', 'standard', 'growth'],
      },

      // Group: Get found on Google
      {
        id: 'gbp',
        name: 'Google Business Profile set-up',
        description: 'Profile set-up, verification guidance and tidy-up',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'map-pin',
        group: 'Get found on Google',
        flag: 'googleBusinessProfile',
        includedInTiers: ['starter', 'standard', 'growth'],
      },
      {
        id: 'advancedGbp',
        name: 'Advanced Google Business Profile optimisation',
        description: 'Full profile optimisation to help you stand out in local map searches',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'map-pin',
        group: 'Get found on Google',
        flag: 'googleBusinessProfile',
        includedInTiers: ['growth'],
      },
      {
        id: 'serviceAreaPages',
        name: 'Service-area pages',
        description: 'Dedicated pages for towns and localities you cover',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'layers',
        group: 'Get found on Google',
        flag: 'serviceAreaPages',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'localSearchFoundations',
        name: 'Local search foundations',
        description: 'Clean geographic structure so Google understands your location',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'globe',
        group: 'Get found on Google',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'reviewRequests',
        name: 'Review requests',
        description: 'Link setup and automated flow to collect client reviews',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'star',
        group: 'Get found on Google',
        flag: 'reviewRequests',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'googleAds',
        name: 'Google Ads campaign set-up',
        description: 'Targeted local search campaign (ad spend paid directly to Google)',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'target',
        group: 'Get found on Google',
        includedInTiers: ['growth'],
      },

      // Group: Handle enquiries
      {
        id: 'quoteForm',
        name: 'Quote request form',
        description: 'Quote and site-visit request form with call buttons',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'form',
        group: 'Handle enquiries',
        includedInTiers: ['starter', 'standard', 'growth'],
      },
      {
        id: 'photoQuote',
        name: 'Photo quote requests',
        description: 'Customers can attach photos of the job directly to quote requests',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'camera',
        group: 'Handle enquiries',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp button',
        description: 'Direct chat button for fast enquiries from mobile visitors',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'message',
        group: 'Handle enquiries',
        includedInTiers: [],
      },
      {
        id: 'afterHoursAutoReply',
        name: 'After-hours auto-reply',
        description: 'Automatic response and details capture when calls or forms arrive after hours',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'clock',
        group: 'Handle enquiries',
        flag: 'afterHoursAutoReply',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'missedCallTextBack',
        name: 'Missed-call text-back',
        description: "Automatic text sent back to callers when you cannot answer on a job",
        price: 0, // OWNER: set real price
        billing: 'monthly',
        icon: 'phone',
        group: 'Handle enquiries',
        flag: 'missedCallTextBack',
        includedInTiers: ['standard', 'growth'],
      },
      {
        id: 'enquiryTracking',
        name: 'Enquiry tracking',
        description: 'Track phone calls, WhatsApp messages and quote forms with a monthly report',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'bar-chart',
        group: 'Handle enquiries',
        flag: 'enquiryTracking',
        includedInTiers: ['growth'],
      },
      {
        id: 'voiceAgent',
        name: 'Voice agent',
        description: 'Automated assistant answering calls when your tools are in hand',
        price: 0, // OWNER: set real price
        billing: 'monthly',
        icon: 'mic',
        group: 'Handle enquiries',
        flag: 'voiceAgent',
        includedInTiers: [],
      },

      // Group: Ongoing
      {
        id: 'carePlan',
        name: 'Care plan',
        description: 'Hosting, security, updates and backups',
        price: 39,
        billing: 'monthly',
        icon: 'shield',
        group: 'Ongoing',
        includedInTiers: [],
      },
      {
        id: 'supportAfterLive',
        name: 'Support after you go live',
        description: 'Ongoing support and fixes to what we build',
        price: 0, // OWNER: set real price
        billing: 'one-time',
        icon: 'life-buoy',
        group: 'Ongoing',
        includedInTiers: ['starter', 'standard', 'growth'],
      },
    ],
    alwaysIncluded: [
      'Fixed price agreed in writing before we start',
      'Domain and website owned 100% by you',
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
    line: 'Trusted by professionals like you.',
    linkText: 'See what they say',
    showStars: false,
    ratingSourceUrl: '',
    ratingLabel: '',
  },
  wayOfWorking: {
    title: 'The way we deliver',
    studioVoice: '', // "we" or "I", not decided; leave empty, do not guess
    sampleTown: 'Sampletown',
    sampleTrade: 'roofer',
    voiceAgentTag: 'Optional add-on',
    storyLabel: 'Illustrative story',
    sampleAreas: ['North District', 'West End', 'Harbour View'],
    palette: {
      searches: { bg: '#0B1B2B', bg2: '#12303D', ink: '#F3F6F8', accent: '#F4B860', accent2: '#E5484D' },
      journey:  { bg: '#FBF6EE', bg2: '#F3E9DA', ink: '#12303D', accent: '#C8642E', accent2: '#E8B08F' },
      solve:    { bg: '#EEF8F3', bg2: '#DDF1E7', ink: '#0F3B2C', accent: '#1E9E6A', accent2: '#9ED9BC' },
      build:    { bg: '#12304A', bg2: '#0B1F31', ink: '#EAF1F6', accent: '#E8B08F', accent2: '#7FA6C2' },
      findable: { bg: '#EAF3FF', bg2: '#D7E7FB', ink: '#10284A', accent: '#2F6BFF', accent2: '#9DBCF7' },
      rank:     { bg: '#1B1F4B', bg2: '#F6C9A5', ink: '#FFF7EE', accent: '#F2B544', accent2: '#F6C9A5' }, // deep navy-indigo, never violet or purple
      alwaysOn: { bg: '#0A1220', bg2: '#0F1B2E', ink: '#E8EEF4', accent: '#2DD4BF', accent2: '#F4B860' },
      talk:     { bg: '#12303D', bg2: '#0B1B22', ink: '#FFFFFF', accent: '#E8B08F', accent2: '#C8642E' },
    },
    pace: {
      sceneSeconds: 8,
      holdAfterBeat: 1.4,
      sceneTransition: 1.1,
      stagger: 0.12,
      lineDraw: 1.6,
      captionDwellPerWord: 0.38,
      scrollVhPerScene: 90,
    },
    scenes: [
      {
        id: 'searches',
        title: "Your customers are searching. They just can't find you.",
        accentWord: 'searching.',
        captions: [
          'A homeowner needs a roofer tonight.',
          'Local roofers show up, each with a website.',
          'You are listed, but there is nothing to click.',
          'They tap a competitor instead.',
        ],
      },
      {
        id: 'journey',
        title: 'We map your customer journey and find where it breaks.',
        accentWord: 'journey',
        captions: [
          'We follow your customer from search to call.',
          'Four places where enquiries slip away.',
        ],
      },
      {
        id: 'solve',
        title: 'This is what we actually solve.',
        accentWord: 'solve.',
        captions: [
          'Each gap gets a fix.',
          'The customer reaches you.',
        ],
      },
      {
        id: 'build',
        title: 'We build a website made to catch enquiries.',
        accentWord: 'enquiries.',
        captions: [
          'We draw the site around one goal.',
          'Call button, headline, quote form.',
          'Every enquiry gets confirmed.',
        ],
      },
      {
        id: 'findable',
        title: 'We make it easy for Google to understand you.',
        accentWord: 'Google',
        captions: [
          'Your business profile gets set up properly.',
          'Pages for the areas you cover.',
          'A simple way to ask happy customers.',
        ],
      },
      {
        id: 'rank',
        title: 'Ranking takes months, not days.',
        accentWord: 'days.',
        captions: [
          'Local rankings build slowly.',
          'Groundwork adds up, month by month.',
          'Nobody can promise a position. We never do.',
        ],
      },
      {
        id: 'alwaysOn',
        title: 'Enquiries get handled around the clock.',
        accentWord: 'around',
        captions: [
          'A call comes in at night.',
          'The assistant says it is an AI.',
          'Name, job and postcode are taken.',
          'The enquiry is logged for the morning.',
        ],
        enabledWhen: 'voiceAgent',
      },
      {
        id: 'talk',
        title: 'Want us to do this exact process with your business?',
        accentWord: 'process',
        subline: "Tell us your trade and your area, and we'll show you what your customers see today.",
        captions: [
          'Calls route, forms ping, quotes flow.',
          'Ready to get more local work?',
        ],
      },
    ],
  },
};

export const CONFIG = config;
export default config;
