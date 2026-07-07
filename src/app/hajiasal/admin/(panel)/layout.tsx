import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@asal/lib/server/admin";
import { AdminLayout } from "@asal/components/admin/layout/AdminLayout";
import { hajiasalPath } from "@asal/lib/paths";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect(hajiasalPath("/admin"));
  }

  return <AdminLayout>{children}</AdminLayout>;
}
