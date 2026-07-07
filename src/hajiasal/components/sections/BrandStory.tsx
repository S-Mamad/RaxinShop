import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { ProductImage } from "@asal/components/ui/ProductImage";

const siteData = site as SiteConfig;
const storyImage = siteData.gallery?.[0];

export function BrandStory() {
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

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            {storyImage ? (
              <Reveal>
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border shadow-md">
                  <ProductImage
                    src={storyImage.src}
                    alt={storyImage.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown/40 to-transparent" />
                </div>
              </Reveal>
            ) : null}

            {siteData.brandStory.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p
                  className={
                    i === 0
                      ? "text-lg font-medium leading-relaxed text-brown md:text-xl"
                      : "text-base leading-relaxed text-muted md:text-lg"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-md md:p-8 lg:sticky lg:top-28">
              <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-amber">
                خط زمانی
              </p>
              <div className="relative">
                <div
                  className="absolute start-4 top-2 bottom-2 w-px bg-border md:start-5"
                  aria-hidden
                />
                <ol className="flex flex-col gap-8">
                  {siteData.milestones.map((milestone, i) => (
                    <li key={milestone.year} className="relative ps-12 md:ps-14">
                      <span
                        className="absolute start-0 top-0.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-amber bg-cream text-xs font-bold text-amber md:h-10 md:w-10"
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <p className="mb-1 text-sm font-bold tabular-nums text-amber">
                        {milestone.year}
                      </p>
                      <h3 className="mb-1 text-base font-semibold text-brown">
                        {milestone.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted">
                        {milestone.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
