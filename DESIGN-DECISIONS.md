# DESIGN-DECISIONS.md — سردسازی بصری v3.1

## هدف
تبدیل لندینگ از حس «ترمینال شلوغ» به استودیوی dev آرام، مطمئن و قابل اعتماد.

## چه حذف شد

| المان | دلیل |
|--------|------|
| Scanlines (`body::before`) | بافت CRT حس hacker می‌داد |
| Noise (`body::after`) | لایه بصری اضافی روی کل صفحه |
| `MeshBackground` | blur teal روی Hero |
| `IDEWindow` | سنگین‌ترین المان terminal aesthetic |
| Stack tags در Hero | شلوغی بالای fold |
| Glow shadow دکمه‌ها | حس neon |
| `.bezel` سنگین | double border + inset روی همه کارت‌ها |
| `CursorGlow`, `Marquee`, `FloatingGlyphs` | dead code |
| `founder · active` telemetry | زبان انگلیسی غیرضروری |

## چه ساده شد

- **Hero:** تک‌ستون، centered، یک radial gradient 6% opacity
- **Reveal:** فقط opacity + 12px، 450ms (بدون blur)
- **ScrollProgress:** خط solid accent، مخفی در reduced-motion
- **Process:** grid 2×3 به‌جای 5 ستون فشرده
- **Typography:** `.label-mono` با رنگ muted به‌جای accent uppercase
- **Nav:** 5 آیتم header + why/process/faq در footer

## چه اضافه شد

- `scroll-margin-top` برای anchorها
- عکس یکدست تیم (`mohammad.svg`)
- privacy note زیر فرم تماس
- honeypot + rate limit در `/api/lead`
- تفکیک success API (سبز) vs mailto fallback (خاکستری)
- `comingSoon` برای پروژه همگام

## Dials نهایی

- DESIGN_VARIANCE: 6
- MOTION_INTENSITY: 3-4
- VISUAL_DENSITY: 3

## محدودیت‌های رعایت‌شده

- RTL و JSON-LD حفظ شد
- `/hajiasal` دست نخورده
- Phosphor در landing
- بدون کتابخانه جدید
- `min-h-[100dvh]` در Hero
