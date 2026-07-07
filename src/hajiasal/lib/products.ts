import productsData from "@asal/data/products.json";
import type { Product, ProductCategory, ProductFilters, SortOption } from "@asal/types";

const products = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getBestsellers(limit = 8): Product[] {
  return products.filter((p) => p.isBestseller && p.inStock).slice(0, limit);
}

export function getNewProducts(limit = 6): Product[] {
  return products.filter((p) => p.isNew && p.inStock).slice(0, limit);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getMinPrice(product: Product): number {
  return Math.min(...product.weightOptions.map((w) => w.price));
}

export function getMaxPrice(product: Product): number {
  return Math.max(...product.weightOptions.map((w) => w.price));
}

export function getAllCategories(): ProductCategory[] {
  const cats = new Set(products.map((p) => p.category));
  return Array.from(cats);
}

export function getPriceRange(): { min: number; max: number } {
  const prices = products.flatMap((p) => p.weightOptions.map((w) => w.price));
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

function sortProducts(items: Product[], sort: SortOption): Product[] {
  const sorted = [...items];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
    case "newest":
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case "popular":
    default:
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

export function filterProducts(filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock);
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => getMinPrice(p) >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => getMinPrice(p) <= filters.maxPrice!);
  }

  return sortProducts(result, filters.sort ?? "popular");
}

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}
