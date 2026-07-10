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
  author: z.string().min(2, "نام را وارد کنید").max(40),
  phone: z
    .string()
    .min(10, "موبایل سفارش را وارد کنید")
    .max(15, "شماره نامعتبر است")
    .refine((v) => {
      const d = v.replace(/\D/g, "");
      return (
        (d.length === 11 && d.startsWith("09")) ||
        (d.length === 10 && d.startsWith("9"))
      );
    }, { message: "موبایل را با ۰۹ وارد کنید" }),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "حداقل چند جمله بنویسید").max(400),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const fieldClass =
  "w-full border-0 border-b border-white/10 bg-transparent py-3 text-sm text-primary outline-none transition-colors placeholder:text-dim/50 focus:border-gold/45";

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
    defaultValues: {
      author: "",
      phone: "",
      rating: 5,
      comment: "",
      website: "",
    },
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
          phone: data.phone.trim(),
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
      setMessage(
        result.message ?? "ثبت شد. پس از تأیید ادمین نمایش داده می‌شود.",
      );
      reset({
        author: "",
        phone: "",
        rating: 5,
        comment: "",
        website: "",
      });
    } catch {
      setStatus("error");
      setMessage("ارتباط برقرار نشد.");
    }
  };

  return (
    <section className="pb-16 pt-4 md:pb-28 md:pt-6">
      <div className="mx-auto max-w-md px-5 md:px-8">
        <Reveal>
          <div className="mb-8 text-center md:mb-10">
            <p className="mb-2 text-[10px] font-medium tracking-[0.2em] text-gold">
              ثبت نظر
            </p>
            <h2 className="font-display text-xl text-primary md:text-2xl">
              نظر شما درباره حاجی عسل
            </h2>
            <p className="mx-auto mt-2.5 max-w-xs text-[13px] leading-relaxed text-secondary">
              فرم برای همه باز است. ارسال فقط برای خریداران است و پس از تأیید
              ادمین نمایش داده می‌شود.
            </p>
          </div>

          {status === "done" ? (
            <div className="py-10 text-center">
              <p className="text-sm leading-relaxed text-secondary">{message}</p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                }}
                className="mt-5 text-xs text-gold hover:text-gold-bright"
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
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>

              <div className="mb-7">
                <p className="mb-3 text-center text-[11px] text-dim">
                  امتیاز شما
                </p>
                <div
                  className="flex items-center justify-center gap-1"
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
                      className="flex h-9 w-9 items-center justify-center touch-manipulation"
                    >
                      <Star
                        size={20}
                        weight={value <= rating ? "fill" : "regular"}
                        className={
                          value <= rating ? "text-gold" : "text-white/15"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <label className="mb-5 block">
                <span className="mb-1 block text-[11px] text-dim">نام نمایشی</span>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="مثلاً مریم"
                  className={fieldClass}
                  {...register("author")}
                />
                {errors.author ? (
                  <p className="mt-1.5 text-[11px] text-red-400/90">
                    {errors.author.message}
                  </p>
                ) : null}
              </label>

              <label className="mb-5 block">
                <span className="mb-1 block text-[11px] text-dim">
                  موبایل ثبت‌شده در سفارش
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  dir="ltr"
                  placeholder="09xxxxxxxxx"
                  className={cn(fieldClass, "text-left")}
                  {...register("phone")}
                />
                {errors.phone ? (
                  <p className="mt-1.5 text-[11px] text-red-400/90">
                    {errors.phone.message}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[11px] text-dim/80">
                    فقط با شماره خریدار، نظر به ادمین ارسال می‌شود
                  </p>
                )}
              </label>

              <label className="mb-2 block">
                <span className="mb-1 block text-[11px] text-dim">متن نظر</span>
                <textarea
                  rows={3}
                  maxLength={400}
                  placeholder="از کیفیت، طعم یا ارسال بگویید..."
                  className={cn(
                    fieldClass,
                    "resize-none leading-relaxed",
                  )}
                  {...register("comment")}
                />
                {errors.comment ? (
                  <p className="mt-1.5 text-[11px] text-red-400/90">
                    {errors.comment.message}
                  </p>
                ) : null}
              </label>

              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="text-sm text-gold transition-opacity hover:text-gold-bright disabled:opacity-50"
                >
                  {status === "loading" ? "در حال ارسال..." : "ارسال برای تأیید"}
                </button>
              </div>

              {status === "error" && message ? (
                <p
                  className="mt-5 text-center text-[12px] leading-relaxed text-red-400"
                  role="alert"
                >
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
