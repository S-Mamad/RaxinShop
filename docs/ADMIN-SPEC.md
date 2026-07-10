# مشخصات پنل مدیریت و فروشنده حاجی‌عسل

## ادمین

| مسیر | وضعیت |
|------|--------|
| `/hajiasal/admin` | ورود ادمین (بدون کروم فروشگاه) |
| `/hajiasal/admin/dashboard` | KPI + سفارش/پیام اخیر |
| `/hajiasal/admin/orders` · `[id]` | سفارش‌ها |
| `/hajiasal/admin/products` · `[id]` | محصولات |
| `/hajiasal/admin/categories` | دسته‌ها |
| `/hajiasal/admin/inventory` | موجودی |
| `/hajiasal/admin/customers` | مشتریان |
| `/hajiasal/admin/reviews` | نظرات |
| `/hajiasal/admin/coupons` | کوپن |
| `/hajiasal/admin/messages` | پیام تماس |
| `/hajiasal/admin/newsletter` | خبرنامه |
| `/hajiasal/admin/content` | محتوا |
| `/hajiasal/admin/reports` | گزارش + نمودار ۳۰ روز |
| `/hajiasal/admin/settings` | تنظیمات |

- کوکی: `hajiasal_admin_session`
- رمز: `ADMIN_PASSWORD`
- StoreChrome برای `/hajiasal/admin` غیرفعال است
- منوی موبایل سایدبار فعال است

## فروشنده (جدید)

| مسیر | کار |
|------|-----|
| `/hajiasal/seller` | ورود با موبایل + رمز |
| `/hajiasal/seller/dashboard` | KPI فروشنده |
| `/hajiasal/seller/orders` | سفارش‌های شامل محصولات فروشنده |
| `/hajiasal/seller/products` | کاتالوگ اختصاصی |
| `/hajiasal/seller/inventory` | toggle موجودی |
| `/hajiasal/seller/earnings` | درآمد و سهم |
| `/hajiasal/seller/settings` | پروفایل فروشگاه |

### دمو ورود فروشنده
- موبایل: `09121111111` (زنبورداری البرز) یا `09122222222` (شهد زاگرس)
- رمز: `seller123` (یا `SELLER_DEMO_PASSWORD`)

### داده
- `src/hajiasal/data/sellers.json`
- `src/hajiasal/data/seller-catalog.json` (تخصیص محصول به فروشنده)
- کوکی: `hajiasal_seller_session`
- API: `/api/seller/*`
