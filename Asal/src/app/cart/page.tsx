"use client";

import { Button } from "@/components/ui/Button";
import { CartItemRow } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const progress = useCartStore((s) => s.getFreeShippingProgress());
  const amountRemaining = useCartStore((s) => s.getAmountUntilFreeShipping());
  const isFree = useCartStore((s) => s.isFreeShipping());

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <SectionHeading title="سبد خرید" className="mb-8" />

      <div className="rounded-2xl border border-white/6 bg-surface p-5 md:p-8">
        <CartItemRow />

        {itemCount > 0 ? (
          <div className="mt-8 flex flex-col gap-6 border-t border-white/5 pt-6">
            <FreeShippingBar
              progress={progress}
              amountRemaining={amountRemaining}
              isFree={isFree}
            />
            <CartSummary />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/checkout" className="flex-1">
                تکمیل خرید
              </Button>
              <Button href="/shop" variant="outline" className="flex-1">
                ادامه خرید
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <Button href="/shop">رفتن به فروشگاه</Button>
          </div>
        )}
      </div>
    </div>
  );
}
