"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@asal/lib/utils";

interface AccordionItem {
  title: string;
  content: string;
}

interface ProductAccordionProps {
  items: AccordionItem[];
}

export function ProductAccordion({ items }: ProductAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
      {items.map((item, i) => (
        <div key={item.title}>
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-start"
          >
            <span className="text-sm font-medium text-brown">{item.title}</span>
            <CaretDown
              size={18}
              weight="light"
              className={cn(
                "text-muted transition-transform duration-300",
                openIndex === i && "rotate-180",
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === i ? "max-h-48 pb-4" : "max-h-0",
            )}
          >
            <p className="px-5 text-sm leading-relaxed text-muted">
              {item.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
