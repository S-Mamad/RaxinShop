"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="bezel-outer">
        <motion.div
          className="bezel-inner relative aspect-square overflow-hidden bg-cream-dark"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <ProductImage
            src={images[activeIndex]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className={cn(
              "object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
              isZoomed && "scale-125",
            )}
          />
        </motion.div>
      </div>
      {images.length > 1 ? (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-colors md:h-20 md:w-20",
                i === activeIndex
                  ? "border-amber"
                  : "border-border hover:border-border-bright",
              )}
            >
              <ProductImage
                src={img}
                alt={`${title} - ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
