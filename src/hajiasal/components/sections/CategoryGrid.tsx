import Link from "next/link";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { ProductImage } from "@asal/components/ui/ProductImage";
import { hajiasalPath } from "@asal/lib/paths";

const siteData = site as SiteConfig;

export function CategoryGrid() {
  return (
    <section className="bg-surface py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="mb-8 md:mb-10">
          <SectionHeading
            title="دسته‌بندی محصولات"
            subtitle="عسل مورد علاقه خود را انتخاب کنید"
            className="max-w-lg"
          />
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {siteData.categories.map((cat, i) => {
            const featured = i === 0 || i === 3;
            return (
              <Reveal
                key={cat.id}
                delay={i * 0.04}
                className={featured ? "md:col-span-1 lg:row-span-1" : undefined}
              >
                <Link
                  href={`${hajiasalPath("/shop")}?category=${cat.id}`}
                  className="group relative block overflow-hidden rounded-2xl border border-white/6 bg-surface-elevated transition-all duration-500 hover:border-gold/30"
                >
                  <div
                    className={
                      featured
                        ? "relative aspect-[4/5] sm:aspect-[4/3]"
                        : "relative aspect-[4/3]"
                    }
                  >
                    <ProductImage
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <h3 className="text-sm font-bold text-primary sm:text-base">
                        {cat.label}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-secondary">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
