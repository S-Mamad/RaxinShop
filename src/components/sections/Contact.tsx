import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const data = site as SiteConfig;

const linkLabels: Record<string, string> = {
  email: "ایمیل",
  telegram: "تلگرام",
  channel: "کانال",
};

export function Contact() {
  return (
    <section id="contact" className="py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="ارتباط"
              title="شروع گفتگو"
              description="فرم را پر کن یا مستقیم پیام بده. معمولاً همان روز جواب می‌دهیم."
            />

            <div className="mt-10 flex flex-col gap-px border border-border bg-border">
              {data.links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between bg-void px-6 py-5 transition-colors duration-300 hover:bg-surface"
                >
                  <span
                    dir="ltr"
                    className="font-mono text-sm text-foreground transition-colors group-hover:text-accent"
                  >
                    {link.label}
                  </span>
                  <span className="label-mono text-dim">
                    {linkLabels[link.id] ?? link.id}
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
