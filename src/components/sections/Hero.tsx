import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { HeroShowcase } from "@/components/sections/HeroShowcase";
import { SocialProof } from "@/components/sections/SocialProof";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const data = site as SiteConfig;

export function Hero() {
  const primaryCta = data.heroCta?.primary ?? "شروع پروژه";
  const secondaryCta = data.heroCta?.secondary ?? "نمونه‌کارها";

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] items-center overflow-hidden border-b border-border pt-28 pb-20 md:pb-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 85% 15%, rgba(45,212,191,0.09), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(45,212,191,0.04), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="text-center lg:text-start">
            <p className="label-mono mb-6">
              {data.brand.name}
              {data.brand.suffix} · {data.brand.version} · {data.brand.tagline}
            </p>

            <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] text-foreground">
              {data.brand.heroTitle}
              <span className="mt-2 block text-accent">{data.brand.heroHighlight}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-prose text-[15px] leading-[1.85] text-muted md:text-base lg:mx-0">
              {data.brand.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button
                href="#contact"
                size="lg"
                trailingIcon={<ArrowLeft className="h-4 w-4" weight="bold" />}
              >
                {primaryCta}
              </Button>
              <Button href="#work" variant="outline" size="lg">
                {secondaryCta}
              </Button>
            </div>

            {data.heroStats?.length ? (
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
                {data.heroStats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-start">
                    <dt className="font-display text-2xl text-foreground md:text-3xl">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-xs text-muted md:text-sm">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <SocialProof />
          </Reveal>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
