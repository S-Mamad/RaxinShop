"use client";

import { ShieldCheck, Truck, Headset } from "@phosphor-icons/react";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { Reveal } from "@asal/components/ui/Reveal";

const siteData = site as SiteConfig;

const icons = {
  authentic: ShieldCheck,
  shipping: Truck,
  support: Headset,
};

export function TrustBar() {
  return (
    <section className="border-y border-white/5 bg-surface py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0">
          {siteData.trustItems.map((item, i) => {
            const Icon = icons[item.id as keyof typeof icons] ?? ShieldCheck;
            return (
              <Reveal key={item.id} delay={i * 0.08} className="min-w-[220px] shrink-0 md:min-w-0">
                <div className="flex items-center gap-3 md:flex-col md:items-center md:text-center">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-dim md:mb-3 md:h-12 md:w-12">
                    <Icon size={22} weight="light" className="text-gold" />
                  </div>
                  <div>
                    <h3 className="mb-0.5 text-sm font-semibold text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs text-secondary md:text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
