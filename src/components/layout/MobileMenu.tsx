"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";

const data = site as SiteConfig;
const sectionIds = data.nav.map((n) => n.id);

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-label={open ? "بستن منو" : "باز کردن منو"}
        aria-expanded={open}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-void/96 backdrop-blur-3xl"
          >
            <div className="flex h-full flex-col items-center justify-center gap-7 px-6">
              <BrandLogo className="mb-4 text-lg" />
              {data.nav.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.06 + i * 0.05,
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
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4"
              >
                <Button
                  href="#contact"
                  onClick={() => setOpen(false)}
                  trailingIcon={
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                  }
                >
                  تماس با ما
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
