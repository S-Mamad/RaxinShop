import couponsData from "@asal/data/coupons.json";
import { getSupabaseAdmin } from "./supabase";

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  active: boolean;
  label: string;
}

const staticCoupons = couponsData as Coupon[];

function mapCouponRow(row: Record<string, unknown>): Coupon {
  return {
    code: row.code as string,
    type: row.type as "percent" | "fixed",
    value: Number(row.value),
    minOrder: Number(row.min_order),
    maxDiscount: row.max_discount ? Number(row.max_discount) : undefined,
    active: Boolean(row.active),
    label: (row.label as string) ?? row.code as string,
  };
}

export async function getAllCouponsAsync(): Promise<Coupon[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase.from("coupons").select("*");
    if (data?.length) return data.map(mapCouponRow);
  }
  return staticCoupons;
}

function computeDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === "percent") {
    let discount = Math.floor((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
    return discount;
  }
  return coupon.value;
}

export async function validateCouponAsync(
  code: string,
  subtotal: number,
): Promise<{
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  message: string;
}> {
  const normalized = code.trim().toUpperCase();
  const coupons = await getAllCouponsAsync();
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

  const discount = computeDiscount(coupon, subtotal);
  return {
    valid: true,
    coupon,
    discount,
    message: coupon.label,
  };
}

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
  const coupon = staticCoupons.find(
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

  return {
    valid: true,
    coupon,
    discount: computeDiscount(coupon, subtotal),
    message: coupon.label,
  };
}

export async function getActiveCouponsAsync(): Promise<Coupon[]> {
  const coupons = await getAllCouponsAsync();
  return coupons.filter((c) => c.active);
}

export function getActiveCoupons(): Coupon[] {
  return staticCoupons.filter((c) => c.active);
}
