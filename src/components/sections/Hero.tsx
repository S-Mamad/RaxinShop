import { ArrowLeft } from "lucide-react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { MeshBackground } from "@/components/shell/MeshBackground";
import { IDEWindow } from "@/components/shell/IDEWindow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const data = site as SiteConfig;

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-28 pb-20"
    >
      <MeshBackground />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">
          <div>
            <Reveal>
              <p className="mb-6 text-sm font-medium text-accent">
                {data.brand.tagline}
              </p>
              <h1 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] text-foreground">
                {data.brand.heroTitle}
                <span className="mt-2 block text-muted">
                  {data.brand.heroHighlight}
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-[15px] leading-[1.9] text-muted md:text-base">
                {data.brand.description}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button
                  href="#work"
                  size="lg"
                  trailingIcon={
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                  }
                >
                  مشاهده نمونه‌کارها
                </Button>
                <Button href="#contact" variant="outline" size="lg">
                  درخواست همکاری
                </Button>
              </div>

              <div className="mt-14 grid grid-cols-2 gap-3 border-t border-border pt-10 sm:grid-cols-4">
                {data.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl text-foreground md:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {stat.label}
                    </p>
                  </div>
                ))}
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
