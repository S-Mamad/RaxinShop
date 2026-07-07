import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/hajiasal/admin",
        "/hajiasal/login",
        "/hajiasal/register",
        "/hajiasal/account",
        "/hajiasal/checkout",
        "/api/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
