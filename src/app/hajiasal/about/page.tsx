import type { Metadata } from "next";
import Image from "next/image";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { hajiasalPath } from "@asal/lib/paths";

const siteData = site as SiteConfig;

export const metadata: Metadata = {
  title: "درباره ما",
  description: siteData.brand.description,
  alternates: { canonical: hajiasalPath("/about") },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 md:px-6 md:py-32">
      <Reveal>
        <SectionHeading
          title={siteData.brand.name}
          subtitle={siteData.brand.tagline}
          className="mb-10"
        />
      </Reveal>

      <div className="mb-16 flex flex-col gap-6">
        {siteData.brandStory.paragraphs.map((p, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <p className="text-base leading-relaxed text-muted md:text-lg">{p}</p>
          </Reveal>
        ))}
      </div>

      {siteData.milestones.length > 0 ? (
        <section className="mb-16">
          <Reveal>
            <h2 className="mb-8 text-2xl font-bold text-brown">مسیر ما</h2>
          </Reveal>
          <ol className="relative flex flex-col gap-6 border-s border-border ps-6">
            {siteData.milestones.map((milestone, i) => (
              <Reveal key={milestone.year} delay={i * 0.08}>
                <li className="relative">
                  <span
                    className="absolute -start-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-amber bg-surface"
                    aria-hidden
                  />
                  <p className="mb-1 text-sm font-bold text-amber">{milestone.year}</p>
                  <h3 className="mb-1 font-semibold text-brown">{milestone.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{milestone.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      ) : null}

      {siteData.values && siteData.values.length > 0 ? (
        <section className="mb-16">
          <Reveal>
            <h2 className="mb-8 text-2xl font-bold text-brown">ارزش‌های ما</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {siteData.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.08}>
                <article className="rounded-2xl border border-border bg-surface p-6">
                  <h3 className="mb-2 text-lg font-semibold text-brown">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{value.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {siteData.team && siteData.team.length > 0 ? (
        <section className="mb-16">
          <Reveal>
            <h2 className="mb-8 text-2xl font-bold text-brown">تیم ما</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {siteData.team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <article className="overflow-hidden rounded-2xl border border-border bg-surface">
                  {member.image ? (
                    <div className="relative aspect-[4/3] bg-cream">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <h3 className="font-semibold text-brown">{member.name}</h3>
                    <p className="mb-2 text-sm text-amber">{member.role}</p>
                    <p className="text-sm leading-relaxed text-muted">{member.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {siteData.gallery && siteData.gallery.length > 0 ? (
        <section>
          <Reveal>
            <h2 className="mb-8 text-2xl font-bold text-brown">گالری</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {siteData.gallery.map((image, i) => (
              <Reveal key={image.src} delay={i * 0.06}>
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-cream">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
