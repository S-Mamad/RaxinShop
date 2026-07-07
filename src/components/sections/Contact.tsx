import { ArrowLeft } from "lucide-react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const data = site as SiteConfig;

export function Contact() {
  const primaryLink =
    data.links.find((l) => l.id === "telegram") ?? data.links[0];

  return (
    <section id="contact" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-panel">
            <div className="grid gap-10 p-8 md:grid-cols-2 md:items-center md:gap-16 md:p-14">
              <div>
                <SectionHeading
                  eyebrow="تماس"
                  title="برای پروژه بعدی آماده‌ایم"
                  description="از طریق کانال‌های زیر با ما در ارتباط باشید. معمولاً در همان روز پاسخ می‌دهیم."
                />
              </div>

              <div className="flex flex-col gap-3">
                {data.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="group flex items-center justify-between rounded-xl border border-border bg-elevated/40 px-5 py-4 transition-all duration-500 hover:border-accent/25 hover:bg-elevated"
                  >
                    <span className="text-sm text-muted">{link.label}</span>
                    <ArrowLeft
                      className="h-4 w-4 text-dim transition-all duration-300 group-hover:-translate-x-0.5 group-hover:text-accent"
                      strokeWidth={1.5}
                    />
                  </a>
                ))}

                <Button
                  href={primaryLink?.href ?? "#contact"}
                  size="lg"
                  className="mt-3 w-full sm:w-auto"
                  trailingIcon={
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                  }
                >
                  شروع گفتگو
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
