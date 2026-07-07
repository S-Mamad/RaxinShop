import { NextResponse } from "next/server";
import { getFeaturedReviews } from "@asal/lib/server/reviews";

export async function GET() {
  return NextResponse.json({ reviews: getFeaturedReviews() });
}
