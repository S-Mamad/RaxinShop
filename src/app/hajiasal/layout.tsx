import { Header } from "@asal/components/layout/Header";
import { Footer } from "@asal/components/layout/Footer";
import { CartDrawer } from "@asal/components/cart/CartDrawer";
import { buildOrganizationJsonLd } from "@asal/lib/seo";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import "@asal/styles/globals.css";

const siteData = site as SiteConfig;

export const metadata = {
  title: {
    default: `${siteData.brand.name} | عسل طبیعی و اصل`,
    template: `%s | ${siteData.brand.name}`,
  },
  description: siteData.brand.tagline,
};

export default function HajiasalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = buildOrganizationJsonLd(siteData);

  return (
    <div className="hajiasal-root flex min-h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
