import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequestAuthenticatedAsync } from "@asal/lib/server/admin";
import { getAllCouponsAsync } from "@asal/lib/server/coupons";
import { getSupabaseAdmin } from "@asal/lib/server/supabase";
import { logAdminAction } from "@asal/lib/server/audit-log";

const couponSchema = z.object({
  code: z.string().min(1),
  type: z.enum(["percent", "fixed"]),
  value: z.number().positive(),
  minOrder: z.number().min(0),
  maxDiscount: z.number().optional(),
  label: z.string().min(1),
  active: z.boolean().default(true),
});

export async function GET(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const coupons = await getAllCouponsAsync();
  return NextResponse.json({ coupons });
}

export async function POST(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "اطلاعات نامعتبر" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase پیکربندی نشده است" },
        { status: 503 },
      );
    }

    const c = parsed.data;
    const { error } = await supabase.from("coupons").upsert({
      code: c.code.toUpperCase(),
      type: c.type,
      value: c.value,
      min_order: c.minOrder,
      max_discount: c.maxDiscount ?? null,
      label: c.label,
      active: c.active,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAdminAction({
      action: "coupon.upsert",
      entityType: "coupon",
      entityId: c.code,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const code = body.code as string;
    if (!code) {
      return NextResponse.json({ error: "کد الزامی است" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase نیست" }, { status: 503 });
    }

    const updates: Record<string, unknown> = {};
    if (body.active !== undefined) updates.active = body.active;
    if (body.label !== undefined) updates.label = body.label;
    if (body.value !== undefined) updates.value = body.value;

    const { error } = await supabase
      .from("coupons")
      .update(updates)
      .eq("code", code.toUpperCase());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAdminAction({
      action: "coupon.update",
      entityType: "coupon",
      entityId: code,
      payload: updates,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "کد الزامی است" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase نیست" }, { status: 503 });
  }

  const { error } = await supabase
    .from("coupons")
    .delete()
    .eq("code", code.toUpperCase());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAdminAction({
    action: "coupon.delete",
    entityType: "coupon",
    entityId: code,
  });

  return NextResponse.json({ success: true });
}
