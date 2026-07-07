"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone } from "@phosphor-icons/react";
import { Input } from "@asal/components/ui/Input";
import { Button } from "@asal/components/ui/Button";
import { OtpInput } from "@asal/components/auth/OtpInput";
import { Icon } from "@asal/components/ui/Icon";
import { hajiasalPath } from "@asal/lib/paths";
import { useOtpTimer } from "@asal/hooks/useOtpTimer";
import { syncWishlistToServer } from "@asal/lib/client/wishlist-sync";
import { useAuth } from "@asal/hooks/useAuth";
import {
  formatPhoneInput,
  isValidIranMobile,
  maskPhone,
  normalizePhoneInput,
} from "@asal/lib/auth/phone-mask";

interface PhoneLoginFormProps {
  mode?: "login" | "register";
  onNeedsRegister?: (phone: string) => void;
}

const IS_DEV = process.env.NODE_ENV === "development";

export function PhoneLoginForm({
  mode = "login",
  onNeedsRegister,
}: PhoneLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const redirect = searchParams.get("redirect") ?? hajiasalPath("/account");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { seconds, canResend, start: startTimer } = useOtpTimer(90);

  const normalizedPhone = normalizePhoneInput(phone);

  const sendOtp = async () => {
    if (!isValidIranMobile(phone)) {
      setError("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
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
        body: JSON.stringify({ phone: normalizedPhone, code: otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "کد نادرست است");
        return;
      }

      await refresh();

      if (mode === "register" && !data.isNewUser) {
        await syncWishlistToServer();
        router.push(redirect);
        router.refresh();
        return;
      }

      if (data.isNewUser || mode === "register") {
        onNeedsRegister?.(normalizedPhone);
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

  useEffect(() => {
    if (step === "otp" && otp.length === 4 && !loading) {
      void verifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  if (step === "phone") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendOtp();
        }}
        className="flex flex-col gap-4"
      >
        {IS_DEV ? (
          <div className="rounded-xl border border-amber/30 bg-gold-dim px-3 py-2 text-xs text-brown">
            حالت توسعه: 09123456789 / 1234
          </div>
        ) : null}
        <Input
          label="شماره موبایل"
          placeholder="0912 345 6789"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
          autoComplete="tel"
          inputMode="numeric"
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button
          type="submit"
          disabled={loading || !isValidIranMobile(phone)}
          className="w-full"
        >
          <Icon icon={Phone} size={18} />
          {loading ? "در حال ارسال..." : "دریافت کد تأیید"}
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-center text-xs text-muted">مرحله ۲ از ۲</p>
      <p className="text-center text-sm text-muted">
        کد ارسال‌شده به{" "}
        <span dir="ltr" className="font-medium text-brown">
          {maskPhone(normalizedPhone)}
        </span>
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
