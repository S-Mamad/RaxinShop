"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: "slow" | "normal";
}

export function Marquee({ children, className, speed = "normal" }: MarqueeProps) {
  return (
    <div dir="ltr" className={cn("relative overflow-hidden", className)}>
      <div
        className="flex w-max gap-8 animate-marquee"
        style={{ animationDuration: speed === "slow" ? "50s" : "32s" }}
      >
        {children}
        {children}
      </div>
      <div className="pointer-events-none absolute inset-y-0 start-0 w-20 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 end-0 w-20 bg-gradient-to-l from-void to-transparent" />
    </div>
  );
}
