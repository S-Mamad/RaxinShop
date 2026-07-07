import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import {
  ChartLineUp,
  PuzzlePiece,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const data = site as SiteConfig;
const persianIndex = ["۰۱", "۰۲", "۰۳"];
const icons = [ShieldCheck, PuzzlePiece, ChartLineUp];

export function WhyRaxin() {
  if (!data.whyPoints?.length) return null;

  return (
    <section id="why" className="border-b border-border py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-16">
          <SectionHeading
            eyebrow="چرا ما"
            title="چرا راکسین‌شاپ"
            description="سه مشکلی که قبل از همکاری، بارها شنیده‌ایم."
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {data.whyPoints.map((point, index) => {
            const Icon = icons[index] ?? ShieldCheck;
            return (
              <Reveal key={point.pain} delay={index * 0.05}>
                <article className="group relative flex h-full flex-col overflow-hidden border border-border bg-surface/60 p-8 transition-colors duration-300 hover:border-accent/25 md:p-10">
                  <div
                    className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-accent/5 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="label-mono text-dim">
                      {persianIndex[index]} · مشکل
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center border border-border-bright bg-elevated text-accent">
                      <Icon className="h-5 w-5" weight="duotone" />
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-foreground md:text-xl">
                    {point.pain}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-[1.9] text-muted md:text-[15px]">
                    {point.answer}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
