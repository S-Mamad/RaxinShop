"use client";

import { useState, type ReactNode } from "react";
import { List, X } from "@phosphor-icons/react";
import { SellerSidebar } from "./SellerSidebar";
import { SellerHeader } from "./SellerHeader";

interface SellerLayoutProps {
  children: ReactNode;
  shopName?: string;
}

export function SellerLayout({ children, shopName }: SellerLayoutProps) {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div
      className="seller-shell flex min-h-[100dvh] bg-[#f7f4ef] text-stone-900"
      dir="rtl"
    >
      <div className="hidden lg:flex">
        <SellerSidebar shopName={shopName} />
      </div>

      {mobileNav ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-stone-900/40"
            aria-label="بستن"
            onClick={() => setMobileNav(false)}
          />
          <div className="absolute inset-y-0 start-0 flex shadow-2xl">
            <SellerSidebar
              shopName={shopName}
              onNavigate={() => setMobileNav(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-3 py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNav(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100"
            aria-label="منو"
          >
            {mobileNav ? <X size={20} /> : <List size={20} />}
          </button>
          <span className="truncate text-sm font-semibold">
            {shopName ?? "پنل فروشنده"}
          </span>
        </div>
        <SellerHeader />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
