"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  CurrencyCircleDollar,
  Envelope,
  ShoppingBag,
} from "@phosphor-icons/react";
import { StatCard } from "@asal/components/admin/ui/StatCard";
import { StatusBadge } from "@asal/components/admin/ui/StatusBadge";
import { DataTable } from "@asal/components/admin/ui/DataTable";
import { Button } from "@asal/components/ui/Button";
import type { OrderStatus } from "@asal/lib/server/orders";
import type { ContactMessage } from "@asal/lib/server/newsletter";
import { hajiasalPath } from "@asal/lib/paths";

interface DashboardKpis {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  unreadMessages: number;
  totalProducts: number;
  outOfStock: number;
}

interface DashboardOrder {
  id: string;
  status: OrderStatus;
  customer: { fullName: string; phone: string };
  total: number;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.status === 401) {
        router.push(hajiasalPath("/admin"));
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطا در بارگذاری");
      setKpis(data.kpis);
      setRecentOrders(data.recentOrders ?? []);
      setRecentMessages(data.recentMessages ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">نمای کلی فروشگاه</p>
        <Button type="button" variant="outline" onClick={() => void loadData()}>
          بروزرسانی
        </Button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">در حال بارگذاری...</p> : null}

      {kpis ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="کل سفارش‌ها"
            value={kpis.totalOrders}
            hint={`${kpis.pendingOrders.toLocaleString("fa-IR")} در انتظار`}
            icon={Package}
          />
          <StatCard
            label="درآمد کل"
            value={`${kpis.totalRevenue.toLocaleString("fa-IR")} تومان`}
            icon={CurrencyCircleDollar}
          />
          <StatCard
            label="پیام‌های خوانده‌نشده"
            value={kpis.unreadMessages}
            icon={Envelope}
          />
          <StatCard
            label="محصولات"
            value={kpis.totalProducts}
            hint={`${kpis.outOfStock.toLocaleString("fa-IR")} ناموجود`}
            icon={ShoppingBag}
          />
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">سفارش‌های اخیر</h3>
          <Link
            href={hajiasalPath("/admin/orders")}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            مشاهده همه
          </Link>
        </div>
        <DataTable
          data={recentOrders}
          rowKey={(row) => row.id}
          emptyMessage="سفارشی ثبت نشده است"
          columns={[
            {
              key: "id",
              header: "شناسه",
              render: (row) => (
                <Link
                  href={hajiasalPath(`/admin/orders/${row.id}`)}
                  className="font-mono text-xs text-sky-700 hover:underline"
                  dir="ltr"
                >
                  {row.id}
                </Link>
              ),
            },
            {
              key: "customer",
              header: "مشتری",
              render: (row) => (
                <div>
                  <p className="font-medium">{row.customer.fullName}</p>
                  <p className="text-xs text-slate-400" dir="ltr">
                    {row.customer.phone}
                  </p>
                </div>
              ),
            },
            {
              key: "total",
              header: "مبلغ",
              render: (row) => `${row.total.toLocaleString("fa-IR")} تومان`,
            },
            {
              key: "status",
              header: "وضعیت",
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: "date",
              header: "تاریخ",
              render: (row) =>
                new Date(row.createdAt).toLocaleDateString("fa-IR"),
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">پیام‌های اخیر</h3>
          <Link
            href={hajiasalPath("/admin/messages")}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            مشاهده همه
          </Link>
        </div>
        <div className="grid gap-3">
          {recentMessages.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
              پیامی دریافت نشده است
            </p>
          ) : (
            recentMessages.map((msg) => (
              <article
                key={msg.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-slate-900">{msg.name}</p>
                  <time className="text-xs text-slate-400">
                    {new Date(msg.createdAt).toLocaleDateString("fa-IR")}
                  </time>
                </div>
                <p className="text-xs text-slate-500">
                  {msg.subject} · <span dir="ltr">{msg.phone}</span>
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {msg.message}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
