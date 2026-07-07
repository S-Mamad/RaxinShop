import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamImage } from "@/components/ui/TeamImage";
import { TeamLinks } from "@/components/ui/TeamLinks";

const data = site as SiteConfig;

export function About() {
  return (
    <section id="about" className="border-b border-border py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-16">
          <SectionHeading
            index="04"
            eyebrow="تیم"
            title="سازندگان"
            description="دو هم‌بنیان‌گذار. یکی کد و محصول، یکی برند و خروجی دیجیتال."
          />
        </Reveal>

        <div className="grid gap-6">
          {data.team.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.06}>
              <article className="overflow-hidden border border-border bg-surface/40">
                <div className="grid md:grid-cols-12">
                  <div className="relative aspect-[4/5] overflow-hidden bg-void md:col-span-5 md:aspect-auto md:min-h-[360px]">
                    <TeamImage member={member} />
                  </div>

                  <div className="flex flex-col justify-center border-t border-border p-8 md:col-span-7 md:border-t-0 md:border-s md:p-10 lg:p-12">
                    <p className="text-sm text-muted">{member.role}</p>
                    <h3 className="mt-3 font-display text-2xl text-foreground md:text-3xl">
                      {member.name}
                    </h3>
                    <p className="mt-5 max-w-prose text-[15px] leading-[1.9] text-muted">
                      {member.bio}
                    </p>
                    <TeamLinks member={member} />
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
