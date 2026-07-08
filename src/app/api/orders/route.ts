import { NextResponse } from "next/server";
import { checkoutApiSchema } from "@asal/lib/validations/checkout";
import { createOrder } from "@asal/lib/server/orders";
import { validateCouponAsync } from "@asal/lib/server/coupons";
import { getSessionFromRequest } from "@asal/lib/auth/session";
import { normalizePhone } from "@asal/lib/auth/phone";

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "برای ثبت سفارش باید وارد شوید" },
        { status: 401 },
      );
    }

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

    const customerPhone = normalizePhone(customer.phone);
    if (!customerPhone || customerPhone !== session.phone) {
      return NextResponse.json(
        { success: false, message: "شماره موبایل باید با حساب کاربری یکسان باشد" },
        { status: 400 },
      );
    }

    const extra = body as {
      couponCode?: string;
      paymentMethod?: "cod" | "card_to_card" | "online";
      shippingMethod?: string;
    };
    const couponCode = extra.couponCode;
    const paymentMethod = extra.paymentMethod ?? "cod";
    const shippingMethod = extra.shippingMethod;

    let discount = 0;
    if (couponCode) {
      const couponResult = await validateCouponAsync(couponCode, subtotal);
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

    // Future: Zarinpal integration — POST /api/checkout/create → redirect → verify
    // const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    // Never log or expose payment credentials

    const order = await createOrder({
      customer,
      items,
      subtotal,
      shipping,
      discount,
      couponCode,
      paymentMethod,
      shippingMethod,
      userId: session.userId,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      trackingCode: order.trackingCode,
      status: order.status,
      message:
        paymentMethod === "cod"
          ? "سفارش ثبت شد. پرداخت هنگام تحویل انجام می‌شود."
          : paymentMethod === "online"
            ? "سفارش ثبت شد. در حال انتقال به درگاه پرداخت..."
            : "سفارش ثبت شد. اطلاعات کارت‌به‌کارت برای شما ارسال می‌شود.",
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
  const phone = searchParams.get("phone");

  if (!orderId && !tracking) {
    return NextResponse.json(
      { error: "شناسه سفارش یا کد پیگیری الزامی است" },
      { status: 400 },
    );
  }

  const {
    getOrderById,
    getOrderByTracking,
    getOrderByPhoneAndTracking,
  } = await import("@asal/lib/server/orders");

  let order = null;
  if (orderId) {
    order = await getOrderById(orderId);
  } else if (tracking && phone) {
    order = await getOrderByPhoneAndTracking(phone, tracking);
  } else if (tracking) {
    order = await getOrderByTracking(tracking);
  }

  if (!order) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({
    order: {
      id: order.id,
      status: order.status,
      paymentMethod: order.paymentMethod,
      trackingCode: order.trackingCode,
      total: order.total,
      createdAt: order.createdAt,
      shippingMethod: order.shippingMethod,
      items: order.items.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        weight: i.weight.label,
      })),
    },
  });
}
