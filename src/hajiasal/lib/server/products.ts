import type { Product, ProductCategory, ProductFilters, SortOption } from "@asal/types";
import {
  filterProducts,
  getAllCategories,
  getPriceRange,
  getAllProducts,
  getProductBySlug,
  getBestsellers,
  searchProducts as searchProductsSync,
} from "@asal/lib/products";
import {
  getAllProductsAsync,
  getProductBySlugAsync,
  filterProductsAsync,
  getBestsellersAsync,
  searchProductsAsync,
  updateProductAsync,
  createProductAsync,
  deleteProductAsync,
  getProductByIdAsync,
} from "./products-store";

export {
  getAllProductsAsync,
  getProductBySlugAsync,
  getProductByIdAsync,
  filterProductsAsync,
  getBestsellersAsync,
  searchProductsAsync,
  updateProductAsync,
  createProductAsync,
  deleteProductAsync,
  isProductsDbEnabled,
} from "./products-store";

export function getProductsFromDb(filters?: ProductFilters): Product[] {
  if (!filters) return getAllProducts();
  return filterProducts(filters);
}

export function getProductFromDb(slug: string): Product | undefined {
  return getProductBySlug(slug);
}

export function searchProducts(query: string): Product[] {
  return searchProductsSync(query);
}

export { getBestsellers, getPriceRange, getAllCategories };

export type { ProductCategory, SortOption, ProductFilters };
