"use client";

import { useCopy } from "@/hooks/useCopy";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const stories = [
  {
    id: "ip-shift",
    title: "مهاجرت IP بدون قطعی",
    context: "مرهم · سامانه خدمات سلامت",
    body: "انتقال از رنج قدیمی سرور به زیرساخت جدید، با هماهنگی DNS، health-check و rollback آماده؛ بدون downtime برای کاربران.",
    tags: ["zero-downtime", "DNS", "ops"],
  },
  {
    id: "gov",
    title: "مکاتبه فنی با نهاد رسمی",
    context: "تایید زیرساخت · وزارت تعاون، کار و رفاه اجتماعی",
    body: "مستندسازی نیازمندی‌ها، پاسخ به الزامات امنیتی، و پیگیری تایید زیرساخت برای پلتفرم خدماتی حساس.",
    tags: ["compliance", "docs", "trust"],
  },
  {
    id: "catalog",
    title: "کاتالوگ حجیم، UI لوکس",
    context: "حاجی‌عسل · e-commerce",
    body: "ده‌ها محصول با دیتای واقعی، تصاویر بهینه، و اسکرول هدف ۶۰fps بدون قربانی کردن حس لوکس فروشگاه.",
    tags: ["perf", "images", "UX"],
  },
];

export function WarStories() {
  const copy = useCopy();

  return (
    <section id="war-stories" className="border-b border-border py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow={copy.warStories.eyebrow}
            title={copy.warStories.title}
            description={copy.warStories.description}
          />
        </Reveal>

        <ol className="relative space-y-4 border-s border-border ps-6 md:ps-8">
          {stories.map((story, index) => (
            <Reveal key={story.id} delay={index * 0.05}>
              <li className="relative">
                <span className="absolute -start-[1.9rem] top-6 h-3 w-3 rounded-full border border-accent bg-void md:-start-[2.4rem]" />
                <SpotlightCard className="rounded-2xl p-5 md:p-6">
                  <p className="label-mono text-accent/80">{story.context}</p>
                  <h3 className="mt-2 font-display text-xl text-foreground">
                    {story.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {story.body}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {story.tags.map((tag) => (
                      <span
                        key={tag}
                        dir="ltr"
                        className="border border-border px-2 py-0.5 font-mono text-[10px] text-dim"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
