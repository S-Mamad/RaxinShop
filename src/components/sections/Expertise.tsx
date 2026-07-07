import site from "@/data/site.json";
import type { ServiceItem, SiteConfig } from "@/types";
import { cn } from "@/lib/utils";
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
            description="چهار محور اصلی. هر کدام با استاندارد تولید و نمونه واقعی."
          />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {data.services.map((service: ServiceItem, index) => {
            const isWide = service.span === "wide";
            return (
              <Reveal
                key={service.id}
                delay={index * 0.04}
                className={cn(isWide && "md:col-span-2")}
              >
                <article
                  className={cn(
                    "group flex h-full flex-col border border-border bg-surface/50 p-8 transition-colors duration-300 hover:border-accent/20 md:p-10",
                    isWide && "md:flex-row md:items-start md:gap-10",
                  )}
                >
                  <div
                    className={cn(
                      "mb-6 flex items-start justify-between gap-4",
                      isWide && "md:mb-0 md:shrink-0 md:flex-col md:items-start",
                    )}
                  >
                    <span className="label-mono text-dim">
                      {service.index ?? `0${index + 1}`}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center border border-border-bright bg-elevated text-accent transition-colors group-hover:border-accent/30">
                      <ServiceIcon name={service.icon} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-display text-xl text-foreground md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mt-4 flex-1 text-sm leading-[1.9] text-muted md:text-[15px]">
                      {service.description}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      {service.proof ? (
                        <span className="label-mono text-accent/80">
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
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
