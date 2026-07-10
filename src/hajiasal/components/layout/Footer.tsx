"use client";

import Link from "next/link";
import { Phone, Envelope, InstagramLogo } from "@phosphor-icons/react";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { hajiasalPath } from "@asal/lib/paths";

const siteData = site as SiteConfig;

const footerLinks = [
  { label: "فروشگاه", href: hajiasalPath("/shop") },
  { label: "درباره ما", href: hajiasalPath("/about") },
  { label: "حساب کاربری", href: hajiasalPath("/account") },
  { label: "نظرات مشتریان", href: hajiasalPath("/reviews") },
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

const mobileQuickLinks = [
  { label: "فروشگاه", href: hajiasalPath("/shop") },
  { label: "پیگیری", href: hajiasalPath("/track-order") },
  { label: "تماس", href: hajiasalPath("/contact") },
  { label: "اصالت", href: hajiasalPath("/authenticity") },
  { label: "ارسال", href: hajiasalPath("/shipping") },
  { label: "سوالات", href: hajiasalPath("/faq") },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-void">
      {/* —— Mobile —— */}
      <div className="mx-auto max-w-7xl px-5 py-12 md:hidden">
        <div className="text-center">
          <p className="font-display text-xl tracking-tight text-primary">
            {siteData.brand.name}
          </p>
          <p className="mx-auto mt-2 max-w-[16rem] text-[13px] leading-relaxed text-dim">
            {siteData.brand.tagline}
          </p>
        </div>

        <nav
          aria-label="لینک‌های فوتر"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
        >
          {mobileQuickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-secondary transition-colors active:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mx-auto mt-8 flex max-w-xs flex-col items-center gap-2.5 text-[13px] text-dim">
          <a
            href={`tel:${siteData.footer.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 transition-colors active:text-gold"
            dir="ltr"
          >
            <Phone size={14} weight="light" className="text-gold/80" />
            {siteData.footer.phone}
          </a>
          <a
            href={`mailto:${siteData.footer.email}`}
            className="inline-flex max-w-full items-center gap-2 truncate transition-colors active:text-gold"
          >
            <Envelope size={14} weight="light" className="shrink-0 text-gold/80" />
            <span className="truncate">{siteData.footer.email}</span>
          </a>
          {siteData.social?.instagram ? (
            <a
              href={siteData.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors active:text-gold"
            >
              <InstagramLogo size={14} weight="light" className="text-gold/80" />
              اینستاگرام
            </a>
          ) : null}
        </div>

        <div className="mt-10 border-t border-white/5 pt-5 text-center">
          <p className="text-[11px] text-dim">
            © {new Date().getFullYear()} {siteData.brand.name}
          </p>
        </div>
      </div>

      {/* —— Desktop —— */}
      <div className="mx-auto hidden max-w-7xl px-8 py-20 md:block">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-3 font-display text-xl text-primary">
              {siteData.brand.name}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-secondary">
              {siteData.brand.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-primary">
              دسترسی سریع
            </h4>
            <ul className="flex flex-col gap-2.5">
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
            <h4 className="mb-4 text-sm font-semibold text-primary">
              اعتماد و قوانین
            </h4>
            <ul className="flex flex-col gap-2.5">
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

          <div>
            <h4 className="mb-4 text-sm font-semibold text-primary">تماس با ما</h4>
            <ul className="flex flex-col gap-3 text-sm text-secondary">
              <li className="flex items-center gap-2">
                <Phone size={16} weight="light" className="shrink-0 text-gold" />
                <span dir="ltr">{siteData.footer.phone}</span>
              </li>
              <li className="flex min-w-0 items-center gap-2">
                <Envelope size={16} weight="light" className="shrink-0 text-gold" />
                <span className="truncate">{siteData.footer.email}</span>
              </li>
              <li className="text-sm leading-relaxed text-dim">
                {siteData.footer.address}
              </li>
            </ul>
            <div className="mt-6 flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-white/15 text-[10px] leading-tight text-dim">
              جای
              <br />
              اینماد
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-dim">
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
