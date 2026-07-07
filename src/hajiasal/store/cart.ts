"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, WeightOption } from "@asal/types";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";

const siteData = site as SiteConfig;

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  announcement: string;
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setAnnouncement: (message: string) => void;
  clearAnnouncement: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, weightGrams: number) => void;
  updateQuantity: (
    productId: string,
    weightGrams: number,
    quantity: number,
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
  getFreeShippingProgress: () => number;
  getAmountUntilFreeShipping: () => number;
  isFreeShipping: () => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      announcement: "",
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      setAnnouncement: (message) => set({ announcement: message }),
      clearAnnouncement: () => set({ announcement: "" }),

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === item.productId &&
              i.weight.grams === item.weight.grams,
          );
          const announcement = existing
            ? `تعداد ${item.title} در سبد به‌روزرسانی شد`
            : `${item.title} به سبد خرید اضافه شد`;
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId &&
                i.weight.grams === item.weight.grams
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
              isOpen: true,
              announcement,
            };
          }
          return {
            items: [...state.items, { ...item, quantity }],
            isOpen: true,
            announcement,
          };
        });
      },

      removeItem: (productId, weightGrams) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.productId === productId && i.weight.grams === weightGrams
              ),
          ),
        }));
      },

      updateQuantity: (productId, weightGrams, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, weightGrams);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.weight.grams === weightGrams
              ? { ...i, quantity }
              : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.weight.price * item.quantity,
          0,
        ),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        if (subtotal >= siteData.freeShippingThreshold || subtotal === 0) {
          return 0;
        }
        return siteData.shippingCost;
      },

      getTotal: () => get().getSubtotal() + get().getShippingCost(),

      getFreeShippingProgress: () => {
        const subtotal = get().getSubtotal();
        if (subtotal >= siteData.freeShippingThreshold) return 100;
        return Math.min(
          100,
          (subtotal / siteData.freeShippingThreshold) * 100,
        );
      },

      getAmountUntilFreeShipping: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, siteData.freeShippingThreshold - subtotal);
      },

      isFreeShipping: () =>
        get().getSubtotal() >= siteData.freeShippingThreshold,
    }),
    {
      name: "haji-asal-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export type { WeightOption };
