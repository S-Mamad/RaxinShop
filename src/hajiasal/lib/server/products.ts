import productsData from "@asal/data/products.json";
import type { Product, ProductCategory, ProductFilters, SortOption } from "@asal/types";
import {
  filterProducts,
  getAllProducts,
  getProductBySlug,
  getBestsellers,
  getPriceRange,
  getAllCategories,
} from "@asal/lib/products";

const products = productsData as Product[];

export function getProductsFromDb(filters?: ProductFilters): Product[] {
  if (!filters) return getAllProducts();
  return filterProducts(filters);
}

export function getProductFromDb(slug: string): Product | undefined {
  return getProductBySlug(slug);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.longDescription.toLowerCase().includes(q),
  );
}

export {
  getBestsellers,
  getPriceRange,
  getAllCategories,
  products,
};

export type { ProductCategory, SortOption, ProductFilters };
