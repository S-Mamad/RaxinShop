import { NextResponse } from "next/server";
import { getOrderById } from "@asal/lib/server/orders";
import site from "@asal/data/site.json";
import type { SiteConfig } from "@asal/types";

const siteData = site as SiteConfig;

function formatPrice(amount: number): string {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildInvoiceHtml(order: Awaited<ReturnType<typeof getOrderById>>) {
  if (!order) return "";

  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.title}</td>
        <td>${item.weight.label}</td>
        <td>${item.quantity.toLocaleString("fa-IR")}</td>
        <td>${formatPrice(item.weight.price * item.quantity)}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>فاکتور ${order.id}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Tahoma, Arial, sans-serif; margin: 0; padding: 32px; color: #1c1917; background: #faf7f2; }
    .sheet { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid rgba(61,43,31,0.12); border-radius: 12px; padding: 32px; }
    h1 { margin: 0 0 8px; font-size: 22px; color: #3d2b1f; }
    .meta { color: #78716c; font-size: 13px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0 24px; font-size: 14px; }
    th, td { border-bottom: 1px solid rgba(61,43,31,0.1); padding: 10px 8px; text-align: right; }
    th { background: #f0ebe3; color: #3d2b1f; }
    .totals { margin-top: 16px; font-size: 14px; }
    .totals div { display: flex; justify-content: space-between; padding: 6px 0; }
    .total { font-weight: bold; font-size: 16px; color: #d97706; border-top: 2px solid rgba(61,43,31,0.15); padding-top: 12px; margin-top: 8px; }
    @media print { body { background: #fff; padding: 0; } .sheet { border: none; } }
  </style>
</head>
<body>
  <div class="sheet">
    <h1>${siteData.brand.name}</h1>
    <p class="meta">فاکتور فروش · ${formatDate(order.createdAt)}</p>
    <p><strong>شماره سفارش:</strong> <span dir="ltr">${order.id}</span></p>
    ${order.trackingCode ? `<p><strong>کد پیگیری:</strong> <span dir="ltr">${order.trackingCode}</span></p>` : ""}
    <p><strong>مشتری:</strong> ${order.customer.fullName}</p>
    <p><strong>موبایل:</strong> <span dir="ltr">${order.customer.phone}</span></p>
    <p><strong>آدرس:</strong> ${order.customer.province}، ${order.customer.city}، ${order.customer.address}</p>
    <table>
      <thead>
        <tr><th>محصول</th><th>وزن</th><th>تعداد</th><th>مبلغ</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <div><span>جمع جزء</span><span>${formatPrice(order.subtotal)}</span></div>
      <div><span>هزینه ارسال</span><span>${formatPrice(order.shipping)}</span></div>
      ${order.discount > 0 ? `<div><span>تخفیف</span><span>-${formatPrice(order.discount)}</span></div>` : ""}
      <div class="total"><span>مبلغ قابل پرداخت</span><span>${formatPrice(order.total)}</span></div>
    </div>
    <p class="meta" style="margin-top:24px">روش پرداخت: ${order.paymentMethod === "cod" ? "پرداخت در محل" : "کارت به کارت"}</p>
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }

  const html = buildInvoiceHtml(order);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="invoice-${order.id}.html"`,
    },
  });
}
