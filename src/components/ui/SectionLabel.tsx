import { cn } from "@/lib/utils";

interface SectionLabelProps {
  index: string;
  title: string;
  className?: string;
}

export function SectionLabel({ index, title, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="font-mono text-xs tracking-[0.2em] text-signal">
        {index}
      </span>
      <span className="h-px flex-1 max-w-16 bg-border" />
      <span className="font-mono text-xs tracking-[0.15em] text-muted uppercase">
        {title}
      </span>
    </div>
  );
}
