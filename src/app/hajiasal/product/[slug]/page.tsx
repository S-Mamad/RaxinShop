import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlugAsync,
  getAllSlugsAsync,
  getRelatedProductsAsync,
} from "@asal/lib/server/products-store";
import {
  buildProductJsonLd,
  buildBreadcrumbJsonLd,
} from "@asal/lib/seo";
import { ProductDetailClient } from "@asal/components/product/ProductDetailClient";
import { getReviewsByProduct } from "@asal/lib/server/reviews";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugsAsync();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugAsync(slug);
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
  const product = await getProductBySlugAsync(slug);
  if (!product) notFound();

  const productJsonLd = buildProductJsonLd(product);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "خانه", href: "/hajiasal" },
    { name: "فروشگاه", href: "/hajiasal/shop" },
    { name: product.title, href: `/hajiasal/product/${slug}` },
  ]);
  const initialReviews = await getReviewsByProduct(product.id);
  const relatedProducts = await getRelatedProductsAsync(product, 6);

  return (
    <div className="pdp-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient
        product={product}
        initialReviews={initialReviews}
        relatedProducts={relatedProducts}
      />
    </div>
  );
}
