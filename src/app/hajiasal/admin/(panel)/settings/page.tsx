"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { Button } from "@asal/components/ui/Button";
import { Icon } from "@asal/components/ui/Icon";
import { hajiasalPath } from "@asal/lib/paths";

interface EnvStatus {
  supabase: boolean;
  sms: boolean;
  zarinpal: boolean;
  authSecret: boolean;
  adminPassword: boolean;
  siteUrl: boolean;
}

const LABELS: Record<keyof EnvStatus, string> = {
  supabase: "Supabase",
  sms: "پیامک (Kavenegar)",
  zarinpal: "زرین‌پال",
  authSecret: "AUTH_SESSION_SECRET",
  adminPassword: "ADMIN_PASSWORD",
  siteUrl: "NEXT_PUBLIC_SITE_URL",
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [env, setEnv] = useState<EnvStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings");
      if (res.status === 401) {
        router.push(hajiasalPath("/admin"));
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطا در بارگذاری");
      setEnv(data.env);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push(hajiasalPath("/admin"));
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">تنظیمات سیستم و وضعیت سرویس‌ها</p>
        <Button type="button" variant="outline" onClick={() => void loadSettings()}>
          بروزرسانی
        </Button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">در حال بارگذاری...</p> : null}

      {env ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(LABELS) as Array<keyof EnvStatus>).map((key) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <span className="text-sm text-slate-700">{LABELS[key]}</span>
              <span className="flex items-center gap-1.5 text-sm">
                <Icon
                  icon={env[key] ? CheckCircle : XCircle}
                  size={18}
                  className={env[key] ? "text-green-600" : "text-red-500"}
                />
                {env[key] ? "فعال" : "غیرفعال"}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-2 font-semibold text-slate-900">خروج از پنل</h3>
        <p className="mb-4 text-sm text-slate-500">
          با خروج، نشست ادمین از سرور حذف می‌شود.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => void logout()}
          disabled={loggingOut}
        >
          {loggingOut ? "در حال خروج..." : "خروج از پنل مدیریت"}
        </Button>
      </div>
    </div>
  );
}
