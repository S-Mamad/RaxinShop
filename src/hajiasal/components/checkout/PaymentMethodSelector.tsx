"use client";

import { Banknote, CreditCard } from "lucide-react";
import { cn } from "@asal/lib/utils";
import type { PaymentMethod } from "@asal/lib/server/orders";

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
}

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const options: PaymentOption[] = [
  {
    id: "cod",
    label: "پرداخت در محل",
    description: "پرداخت نقدی یا کارتخوان هنگام تحویل سفارش",
  },
  {
    id: "card_to_card",
    label: "کارت به کارت",
    description: "واریز به حساب و ارسال رسید برای تأیید سفارش",
  },
];

const icons: Record<PaymentMethod, typeof Banknote> = {
  cod: Banknote,
  card_to_card: CreditCard,
};

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-brown">روش پرداخت</p>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const Icon = icons[option.id];
          const selected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4 text-start transition-colors",
                selected
                  ? "border-amber bg-gold-dim"
                  : "border-border hover:border-border-bright",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  selected ? "bg-amber text-white" : "bg-cream-dark text-muted",
                )}
              >
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <div>
                <span className="font-medium text-brown">{option.label}</span>
                <p className="mt-1 text-xs text-muted">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
