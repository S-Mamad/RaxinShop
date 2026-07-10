"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Storefront } from "@phosphor-icons/react";
import { AdminButton } from "@asal/components/admin/ui/AdminButton";
import { hajiasalPath } from "@asal/lib/paths";

export function SellerLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/seller/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "ورود ناموفق");
        return;
      }
      router.push(hajiasalPath("/seller/dashboard"));
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f7f4ef] px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1c1714] text-amber-200">
            <Storefront size={22} weight="fill" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-stone-900">
              پنل فروشنده
            </h1>
            <p className="text-sm text-stone-500">حاجی عسل · ورود همکاران</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-stone-700">موبایل</span>
            <input
              dir="ltr"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09121111111"
              className="h-11 rounded-xl border border-stone-300 px-4 text-sm outline-none focus:border-amber-700/40 focus:ring-2 focus:ring-amber-700/15"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-stone-700">رمز عبور</span>
            <input
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl border border-stone-300 px-4 text-sm outline-none focus:border-amber-700/40 focus:ring-2 focus:ring-amber-700/15"
              required
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <AdminButton
            type="submit"
            disabled={loading}
            className="w-full !bg-[#1c1714] hover:!bg-[#2a221c]"
          >
            {loading ? "در حال ورود..." : "ورود به پنل"}
          </AdminButton>
        </form>

        <p className="mt-5 rounded-xl bg-stone-50 px-3 py-2 text-xs leading-relaxed text-stone-500">
          دمو: موبایل <span dir="ltr">09121111111</span> یا{" "}
          <span dir="ltr">09122222222</span> · رمز{" "}
          <span dir="ltr">seller123</span>
        </p>
      </div>
    </div>
  );
}
