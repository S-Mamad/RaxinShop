import type { Metadata } from "next";
import { Lalezar } from "next/font/google";
import { Header } from "@asal/components/layout/Header";
import { Footer } from "@asal/components/layout/Footer";
import { CartDrawer } from "@asal/components/cart/CartDrawer";
import { CartLiveRegion } from "@asal/components/cart/CartLiveRegion";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@asal/lib/seo";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { hajiasalAbsoluteUrl } from "@asal/lib/paths";
import "@asal/styles/globals.css";

const lalezar = Lalezar({
  variable: "--font-display",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
});

const siteData = site as SiteConfig;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImage = `${siteUrl}/images/hajiasal/og/og.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/hajiasal`),
  title: {
    default: `${siteData.brand.name} | عسل طبیعی و اصل`,
    template: `%s | ${siteData.brand.name}`,
  },
  description: siteData.brand.description,
  keywords: [
    "عسل طبیعی",
    "عسل اصل",
    "حاجی عسل",
    "خرید عسل",
    "عسل کوهستان",
    "ژل رویال",
  ],
  alternates: {
    canonical: hajiasalAbsoluteUrl(),
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: hajiasalAbsoluteUrl(),
    siteName: siteData.brand.name,
    title: `${siteData.brand.name} | عسل طبیعی و اصل`,
    description: siteData.brand.tagline,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: siteData.brand.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteData.brand.name} | عسل طبیعی و اصل`,
    description: siteData.brand.tagline,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HajiasalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = buildOrganizationJsonLd(siteData);
  const webSiteJsonLd = buildWebSiteJsonLd(siteData);

  return (
    <div className={`${lalezar.variable} hajiasal-root flex min-h-full flex-col`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:start-4 focus:top-4 focus:rounded-lg focus:bg-amber focus:px-4 focus:py-2 focus:text-white"
      >
        پرش به محتوای اصلی
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <CartLiveRegion />
    </div>
  );
}
