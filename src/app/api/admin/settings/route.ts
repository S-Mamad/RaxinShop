import { NextResponse } from "next/server";
import { isAdminRequestAuthenticatedAsync } from "@asal/lib/server/admin";
import { isSupabaseConfigured } from "@asal/lib/server/supabase";

export async function GET(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  return NextResponse.json({
    env: {
      supabase: isSupabaseConfigured(),
      sms: Boolean(process.env.SMS_API_KEY && process.env.SMS_SENDER),
      zarinpal: Boolean(
        process.env.ZARINPAL_MERCHANT_ID &&
          process.env.ZARINPAL_MERCHANT_ID !== "your_merchant_id",
      ),
      authSecret: Boolean(process.env.AUTH_SESSION_SECRET),
      adminPassword: Boolean(process.env.ADMIN_PASSWORD),
      siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    },
  });
}
