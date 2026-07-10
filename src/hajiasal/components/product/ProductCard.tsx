"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart } from "@phosphor-icons/react";
import type { Product } from "@asal/types";
import { getMinPrice } from "@asal/lib/products";
import { Badge } from "@asal/components/ui/Badge";
import { PriceDisplay } from "@asal/components/ui/PriceDisplay";
import { RatingStars } from "@asal/components/ui/RatingStars";
import { ProductImage } from "@asal/components/ui/ProductImage";
import { useWishlistStore } from "@asal/store/wishlist";
import { cn } from "@asal/lib/utils";
import { hajiasalPath } from "@asal/lib/paths";

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
      <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(212,160,86,0.15)]">
        <Link href={hajiasalPath(`/product/${product.slug}`)} className="block">
          <div className="relative aspect-square overflow-hidden bg-surface-muted">
            <ProductImage
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
            />
            <div className="absolute start-2 top-2 flex flex-col gap-1 sm:start-3 sm:top-3 sm:gap-1.5">
              {product.isBestseller ? (
                <Badge variant="bestseller">پرفروش</Badge>
              ) : null}
              {product.isNew ? <Badge variant="new">جدید</Badge> : null}
              {!product.inStock ? (
                <Badge variant="out-of-stock">ناموجود</Badge>
              ) : null}
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <p className="mb-1 text-[11px] text-dim sm:text-xs">{product.categoryLabel}</p>
            <h3 className="mb-2 line-clamp-2 text-xs font-semibold text-primary sm:line-clamp-1 sm:text-sm">
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
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={cn(
            "absolute end-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all sm:end-3 sm:top-3 sm:h-9 sm:w-9",
            isWishlisted
              ? "bg-gold text-void"
              : "bg-void/60 text-primary hover:bg-void/80",
          )}
          aria-label="علاقه‌مندی"
        >
          <Heart size={16} weight={isWishlisted ? "fill" : "regular"} />
        </button>
      </div>
    </motion.article>
  );
}
