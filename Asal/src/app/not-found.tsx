import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-6xl font-bold text-gold">۴۰۴</p>
      <h1 className="mb-3 text-xl font-semibold text-primary">صفحه یافت نشد</h1>
      <p className="mb-8 text-secondary">
        ممکن است آدرس اشتباه باشد یا صفحه حذف شده باشد.
      </p>
      <div className="flex gap-3">
        <Button href="/">خانه</Button>
        <Button href="/shop" variant="outline">
          فروشگاه
        </Button>
      </div>
    </div>
  );
}
