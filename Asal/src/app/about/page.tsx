import type { Metadata } from "next";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const siteData = site as SiteConfig;

export const metadata: Metadata = {
  title: "درباره ما",
  description: siteData.brand.description,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 md:px-6 md:py-32">
      <Reveal>
        <SectionHeading
          title={siteData.brand.name}
          subtitle={siteData.brand.tagline}
          className="mb-10"
        />
      </Reveal>
      <div className="flex flex-col gap-6">
        {siteData.brandStory.paragraphs.map((p, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <p className="text-base leading-relaxed text-muted md:text-lg">{p}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
