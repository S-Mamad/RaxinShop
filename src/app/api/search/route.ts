import { NextResponse } from "next/server";
import { searchProducts } from "@asal/lib/server/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [], query: q });
  }

  const results = searchProducts(q).slice(0, 12);
  return NextResponse.json({ results, query: q, total: results.length });
}
