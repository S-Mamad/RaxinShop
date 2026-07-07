import type { Metadata } from "next";
import { JetBrains_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "راکسین‌شاپ | استودیو توسعه",
  description:
    "کد تمیز، محصول واقعی. فرانت‌اند، بک‌اند و UI در سطح production.",
  openGraph: {
    title: "راکسین شاپ",
    description: "استودیو ساخت محصولات دیجیتال",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void text-foreground">{children}</body>
    </html>
  );
}
