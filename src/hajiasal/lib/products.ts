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

export function getPriceRange(catalog?: Product[]): { min: number; max: number } {
  const source = catalog ?? products;
  const prices = source.flatMap((p) => p.weightOptions.map((w) => w.price));
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
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    case "popular":
    default:
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

export function filterProducts(
  filters: ProductFilters,
  catalog?: Product[],
): Product[] {
  let result = [...(catalog ?? products)];

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

  if (filters.minRating !== undefined && filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }

  if (filters.weightGrams !== undefined && filters.weightGrams > 0) {
    result = result.filter((p) =>
      p.weightOptions.some((w) => w.grams === filters.weightGrams),
    );
  }

  return sortProducts(result, filters.sort ?? "popular");
}

export function getRelatedProducts(
  product: Product,
  limit = 4,
): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id && p.inStock)
    .slice(0, limit);
}

export const PRODUCTS_PER_PAGE = 12;

export function paginateProducts(items: Product[], page: number, perPage = PRODUCTS_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: safePage,
    totalPages,
    total: items.length,
  };
}

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q),
  );
}
