import type { Metadata } from "next";
import { ShopContent } from "@asal/components/shop/ShopContent";
import { getAllProductsAsync } from "@asal/lib/server/products-store";
import { hajiasalCanonical } from "@asal/lib/paths";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "فروشگاه",
  description:
    "لیست کامل محصولات حاجی عسل — عسل کوهستان، آویشن، چهل‌گیاه، ژل رویال، شهد با موم و ست‌های هدیه",
  alternates: { canonical: hajiasalCanonical("/shop") },
};

export default async function ShopPage() {
  const initialProducts = await getAllProductsAsync();

  return <ShopContent initialProducts={initialProducts} />;
}
