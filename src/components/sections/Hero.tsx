"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useCopy } from "@/hooks/useCopy";
import { usePrefs } from "@/context/PrefsContext";
import { useContextAware } from "@/context/ContextAwareContext";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { HeroGrid } from "@/components/sections/HeroGrid";
import { cn } from "@/lib/utils";

const ease = [0.32, 0.72, 0, 1] as const;

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { forceReducedMotion } = usePrefs();
  const { heavyEffectsOff } = useContextAware();
  const reduce = reduceMotion || forceReducedMotion || heavyEffectsOff;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const copy = useCopy();
  const { mode } = usePrefs();

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] items-center overflow-hidden border-b border-border pt-24 pb-20 md:pb-28"
    >
      <HeroGrid />

      <div className="relative z-[var(--z-content)] mx-auto w-full max-w-5xl px-5 text-center md:px-10">
        <FadeUp>
          <p className="label-mono mb-6 text-dim">{copy.hero.brandLine}</p>
        </FadeUp>

        <FadeUp delay={0.06}>
          <p className="font-display text-[clamp(2.8rem,8vw,5.5rem)] tracking-tight text-foreground">
            راکسین‌شاپ
          </p>
        </FadeUp>

        <FadeUp delay={0.12} key={mode}>
          <h1 className="mt-4 font-display text-[clamp(1.6rem,4vw,2.75rem)]">
            <span className="text-mask-kinetic">{copy.hero.title}</span>
            <span className="mt-2 block text-accent">{copy.hero.highlight}</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.18} key={`desc-${mode}`}>
          <p
            className={cn(
              "mx-auto mt-6 max-w-prose text-[15px] leading-[1.85] text-muted md:text-base",
            )}
          >
            {copy.hero.description}
          </p>
        </FadeUp>

        <FadeUp
          delay={0.24}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton
            href="#contact"
            trailingIcon={<ArrowLeft className="h-4 w-4" weight="bold" />}
          >
            {copy.hero.primaryCta}
          </MagneticButton>
          <Button href="#work" variant="outline" size="lg">
            {copy.hero.secondaryCta}
          </Button>
        </FadeUp>
      </div>
    </section>
  );
}
