import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequestAuthenticatedAsync } from "@asal/lib/server/admin";
import { getSupabaseAdmin, isSupabaseConfigured } from "@asal/lib/server/supabase";
import {
  getSiteSettings,
  updateSiteSettings,
} from "@asal/lib/server/site-settings";
import { logAdminAction } from "@asal/lib/server/audit-log";

const patchSchema = z.object({
  freeShippingThreshold: z.number().min(0).optional(),
  shippingCost: z.number().min(0).optional(),
});

export async function GET(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  let supabasePing = false;
  let supabaseError: string | null = null;
  let sessionWriteOk = false;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("admin_sessions").select("id").limit(1);
    supabasePing = !error;
    if (error) supabaseError = error.message;

    const dryId = `health-check-${Date.now()}`;
    const { error: insertError } = await supabase.from("admin_sessions").insert({
      id: dryId,
      token_hash: "health-check-dry-run",
      expires_at: new Date(Date.now() - 60_000).toISOString(),
    });
    if (!insertError) {
      sessionWriteOk = true;
      await supabase.from("admin_sessions").delete().eq("id", dryId);
    }
  }

  const settings = await getSiteSettings();
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SITE_URL) missing.push("NEXT_PUBLIC_SITE_URL");
  if (!isSupabaseConfigured()) missing.push("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  if (!process.env.ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");
  if (!process.env.AUTH_SESSION_SECRET) missing.push("AUTH_SESSION_SECRET");
  if (!process.env.SMS_API_KEY || !process.env.SMS_SENDER) {
    missing.push("SMS_API_KEY / SMS_SENDER (برای OTP واقعی)");
  }

  return NextResponse.json({
    env: {
      supabase: isSupabaseConfigured(),
      supabasePing,
      supabaseError,
      sessionWriteOk,
      sms: Boolean(process.env.SMS_API_KEY && process.env.SMS_SENDER),
      zarinpal: Boolean(
        process.env.ZARINPAL_MERCHANT_ID &&
          process.env.ZARINPAL_MERCHANT_ID !== "your_merchant_id",
      ),
      authSecret: Boolean(process.env.AUTH_SESSION_SECRET),
      adminPassword: Boolean(process.env.ADMIN_PASSWORD),
      siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    },
    settings: {
      freeShippingThreshold: settings.freeShippingThreshold,
      shippingCost: settings.shippingCost,
    },
    missing,
    productionReady:
      isSupabaseConfigured() &&
      supabasePing &&
      sessionWriteOk &&
      Boolean(process.env.ADMIN_PASSWORD) &&
      Boolean(process.env.AUTH_SESSION_SECRET) &&
      Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  });
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "اطلاعات نامعتبر" }, { status: 400 });
    }

    const updated = await updateSiteSettings(parsed.data);
    await logAdminAction({
      action: "settings.update",
      entityType: "site_settings",
      entityId: "hajiasal",
      payload: parsed.data,
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطای سرور";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
