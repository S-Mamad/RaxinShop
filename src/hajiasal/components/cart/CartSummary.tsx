"use client";

import { formatPrice } from "@asal/lib/utils";
import { useCartStore } from "@asal/store/cart";

interface CartSummaryProps {
  showShipping?: boolean;
  shippingOverride?: number;
  discount?: number;
}

export function CartSummary({
  showShipping = true,
  shippingOverride,
  discount = 0,
}: CartSummaryProps) {
  const subtotal = useCartStore((s) => s.getSubtotal());
  const defaultShipping = useCartStore((s) => s.getShippingCost());
  const shipping = shippingOverride ?? defaultShipping;
  const total = subtotal + shipping - discount;

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
      {discount > 0 ? (
        <div className="flex justify-between text-success">
          <span>تخفیف</span>
          <span>−{formatPrice(discount)}</span>
        </div>
      ) : null}
      <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-brown">
        <span>مجموع</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
