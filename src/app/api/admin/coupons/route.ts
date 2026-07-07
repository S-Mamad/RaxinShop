import { NextResponse } from "next/server";
import { isAdminRequestAuthenticatedAsync } from "@asal/lib/server/admin";
import { getAllCoupons } from "@asal/lib/server/coupons-admin";

export async function GET(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const coupons = await getAllCoupons();
  return NextResponse.json({ coupons });
}
