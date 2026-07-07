import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BezelProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

export function Bezel({ children, className, innerClassName }: BezelProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-[calc(2rem-0.375rem)] border border-white/[0.06] bg-surface/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
