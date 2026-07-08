"use client";

import { getAllProducts } from "@asal/lib/products";
import { useWishlistStore } from "@asal/store/wishlist";
import { ProductGrid } from "@asal/components/product/ProductGrid";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Button } from "@asal/components/ui/Button";

const allProducts = getAllProducts();

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const products = allProducts.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <SectionHeading
        title="علاقه‌مندی‌ها"
        subtitle={
          products.length > 0
            ? `${products.length.toLocaleString("fa-IR")} محصول ذخیره شده`
            : "لیست علاقه‌مندی‌های شما خالی است"
        }
        className="mb-10"
      />
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="py-16 text-center">
          <Button href="/hajiasal/shop">رفتن به فروشگاه</Button>
        </div>
      )}
    </div>
  );
}
