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
}

export interface AppConfig {
  studioName: string;
  legalName: string;
  companyAddress: string;
  bookingUrl: string;
  liveDemoUrl: string;
  features: AppFeaturesConfig;
  heroProof: HeroProofConfig;
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
};

export const CONFIG = config;
export default config;
