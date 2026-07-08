"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { checkoutSchema, type CheckoutSchemaType } from "@/lib/validations/checkout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartItemRow } from "@/components/cart/CartItem";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "اطلاعات تماس" },
  { id: 2, title: "آدرس ارسال" },
  { id: 3, title: "بررسی و پرداخت" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const shipping = useCartStore((s) => s.getShippingCost());
  const total = subtotal + shipping - discount;
  const clearCart = useCartStore((s) => s.clearCart);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
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

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="mb-6 text-secondary">سبد خرید شما خالی است.</p>
        <Button href="/shop">رفتن به فروشگاه</Button>
      </div>
    );
  }

  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger(["fullName", "phone"]);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["province", "city", "address", "postalCode"]);
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
      router.push(`/checkout/success?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <SectionHeading title="تکمیل خرید" className="mb-8" />

      <div className="mb-8 flex items-center justify-between">
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
                  <Check size={16} strokeWidth={2} />
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
        className="rounded-2xl border border-white/6 bg-surface p-5 md:p-8"
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
            />
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
              <p className={`text-xs ${discount > 0 ? "text-gold" : "text-secondary"}`}>
                {couponMessage}
              </p>
            ) : null}
            <CartSummary />
            {discount > 0 ? (
              <p className="text-sm text-gold">
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
          {step < 3 ? (
            <Button type="button" onClick={nextStep} className="flex-1">
              بعدی
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "در حال پردازش..." : "پرداخت و ثبت سفارش"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
