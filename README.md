# RaxinShop + حاجی عسل

Monorepo-style Next.js app: RaxinShop landing at `/`, Haji Asal store at `/hajiasal`.

## Setup

```bash
cd raxinshop
npm install
cp .env.example .env.local
```

Fill `.env.local` — at minimum for local dev:

- `AUTH_SESSION_SECRET` (32+ random chars)
- `AUTH_TEST_PHONE=09123456789` / `AUTH_TEST_OTP=1234` for test login
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `ADMIN_PASSWORD` for `/hajiasal/admin`

## Images

```bash
# From PNG sources in assets dir (preferred)
npm run optimize:hajiasal-images

# Fallback: convert existing SVG placeholders to WebP
node scripts/svg-to-webp-hajiasal.mjs
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run check:paths` | Validate hajiasal URL paths |
| `npm run test:e2e` | Playwright tests |

## Vercel deploy checklist

1. `NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app`
2. `AUTH_SESSION_SECRET` (strong, unique)
3. `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (orders, profiles)
4. Run `supabase/migrations/001_init.sql` and `002_auth_profiles.sql`
5. `ADMIN_PASSWORD` for admin panel

## Test customer login

- Phone: `09123456789`
- OTP: `1234`
- Checkout requires login.
