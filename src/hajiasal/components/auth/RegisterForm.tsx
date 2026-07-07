"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@asal/components/ui/Input";
import { Button } from "@asal/components/ui/Button";
import { hajiasalPath } from "@asal/lib/paths";
import { syncWishlistToServer } from "@asal/lib/client/wishlist-sync";

interface RegisterFormProps {
  phone: string;
}

export function RegisterForm({ phone }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? hajiasalPath("/account");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          fullName,
          email: email || undefined,
          newsletterOptIn: newsletter,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "خطا در ثبت‌نام");
        return;
      }
      await syncWishlistToServer();
      router.push(redirect);
      router.refresh();
    } catch {
      setError("اتصال برقرار نشد. دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input label="شماره موبایل" value={phone} dir="ltr" disabled />
      <Input
        label="نام و نام خانوادگی"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <Input
        label="ایمیل (اختیاری)"
        type="email"
        dir="ltr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="accent-amber"
        />
        می‌خواهم از تخفیف‌ها باخبر شوم
      </label>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button type="submit" disabled={loading || fullName.length < 2} className="w-full">
        {loading ? "در حال ثبت..." : "ثبت‌نام و ادامه"}
      </Button>
    </form>
  );
}
