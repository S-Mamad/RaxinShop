import { NextResponse } from "next/server";
import { z } from "zod";
import { checkoutApiSchema } from "@asal/lib/validations/checkout";
import { createOrder } from "@asal/lib/server/orders";
import { validateCoupon } from "@asal/lib/server/coupons";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutApiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات سفارش نامعتبر است",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { customer, items, subtotal, shipping, total } = parsed.data;
    const couponCode = (body as { couponCode?: string }).couponCode;

    let discount = 0;
    if (couponCode) {
      const couponResult = validateCoupon(couponCode, subtotal);
      if (!couponResult.valid) {
        return NextResponse.json(
          { success: false, message: couponResult.message },
          { status: 400 },
        );
      }
      discount = couponResult.discount;
    }

    const expectedTotal = subtotal + shipping - discount;
    if (Math.abs(expectedTotal - total) > 1) {
      return NextResponse.json(
        { success: false, message: "مبلغ سفارش نامعتبر است" },
        { status: 400 },
      );
    }

    // TODO: INTEGRATE ZARRINPAL/ZIBAL HERE
    // const gatewayKey = process.env.PAYMENT_GATEWAY_KEY;
    // Never log or expose payment credentials

    await new Promise((resolve) => setTimeout(resolve, 600));

    const order = await createOrder({
      customer,
      items,
      subtotal,
      shipping,
      discount,
      couponCode,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      trackingCode: order.trackingCode,
      message: "سفارش با موفقیت ثبت شد",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("id");
  const tracking = searchParams.get("tracking");

  if (!orderId && !tracking) {
    return NextResponse.json(
      { error: "شناسه سفارش یا کد پیگیری الزامی است" },
      { status: 400 },
    );
  }

  const { getOrderById, getOrderByTracking } = await import(
    "@asal/lib/server/orders"
  );

  const order = orderId
    ? await getOrderById(orderId)
    : await getOrderByTracking(tracking!);

  if (!order) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({
    order: {
      id: order.id,
      status: order.status,
      trackingCode: order.trackingCode,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        weight: i.weight.label,
      })),
    },
  });
}
