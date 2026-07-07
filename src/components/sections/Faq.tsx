import faqData from "@/data/faq.json";
import type { FaqItem } from "@/types";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const items = faqData as FaqItem[];

export function Faq() {
  return (
    <section id="faq" className="border-b border-border py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="سوالات"
            title="پرسش‌های رایج"
            description="قبل از شروع پروژه، این‌ها را می‌پرسید."
          />
        </Reveal>

        <Reveal delay={0.06}>
          <Accordion
            items={items.map((item) => ({
              id: item.id,
              title: item.question,
              content: item.answer,
            }))}
          />
        </Reveal>
      </div>
    </section>
  );
}
