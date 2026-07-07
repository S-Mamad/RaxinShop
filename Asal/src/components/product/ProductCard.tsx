"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { getMinPrice } from "@/lib/products";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { RatingStars } from "@/components/ui/RatingStars";
import { ProductImage } from "@/components/ui/ProductImage";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";

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
      <div className="bezel-outer transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]">
        <div className="bezel-inner bg-surface">
          <Link href={`/product/${product.slug}`} className="block">
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
                  strokeWidth={1.5}
                  className={isWishlisted ? "fill-current" : ""}
                />
              </button>
            </div>
            <div className="p-4">
              <p className="mb-1 text-xs text-muted">{product.categoryLabel}</p>
              <h3 className="mb-2 text-sm font-semibold text-brown line-clamp-1">
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
      </div>
    </motion.article>
  );
}
