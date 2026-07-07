"use client";

import { ArrowRight, Tag } from "@phosphor-icons/react";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { Reveal } from "@asal/components/ui/Reveal";
import { Icon } from "@asal/components/ui/Icon";
import { Button } from "@asal/components/ui/Button";
import { hajiasalPath } from "@asal/lib/paths";
import { formatPersianNumber } from "@asal/lib/utils";

const siteData = site as SiteConfig;

export function PromoBanner() {
  const shopUrl = hajiasalPath("/shop?coupon=HAJI10");
  const { minOrder, percent } = siteData.couponHAJI10;
  const threshold = formatPersianNumber(minOrder);

  return (
    <section className="bg-cream-dark py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-surface p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-subtle px-3 py-1 text-xs font-medium text-accent">
                <Icon icon={Tag} size={12} aria-hidden />
                کد تخفیف: HAJI10
              </span>
              <h2 className="text-2xl font-bold text-brown md:text-3xl">
                {formatPersianNumber(percent)}٪ تخفیف اولین خرید
              </h2>
              <p className="mt-2 text-muted">
                برای سفارش‌های بالای {threshold} تومان
              </p>
            </div>
            <Button href={shopUrl} variant="outline" className="shrink-0 gap-2 border-accent text-accent hover:bg-accent-subtle">
              خرید با کد تخفیف
              <Icon icon={ArrowRight} size={18} aria-hidden />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
