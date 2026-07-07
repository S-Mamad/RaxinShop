"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  List,
  MagnifyingGlass,
  Heart,
} from "@phosphor-icons/react";
import { useCartStore } from "@asal/store/cart";
import { useWishlistStore } from "@asal/store/wishlist";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { cn } from "@asal/lib/utils";
import { Icon } from "@asal/components/ui/Icon";
import { UserMenu } from "@asal/components/auth/UserMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";

const siteData = site as SiteConfig;

import { extraNav, resolveNavHref } from "@asal/lib/nav";
import { hajiasalPath } from "@asal/lib/paths";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getItemCount());
  const hasHydrated = useCartStore((s) => s._hasHydrated);
  const wishlistCount = useWishlistStore((s) => s.count());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/hajiasal";

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 md:pt-5">
        <header
          className={cn(
            "pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:px-6",
            scrolled || !isHome
              ? "border border-border-bright bg-glass shadow-glass backdrop-blur-xl"
              : "border border-white/20 bg-brown-deep/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] backdrop-blur-xl",
          )}
        >
          <Link
            href={hajiasalPath()}
            className={cn(
              "text-base font-bold tracking-tight md:text-lg",
              scrolled || !isHome ? "text-brown" : "text-white",
            )}
          >
            {siteData.brand.name}
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {[...siteData.nav, ...extraNav].map((item) => {
              const href =
                "href" in item && item.href.startsWith("/hajiasal")
                  ? item.href
                  : resolveNavHref(item.href);
              return (
              <Link
                key={item.id}
                href={href}
                className={cn(
                  "text-sm transition-colors duration-300",
                  scrolled || !isHome
                    ? pathname === href
                      ? "font-medium text-amber"
                      : "text-muted hover:text-amber"
                    : pathname === href
                      ? "font-medium text-amber-bright"
                      : "text-white/80 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                scrolled || !isHome
                  ? "text-brown hover:bg-cream-dark"
                  : "text-white/90 hover:bg-white/10",
              )}
              aria-label="جستجو"
            >
              <Icon icon={MagnifyingGlass} size={18} />
            </button>
            <Link
              href={hajiasalPath("/wishlist")}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                scrolled || !isHome
                  ? "text-brown hover:bg-cream-dark"
                  : "text-white/90 hover:bg-white/10",
              )}
              aria-label="علاقه‌مندی‌ها"
            >
              <Icon icon={Heart} size={18} />
              {wishlistCount > 0 ? (
                <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <UserMenu scrolled={scrolled || !isHome} isHome={isHome} />
            <button
              type="button"
              onClick={openCart}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                scrolled || !isHome
                  ? "text-brown hover:bg-cream-dark"
                  : "text-white/90 hover:bg-white/10",
              )}
              aria-label="سبد خرید"
            >
              <Icon icon={ShoppingBag} size={18} />
              {hasHydrated && itemCount > 0 ? (
                <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber text-[9px] font-bold text-white">
                  {itemCount > 9 ? "۹+" : itemCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full lg:hidden",
                scrolled || !isHome
                  ? "text-brown hover:bg-cream-dark"
                  : "text-white/90 hover:bg-white/10",
              )}
              aria-label="منو"
            >
              <Icon icon={List} size={18} />
            </button>
          </div>
        </header>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
