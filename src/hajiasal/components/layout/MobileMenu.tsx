"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X } from "@phosphor-icons/react";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { extraNav, resolveNavHref } from "@asal/lib/nav";

const siteData = site as SiteConfig;

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const navItems = [...siteData.nav, ...extraNav];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-brown/40 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed end-0 top-0 z-50 flex h-full w-72 flex-col bg-surface p-6 shadow-2xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="منوی موبایل"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-bold text-brown">{siteData.brand.name}</span>
              <button
                type="button"
                onClick={onClose}
                className="text-muted hover:text-brown"
                aria-label="بستن"
              >
                <X size={22} weight="light" />
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => {
                const href =
                  "href" in item && item.href.startsWith("/hajiasal")
                    ? item.href
                    : resolveNavHref(item.href);
                return (
                <li key={item.id}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className="text-lg text-brown hover:text-amber"
                  >
                    {item.label}
                  </Link>
                </li>
              );
              })}
            </ul>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
