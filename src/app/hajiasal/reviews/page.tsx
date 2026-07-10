import type { Metadata } from "next";
import { getVerifiedReviews } from "@asal/lib/server/reviews";
import { getProductById } from "@asal/lib/products";
import { ReviewsPageClient } from "@asal/components/reviews/ReviewsPageClient";
import { hajiasalPath } from "@asal/lib/paths";
import { GENERAL_REVIEW_PRODUCT_ID } from "@asal/lib/review-constants";

export const metadata: Metadata = {
  title: "نظرات مشتریان",
  description:
    "تجربه واقعی خریداران حاجی عسل؛ نظرات تأییدشده درباره اصالت، طعم و ارسال.",
  alternates: { canonical: hajiasalPath("/reviews") },
};

export default async function ReviewsPage() {
  const reviews = await getVerifiedReviews();

  const enriched = reviews.map((review) => {
    if (review.productId === GENERAL_REVIEW_PRODUCT_ID) {
      return review;
    }
    const product = getProductById(review.productId);
    return {
      ...review,
      productTitle: product?.title,
      productSlug: product?.slug,
    };
  });

  const averageRating =
    enriched.length > 0
      ? enriched.reduce((sum, r) => sum + r.rating, 0) / enriched.length
      : 0;
  const fiveStarShare =
    enriched.length > 0
      ? (enriched.filter((r) => r.rating === 5).length / enriched.length) * 100
      : 0;

  return (
    <ReviewsPageClient
      reviews={enriched}
      averageRating={averageRating}
      fiveStarShare={fiveStarShare}
    />
  );
}
