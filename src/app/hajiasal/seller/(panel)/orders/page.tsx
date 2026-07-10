"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@asal/components/admin/ui/StatusBadge";
import { DataTable } from "@asal/components/admin/ui/DataTable";
import { AdminButton } from "@asal/components/admin/ui/AdminButton";
import { hajiasalPath } from "@asal/lib/paths";
import type { OrderStatus } from "@asal/lib/server/orders";

interface SellerOrder {
  id: string;
  status: OrderStatus;
  customer: { fullName: string; phone: string; city: string };
  sellerSubtotal: number;
  sellerItems: Array<{ title: string; quantity: number; weight: { label: string } }>;
  createdAt: string;
  trackingCode?: string;
}

export default function SellerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/seller/orders");
      if (res.status === 401) {
        router.push(hajiasalPath("/seller"));
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطا");
      setOrders(data.orders ?? []);
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
          فقط سفارش‌هایی که شامل محصولات شما هستند
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
        data={orders}
        rowKey={(r) => r.id}
        emptyMessage="سفارشی یافت نشد"
        columns={[
          {
            key: "id",
            header: "شناسه",
            render: (r) => (
              <span className="font-mono text-xs" dir="ltr">
                {r.id}
              </span>
            ),
          },
          {
            key: "customer",
            header: "مشتری",
            render: (r) => (
              <div>
                <p className="font-medium">{r.customer.fullName}</p>
                <p className="text-xs text-stone-400">
                  {r.customer.city}
                </p>
              </div>
            ),
          },
          {
            key: "items",
            header: "اقلام شما",
            render: (r) => (
              <ul className="space-y-0.5 text-xs text-stone-600">
                {r.sellerItems.map((item, i) => (
                  <li key={`${r.id}-${i}`}>
                    {item.title} · {item.weight.label} ×{" "}
                    {item.quantity.toLocaleString("fa-IR")}
                  </li>
                ))}
              </ul>
            ),
          },
          {
            key: "total",
            header: "مبلغ سهم",
            render: (r) =>
              `${r.sellerSubtotal.toLocaleString("fa-IR")} تومان`,
          },
          {
            key: "status",
            header: "وضعیت",
            render: (r) => <StatusBadge status={r.status} />,
          },
          {
            key: "date",
            header: "تاریخ",
            render: (r) => new Date(r.createdAt).toLocaleDateString("fa-IR"),
          },
        ]}
      />
    </div>
  );
}
