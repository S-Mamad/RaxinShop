import { cn } from "@asal/lib/utils";

interface BadgeProps {
  variant?: "bestseller" | "new" | "out-of-stock" | "default";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "bestseller" && "bg-gold-dim text-gold",
        variant === "new" && "bg-emerald-500/10 text-emerald-400",
        variant === "out-of-stock" && "bg-red-500/10 text-red-400",
        variant === "default" &&
          "border border-white/5 bg-white/5 text-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}
