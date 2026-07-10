"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SealCheck, Star } from "@phosphor-icons/react";
import { Reveal } from "@asal/components/ui/Reveal";
import { Button } from "@asal/components/ui/Button";
import { ReviewForm } from "@asal/components/sections/ReviewForm";
import { hajiasalPath } from "@asal/lib/paths";
import { GENERAL_REVIEW_PRODUCT_ID } from "@asal/lib/review-constants";
import type { Review } from "@asal/lib/server/reviews";

type Filter = "all" | "5" | "4";

interface ReviewItem extends Review {
  productTitle?: string;
  productSlug?: string;
}

interface ReviewsPageClientProps {
  reviews: ReviewItem[];
  averageRating: number;
  fiveStarShare: number;
}

function formatFaDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

export function ReviewsPageClient({
  reviews,
  averageRating,
  fiveStarShare,
}: ReviewsPageClientProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "5") return reviews.filter((r) => r.rating === 5);
    if (filter === "4") return reviews.filter((r) => r.rating >= 4);
    return reviews;
  }, [filter, reviews]);

  const filters: Array<{ id: Filter; label: string }> = [
    { id: "all", label: "همه" },
    { id: "5", label: "۵ ستاره" },
    { id: "4", label: "۴ به بالا" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-14 sm:px-6 md:px-8 md:pb-28 md:pt-24">
      <Reveal>
        <p className="mb-3 text-[11px] font-medium tracking-[0.2em] text-gold">
          صدای مشتریان
        </p>
        <h1 className="font-display text-[1.75rem] leading-tight tracking-tight text-primary text-balance sm:text-4xl md:text-5xl">
          نظرات مشتریان
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-secondary md:mt-4 md:text-base">
          تجربه واقعی خریداران حاجی عسل؛ فقط نظرات تأییدشده نمایش داده می‌شود.
        </p>
      </Reveal>

      {reviews.length > 0 ? (
        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-4 border-y border-white/8 py-6 md:mt-14 md:py-8">
            <div>
              <p className="font-display text-3xl text-gold tabular-nums md:text-4xl">
                {averageRating.toLocaleString("fa-IR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </p>
              <p className="mt-1 text-xs text-dim">میانگین امتیاز از ۵</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-primary tabular-nums md:text-3xl">
                {reviews.length.toLocaleString("fa-IR")}
              </p>
              <p className="mt-1 text-xs text-dim">نظر تأییدشده</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-primary tabular-nums md:text-3xl">
                {Math.round(fiveStarShare).toLocaleString("fa-IR")}٪
              </p>
              <p className="mt-1 text-xs text-dim">رضایت ۵ ستاره</p>
            </div>
          </div>
        </Reveal>
      ) : null}

      {reviews.length > 0 ? (
        <Reveal delay={0.12}>
          <div
            className="mt-8 flex flex-wrap items-center gap-5 md:mt-10"
            role="tablist"
            aria-label="فیلتر امتیاز"
          >
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item.id)}
                  className={`border-b pb-0.5 text-xs transition-colors duration-300 md:text-[13px] ${
                    active
                      ? "border-gold text-gold"
                      : "border-transparent text-dim hover:text-secondary"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </Reveal>
      ) : null}

      {filtered.length === 0 ? (
        <Reveal delay={0.1}>
          <div className="mt-16 text-center md:mt-20">
            <p className="text-sm text-secondary md:text-base">
              {reviews.length === 0
                ? "هنوز نظر تأییدشده‌ای ثبت نشده. اولین تجربه را شما بنویسید."
                : "با این فیلتر نظری پیدا نشد."}
            </p>
            {filter !== "all" ? (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-4 text-sm text-gold hover:text-gold-bright"
              >
                نمایش همه نظرات
              </button>
            ) : null}
          </div>
        </Reveal>
      ) : (
        <ul className="mt-6 flex flex-col md:mt-8">
          {filtered.map((review, i) => (
            <Reveal key={review.id} delay={Math.min(i * 0.04, 0.24)}>
              <li className="border-b border-white/6 py-8 last:border-0 md:py-10">
                <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <div className="flex items-center gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star
                        key={star}
                        size={13}
                        weight={star < review.rating ? "fill" : "regular"}
                        className={
                          star < review.rating ? "text-gold" : "text-white/15"
                        }
                      />
                    ))}
                  </div>
                  <span className="sr-only">
                    امتیاز {review.rating.toLocaleString("fa-IR")} از ۵
                  </span>
                  <time
                    dateTime={review.date}
                    className="text-[11px] text-dim tabular-nums"
                  >
                    {formatFaDate(review.date)}
                  </time>
                </div>

                <blockquote className="text-[0.95rem] leading-[1.9] text-secondary text-pretty md:text-base md:leading-[2]">
                  <span className="me-1 text-gold/35" aria-hidden>
                    «
                  </span>
                  {review.comment}
                  <span className="ms-1 text-gold/35" aria-hidden>
                    »
                  </span>
                </blockquote>

                <footer className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <cite className="not-italic text-sm font-medium text-primary">
                    {review.author}
                  </cite>
                  {review.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-dim">
                      <SealCheck
                        size={12}
                        weight="fill"
                        className="text-gold/65"
                      />
                      خرید تأییدشده
                    </span>
                  ) : null}
                  {review.productTitle &&
                  review.productSlug &&
                  review.productId !== GENERAL_REVIEW_PRODUCT_ID ? (
                    <Link
                      href={hajiasalPath(`/product/${review.productSlug}`)}
                      className="text-[11px] text-gold/80 transition-colors hover:text-gold"
                    >
                      {review.productTitle}
                    </Link>
                  ) : null}
                </footer>
              </li>
            </Reveal>
          ))}
        </ul>
      )}

      <Reveal delay={0.1}>
        <div className="mt-14 border-t border-white/8 pt-12 md:mt-20 md:pt-16">
          <div className="mb-10 text-center md:mb-12">
            <h2 className="font-display text-xl text-primary md:text-2xl">
              تجربه خود را بنویسید
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-secondary">
              نظرتان پس از بررسی نمایش داده می‌شود تا اعتماد دیگران حفظ شود.
            </p>
          </div>
          <ReviewForm />
          <div className="mt-10 flex justify-center">
            <Button href={hajiasalPath("/shop")} variant="outline" size="lg">
              مشاهده فروشگاه
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
