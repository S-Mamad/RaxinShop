"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { BrowserFrame } from "@/components/ui/BrowserFrame";

export function HeroShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative w-full"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.65,
        delay: 0.12,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      <div
        className="pointer-events-none absolute -inset-6 rounded-full bg-accent/8 blur-3xl md:-inset-10"
        aria-hidden
      />
      <BrowserFrame label="hajiasal · live preview" className="relative">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src="/portfolio/hero-showcase.png"
            alt="پیش‌نمایش فروشگاه حاجی عسل، پروژه راکسین‌شاپ"
            fill
            priority
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </BrowserFrame>
    </motion.div>
  );
}
