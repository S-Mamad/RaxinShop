import Image from "next/image";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const data = site as SiteConfig;

export function About() {
  return (
    <section id="about" className="border-b border-border bg-surface/40 py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-16">
          <SectionHeading
            index="03"
            eyebrow="تیم"
            title="سازندگان"
            description="دو هم‌بنیان‌گذار. یکی کد و محصول، یکی برند و خروجی دیجیتال."
          />
        </Reveal>

        <div className="grid gap-6">
          {data.team.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.08}>
              <article
                className={cn(
                  "bezel overflow-hidden",
                  member.featured && "ring-1 ring-accent/15",
                )}
              >
                <div
                  className={cn(
                    "bezel-inner grid md:grid-cols-12",
                    member.featured ? "min-h-0" : "",
                  )}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden bg-void md:col-span-5",
                      member.featured
                        ? "aspect-[3/4] md:aspect-auto md:min-h-[420px]"
                        : "aspect-[4/5] md:aspect-auto md:min-h-[360px]",
                    )}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      style={{
                        objectPosition:
                          member.imagePosition ?? "center center",
                      }}
                      sizes="(max-width: 768px) 100vw, 42vw"
                      priority={member.featured}
                    />
                    {member.featured ? (
                      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-accent/10" />
                    ) : null}
                  </div>

                  <div className="flex flex-col justify-center border-t border-border p-8 md:col-span-7 md:border-t-0 md:border-s md:p-10 lg:p-12">
                    <p className="telemetry text-dim">{member.role}</p>
                    <h3 className="mt-3 font-display text-2xl text-foreground md:text-3xl">
                      {member.name}
                    </h3>
                    <p className="mt-5 max-w-lg text-[15px] leading-[1.9] text-muted">
                      {member.bio}
                    </p>
                    {member.featured ? (
                      <p className="telemetry mt-8 text-dim">
                        unit / founder-01 · status: active
                      </p>
                    ) : null}
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
