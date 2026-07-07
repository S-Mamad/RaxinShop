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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imagePosition?: string;
  featured?: boolean;
}

export interface LinkItem {
  id: string;
  label: string;
  href: string;
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
}
