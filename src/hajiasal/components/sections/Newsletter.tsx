"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { Reveal } from "@asal/components/ui/Reveal";
import { Button } from "@asal/components/ui/Button";
import { Input } from "@asal/components/ui/Input";
import { hajiasalPath } from "@asal/lib/paths";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
      setMessage(data.message);
      if (data.success) setEmail("");
    } catch {
      setStatus("error");
      setMessage("خطا در ارسال. دوباره تلاش کنید.");
    }
  };

  return (
    <section className="bg-brown-deep py-20 md:py-24">
      <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
        <Reveal>
          <SectionHeading
            title="خبرنامه حاجی عسل"
            subtitle="اولین نفری باشید که از تخفیف‌ها و محصولات فصلی باخبر می‌شوید"
            align="center"
            className="mx-auto [&_h2]:text-white [&_p]:text-white/60"
          />
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              placeholder="ایمیل شما"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/40"
            />
            <Button type="submit" disabled={status === "loading"} magnetic>
              <Send size={16} strokeWidth={1.5} aria-hidden />
              عضویت
            </Button>
          </form>
          {message ? (
            <p
              className={`mt-3 text-sm ${
                status === "success" ? "text-amber-bright" : "text-red-300"
              }`}
              role="status"
            >
              {message}
            </p>
          ) : null}
          <p className="mt-4 text-xs text-white/40">
            با عضویت،{" "}
            <Link
              href={hajiasalPath("/privacy")}
              className="text-white/60 underline underline-offset-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-brown-deep"
            >
              سیاست حریم خصوصی
            </Link>{" "}
            ما را می‌پذیرید.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
