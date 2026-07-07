import couponsData from "@asal/data/coupons.json";
import type { Coupon } from "./coupons";

const coupons = couponsData as Coupon[];

export function getAllCoupons(): Coupon[] {
  return coupons;
}
