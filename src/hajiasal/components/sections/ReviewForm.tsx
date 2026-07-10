"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "@phosphor-icons/react";
import { Reveal } from "@asal/components/ui/Reveal";
import { cn } from "@asal/lib/utils";
import { GENERAL_REVIEW_PRODUCT_ID } from "@asal/lib/review-constants";

const schema = z.object({
  author: z.string().min(2, "نام کوتاه است").max(40),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "کمی بیشتر بنویسید").max(400),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ReviewForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
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
    defaultValues: { author: "", rating: 5, comment: "", website: "" },
  });

  const rating = watch("rating");

  const onSubmit = async (data: FormData) => {
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: data.author.trim(),
          rating: data.rating,
          productId: GENERAL_REVIEW_PRODUCT_ID,
          comment: data.comment.trim(),
          website: data.website ?? "",
        }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        setStatus("error");
        setMessage(result.message ?? "ارسال نشد");
        return;
      }

      setStatus("done");
      setMessage("ثبت شد. پس از تأیید نمایش داده می‌شود.");
      reset({ author: "", rating: 5, comment: "", website: "" });
    } catch {
      setStatus("error");
      setMessage("ارتباط برقرار نشد.");
    }
  };

  return (
    <section className="pb-16 pt-2 md:pb-28 md:pt-4">
      <div className="mx-auto max-w-sm px-5 md:max-w-md md:px-8">
        <Reveal>
          {status === "done" ? (
            <div className="py-8 text-center">
              <p className="text-sm text-secondary">{message}</p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                }}
                className="mt-4 text-xs tracking-wide text-gold"
              >
                نوشتن نظر دیگر
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative"
              noValidate
            >
              <div
                className="pointer-events-none absolute -left-[9999px] opacity-0"
                aria-hidden
              >
                <input tabIndex={-1} autoComplete="off" {...register("website")} />
              </div>

              <p className="mb-8 text-center text-[11px] tracking-[0.18em] text-dim">
                نظر شما
              </p>

              <div
                className="mb-8 flex items-center justify-center gap-1"
                role="radiogroup"
                aria-label="امتیاز"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} از ۵`}
                    onClick={() =>
                      setValue("rating", value, { shouldValidate: true })
                    }
                    className="flex h-8 w-8 items-center justify-center touch-manipulation"
                  >
                    <Star
                      size={18}
                      weight={value <= rating ? "fill" : "regular"}
                      className={
                        value <= rating ? "text-gold" : "text-white/15"
                      }
                    />
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="نام"
                autoComplete="name"
                className="mb-1 w-full border-0 border-b border-white/8 bg-transparent py-2.5 text-center text-sm text-primary outline-none placeholder:text-dim/60 focus:border-gold/40"
                {...register("author")}
              />
              {errors.author ? (
                <p className="mb-3 text-center text-[11px] text-red-400/90">
                  {errors.author.message}
                </p>
              ) : (
                <div className="mb-3" />
              )}

              <textarea
                rows={2}
                maxLength={400}
                placeholder="چند کلمه از تجربه‌تان..."
                className={cn(
                  "w-full resize-none border-0 border-b border-white/8 bg-transparent py-2.5 text-center text-sm leading-relaxed text-primary outline-none",
                  "placeholder:text-dim/60 focus:border-gold/40",
                )}
                {...register("comment")}
              />
              {errors.comment ? (
                <p className="mt-2 text-center text-[11px] text-red-400/90">
                  {errors.comment.message}
                </p>
              ) : null}

              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="text-sm text-gold transition-opacity disabled:opacity-50 hover:text-gold-bright"
                >
                  {status === "loading" ? "..." : "ارسال"}
                </button>
              </div>

              {status === "error" && message ? (
                <p className="mt-4 text-center text-[12px] text-red-400" role="alert">
                  {message}
                </p>
              ) : null}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
