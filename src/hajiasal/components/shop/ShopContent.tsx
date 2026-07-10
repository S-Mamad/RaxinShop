"use client";

import { useMemo, useCallback, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Faders, X } from "@phosphor-icons/react";
import type { ProductCategory, SortOption } from "@asal/types";
import { filterProducts, getPriceRange } from "@asal/lib/products";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import { ProductGrid } from "@asal/components/product/ProductGrid";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Pagination } from "@asal/components/ui/Pagination";
import { ShopEmptyState } from "@asal/components/shop/ShopEmptyState";
import { cn } from "@asal/lib/utils";
import { hajiasalPath } from "@asal/lib/paths";

const siteData = site as SiteConfig;
const priceRange = getPriceRange();
const PAGE_SIZE = 12;

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "محبوب‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "newest", label: "جدیدترین" },
];

function FiltersPanel({
  category,
  sort,
  maxPrice,
  inStockOnly,
  updateParams,
  onClose,
}: {
  category: ProductCategory | null;
  sort: SortOption;
  maxPrice: number;
  inStockOnly: boolean;
  updateParams: (updates: Record<string, string | null>) => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {onClose ? (
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-primary">فیلترها</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary hover:bg-white/5 hover:text-gold"
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-primary">دسته‌بندی</h3>
        <ul className="flex flex-col gap-1.5">
          <li>
            <button
              type="button"
              onClick={() => {
                updateParams({ category: null });
                onClose?.();
              }}
              className={cn(
                "w-full rounded-lg px-3 py-2.5 text-start text-sm transition-colors",
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
                onClick={() => {
                  updateParams({ category: cat.id });
                  onClose?.();
                }}
                className={cn(
                  "w-full rounded-lg px-3 py-2.5 text-start text-sm transition-colors",
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
        <h3 className="mb-3 text-sm font-semibold text-primary">محدوده قیمت</h3>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          step={50000}
          value={maxPrice}
          onChange={(e) => updateParams({ maxPrice: e.target.value })}
          className="w-full accent-[var(--gold)]"
        />
        <p className="mt-2 text-xs text-secondary tabular-nums">
          تا {maxPrice.toLocaleString("fa-IR")} تومان
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-primary">مرتب‌سازی</h3>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="w-full rounded-xl border border-white/8 bg-surface-elevated px-3 py-2.5 text-sm text-primary focus:border-gold/50 focus:outline-none"
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
          className="accent-[var(--gold)]"
        />
        فقط موجود
      </label>
    </div>
  );
}

function ShopContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = (searchParams.get("category") as ProductCategory) || null;
  const sort = (searchParams.get("sort") as SortOption) || "popular";
  const maxPrice = Number(searchParams.get("maxPrice") || priceRange.max);
  const inStockOnly = searchParams.get("inStock") === "1";
  const pageParam = Number(searchParams.get("page") || "1");

  const updateParams = useCallback(
    (updates: Record<string, string | null>, options?: { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (options?.resetPage !== false && !("page" in updates)) {
        params.delete("page");
      }
      const qs = params.toString();
      router.push(
        qs ? `${hajiasalPath("/shop")}?${qs}` : hajiasalPath("/shop"),
        { scroll: false },
      );
    },
    [searchParams, router],
  );

  const filtered = useMemo(
    () =>
      filterProducts({
        category,
        minPrice: priceRange.min,
        maxPrice,
        sort,
        inStockOnly,
      }),
    [category, maxPrice, sort, inStockOnly],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, pageParam || 1), totalPages);
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const goToPage = useCallback(
    (next: number) => {
      const safe = Math.min(Math.max(1, next), totalPages);
      updateParams(
        { page: safe <= 1 ? null : String(safe) },
        { resetPage: false },
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages, updateParams],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
      <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
        <SectionHeading
          title="فروشگاه"
          subtitle={
            filtered.length > PAGE_SIZE
              ? `${filtered.length.toLocaleString("fa-IR")} محصول · صفحه ${page.toLocaleString("fa-IR")} از ${totalPages.toLocaleString("fa-IR")}`
              : `${filtered.length.toLocaleString("fa-IR")} محصول`
          }
        />
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm text-primary lg:hidden"
        >
          <Faders size={16} />
          فیلتر
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-white/6 bg-surface p-5">
            <FiltersPanel
              category={category}
              sort={sort}
              maxPrice={maxPrice}
              inStockOnly={inStockOnly}
              updateParams={(u) => updateParams(u)}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {filtered.length > 0 ? (
            <>
              <ProductGrid products={paged} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={goToPage}
              />
            </>
          ) : (
            <ShopEmptyState />
          )}
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-void/70 backdrop-blur-sm"
            aria-label="بستن فیلتر"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border border-white/10 bg-surface p-5 pb-8 shadow-2xl">
            <FiltersPanel
              category={category}
              sort={sort}
              maxPrice={maxPrice}
              inStockOnly={inStockOnly}
              updateParams={updateParams}
              onClose={() => setFiltersOpen(false)}
            />
          </div>
        </div>
      ) : null}
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
