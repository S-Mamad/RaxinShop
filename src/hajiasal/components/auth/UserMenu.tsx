"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, SignOut, Package, CaretDown } from "@phosphor-icons/react";
import { useAuth } from "@asal/hooks/useAuth";
import { Icon } from "@asal/components/ui/Icon";
import { hajiasalPath } from "@asal/lib/paths";
import { cn } from "@asal/lib/utils";

interface UserMenuProps {
  scrolled?: boolean;
  isHome?: boolean;
}

export function UserMenu({ scrolled = true, isHome = false }: UserMenuProps) {
  const { user, loading, logout, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const iconClass = cn(
    "flex h-9 items-center justify-center rounded-full transition-colors text-sm gap-1",
    scrolled || !isHome
      ? "text-brown hover:bg-cream-dark px-2"
      : "text-white/90 hover:bg-white/10 px-2",
  );

  if (loading) {
    return (
      <div className={cn(iconClass, "w-9")} aria-hidden>
        <Icon icon={User} size={18} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Link href={hajiasalPath("/login")} className={iconClass} aria-label="ورود">
        <Icon icon={User} size={18} />
        <span className="hidden sm:inline">ورود</span>
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={iconClass}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Icon icon={User} size={18} />
        <span className="hidden max-w-[5rem] truncate sm:inline">
          {user?.fullName?.split(" ")[0] ?? "حساب"}
        </span>
        <Icon icon={CaretDown} size={12} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-2 min-w-[10rem] rounded-xl border border-border bg-surface py-1 shadow-lg"
        >
          <Link
            href={hajiasalPath("/account")}
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-brown hover:bg-cream-dark"
            onClick={() => setOpen(false)}
          >
            <Icon icon={User} size={16} />
            حساب من
          </Link>
          <Link
            href={hajiasalPath("/account/orders")}
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-brown hover:bg-cream-dark"
            onClick={() => setOpen(false)}
          >
            <Icon icon={Package} size={16} />
            سفارش‌ها
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted hover:bg-cream-dark"
            onClick={() => void logout()}
          >
            <Icon icon={SignOut} size={16} />
            خروج
          </button>
        </div>
      ) : null}
    </div>
  );
}
