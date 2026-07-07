import type { Product } from "@asal/types";
import { getRelatedProducts } from "@asal/lib/products";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { ProductGrid } from "@asal/components/product/ProductGrid";

interface RelatedProductsProps {
  product: Product;
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const related = getRelatedProducts(product);
  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <SectionHeading
        title="محصولات مرتبط"
        subtitle="دیگر محصولات این دسته"
        className="mb-8"
      />
      <ProductGrid products={related} />
    </section>
  );
}
