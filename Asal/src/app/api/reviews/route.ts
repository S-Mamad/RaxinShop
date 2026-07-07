import { NextResponse } from "next/server";
import { getFeaturedReviews } from "@/lib/server/reviews";

export async function GET() {
  return NextResponse.json({ reviews: getFeaturedReviews() });
}
