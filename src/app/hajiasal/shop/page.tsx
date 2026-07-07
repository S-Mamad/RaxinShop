import type { Metadata } from "next";
import { ShopContent } from "@asal/components/shop/ShopContent";
import { getAllProducts } from "@asal/lib/products";
import { hajiasalCanonical } from "@asal/lib/paths";

export const metadata: Metadata = {
  title: "فروشگاه",
  description:
    "لیست کامل محصولات حاجی عسل — عسل کوهستان، آویشن، چهل‌گیاه، ژل رویال، شهد با موم و ست‌های هدیه",
  alternates: { canonical: hajiasalCanonical("/shop") },
};

export default function ShopPage() {
  const initialProducts = getAllProducts();

  return <ShopContent initialProducts={initialProducts} />;
}
