"use client";

import { usePathname } from "next/navigation";
import type { SiteConfig } from "@asal/types";
import { Header } from "@asal/components/layout/Header";
import { Footer } from "@asal/components/layout/Footer";
import { CartDrawer } from "@asal/components/cart/CartDrawer";
import { CartLiveRegion } from "@asal/components/cart/CartLiveRegion";
import { SiteSettingsProvider } from "@asal/context/SiteSettingsContext";

const AUTH_ONLY = /^\/hajiasal\/(login|register|forgot-password)(\/|$)/;

interface StoreChromeProps {
  children: React.ReactNode;
  siteSettings: SiteConfig;
}

export function StoreChrome({ children, siteSettings }: StoreChromeProps) {
  const pathname = usePathname();
  const isAuthOnly = AUTH_ONLY.test(pathname ?? "");

  if (isAuthOnly) {
    return (
      <SiteSettingsProvider settings={siteSettings}>
        {children}
      </SiteSettingsProvider>
    );
  }

  return (
    <SiteSettingsProvider settings={siteSettings}>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <CartLiveRegion />
    </SiteSettingsProvider>
  );
}
