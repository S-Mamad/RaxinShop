import type { Product, SiteConfig } from "@asal/types";
import { hajiasalAbsoluteUrl } from "@asal/lib/paths";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function buildOrganizationJsonLd(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand.name,
    description: site.brand.description,
    url: hajiasalAbsoluteUrl(),
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
  const jsonLd: Record<string, unknown> = {
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
      url: hajiasalAbsoluteUrl(`/product/${product.slug}`),
    },
  };

  if (product.reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return jsonLd;
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

export function buildWebSiteJsonLd(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand.name,
    url: hajiasalAbsoluteUrl(),
    description: site.brand.description,
    inLanguage: "fa-IR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${hajiasalAbsoluteUrl("/shop")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildFaqJsonLd(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
