import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const data = site as SiteConfig;

export function Lab() {
  return (
    <section id="lab" className="border-y border-border bg-surface/40 py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-14">
          <SectionHeading
            eyebrow="استانداردهای ما"
            title="کیفیتی که قابل اتکا است"
            description="هر پروژه با همین اصول جلو می‌رود؛ شفاف، قابل اندازه‌گیری و بدون مصالحه با جزئیات."
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {data.lab.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <article className="h-full rounded-2xl border border-border bg-panel/60 p-8 transition-colors duration-500 hover:border-border-bright hover:bg-panel">
                <span className="font-display text-3xl text-accent/30">
                  {item.index}
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.9] text-muted">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
