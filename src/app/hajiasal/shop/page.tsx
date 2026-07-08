import type { Metadata } from "next";
import { ShopContent } from "@asal/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "فروشگاه",
  description:
    "لیست کامل محصولات حاجی عسل: عسل کوهستان، آویشن، چهل‌گیاه، ژل رویال، شهد با موم و ست‌های هدیه",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopContent />;
}
