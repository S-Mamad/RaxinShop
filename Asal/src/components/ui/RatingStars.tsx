import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  size = "sm",
  className,
}: RatingStarsProps) {
  const iconSize = size === "sm" ? 14 : 18;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={iconSize}
            strokeWidth={1.5}
            className={cn(
              i < Math.floor(rating)
                ? "fill-gold text-gold"
                : i < rating
                  ? "fill-gold/50 text-gold"
                  : "fill-none text-dim",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-secondary">
        {rating.toLocaleString("fa-IR")}
        {reviewCount !== undefined
          ? ` (${reviewCount.toLocaleString("fa-IR")})`
          : null}
      </span>
    </div>
  );
}
