"use client";

import Link from "next/link";
import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "@asal/lib/utils";

type AdminButtonVariant = "primary" | "outline" | "ghost" | "danger";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: AdminButtonVariant;
  children: ReactNode;
}

const variants: Record<AdminButtonVariant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400",
  outline:
    "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:opacity-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger: "bg-red-600 text-white hover:bg-red-500",
};

export function AdminButton({
  href,
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: AdminButtonProps) {
  const styles = cn(
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles} onClick={props.onClick as never}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles} {...props}>
      {children}
    </button>
  );
}
