"use client";

import Image from "next/image";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { Button } from "@asal/components/ui/Button";
import { Reveal } from "@asal/components/ui/Reveal";
import { hajiasalPath } from "@asal/lib/paths";
import { ArrowLeft, Sparkle } from "@phosphor-icons/react";

const siteData = site as SiteConfig;

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-void">
      <Image
        src={siteData.hero.image}
        alt="شیشه عسل طبیعی حاجی عسل با نور استودیویی"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/50 via-void/75 to-void" />
      <div className="mesh-warm absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:pb-20 md:px-8 md:pb-28">
        <Reveal className="max-w-xl">
          <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-gold sm:mb-5">
            <Sparkle size={14} weight="fill" />
            عسل اصل ایرانی
          </span>
          <h1 className="mb-4 font-display text-4xl leading-[1.15] tracking-tight text-primary text-balance sm:text-5xl md:mb-5 md:text-6xl">
            {siteData.hero.title}
          </h1>
          <p className="mb-7 max-w-md text-sm leading-relaxed text-secondary sm:text-base md:mb-8 md:text-lg">
            {siteData.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={hajiasalPath(siteData.hero.ctaHref)} size="lg" magnetic>
              {siteData.hero.cta}
              <ArrowLeft size={18} weight="bold" />
            </Button>
            <Button
              href={hajiasalPath("/about")}
              variant="outline"
              size="lg"
              className="border-white/20 text-primary hover:border-gold/50"
            >
              داستان ما
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 hidden gap-8 sm:mt-16 md:flex">
          {[
            { value: "۳۰+", label: "محصول متنوع" },
            { value: "۴.۹", label: "رضایت مشتری" },
            { value: "۳۵", label: "سال تجربه" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border-s border-white/10 ps-8 first:border-0 first:ps-0"
            >
              <p className="text-2xl font-bold text-gold tabular-nums">{stat.value}</p>
              <p className="text-sm text-dim">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
