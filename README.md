# RaxinShop + حاجی عسل

Monorepo-style Next.js app: RaxinShop landing at `/`, Haji Asal store at `/hajiasal`.

## Setup

```bash
cd raxinshop
npm install
cp .env.example .env.local
```

Fill `.env.local` — minimum for local dev:

| Variable | Purpose |
|---|---|
| `AUTH_SESSION_SECRET` | 32+ random chars (required in production) |
| `AUTH_TEST_PHONE` / `AUTH_TEST_OTP` | Test login: `09123456789` / `1234` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |
| `ADMIN_PASSWORD` | `/hajiasal/admin` panel |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Optional locally; **required on Vercel** |

## Images

```bash
# Convert SVG placeholders to WebP (run before deploy)
npm run images:hajiasal

# From PNG sources (when available)
npm run optimize:hajiasal-images
```

## Seed Supabase (after migrations)

```bash
npm run seed:products
npm run seed:coupons
npm run seed:site-settings
```

Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in environment.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (webpack) |
| `npm run build` | Production build |
| `npm run check:paths` | Validate hajiasal URL paths |
| `npm run test:e2e` | Playwright tests |
| `npm run images:hajiasal` | SVG → WebP conversion |
| `npm run seed:products` | Seed products + categories |
| `npm run seed:coupons` | Seed coupons |
| `npm run seed:site-settings` | Seed site_settings |

## Vercel deploy checklist

1. `NEXT_PUBLIC_SITE_URL=https://raxin-shop-r4aj.vercel.app`
2. `AUTH_SESSION_SECRET` (strong, unique, 32+ chars)
3. `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (**mandatory** — no filesystem on Vercel)
4. Run all Supabase migrations in order:
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_auth_profiles.sql`
   - `supabase/migrations/003_admin_commerce.sql`
   - `supabase/migrations/004_coupons_extras.sql`
5. Run seed scripts (see above)
6. `ADMIN_PASSWORD` for admin panel
7. `SMS_API_KEY` + `SMS_SENDER` for production OTP (Kavenegar)
8. `ZARINPAL_MERCHANT_ID` (optional — online payment)

**Without Supabase on Vercel:** admin login loops, orders and OTP will not persist.

## Test customer login (development only)

- Phone: `09123456789`
- OTP: `1234`
- Checkout requires login.

## Admin panel

- URL: `/hajiasal/admin`
- Password: `ADMIN_PASSWORD` env var
- Health check: Settings page shows env/DB status
