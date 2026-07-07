import { NextResponse } from "next/server";
import { normalizePhone } from "@asal/lib/auth/phone";
import { otpSendSchema } from "@asal/lib/auth/validations/auth";
import {
  checkSendRateLimit,
  createOtpChallenge,
} from "@asal/lib/auth/otp-store";
import {
  getOtpProviderForPhone,
  getTestOtpProvider,
} from "@asal/lib/auth/get-otp-provider";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = otpSendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "شماره موبایل نامعتبر است" },
        { status: 400 },
      );
    }

    const phone = normalizePhone(parsed.data.phone)!;
    const rate = checkSendRateLimit(phone);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, message: rate.message },
        { status: 429 },
      );
    }

    const testProvider = getTestOtpProvider();
    const provider = getOtpProviderForPhone(phone);
    const fixedCode = testProvider.isTestPhone(phone)
      ? testProvider.getTestOtp()
      : undefined;

    const code = await createOtpChallenge(phone, fixedCode);
    const result = await provider.send(phone, code);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "خطا در ارسال کد" },
      { status: 500 },
    );
  }
}
