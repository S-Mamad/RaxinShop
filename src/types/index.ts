export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  span?: "wide" | "tall" | "default";
  tags?: string[];
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
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  featured?: boolean;
}

export interface LinkItem {
  id: string;
  label: string;
  href: string;
}

export interface StackCategory {
  id: string;
  title: string;
  items: string[];
}

export interface LabItem {
  id: string;
  title: string;
  description: string;
  index: string;
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
  stats: StatItem[];
  services: ServiceItem[];
  process: ProcessStep[];
  stackCategories: StackCategory[];
  lab: LabItem[];
  team: TeamMember[];
  links: LinkItem[];
}
