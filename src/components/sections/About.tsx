import Image from "next/image";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const data = site as SiteConfig;

export function About() {
  return (
    <section id="about" className="border-y border-border bg-surface/30 py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-14">
          <SectionHeading
            eyebrow="فرآیند"
            title="مسیر همکاری با ما"
            description="از جلسه اول تا تحویل نهایی؛ شفاف، منظم و قابل پیش‌بینی."
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {data.process.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08}>
              <article className="h-full rounded-2xl border border-border bg-panel/60 p-8">
                <span className="font-display text-3xl text-accent/30">
                  {step.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.9] text-muted">
                  {step.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24 mb-14">
          <SectionHeading
            eyebrow="تیم"
            title="دو نفر، یک برند"
            description="راکسین‌شاپ با همکاری محمد و امیر شکل گرفته؛ یکی از سمت محصول و کد، دیگری از سمت برند و خدمات دیجیتال."
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {data.team.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.1}>
              <article
                className={cn(
                  "group overflow-hidden rounded-2xl border border-border bg-panel/60 transition-colors duration-500 hover:border-border-bright",
                  member.featured && "ring-1 ring-accent/10",
                )}
              >
                <div
                  className={cn(
                    "grid",
                    member.featured
                      ? "md:grid-cols-5"
                      : "md:grid-cols-5",
                  )}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden md:col-span-2",
                      member.featured
                        ? "aspect-[3/4] md:aspect-auto md:min-h-[320px]"
                        : "aspect-[4/3] md:aspect-auto md:min-h-[260px]",
                    )}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className={cn(
                        "object-cover transition-transform duration-700 group-hover:scale-[1.03]",
                        member.featured
                          ? "object-[center_18%] scale-105"
                          : "object-top",
                      )}
                      sizes="(max-width: 768px) 100vw, 40vw"
                      priority={member.featured}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent md:bg-gradient-to-l md:from-panel md:via-panel/30 md:to-transparent" />
                    {member.featured ? (
                      <div className="absolute start-4 top-4 rounded-full border border-accent/30 bg-void/60 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm">
                        هم‌بنیان‌گذار
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col justify-center p-7 md:col-span-3 md:p-8">
                    <h3 className="text-xl font-bold text-foreground md:text-2xl">
                      {member.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-accent">
                      {member.role}
                    </p>
                    <p className="mt-4 text-sm leading-[1.9] text-muted">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
