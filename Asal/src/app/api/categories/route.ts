import { NextResponse } from "next/server";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";

const siteData = site as SiteConfig;

export async function GET() {
  return NextResponse.json({
    categories: siteData.categories,
    freeShippingThreshold: siteData.freeShippingThreshold,
    shippingCost: siteData.shippingCost,
  });
}
