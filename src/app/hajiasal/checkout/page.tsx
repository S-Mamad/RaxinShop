"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "@phosphor-icons/react";
import { checkoutSchema, type CheckoutSchemaType } from "@asal/lib/validations/checkout";
import { Input } from "@asal/components/ui/Input";
import { Button } from "@asal/components/ui/Button";
import { CartSummary } from "@asal/components/cart/CartSummary";
import { CartItemRow } from "@asal/components/cart/CartItem";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import {
  ShippingMethodSelector,
  type ShippingMethod,
  type ShippingOption,
} from "@asal/components/checkout/ShippingMethodSelector";
import { PaymentMethodSelector } from "@asal/components/checkout/PaymentMethodSelector";
import { useCartStore } from "@asal/store/cart";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";
import iranLocations from "@asal/data/iran-locations.json";
import { cn } from "@asal/lib/utils";
import { hajiasalPath } from "@asal/lib/paths";
import type { PaymentMethod } from "@asal/lib/server/orders";
import { useAuth } from "@asal/hooks/useAuth";

const siteData = site as SiteConfig;

const steps = [
  { id: 1, title: "سبد خرید" },
  { id: 2, title: "اطلاعات و آدرس" },
  { id: 3, title: "ارسال و پرداخت" },
  { id: 4, title: "بررسی نهایی" },
];

type LocationEntry = { province: string; cities: string[] };

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-muted">
          در حال بارگذاری...
        </div>
      }
    >
      <CheckoutPageInner />
    </Suspense>
  );
}

function CheckoutPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const isFreeShipping = useCartStore((s) => s.isFreeShipping());
  const clearCart = useCartStore((s) => s.clearCart);

  const shippingOptions: ShippingOption[] = useMemo(
    () => [
      {
        id: "standard",
        label: "پست پیشتاز",
        description: "ارسال استاندارد با بسته‌بندی ایمن",
        cost: isFreeShipping ? 0 : siteData.shippingCost,
        eta: "۲ تا ۴ روز کاری",
      },
      {
        id: "express",
        label: "ارسال فوری",
        description: "تحویل سریع در شهرهای اصلی",
        cost: isFreeShipping ? 35000 : siteData.shippingCost + 40000,
        eta: "۱ تا ۲ روز کاری",
      },
      {
        id: "pickup",
        label: "تحویل حضوری",
        description: "دریافت از فروشگاه حاجی عسل",
        cost: 0,
        eta: "هماهنگی تلفنی",
      },
    ],
    [isFreeShipping],
  );

  const shipping =
    shippingOptions.find((o) => o.id === shippingMethod)?.cost ?? siteData.shippingCost;
  const total = subtotal + shipping - discount;

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
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

  const selectedProvince = watch("province");
  const cities = useMemo(() => {
    const entry = (iranLocations as LocationEntry[]).find(
      (l) => l.province === selectedProvince,
    );
    return entry?.cities ?? [];
  }, [selectedProvince]);

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

  useEffect(() => {
    if (!user) return;
    if (user.fullName) setValue("fullName", user.fullName);
    setValue("phone", user.phone);
  }, [user, setValue]);

  useEffect(() => {
    const coupon = searchParams.get("coupon");
    if (coupon && !couponCode) {
      setCouponCode(coupon.toUpperCase());
    }
  }, [searchParams, couponCode]);

  useEffect(() => {
    if (couponCode && subtotal > 0 && discount === 0) {
      void applyCoupon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponCode, subtotal]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        در حال بارگذاری...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="mb-6 text-muted">سبد خرید شما خالی است.</p>
        <Button href={hajiasalPath("/shop")}>رفتن به فروشگاه</Button>
      </div>
    );
  }

  const nextStep = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      const valid = await trigger([
        "fullName",
        "phone",
        "province",
        "city",
        "address",
        "postalCode",
      ]);
      if (valid) setStep(3);
      return;
    }
    if (step === 3) {
      setStep(4);
    }
  };

  const onSubmit = async (data: CheckoutSchemaType) => {
    setIsSubmitting(true);
    setError(null);

    try {
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

  const shippingLabel =
    shippingOptions.find((o) => o.id === shippingMethod)?.label ?? shippingMethod;
  const paymentLabel =
    paymentMethod === "cod" ? "پرداخت در محل" : "کارت به کارت";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <SectionHeading title="تکمیل خرید" className="mb-8" />

      <div className="mb-8 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  step >= s.id
                    ? "bg-amber text-white"
                    : "bg-cream-dark text-muted",
                )}
              >
                {step > s.id ? (
                  <Check size={16} weight="bold" />
                ) : (
                  s.id.toLocaleString("fa-IR")
                )}
              </div>
              <span className="hidden text-xs text-muted sm:block">
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <div
                className={cn(
                  "mx-2 h-px flex-1",
                  step > s.id ? "bg-amber" : "bg-border",
                )}
              />
            ) : null}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-border bg-surface p-5 md:p-8"
      >
        {step === 1 ? (
          <div className="flex flex-col gap-6">
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
              <p className={`text-xs ${discount > 0 ? "text-amber" : "text-muted"}`}>
                {couponMessage}
              </p>
            ) : null}
            <CartSummary shippingOverride={shipping} discount={discount} />
          </div>
        ) : null}

        {step === 2 ? (
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
              disabled={Boolean(user)}
              {...register("phone")}
              error={errors.phone?.message}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="checkout-province" className="text-sm font-medium text-brown">
                استان
              </label>
              <select
                id="checkout-province"
                {...register("province")}
                onChange={(e) => {
                  setValue("province", e.target.value);
                  setValue("city", "");
                }}
                className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm focus:border-amber focus:outline-none"
              >
                <option value="">انتخاب استان</option>
                {(iranLocations as LocationEntry[]).map((loc) => (
                  <option key={loc.province} value={loc.province}>
                    {loc.province}
                  </option>
                ))}
              </select>
              {errors.province ? (
                <p className="text-xs text-red-500">{errors.province.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="checkout-city" className="text-sm font-medium text-brown">
                شهر
              </label>
              <select
                id="checkout-city"
                {...register("city")}
                disabled={!selectedProvince}
                className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm focus:border-amber focus:outline-none disabled:opacity-50"
              >
                <option value="">انتخاب شهر</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city ? (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              ) : null}
            </div>
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
            <ShippingMethodSelector
              options={shippingOptions}
              value={shippingMethod}
              onChange={setShippingMethod}
            />
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-cream p-4 text-sm">
              <p>
                <span className="text-muted">نام: </span>
                {getValues("fullName")}
              </p>
              <p>
                <span className="text-muted">موبایل: </span>
                <span dir="ltr">{getValues("phone")}</span>
              </p>
              <p>
                <span className="text-muted">آدرس: </span>
                {getValues("province")}، {getValues("city")}، {getValues("address")}
              </p>
              <p>
                <span className="text-muted">ارسال: </span>
                {shippingLabel}
              </p>
              <p>
                <span className="text-muted">پرداخت: </span>
                {paymentLabel}
              </p>
            </div>
            <CartItemRow />
            <CartSummary shippingOverride={shipping} discount={discount} />
            {discount > 0 ? (
              <p className="text-sm text-amber">
                تخفیف: {discount.toLocaleString("fa-IR")} تومان، مجموع:{" "}
                {total.toLocaleString("fa-IR")} تومان
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : null}
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
          {step < 4 ? (
            <Button type="button" onClick={nextStep} className="flex-1">
              بعدی
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting
                ? "در حال ثبت..."
                : paymentMethod === "cod"
                  ? "ثبت سفارش (پرداخت در محل)"
                  : "ثبت سفارش (کارت به کارت)"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
