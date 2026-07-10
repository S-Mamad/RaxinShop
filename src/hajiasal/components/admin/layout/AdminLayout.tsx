"use client";

import { useState, type ReactNode } from "react";
import { List, X } from "@phosphor-icons/react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="admin-shell flex min-h-[100dvh] bg-slate-50 text-slate-900" dir="rtl">
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>

      {mobileNav ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="بستن منو"
            onClick={() => setMobileNav(false)}
          />
          <div className="absolute inset-y-0 start-0 flex shadow-2xl">
            <AdminSidebar onNavigate={() => setMobileNav(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNav(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="منو"
          >
            {mobileNav ? <X size={20} /> : <List size={20} />}
          </button>
          <span className="text-sm font-semibold text-slate-800">پنل مدیریت</span>
        </div>
        <AdminHeader title={title} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
