"use client";

import { useState } from "react";
import reviewsData from "@/data/reviews.json";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { RatingStars } from "@/components/ui/RatingStars";
import type { Review } from "@/lib/server/reviews";

const reviews = reviewsData as Review[];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const review = reviews[active];

  return (
    <section className="mesh-amber py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <Reveal className="mb-12 text-center">
          <SectionHeading
            title="نظر مشتریان"
            subtitle="تجربه واقعی خریداران حاجی عسل"
            align="center"
            className="mx-auto"
          />
        </Reveal>
        <Reveal>
          <blockquote className="rounded-3xl border border-border bg-surface p-8 text-center shadow-[0_16px_48px_-16px_rgba(61,43,31,0.12)] md:p-12">
            <RatingStars rating={review.rating} size="md" className="mb-4 justify-center" />
            <p className="mb-6 text-lg leading-relaxed text-brown md:text-xl">
              «{review.comment}»
            </p>
            <footer className="text-sm text-muted">
              {review.author}
              {review.verified ? (
                <span className="ms-2 text-amber">خرید تأییدشده</span>
              ) : null}
            </footer>
          </blockquote>
          <div className="mt-6 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-8 bg-amber" : "w-2 bg-border"
                }`}
                aria-label={`نظر ${i + 1}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
