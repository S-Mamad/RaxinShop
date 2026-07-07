import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { Reveal } from "@asal/components/ui/Reveal";
import { hajiasalPath } from "@asal/lib/paths";
import { formatPersianNumber } from "@asal/lib/utils";

const siteData = site as SiteConfig;

export function PromoBanner() {
  const shopUrl = hajiasalPath("/shop?coupon=HAJI10");
  const { minOrder, percent } = siteData.couponHAJI10;
  const threshold = formatPersianNumber(minOrder);

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <Link
            href={shopUrl}
            className="group relative block overflow-hidden rounded-3xl bg-gradient-to-l from-amber to-gold p-8 shadow-amber transition-transform duration-300 hover:scale-[1.005] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 md:p-12"
          >
            <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-white/10" aria-hidden />
            <div className="absolute -bottom-8 -start-8 h-32 w-32 rounded-full bg-white/10" aria-hidden />
            <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                  <Tag size={12} strokeWidth={1.5} aria-hidden />
                  کد تخفیف: HAJI10
                </span>
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  {formatPersianNumber(percent)}٪ تخفیف اولین خرید
                </h2>
                <p className="mt-1 text-white/80">
                  برای سفارش‌های بالای {threshold} تومان
                </p>
              </div>
              <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3 text-base font-medium text-white transition-colors group-hover:bg-white/20">
                خرید با کد تخفیف
                <ArrowLeft size={18} strokeWidth={1.5} aria-hidden />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
