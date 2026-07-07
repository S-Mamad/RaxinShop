"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  XCircle,
} from "lucide-react";
import { Input } from "@asal/components/ui/Input";
import { Button } from "@asal/components/ui/Button";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { formatPrice } from "@asal/lib/utils";
import { cn } from "@asal/lib/utils";
import { hajiasalPath } from "@asal/lib/paths";
import type { OrderStatus } from "@asal/lib/server/orders";

interface OrderInfo {
  id: string;
  status: OrderStatus;
  trackingCode: string;
  total: number;
  createdAt: string;
  shippingMethod?: string;
  items: Array<{ title: string; quantity: number; weight: string }>;
}

const statusLabels: Record<OrderStatus, string> = {
  pending_payment: "در انتظار پرداخت",
  confirmed: "تأیید شده",
  processing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

const timelineSteps: {
  status: OrderStatus;
  label: string;
  icon: typeof Package;
}[] = [
  { status: "pending_payment", label: "ثبت سفارش", icon: Clock },
  { status: "confirmed", label: "تأیید سفارش", icon: CheckCircle2 },
  { status: "processing", label: "آماده‌سازی", icon: Package },
  { status: "shipped", label: "ارسال", icon: Truck },
  { status: "delivered", label: "تحویل", icon: Home },
];

const statusOrder: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

function getStepIndex(status: OrderStatus): number {
  if (status === "cancelled") return -1;
  return statusOrder.indexOf(status);
}

function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
        <XCircle size={18} strokeWidth={1.5} />
        <span>این سفارش لغو شده است.</span>
      </div>
    );
  }

  const currentIndex = getStepIndex(status);

  return (
    <ol className="mb-6 flex flex-col gap-0 sm:flex-row sm:items-start sm:justify-between">
      {timelineSteps.map((step, index) => {
        const Icon = step.icon;
        const isComplete = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li
            key={step.status}
            className="relative flex flex-1 flex-col items-center gap-2 pb-6 sm:pb-0"
          >
            {index < timelineSteps.length - 1 ? (
              <span
                className={cn(
                  "absolute start-1/2 top-5 hidden h-px w-full sm:block",
                  index < currentIndex ? "bg-amber" : "bg-border",
                )}
                aria-hidden
              />
            ) : null}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                isComplete
                  ? "border-amber bg-gold-dim text-amber"
                  : "border-border bg-surface text-muted",
                isCurrent && "ring-2 ring-amber/30",
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <span
              className={cn(
                "text-center text-xs",
                isComplete ? "font-medium text-brown" : "text-muted",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function TrackOrderForm({ initialTracking = "" }: { initialTracking?: string }) {
  const [tracking, setTracking] = useState(initialTracking);
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrder = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(
        `/api/orders?tracking=${encodeURIComponent(code.trim())}`,
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

  useEffect(() => {
    if (!initialTracking) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      setOrder(null);
      try {
        const res = await fetch(
          `/api/orders?tracking=${encodeURIComponent(initialTracking.trim())}`,
        );
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "سفارش یافت نشد");
          return;
        }
        setOrder(data.order);
      } catch {
        if (!cancelled) setError("خطا در پیگیری سفارش");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialTracking]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchOrder(tracking);
  };

  return (
    <>
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
          <OrderTimeline status={order.status} />

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-dim">
              <Package size={18} className="text-amber" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-medium text-brown" dir="ltr">
                {order.id}
              </p>
              <p className="text-sm text-muted">
                {statusLabels[order.status] ?? order.status}
              </p>
            </div>
          </div>
          <p className="mb-2 text-sm text-muted">
            کد پیگیری:{" "}
            <span dir="ltr" className="font-mono text-brown">
              {order.trackingCode}
            </span>
          </p>
          {order.shippingMethod ? (
            <p className="mb-2 text-sm text-muted">
              روش ارسال: {order.shippingMethod}
            </p>
          ) : null}
          <p className="mb-4 text-sm font-semibold text-brown">
            {formatPrice(order.total)}
          </p>
          <ul className="border-t border-border pt-4 text-sm text-muted">
            {order.items.map((item, i) => (
              <li key={i} className="py-1">
                {item.title} — {item.weight} ×{" "}
                {item.quantity.toLocaleString("fa-IR")}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialTracking = searchParams.get("tracking") ?? "";

  return <TrackOrderForm initialTracking={initialTracking} />;
}

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 md:px-6 md:py-32">
      <SectionHeading
        title="پیگیری سفارش"
        subtitle="کد پیگیری ارسال‌شده به موبایل را وارد کنید"
        className="mb-8"
      />
      <Suspense
        fallback={
          <div className="text-center text-muted">در حال بارگذاری...</div>
        }
      >
        <TrackOrderContent />
      </Suspense>
      <div className="mt-8 text-center">
        <Button href={hajiasalPath("/shop")} variant="outline" size="sm">
          بازگشت به فروشگاه
        </Button>
      </div>
    </div>
  );
}
