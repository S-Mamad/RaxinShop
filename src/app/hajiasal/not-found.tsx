import Link from "next/link";
import { Button } from "@asal/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-6xl font-bold text-amber">۴۰۴</p>
      <h1 className="mb-3 text-xl font-semibold text-brown">صفحه یافت نشد</h1>
      <p className="mb-8 text-muted">ممکن است آدرس اشتباه باشد یا صفحه حذف شده باشد.</p>
      <div className="flex gap-3">
        <Button href="/hajiasal">خانه</Button>
        <Button href="/hajiasal/shop" variant="outline">
          فروشگاه
        </Button>
      </div>
    </div>
  );
}
