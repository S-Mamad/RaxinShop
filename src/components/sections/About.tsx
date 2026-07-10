"use client";

import site from "@/data/site.json";
import type { SiteConfig, TeamMember } from "@/types";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { TeamImage } from "@/components/ui/TeamImage";
import { TeamLinks } from "@/components/ui/TeamLinks";
import { useCopy } from "@/hooks/useCopy";

const data = site as SiteConfig;

function TeamCard({
  member,
  featured = false,
}: {
  member: TeamMember;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden bg-surface/30",
        featured ? "lg:row-span-2" : "",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-void",
          featured ? "aspect-[4/5] lg:aspect-auto lg:min-h-[520px]" : "aspect-[5/4]",
        )}
      >
        <TeamImage member={member} />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <p className="text-sm text-accent">{member.role}</p>
          <h3
            className={cn(
              "mt-2 font-display text-foreground",
              featured ? "text-3xl md:text-4xl" : "text-2xl",
            )}
          >
            {member.name}
          </h3>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <p className="max-w-prose text-[15px] leading-[1.9] text-muted">{member.bio}</p>
        <TeamLinks member={member} />
      </div>
    </article>
  );
}

export function About() {
  const copy = useCopy();
  const featured = data.team.find((m) => m.featured) ?? data.team[0];
  const others = data.team.filter((m) => m.id !== featured?.id);

  return (
    <section id="about" className="border-b border-border py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-16 max-w-2xl">
          <p className="label-mono mb-3 text-dim">{copy.about.eyebrow}</p>
          <h2 className="font-display text-[2rem] text-foreground md:text-[2.75rem]">
            {copy.about.title}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.85] text-muted md:text-base">
            {copy.about.description}
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:grid-rows-2">
          {featured ? (
            <Reveal className="lg:row-span-2">
              <TeamCard member={featured} featured />
            </Reveal>
          ) : null}
          {others.map((member, i) => (
            <Reveal key={member.id} delay={0.06 + i * 0.04}>
              <TeamCard member={member} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
