import { getSupabaseAdmin } from "./supabase";
import categoriesData from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";

export interface CategoryRecord {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
}

const siteCategories = (categoriesData as SiteConfig).categories;

function mapRow(row: Record<string, unknown>): CategoryRecord {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string) ?? undefined,
    image: (row.image as string) ?? undefined,
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export async function getAllCategoriesAsync(): Promise<CategoryRecord[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data?.length) return data.map(mapRow);
  }

  return siteCategories.map((c, i) => ({
    id: c.id,
    slug: c.id,
    name: c.label,
    description: c.description,
    image: c.image,
    sortOrder: i,
  }));
}

export async function upsertCategoryAsync(
  category: CategoryRecord,
): Promise<CategoryRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("categories")
    .upsert({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description ?? null,
      image: category.image ?? null,
      sort_order: category.sortOrder,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return mapRow(data);
}

export async function deleteCategoryAsync(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;
  const { error } = await supabase.from("categories").delete().eq("id", id);
  return !error;
}
