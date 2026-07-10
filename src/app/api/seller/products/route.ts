import { NextResponse } from "next/server";
import {
  getSellerFromRequest,
  getSellerProducts,
} from "@asal/lib/server/sellers";

export async function GET(request: Request) {
  const seller = await getSellerFromRequest(request);
  if (!seller) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const products = await getSellerProducts(seller.id);
  return NextResponse.json({ products });
}
