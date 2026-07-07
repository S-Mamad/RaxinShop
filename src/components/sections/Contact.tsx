import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const data = site as SiteConfig;

export function Contact() {
  return (
    <section id="contact" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <SectionHeading
              index="04"
              eyebrow="ارتباط"
              title="شروع گفتگو"
              description="مستقیم پیام بده. معمولاً همان روز جواب می‌دهیم."
            />

            <div className="flex flex-col gap-px border border-border bg-border">
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
                  <span className="telemetry text-dim">
                    {link.id === "email" ? "mail" : "tg"}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
