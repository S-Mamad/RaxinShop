"use client";

import {
  Component,
  GitBranch,
  Layers,
  Monitor,
  Server,
  Zap,
  type LucideIcon,
} from "lucide-react";
import site from "@/data/site.json";
import type { ServiceItem, SiteConfig } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const data = site as SiteConfig;

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Server,
  Layers,
  Component,
  Zap,
  GitBranch,
};

export function Expertise() {
  return (
    <section id="expertise" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-14 md:mb-16">
          <SectionHeading
            eyebrow="خدمات"
            title="همه‌چیز برای ساخت محصول حرفه‌ای"
            description="از لایه کاربری تا زیرساخت؛ هر بخش با تخصص، استاندارد و تمرکز بر نتیجه نهایی."
          />
        </Reveal>

        <div className="grid auto-rows-fr gap-4 md:grid-cols-6">
          {data.services.map((service: ServiceItem, index) => {
            const Icon = iconMap[service.icon] ?? Layers;
            const isWide = service.span === "wide";

            return (
              <Reveal
                key={service.id}
                delay={index * 0.05}
                className={cn("md:col-span-2", isWide && "md:col-span-3")}
              >
                <article className="group flex h-full flex-col rounded-2xl border border-border bg-panel/50 p-7 transition-all duration-500 hover:border-border-bright hover:bg-panel md:p-8">
                  <Icon
                    className="mb-5 h-6 w-6 text-accent"
                    strokeWidth={1.25}
                  />
                  <h3 className="text-lg font-bold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-[1.9] text-muted">
                    {service.description}
                  </p>
                  {service.tags ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          dir="ltr"
                          className="rounded-md bg-elevated px-2.5 py-1 font-mono text-[10px] text-dim"
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
