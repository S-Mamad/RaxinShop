"use client";

import { formatPrice } from "@asal/lib/utils";
import { useCartStore } from "@asal/store/cart";

interface CartSummaryProps {
  showShipping?: boolean;
}

export function CartSummary({ showShipping = true }: CartSummaryProps) {
  const subtotal = useCartStore((s) => s.getSubtotal());
  const shipping = useCartStore((s) => s.getShippingCost());
  const total = useCartStore((s) => s.getTotal());

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between text-muted">
        <span>جمع جزء</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {showShipping ? (
        <div className="flex justify-between text-muted">
          <span>هزینه ارسال</span>
          <span>{shipping === 0 ? "رایگان" : formatPrice(shipping)}</span>
        </div>
      ) : null}
      <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-brown">
        <span>مجموع</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
