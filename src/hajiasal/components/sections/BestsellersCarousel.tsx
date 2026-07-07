"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@asal/types";
import { ProductCard } from "@asal/components/product/ProductCard";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { Button } from "@asal/components/ui/Button";
import { hajiasalPath } from "@asal/lib/paths";

interface BestsellersCarouselProps {
  products: Product[];
  loading?: boolean;
}

function CarouselCardSkeleton() {
  return (
    <div className="w-[260px] shrink-0 snap-start md:w-[280px]" aria-hidden>
      <div className="bezel-outer">
        <div className="bezel-inner bg-surface">
          <div className="aspect-square animate-pulse bg-cream-dark" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-cream-dark" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-cream-dark" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-cream-dark" />
            <div className="mt-3 h-9 w-full animate-pulse rounded-full bg-cream-dark" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BestsellersCarouselSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section
      className="py-16 md:py-24"
      aria-busy="true"
      aria-label="در حال بارگذاری پرفروش‌ها"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-cream-dark" />
          <div className="h-8 w-48 animate-pulse rounded bg-cream-dark" />
        </div>
        <div className="flex gap-4 overflow-hidden md:gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <CarouselCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BestsellersCarousel({
  products,
  loading = false,
}: BestsellersCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <BestsellersCarouselSkeleton />;
  }

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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-brown transition-colors hover:border-amber hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              aria-label="قبلی"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-brown transition-colors hover:border-amber hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
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
              <ProductCard product={product} quickAdd />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button href={hajiasalPath("/shop")} variant="outline">
            مشاهده همه محصولات
          </Button>
        </div>
      </div>
    </section>
  );
}
