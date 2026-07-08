"use client";

import Link from "next/link";
import type { SiteConfig } from "@asal/types";
import { useSiteSettings } from "@asal/context/SiteSettingsContext";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { ProductImage } from "@asal/components/ui/ProductImage";
import { hajiasalPath } from "@asal/lib/paths";
import { cn } from "@asal/lib/utils";

const bentoSpans = [
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-6",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
] as const;

export function CategoryGrid() {
  const siteData = useSiteSettings();
  const [featured, ...rest] = siteData.categories;

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal className="mb-10">
          <SectionHeading
            title="دسته‌بندی محصولات"
            subtitle="عسل مورد علاقه خود را از میان دسته‌های متنوع انتخاب کنید"
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:auto-rows-[minmax(150px,auto)] md:gap-4">
          {featured ? (
            <Reveal className="col-span-2 md:col-span-6 md:row-span-2">
              <CategoryCard category={featured} featured />
            </Reveal>
          ) : null}

          {rest.map((cat, i) => (
            <Reveal
              key={cat.id}
              delay={(i + 1) * 0.05}
              className={cn("col-span-1", bentoSpans[i] ?? "md:col-span-3")}
            >
              <CategoryCard category={cat} wide={i === 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  featured = false,
  wide = false,
}: {
  category: SiteConfig["categories"][number];
  featured?: boolean;
  wide?: boolean;
}) {
  return (
    <Link
      href={`${hajiasalPath("/shop")}?category=${category.id}`}
      className={cn(
        "group block h-full overflow-hidden rounded-2xl border border-border bg-elevated transition-all duration-500 hover:border-amber hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber",
        featured && "min-h-[220px] md:min-h-full",
        wide && "md:min-h-[160px]",
      )}
    >
      <div
        className={cn(
          "relative h-full overflow-hidden",
          featured
            ? "min-h-[220px] md:min-h-[400px]"
            : "aspect-[4/3] md:aspect-auto md:min-h-[150px]",
          wide && "md:aspect-[2.2/1]",
        )}
      >
        <ProductImage
          src={category.image}
          alt={category.label}
          fill
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 50vw"
              : wide
                ? "(max-width: 768px) 50vw, 40vw"
                : "(max-width: 768px) 50vw, 20vw"
          }
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown/80 via-brown/30 to-transparent" />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0",
            featured ? "p-5 md:p-8" : "p-3 md:p-4",
          )}
        >
          {featured ? (
            <span className="mb-2 inline-block rounded-full bg-amber/90 px-3 py-0.5 text-[10px] font-medium text-white">
              پرطرفدار
            </span>
          ) : null}
          <h3
            className={cn(
              "font-bold text-white",
              featured ? "text-lg md:text-2xl" : "text-sm md:text-base",
            )}
          >
            {category.label}
          </h3>
          <p
            className={cn(
              "mt-0.5 text-white/70",
              featured ? "text-sm md:text-base" : "text-[11px] md:text-xs",
            )}
          >
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
