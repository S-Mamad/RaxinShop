import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@asal/lib/auth/session";
import { updateOrderStatus } from "@asal/lib/server/orders";

const createSchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().optional(),
});

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "برای پرداخت آنلاین باید وارد شوید" },
      { status: 401 },
    );
  }

  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId || merchantId === "your_merchant_id") {
    return NextResponse.json({
      success: false,
      available: false,
      message:
        "درگاه زرین‌پال پیکربندی نشده است. از پرداخت در محل یا کارت‌به‌کارت استفاده کنید.",
    });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "اطلاعات پرداخت نامعتبر است" },
        { status: 400 },
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const callbackUrl = `${siteUrl}/api/checkout/verify?orderId=${encodeURIComponent(parsed.data.orderId)}`;
    const amountRial = Math.round(parsed.data.amount * 10);

    const zarinRes = await fetch(
      "https://api.zarinpal.com/pg/v4/payment/request.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: merchantId,
          amount: amountRial,
          callback_url: callbackUrl,
          description: parsed.data.description ?? `سفارش ${parsed.data.orderId}`,
          metadata: { order_id: parsed.data.orderId, mobile: session.phone },
        }),
      },
    );

    const zarinData = await zarinRes.json();
    const authority = zarinData.data?.authority;

    if (zarinData.data?.code !== 100 || !authority) {
      return NextResponse.json({
        success: false,
        message: zarinData.errors?.message ?? "خطا در اتصال به زرین‌پال",
      });
    }

    await updateOrderStatus(parsed.data.orderId, "pending_payment");

    return NextResponse.json({
      success: true,
      available: true,
      authority,
      redirectUrl: `https://www.zarinpal.com/pg/StartPay/${authority}`,
      callbackUrl,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "خطا در ایجاد درخواست پرداخت" },
      { status: 500 },
    );
  }
}
