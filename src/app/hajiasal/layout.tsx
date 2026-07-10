import type { Metadata } from "next";
import { Lalezar, Vazirmatn } from "next/font/google";
import { StoreChrome } from "@asal/components/layout/StoreChrome";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@asal/lib/seo";
import { getSiteSettings } from "@asal/lib/server/site-settings";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { hajiasalAbsoluteUrl } from "@asal/lib/paths";
import "@asal/styles/globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const lalezar = Lalezar({
  variable: "--font-lalezar",
  subsets: ["arabic", "latin"],
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

export default async function HajiasalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteData = await getSiteSettings();
  const orgJsonLd = buildOrganizationJsonLd(siteData);
  const webSiteJsonLd = buildWebSiteJsonLd(siteData);

  return (
    <div
      className={`${vazirmatn.variable} ${lalezar.variable} hajiasal-root flex min-h-full flex-col overflow-x-hidden bg-void text-primary antialiased`}
      dir="rtl"
    >
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
      <StoreChrome siteSettings={siteData}>{children}</StoreChrome>
    </div>
  );
}
