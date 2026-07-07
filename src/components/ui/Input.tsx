import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="telemetry text-dim">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 border border-border bg-elevated px-4 font-mono text-sm text-foreground transition-colors placeholder:text-dim focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20",
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

Input.displayName = "Input";
