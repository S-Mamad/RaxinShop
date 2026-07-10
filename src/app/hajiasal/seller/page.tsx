import { redirect } from "next/navigation";
import { getSellerFromCookies } from "@asal/lib/server/sellers";
import { SellerLogin } from "@asal/components/seller/SellerLogin";
import { hajiasalPath } from "@asal/lib/paths";

export default async function SellerLoginPage() {
  const seller = await getSellerFromCookies();
  if (seller) redirect(hajiasalPath("/seller/dashboard"));
  return <SellerLogin />;
}
