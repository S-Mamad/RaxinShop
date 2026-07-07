"use client";

import reviewsData from "@asal/data/reviews.json";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { RatingStars } from "@asal/components/ui/RatingStars";
import type { Review } from "@asal/lib/server/reviews";
import { formatJalaliDate } from "@asal/lib/utils";
import { cn } from "@asal/lib/utils";

const allReviews = reviewsData as Review[];

const featuredReviews = allReviews
  .filter((r) => r.rating >= 4)
  .slice(0, 5);

const displayReviews =
  featuredReviews.length >= 3
    ? featuredReviews.slice(0, Math.min(5, featuredReviews.length))
    : allReviews.slice(0, 3);

const cardOffsets = [
  "md:mb-6",
  "md:mb-10",
  "md:mb-4",
  "md:mb-8",
  "md:mb-5",
];

export function Testimonials() {
  return (
    <section className="mesh-amber py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal className="mb-12 text-center">
          <SectionHeading
            title="نظر مشتریان"
            subtitle="تجربه واقعی خریداران حاجی عسل"
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {displayReviews.map((review, i) => (
            <Reveal
              key={review.id}
              delay={i * 0.06}
              className={cn("mb-4 break-inside-avoid", cardOffsets[i])}
            >
              <blockquote className="rounded-2xl border border-border bg-surface p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                <RatingStars rating={review.rating} size="sm" className="mb-3" />
                <p className="mb-4 text-sm leading-relaxed text-brown md:text-base">
                  «{review.comment}»
                </p>
                <footer className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                  <span className="font-medium text-brown">{review.author}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={review.date}>
                    {formatJalaliDate(review.date)}
                  </time>
                  {review.verified ? (
                    <>
                      <span aria-hidden>·</span>
                      <span className="text-amber">خرید تأییدشده</span>
                    </>
                  ) : null}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
