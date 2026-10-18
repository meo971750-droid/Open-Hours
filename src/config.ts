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
