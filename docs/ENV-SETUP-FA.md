# راهنمای env — حاجی عسل

## مقادیر آماده (همین‌ها را کپی کن)

| متغیر | مقدار |
|--------|--------|
| `ADMIN_PASSWORD` | `ZLEUoFJkb6WBKQhP` |
| `AUTH_SESSION_SECRET` | `HwUm8pwYNwxr+XT8uHtYqlPOQpzY3e3K+s6oALjmnrDexQ/1VkLy09Jx5VITpcbL` |
| `AUTH_TEST_PHONE` | `09123456789` |
| `AUTH_TEST_OTP` | `1234` |
| `NEXT_PUBLIC_SITE_URL` (Production) | `https://raxin-shop-r4aj.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` (لوکال) | `http://localhost:3000` |
| `SMS_PROVIDER` | `kavenegar` |
| `ZARINPAL_MERCHANT_ID` | خالی بگذار |

فقط **۲ مقدار** را خودت از Supabase می‌گیری: `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY`

---

## ۱) ساخت Supabase (۵ دقیقه)

1. برو [supabase.com](https://supabase.com) → Sign up / Login
2. **New project**
   - Name: `hajiasal`
   - Database password: یک رمز قوی (یادداشت کن)
   - Region: نزدیک‌ترین (مثلاً Frankfurt)
3. صبر کن تا پروژه Ready شود
4. منوی چپ → **SQL Editor** → **New query**
5. به ترتیب محتوای این فایل‌ها را paste و **Run** کن:
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_auth_profiles.sql`
   - `supabase/migrations/003_admin_commerce.sql`
   - `supabase/migrations/004_coupons_extras.sql`
6. منوی چپ → **Project Settings** (آیکون چرخ‌دنده) → **API**
   - **Project URL** → همان `SUPABASE_URL`
   - **Project API keys** → **service_role** → **Reveal** → همان `SUPABASE_SERVICE_ROLE_KEY`

---

## ۲) Seed دیتابیس (یک‌بار)

PowerShell:

```powershell
cd "f:\VS Code File\Mine Site\raxinshop"

$env:SUPABASE_URL="https://XXXX.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."

npm run seed:products
npm run seed:coupons
npm run seed:site-settings
```

(مقادیر XXXX و eyJ را از مرحله قبل جایگزین کن)

---

## ۳) Vercel — کجا env بزنم؟

1. [vercel.com/dashboard](https://vercel.com/dashboard)
2. پروژه **raxin-shop** (یا نام پروژه‌ات)
3. **Settings** → **Environment Variables**
4. هر سطر زیر را **Add** کن — Environment: **Production** (و Preview اگر خواستی)

```
NEXT_PUBLIC_SITE_URL = https://raxin-shop-r4aj.vercel.app
SUPABASE_URL = (از Supabase API)
SUPABASE_SERVICE_ROLE_KEY = (از Supabase API — service_role)
ADMIN_PASSWORD = ZLEUoFJkb6WBKQhP
AUTH_SESSION_SECRET = HwUm8pwYNwxr+XT8uHtYqlPOQpzY3e3K+s6oALjmnrDexQ/1VkLy09Jx5VITpcbL
AUTH_TEST_PHONE = 09123456789
AUTH_TEST_OTP = 1234
SMS_PROVIDER = kavenegar
```

`SMS_API_KEY` و `SMS_SENDER` را فعلاً خالی بگذار — با شماره تست `09123456789` و کد `1234` لاگین کار می‌کند.

5. **Deployments** → آخرین deploy → **⋯** → **Redeploy**

---

## ۴) تست بعد از deploy

| چه | کجا | با چه |
|----|-----|--------|
| ادمین | `/hajiasal/admin` | رمز: `ZLEUoFJkb6WBKQhP` |
| مشتری | `/hajiasal/login` | موبایل `09123456789` کد `1234` |
| سلامت سیستم | `/hajiasal/admin/settings` | باید «آماده production» سبز شود |

---

## ۵) لوکال

فایل `.env.local` در پوشه `raxinshop` ساخته شده. فقط `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` را بعد از ساخت Supabase پر کن، بعد:

```powershell
cd "f:\VS Code File\Mine Site\raxinshop"
npm run dev
```
