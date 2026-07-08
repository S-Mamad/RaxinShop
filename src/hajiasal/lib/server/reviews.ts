import reviewsData from "@asal/data/reviews.json";
import { readJsonFile, appendToJsonArray } from "./db";
import { getSupabaseAdmin } from "./supabase";

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const staticReviews = reviewsData as Review[];
const DYNAMIC_REVIEWS_FILE = "reviews-submissions.json";

function mapReviewRow(row: Record<string, unknown>): Review {
  const createdAt = row.created_at as string;
  const verified =
    (row.verified as boolean) ??
    (row.approved as boolean) ??
    false;
  return {
    id: String(row.id),
    productId: row.product_id as string,
    author: row.author as string,
    rating: row.rating as number,
    comment: row.comment as string,
    date: createdAt.includes("T") ? createdAt.split("T")[0] : createdAt,
    verified,
  };
}

async function getDynamicReviews(): Promise<Review[]> {
  return readJsonFile<Review[]>(DYNAMIC_REVIEWS_FILE, []);
}

export function getAllStaticReviews(): Review[] {
  return staticReviews;
}

export async function getAllReviews(): Promise<Review[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      const dynamic = data.map(mapReviewRow);
      const staticIds = new Set(staticReviews.map((r) => r.id));
      const merged = [
        ...staticReviews,
        ...dynamic.filter((r) => !staticIds.has(r.id)),
      ];
      return merged.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
  }

  const dynamic = await getDynamicReviews();
  return [...staticReviews, ...dynamic];
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("verified", true)
      .order("created_at", { ascending: false });
    if (!error && data) {
      const dynamic = data.map(mapReviewRow);
      const staticForProduct = staticReviews.filter(
        (r) => r.productId === productId && r.verified,
      );
      const staticIds = new Set(staticForProduct.map((r) => r.id));
      return [...staticForProduct, ...dynamic.filter((r) => !staticIds.has(r.id))].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
  }

  const dynamic = await getDynamicReviews();
  const merged = [...staticReviews, ...dynamic];
  return merged
    .filter((r) => r.productId === productId && r.verified)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedReviews(limit = 6): Review[] {
  return staticReviews.filter((r) => r.rating >= 4).slice(0, limit);
}

export async function createReview(input: {
  productId: string;
  author: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: input.productId,
        author: input.author,
        rating: input.rating,
        comment: input.comment,
        verified: false,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapReviewRow(data);
  }

  const review: Review = {
    id: `r-${Date.now().toString(36)}`,
    productId: input.productId,
    author: input.author,
    rating: input.rating,
    comment: input.comment,
    date: new Date().toISOString().split("T")[0],
    verified: false,
  };

  await appendToJsonArray(DYNAMIC_REVIEWS_FILE, review);
  return review;
}

export async function moderateReview(
  id: string,
  input: { approved?: boolean; adminReply?: string },
): Promise<Review | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const updates: Record<string, unknown> = {};
    if (input.approved !== undefined) updates.verified = input.approved;
    if (input.adminReply !== undefined) updates.admin_reply = input.adminReply;

    const { data, error } = await supabase
      .from("product_reviews")
      .update(updates)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error || !data) return null;
    return mapReviewRow(data);
  }

  const dynamic = await getDynamicReviews();
  const idx = dynamic.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  if (input.approved !== undefined) {
    dynamic[idx].verified = input.approved;
  }
  const { writeJsonFile } = await import("./db");
  await writeJsonFile(DYNAMIC_REVIEWS_FILE, dynamic);
  return dynamic[idx];
}
