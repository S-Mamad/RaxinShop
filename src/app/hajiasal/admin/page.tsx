import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@asal/lib/server/admin";
import { AdminLogin } from "@asal/components/admin/AdminLogin";
import { hajiasalPath } from "@asal/lib/paths";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (authenticated) {
    redirect(hajiasalPath("/admin/dashboard"));
  }

  return <AdminLogin />;
}
