"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X } from "@phosphor-icons/react";
import { useSiteSettings } from "@asal/context/SiteSettingsContext";
import { extraNav, resolveNavHref } from "@asal/lib/nav";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const siteData = useSiteSettings();
  const navItems = [...siteData.nav, ...extraNav];

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-void/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 end-0 z-[70] flex w-[min(100vw-3rem,20rem)] flex-col border-s border-white/8 bg-surface p-6 shadow-2xl lg:hidden"
            aria-label="منوی موبایل"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-lg text-primary">
                {siteData.brand.name}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-secondary hover:bg-white/5 hover:text-gold"
                aria-label="بستن"
              >
                <X size={22} />
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {navItems.map((item, i) => {
                const href =
                  "href" in item && item.href.startsWith("/hajiasal")
                    ? item.href
                    : resolveNavHref(item.href);
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={href}
                      onClick={onClose}
                      className="block rounded-xl px-3 py-3 text-base text-primary transition-colors hover:bg-white/5 hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
