"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@asal/types";
import { ProductCard } from "@asal/components/product/ProductCard";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { Button } from "@asal/components/ui/Button";

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
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <SectionHeading
            title="پرفروش‌ترین‌ها"
            subtitle="محبوب‌ترین عسل‌های حاجی عسل که مشتریان بارها سفارش داده‌اند"
          />
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-brown hover:border-amber hover:text-amber"
              aria-label="قبلی"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-brown hover:border-amber hover:text-amber"
              aria-label="بعدی"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
          </div>
        </Reveal>
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:gap-6"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[260px] shrink-0 snap-start md:w-[280px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href="/hajiasal/shop" variant="outline">
            مشاهده همه محصولات
          </Button>
        </div>
      </div>
    </section>
  );
}
