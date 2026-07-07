import { NextResponse } from "next/server";
import { getProductFromDb } from "@asal/lib/server/products";
import { getReviewsByProduct } from "@asal/lib/server/reviews";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const product = getProductFromDb(slug);

  if (!product) {
    return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
  }

  const reviews = getReviewsByProduct(product.id);

  return NextResponse.json({ product, reviews });
}
