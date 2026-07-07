import Link from "next/link";
import { Phone, Mail, MapPin, Package } from "lucide-react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";

const siteData = site as SiteConfig;

const footerLinks = [
  { label: "فروشگاه", href: "/shop" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس", href: "/contact" },
  { label: "سوالات", href: "/faq" },
  { label: "پیگیری سفارش", href: "/track-order" },
  { label: "علاقه‌مندی‌ها", href: "/wishlist" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="mb-3 text-xl font-bold text-brown">
              {siteData.brand.name}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              {siteData.brand.description}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-brown">دسترسی سریع</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-amber"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-brown">تماس با ما</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted">
              <li className="flex items-center gap-2">
                <Phone size={16} strokeWidth={1.5} className="text-amber" />
                <span dir="ltr">{siteData.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} strokeWidth={1.5} className="text-amber" />
                <span>{siteData.footer.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-amber" />
                <span>{siteData.footer.address}</span>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="inline-flex items-center gap-2 text-amber hover:text-amber-bright"
                >
                  <Package size={16} strokeWidth={1.5} />
                  پیگیری سفارش
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-dim">
          © {new Date().getFullYear()} {siteData.brand.name}. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
