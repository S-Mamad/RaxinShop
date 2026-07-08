"use client";

import Link from "next/link";
import { Phone, Envelope, MapPin, Package, WhatsappLogo, InstagramLogo } from "@phosphor-icons/react";
import { useSiteSettings } from "@asal/context/SiteSettingsContext";
import { Icon } from "@asal/components/ui/Icon";
import { hajiasalPath } from "@asal/lib/paths";

const footerLinks = [
  { label: "فروشگاه", href: hajiasalPath("/shop") },
  { label: "درباره ما", href: hajiasalPath("/about") },
  { label: "تماس", href: hajiasalPath("/contact") },
  { label: "سوالات", href: hajiasalPath("/faq") },
  { label: "پیگیری سفارش", href: hajiasalPath("/track-order") },
  { label: "علاقه‌مندی‌ها", href: hajiasalPath("/wishlist") },
];

const trustLinks = [
  { label: "ضمانت اصالت", href: hajiasalPath("/authenticity") },
  { label: "حریم خصوصی", href: hajiasalPath("/privacy") },
  { label: "قوانین", href: hajiasalPath("/terms") },
  { label: "ارسال", href: hajiasalPath("/shipping") },
];

export function Footer() {
  const siteData = useSiteSettings();
  const whatsappUrl =
    siteData.social?.whatsapp ??
    (siteData.whatsappNumber
      ? `https://wa.me/${siteData.whatsappNumber}`
      : undefined);
  const instagramUrl = siteData.social?.instagram;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="mb-3 text-xl font-bold text-brown">
              {siteData.brand.name}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              {siteData.brand.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-amber hover:text-amber"
                  aria-label="واتساپ"
                >
                  <Icon icon={WhatsappLogo} size={18} className="text-amber" />
                  واتساپ
                </a>
              ) : null}
              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-amber hover:text-amber"
                  aria-label="اینستاگرام"
                >
                  <Icon icon={InstagramLogo} size={18} className="text-amber" />
                  اینستاگرام
                </a>
              ) : null}
            </div>
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
            <h4 className="mb-4 text-sm font-semibold text-brown">اعتماد و قوانین</h4>
            <ul className="flex flex-col gap-2.5">
              {trustLinks.map((link) => (
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
                <Icon icon={Phone} size={16} className="text-amber" />
                <span dir="ltr">{siteData.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon={Envelope} size={16} className="text-amber" />
                <span>{siteData.footer.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon={MapPin} size={16} className="mt-0.5 shrink-0 text-amber" />
                <span>{siteData.footer.address}</span>
              </li>
              <li>
                <Link
                  href={hajiasalPath("/track-order")}
                  className="inline-flex items-center gap-2 text-amber hover:text-amber-bright"
                >
                  <Icon icon={Package} size={16} />
                  پیگیری سفارش
                </Link>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {siteData.trustItems.slice(0, 3).map((item) => (
                <span
                  key={item.id}
                  className="rounded-full border border-border bg-cream px-3 py-1.5 text-[10px] font-medium text-muted"
                >
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-dim">
          © {new Date().getFullYear()} {siteData.brand.name}. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
