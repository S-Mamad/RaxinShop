"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@asal/components/admin/ui/DataTable";
import { AdminButton } from "@asal/components/admin/ui/AdminButton";
import { Input } from "@asal/components/ui/Input";
import { hajiasalPath } from "@asal/lib/paths";

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    if (res.status === 401) {
      router.push(hajiasalPath("/admin"));
      return;
    }
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!name || !slug) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: slug,
        slug,
        name,
        sortOrder: categories.length,
      }),
    });
    setName("");
    setSlug("");
    void load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="نام دسته"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="slug"
          dir="ltr"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="max-w-xs"
        />
        <AdminButton type="button" onClick={() => void save()}>
          افزودن / ذخیره
        </AdminButton>
      </div>

      {loading ? <p className="text-sm text-slate-500">در حال بارگذاری...</p> : null}

      <DataTable
        data={categories}
        rowKey={(r) => r.id}
        emptyMessage="دسته‌ای یافت نشد"
        columns={[
          { key: "name", header: "نام", render: (r) => r.name },
          {
            key: "slug",
            header: "slug",
            render: (r) => (
              <span dir="ltr" className="font-mono text-xs">
                {r.slug}
              </span>
            ),
          },
          {
            key: "desc",
            header: "توضیح",
            render: (r) => r.description ?? "—",
          },
        ]}
      />
    </div>
  );
}
