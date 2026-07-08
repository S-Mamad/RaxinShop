"use client";

import { motion } from "motion/react";
import { formatPersianNumber } from "@/lib/utils";

interface FreeShippingBarProps {
  progress: number;
  amountRemaining: number;
  isFree: boolean;
}

export function FreeShippingBar({
  progress,
  amountRemaining,
  isFree,
}: FreeShippingBarProps) {
  if (isFree) {
    return (
      <div className="rounded-xl bg-gold-dim px-4 py-3 text-center text-sm font-medium text-gold">
        ارسال رایگان فعال شد!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-secondary">
        {formatPersianNumber(amountRemaining)} تومان دیگر تا ارسال رایگان!
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
        <motion.div
          className="h-full rounded-full bg-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>
    </div>
  );
}
