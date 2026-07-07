export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  index?: string;
  title: string;
  description: string;
  icon: string;
  span?: "wide" | "tall" | "default";
  tags?: string[];
  proof?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  href: string;
  gradient: [string, string];
  category: "web" | "saas" | "api" | "oss";
  tech: string[];
  image?: string;
  metrics?: string[];
  featured?: boolean;
  year?: string;
}

export interface TeamMemberLinks {
  github?: string;
  linkedin?: string;
  telegram?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imagePosition?: string;
  featured?: boolean;
  links?: TeamMemberLinks;
  initials?: string;
}

export interface LinkItem {
  id: string;
  label: string;
  href: string;
}

export interface ClientItem {
  name: string;
  href?: string;
}

export interface WhyPoint {
  pain: string;
  answer: string;
}

export interface HeroCta {
  primary: string;
  secondary: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  duration?: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    suffix: string;
    slug: string;
    version: string;
    tagline: string;
    description: string;
    heroTitle: string;
    heroHighlight: string;
  };
  nav: NavItem[];
  stack: string[];
  services: ServiceItem[];
  team: TeamMember[];
  links: LinkItem[];
  heroCta?: HeroCta;
  clients?: ClientItem[];
  whyPoints?: WhyPoint[];
}
