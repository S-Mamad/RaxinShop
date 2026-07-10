"use client";

import { type ReactNode, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
}

export function MagneticButton({
  href,
  children,
  trailingIcon,
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * 0.15);
    y.set(offsetY * 0.15);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      className="inline-block"
    >
      <Link
        ref={ref}
        href={href}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={cn(
          "group motion-safe:inline-flex items-center justify-center gap-2.5 border border-accent/40 bg-accent px-6 py-3 text-sm font-medium text-void transition-colors duration-300 hover:bg-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void motion-safe:active:scale-[0.98]",
          className,
        )}
      >
        {trailingIcon ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-void/20 bg-void/10 transition-transform duration-500 group-hover:-translate-x-0.5">
            {trailingIcon}
          </span>
        ) : null}
        <span>{children}</span>
      </Link>
    </motion.div>
  );
}
