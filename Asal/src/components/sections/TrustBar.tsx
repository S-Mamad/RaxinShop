import { Shield, Truck, Headphones } from "lucide-react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Reveal } from "@/components/ui/Reveal";

const siteData = site as SiteConfig;

const icons = {
  authentic: Shield,
  shipping: Truck,
  support: Headphones,
};

export function TrustBar() {
  return (
    <section className="border-y border-white/5 bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {siteData.trustItems.map((item, i) => {
            const Icon = icons[item.id as keyof typeof icons] ?? Shield;
            return (
              <Reveal key={item.id} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-dim">
                    <Icon size={22} strokeWidth={1.5} className="text-gold" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-secondary">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
