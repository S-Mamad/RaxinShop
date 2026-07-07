import { cn } from "@/lib/utils";

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
        variant === "bestseller" && "bg-amber text-white",
        variant === "new" && "bg-gold-dim text-gold",
        variant === "out-of-stock" && "bg-brown/10 text-muted",
        variant === "default" && "bg-cream-dark text-brown",
        className,
      )}
    >
      {children}
    </span>
  );
}
