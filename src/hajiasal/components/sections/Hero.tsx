import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { Button } from "@asal/components/ui/Button";
import { Reveal } from "@asal/components/ui/Reveal";
import { hajiasalPath } from "@asal/lib/paths";
import { ArrowLeft, Sparkles } from "lucide-react";

const siteData = site as SiteConfig;

const stats = [
  { value: "۳۰+", label: "محصول" },
  { value: "۴.۹", label: "رضایت" },
  { value: "۳۵", label: "سال تجربه" },
];

function limitWords(text: string, max: number): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= max) return text;
  return words.slice(0, max).join(" ");
}

export function Hero() {
  const subtitle = limitWords(siteData.hero.subtitle, 20);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-brown-deep">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${siteData.hero.image})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brown-deep/60 via-brown-deep/40 to-cream" />
      <div className="mesh-amber absolute inset-0 opacity-60" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-between px-4 pb-6 pt-28 md:justify-end md:px-6 md:pb-28 md:pt-40">
        <Reveal className="max-w-2xl md:mb-0">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-bright backdrop-blur-sm">
            <Sparkles size={12} strokeWidth={1.5} aria-hidden />
            عسل اصل ایرانی
          </span>
          <h1 className="mb-5 line-clamp-2 text-4xl font-bold leading-[1.08] tracking-tight text-white text-balance md:text-6xl lg:text-7xl">
            {siteData.hero.title}
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={hajiasalPath(siteData.hero.ctaHref)} size="lg" magnetic>
              {siteData.hero.cta}
              <ArrowLeft size={18} strokeWidth={1.5} aria-hidden />
            </Button>
            <Button
              href={hajiasalPath("/about")}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              داستان ما
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-6 md:mt-16">
          <div
            className="grid grid-cols-3 gap-0 rounded-2xl border border-white/15 bg-white/5 px-2 py-2.5 backdrop-blur-sm sm:inline-flex sm:grid-cols-none sm:gap-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none"
            aria-label="آمار فروشگاه"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`min-w-0 text-center sm:text-start ${
                  i > 0 ? "border-s border-white/20 sm:ps-6 md:ps-8" : ""
                }`}
              >
                <p className="text-sm font-bold tabular-nums text-amber-bright sm:text-lg md:text-2xl">
                  {stat.value}
                </p>
                <p className="truncate text-[10px] text-white/60 sm:text-xs md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
