"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@asal/components/admin/ui/DataTable";
import { Button } from "@asal/components/ui/Button";
import type { Coupon } from "@asal/lib/server/coupons";
import { hajiasalPath } from "@asal/lib/paths";

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.status === 401) {
        router.push(hajiasalPath("/admin"));
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطا در بارگذاری");
      setCoupons(data.coupons ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {coupons.length.toLocaleString("fa-IR")} کد تخفیف
        </p>
        <Button type="button" variant="outline" onClick={() => void loadCoupons()}>
          بروزرسانی
        </Button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">در حال بارگذاری...</p> : null}

      <DataTable
        data={coupons}
        rowKey={(row) => row.code}
        emptyMessage="کد تخفیفی تعریف نشده است"
        columns={[
          {
            key: "code",
            header: "کد",
            render: (row) => (
              <span className="font-mono text-xs" dir="ltr">
                {row.code}
              </span>
            ),
          },
          {
            key: "type",
            header: "نوع",
            render: (row) =>
              row.type === "percent"
                ? `${row.value.toLocaleString("fa-IR")}٪`
                : `${row.value.toLocaleString("fa-IR")} تومان`,
          },
          {
            key: "min",
            header: "حداقل سفارش",
            render: (row) =>
              `${row.minOrder.toLocaleString("fa-IR")} تومان`,
          },
          {
            key: "label",
            header: "توضیح",
            render: (row) => row.label,
          },
          {
            key: "active",
            header: "فعال",
            render: (row) => (
              <span className={row.active ? "text-green-600" : "text-slate-400"}>
                {row.active ? "بله" : "خیر"}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
