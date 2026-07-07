import { NextResponse } from "next/server";
import {
  getProductsFromDb,
  getPriceRange,
  getAllCategories,
} from "@asal/lib/server/products";
import type { ProductCategory, SortOption } from "@asal/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as ProductCategory | null;
  const sort = (searchParams.get("sort") as SortOption) || "popular";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const inStockOnly = searchParams.get("inStock") === "1";
  const search = searchParams.get("search") ?? undefined;

  let products = getProductsFromDb({
    category: category ?? undefined,
    sort,
    minPrice,
    maxPrice,
    inStockOnly,
  });

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q),
    );
  }

  return NextResponse.json({
    products,
    meta: {
      total: products.length,
      priceRange: getPriceRange(),
      categories: getAllCategories(),
    },
  });
}
