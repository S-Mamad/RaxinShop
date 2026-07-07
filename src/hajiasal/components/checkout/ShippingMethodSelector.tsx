"use client";

import { Truck, Zap, Store } from "lucide-react";
import { cn } from "@asal/lib/utils";

export type ShippingMethod = "standard" | "express" | "pickup";

export interface ShippingOption {
  id: ShippingMethod;
  label: string;
  description: string;
  cost: number;
  eta: string;
}

interface ShippingMethodSelectorProps {
  options: ShippingOption[];
  value: ShippingMethod;
  onChange: (method: ShippingMethod) => void;
}

const icons: Record<ShippingMethod, typeof Truck> = {
  standard: Truck,
  express: Zap,
  pickup: Store,
};

export function ShippingMethodSelector({
  options,
  value,
  onChange,
}: ShippingMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-brown">روش ارسال</p>
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
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-brown">{option.label}</span>
                  <span className="text-sm text-amber">
                    {option.cost === 0
                      ? "رایگان"
                      : `${option.cost.toLocaleString("fa-IR")} تومان`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{option.description}</p>
                <p className="mt-1 text-xs text-muted">{option.eta}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
