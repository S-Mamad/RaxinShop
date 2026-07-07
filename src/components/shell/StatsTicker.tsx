import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Marquee } from "./Marquee";

const data = site as SiteConfig;

export function StatsTicker() {
  const items = (
    <div className="flex gap-10">
      {data.stats.map((stat) => (
        <div key={stat.label} className="flex shrink-0 items-center gap-4">
          <span className="font-mono text-2xl font-bold text-accent md:text-3xl">
            {stat.value}
          </span>
          <span className="text-sm text-muted">{stat.label}</span>
          <span className="font-mono text-dim">·</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="border-y border-border bg-surface/40 py-5">
      <Marquee speed="slow">{items}</Marquee>
    </div>
  );
}
