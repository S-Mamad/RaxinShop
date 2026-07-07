import reviewsData from "@/data/reviews.json";

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const reviews = reviewsData as Review[];

export function getReviewsByProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getFeaturedReviews(limit = 6): Review[] {
  return reviews.filter((r) => r.rating >= 4).slice(0, limit);
}
