"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@asal/store/wishlist";
import { getAllProducts } from "@asal/lib/products";
import { ProductGrid } from "@asal/components/product/ProductGrid";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Button } from "@asal/components/ui/Button";
import { hajiasalPath } from "@asal/lib/paths";

const allProducts = getAllProducts();

export function AccountWishlistClient() {
  const ids = useWishlistStore((s) => s.ids);
  const products = allProducts.filter((p) => ids.includes(p.id));

  useEffect(() => {
    if (ids.length === 0) return;
    void fetch("/api/account/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: ids, merge: true }),
    });
  }, [ids]);

  return (
    <div>
      <SectionHeading
        title="علاقه‌مندی‌ها"
        subtitle={
          products.length > 0
            ? `${products.length.toLocaleString("fa-IR")} محصول`
            : "لیست خالی است"
        }
        className="mb-8"
      />
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="py-12 text-center">
          <Button href={hajiasalPath("/shop")}>رفتن به فروشگاه</Button>
        </div>
      )}
    </div>
  );
}
