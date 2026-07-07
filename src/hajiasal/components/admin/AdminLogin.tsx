"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@asal/components/ui/Input";
import { Button } from "@asal/components/ui/Button";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { hajiasalPath } from "@asal/lib/paths";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "رمز عبور نادرست است");
        return;
      }

      router.push(hajiasalPath("/admin/dashboard"));
      router.refresh();
    } catch {
      setError("خطا در ورود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-24 md:px-6 md:py-32">
      <SectionHeading
        title="پنل مدیریت"
        subtitle="ورود با رمز عبور ادمین"
        className="mb-8"
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
      >
        <Input
          label="رمز عبور"
          type="password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button type="submit" disabled={loading || !password}>
          {loading ? "در حال ورود..." : "ورود"}
        </Button>
      </form>
    </div>
  );
}
