"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { BrandLink } from "@/components/ui/BrandLogo";
import { MobileMenu } from "./MobileMenu";

const data = site as SiteConfig;
const sectionIds = data.nav.map((n) => n.id);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(sectionIds);
  const telegram = data.links.find((l) => l.id === "telegram");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent px-4 pt-4 md:px-8">
      <nav
        className={cn(
          "mx-auto flex h-13 max-w-7xl items-center justify-between gap-4 border px-4 transition-colors duration-300 md:px-6",
          scrolled
            ? "border-border bg-void/90 backdrop-blur-xl"
            : "border-border/60 bg-void/70 backdrop-blur-md",
        )}
        aria-label="ناوبری اصلی"
      >
        <BrandLink className="shrink-0" />

        <ul className="hidden items-center gap-0 lg:flex">
          {data.nav.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  "px-4 py-3 text-sm transition-colors duration-300",
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

        {telegram ? (
          <a
            href={telegram.href}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="hidden font-mono text-[11px] text-muted transition-colors hover:text-accent lg:block"
          >
            {telegram.label}
          </a>
        ) : null}

        <MobileMenu />
      </nav>
    </header>
  );
}
