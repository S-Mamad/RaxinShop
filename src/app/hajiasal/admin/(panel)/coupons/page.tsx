"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@asal/components/admin/ui/DataTable";
import { Button } from "@asal/components/ui/Button";
import { Input } from "@asal/components/ui/Input";
import type { Coupon } from "@asal/lib/server/coupons";
import { hajiasalPath } from "@asal/lib/paths";

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("10");
  const [minOrder, setMinOrder] = useState("0");

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

  const createCoupon = async () => {
    if (!code.trim() || !label.trim()) return;
    setError("");
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code.toUpperCase(),
        type: "percent",
        value: Number(value),
        minOrder: Number(minOrder),
        label,
        active: true,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "خطا در ایجاد کوپن");
      return;
    }
    setCode("");
    setLabel("");
    void loadCoupons();
  };

  const toggleActive = async (coupon: Coupon) => {
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon.code, active: !coupon.active }),
    });
    void loadCoupons();
  };

  const deleteCoupon = async (couponCode: string) => {
    if (!confirm(`حذف کوپن ${couponCode}؟`)) return;
    await fetch(`/api/admin/coupons?code=${encodeURIComponent(couponCode)}`, {
      method: "DELETE",
    });
    void loadCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-medium text-slate-700">کوپن جدید</p>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="کد"
            dir="ltr"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="max-w-[120px]"
          />
          <Input
            placeholder="توضیح"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="max-w-xs"
          />
          <Input
            placeholder="درصد"
            dir="ltr"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="max-w-[80px]"
          />
          <Input
            placeholder="حداقل سفارش"
            dir="ltr"
            type="number"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
            className="max-w-[120px]"
          />
          <Button type="button" onClick={() => void createCoupon()}>
            افزودن
          </Button>
        </div>
      </div>

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
              <button
                type="button"
                onClick={() => void toggleActive(row)}
                className={row.active ? "text-green-600" : "text-slate-400"}
              >
                {row.active ? "بله" : "خیر"}
              </button>
            ),
          },
          {
            key: "actions",
            header: "",
            render: (row) => (
              <button
                type="button"
                onClick={() => void deleteCoupon(row.code)}
                className="text-xs text-red-600 hover:underline"
              >
                حذف
              </button>
            ),
          },
        ]}
      />
    </div>
  );
}
