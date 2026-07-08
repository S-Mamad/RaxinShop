import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLeft, Sparkles } from "lucide-react";

const siteData = site as SiteConfig;

export function Hero() {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-void">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${siteData.hero.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/70 to-void" />
      <div className="mesh-warm absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col justify-end px-4 pb-20 pt-12 md:px-8 md:pb-28">
        <Reveal className="max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium tracking-[0.15em] text-gold backdrop-blur-sm">
            <Sparkles size={12} strokeWidth={1.5} />
            عسل اصل ایرانی
          </span>
          <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-primary md:text-6xl">
            {siteData.hero.title}
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-secondary md:text-lg">
            {siteData.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={siteData.hero.ctaHref} size="lg" magnetic>
              {siteData.hero.cta}
              <ArrowLeft size={18} strokeWidth={1.5} />
            </Button>
            <Button
              href="/#about"
              variant="outline"
              size="lg"
              className="border-white/20 text-primary hover:border-gold/50"
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
            <div
              key={stat.label}
              className="border-s border-white/10 ps-8 first:border-0 first:ps-0"
            >
              <p className="text-2xl font-bold text-gold">{stat.value}</p>
              <p className="text-sm text-dim">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
