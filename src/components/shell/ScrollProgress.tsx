"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[45] h-[2px] origin-[100%_50%] bg-gradient-to-l from-accent via-violet to-cyan"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
