import Link from "next/link";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProductImage } from "@/components/ui/ProductImage";

const siteData = site as SiteConfig;

export function CategoryGrid() {
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {siteData.categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.05}>
              <Link
                href={`/shop?category=${cat.id}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-elevated transition-all duration-500 hover:border-amber hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ProductImage
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown/60 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-sm font-bold text-white md:text-base">
                      {cat.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/70">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
