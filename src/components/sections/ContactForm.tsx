"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

const data = site as SiteConfig;

const schema = z.object({
  name: z.string().min(2, "نام الزامی است"),
  contact: z.string().min(3, "تلگرام یا موبایل الزامی است"),
  projectType: z.string().min(1, "نوع پروژه را انتخاب کنید"),
  message: z.string().min(10, "توضیح باید حداقل ۱۰ کاراکتر باشد"),
}).refine((data) => data.projectType !== "", {
  message: "نوع پروژه را انتخاب کنید",
  path: ["projectType"],
});

type FormData = z.infer<typeof schema>;

const projectTypes = [
  { value: "", label: "انتخاب کنید" },
  { value: "mvp", label: "MVP / محصول جدید" },
  { value: "frontend", label: "فرانت‌اند" },
  { value: "backend", label: "بک‌اند / API" },
  { value: "ecommerce", label: "فروشگاه آنلاین" },
  { value: "brand", label: "برند دیجیتال" },
  { value: "other", label: "سایر" },
];

function buildMailtoUrl(form: FormData) {
  const email = data.links.find((l) => l.id === "email");
  const to = email?.label ?? "hello@raxinshop.ir";
  const subject = encodeURIComponent(`[راکسین‌شاپ] ${form.projectType}`);
  const body = encodeURIComponent(
    `نام: ${form.name}\nتماس: ${form.contact}\nنوع پروژه: ${form.projectType}\n\n${form.message}`,
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

function openMailto(form: FormData) {
  const url = buildMailtoUrl(form);
  const link = document.createElement("a");
  link.href = url;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      contact: "",
      projectType: "",
      message: "",
    },
  });

  async function onSubmit(form: FormData) {
    setStatus("idle");
    setStatusMessage("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = (await res.json()) as {
        success: boolean;
        message: string;
        fallback?: boolean;
      };

      if (json.success && !json.fallback) {
        setStatus("success");
        setStatusMessage(json.message);
        reset();
        return;
      }

      if (json.fallback || !res.ok) {
        openMailto(form);
        setStatus("success");
        setStatusMessage("در حال باز کردن ایمیل...");
        return;
      }

      setStatus("error");
      setStatusMessage(json.message ?? "خطا در ارسال");
    } catch {
      openMailto(form);
      setStatus("success");
      setStatusMessage("در حال باز کردن ایمیل...");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="نام"
        placeholder="نام شما"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="تلگرام / موبایل"
        placeholder="@username یا 09..."
        dir="ltr"
        className="text-end"
        error={errors.contact?.message}
        {...register("contact")}
      />
      <Select
        label="نوع پروژه"
        options={projectTypes}
        error={errors.projectType?.message}
        {...register("projectType")}
      />
      <Textarea
        label="توضیح کوتاه"
        placeholder="پروژه‌ات چیه؟ چه زمانی نیاز داری؟"
        error={errors.message?.message}
        {...register("message")}
      />

      <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "در حال ارسال..." : "ارسال درخواست"}
      </Button>

      {status !== "idle" ? (
        <p
          className={`text-sm ${status === "success" ? "text-accent" : "text-signal"}`}
          role="status"
        >
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
