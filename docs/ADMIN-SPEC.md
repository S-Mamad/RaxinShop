# مشخصات پنل مدیریت حاجی‌عسل

## مسیرها

| مسیر | وضعیت | توضیح |
|------|--------|--------|
| `/hajiasal/admin` | فعال | ورود ادمین |
| `/hajiasal/admin/dashboard` | فعال | KPIها و فعالیت اخیر |
| `/hajiasal/admin/orders` | فعال | لیست سفارش‌ها |
| `/hajiasal/admin/orders/[id]` | فعال | جزئیات و تغییر وضعیت |
| `/hajiasal/admin/products` | فعال | لیست محصولات + لینک ویرایش |
| `/hajiasal/admin/products/[id]` | فعال | فرم ویرایش محصول |
| `/hajiasal/admin/categories` | فعال | CRUD دسته‌بندی |
| `/hajiasal/admin/inventory` | فعال | موجودی و toggle |
| `/hajiasal/admin/coupons` | فعال | لیست کوپن‌ها |
| `/hajiasal/admin/settings` | فعال | health env + خروج |
| `/hajiasal/admin/customers` | stub | مشتریان |
| `/hajiasal/admin/reviews` | stub | نظرات |
| `/hajiasal/admin/messages` | stub | پیام‌های تماس |
| `/hajiasal/admin/newsletter` | stub | خبرنامه |
| `/hajiasal/admin/content` | stub | محتوا |
| `/hajiasal/admin/reports` | stub | گزارش‌ها |

## احراز هویت

- **ورود:** `POST /api/admin/auth` با `{ password }` و `credentials: include`
- **خروج:** `DELETE /api/admin/auth`
- **کوکی:** `hajiasal_admin_session`
- **گارد:** layout پنل + `isAdminRequestAuthenticatedAsync` در APIها
- **Production:** نشست ادمین فقط در Supabase (`admin_sessions`) — بدون Supabase ورود fail می‌شود

## APIهای فعال

### محصولات

- `GET /api/admin/products` — لیست
- `POST /api/admin/products` — ایجاد
- `GET /api/admin/products/[id]` — جزئیات
- `PATCH /api/admin/products/[id]` — ویرایش (عنوان، slug، تصاویر، وزن‌ها، flags)
- `DELETE /api/admin/products/[id]` — حذف

### دسته‌بندی

- `GET /api/admin/categories` — لیست
- `POST /api/admin/categories` — upsert

### موجودی

- `GET /api/admin/inventory` — لیست + تعداد ناموجود
- `PATCH /api/admin/inventory` — `{ productId, inStock, reason? }` + `inventory_logs`

### کوپن

- `GET /api/admin/coupons`
- `POST /api/admin/coupons` — ایجاد/upsert
- `PATCH /api/admin/coupons` — `{ code, active?, label?, value? }`
- `DELETE /api/admin/coupons?code=...`

### تنظیمات

- `GET /api/admin/settings` — وضعیت env، `supabasePing`، `missing[]`، `productionReady`

### سفارش‌ها

- `GET /api/admin/orders` · `PATCH` · `GET/PATCH /api/admin/orders/[id]` · `GET export`

## منبع داده (production)

| موجودیت | منبع |
|---------|------|
| محصولات | Supabase `products` (+ fallback `products.json` در dev) |
| کوپن‌ها | Supabase `coupons` |
| تنظیمات سایت | Supabase `site_settings` + merge با `site.json` |
| سفارش‌ها | Supabase `orders` |
| نشست ادمین | Supabase `admin_sessions` |
| audit | `admin_audit_log` |

## وضعیت‌های سفارش

`pending_payment` · `confirmed` · `processing` · `shipped` · `delivered` · `cancelled`

## Deploy checklist

1. Vercel env: `NEXT_PUBLIC_SITE_URL`, `SUPABASE_*`, `ADMIN_PASSWORD`, `AUTH_SESSION_SECRET`, `SMS_*`
2. Migrations: `001` تا `004` در Supabase
3. Seed: `npm run seed:products` · `seed:coupons` · `seed:site-settings`
4. `npm run images:hajiasal` (WebP در repo)
5. Settings پنل: `productionReady === true`
