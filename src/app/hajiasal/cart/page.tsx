"use client";

import { Button } from "@asal/components/ui/Button";
import { CartItemRow } from "@asal/components/cart/CartItem";
import { CartSummary } from "@asal/components/cart/CartSummary";
import { FreeShippingBar } from "@asal/components/cart/FreeShippingBar";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { useCartStore } from "@asal/store/cart";

export default function CartPage() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const progress = useCartStore((s) => s.getFreeShippingProgress());
  const amountRemaining = useCartStore((s) => s.getAmountUntilFreeShipping());
  const isFree = useCartStore((s) => s.isFreeShipping());

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <SectionHeading title="سبد خرید" className="mb-8" />

      <div className="rounded-2xl border border-border bg-surface p-5 md:p-8">
        <CartItemRow />

        {itemCount > 0 ? (
          <div className="mt-8 flex flex-col gap-6 border-t border-border pt-6">
            <FreeShippingBar
              progress={progress}
              amountRemaining={amountRemaining}
              isFree={isFree}
            />
            <CartSummary />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/hajiasal/checkout" className="flex-1">
                تکمیل خرید
              </Button>
              <Button href="/hajiasal/shop" variant="outline" className="flex-1">
                ادامه خرید
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <Button href="/hajiasal/shop">رفتن به فروشگاه</Button>
          </div>
        )}
      </div>
    </div>
  );
}
