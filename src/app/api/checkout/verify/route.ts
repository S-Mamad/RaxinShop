import { NextResponse } from "next/server";
import { z } from "zod";

const verifySchema = z.object({
  authority: z.string().min(1),
  status: z.string().optional(),
  orderId: z.string().min(1),
});

export async function POST(request: Request) {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId || merchantId === "your_merchant_id") {
    return NextResponse.json({
      success: false,
      verified: false,
      message: "درگاه زرین‌پال پیکربندی نشده است",
    });
  }

  try {
    const body = await request.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "اطلاعات تأیید نامعتبر است" },
        { status: 400 },
      );
    }

    // Stub: real integration would verify with Zarinpal and update order status
    return NextResponse.json({
      success: true,
      verified: false,
      refId: null,
      message:
        "تأیید پرداخت زرین‌پال هنوز پیاده‌سازی نشده است. سفارش با وضعیت در انتظار پرداخت باقی می‌ماند.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "خطا در تأیید پرداخت" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  if (!authority) {
    return NextResponse.json(
      { success: false, message: "Authority الزامی است" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: status === "OK",
    verified: false,
    authority,
    message: "بازگشت از درگاه (stub). اتصال واقعی در فاز بعدی.",
  });
}
