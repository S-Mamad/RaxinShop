"use client";

import { usePathname } from "next/navigation";
import { Header } from "@asal/components/layout/Header";
import { Footer } from "@asal/components/layout/Footer";
import { CartDrawer } from "@asal/components/cart/CartDrawer";
import { CartLiveRegion } from "@asal/components/cart/CartLiveRegion";

const AUTH_ONLY = /^\/hajiasal\/(login|register|forgot-password)(\/|$)/;

export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthOnly = AUTH_ONLY.test(pathname ?? "");

  if (isAuthOnly) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <CartLiveRegion />
    </>
  );
}
