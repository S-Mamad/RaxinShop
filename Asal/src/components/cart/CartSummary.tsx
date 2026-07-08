"use client";

import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface CartSummaryProps {
  showShipping?: boolean;
}

export function CartSummary({ showShipping = true }: CartSummaryProps) {
  const subtotal = useCartStore((s) => s.getSubtotal());
  const shipping = useCartStore((s) => s.getShippingCost());
  const total = useCartStore((s) => s.getTotal());

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between text-secondary">
        <span>جمع جزء</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {showShipping ? (
        <div className="flex justify-between text-secondary">
          <span>هزینه ارسال</span>
          <span>{shipping === 0 ? "رایگان" : formatPrice(shipping)}</span>
        </div>
      ) : null}
      <div className="flex justify-between border-t border-white/5 pt-2 text-base font-bold text-primary">
        <span>مجموع</span>
        <span className="text-gold">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
