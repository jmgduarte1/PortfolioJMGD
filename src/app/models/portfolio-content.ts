export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  summary: string;
  heroImage: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface Cta {
  label: string;
  href: string;
}

export interface Hero {
  eyebrow: string;
  headline: string;
  subtitle: string;
  intro: string;
  primaryCta: Cta;
  secondaryCta: Cta;
}

export interface About {
  title: string;
  body: string;
  highlights: string[];
}

export interface ExpertiseArea {
  title: string;
  summary: string;
  tags?: string[];
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string;
  impact: string;
  tags: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
  location: string;
  summary: string;
  bullets: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  issued: string;
  url: string;
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: string;
}

export interface PortfolioContent {
  profile: Profile;
  navigation: NavigationItem[];
  hero: Hero;
  about: About;
  expertiseAreas: ExpertiseArea[];
  skills: string[];
  skillGroups: SkillGroup[];
  projects: Project[];
  experience: ExperienceItem[];
  certifications: Certification[];
  seo: SeoContent;
}
