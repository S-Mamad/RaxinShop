import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm text-muted">
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-[120px] resize-y border border-border bg-elevated px-4 py-3 font-mono text-sm text-foreground transition-colors placeholder:text-dim focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20",
            error && "border-signal/50",
            className,
          )}
          {...props}
        />
        {error ? <p className="text-xs text-signal">{error}</p> : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
