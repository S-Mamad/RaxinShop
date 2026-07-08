"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";

export function CartItemRow() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-secondary">
        سبد خرید شما خالی است
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li
          key={`${item.productId}-${item.weight.grams}`}
          className="flex gap-3"
        >
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
            <ProductImage
              src={item.image}
              alt={item.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <p className="truncate text-sm font-medium text-primary">
                {item.title}
              </p>
              <p className="text-xs text-secondary">{item.weight.label}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 rounded-lg bg-surface-elevated px-1">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.weight.grams,
                      item.quantity - 1,
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center text-secondary hover:text-primary"
                  aria-label="کاهش"
                >
                  <Minus size={14} strokeWidth={1.5} />
                </button>
                <span className="min-w-[1.5rem] text-center text-sm text-primary">
                  {item.quantity.toLocaleString("fa-IR")}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.weight.grams,
                      item.quantity + 1,
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center text-secondary hover:text-primary"
                  aria-label="افزایش"
                >
                  <Plus size={14} strokeWidth={1.5} />
                </button>
              </div>
              <p className="text-sm font-semibold text-gold">
                {formatPrice(item.weight.price * item.quantity)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.weight.grams)}
            className="self-start text-dim hover:text-red-400"
            aria-label="حذف"
          >
            <Trash2 size={16} strokeWidth={1.5} />
          </button>
        </li>
      ))}
    </ul>
  );
}
