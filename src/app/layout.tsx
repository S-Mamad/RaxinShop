import type { Metadata } from "next";
import { JetBrains_Mono, Vazirmatn } from "next/font/google";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const data = site as SiteConfig;
const siteUrl = getSiteUrl();
const siteName = `${data.brand.name}${data.brand.suffix}`;

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | استودیو توسعه`,
    template: `%s | ${siteName}`,
  },
  description: data.brand.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteName} | استودیو توسعه`,
    description: data.brand.description,
    url: "/",
    siteName,
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | استودیو توسعه`,
    description: data.brand.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded focus:border focus:border-accent focus:bg-void focus:px-4 focus:py-2 focus:text-sm focus:text-foreground"
        >
          پرش به محتوا
        </a>
        {children}
      </body>
    </html>
  );
}
