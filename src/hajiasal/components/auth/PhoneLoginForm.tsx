"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone } from "@phosphor-icons/react";
import { Input } from "@asal/components/ui/Input";
import { Button } from "@asal/components/ui/Button";
import { OtpInput } from "@asal/components/auth/OtpInput";
import { Icon } from "@asal/components/ui/Icon";
import { hajiasalPath } from "@asal/lib/paths";
import { useOtpTimer } from "@asal/hooks/useOtpTimer";
import { syncWishlistToServer } from "@asal/lib/client/wishlist-sync";

interface PhoneLoginFormProps {
  mode?: "login" | "register";
  onNeedsRegister?: (phone: string) => void;
}

export function PhoneLoginForm({
  mode = "login",
  onNeedsRegister,
}: PhoneLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? hajiasalPath("/account");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { seconds, canResend, start: startTimer } = useOtpTimer(90);

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "خطا در ارسال کد");
        return;
      }
      setMessage(data.message);
      setStep("otp");
      startTimer();
    } catch {
      setError("اتصال برقرار نشد. دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "کد نادرست است");
        return;
      }

      if (data.isNewUser || mode === "register") {
        onNeedsRegister?.(phone);
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

  if (step === "phone") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendOtp();
        }}
        className="flex flex-col gap-4"
      >
        <Input
          label="شماره موبایل"
          placeholder="09123456789"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button type="submit" disabled={loading || phone.length < 10} className="w-full">
          <Icon icon={Phone} size={18} />
          {loading ? "در حال ارسال..." : "دریافت کد تأیید"}
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-center text-sm text-muted">
        کد ارسال‌شده به <span dir="ltr" className="font-medium text-brown">{phone}</span>
      </p>
      {message ? <p className="text-center text-xs text-amber">{message}</p> : null}
      <OtpInput value={otp} onChange={setOtp} disabled={loading} error={error} />
      <Button
        type="button"
        onClick={() => void verifyOtp()}
        disabled={loading || otp.length < 4}
        className="w-full"
      >
        {loading ? "در حال تأیید..." : mode === "register" ? "ادامه ثبت‌نام" : "ورود"}
      </Button>
      <div className="flex items-center justify-between text-xs text-muted">
        <button
          type="button"
          className="text-amber hover:underline"
          onClick={() => {
            setStep("phone");
            setOtp("");
            setError("");
          }}
        >
          تغییر شماره
        </button>
        <button
          type="button"
          disabled={!canResend || loading}
          className="disabled:opacity-50 hover:text-amber"
          onClick={() => void sendOtp()}
        >
          {canResend ? "ارسال مجدد" : `ارسال مجدد (${seconds}ث)`}
        </button>
      </div>
    </div>
  );
}
