"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const useBlur = !isMobile;

  return (
    <motion.div
      className={cn(className)}
      initial={{
        opacity: 0,
        y: 48,
        ...(useBlur ? { filter: "blur(10px)" } : {}),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        ...(useBlur ? { filter: "blur(0px)" } : {}),
      }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
