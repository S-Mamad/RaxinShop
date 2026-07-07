"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@asal/components/auth/AuthLayout";
import { PhoneLoginForm } from "@asal/components/auth/PhoneLoginForm";
import { RegisterForm } from "@asal/components/auth/RegisterForm";
import { EmailLoginForm } from "@asal/components/auth/EmailLoginForm";
import { hajiasalPath } from "@asal/lib/paths";
import { cn } from "@asal/lib/utils";

type Tab = "login" | "register" | "email";
type Step = "auth" | "complete-profile";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const showEmailTab = tabParam === "email";
  const initialTab: Tab =
    tabParam === "register" ? "register" : tabParam === "email" ? "email" : "login";

  const [tab, setTab] = useState<Tab>(initialTab);
  const [step, setStep] = useState<Step>("auth");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (tabParam === "register") setTab("register");
    if (tabParam === "email") setTab("email");
  }, [tabParam]);

  const handleNeedsRegister = (p: string) => {
    setPhone(p);
    setStep("complete-profile");
  };

  const authStep = step === "complete-profile" ? 2 : 1;

  return (
    <AuthLayout
      title={step === "complete-profile" ? "تکمیل ثبت‌نام" : "به حاجی عسل خوش آمدید"}
      subtitle={
        step === "complete-profile"
          ? "فقط چند ثانیه تا شروع خرید"
          : "ورود سریع با موبایل برای خرید امن"
      }
    >
      {step === "complete-profile" ? (
        <RegisterForm phone={phone} />
      ) : (
        <>
          {authStep === 1 ? (
            <p className="mb-4 text-center text-xs text-muted">مرحله ۱ از ۲</p>
          ) : null}

          <div className="mb-6 flex gap-1 rounded-full bg-cream-dark p-1">
            {(
              [
                { id: "login" as const, label: "ورود" },
                { id: "register" as const, label: "ثبت‌نام" },
                ...(showEmailTab
                  ? [{ id: "email" as const, label: "ایمیل" }]
                  : []),
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
                  tab === item.id
                    ? "bg-surface text-brown shadow-sm"
                    : "text-muted hover:text-brown",
                )}
              >
                {item.label}
                {item.id === "email" ? (
                  <span className="ms-1 text-[10px] text-amber">به‌زودی</span>
                ) : null}
              </button>
            ))}
          </div>

          {tab === "email" ? (
            <EmailLoginForm />
          ) : (
            <PhoneLoginForm
              mode={tab}
              onNeedsRegister={handleNeedsRegister}
            />
          )}

          <p className="mt-6 text-center text-xs text-muted">
            با ورود،{" "}
            <Link href={hajiasalPath("/terms")} className="text-amber hover:underline">
              قوانین
            </Link>{" "}
            و{" "}
            <Link href={hajiasalPath("/privacy")} className="text-amber hover:underline">
              حریم خصوصی
            </Link>{" "}
            را می‌پذیرید.
          </p>
        </>
      )}
    </AuthLayout>
  );
}

export function LoginPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center text-muted">
          در حال بارگذاری...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
