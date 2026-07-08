"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@asal/lib/utils";
import { ProductImage } from "@asal/components/ui/ProductImage";
import { Icon } from "@asal/components/ui/Icon";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const scrollThumbs = (direction: "down" | "up") => {
    if (direction === "down") {
      setActiveIndex((i) => Math.min(images.length - 1, i + 1));
    } else {
      setActiveIndex((i) => Math.max(0, i - 1));
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[72px_1fr] lg:gap-5">
      {images.length > 1 ? (
        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[520px]">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors lg:h-[72px] lg:w-[72px]",
                i === activeIndex
                  ? "border-[var(--pdp-accent)]"
                  : "border-[var(--pdp-border)] hover:border-white/20",
              )}
            >
              <ProductImage
                src={img}
                alt={`${title} - ${i + 1}`}
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          ))}
          {images.length > 4 ? (
            <button
              type="button"
              onClick={() => scrollThumbs("down")}
              className="hidden h-8 w-full items-center justify-center text-[var(--pdp-muted)] hover:text-[var(--pdp-accent)] lg:flex"
              aria-label="تصاویر بیشتر"
            >
              <Icon icon={CaretDown} size={16} />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="order-1 lg:order-2">
        <motion.div
          className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--pdp-border)] bg-[var(--pdp-surface)]"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <ProductImage
            src={images[activeIndex]}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority
            className={cn(
              "object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
              isZoomed && "scale-125",
            )}
          />
        </motion.div>
      </div>
    </div>
  );
}
