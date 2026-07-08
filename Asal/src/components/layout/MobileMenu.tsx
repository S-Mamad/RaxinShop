"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";

const siteData = site as SiteConfig;

const extraNav = [
  { id: "faq", label: "سوالات", href: "/faq" },
  { id: "contact", label: "تماس", href: "/contact" },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const navItems = [...siteData.nav, ...extraNav];

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-void/95 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed end-0 top-0 z-50 flex h-full w-72 flex-col bg-surface p-6 shadow-2xl md:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-bold text-primary">{siteData.brand.name}</span>
              <button
                type="button"
                onClick={onClose}
                className="text-secondary hover:text-gold"
                aria-label="بستن"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="text-lg text-primary hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
