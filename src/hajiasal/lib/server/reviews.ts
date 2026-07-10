import reviewsData from "@asal/data/reviews.json";
import { GENERAL_REVIEW_PRODUCT_ID } from "@asal/lib/review-constants";
import { readJsonFile, writeJsonFile } from "./db";
import {
  memoryGetReviews,
  memoryPushReview,
  memorySetReviews,
  memoryUpdateReview,
} from "./memory-store";
import { canUseFilesystemPersistence } from "./production";
import { getSupabaseAdmin } from "./supabase";
import { getProductById } from "@asal/lib/products";

export { GENERAL_REVIEW_PRODUCT_ID } from "@asal/lib/review-constants";

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
  const createdAt = (row.created_at as string) ?? (row.date as string) ?? "";
  const verified =
    (row.verified as boolean) ?? (row.approved as boolean) ?? false;
  return {
    id: String(row.id),
    productId: (row.product_id as string) ?? (row.productId as string) ?? GENERAL_REVIEW_PRODUCT_ID,
    author: String(row.author ?? "").trim(),
    rating: Number(row.rating ?? 0),
    comment: String(row.comment ?? "").trim(),
    date: createdAt.includes("T") ? createdAt.split("T")[0]! : createdAt || new Date().toISOString().slice(0, 10),
    verified,
  };
}

function sanitizeText(value: string, max: number): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

async function getDynamicReviews(): Promise<Review[]> {
  if (canUseFilesystemPersistence()) {
    return readJsonFile<Review[]>(DYNAMIC_REVIEWS_FILE, []);
  }
  return memoryGetReviews<Review>();
}

async function saveDynamicReviews(reviews: Review[]): Promise<void> {
  if (canUseFilesystemPersistence()) {
    await writeJsonFile(DYNAMIC_REVIEWS_FILE, reviews);
    return;
  }
  memorySetReviews(reviews);
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
      return [...staticReviews, ...dynamic.filter((r) => !staticIds.has(r.id))].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
  }

  const dynamic = await getDynamicReviews();
  return [...staticReviews, ...dynamic].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const all = await getAllReviews();
  return all
    .filter((r) => r.productId === productId && r.verified)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedReviews(limit = 6): Review[] {
  return staticReviews.filter((r) => r.verified && r.rating >= 4).slice(0, limit);
}

export async function getFeaturedReviewsAsync(limit = 8): Promise<Review[]> {
  const all = await getAllReviews();
  return all
    .filter((r) => r.verified && r.rating >= 4)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export async function getVerifiedReviews(): Promise<Review[]> {
  const all = await getAllReviews();
  return all
    .filter((r) => r.verified && r.comment.length > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createReview(input: {
  productId?: string;
  author: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const author = sanitizeText(input.author, 60);
  const comment = sanitizeText(input.comment, 500);
  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));
  let productId = (input.productId ?? GENERAL_REVIEW_PRODUCT_ID).trim();

  if (productId !== GENERAL_REVIEW_PRODUCT_ID && !getProductById(productId)) {
    productId = GENERAL_REVIEW_PRODUCT_ID;
  }

  if (author.length < 2) throw new Error("نام نامعتبر است");
  if (comment.length < 10) throw new Error("متن نظر کوتاه است");

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: productId,
        author,
        rating,
        comment,
        verified: false,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapReviewRow(data);
  }

  const review: Review = {
    id: `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    productId,
    author,
    rating,
    comment,
    date: new Date().toISOString().slice(0, 10),
    verified: false,
  };

  if (canUseFilesystemPersistence()) {
    const dynamic = await getDynamicReviews();
    dynamic.unshift(review);
    await saveDynamicReviews(dynamic);
  } else {
    memoryPushReview(review);
  }

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

  if (canUseFilesystemPersistence()) {
    const dynamic = await getDynamicReviews();
    const idx = dynamic.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    if (input.approved !== undefined) {
      dynamic[idx]!.verified = input.approved;
    }
    await saveDynamicReviews(dynamic);
    return dynamic[idx]!;
  }

  if (input.approved === undefined) return null;
  return memoryUpdateReview<Review>(id, { verified: input.approved });
}
