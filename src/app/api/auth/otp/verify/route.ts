import { NextResponse } from "next/server";
import { normalizePhone } from "@asal/lib/auth/phone";
import { otpVerifySchema } from "@asal/lib/auth/validations/auth";
import { verifyOtpChallenge } from "@asal/lib/auth/otp-store";
import {
  findOrCreateProfileByPhone,
  findProfileByPhone,
} from "@asal/lib/server/profiles";
import {
  createSessionToken,
  sessionCookieOptions,
} from "@asal/lib/auth/session";
import { checkRateLimit, getClientIp } from "@asal/lib/server/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = checkRateLimit(`otp-verify:${ip}`, 20, 15 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, message: "تعداد تلاش زیاد است. کمی بعد دوباره تلاش کنید." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const body = await request.json();
    const parsed = otpVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "اطلاعات نامعتبر است" },
        { status: 400 },
      );
    }

    const phone = normalizePhone(parsed.data.phone)!;
    const verify = await verifyOtpChallenge(phone, parsed.data.code);

    if (!verify.valid) {
      return NextResponse.json(
        { success: false, message: verify.message },
        { status: 400 },
      );
    }

    const existing = await findProfileByPhone(phone);
    const isNewUser = !existing || !existing.fullName;
    const profile = existing ?? (await findOrCreateProfileByPhone(phone));

    const token = createSessionToken({
      userId: profile.id,
      phone: profile.phone,
      fullName: profile.fullName,
    });

    const response = NextResponse.json({
      success: true,
      isNewUser,
      user: {
        id: profile.id,
        phone: profile.phone,
        fullName: profile.fullName,
        email: profile.email,
      },
      message: isNewUser ? "لطفاً اطلاعات خود را تکمیل کنید" : "ورود موفق",
    });

    const cookie = sessionCookieOptions(token);
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      path: cookie.path,
      maxAge: cookie.maxAge,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "خطا در تأیید کد" },
      { status: 500 },
    );
  }
}
