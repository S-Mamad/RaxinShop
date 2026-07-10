"use client";

import Link from "next/link";
import { Phone, Envelope, MapPin, Package } from "@phosphor-icons/react";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { hajiasalPath } from "@asal/lib/paths";

const siteData = site as SiteConfig;

const footerLinks = [
  { label: "فروشگاه", href: hajiasalPath("/shop") },
  { label: "درباره ما", href: hajiasalPath("/about") },
  { label: "تماس", href: hajiasalPath("/contact") },
  { label: "سوالات", href: hajiasalPath("/faq") },
  { label: "پیگیری سفارش", href: hajiasalPath("/track-order") },
  { label: "علاقه‌مندی‌ها", href: hajiasalPath("/wishlist") },
];

const legalLinks = [
  { label: "ضمانت اصالت", href: hajiasalPath("/authenticity") },
  { label: "ارسال و تحویل", href: hajiasalPath("/shipping") },
  { label: "قوانین", href: hajiasalPath("/terms") },
  { label: "حریم خصوصی", href: hajiasalPath("/privacy") },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-void">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 md:px-8 md:py-20">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-2 font-display text-lg text-primary sm:mb-3 sm:text-xl">
              {siteData.brand.name}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-secondary">
              {siteData.brand.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:contents">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-primary sm:mb-4">
                دسترسی سریع
              </h4>
              <ul className="flex flex-col gap-2 sm:gap-2.5">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-primary sm:mb-4">
                اعتماد و قوانین
              </h4>
              <ul className="flex flex-col gap-2 sm:gap-2.5">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary sm:mb-4">
              تماس با ما
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-secondary sm:gap-3">
              <li className="flex items-center gap-2">
                <Phone size={16} weight="light" className="shrink-0 text-gold" />
                <span dir="ltr">{siteData.footer.phone}</span>
              </li>
              <li className="flex min-w-0 items-center gap-2">
                <Envelope size={16} weight="light" className="shrink-0 text-gold" />
                <span className="truncate">{siteData.footer.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin
                  size={16}
                  weight="light"
                  className="mt-0.5 shrink-0 text-gold"
                />
                <span>{siteData.footer.address}</span>
              </li>
              <li>
                <Link
                  href={hajiasalPath("/track-order")}
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-bright"
                >
                  <Package size={16} weight="light" />
                  پیگیری سفارش
                </Link>
              </li>
            </ul>
            {/* اینماد: کد واقعی را از env/پنل جایگزین کنید */}
            <div className="mt-5 flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-white/15 text-[10px] leading-tight text-dim sm:mt-6 sm:h-20 sm:w-20">
              جای
              <br />
              اینماد
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-5 text-center text-xs text-dim sm:mt-10 sm:flex-row sm:gap-3 sm:pt-6 sm:text-start">
          <p>
            © {new Date().getFullYear()} {siteData.brand.name}. تمامی حقوق محفوظ
            است.
          </p>
          <p>ارسال سراسری · ضمانت اصالت · پشتیبانی خرید</p>
        </div>
      </div>
    </footer>
  );
}
