import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/hajiasal/admin",
        "/hajiasal/seller",
        "/hajiasal/login",
        "/hajiasal/register",
        "/hajiasal/forgot-password",
        "/hajiasal/account",
        "/hajiasal/checkout",
        "/hajiasal/cart",
        "/hajiasal/wishlist",
        "/api/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
