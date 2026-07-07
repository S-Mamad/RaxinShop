"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { Button } from "@/components/ui/Button";
import { BrandLink } from "@/components/ui/BrandLogo";
import { MobileMenu } from "./MobileMenu";

const data = site as SiteConfig;
const sectionIds = data.nav.map((n) => n.id);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 md:px-8">
      <nav
        className={cn(
          "flex h-14 w-full max-w-6xl items-center justify-between gap-3 rounded-full border px-4 transition-all duration-700 md:px-5",
          scrolled
            ? "border-border-bright bg-void/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
            : "border-white/10 bg-white/[0.04] backdrop-blur-md",
        )}
        aria-label="ناوبری اصلی"
      >
        <BrandLink className="shrink-0" />

        <ul className="hidden min-w-0 items-center gap-0.5 xl:flex">
          {data.nav.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-2 text-[13px] transition-colors duration-500",
                  activeId === item.id
                    ? "bg-accent-dim font-medium text-accent"
                    : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 xl:block">
          <Button
            href="#contact"
            size="default"
            trailingIcon={
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            }
          >
            تماس با ما
          </Button>
        </div>

        <MobileMenu />
      </nav>
    </header>
  );
}
