# مشخصات پنل مدیریت حاجی‌عسل

## مسیرها

| مسیر | وضعیت | توضیح |
|------|--------|--------|
| `/hajiasal/admin` | فعال | ورود ادمین؛ در صورت احراز هویت، ریدایرکت به داشبورد |
| `/hajiasal/admin/dashboard` | فعال | KPIها، سفارش‌های اخیر، پیام‌های اخیر |
| `/hajiasal/admin/orders` | فعال | لیست سفارش‌ها با فیلتر و جستجو |
| `/hajiasal/admin/orders/[id]` | فعال | جزئیات سفارش و تغییر وضعیت |
| `/hajiasal/admin/products` | فعال | لیست محصولات و تغییر موجودی |
| `/hajiasal/admin/categories` | stub | دسته‌بندی‌ها |
| `/hajiasal/admin/inventory` | stub | موجودی انبار |
| `/hajiasal/admin/customers` | stub | مشتریان |
| `/hajiasal/admin/reviews` | stub | نظرات |
| `/hajiasal/admin/coupons` | stub | کوپن‌ها |
| `/hajiasal/admin/messages` | stub | پیام‌های تماس |
| `/hajiasal/admin/newsletter` | stub | خبرنامه |
| `/hajiasal/admin/content` | stub | محتوا |
| `/hajiasal/admin/reports` | stub | گزارش‌ها |
| `/hajiasal/admin/settings` | stub | تنظیمات |

## احراز هویت

- **ورود:** `POST /api/admin/auth` با `{ password }`
- **خروج:** `DELETE /api/admin/auth`
- **کوکی:** `hajiasal_admin_session`
- **گارد سرور:** `isAdminAuthenticated()` در layout پنل
- **گارد API:** `isAdminRequestAuthenticatedAsync(request)` در routeها

## APIهای فعال

### `GET /api/admin/dashboard`

خروجی:

```json
{
  "kpis": {
    "totalOrders": 0,
    "pendingOrders": 0,
    "totalRevenue": 0,
    "unreadMessages": 0,
    "totalProducts": 0,
    "outOfStock": 0
  },
  "recentOrders": [],
  "recentMessages": []
}
```

### `GET /api/admin/orders`

لیست سفارش‌ها و پیام‌های تماس.

### `PATCH /api/admin/orders`

بدنه: `{ "orderId": "...", "status": "confirmed" }`

### `GET /api/admin/orders/[id]`

جزئیات یک سفارش.

### `PATCH /api/admin/orders/[id]`

بدنه: `{ "status": "shipped" }`

### `GET /api/admin/orders/export`

خروجی CSV سفارش‌ها.

### `GET /api/admin/products`

لیست همه محصولات.

### `GET /api/admin/products/[id]`

جزئیات یک محصول.

### `PATCH /api/admin/products/[id]`

بدنه (اختیاری): `{ "inStock": true, "isBestseller": false, "isNew": false }`

## کامپوننت‌های UI

| فایل | نقش |
|------|-----|
| `AdminLayout` | سایدبار + هدر + محتوای اصلی |
| `AdminSidebar` | ۱۳ آیتم مدیریت + لینک فروشگاه |
| `AdminHeader` | breadcrumb و عنوان صفحه |
| `StatCard` | کارت KPI |
| `StatusBadge` | نشان وضعیت سفارش |
| `DataTable` | جدول قابل استفاده مجدد |
| `AdminStubContent` | placeholder بخش‌های در حال توسعه |

## وضعیت‌های سفارش

`pending_payment` · `confirmed` · `processing` · `shipped` · `delivered` · `cancelled`

## منبع داده

- سفارش‌ها: Supabase یا `orders.json`
- پیام‌ها: Supabase یا `contact.json`
- محصولات: `src/hajiasal/data/products.json`
