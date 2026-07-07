import Link from "next/link";
import { Tag } from "lucide-react";
import { Reveal } from "@asal/components/ui/Reveal";
import { Button } from "@asal/components/ui/Button";

export function PromoBanner() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-amber to-gold p-8 md:p-12">
            <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -start-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                  <Tag size={12} strokeWidth={1.5} />
                  کد تخفیف: HAJI10
                </span>
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  ۱۰٪ تخفیف اولین خرید
                </h2>
                <p className="mt-1 text-white/80">برای سفارش‌های بالای ۳۰۰ هزار تومان</p>
              </div>
              <Button
                href="/hajiasal/shop"
                variant="outline"
                size="lg"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                خرید کنید
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
