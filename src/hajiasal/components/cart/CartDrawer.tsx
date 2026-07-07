"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "@phosphor-icons/react";
import { useCartStore } from "@asal/store/cart";
import { Button } from "@asal/components/ui/Button";
import { CartItemRow } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { FreeShippingBar } from "./FreeShippingBar";
import { hajiasalPath } from "@asal/lib/paths";

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const itemCount = useCartStore((s) => s.getItemCount());
  const progress = useCartStore((s) => s.getFreeShippingProgress());
  const amountRemaining = useCartStore((s) => s.getAmountUntilFreeShipping());
  const isFree = useCartStore((s) => s.isFreeShipping());
  const setHasHydrated = useCartStore((s) => s.setHasHydrated);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => !el.hasAttribute("disabled"),
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-brown/30 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            ref={panelRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed start-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"
            role="dialog"
            aria-label="سبد خرید"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-lg font-bold text-brown">
                سبد خرید
                {itemCount > 0 ? (
                  <span className="ms-2 text-sm font-normal text-muted">
                    ({itemCount.toLocaleString("fa-IR")} قلم)
                  </span>
                ) : null}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-cream-dark hover:text-brown"
                aria-label="بستن"
              >
                <X size={20} weight="light" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <CartItemRow />
            </div>

            {itemCount > 0 ? (
              <div className="border-t border-border px-5 py-4">
                <div className="mb-4">
                  <FreeShippingBar
                    progress={progress}
                    amountRemaining={amountRemaining}
                    isFree={isFree}
                  />
                </div>
                <CartSummary />
                <div className="mt-4 flex flex-col gap-2">
                  <Button href={hajiasalPath("/checkout")} onClick={closeCart} className="w-full">
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
