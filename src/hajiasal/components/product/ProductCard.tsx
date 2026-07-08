"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import type { Product } from "@asal/types";
import { getMinPrice } from "@asal/lib/products";
import { Badge } from "@asal/components/ui/Badge";
import { PriceDisplay } from "@asal/components/ui/PriceDisplay";
import { RatingStars } from "@asal/components/ui/RatingStars";
import { ProductImage } from "@asal/components/ui/ProductImage";
import { useWishlistStore } from "@asal/store/wishlist";
import { cn } from "@asal/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = getMinPrice(product);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="group"
    >
      <div className="overflow-hidden rounded-2xl border border-white/6 bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(212,160,86,0.15)]">
        <Link href={`/hajiasal/product/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-surface-muted">
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
                  ? "bg-gold text-void"
                  : "bg-void/60 text-primary hover:bg-void/80",
              )}
              aria-label="علاقه‌مندی"
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                className={isWishlisted ? "fill-current" : ""}
              />
            </button>
          </div>
          <div className="p-4">
            <p className="mb-1 text-xs text-dim">{product.categoryLabel}</p>
            <h3 className="mb-2 line-clamp-1 text-sm font-semibold text-primary">
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
      </div>
    </motion.article>
  );
}
