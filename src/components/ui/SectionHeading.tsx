import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <div
          className={cn(
            "mb-5 flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-8 bg-accent/50" />
          <span className="text-sm font-medium text-accent">{eyebrow}</span>
        </div>
      ) : null}
      <h2 className="font-display text-[1.75rem] text-foreground md:text-[2.5rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[15px] leading-[1.9] text-muted md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
