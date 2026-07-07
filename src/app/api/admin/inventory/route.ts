import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequestAuthenticatedAsync } from "@asal/lib/server/admin";
import { getAllProductsAsync, updateProductAsync } from "@asal/lib/server/products-store";
import { getSupabaseAdmin } from "@asal/lib/server/supabase";
import { logAdminAction } from "@asal/lib/server/audit-log";

const patchSchema = z.object({
  productId: z.string().min(1),
  inStock: z.boolean(),
  reason: z.string().optional(),
});

export async function GET(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const products = await getAllProductsAsync();
  const lowStock = products.filter((p) => !p.inStock);

  const supabase = getSupabaseAdmin();
  let logs: unknown[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("inventory_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    logs = data ?? [];
  }

  return NextResponse.json({
    products,
    lowStockCount: lowStock.length,
    logs,
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

    const product = await updateProductAsync(parsed.data.productId, {
      inStock: parsed.data.inStock,
    });
    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("inventory_logs").insert({
        product_id: parsed.data.productId,
        delta: parsed.data.inStock ? 1 : -1,
        reason: parsed.data.reason ?? "admin_update",
      });
    }

    await logAdminAction({
      action: "inventory.update",
      entityType: "product",
      entityId: parsed.data.productId,
      payload: { inStock: parsed.data.inStock },
    });

    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
