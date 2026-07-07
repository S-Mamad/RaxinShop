import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { MeshBackground } from "@/components/shell/MeshBackground";
import { IDEWindow } from "@/components/shell/IDEWindow";
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
      <MeshBackground />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">
          <div>
            <Reveal>
              <p className="telemetry mb-8">
                {data.brand.slug} · {data.brand.version} · {data.brand.tagline}
              </p>

              <h1 className="font-display text-[clamp(2.75rem,7.5vw,5rem)] text-foreground">
                {data.brand.heroTitle}
                <span className="mt-1 block text-accent">
                  {data.brand.heroHighlight}
                </span>
              </h1>

              <p className="mt-8 max-w-prose text-[15px] leading-[1.85] text-muted md:text-base">
                {data.brand.description}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button
                  href="#contact"
                  size="lg"
                  trailingIcon={
                    <ArrowLeft className="h-4 w-4" weight="bold" />
                  }
                >
                  {primaryCta}
                </Button>
                <Button href="#work" variant="outline" size="lg">
                  {secondaryCta}
                </Button>
              </div>

              <SocialProof />

              <div className="mt-14 border-t border-border pt-8">
                <p className="telemetry mb-4 text-dim">stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.stack.map((tech) => (
                    <span
                      key={tech}
                      dir="ltr"
                      className="border border-border bg-elevated px-2.5 py-1 font-mono text-[10px] text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <IDEWindow />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
