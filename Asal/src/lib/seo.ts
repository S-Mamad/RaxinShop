import type { Product, SiteConfig } from "@/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function buildOrganizationJsonLd(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand.name,
    description: site.brand.description,
    url: siteUrl,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.footer.phone,
      email: site.footer.email,
      contactType: "customer service",
      availableLanguage: "Persian",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.footer.address,
      addressCountry: "IR",
    },
  };
}

export function buildProductJsonLd(product: Product) {
  const minPrice = Math.min(...product.weightOptions.map((w) => w.price));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    image: product.images,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "حاجی عسل",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IRR",
      lowPrice: minPrice,
      highPrice: Math.max(...product.weightOptions.map((w) => w.price)),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/product/${product.slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; href: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.href}`,
    })),
  };
}
