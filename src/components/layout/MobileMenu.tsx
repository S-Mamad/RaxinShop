"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { BrandLogo } from "@/components/ui/BrandLogo";

const data = site as SiteConfig;
const sectionIds = data.nav.map((n) => n.id);

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const activeId = useScrollSpy(sectionIds);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key !== "Tab" || focusable.length === 0) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "بستن منو" : "باز کردن منو"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((v) => !v)}
        className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-border bg-elevated/50"
      >
        <span
          className={cn(
            "absolute h-px w-5 bg-foreground transition-all duration-500",
            open ? "translate-y-0 rotate-45" : "-translate-y-[3px]",
          )}
        />
        <span
          className={cn(
            "absolute h-px w-5 bg-foreground transition-all duration-500",
            open ? "translate-y-0 -rotate-45" : "translate-y-[3px]",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="منوی موبایل"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-void/96 backdrop-blur-3xl"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
              <BrandLogo className="mb-2 text-lg" />
              {data.nav.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + i * 0.04,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-2xl font-semibold transition-colors",
                      activeId === item.id
                        ? "text-accent"
                        : "text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {(data.footerNav ?? []).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + (data.nav.length + i) * 0.04,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4 flex gap-6"
              >
                {data.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    onClick={() => setOpen(false)}
                    className="font-mono text-sm text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
