import { NextResponse } from "next/server";
import { isAdminRequestAuthenticatedAsync } from "@asal/lib/server/admin";
import { getAllOrders } from "@asal/lib/server/orders";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request) {
  if (!(await isAdminRequestAuthenticatedAsync(request))) {
    return NextResponse.json(
      { success: false, message: "دسترسی غیرمجاز" },
      { status: 401 },
    );
  }

  const orders = await getAllOrders();
  const header = [
    "id",
    "status",
    "customer_name",
    "phone",
    "city",
    "total",
    "tracking_code",
    "created_at",
  ].join(",");

  const rows = orders.map((o) =>
    [
      o.id,
      o.status,
      o.customer.fullName,
      o.customer.phone,
      o.customer.city,
      String(o.total),
      o.trackingCode ?? "",
      o.createdAt,
    ]
      .map(escapeCsv)
      .join(","),
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hajiasal-orders-${Date.now()}.csv"`,
    },
  });
}
