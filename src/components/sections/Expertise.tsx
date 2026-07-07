import site from "@/data/site.json";
import type { ServiceItem, SiteConfig } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

const data = site as SiteConfig;

export function Expertise() {
  return (
    <section id="expertise" className="py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-16">
          <SectionHeading
            index="01"
            eyebrow="تخصص"
            title="حوزه‌های کاری"
            description="چهار محور اصلی. هر کدام با استاندارد تولید."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {data.services.map((service: ServiceItem, index) => (
            <Reveal key={service.id} delay={index * 0.04}>
              <article className="flex h-full flex-col border border-border bg-surface/40 p-8 md:p-10">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <span className="label-mono text-dim">
                    {service.index ?? `0${index + 1}`}
                  </span>
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="font-display text-xl text-foreground md:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-[1.9] text-muted md:text-[15px]">
                  {service.description}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {service.proof ? (
                    <span className="label-mono text-muted">
                      نمونه · {service.proof}
                    </span>
                  ) : null}
                  {service.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      dir="ltr"
                      className="border border-border px-2 py-0.5 font-mono text-[10px] text-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
