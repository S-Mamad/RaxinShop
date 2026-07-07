import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const data = site as SiteConfig;

export function WhyRaxin() {
  if (!data.whyPoints?.length) return null;

  return (
    <section id="why" className="relative -mt-8 border-b border-border py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-16">
          <SectionHeading
            eyebrow="چرا ما"
            title="چرا راکسین‌شاپ"
            description="سه مشکلی که مشتریان ما قبل از همکاری با ما داشتند."
          />
        </Reveal>

        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {data.whyPoints.map((point, index) => (
            <Reveal key={point.pain} delay={index * 0.05}>
              <article className="flex h-full flex-col bg-void p-8 transition-colors duration-500 hover:bg-surface md:p-10">
                <p className="telemetry mb-4 text-dim">
                  pain · 0{index + 1}
                </p>
                <h3 className="font-display text-lg text-foreground md:text-xl">
                  {point.pain}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-[1.9] text-muted md:text-[15px]">
                  {point.answer}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
