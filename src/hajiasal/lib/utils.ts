import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("fa-IR")} تومان`;
}

export function formatPersianNumber(num: number): string {
  return num.toLocaleString("fa-IR");
}
