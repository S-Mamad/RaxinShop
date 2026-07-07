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

        <div className="grid gap-6 lg:grid-cols-2">
          {data.team.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.06}>
              <article className="group overflow-hidden border border-border bg-surface/50 transition-colors duration-300 hover:border-accent/20">
                <div className="relative aspect-[5/4] overflow-hidden bg-void">
                  <TeamImage member={member} />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
                    <p className="text-sm text-accent">{member.role}</p>
                    <h3 className="mt-2 font-display text-2xl text-foreground md:text-3xl">
                      {member.name}
                    </h3>
                  </div>
                </div>

                <div className="border-t border-border p-6 md:p-8">
                  <p className="max-w-prose text-[15px] leading-[1.9] text-muted">
                    {member.bio}
                  </p>
                  <TeamLinks member={member} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
