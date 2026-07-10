"use client";

import { useRef } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { Product } from "@asal/types";
import { ProductCard } from "@asal/components/product/ProductCard";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { Button } from "@asal/components/ui/Button";
import { hajiasalPath } from "@asal/lib/paths";

interface BestsellersCarouselProps {
  products: Product[];
}

export function BestsellersCarousel({ products }: BestsellersCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <SectionHeading
            title="پرفروش‌ترین‌ها"
            subtitle="محبوب‌ترین عسل‌های حاجی عسل"
          />
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-secondary transition-colors hover:border-gold/50 hover:text-gold"
              aria-label="قبلی"
            >
              <CaretRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-secondary transition-colors hover:border-gold/50 hover:text-gold"
              aria-label="بعدی"
            >
              <CaretLeft size={18} />
            </button>
          </div>
        </Reveal>
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-4 sm:mx-0 sm:gap-4 sm:px-0 md:gap-6"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[min(72vw,260px)] shrink-0 snap-start sm:w-[240px] md:w-[280px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="mt-6 text-center md:mt-8">
          <Button href={hajiasalPath("/shop")} variant="outline">
            مشاهده همه محصولات
          </Button>
        </div>
      </div>
    </section>
  );
}
