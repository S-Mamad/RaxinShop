import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { Button } from "@asal/components/ui/Button";
import { Reveal } from "@asal/components/ui/Reveal";
import { ArrowLeft, Sparkles } from "lucide-react";

const siteData = site as SiteConfig;

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-brown-deep">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${siteData.hero.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brown-deep/60 via-brown-deep/40 to-cream" />
      <div className="mesh-amber absolute inset-0 opacity-60" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-end px-4 pb-20 pt-32 md:px-6 md:pb-28 md:pt-40">
        <Reveal className="max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-bright backdrop-blur-sm">
            <Sparkles size={12} strokeWidth={1.5} />
            عسل اصل ایرانی
          </span>
          <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
            {siteData.hero.title}
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
            {siteData.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={siteData.hero.ctaHref} size="lg" magnetic>
              {siteData.hero.cta}
              <ArrowLeft size={18} strokeWidth={1.5} />
            </Button>
            <Button
              href="/hajiasal#about"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              داستان ما
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-16 hidden gap-8 md:flex">
          {[
            { value: "۳۰+", label: "محصول متنوع" },
            { value: "۴.۹", label: "رضایت مشتری" },
            { value: "۳۵", label: "سال تجربه" },
          ].map((stat) => (
            <div key={stat.label} className="border-s border-white/20 ps-8 first:border-0 first:ps-0">
              <p className="text-2xl font-bold text-amber-bright">{stat.value}</p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
