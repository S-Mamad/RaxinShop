"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@asal/components/admin/ui/DataTable";
import { Button } from "@asal/components/ui/Button";
import type { ProfileWithStats } from "@asal/lib/server/profiles";
import { hajiasalPath } from "@asal/lib/paths";

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<ProfileWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/customers");
      if (res.status === 401) {
        router.push(hajiasalPath("/admin"));
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطا در بارگذاری");
      setCustomers(data.customers ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {customers.length.toLocaleString("fa-IR")} مشتری
        </p>
        <Button type="button" variant="outline" onClick={() => void loadCustomers()}>
          بروزرسانی
        </Button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">در حال بارگذاری...</p> : null}

      <DataTable
        data={customers}
        rowKey={(row) => row.id}
        emptyMessage="مشتری ثبت نشده است"
        columns={[
          {
            key: "name",
            header: "نام",
            render: (row) => row.fullName ?? "—",
          },
          {
            key: "phone",
            header: "موبایل",
            render: (row) => (
              <span dir="ltr" className="font-mono text-xs">
                {row.phone}
              </span>
            ),
          },
          {
            key: "orders",
            header: "سفارش‌ها",
            render: (row) => row.orderCount.toLocaleString("fa-IR"),
          },
          {
            key: "spent",
            header: "مجموع خرید",
            render: (row) =>
              `${row.totalSpent.toLocaleString("fa-IR")} تومان`,
          },
          {
            key: "joined",
            header: "عضویت",
            render: (row) =>
              new Date(row.createdAt).toLocaleDateString("fa-IR"),
          },
        ]}
      />
    </div>
  );
}
