import type { CartItem } from "@asal/types";
import { getProductById } from "@asal/lib/products";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";

const siteData = site as SiteConfig;

export type ShippingMethodId = "standard" | "express" | "pickup";

export function calcShippingCost(
  method: string | undefined,
  subtotal: number,
): number {
  const free =
    subtotal >= siteData.freeShippingThreshold ? 0 : siteData.shippingCost;

  if (method === "pickup") return 0;
  if (method === "express") {
    return free === 0 ? 0 : siteData.shippingCost + 35000;
  }
  return free;
}

/**
 * Rebuild cart lines from catalog prices (never trust client prices).
 */
export function rebuildOrderItems(rawItems: CartItem[]):
  | { ok: true; items: CartItem[]; subtotal: number }
  | { ok: false; message: string } {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { ok: false, message: "سبد خرید خالی است" };
  }
  if (rawItems.length > 40) {
    return { ok: false, message: "تعداد اقلام سفارش بیش از حد مجاز است" };
  }

  const items: CartItem[] = [];
  let subtotal = 0;

  for (const raw of rawItems) {
    const product = getProductById(raw.productId);
    if (!product) {
      return { ok: false, message: "یکی از محصولات یافت نشد" };
    }
    if (!product.inStock) {
      return {
        ok: false,
        message: `محصول «${product.title}» ناموجود است`,
      };
    }

    const weight =
      product.weightOptions.find(
        (w) =>
          w.grams === raw.weight?.grams || w.label === raw.weight?.label,
      ) ?? null;

    if (!weight) {
      return {
        ok: false,
        message: `وزن انتخابی برای «${product.title}» نامعتبر است`,
      };
    }

    const quantity = Math.min(20, Math.max(1, Math.round(Number(raw.quantity) || 0)));
    if (!Number.isFinite(quantity) || quantity < 1) {
      return { ok: false, message: "تعداد محصول نامعتبر است" };
    }

    items.push({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      image: product.images[0] ?? "",
      weight: {
        label: weight.label,
        grams: weight.grams,
        price: weight.price,
      },
      quantity,
    });
    subtotal += weight.price * quantity;
  }

  return { ok: true, items, subtotal };
}
