import type { MetadataRoute } from "next";
import { getAllSlugs } from "@asal/lib/products";
import { hajiasalAbsoluteUrl } from "@asal/lib/paths";

const staticRoutes = [
  "",
  "/shop",
  "/about",
  "/contact",
  "/faq",
  "/cart",
  "/checkout",
  "/track-order",
  "/wishlist",
  "/authenticity",
  "/privacy",
  "/terms",
  "/shipping",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: hajiasalAbsoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "" || route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: hajiasalAbsoluteUrl(`/product/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
