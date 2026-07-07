"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Flask,
  Headphones,
  ArrowCounterClockwise,
  Shield,
  Truck,
} from "@phosphor-icons/react";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { Reveal } from "@asal/components/ui/Reveal";
import { Icon } from "@asal/components/ui/Icon";
import { hajiasalPath } from "@asal/lib/paths";
import { cn } from "@asal/lib/utils";

const siteData = site as SiteConfig;

const icons = {
  authentic: Shield,
  shipping: Truck,
  support: Headphones,
  lab: Flask,
  return: ArrowCounterClockwise,
} as const;

const extraItems = [
  {
    id: "lab",
    title: "تضمین آزمایشگاهی",
    description: "هر محموله با گواهی ساکاروز و HMF کنترل می‌شود",
  },
  {
    id: "return",
    title: "بازگشت ۷ روزه",
    description: "در صورت نارضایتی، بازپرداخت کامل بدون پرسش",
  },
];

const allItems = [...siteData.trustItems, ...extraItems];

export function TrustBar() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal className="mb-12 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
            چرا به ما اعتماد کنید
          </p>
          <h2 className="text-2xl font-bold text-brown md:text-3xl">
            استانداردهایی که قابل اندازه‌گیری‌اند
          </h2>
        </Reveal>

        <div className="flex flex-col gap-6 md:gap-10">
          {allItems.map((item, i) => {
            const IconComponent = icons[item.id as keyof typeof icons] ?? Shield;
            const isEven = i % 2 === 0;
            const isHighlighted = item.id === "lab" || item.id === "return";

            return (
              <Reveal key={item.id} delay={i * 0.07}>
                <div
                  className={cn(
                    "grid items-center gap-4 md:grid-cols-2 md:gap-10",
                    !isEven && "md:[&>div:first-child]:order-2",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-start gap-4 rounded-2xl border p-5 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-6",
                      isHighlighted
                        ? "border-amber/25 bg-gold-dim/50 shadow-amber"
                        : "border-border bg-surface shadow-md",
                      isEven ? "md:ms-auto md:max-w-md" : "md:me-auto md:max-w-md",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                        isHighlighted ? "bg-amber/15" : "bg-gold-dim",
                      )}
                    >
                      <Icon icon={IconComponent} size={22} className="text-amber" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-base font-semibold text-brown">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "hidden md:flex md:items-center",
                      isEven ? "md:justify-start" : "md:justify-end",
                    )}
                    aria-hidden
                  >
                    <div className="relative h-px w-full max-w-xs bg-border">
                      <span
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 rounded-full bg-amber/20 p-1.5",
                          isEven ? "start-0" : "end-0",
                        )}
                      >
                        <span className="block h-1.5 w-1.5 rounded-full bg-amber" />
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.45} className="mt-12 text-center">
          <Link
            href={hajiasalPath("/authenticity")}
            className="inline-flex items-center gap-2 text-sm font-medium text-amber transition-colors hover:text-amber-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2"
          >
            جزئیات ضمانت اصالت و گواهی‌ها
            <Icon icon={ArrowLeft} size={16} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
