"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@asal/components/admin/ui/DataTable";
import { Button } from "@asal/components/ui/Button";
import type { Product } from "@asal/types";
import { hajiasalPath } from "@asal/lib/paths";

export default function AdminInventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/inventory");
    if (res.status === 401) {
      router.push(hajiasalPath("/admin"));
      return;
    }
    const data = await res.json();
    setProducts(data.products ?? []);
    setLowStockCount(data.lowStockCount ?? 0);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleStock = async (product: Product) => {
    await fetch("/api/admin/inventory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        inStock: !product.inStock,
        reason: "admin_toggle",
      }),
    });
    void load();
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        {lowStockCount.toLocaleString("fa-IR")} محصول ناموجود
      </p>
      {loading ? <p className="text-sm text-slate-500">در حال بارگذاری...</p> : null}
      <DataTable
        data={products}
        rowKey={(r) => r.id}
        emptyMessage="محصولی یافت نشد"
        columns={[
          { key: "title", header: "محصول", render: (r) => r.title },
          {
            key: "stock",
            header: "موجودی",
            render: (r) => (
              <Button
                type="button"
                variant="outline"
                onClick={() => void toggleStock(r)}
                className="text-xs"
              >
                {r.inStock ? "موجود" : "ناموجود"}
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
