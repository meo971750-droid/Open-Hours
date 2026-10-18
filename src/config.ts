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
}

export interface FrictionPair {
  problem: string;
  fix: string;
  requiresFlag: string | null;
}

export interface WayOfWorkingScene {
  id: string;
  tab: string;
  headline: string;
  text: string;
  caption: string;
  pairs?: FrictionPair[];
}

export interface WayOfWorkingPace {
  scrollPerSceneVh: number;
  rankSceneVh: number;
  solveSceneVh: number;
  ctaSceneVh: number;
  durationScale: number;
  stagger: number;
}

export interface WayOfWorkingConfig {
  title: string;
  studioVoice: 'we';
  ctaHeadline: string;
  ctaText: string;
  voiceAgentTag: string;
  sampleTown: string;
  sampleTrade: string;
  pace: WayOfWorkingPace;
  scenes: WayOfWorkingScene[];
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
}

export const config: AppConfig = {
  studioName: 'Open Hours',
  legalName: 'Open Hours Studio',
  companyAddress: '',
  bookingUrl: '',
  liveDemoUrl: '',
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
  },
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
    pace: {
      scrollPerSceneVh: 200,
      rankSceneVh: 260,
      solveSceneVh: 220,
      ctaSceneVh: 120,
      durationScale: 1.8,
      stagger: 260,
    },
    scenes: [
      {
        id: 'searches',
        tab: '01 Searches',
        headline: "People are searching. Your business isn't showing.",
        text: 'Local homeowners search Google Maps for your trade and choose from what they see.',
        caption: 'Illustrative example',
      },
      {
        id: 'journey',
        tab: '02 Journey',
        headline: 'First, we map your customer journey and find where it breaks.',
        text: 'From the first search to the booked job: where do people drop off?',
        caption: 'Illustrative example',
      },
      {
        id: 'solve',
        tab: '03 Solve',
        headline: 'This is what we actually solve.',
        text: 'We find the exact points where your customers drop off, then fix those points one by one.',
        caption: 'Illustrative example.',
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
        headline: 'Then we build a website made to catch enquiries.',
        text: 'Built around that journey, so every visitor has an obvious next step.',
        caption: 'Illustrative example',
      },
      {
        id: 'findable',
        tab: '05 Findable',
        headline: 'Then we make it easy for Google to understand.',
        text: "Local SEO means helping Google see who you are, where you work and that you're real.",
        caption: 'Illustrative example',
      },
      {
        id: 'rank',
        tab: '06 Rank',
        headline: 'Ranking takes months, not days.',
        text: 'Local results build slowly and nobody can promise a position. We do the groundwork and we never promise a ranking.',
        caption: 'Illustrative. Results vary and take time.',
      },
      {
        id: 'always-on',
        tab: '07 Always on',
        headline: 'Then your enquiries are handled around the clock.',
        text: 'After hours, calls are answered, and enquiries are logged and followed up automatically.',
        caption: 'Illustrative example',
      },
      {
        id: 'talk',
        tab: '08 Talk',
        headline: 'Want us to do this exact process with your business?',
        text: "Tell us your trade and your area, and we'll show you what your customers see today.",
        caption: 'Illustrative story. Search results vary and take time to build. We never promise rankings or a set number of enquiries.',
      },
    ],
  },
};

export const CONFIG = config;
export default config;
