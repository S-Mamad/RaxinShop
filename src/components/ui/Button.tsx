import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href?: string;
  external?: boolean;
  variant?: "primary" | "ghost" | "outline";
  size?: "default" | "lg";
  trailingIcon?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Button({
  href,
  external,
  variant = "primary",
  size = "default",
  trailingIcon,
  children,
  className,
  onClick,
}: ButtonProps) {
  const styles = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void",
    variant === "primary" &&
      "bg-accent text-void hover:bg-accent-bright",
    variant === "ghost" && "text-foreground hover:bg-white/5",
    variant === "outline" &&
      "border border-border text-foreground hover:border-border-bright hover:bg-white/[0.04]",
    size === "default" && "h-11 px-5 text-sm",
    size === "lg" && "h-12 px-7 text-[15px]",
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {trailingIcon ? (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 dark:bg-white/10">
          {trailingIcon}
        </span>
      ) : null}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles}
          onClick={onClick}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={styles} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={styles} onClick={onClick}>
      {content}
    </button>
  );
}
