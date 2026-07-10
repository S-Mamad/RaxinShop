import Image from "next/image";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { Button } from "@asal/components/ui/Button";
import { hajiasalPath } from "@asal/lib/paths";

const siteData = site as SiteConfig;

export function BrandStory() {
  return (
    <section id="about" className="bg-void py-12 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:grid-cols-2 md:gap-14 md:px-8">
        <Reveal>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl md:aspect-[4/5]">
            <Image
              src="/images/hajiasal/about/workshop.webp"
              alt="کارگاه و بسته‌بندی عسل حاجی عسل"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <SectionHeading
              title={siteData.brandStory.title}
              className="mb-5 md:mb-8"
            />
          </Reveal>
          <div className="flex flex-col gap-4 md:gap-5">
            {siteData.brandStory.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-sm leading-relaxed text-secondary md:text-base">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.25} className="mt-7 md:mt-8">
            <Button
              href={hajiasalPath("/about")}
              variant="outline"
              className="w-full sm:w-auto"
            >
              بیشتر درباره ما
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
