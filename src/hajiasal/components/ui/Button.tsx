"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { type ReactNode } from "react";
import { cn } from "@asal/lib/utils";
import { useMagneticHover } from "@asal/hooks/useMagneticHover";

interface ButtonProps {
  href?: string;
  target?: string;
  rel?: string;
  variant?: "primary" | "ghost" | "outline";
  size?: "default" | "lg" | "sm";
  magnetic?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function Button({
  href,
  target,
  rel,
  variant = "primary",
  size = "default",
  magnetic = false,
  disabled = false,
  type = "button",
  onClick,
  children,
  className,
}: ButtonProps) {
  const { ref, springX, springY, onMouseMove, onMouseLeave } =
    useMagneticHover(0.15);

  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
    "disabled:pointer-events-none disabled:opacity-50",
    variant === "primary" &&
      "bg-amber text-white shadow-[0_4px_24px_-4px_var(--amber-glow)] hover:bg-amber-bright active:scale-[0.98]",
    variant === "ghost" && "text-brown hover:bg-brown/5",
    variant === "outline" &&
      "border border-border text-brown hover:border-border-bright hover:bg-surface",
    size === "sm" && "h-9 px-4 text-sm",
    size === "default" && "h-11 px-6 text-sm",
    size === "lg" && "h-13 px-8 text-base",
    className,
  );

  const content = magnetic ? (
    <motion.span
      style={{ x: springX, y: springY }}
      className="inline-flex items-center justify-center gap-2"
    >
      {children}
    </motion.span>
  ) : (
    children
  );

  if (href) {
    const linkProps = { className: styles, target, rel };
    if (magnetic) {
      return (
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className="inline-block"
        >
          <Link href={href} {...linkProps}>
            {content}
          </Link>
        </div>
      );
    }
    return (
      <Link href={href} {...linkProps}>
        {content}
      </Link>
    );
  }

  if (magnetic) {
    return (
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="inline-block"
      >
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          className={styles}
        >
          {content}
        </button>
      </div>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={styles}
    >
      {content}
    </button>
  );
}
