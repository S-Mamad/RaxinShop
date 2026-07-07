"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@asal/components/ui/Input";
import { Button } from "@asal/components/ui/Button";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";

const siteData = site as SiteConfig;

const schema = z.object({
  name: z.string().min(2, "نام الزامی است"),
  email: z.string().email("ایمیل نامعتبر"),
  phone: z.string().min(11, "شماره موبایل نامعتبر"),
  subject: z.string().min(3, "موضوع الزامی است"),
  message: z.string().min(10, "پیام حداقل ۱۰ کاراکتر"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setStatus("done");
        setMsg(result.message);
        reset();
      } else {
        setStatus("error");
        setMsg(result.message);
      }
    } catch {
      setStatus("error");
      setMsg("خطا در ارسال پیام");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 md:px-6 md:py-32">
      <SectionHeading
        title="تماس با ما"
        subtitle="سؤال، پیشنهاد یا درخواست مشاوره — پاسخگوی شما هستیم"
        className="mb-8"
      />
      <div className="mb-8 rounded-2xl border border-border bg-surface p-5 text-sm text-muted">
        <p>تلفن: {siteData.footer.phone}</p>
        <p>ایمیل: {siteData.footer.email}</p>
        <p>آدرس: {siteData.footer.address}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
        <Input label="نام" {...register("name")} error={errors.name?.message} />
        <Input label="ایمیل" {...register("email")} error={errors.email?.message} />
        <Input label="موبایل" dir="ltr" {...register("phone")} error={errors.phone?.message} />
        <Input label="موضوع" {...register("subject")} error={errors.subject?.message} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brown">پیام</label>
          <textarea
            {...register("message")}
            rows={5}
            className="rounded-xl border border-border bg-cream px-4 py-3 text-sm focus:border-amber focus:outline-none"
          />
          {errors.message ? <p className="text-xs text-red-500">{errors.message.message}</p> : null}
        </div>
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "در حال ارسال..." : "ارسال پیام"}
        </Button>
        {msg ? <p className={`text-sm ${status === "done" ? "text-amber" : "text-red-500"}`}>{msg}</p> : null}
      </form>
    </div>
  );
}
