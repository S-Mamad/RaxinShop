"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
import { Input } from "@asal/components/ui/Input";
import { Button } from "@asal/components/ui/Button";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { formatPrice } from "@asal/lib/utils";

interface OrderInfo {
  id: string;
  status: string;
  trackingCode: string;
  total: number;
  createdAt: string;
  items: Array<{ title: string; quantity: number; weight: string }>;
}

const statusLabels: Record<string, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  processing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

export default function TrackOrderPage() {
  const [tracking, setTracking] = useState("");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(
        `/api/orders?tracking=${encodeURIComponent(tracking.trim())}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "سفارش یافت نشد");
        return;
      }
      setOrder(data.order);
    } catch {
      setError("خطا در پیگیری سفارش");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-24 md:px-6 md:py-32">
      <SectionHeading
        title="پیگیری سفارش"
        subtitle="کد پیگیری ارسال‌شده به موبایل را وارد کنید"
        className="mb-8"
      />
      <form onSubmit={handleTrack} className="mb-8 flex gap-2">
        <Input
          placeholder="TRK-XXXXXXXX"
          dir="ltr"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          <Search size={16} strokeWidth={1.5} />
          پیگیری
        </Button>
      </form>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {order ? (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-dim">
              <Package size={18} className="text-amber" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-medium text-brown" dir="ltr">{order.id}</p>
              <p className="text-sm text-muted">
                {statusLabels[order.status] ?? order.status}
              </p>
            </div>
          </div>
          <p className="mb-2 text-sm text-muted">
            کد پیگیری: <span dir="ltr" className="font-mono text-brown">{order.trackingCode}</span>
          </p>
          <p className="mb-4 text-sm font-semibold text-brown">
            {formatPrice(order.total)}
          </p>
          <ul className="border-t border-border pt-4 text-sm text-muted">
            {order.items.map((item, i) => (
              <li key={i} className="py-1">
                {item.title} — {item.weight} × {item.quantity.toLocaleString("fa-IR")}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
