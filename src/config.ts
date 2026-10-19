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

export interface WayOfWorkingStep {
  caption: string;
  highlight: string;
}

export interface WayOfWorkingScene {
  id: string;
  tab: string;
  headline: string;
  text?: string;
  caption: string;
  steps: WayOfWorkingStep[];
  pairs?: FrictionPair[];
}

export interface WayOfWorkingPace {
  scrollVhPerStep: number;
  mobileScrollVhPerStep: number;
  stepAnimMs: number;
  stepHoldMs: number;
  rankStepDwellMs: number;
  sceneTransitionMs: number;
  elementStaggerMs: number;
  lineDrawMs: number;
  stepMinDwellMs?: number;
  rewindStepMs?: number;
  sceneVh?: number;
  rankSceneVh?: number;
  ctaSceneVh?: number;
}

export interface WayOfWorkingTiming {
  s1: number;
  s2: number;
  s3: number;
  s4: number;
  s5: number;
  s6: number;
  s7: number;
  s8: number;
  speed: number;
  pauseOnHover: boolean;
}

export interface WayOfWorkingPaletteItem {
  id: string;
  bg: string;
  bgSolid?: string;
  bgStart?: string;
  bgEnd?: string;
  textPrimary: string;
  textSecondary: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  isDark: boolean;
  [key: string]: any;
}

export interface WayOfWorkingPalette {
  s1: WayOfWorkingPaletteItem;
  s2: WayOfWorkingPaletteItem;
  s3: WayOfWorkingPaletteItem;
  s4: WayOfWorkingPaletteItem;
  s5: WayOfWorkingPaletteItem;
  s6: WayOfWorkingPaletteItem;
  s7: WayOfWorkingPaletteItem;
  s8: WayOfWorkingPaletteItem;
  [key: string]: WayOfWorkingPaletteItem;
}

export interface WayOfWorkingConfig {
  title: string;
  studioVoice: 'we';
  ctaHeadline: string;
  ctaText: string;
  voiceAgentTag: string;
  sampleTown: string;
  sampleTrade: string;
  timing: WayOfWorkingTiming;
  palette: WayOfWorkingPalette;
  pace: WayOfWorkingPace;
  scenes: WayOfWorkingScene[];
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
    title: 'The Way We Deliver',
    studioVoice: 'we',
    ctaHeadline: 'Want us to do this exact process with your business?',
    ctaText: "Tell us your trade and your area, and we'll show you what your customers see today.",
    voiceAgentTag: 'Optional add-on',
    sampleTown: 'Galway',
    sampleTrade: 'roofers',
    timing: {
      s1: 10000,
      s2: 11000,
      s3: 10000,
      s4: 11000,
      s5: 10000,
      s6: 13000,
      s7: 11000,
      s8: 0, // holds indefinitely on final CTA
      speed: 1, // default 1, higher is slower
      pauseOnHover: false,
    },
    palette: {
      s1: {
        id: 'night',
        bg: 'linear-gradient(135deg, #0B1B2B 0%, #12303D 100%)',
        bgSolid: '#0B1B2B',
        textPrimary: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.72)',
        pillBg: 'rgba(255, 255, 255, 0.1)',
        pillText: '#F4B860',
        pillBorder: 'rgba(244, 184, 96, 0.3)',
        mapLines: '#2A5A6B',
        accentAmber: '#F4B860',
        missingRed: '#E5484D',
        isDark: true,
      },
      s2: {
        id: 'paper',
        bg: '#FBF6EE',
        bgSolid: '#FBF6EE',
        textPrimary: '#1B2B34',
        textSecondary: 'rgba(27, 43, 52, 0.72)',
        pillBg: 'rgba(200, 100, 46, 0.1)',
        pillText: '#C8642E',
        pillBorder: 'rgba(200, 100, 46, 0.25)',
        journeyLine: '#C8642E',
        frictionRed: '#D64545',
        faintNumeral: '#E9DFD2',
        isDark: false,
      },
      s3: {
        id: 'mint',
        bg: '#EEF8F3',
        bgStart: '#FBF6EE',
        bgSolid: '#EEF8F3',
        textPrimary: '#143828',
        textSecondary: 'rgba(20, 56, 40, 0.72)',
        pillBg: 'rgba(30, 158, 106, 0.12)',
        pillText: '#1E9E6A',
        pillBorder: 'rgba(30, 158, 106, 0.3)',
        fixedEmerald: '#1E9E6A',
        frictionRed: '#D64545',
        faintNumeral: '#D5ECE0',
        isDark: false,
      },
      s4: {
        id: 'blueprint',
        bg: '#12304A',
        bgSolid: '#12304A',
        textPrimary: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        pillBg: 'rgba(232, 176, 143, 0.15)',
        pillText: '#E8B08F',
        pillBorder: 'rgba(232, 176, 143, 0.3)',
        gridLine: 'rgba(255, 255, 255, 0.08)',
        peachAccent: '#E8B08F',
        isDark: true,
      },
      s5: {
        id: 'sky',
        bg: '#EAF3FF',
        bgSolid: '#EAF3FF',
        textPrimary: '#0F2A4A',
        textSecondary: 'rgba(15, 42, 74, 0.72)',
        pillBg: 'rgba(47, 107, 255, 0.1)',
        pillText: '#2F6BFF',
        pillBorder: 'rgba(47, 107, 255, 0.25)',
        accentBlue: '#2F6BFF',
        cardBg: '#FFFFFF',
        isDark: false,
      },
      s6: {
        id: 'dawn',
        bgStart: '#1B1F4B',
        bgEnd: '#F6C9A5',
        bg: 'linear-gradient(135deg, #1B1F4B 0%, #F6C9A5 100%)',
        bgSolid: '#1B1F4B',
        textPrimary: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.8)',
        pillBg: 'rgba(242, 181, 68, 0.18)',
        pillText: '#F2B544',
        pillBorder: 'rgba(242, 181, 68, 0.35)',
        businessGold: '#F2B544',
        isDark: true,
      },
      s7: {
        id: 'midnight',
        bg: '#0A1220',
        bgSolid: '#0A1220',
        textPrimary: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        pillBg: 'rgba(45, 212, 191, 0.15)',
        pillText: '#2DD4BF',
        pillBorder: 'rgba(45, 212, 191, 0.3)',
        waveformTeal: '#2DD4BF',
        phoneAmber: '#F4B860',
        isDark: true,
      },
      s8: {
        id: 'brand',
        bg: '#12303D',
        bgSolid: '#12303D',
        textPrimary: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        pillBg: 'rgba(232, 176, 143, 0.15)',
        pillText: '#E8B08F',
        pillBorder: 'rgba(232, 176, 143, 0.3)',
        peachAccent: '#E8B08F',
        isDark: true,
      },
    },
    pace: {
      scrollVhPerStep: 25,
      mobileScrollVhPerStep: 20,
      stepAnimMs: 1200,
      stepHoldMs: 700,
      stepMinDwellMs: 1900,
      rankStepDwellMs: 2600,
      rewindStepMs: 450,
      sceneTransitionMs: 1000,
      elementStaggerMs: 300,
      lineDrawMs: 2200,
    },
    scenes: [
      {
        id: 'searches',
        tab: '01 Searches',
        headline: "Your customers are searching. They just can't find you.",
        caption: 'Illustrative example',
        steps: [
          {
            caption: 'Someone in Galway searches on a phone.',
            highlight: 'search',
          },
          {
            caption: 'They see three competitors, not you.',
            highlight: 'competitors',
          },
          {
            caption: 'Your business is listed without a website.',
            highlight: 'your-biz',
          },
          {
            caption: 'The customer calls a competitor instead.',
            highlight: 'veer',
          },
        ],
      },
      {
        id: 'journey',
        tab: '02 Journey',
        headline: 'We map your customer journey and find where it breaks.',
        caption: 'Illustrative example',
        steps: [
          {
            caption: 'We map your whole customer journey.',
            highlight: 'intro',
          },
          {
            caption: 'No website to click: they bounce.',
            highlight: 'click',
          },
          {
            caption: 'Hard to contact: they give up.',
            highlight: 'website',
          },
          {
            caption: 'Missed call after hours: customer lost.',
            highlight: 'call',
          },
          {
            caption: 'No follow-up: the enquiry goes cold.',
            highlight: 'followup',
          },
        ],
      },
      {
        id: 'solve',
        tab: '03 Solve',
        headline: 'This is what we actually solve.',
        caption: 'Illustrative example.',
        steps: [
          {
            caption: 'We find and fix every break.',
            highlight: 'intro',
          },
          {
            caption: 'A clear website with one action.',
            highlight: 'fix-website',
          },
          {
            caption: 'Call and quote buttons on every page.',
            highlight: 'fix-mobile',
          },
          {
            caption: 'Every missed call gets answered.',
            highlight: 'fix-afterhours',
          },
          {
            caption: 'Every enquiry is logged and confirmed.',
            highlight: 'fix-followup',
          },
          {
            caption: 'The customer reaches you every time.',
            highlight: 'finish',
          },
        ],
        pairs: [
          {
            problem: 'No website to click',
            fix: 'A clear website with one next step',
            requiresFlag: null,
          },
          {
            problem: 'Hard to contact on mobile',
            fix: 'Call and quote buttons on every page',
            requiresFlag: null,
          },
          {
            problem: 'Missed call after hours',
            fix: 'After-hours handling',
            requiresFlag: 'afterHours',
          },
          {
            problem: 'No follow-up',
            fix: 'Every enquiry confirmed and logged',
            requiresFlag: 'enquiryTracking',
          },
        ],
      },
      {
        id: 'build',
        tab: '04 Build',
        headline: 'We build a website made to catch enquiries.',
        caption: 'Illustrative example',
        steps: [
          {
            caption: 'We start with a fast blueprint.',
            highlight: 'blueprint',
          },
          {
            caption: 'Call button and headline always visible.',
            highlight: 'header',
          },
          {
            caption: 'Simple quote form for quick enquiries.',
            highlight: 'quote',
          },
          {
            caption: 'Every enquiry lands in your inbox.',
            highlight: 'inbox',
          },
        ],
      },
      {
        id: 'findable',
        tab: '05 Findable',
        headline: 'We make it easy for Google to understand you.',
        caption: 'Illustrative example',
        steps: [
          {
            caption: 'Google needs clear signals about you.',
            highlight: 'hub',
          },
          {
            caption: 'A verified Google Business Profile.',
            highlight: 'gbp',
          },
          {
            caption: 'Dedicated pages for each service area.',
            highlight: 'service-areas',
          },
          {
            caption: 'Fresh reviews from your happy customers.',
            highlight: 'reviews',
          },
        ],
      },
      {
        id: 'rank',
        tab: '06 Rank',
        headline: 'Ranking takes months, not days.',
        caption: 'Illustrative. Results vary and take time.',
        steps: [
          {
            caption: 'Local rankings build month by month.',
            highlight: 'start',
          },
          {
            caption: 'Over weeks, you start to appear.',
            highlight: 'month2',
          },
          {
            caption: 'Nobody guarantees rank. We stay honest.',
            highlight: 'honesty',
          },
        ],
      },
      {
        id: 'always-on',
        tab: '07 Always on',
        headline: 'Enquiries get handled around the clock.',
        caption: 'Illustrative example',
        steps: [
          {
            caption: 'A homeowner calls late at night.',
            highlight: 'incoming-call',
          },
          {
            caption: 'Our assistant answers and says so.',
            highlight: 'ai-intro',
          },
          {
            caption: 'It takes name, job, and postcode.',
            highlight: 'ai-dialog',
          },
          {
            caption: 'Every enquiry answered, even after hours.',
            highlight: 'inbox-urgent',
          },
        ],
      },
      {
        id: 'talk',
        tab: '08 Talk',
        headline: 'Want us to do this exact process with your business?',
        text: "Tell us your trade and your area, and we'll show you what your customers see today.",
        caption: 'Illustrative story. Search results vary and take time to build. We never promise rankings or a set number of enquiries.',
        steps: [
          {
            caption: 'Calls route, forms ping, quotes flow.',
            highlight: 'recap',
          },
          {
            caption: 'Ready to get more local work?',
            highlight: 'cta',
          },
        ],
      },
    ],
  },
};

export const CONFIG = config;
export default config;
