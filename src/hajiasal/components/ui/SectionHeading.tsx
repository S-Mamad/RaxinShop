import { cn } from "@asal/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <h2 className="text-2xl font-bold tracking-tight text-brown md:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-xl text-sm text-muted md:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}
