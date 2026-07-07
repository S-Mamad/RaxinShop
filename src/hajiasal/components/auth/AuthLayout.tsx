"use client";

import Link from "next/link";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { ProductImage } from "@asal/components/ui/ProductImage";
import { hajiasalPath } from "@asal/lib/paths";

const siteData = site as SiteConfig;
const AUTH_HERO_IMAGE = "/images/hajiasal/about/workshop.webp";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({
  children,
  title = "به حاجی عسل خوش آمدید",
  subtitle = "ورود سریع با موبایل برای خرید امن",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col lg:flex-row">
      <div className="relative hidden min-h-[100dvh] flex-1 overflow-hidden bg-brown-deep lg:flex">
        <ProductImage
          src={AUTH_HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-deep via-brown-deep/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <Link
            href={hajiasalPath()}
            className="mb-8 text-xl font-bold text-white"
          >
            {siteData.brand.name}
          </Link>
          <p className="max-w-md text-2xl font-bold leading-tight text-white">
            {siteData.brand.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            {siteData.brand.description}
          </p>
        </div>
      </div>

      <div className="flex min-h-[100dvh] flex-1 flex-col justify-center px-4 py-12 md:px-8">
        <div className="mx-auto w-full max-w-md">
          <Link
            href={hajiasalPath()}
            className="mb-8 inline-block text-lg font-bold text-brown lg:hidden"
          >
            {siteData.brand.name}
          </Link>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-brown md:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-md md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
