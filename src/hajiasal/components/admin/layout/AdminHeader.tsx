"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";
import { Icon } from "@asal/components/ui/Icon";
import { hajiasalPath } from "@asal/lib/paths";

const PAGE_TITLES: Record<string, string> = {
  [hajiasalPath("/admin/dashboard")]: "داشبورد",
  [hajiasalPath("/admin/orders")]: "سفارش‌ها",
  [hajiasalPath("/admin/products")]: "محصولات",
  [hajiasalPath("/admin/categories")]: "دسته‌بندی‌ها",
  [hajiasalPath("/admin/inventory")]: "موجودی",
  [hajiasalPath("/admin/customers")]: "مشتریان",
  [hajiasalPath("/admin/reviews")]: "نظرات",
  [hajiasalPath("/admin/coupons")]: "کوپن‌ها",
  [hajiasalPath("/admin/messages")]: "پیام‌ها",
  [hajiasalPath("/admin/newsletter")]: "خبرنامه",
  [hajiasalPath("/admin/content")]: "محتوا",
  [hajiasalPath("/admin/reports")]: "گزارش‌ها",
  [hajiasalPath("/admin/settings")]: "تنظیمات",
};

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const crumbs: { label: string; href?: string }[] = [
    { label: "مدیریت", href: hajiasalPath("/admin/dashboard") },
  ];

  if (pathname.includes("/admin/orders/") && pathname !== hajiasalPath("/admin/orders")) {
    crumbs.push({ label: "سفارش‌ها", href: hajiasalPath("/admin/orders") });
    crumbs.push({ label: "جزئیات سفارش" });
    return crumbs;
  }

  const title = PAGE_TITLES[pathname];
  if (title && pathname !== hajiasalPath("/admin/dashboard")) {
    crumbs.push({ label: title });
  } else if (pathname === hajiasalPath("/admin/dashboard")) {
    crumbs.push({ label: "داشبورد" });
  }

  return crumbs;
}

function getPageTitle(pathname: string): string {
  if (pathname.includes("/admin/orders/") && pathname !== hajiasalPath("/admin/orders")) {
    return "جزئیات سفارش";
  }
  return PAGE_TITLES[pathname] ?? "پنل مدیریت";
}

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const pageTitle = title ?? getPageTitle(pathname);

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        {breadcrumbs.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? (
              <Icon icon={CaretLeft} size={12} className="text-slate-400" />
            ) : null}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-slate-700">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-slate-700">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      <h2 className="text-xl font-semibold text-slate-900">{pageTitle}</h2>
    </header>
  );
}
