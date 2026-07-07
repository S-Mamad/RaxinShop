import { NextResponse } from "next/server";
import { isAdminRequestAuthenticatedAsync } from "@asal/lib/server/admin";
import { getAllProducts } from "@asal/lib/products";

export async function GET(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const products = getAllProducts();
  return NextResponse.json({ products });
}
