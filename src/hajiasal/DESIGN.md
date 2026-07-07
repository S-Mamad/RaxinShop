# حاجی عسل — Design System

**Direction:** Warm Editorial Minimal  
**Audience:** خریدار premium فارسی، اعتمادمحور

## Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-page` | `#f8f6f3` | پس‌زمینه صفحه |
| `--bg-section` | `#ffffff` | سکشن اصلی |
| `--bg-section-alt` | `#f3f1ed` | سکشن متناوب |
| `--text-primary` | `#1a1614` | متن اصلی |
| `--text-secondary` | `#6b6560` | متن ثانویه |
| `--accent` | `#b87333` | CTA، لینک کلیدی (حداکثر ۱۵٪ سطح) |
| `--accent-hover` | `#9a6129` | hover CTA |
| `--accent-subtle` | `rgba(184,115,51,0.08)` | پس‌زمینه subtle |
| `--dark-section` | `#1c1714` | hero یا footer (یک‌بار در صفحه) |
| `--border` | `rgba(26,22,20,0.08)` | خطوط |
| `--error` | `#c53030` | خطا |
| `--success` | `#2d6a4f` | تخفیف، موفقیت |

## Typography

- Body: Vazirmatn 400/500/600
- Display: Vazirmatn 700/800
- h1: max 2 خط، `text-wrap: balance`
- قیمت: `tabular-nums`

## Rules

- بدون mesh-amber، بدون گرادیان تمام‌عرض نارنجی
- PromoBanner: سفید + border accent
- Icons: Phosphor؛ CTA فلش = ArrowRight در RTL
- بدون em-dash، بدون Inter

## Admin (جدا از فروشگاه)

- پس‌زمینه: `#f4f5f7`
- متن: `#111827`
- حس ابزار کاری neutral/cool

## PDP Dark Exception

**فقط** مسیر `/hajiasal/product/[slug]` از تم روشن خارج می‌شود.

| Token | Value |
|---|---|
| `--pdp-bg` | `#1c1714` |
| `--pdp-surface` | `#252019` |
| `--pdp-text` | `#f8f6f3` |
| `--pdp-muted` | `rgba(248,246,243,0.65)` |
| `--pdp-accent` | `#c9a227` |

- Wrapper: کلاس `pdp-dark` روی section اصلی PDP
- Layout دسکتاپ: گالری (thumbnails عمودی) + جزئیات + sticky add-to-cart
- Trust badges: ۳ دایره (طبیعی، بدون افزودنی، تأییدیه)
- Related products: کاروسل افقی
- موبایل: thumbnails افقی زیر تصویر؛ sticky CTA حفظ شود
