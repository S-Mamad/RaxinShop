"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Product } from "@asal/types";
import type { Review } from "@asal/lib/server/reviews";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { RatingStars } from "@asal/components/ui/RatingStars";
import { Input } from "@asal/components/ui/Input";
import { Button } from "@asal/components/ui/Button";

const schema = z.object({
  author: z.string().min(2, "نام الزامی است"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "نظر حداقل ۱۰ کاراکتر"),
});

type FormData = z.infer<typeof schema>;

interface ReviewsSectionProps {
  product: Product;
}

export function ReviewsSection({ product }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  });

  const selectedRating = watch("rating");

  useEffect(() => {
    fetch(`/api/reviews?productId=${product.id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews ?? []))
      .finally(() => setLoading(false));
  }, [product.id]);

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, productId: product.id }),
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(result.message ?? "خطا در ثبت نظر");
        return;
      }
      setReviews((prev) => [result.review, ...prev]);
      setStatus("done");
      setMessage("نظر شما ثبت شد و پس از بررسی نمایش داده می‌شود.");
      reset({ author: "", rating: 5, comment: "" });
    } catch {
      setStatus("error");
      setMessage("خطا در ثبت نظر");
    }
  };

  return (
    <section className="mt-16 border-t border-border pt-12">
      <SectionHeading
        title="نظرات مشتریان"
        subtitle={`${reviews.length.toLocaleString("fa-IR")} نظر برای ${product.title}`}
        className="mb-8"
      />

      {loading ? (
        <p className="text-sm text-muted">در حال بارگذاری نظرات...</p>
      ) : reviews.length > 0 ? (
        <ul className="mb-10 flex flex-col gap-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-brown">{review.author}</span>
                <time className="text-xs text-muted" dateTime={review.date}>
                  {new Date(review.date).toLocaleDateString("fa-IR")}
                </time>
              </div>
              <RatingStars rating={review.rating} size="sm" className="mb-2" />
              <p className="text-sm leading-relaxed text-muted">{review.comment}</p>
              {review.verified ? (
                <span className="mt-2 inline-block text-xs text-amber">
                  خرید تأییدشده
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-10 text-sm text-muted">
          هنوز نظری ثبت نشده. اولین نفری باشید که تجربه خود را می‌نویسید.
        </p>
      )}

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="mb-4 text-base font-semibold text-brown">ثبت نظر</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="نام" {...register("author")} error={errors.author?.message} />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-brown">امتیاز</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue("rating", star)}
                  className={`text-xl transition-colors ${
                    star <= selectedRating ? "text-amber" : "text-border"
                  }`}
                  aria-label={`${star} ستاره`}
                >
                  ★
                </button>
              ))}
            </div>
            <input type="hidden" {...register("rating")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brown">نظر شما</label>
            <textarea
              {...register("comment")}
              rows={4}
              className="rounded-xl border border-border bg-cream px-4 py-3 text-sm focus:border-amber focus:outline-none"
            />
            {errors.comment ? (
              <p className="text-xs text-red-500">{errors.comment.message}</p>
            ) : null}
          </div>
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "در حال ارسال..." : "ارسال نظر"}
          </Button>
          {message ? (
            <p
              className={`text-sm ${status === "done" ? "text-amber" : "text-red-500"}`}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
