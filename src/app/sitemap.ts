import type { MetadataRoute } from "next";
import { getAllSlugs } from "@asal/lib/products";
import { hajiasalAbsoluteUrl } from "@asal/lib/paths";
import { getSiteUrl } from "@/lib/seo";

const hajiasalRoutes = [
  "",
  "/shop",
  "/about",
  "/reviews",
  "/contact",
  "/faq",
  "/track-order",
  "/authenticity",
  "/privacy",
  "/terms",
  "/shipping",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const siteUrl = getSiteUrl();

  const landingEntry: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const hajiasalEntries: MetadataRoute.Sitemap = hajiasalRoutes.map((route) => ({
    url: hajiasalAbsoluteUrl(route),
    lastModified: now,
    changeFrequency:
      route === "" || route === "/shop" ? "daily" : ("weekly" as const),
    priority: route === "" ? 0.9 : route === "/shop" ? 0.85 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: hajiasalAbsoluteUrl(`/product/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...landingEntry, ...hajiasalEntries, ...productEntries];
}
