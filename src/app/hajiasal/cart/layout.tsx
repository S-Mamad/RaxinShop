import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: "بررسی و مدیریت سبد خرید حاجی عسل",
  alternates: { canonical: "/cart" },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
