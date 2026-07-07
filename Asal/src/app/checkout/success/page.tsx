"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "—";
  const trackingCode = searchParams.get("tracking") ?? "";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-dim">
        <CheckCircle size={32} strokeWidth={1.5} className="text-amber" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-brown">
        سفارش شما ثبت شد
      </h1>
      <p className="mb-6 text-muted">
        از خرید شما سپاسگزاریم. سفارش به زودی آماده و ارسال می‌شود.
      </p>
      <p className="mb-8 rounded-xl bg-surface px-6 py-3 text-sm space-y-1">
        <span className="block">
          <span className="text-muted">شماره سفارش: </span>
          <span className="font-mono font-bold text-brown" dir="ltr">{orderId}</span>
        </span>
        {trackingCode ? (
          <span className="block">
            <span className="text-muted">کد پیگیری: </span>
            <span className="font-mono font-bold text-amber" dir="ltr">{trackingCode}</span>
          </span>
        ) : null}
      </p>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row">
        {trackingCode ? (
          <Button href={`/track-order`} variant="outline">
            پیگیری سفارش
          </Button>
        ) : null}
        <Button href="/shop">ادامه خرید</Button>
        <Button href="/" variant="outline">
          بازگشت به خانه
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-muted">
          در حال بارگذاری...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
