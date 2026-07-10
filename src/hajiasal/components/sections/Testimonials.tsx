"use client";

import { useEffect, useState, useCallback } from "react";
import { CaretLeft, CaretRight, SealCheck } from "@phosphor-icons/react";
import reviewsData from "@asal/data/reviews.json";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { RatingStars } from "@asal/components/ui/RatingStars";
import type { Review } from "@asal/lib/server/reviews";

const reviews = reviewsData as Review[];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const review = reviews[active] ?? reviews[0];

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => (i + dir + reviews.length) % reviews.length);
    },
    [],
  );

  useEffect(() => {
    const id = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(id);
  }, [go]);

  if (!review) return null;

  return (
    <section className="py-14 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <Reveal className="mb-8 md:mb-12">
          <SectionHeading
            title="نظر مشتریان"
            subtitle="تجربه واقعی خریداران حاجی عسل"
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <Reveal>
          <div className="relative">
            <blockquote className="border-y border-white/8 py-8 text-center md:py-12">
              <RatingStars
                rating={review.rating}
                size="md"
                showValue={false}
                className="mb-5 justify-center"
              />
              <p className="mx-auto max-w-xl text-base leading-relaxed text-primary text-pretty md:text-xl">
                «{review.comment}»
              </p>
              <footer className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
                <cite className="not-italic text-sm font-medium text-primary">
                  {review.author}
                </cite>
                {review.verified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-gold">
                    <SealCheck size={14} weight="fill" />
                    خرید تأییدشده
                  </span>
                ) : null}
              </footer>
            </blockquote>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-secondary transition-colors hover:border-gold/40 hover:text-gold"
                aria-label="نظر قبلی"
              >
                <CaretRight size={18} />
              </button>
              <div className="flex gap-2">
                {reviews.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === active ? "w-7 bg-gold" : "w-1.5 bg-white/20"
                    }`}
                    aria-label={`نظر ${i + 1}`}
                    aria-current={i === active}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-secondary transition-colors hover:border-gold/40 hover:text-gold"
                aria-label="نظر بعدی"
              >
                <CaretLeft size={18} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
