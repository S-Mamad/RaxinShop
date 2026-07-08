"use client";

import { useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Product, ProductCategory, SortOption } from "@asal/types";
import {
  filterProducts,
  getPriceRange,
  paginateProducts,
} from "@asal/lib/products";
import { useSiteSettings } from "@asal/context/SiteSettingsContext";
import { ProductGrid } from "@asal/components/product/ProductGrid";
import { ProductGridSkeleton } from "@asal/components/ui/ProductGridSkeleton";
import { ShopEmptyState } from "@asal/components/shop/ShopEmptyState";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Button } from "@asal/components/ui/Button";
import { cn } from "@asal/lib/utils";
import { hajiasalPath } from "@asal/lib/paths";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "محبوب‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "newest", label: "جدیدترین" },
];

const ratingOptions = [
  { value: "", label: "همه امتیازها" },
  { value: "3", label: "۳ ستاره به بالا" },
  { value: "4", label: "۴ ستاره به بالا" },
  { value: "4.5", label: "۴.۵ ستاره به بالا" },
];

const weightOptions = [
  { value: "", label: "همه وزن‌ها" },
  { value: "300", label: "۳۰۰ گرم" },
  { value: "500", label: "۵۰۰ گرم" },
  { value: "1000", label: "۱ کیلوگرم" },
];

interface ShopContentProps {
  initialProducts: Product[];
}

function ShopContentInner({ initialProducts }: ShopContentProps) {
  const siteData = useSiteSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const priceRange = useMemo(
    () => getPriceRange(initialProducts),
    [initialProducts],
  );

  const category = (searchParams.get("category") as ProductCategory) || null;
  const sort = (searchParams.get("sort") as SortOption) || "popular";
  const minPrice = Number(searchParams.get("minPrice") || priceRange.min);
  const maxPrice = Number(searchParams.get("maxPrice") || priceRange.max);
  const minRating = Number(searchParams.get("minRating") || 0);
  const weightGrams = Number(searchParams.get("weight") || 0);
  const inStockOnly = searchParams.get("inStock") === "1";
  const page = Number(searchParams.get("page") || 1);

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
      if (!("page" in updates) && Object.keys(updates).some((k) => k !== "page")) {
        params.delete("page");
      }
      router.push(`${hajiasalPath("/shop")}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const filtered = useMemo(
    () =>
      filterProducts(
        {
          category,
          minPrice,
          maxPrice,
          minRating: minRating || undefined,
          weightGrams: weightGrams || undefined,
          sort,
          inStockOnly,
        },
        initialProducts,
      ),
    [
      category,
      minPrice,
      maxPrice,
      minRating,
      weightGrams,
      sort,
      inStockOnly,
      initialProducts,
    ],
  );

  const { items, page: currentPage, totalPages, total } = useMemo(
    () => paginateProducts(filtered, page),
    [filtered, page],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <SectionHeading
        title="فروشگاه"
        subtitle={`${total.toLocaleString("fa-IR")} محصول`}
        className="mb-8"
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-border bg-surface p-5">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-brown">دسته‌بندی</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <button
                    type="button"
                    onClick={() => updateParams({ category: null })}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-start text-sm transition-colors",
                      !category
                        ? "bg-gold-dim font-medium text-brown"
                        : "text-muted hover:bg-cream-dark",
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
                          ? "bg-gold-dim font-medium text-brown"
                          : "text-muted hover:bg-cream-dark",
                      )}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-brown">
                محدوده قیمت (تومان)
              </h3>
              <div className="flex flex-col gap-3">
                <label className="text-xs text-muted">
                  از {minPrice.toLocaleString("fa-IR")} تومان
                </label>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  step={50000}
                  value={minPrice}
                  onChange={(e) =>
                    updateParams({ minPrice: e.target.value })
                  }
                  aria-label="حداقل قیمت"
                  className="w-full accent-amber"
                />
                <label className="text-xs text-muted">
                  تا {maxPrice.toLocaleString("fa-IR")} تومان
                </label>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  step={50000}
                  value={maxPrice}
                  onChange={(e) =>
                    updateParams({ maxPrice: e.target.value })
                  }
                  aria-label="حداکثر قیمت"
                  className="w-full accent-amber"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-brown">امتیاز</h3>
              <select
                value={minRating ? String(minRating) : ""}
                onChange={(e) =>
                  updateParams({ minRating: e.target.value || null })
                }
                className="w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-brown focus:border-amber focus:outline-none"
              >
                {ratingOptions.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-brown">وزن</h3>
              <select
                value={weightGrams ? String(weightGrams) : ""}
                onChange={(e) =>
                  updateParams({ weight: e.target.value || null })
                }
                className="w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-brown focus:border-amber focus:outline-none"
              >
                {weightOptions.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-brown">مرتب‌سازی</h3>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-brown focus:border-amber focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) =>
                  updateParams({ inStock: e.target.checked ? "1" : null })
                }
                className="accent-amber"
              />
              فقط موجود
            </label>
          </div>
        </aside>

        <div className="flex-1">
          {items.length > 0 ? (
            <>
              <ProductGrid products={items} />
              {totalPages > 1 ? (
                <nav
                  className="mt-10 flex items-center justify-center gap-2"
                  aria-label="صفحه‌بندی"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() =>
                      updateParams({ page: String(currentPage - 1) })
                    }
                  >
                    قبلی
                  </Button>
                  <span className="px-3 text-sm text-muted">
                    صفحه {currentPage.toLocaleString("fa-IR")} از{" "}
                    {totalPages.toLocaleString("fa-IR")}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      updateParams({ page: String(currentPage + 1) })
                    }
                  >
                    بعدی
                  </Button>
                </nav>
              ) : null}
            </>
          ) : (
            <ShopEmptyState />
          )}
        </div>
      </div>

    </div>
  );
}

export function ShopContent({ initialProducts }: ShopContentProps) {
  return (
    <Suspense fallback={<ProductGridSkeleton count={6} />}>
      <ShopContentInner initialProducts={initialProducts} />
    </Suspense>
  );
}
