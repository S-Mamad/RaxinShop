import { getSessionFromCookies } from "@asal/lib/auth/session";
import { getOrdersByUserId } from "@asal/lib/server/orders";
import { SectionHeading } from "@asal/components/ui/SectionHeading";
import { formatPrice } from "@asal/lib/utils";
import { hajiasalPath } from "@asal/lib/paths";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  pending_payment: "در انتظار پرداخت",
  confirmed: "تأیید شده",
  processing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

export default async function AccountOrdersPage() {
  const session = await getSessionFromCookies();
  const orders = session ? await getOrdersByUserId(session.userId) : [];

  return (
    <div>
      <SectionHeading title="سفارش‌های من" className="mb-8" />
      {orders.length === 0 ? (
        <p className="text-muted">سفارشی یافت نشد.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-brown" dir="ltr">
                    {order.id}
                  </p>
                  <p className="text-sm text-muted">
                    {statusLabels[order.status] ?? order.status}
                  </p>
                </div>
                <p className="font-semibold text-brown">
                  {formatPrice(order.total)}
                </p>
              </div>
              <p className="mt-2 text-xs text-muted">
                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
              </p>
              {order.trackingCode ? (
                <Link
                  href={`${hajiasalPath("/track-order")}?tracking=${order.trackingCode}`}
                  className="mt-3 inline-block text-sm text-amber hover:underline"
                >
                  پیگیری سفارش
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
