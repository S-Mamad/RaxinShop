"use client";

import { useSiteSettings } from "@asal/context/SiteSettingsContext";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { ProductImage } from "@asal/components/ui/ProductImage";

export function BrandStory() {
  const siteData = useSiteSettings();
  const storyImage = siteData.gallery?.[0];

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal className="mb-12">
          <SectionHeading
            title={siteData.brandStory.title}
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream-dark">
              {storyImage ? (
                <ProductImage
                  src={storyImage.src}
                  alt={storyImage.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4 text-muted">
              {siteData.brandStory.paragraphs.map((paragraph, i) => (
                <p key={i} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
