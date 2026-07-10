"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@asal/components/admin/ui/DataTable";
import { AdminButton } from "@asal/components/admin/ui/AdminButton";
import { hajiasalPath } from "@asal/lib/paths";
import type { Product } from "@asal/types";

export default function SellerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/seller/products");
      if (res.status === 401) {
        router.push(hajiasalPath("/seller"));
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطا");
      setProducts(data.products ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-500">
          کاتالوگ اختصاصی فروشگاه شما در حاجی عسل
        </p>
        <AdminButton
          type="button"
          variant="outline"
          onClick={() => void load()}
          className="!border-stone-300"
        >
          بروزرسانی
        </AdminButton>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? (
        <p className="text-sm text-stone-500">در حال بارگذاری...</p>
      ) : null}
      <DataTable
        data={products}
        rowKey={(p) => p.id}
        emptyMessage="محصولی تخصیص داده نشده"
        columns={[
          {
            key: "title",
            header: "محصول",
            render: (p) => (
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-stone-400">{p.categoryLabel}</p>
              </div>
            ),
          },
          {
            key: "price",
            header: "شروع قیمت",
            render: (p) =>
              `${Math.min(...p.weightOptions.map((w) => w.price)).toLocaleString("fa-IR")} تومان`,
          },
          {
            key: "stock",
            header: "موجودی",
            render: (p) =>
              p.inStock ? (
                <span className="text-emerald-700">موجود</span>
              ) : (
                <span className="text-red-600">ناموجود</span>
              ),
          },
          {
            key: "rating",
            header: "امتیاز",
            render: (p) => p.rating.toLocaleString("fa-IR"),
          },
        ]}
      />
    </div>
  );
}
