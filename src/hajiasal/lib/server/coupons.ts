import couponsData from "@asal/data/coupons.json";

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  active: boolean;
  label: string;
}

const coupons = couponsData as Coupon[];

export function validateCoupon(
  code: string,
  subtotal: number,
): {
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  message: string;
} {
  const normalized = code.trim().toUpperCase();
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === normalized && c.active,
  );

  if (!coupon) {
    return { valid: false, discount: 0, message: "کد تخفیف نامعتبر است" };
  }

  if (subtotal < coupon.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `حداقل مبلغ سفارش ${coupon.minOrder.toLocaleString("fa-IR")} تومان است`,
    };
  }

  let discount = 0;
  if (coupon.type === "percent") {
    discount = Math.floor((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.value;
  }

  return {
    valid: true,
    coupon,
    discount,
    message: coupon.label,
  };
}

export function getActiveCoupons(): Coupon[] {
  return coupons.filter((c) => c.active);
}
