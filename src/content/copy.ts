export type AudienceMode = "dev" | "executive";

export interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
}

export interface LandingCopy {
  hero: {
    brandLine: string;
    title: string;
    highlight: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  bento: SectionCopy;
  architecture: SectionCopy;
  work: SectionCopy;
  warStories: SectionCopy;
  systemStatus: SectionCopy;
  terminal: SectionCopy;
  workflow: SectionCopy;
  about: SectionCopy;
  contact: SectionCopy;
  github: SectionCopy;
  apiPlayground: SectionCopy;
  security: SectionCopy;
  splitCode: SectionCopy;
  ceoDashboard: SectionCopy;
  wasmDemo: SectionCopy;
  modeLabels: { dev: string; executive: string };
  welcomeBack: string;
  lowBattery: string;
  slowNetwork: string;
}

const sharedBrand = "راکسین‌شاپ";

export const copyByMode: Record<AudienceMode, LandingCopy> = {
  dev: {
    hero: {
      brandLine: `${sharedBrand} · استودیو توسعه · تهران`,
      title: "محصول دیجیتال",
      highlight: "با استاندارد production.",
      description:
        "معماری type-safe، زیرساخت پایدار، و فرانت‌اندی که در مقیاس واقعی بدون افت فریم کار می‌کند.",
      primaryCta: "شروع پروژه",
      secondaryCta: "نمونه‌کارها",
    },
    bento: {
      eyebrow: "stack",
      title: "مهارت‌ها فراتر از لوگو",
      description:
        "معماری سیستم، APIهای پیچیده، ستاپ ریپو و پرفورمنس کلاینت در یک شبکهٔ بنتو.",
    },
    architecture: {
      eyebrow: "architecture",
      title: "جریان درخواست در سیستم",
      description:
        "از Load Balancer تا API و دیتابیس؛ دیاگرام زنده از نحوهٔ هندل کردن ترافیک.",
    },
    work: {
      eyebrow: "cases",
      title: "کیس‌استادی‌های واقعی",
      description:
        "دو قالب متضاد: زیرساخت حساس برای مرهم، و فروشگاه لوکس برای حاجی‌عسل.",
    },
    warStories: {
      eyebrow: "war stories",
      title: "خط مقدم مهندسی",
      description:
        "مهاجرت IP، مکاتبه با نهادها، و مدیریت دیتای حجیم بدون downtime.",
    },
    systemStatus: {
      eyebrow: "ops",
      title: "وضعیت زیرساخت",
      description: "آپتایم، پینگ و لاگ‌های مانیتورینگ؛ شبیه‌سازی محیط DevOps واقعی.",
    },
    terminal: {
      eyebrow: "cli",
      title: "ترمینال تعاملی",
      description: "whoami · ls projects · cat skills.json · help",
    },
    workflow: {
      eyebrow: "velocity",
      title: "فرآیند توسعه",
      description: "دیباگ خطاهای سطح پایین مثل EPERM با ابزارهای AI-assisted.",
    },
    about: {
      eyebrow: "team",
      title: "تیم",
      description: "دو نفر، یک استاندارد: کد قابل نگهداری و دیزاین دقیق.",
    },
    contact: {
      eyebrow: "contact",
      title: "message.ts",
      description: "پیام را مثل یک فایل در ادیتور بنویس و با Run ارسال کن.",
    },
    github: {
      eyebrow: "live",
      title: "فعالیت GitHub",
      description: "آخرین کامیت‌ها و وضعیت ریپوها؛ زنده یا mock با هندلینگ اصولی.",
    },
    apiPlayground: {
      eyebrow: "api",
      title: "API Playground",
      description: "ریکویست mock بزن و JSON مهارت‌ها و سوابق را ببین.",
    },
    security: {
      eyebrow: "security",
      title: "Auth Playground",
      description: "شبیه‌سازی هش، JWT و جریان احراز هویت ایزوله.",
    },
    splitCode: {
      eyebrow: "source",
      title: "UI در برابر سورس",
      description: "اسلایدر مقایسه‌ای: رابط رندر شده در یک سمت، TypeScript در سمت دیگر.",
    },
    ceoDashboard: {
      eyebrow: "metrics",
      title: "گزارش پیشرفت",
      description: "نمودار پایداری و پرفورمنس به زبان قابل ارائه به مدیرعامل.",
    },
    wasmDemo: {
      eyebrow: "compute",
      title: "پردازش سمت کلاینت",
      description: "فیلتر هزاران رکورد در کسری از ثانیه؛ اثبات پرفورمنس خالص.",
    },
    modeLabels: { dev: "Dev", executive: "Executive" },
    welcomeBack: "خوش برگشتید. محیط Dev و تاریخچهٔ ترمینال آماده‌اند.",
    lowBattery: "برای حفظ باتری، افکت‌های سنگین غیرفعال شدند. مهندسی یعنی توجه به منابع.",
    slowNetwork: "اتصال ضعیف تشخیص داده شد؛ نسخهٔ سبک‌تر لود شد.",
  },
  executive: {
    hero: {
      brandLine: `${sharedBrand} · شریک فنی محصول`,
      title: "پایداری و رشد",
      highlight: "بدون ریسک عملیاتی.",
      description:
        "زیرساخت مقیاس‌پذیر، گزارش شفاف پیشرفت، و محصولی که تیم شما فردا هم می‌تواند نگه دارد.",
      primaryCta: "درخواست همکاری",
      secondaryCta: "نتایج پروژه‌ها",
    },
    bento: {
      eyebrow: "capability",
      title: "توانمندی‌های عملیاتی",
      description:
        "از معماری تا لانچ: کاهش ریسک، افزایش پایداری، و تحویل قابل اندازه‌گیری.",
    },
    architecture: {
      eyebrow: "reliability",
      title: "معماری قابل اتکا",
      description:
        "مسیر داده از ورودی کاربر تا ذخیره‌سازی؛ طراحی‌شده برای uptime و مقیاس.",
    },
    work: {
      eyebrow: "outcomes",
      title: "ارزش تجاری پروژه‌ها",
      description:
        "پلتفرم سلامت با پایداری بالا، فروشگاه لوکس با تجربهٔ روان، و برند آمادهٔ بازار.",
    },
    warStories: {
      eyebrow: "delivery",
      title: "بحران‌هایی که حل شدند",
      description:
        "مهاجرت بدون قطعی، هماهنگی با نهادهای رسمی، و مدیریت رشد دیتا.",
    },
    systemStatus: {
      eyebrow: "health",
      title: "سلامت سیستم",
      description: "نمای مدیریتی از پایداری سرویس‌ها و کیفیت پاسخ‌دهی.",
    },
    terminal: {
      eyebrow: "briefing",
      title: "خلاصهٔ سریع رزومه",
      description: "در چند دستور، تصویر کامل تیم و پروژه‌ها را ببینید.",
    },
    workflow: {
      eyebrow: "speed",
      title: "سرعت تحویل",
      description: "چرخهٔ کوتاه دیباگ تا فیکس؛ کمتر انتظار، بیشتر خروجی.",
    },
    about: {
      eyebrow: "partners",
      title: "شریک اجرایی",
      description: "تیمی کوچک با مسئولیت کامل از ایده تا لانچ.",
    },
    contact: {
      eyebrow: "next step",
      title: "شروع همکاری",
      description: "نیازتان را بنویسید؛ همان روز پاسخ شفاف می‌گیرید.",
    },
    github: {
      eyebrow: "activity",
      title: "نبض توسعه",
      description: "نشان می‌دهد کار متوقف نشده و تحویل مستمر در جریان است.",
    },
    apiPlayground: {
      eyebrow: "transparency",
      title: "شفافیت فنی",
      description: "نمونهٔ پاسخ‌های ساختاریافته از مهارت‌ها و سوابق تیم.",
    },
    security: {
      eyebrow: "trust",
      title: "امنیت و اعتماد",
      description: "استانداردهای احراز هویت مناسب سامانه‌های حساس و خدماتی.",
    },
    splitCode: {
      eyebrow: "craft",
      title: "کیفیت ساخت",
      description: "همان UI که می‌بینید، با کدی تمیز و قابل نگهداری ساخته شده.",
    },
    ceoDashboard: {
      eyebrow: "board-ready",
      title: "داشبورد مدیرعامل",
      description: "معیارهای پایداری و پرفورمنس برای جلسه با مدیران ارشد.",
    },
    wasmDemo: {
      eyebrow: "scale",
      title: "آمادگی مقیاس",
      description: "پردازش سریع دیتای حجیم روی دستگاه کاربر؛ بدون فشار به سرور.",
    },
    modeLabels: { dev: "فنی", executive: "مدیریتی" },
    welcomeBack: "خوش برگشتید. پنل مدیریتی و گزارش‌های سیستم آماده‌اند.",
    lowBattery: "افکت‌های سنگین برای حفظ باتری شما خاموش شدند.",
    slowNetwork: "به‌خاطر سرعت پایین شبکه، نسخهٔ سبک‌تر فعال شد.",
  },
};
