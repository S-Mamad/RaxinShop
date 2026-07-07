import productsData from "@asal/data/products.json";
import type {
  Product,
  ProductCategory,
  ProductFilters,
  WeightOption,
} from "@asal/types";
import {
  filterProducts as filterProductsSync,
  getAllProducts as getAllProductsSync,
  getProductBySlug as getProductBySlugSync,
  getBestsellers as getBestsellersSync,
  getAllSlugs as getAllSlugsSync,
} from "@asal/lib/products";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";
import { revalidatePath } from "next/cache";

const staticProducts = productsData as Product[];

const categoryLabels: Record<string, string> = {};
for (const p of staticProducts) {
  categoryLabels[p.category] = p.categoryLabel;
}

function mapRowToProduct(row: Record<string, unknown>): Product {
  const honeyMeta = (row.honey_meta as Record<string, unknown>) ?? {};
  const categoryId = row.category_id as ProductCategory;
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    shortDescription: (row.short_description as string) ?? "",
    longDescription: (row.description as string) ?? "",
    category: categoryId,
    categoryLabel: categoryLabels[categoryId] ?? categoryId,
    images: (row.images as string[]) ?? [],
    weightOptions: (row.weight_options as WeightOption[]) ?? [],
    discountPrice: row.discount_price
      ? Number(row.discount_price)
      : undefined,
    inStock: Boolean(row.in_stock),
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    isBestseller: Boolean(row.bestseller),
    isNew: Boolean(row.featured),
    ingredients: (honeyMeta.ingredients as string) ?? undefined,
    shippingInfo: (honeyMeta.shippingInfo as string) ?? undefined,
    createdAt: row.created_at as string | undefined,
  };
}

function mapProductToRow(product: Partial<Product> & { id: string; slug: string; title: string }) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    short_description: product.shortDescription ?? "",
    description: product.longDescription ?? "",
    category_id: product.category,
    images: product.images ?? [],
    weight_options: product.weightOptions ?? [],
    discount_price: product.discountPrice ?? null,
    in_stock: product.inStock ?? true,
    featured: product.isNew ?? false,
    bestseller: product.isBestseller ?? false,
    rating: product.rating ?? 0,
    review_count: product.reviewCount ?? 0,
    honey_meta: {
      ingredients: product.ingredients,
      shippingInfo: product.shippingInfo,
    },
    updated_at: new Date().toISOString(),
  };
}

async function fetchAllFromSupabase(): Promise<Product[] | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data?.length) return null;
  return data.map((row) => mapRowToProduct(row));
}

export async function getAllProductsAsync(): Promise<Product[]> {
  const fromDb = await fetchAllFromSupabase();
  if (fromDb?.length) return fromDb;
  return getAllProductsSync();
}

export async function getProductBySlugAsync(
  slug: string,
): Promise<Product | undefined> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return mapRowToProduct(data);
  }
  return getProductBySlugSync(slug);
}

export async function getProductByIdAsync(
  id: string,
): Promise<Product | undefined> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (data) return mapRowToProduct(data);
  }
  return staticProducts.find((p) => p.id === id);
}

export async function getAllSlugsAsync(): Promise<string[]> {
  const products = await getAllProductsAsync();
  return products.map((p) => p.slug);
}

export async function filterProductsAsync(
  filters: ProductFilters,
): Promise<Product[]> {
  const catalog = await getAllProductsAsync();
  return filterProductsSync(filters, catalog);
}

export async function getBestsellersAsync(limit = 8): Promise<Product[]> {
  const catalog = await getAllProductsAsync();
  return catalog.filter((p) => p.isBestseller && p.inStock).slice(0, limit);
}

export async function getRelatedProductsAsync(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const catalog = await getAllProductsAsync();
  return catalog
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id &&
        p.inStock,
    )
    .slice(0, limit);
}

export async function searchProductsAsync(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const catalog = await getAllProductsAsync();
  return catalog.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.longDescription.toLowerCase().includes(q),
  );
}

export async function updateProductAsync(
  id: string,
  updates: Partial<Product>,
): Promise<Product | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase is required to update products in production");
  }

  const existing = await getProductByIdAsync(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates };
  const row = mapProductToRow(merged);

  const { data, error } = await supabase
    .from("products")
    .update(row)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error || !data) return null;

  revalidateProductPaths(merged.slug);
  return mapRowToProduct(data);
}

export async function createProductAsync(
  product: Product,
): Promise<Product | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase is required to create products");
  }

  const row = {
    ...mapProductToRow(product),
    created_at: product.createdAt ?? new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select("*")
    .single();

  if (error || !data) return null;
  revalidateProductPaths(product.slug);
  return mapRowToProduct(data);
}

export async function deleteProductAsync(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const existing = await getProductByIdAsync(id);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (!error && existing) revalidateProductPaths(existing.slug);
  return !error;
}

function revalidateProductPaths(slug: string) {
  revalidatePath("/hajiasal/shop");
  revalidatePath(`/hajiasal/product/${slug}`);
  revalidatePath("/hajiasal");
}

export function isProductsDbEnabled(): boolean {
  return isSupabaseConfigured();
}

export { getBestsellersSync, getAllSlugsSync };
