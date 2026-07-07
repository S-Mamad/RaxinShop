"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@asal/components/ui/Button";
import { CartItemRow } from "@asal/components/cart/CartItem";
import { CartSummary } from "@asal/components/cart/CartSummary";
import { FreeShippingBar } from "@asal/components/cart/FreeShippingBar";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Input } from "@asal/components/ui/Input";
import { ProductCard } from "@asal/components/product/ProductCard";
import { useCartStore } from "@asal/store/cart";
import { useAuth } from "@asal/hooks/useAuth";
import { getBestsellers } from "@asal/lib/products";
import { hajiasalPath } from "@asal/lib/paths";

const bestsellers = getBestsellers(3);

export default function CartPage() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const progress = useCartStore((s) => s.getFreeShippingProgress());
  const amountRemaining = useCartStore((s) => s.getAmountUntilFreeShipping());
  const isFree = useCartStore((s) => s.isFreeShipping());
  const subtotal = useCartStore((s) => s.getSubtotal());
  const { isLoggedIn } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        setCouponMessage(data.message);
      } else {
        setDiscount(0);
        setCouponMessage(data.message);
      }
    } catch {
      setCouponMessage("خطا در بررسی کد تخفیف");
    }
  };

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <SectionHeading title="سبد خرید" subtitle="سبد شما خالی است" className="mb-8" />
        <Button href={hajiasalPath("/shop")} className="mb-12">
          رفتن به فروشگاه
        </Button>
        <h2 className="mb-6 text-lg font-semibold text-brown">پرفروش‌ترین‌ها</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <SectionHeading
        title="سبد خرید"
        subtitle={`${itemCount.toLocaleString("fa-IR")} قلم`}
        className="mb-8"
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface p-5 md:p-8">
            <CartItemRow />
          </div>

          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-brown">
              شاید دوست داشته باشید
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {bestsellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-6">
            <FreeShippingBar
              progress={progress}
              amountRemaining={amountRemaining}
              isFree={isFree}
            />
            <div className="mt-6 flex gap-2">
              <Input
                placeholder="کد تخفیف"
                dir="ltr"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => void applyCoupon()}>
                اعمال
              </Button>
            </div>
            {couponMessage ? (
              <p className="mt-2 text-xs text-muted">{couponMessage}</p>
            ) : null}
            <div className="mt-6">
              <CartSummary discount={discount} />
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                href={
                  isLoggedIn
                    ? hajiasalPath("/checkout")
                    : `${hajiasalPath("/login")}?redirect=${encodeURIComponent(hajiasalPath("/checkout"))}`
                }
                className="w-full"
              >
                تکمیل خرید
              </Button>
              {!isLoggedIn ? (
                <p className="text-center text-xs text-muted">
                  برای تکمیل خرید{" "}
                  <Link href={hajiasalPath("/login")} className="text-accent hover:underline">
                    وارد شوید
                  </Link>
                </p>
              ) : null}
              <Button href={hajiasalPath("/shop")} variant="outline" className="w-full">
                ادامه خرید
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
