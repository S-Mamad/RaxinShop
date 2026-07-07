import type { Metadata } from "next";
import faqData from "@asal/data/faq.json";
import { FaqContent } from "@asal/components/sections/FaqContent";
import { buildFaqJsonLd } from "@asal/lib/seo";
import { hajiasalPath } from "@asal/lib/paths";

export const metadata: Metadata = {
  title: "سوالات متداول",
  description: "پاسخ پرسش‌های رایج درباره خرید، ارسال و نگهداری عسل",
  alternates: { canonical: hajiasalPath("/faq") },
};

export default function FaqPage() {
  const faqJsonLd = buildFaqJsonLd(faqData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqContent />
    </>
  );
}
