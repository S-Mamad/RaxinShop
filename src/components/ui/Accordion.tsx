"use client";

import { useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("flex flex-col gap-px border border-border bg-border", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div key={item.id} className="bg-void">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start transition-colors hover:bg-surface"
            >
              <span className="text-sm font-medium text-foreground md:text-base">
                {item.title}
              </span>
              <CaretDown
                className={cn(
                  "h-4 w-4 shrink-0 text-accent transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
                weight="bold"
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-border px-6 py-5 text-sm leading-[1.9] text-muted">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
