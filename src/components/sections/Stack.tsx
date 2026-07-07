import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Marquee } from "@/components/shell/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const data = site as SiteConfig;

export function Stack() {
  const allTech = data.stackCategories.flatMap((c) => c.items);

  return (
    <section id="stack" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-14">
          <SectionHeading
            eyebrow="فناوری"
            title="ابزارهایی که به آن‌ها تکیه می‌کنیم"
            description="استک مدرن و آزموده‌شده برای ساخت محصولات قابل اتکا و قابل توسعه."
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {data.stackCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.08}>
              <article className="rounded-2xl border border-border bg-panel/60 p-7">
                <h3 className="mb-5 text-sm font-bold text-accent">
                  {cat.title}
                </h3>
                <ul className="space-y-3">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      dir="ltr"
                      className="flex items-center gap-3 font-mono text-sm text-muted"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <Marquee speed="slow">
            <div className="flex gap-4">
              {allTech.map((tech) => (
                <span
                  key={tech}
                  dir="ltr"
                  className="shrink-0 rounded-xl border border-border bg-elevated px-6 py-3 font-mono text-sm text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Marquee>
        </Reveal>
      </div>
    </section>
  );
}
