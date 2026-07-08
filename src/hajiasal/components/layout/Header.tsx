"use client";

import { useState } from "react";
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
import { useSiteSettings } from "@asal/context/SiteSettingsContext";
import { cn } from "@asal/lib/utils";
import { Icon } from "@asal/components/ui/Icon";
import { UserMenu } from "@asal/components/auth/UserMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";
import { extraNav, resolveNavHref } from "@asal/lib/nav";
import { hajiasalPath } from "@asal/lib/paths";

export function Header() {
  const siteData = useSiteSettings();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getItemCount());
  const hasHydrated = useCartStore((s) => s._hasHydrated);
  const wishlistCount = useWishlistStore((s) => s.count());

  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-white/5 hover:text-gold";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/5 bg-[#141414]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-8">
          <Link
            href={hajiasalPath()}
            className="text-base font-bold tracking-tight text-primary md:text-lg"
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
                    pathname === href
                      ? "font-medium text-gold underline decoration-gold/40 underline-offset-4"
                      : "text-secondary hover:text-gold",
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
              className={iconBtn}
              aria-label="جستجو"
            >
              <Icon icon={MagnifyingGlass} size={18} />
            </button>
            <Link
              href={hajiasalPath("/wishlist")}
              className={cn("relative", iconBtn)}
              aria-label="علاقه‌مندی‌ها"
            >
              <Icon icon={Heart} size={18} />
              {wishlistCount > 0 ? (
                <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-void">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <UserMenu scrolled={false} isHome />
            <button
              type="button"
              onClick={openCart}
              className={cn("relative", iconBtn)}
              aria-label="سبد خرید"
            >
              <Icon icon={ShoppingBag} size={18} />
              {hasHydrated && itemCount > 0 ? (
                <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-void">
                  {itemCount > 9 ? "۹+" : itemCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={cn(iconBtn, "lg:hidden")}
              aria-label="منو"
            >
              <Icon icon={List} size={18} />
            </button>
          </div>
        </div>
      </header>
      <div className="h-16" aria-hidden />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
