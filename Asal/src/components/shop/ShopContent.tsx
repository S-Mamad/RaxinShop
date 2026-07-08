"use client";

import { useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ProductCategory, SortOption } from "@/types";
import { filterProducts, getPriceRange } from "@/lib/products";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const siteData = site as SiteConfig;
const priceRange = getPriceRange();

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "محبوب‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "newest", label: "جدیدترین" },
];

function ShopContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = (searchParams.get("category") as ProductCategory) || null;
  const sort = (searchParams.get("sort") as SortOption) || "popular";
  const minPrice = Number(searchParams.get("minPrice") || priceRange.min);
  const maxPrice = Number(searchParams.get("maxPrice") || priceRange.max);
  const inStockOnly = searchParams.get("inStock") === "1";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`/shop?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const filtered = useMemo(
    () =>
      filterProducts({
        category,
        minPrice,
        maxPrice,
        sort,
        inStockOnly,
      }),
    [category, minPrice, maxPrice, sort, inStockOnly],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <SectionHeading
        title="فروشگاه"
        subtitle={`${filtered.length.toLocaleString("fa-IR")} محصول`}
        className="mb-8"
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-white/6 bg-surface p-5">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-primary">
                دسته‌بندی
              </h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <button
                    type="button"
                    onClick={() => updateParams({ category: null })}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-start text-sm transition-colors",
                      !category
                        ? "bg-gold-dim font-medium text-gold"
                        : "text-secondary hover:bg-surface-elevated",
                    )}
                  >
                    همه محصولات
                  </button>
                </li>
                {siteData.categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => updateParams({ category: cat.id })}
                      className={cn(
                        "w-full rounded-lg px-3 py-2 text-start text-sm transition-colors",
                        category === cat.id
                          ? "bg-gold-dim font-medium text-gold"
                          : "text-secondary hover:bg-surface-elevated",
                      )}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-primary">
                محدوده قیمت (تومان)
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  step={50000}
                  value={maxPrice}
                  onChange={(e) =>
                    updateParams({ maxPrice: e.target.value })
                  }
                  className="w-full accent-gold"
                />
                <p className="text-xs text-secondary">
                  تا {maxPrice.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-primary">
                مرتب‌سازی
              </h3>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="w-full rounded-xl border border-white/8 bg-surface-elevated px-3 py-2 text-sm text-primary focus:border-gold/50 focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-secondary">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) =>
                  updateParams({ inStock: e.target.checked ? "1" : null })
                }
                className="accent-gold"
              />
              فقط موجود
            </label>
          </div>
        </aside>

        <div className="flex-1">
          {filtered.length > 0 ? (
            <ProductGrid products={filtered} />
          ) : (
            <p className="py-20 text-center text-secondary">
              محصولی با این فیلترها یافت نشد.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ShopContent() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-secondary">
          در حال بارگذاری...
        </div>
      }
    >
      <ShopContentInner />
    </Suspense>
  );
}
