"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GithubLogo, LinkedinLogo, TelegramLogo } from "@phosphor-icons/react";
import site from "@/data/site.json";
import type { SiteConfig, TeamMember } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const data = site as SiteConfig;

function TeamImage({ member }: { member: TeamMember }) {
  const [failed, setFailed] = useState(false);

  if (failed && !member.image.endsWith(".svg")) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-void">
        <span className="font-display text-5xl text-accent/40">
          {member.initials ?? member.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={member.image}
      alt={member.name}
      fill
      className="object-cover"
      style={{ objectPosition: member.imagePosition ?? "center center" }}
      sizes="(max-width: 768px) 100vw, 42vw"
      priority={member.featured}
      onError={() => setFailed(true)}
    />
  );
}

function TeamLinks({ member }: { member: TeamMember }) {
  const links = member.links;
  if (!links) return null;

  const items = [
    links.telegram
      ? { href: links.telegram, icon: TelegramLogo, label: "تلگرام" }
      : null,
    links.github
      ? { href: links.github, icon: GithubLogo, label: "گیت‌هاب" }
      : null,
    links.linkedin
      ? { href: links.linkedin, icon: LinkedinLogo, label: "لینکدین" }
      : null,
  ].filter(Boolean) as {
    href: string;
    icon: typeof TelegramLogo;
    label: string;
  }[];

  if (!items.length) return null;

  return (
    <div className="mt-6 flex gap-3">
      {items.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          <Icon className="h-4 w-4" weight="bold" />
        </Link>
      ))}
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="border-b border-border bg-surface/40 py-32 md:py-40">
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
            <Reveal key={member.id} delay={i * 0.08}>
              <article
                className={cn(
                  "bezel overflow-hidden",
                  member.featured && "ring-1 ring-accent/15",
                )}
              >
                <div className="bezel-inner grid md:grid-cols-12">
                  <div
                    className={cn(
                      "relative overflow-hidden bg-void md:col-span-5",
                      member.featured
                        ? "aspect-[3/4] md:aspect-auto md:min-h-[420px]"
                        : "aspect-[4/5] md:aspect-auto md:min-h-[360px]",
                    )}
                  >
                    <TeamImage member={member} />
                  </div>

                  <div className="flex flex-col justify-center border-t border-border p-8 md:col-span-7 md:border-t-0 md:border-s md:p-10 lg:p-12">
                    <p className="telemetry text-dim">{member.role}</p>
                    <h3 className="mt-3 font-display text-2xl text-foreground md:text-3xl">
                      {member.name}
                    </h3>
                    <p className="mt-5 max-w-prose text-[15px] leading-[1.9] text-muted">
                      {member.bio}
                    </p>
                    <TeamLinks member={member} />
                    <p className="telemetry mt-8 text-dim">
                      founder · {member.id} · active
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
