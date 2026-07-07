import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequestAuthenticated } from "@asal/lib/server/admin";
import { getAllContactMessages } from "@asal/lib/server/newsletter";
import {
  getAllOrders,
  updateOrderStatus,
  type OrderStatus,
} from "@asal/lib/server/orders";

const statusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "pending_payment",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  const [orders, messages] = await Promise.all([
    getAllOrders(),
    getAllContactMessages(),
  ]);
  return NextResponse.json({ orders, messages });
}

export async function PATCH(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات نامعتبر است" },
        { status: 400 },
      );
    }

    const order = await updateOrderStatus(
      parsed.data.orderId,
      parsed.data.status as OrderStatus,
    );

    if (!order) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
