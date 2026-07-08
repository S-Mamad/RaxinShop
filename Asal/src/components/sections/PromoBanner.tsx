import { Tag } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function PromoBanner() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-surface p-8 md:p-12">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-void/90 via-void/70 to-void/50" />
            <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold-dim px-3 py-1 text-xs font-medium text-gold">
                  <Tag size={12} strokeWidth={1.5} />
                  کد تخفیف: HAJI10
                </span>
                <h2 className="text-2xl font-bold text-primary md:text-3xl">
                  ۱۰٪ تخفیف اولین خرید
                </h2>
                <p className="mt-1 text-secondary">
                  برای سفارش‌های بالای ۳۰۰ هزار تومان
                </p>
              </div>
              <Button href="/shop" size="lg">
                خرید کنید
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
