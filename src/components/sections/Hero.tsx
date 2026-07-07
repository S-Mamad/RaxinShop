import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
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
      className="relative flex min-h-[100dvh] items-center overflow-hidden border-b border-border pt-28 pb-24"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(45,212,191,0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-3xl px-5 text-center md:px-10">
        <Reveal>
          <p className="label-mono mb-8">
            {data.brand.name}
            {data.brand.suffix} · {data.brand.version} · {data.brand.tagline}
          </p>

          <h1 className="font-display text-[clamp(2.5rem,6.5vw,4.25rem)] text-foreground">
            {data.brand.heroTitle}
            <span className="mt-2 block text-accent">{data.brand.heroHighlight}</span>
          </h1>

          <p className="mx-auto mt-8 max-w-prose text-[15px] leading-[1.85] text-muted md:text-base">
            {data.brand.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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

          <SocialProof />
        </Reveal>
      </div>
    </section>
  );
}
