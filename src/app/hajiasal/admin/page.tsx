import { isAdminAuthenticated } from "@asal/lib/server/admin";
import { AdminLogin } from "@asal/components/admin/AdminLogin";
import { AdminDashboard } from "@asal/components/admin/AdminDashboard";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
