"use client";

import {
  Component,
  Layers,
  Monitor,
  Server,
  type LucideIcon,
} from "lucide-react";
import site from "@/data/site.json";
import type { ServiceItem, SiteConfig } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const data = site as SiteConfig;

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Server,
  Layers,
  Component,
};

export function Expertise() {
  return (
    <section id="expertise" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-16">
          <SectionHeading
            index="01"
            eyebrow="تخصص"
            title="حوزه‌های کاری"
            description="چهار محور اصلی. هر کدام با استاندارد production."
          />
        </Reveal>

        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          {data.services.map((service: ServiceItem, index) => {
            const Icon = iconMap[service.icon] ?? Layers;

            return (
              <Reveal key={service.id} delay={index * 0.05}>
                <article className="group flex h-full flex-col bg-void p-8 transition-colors duration-500 hover:bg-surface md:p-10">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <span className="telemetry text-dim">
                      {service.index ?? `0${index + 1}`}
                    </span>
                    <Icon
                      className="h-5 w-5 text-accent opacity-70"
                      strokeWidth={1.25}
                    />
                  </div>
                  <h3 className="font-display text-xl text-foreground md:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-[1.9] text-muted md:text-[15px]">
                    {service.description}
                  </p>
                  {service.tags ? (
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          dir="ltr"
                          className="border border-border px-2 py-0.5 font-mono text-[10px] text-dim"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
