"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "@phosphor-icons/react";
import {
  checkoutSchema,
  type CheckoutSchemaType,
} from "@asal/lib/validations/checkout";
import { Input } from "@asal/components/ui/Input";
import { Button } from "@asal/components/ui/Button";
import { CartSummary } from "@asal/components/cart/CartSummary";
import { CartItemRow } from "@asal/components/cart/CartItem";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { PaymentMethodSelector } from "@asal/components/checkout/PaymentMethodSelector";
import type { PaymentMethod } from "@asal/components/checkout/PaymentMethodSelector";
import {
  ShippingMethodSelector,
  type ShippingMethod,
  type ShippingOption,
} from "@asal/components/checkout/ShippingMethodSelector";
import { useCartStore } from "@asal/store/cart";
import { useAuth } from "@asal/hooks/useAuth";
import { cn } from "@asal/lib/utils";
import { hajiasalPath } from "@asal/lib/paths";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";

const siteData = site as SiteConfig;

const steps = [
  { id: 1, title: "اطلاعات تماس" },
  { id: 2, title: "آدرس ارسال" },
  { id: 3, title: "بررسی و پرداخت" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");
  const [prefilled, setPrefilled] = useState(false);

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const shippingOptions: ShippingOption[] = useMemo(() => {
    const free =
      subtotal >= siteData.freeShippingThreshold ? 0 : siteData.shippingCost;
    return [
      {
        id: "standard",
        label: "ارسال عادی",
        description: "پست پیشتاز با بسته‌بندی ضدضربه",
        cost: free,
        eta: "۲ تا ۵ روز کاری",
      },
      {
        id: "express",
        label: "ارسال سریع",
        description: "پیک یا تیپاکس در مراکز استان",
        cost: free === 0 ? 0 : siteData.shippingCost + 35000,
        eta: "۱ تا ۲ روز کاری",
      },
      {
        id: "pickup",
        label: "تحویل حضوری",
        description: "مراجعه به آدرس فروشگاه پس از هماهنگی",
        cost: 0,
        eta: "هماهنگی تلفنی",
      },
    ];
  }, [subtotal]);

  const shipping =
    shippingOptions.find((o) => o.id === shippingMethod)?.cost ??
    siteData.shippingCost;
  const total = Math.max(0, subtotal + shipping - discount);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CheckoutSchemaType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      province: "",
      city: "",
      address: "",
      postalCode: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (authLoading || prefilled || !user) return;

    if (user.fullName) setValue("fullName", user.fullName);
    if (user.phone) setValue("phone", user.phone);

    void (async () => {
      try {
        const res = await fetch("/api/account/addresses");
        if (!res.ok) return;
        const data = await res.json();
        const list = (data.addresses ?? []) as Array<{
          isDefault?: boolean;
          province?: string;
          city?: string;
          address?: string;
          postalCode?: string;
        }>;
        const preferred =
          list.find((a) => a.isDefault) ?? list[0] ?? null;
        if (!preferred) return;
        if (preferred.province) setValue("province", preferred.province);
        if (preferred.city) setValue("city", preferred.city);
        if (preferred.address) setValue("address", preferred.address);
        if (preferred.postalCode) setValue("postalCode", preferred.postalCode);
      } catch {
        /* ignore */
      } finally {
        setPrefilled(true);
      }
    })();

    setPrefilled(true);
  }, [authLoading, user, prefilled, setValue]);

  useEffect(() => {
    if (paymentMethod === "online" && !isLoggedIn && !authLoading) {
      setPaymentMethod("cod");
    }
  }, [paymentMethod, isLoggedIn, authLoading]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="mb-6 text-secondary">سبد خرید شما خالی است.</p>
        <Button href={hajiasalPath("/shop")}>رفتن به فروشگاه</Button>
      </div>
    );
  }

  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger(["fullName", "phone"]);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger([
        "province",
        "city",
        "address",
        "postalCode",
      ]);
      if (valid) setStep(3);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        setCouponMessage(data.message);
      } else {
        setDiscount(0);
        setCouponMessage(data.message);
      }
    } catch {
      setCouponMessage("خطا در بررسی کد تخفیف");
    }
  };

  const onSubmit = async (data: CheckoutSchemaType) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (paymentMethod === "online" && !isLoggedIn) {
        throw new Error("برای پرداخت آنلاین ابتدا وارد حساب شوید");
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: data,
          items,
          subtotal,
          shipping,
          total,
          couponCode: discount > 0 ? couponCode : undefined,
          paymentMethod,
          shippingMethod,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "خطا در پردازش سفارش");
      }

      if (paymentMethod === "online" && result.orderId) {
        const payRes = await fetch("/api/checkout/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: result.orderId }),
        });
        const pay = await payRes.json();
        if (payRes.ok && pay.redirectUrl) {
          clearCart();
          window.location.href = pay.redirectUrl as string;
          return;
        }
        throw new Error(
          pay.message ||
            "انتقال به درگاه پرداخت ممکن نشد. روش دیگری انتخاب کنید.",
        );
      }

      clearCart();
      const params = new URLSearchParams({
        orderId: result.orderId,
        tracking: result.trackingCode ?? "",
      });
      router.push(`${hajiasalPath("/checkout/success")}?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginHref = `${hajiasalPath("/login")}?redirect=${encodeURIComponent(hajiasalPath("/checkout"))}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-14">
      <SectionHeading title="تکمیل خرید" className="mb-6 md:mb-8" />

      {!authLoading && !isLoggedIn ? (
        <div className="mb-6 rounded-xl border border-white/8 bg-surface px-4 py-3 text-sm text-secondary md:mb-8">
          برای پیگیری آسان‌تر سفارش‌ها{" "}
          <Link href={loginHref} className="text-gold hover:text-gold-bright">
            وارد حساب شوید
          </Link>
          . خرید مهمان هم ممکن است.
        </div>
      ) : null}

      {isLoggedIn ? (
        <p className="mb-5 text-xs text-dim md:mb-6">
          وارد شده‌اید
          {user?.fullName ? ` · ${user.fullName}` : ""} — اطلاعات از حساب پر
          می‌شود.
        </p>
      ) : null}

      <div className="mb-6 flex items-center justify-between md:mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  step >= s.id
                    ? "bg-gold text-void"
                    : "bg-surface-elevated text-secondary",
                )}
              >
                {step > s.id ? (
                  <Check size={16} weight="bold" />
                ) : (
                  s.id.toLocaleString("fa-IR")
                )}
              </div>
              <span className="hidden text-xs text-secondary sm:block">
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <div
                className={cn(
                  "mx-2 h-px flex-1",
                  step > s.id ? "bg-gold" : "bg-white/10",
                )}
              />
            ) : null}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-white/6 bg-surface p-4 sm:p-5 md:p-8"
      >
        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <Input
              label="نام و نام خانوادگی"
              {...register("fullName")}
              error={errors.fullName?.message}
            />
            <Input
              label="شماره موبایل"
              placeholder="09123456789"
              dir="ltr"
              {...register("phone")}
              error={errors.phone?.message}
              disabled={isLoggedIn}
            />
            {isLoggedIn ? (
              <p className="text-[11px] text-dim">
                موبایل حساب کاربری قابل تغییر در این مرحله نیست.
              </p>
            ) : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex flex-col gap-4">
            <Input
              label="استان"
              {...register("province")}
              error={errors.province?.message}
            />
            <Input
              label="شهر"
              {...register("city")}
              error={errors.city?.message}
            />
            <Input
              label="آدرس کامل"
              {...register("address")}
              error={errors.address?.message}
            />
            <Input
              label="کد پستی"
              placeholder="1234567890"
              dir="ltr"
              {...register("postalCode")}
              error={errors.postalCode?.message}
            />
            <Input
              label="یادداشت (اختیاری)"
              {...register("notes")}
              error={errors.notes?.message}
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-surface-elevated p-4 text-sm">
              <p>
                <span className="text-secondary">نام: </span>
                {getValues("fullName")}
              </p>
              <p>
                <span className="text-secondary">موبایل: </span>
                <span dir="ltr">{getValues("phone")}</span>
              </p>
              <p>
                <span className="text-secondary">آدرس: </span>
                {getValues("province")}، {getValues("city")}،{" "}
                {getValues("address")}
              </p>
            </div>

            <ShippingMethodSelector
              options={shippingOptions}
              value={shippingMethod}
              onChange={setShippingMethod}
            />

            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
              onlineDisabled={!isLoggedIn}
            />
            {!isLoggedIn ? (
              <p className="text-[11px] text-dim">
                پرداخت آنلاین فقط برای کاربران واردشده فعال است.{" "}
                <Link href={loginHref} className="text-gold">
                  ورود
                </Link>
              </p>
            ) : null}

            <CartItemRow />
            <div className="flex gap-2">
              <Input
                placeholder="کد تخفیف"
                dir="ltr"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={applyCoupon}>
                اعمال
              </Button>
            </div>
            {couponMessage ? (
              <p
                className={`text-xs ${discount > 0 ? "text-gold" : "text-secondary"}`}
              >
                {couponMessage}
              </p>
            ) : null}
            <CartSummary shippingOverride={shipping} discount={discount} />
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </div>
        ) : null}

        <div className="mt-8 flex gap-3">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              قبلی
            </Button>
          ) : null}
          {step < 3 ? (
            <Button type="button" onClick={nextStep} className="flex-1">
              بعدی
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting
                ? "در حال پردازش..."
                : paymentMethod === "online"
                  ? "پرداخت آنلاین"
                  : "ثبت سفارش"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
