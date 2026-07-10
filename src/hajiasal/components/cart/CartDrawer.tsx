"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag } from "@phosphor-icons/react";
import { useCartStore } from "@asal/store/cart";
import { Button } from "@asal/components/ui/Button";
import { hajiasalPath } from "@asal/lib/paths";
import { useBodyScrollLock } from "@asal/hooks/useBodyScrollLock";
import { CartItemRow } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { FreeShippingBar } from "./FreeShippingBar";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const itemCount = useCartStore((s) => s.getItemCount());
  const progress = useCartStore((s) => s.getFreeShippingProgress());
  const amountRemaining = useCartStore((s) => s.getAmountUntilFreeShipping());
  const isFree = useCartStore((s) => s.isFreeShipping());
  const setHasHydrated = useCartStore((s) => s.setHasHydrated);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[80] bg-void/80 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-y-0 end-0 z-[90] flex w-full max-w-md flex-col border-s border-white/8 bg-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="سبد خرید"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-5">
              <h2 className="flex items-center gap-2 text-base font-bold text-primary sm:text-lg">
                <ShoppingBag size={20} className="text-gold" />
                سبد خرید
                {itemCount > 0 ? (
                  <span className="text-sm font-normal text-secondary">
                    ({itemCount.toLocaleString("fa-IR")})
                  </span>
                ) : null}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-secondary transition-colors hover:bg-white/5 hover:text-gold"
                aria-label="بستن"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
              {itemCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-dim text-gold">
                    <ShoppingBag size={24} />
                  </div>
                  <p className="mb-1 text-sm font-medium text-primary">
                    سبد خالی است
                  </p>
                  <p className="mb-6 text-xs text-secondary">
                    محصولات مورد علاقه را اضافه کنید
                  </p>
                  <Button href={hajiasalPath("/shop")} onClick={closeCart}>
                    مشاهده فروشگاه
                  </Button>
                </div>
              ) : (
                <CartItemRow />
              )}
            </div>

            {itemCount > 0 ? (
              <div className="border-t border-white/8 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5">
                <div className="mb-4">
                  <FreeShippingBar
                    progress={progress}
                    amountRemaining={amountRemaining}
                    isFree={isFree}
                  />
                </div>
                <CartSummary />
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    href={hajiasalPath("/checkout")}
                    onClick={closeCart}
                    className="w-full"
                  >
                    تکمیل خرید
                  </Button>
                  <Button
                    href={hajiasalPath("/cart")}
                    variant="outline"
                    onClick={closeCart}
                    className="w-full"
                  >
                    مشاهده سبد
                  </Button>
                </div>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
