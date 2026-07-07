import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getFeaturedReviews,
  getReviewsByProduct,
  createReview,
} from "@asal/lib/server/reviews";

const reviewSchema = z.object({
  productId: z.string().min(1),
  author: z.string().min(2),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (productId) {
    const reviews = await getReviewsByProduct(productId);
    return NextResponse.json({ reviews });
  }

  return NextResponse.json({ reviews: getFeaturedReviews() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "اطلاعات نظر نامعتبر است" },
        { status: 400 },
      );
    }

    const review = await createReview(parsed.data);
    return NextResponse.json({ success: true, review });
  } catch {
    return NextResponse.json(
      { success: false, message: "خطا در ثبت نظر" },
      { status: 500 },
    );
  }
}
