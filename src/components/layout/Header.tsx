"use client";

import Link from "next/link";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { BrandLink } from "@/components/ui/BrandLogo";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { A11yPanel } from "@/components/ui/A11yPanel";
import { usePrefs } from "@/context/PrefsContext";
import { MobileMenu } from "./MobileMenu";

const data = site as SiteConfig;
const sectionIds = data.nav.map((n) => n.id);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(sectionIds);
  const { muted, setMuted } = usePrefs();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-header)] border-b border-transparent px-4 pt-4 md:px-8">
      <nav
        className={cn(
          "mx-auto flex h-13 max-w-7xl items-center justify-between gap-3 border px-3 transition-colors duration-300 md:px-5",
          scrolled
            ? "border-border bg-void/90 backdrop-blur-xl"
            : "border-border/60 bg-void/70 backdrop-blur-md",
        )}
        aria-label="ناوبری اصلی"
      >
        <BrandLink className="shrink-0" />

        <ul className="hidden items-center gap-0 xl:flex">
          {data.nav.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  "px-3 py-3 text-sm transition-colors duration-300",
                  activeId === item.id
                    ? "text-accent"
                    : "text-dim hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ModeToggle className="hidden sm:inline-flex" />
          <button
            type="button"
            aria-label={muted ? "فعال‌سازی صدا" : "بی‌صدا"}
            aria-pressed={muted}
            onClick={() => setMuted(!muted)}
            className="hidden h-9 w-9 items-center justify-center border border-border bg-surface/80 text-muted transition-colors hover:text-accent md:inline-flex"
          >
            {muted ? (
              <SpeakerSlash className="h-4 w-4" weight="bold" />
            ) : (
              <SpeakerHigh className="h-4 w-4" weight="bold" />
            )}
          </button>
          <A11yPanel />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
