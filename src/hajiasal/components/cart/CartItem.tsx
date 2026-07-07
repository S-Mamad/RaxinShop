"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash } from "@phosphor-icons/react";
import { useCartStore } from "@asal/store/cart";
import { formatPrice } from "@asal/lib/utils";
import { ProductImage } from "@asal/components/ui/ProductImage";
import { Icon } from "@asal/components/ui/Icon";
import { hajiasalPath } from "@asal/lib/paths";
import type { CartItem } from "@asal/types";

export function CartItemRow() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const addItem = useCartStore((s) => s.addItem);
  const [removed, setRemoved] = useState<CartItem | null>(null);

  useEffect(() => {
    if (!removed) return;
    const t = setTimeout(() => setRemoved(null), 5000);
    return () => clearTimeout(t);
  }, [removed]);

  if (items.length === 0 && !removed) {
    return (
      <p className="py-12 text-center text-sm text-muted">
        سبد خرید شما خالی است
      </p>
    );
  }

  return (
    <>
      {removed ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-cream-dark px-4 py-3 text-sm">
          <span className="text-muted">حذف شد</span>
          <button
            type="button"
            className="font-medium text-accent hover:underline"
            onClick={() => {
              addItem(removed, removed.quantity);
              setRemoved(null);
            }}
          >
            بازگرداندن
          </button>
        </div>
      ) : null}
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.weight.grams}`}
            className="flex gap-4"
          >
            <Link
              href={hajiasalPath(`/product/${item.slug}`)}
              className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl bg-cream-dark"
            >
              <ProductImage
                src={item.image}
                alt={item.title}
                fill
                sizes="104px"
                className="object-cover"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <Link
                  href={hajiasalPath(`/product/${item.slug}`)}
                  className="line-clamp-2 text-sm font-medium text-brown hover:text-accent"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-muted">{item.weight.label}</p>
                <p className="text-xs text-dim">
                  {formatPrice(item.weight.price)} ×{" "}
                  {item.quantity.toLocaleString("fa-IR")}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 rounded-full border border-border bg-cream px-1 py-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.weight.grams,
                        item.quantity - 1,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-brown"
                    aria-label="کاهش"
                  >
                    <Icon icon={Minus} size={16} />
                  </button>
                  <span className="min-w-[1.75rem] text-center text-sm font-medium tabular-nums">
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
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-brown"
                    aria-label="افزایش"
                  >
                    <Icon icon={Plus} size={16} />
                  </button>
                </div>
                <p className="text-sm font-semibold tabular-nums text-brown">
                  {formatPrice(item.weight.price * item.quantity)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setRemoved(item);
                removeItem(item.productId, item.weight.grams);
              }}
              className="self-start text-dim hover:text-error"
              aria-label="حذف"
            >
              <Icon icon={Trash} size={18} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
