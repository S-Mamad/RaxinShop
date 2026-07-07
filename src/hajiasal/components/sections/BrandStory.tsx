import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";

const siteData = site as SiteConfig;

export function BrandStory() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            title={siteData.brandStory.title}
            align="center"
            className="mx-auto mb-10"
          />
        </Reveal>
        <div className="flex flex-col gap-6">
          {siteData.brandStory.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <p className="text-center text-base leading-relaxed text-muted md:text-lg">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
