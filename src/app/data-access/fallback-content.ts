import { PortfolioContent } from '../models/portfolio-content';

export const fallbackContent: PortfolioContent = {
  profile: {
    name: 'Juan Manuel Gomez',
    role: 'Senior Frontend / Full-stack Developer',
    location: 'London, Ontario, Canada',
    email: 'configured-in-email-middleware@example.com',
    linkedin: 'https://www.linkedin.com/in/juan-manuel-gomez-duarte',
    summary:
      'Frontend / Full-stack Developer with 10+ years of experience building web applications, eCommerce platforms, and business systems.',
    heroImage: '/assets/hero-placeholder.png',
  },
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Expertise', href: '/#expertise' },
    { label: 'Projects', href: '/projects' },
    { label: 'Experience', href: '/experience' },
    { label: 'Certifications', href: '/certifications' },
    { label: 'Contact', href: '/#contact' },
  ],
  hero: {
    eyebrow: 'Senior Frontend Engineering | Enterprise Commerce | Angular-ready Architecture',
    headline: 'Juan Manuel Gomez',
    subtitle: 'Senior Frontend / Full-stack Developer',
    intro:
      'I build accessible, maintainable, API-driven web experiences for enterprise commerce and business platforms.',
    primaryCta: { label: 'Contact Me', href: '/#contact' },
    secondaryCta: { label: 'View Projects', href: '/projects' },
  },
  about: {
    title: 'Senior frontend experience with modern framework momentum',
    body:
      'My strongest professional foundation is enterprise frontend delivery, supported by current Angular and React preparation.',
    highlights: [
      '10+ years of web and software development experience.',
      'Technical Lead experience across planning, code reviews, debugging, and delivery.',
      'Professional eCommerce work across Adobe Commerce / Magento, BigCommerce, Salesforce, and integrations.',
      'Current Angular and React preparation backed by certifications and hands-on projects.',
    ],
  },
  expertiseAreas: [
    {
      title: 'Frontend Architecture',
      summary: 'Reusable components, responsive layouts, accessible UI patterns, and maintainable TypeScript code.',
    },
    {
      title: 'Adobe Commerce / Magento 2',
      summary: 'Frontend customization across PDP, cart, checkout, KnockoutJS, templates, modules, and APIs.',
    },
    {
      title: 'Salesforce Development',
      summary: 'LWC, Apex-supported UI, Experience Builder, OMS/OCI workflows, and carrier integrations.',
    },
    {
      title: 'Modern Angular And React',
      summary: 'Current hands-on training and project work with Angular, Angular Material, and React.',
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'Angular', 'React', 'Adobe Commerce', 'Magento 2', 'Salesforce'],
  projects: [],
  experience: [],
  certifications: [],
  seo: {
    title: 'Juan Manuel Gomez Duarte | Senior Frontend / Full-stack Developer',
    description:
      'Senior Frontend / Full-stack Developer specializing in enterprise frontend, Angular, TypeScript, Adobe Commerce, Magento 2, Salesforce, and API-driven web applications.',
    keywords: 'Senior Frontend Developer, Angular, TypeScript, Magento 2, Salesforce',
  },
};
