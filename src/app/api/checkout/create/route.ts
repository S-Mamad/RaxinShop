import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@asal/lib/auth/session";

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
        "درگاه زرین‌پال هنوز پیکربندی نشده است. از پرداخت در محل یا کارت‌به‌کارت استفاده کنید.",
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

    // Stub: real integration would call Zarinpal REST API and return authority + redirect URL
    const authority = `A${Date.now().toString(36).toUpperCase()}`;
    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/hajiasal/checkout/verify`;

    return NextResponse.json({
      success: true,
      available: true,
      authority,
      redirectUrl: `https://www.zarinpal.com/pg/StartPay/${authority}`,
      callbackUrl,
      message: "درگاه آماده است (stub). اتصال واقعی در فاز بعدی فعال می‌شود.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "خطا در ایجاد درخواست پرداخت" },
      { status: 500 },
    );
  }
}
