/** A field that can be either a plain string or a localized dictionary { en: '...', ko: '...', ja: '...' } */
export type LocalizedString = string | Record<string, string>;

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  cardRadius: string; // e.g., '12px', '16px', etc.
  enableGlow: boolean;
  enableAnimations: boolean;
  darkMode: boolean;
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
  category: 'Frontend' | 'Backend' | 'Design' | 'Other';
}

export interface Experience {
  id: string;
  year: string;
  role: LocalizedString;
  company: string;
  description: LocalizedString;
}

export interface HeroData {
  name: LocalizedString;
  subtitle: string;
  description: LocalizedString;
  avatar: string; // base64 or URL
  heroBg: string; // base64 or URL
}

export interface AboutData {
  bio: LocalizedString;
  skills: Skill[];
  experience: Experience[];
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  username?: string;
  icon?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ServiceItem {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  iconName: string; // Name of Lucide or React Icon
  iconColor: string; // Hex color for the icon outline
}

export interface ProjectItem {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string; // base64 or URL
  liveLink: string;
  githubLink: string;
  tags: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  avatar: string; // base64 or placeholder
  rating: number; // 1-5
  comment: LocalizedString;
}

export interface FeedbackSubmission {
  id: string;
  name: string;
  email?: string;
  rating: number;
  message: string;
  timestamp: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  favicon?: string;
}

export interface BrandLogo {
  logoText: LocalizedString;
  logoImage?: string;
  brandName: LocalizedString;
}

export interface AppData {
  hero: HeroData;
  logo?: BrandLogo;
  about: AboutData;
  socials: SocialLink[];
  services: ServiceItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  seo: SeoSettings;
}
