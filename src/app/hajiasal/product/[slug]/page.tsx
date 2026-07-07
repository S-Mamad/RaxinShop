import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getProductBySlug,
} from "@asal/lib/products";
import {
  buildProductJsonLd,
  buildBreadcrumbJsonLd,
} from "@asal/lib/seo";
import { ProductDetailClient } from "@asal/components/product/ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "محصول یافت نشد" };

  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: product.images,
    },
    alternates: { canonical: `/hajiasal/product/${slug}` },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productJsonLd = buildProductJsonLd(product);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "خانه", href: "/hajiasal" },
    { name: "فروشگاه", href: "/hajiasal/shop" },
    { name: product.title, href: `/hajiasal/product/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
