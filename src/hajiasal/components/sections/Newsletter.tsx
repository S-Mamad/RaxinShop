"use client";

import { useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { Button } from "@asal/components/ui/Button";
import { cn } from "@asal/lib/utils";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
      setMessage(data.message ?? (data.success ? "ثبت شد" : "خطا در ثبت"));
      if (data.success) setEmail("");
    } catch {
      setStatus("error");
      setMessage("خطا در ارسال. دوباره تلاش کنید.");
    }
  };

  return (
    <section className="border-t border-white/5 py-14 md:py-24">
      <div className="mx-auto max-w-xl px-4 md:px-8">
        <Reveal>
          <SectionHeading
            title="خبرنامه حاجی عسل"
            subtitle="اولین نفری باشید که از تخفیف‌ها و محصولات فصلی باخبر می‌شوید"
            align="center"
            className="mx-auto"
          />
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              ایمیل
            </label>
            <input
              id="newsletter-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ایمیل شما"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className={cn(
                "h-12 w-full flex-1 rounded-xl border border-white/8 bg-surface-elevated px-4 text-sm text-primary",
                "placeholder:text-dim focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30",
              )}
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="h-12 w-full shrink-0 sm:w-auto sm:min-w-[7.5rem]"
            >
              <PaperPlaneTilt size={16} weight="fill" />
              {status === "loading" ? "..." : "عضویت"}
            </Button>
          </form>
          {message ? (
            <p
              role="status"
              className={`mt-3 text-center text-sm ${
                status === "success" ? "text-gold" : "text-red-400"
              }`}
            >
              {message}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
