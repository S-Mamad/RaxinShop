import { NextResponse } from "next/server";
import { z } from "zod";
import { saveContactMessage } from "@asal/lib/server/newsletter";
import { getSupabaseAdmin } from "@asal/lib/server/supabase";

const schema = z.object({
  name: z.string().min(2, "نام الزامی است"),
  contact: z.string().min(3, "تلگرام یا موبایل الزامی است"),
  projectType: z.string().min(1, "نوع پروژه الزامی است"),
  message: z.string().min(10, "توضیح باید حداقل ۱۰ کاراکتر باشد"),
  website: z.string().optional(),
});

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: "تعداد درخواست زیاد است. کمی بعد دوباره تلاش کنید." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر",
        },
        { status: 400 },
      );
    }

    const { name, contact, projectType, message, website } = parsed.data;

    if (website) {
      return NextResponse.json({ success: true, message: "دریافت شد." });
    }

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        fallback: true,
        message: "سرور ذخیره‌سازی در دسترس نیست. از ایمیل استفاده کنید.",
      });
    }

    const isEmail = contact.includes("@");
    const fullMessage = `[Landing Lead]\nتماس: ${contact}\n\n${message}`;

    await saveContactMessage({
      name,
      email: isEmail ? contact : "landing@raxinshop.ir",
      phone: isEmail ? "" : contact,
      subject: `[Landing] ${projectType}`,
      message: fullMessage,
    });

    return NextResponse.json({
      success: true,
      message: "درخواست شما دریافت شد. معمولاً همان روز جواب می‌دهیم.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        message: "خطای سرور. از ایمیل استفاده کنید.",
      },
      { status: 500 },
    );
  }
}
