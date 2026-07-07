"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart, ShoppingBag } from "@phosphor-icons/react";
import type { Product } from "@asal/types";
import { getMinPrice } from "@asal/lib/products";
import { hajiasalPath } from "@asal/lib/paths";
import { Badge } from "@asal/components/ui/Badge";
import { PriceDisplay } from "@asal/components/ui/PriceDisplay";
import { RatingStars } from "@asal/components/ui/RatingStars";
import { ProductImage } from "@asal/components/ui/ProductImage";
import { useWishlistStore } from "@asal/store/wishlist";
import { useCartStore } from "@asal/store/cart";
import { cn } from "@asal/lib/utils";

interface ProductCardProps {
  product: Product;
  quickAdd?: boolean;
}

export function ProductCard({ product, quickAdd = false }: ProductCardProps) {
  const minPrice = getMinPrice(product);
  const defaultWeight = product.weightOptions[0];
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock || !defaultWeight) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      image: product.images[0],
      weight: defaultWeight,
    });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="group"
    >
      <div className="bezel-outer transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]">
        <div className="bezel-inner bg-surface">
          <Link href={hajiasalPath(`/product/${product.slug}`)} className="block">
            <div className="relative aspect-square overflow-hidden bg-cream-dark">
              <ProductImage
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
              />
              <div className="absolute start-3 top-3 flex flex-col gap-1.5">
                {product.isBestseller ? (
                  <Badge variant="bestseller">پرفروش</Badge>
                ) : null}
                {product.isNew ? <Badge variant="new">جدید</Badge> : null}
                {!product.inStock ? (
                  <Badge variant="out-of-stock">ناموجود</Badge>
                ) : null}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.id);
                }}
                className={cn(
                  "absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all",
                  isWishlisted
                    ? "bg-amber text-white"
                    : "bg-white/80 text-brown hover:bg-white",
                )}
                aria-label="علاقه‌مندی"
              >
                <Heart
                  size={16}
                  weight={isWishlisted ? "fill" : "light"}
                />
              </button>
              {quickAdd && product.inStock ? (
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full bg-brown/90 py-2.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0"
                  aria-label={`افزودن ${product.title} به سبد`}
                >
                  <ShoppingBag size={14} weight="light" />
                  افزودن سریع
                </button>
              ) : null}
            </div>
            <div className="p-4">
              <p className="mb-1 text-xs text-muted">{product.categoryLabel}</p>
              <h3 className="mb-2 line-clamp-1 text-sm font-semibold text-brown">
                {product.title}
              </h3>
              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
                className="mb-3"
              />
              <PriceDisplay
                price={minPrice}
                discountPrice={product.discountPrice}
                size="sm"
              />
            </div>
          </Link>
          {quickAdd && product.inStock ? (
            <div className="px-4 pb-4 md:hidden">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-cream py-2.5 text-xs font-medium text-brown transition-colors hover:border-amber hover:text-amber"
              >
                <ShoppingBag size={14} weight="light" />
                افزودن به سبد
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
