"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X, Phone, Question } from "@phosphor-icons/react";
import { useSiteSettings } from "@asal/context/SiteSettingsContext";
import { extraNav, resolveNavHref } from "@asal/lib/nav";
import { hajiasalPath } from "@asal/lib/paths";
import { useBodyScrollLock } from "@asal/hooks/useBodyScrollLock";
import { cn } from "@asal/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const siteData = useSiteSettings();
  const pathname = usePathname();
  const navItems = [...siteData.nav, ...extraNav];

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-void/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-y-0 end-0 z-[90] flex w-[min(100vw-2.5rem,19rem)] flex-col border-s border-white/8 bg-surface shadow-2xl lg:hidden"
            aria-label="منوی موبایل"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
              <span className="font-display text-lg text-primary">
                {siteData.brand.name}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-secondary hover:bg-white/5 hover:text-gold"
                aria-label="بستن"
              >
                <X size={22} />
              </button>
            </div>

            <ul className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
              {navItems.map((item, i) => {
                const href =
                  "href" in item && item.href.startsWith("/hajiasal")
                    ? item.href
                    : resolveNavHref(item.href);
                const active = pathname === href;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.035 }}
                  >
                    <Link
                      href={href}
                      onClick={onClose}
                      className={cn(
                        "block rounded-xl px-4 py-3.5 text-base transition-colors",
                        active
                          ? "bg-gold-dim font-medium text-gold"
                          : "text-primary hover:bg-white/5 hover:text-gold",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-auto space-y-2 border-t border-white/8 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                href={hajiasalPath("/faq")}
                onClick={onClose}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-secondary hover:text-gold"
              >
                <Question size={16} />
                سوالات متداول
              </Link>
              <Link
                href={hajiasalPath("/contact")}
                onClick={onClose}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-secondary hover:text-gold"
              >
                <Phone size={16} />
                تماس با ما
              </Link>
            </div>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
