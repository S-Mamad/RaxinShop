import Link from "next/link";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";

const data = site as SiteConfig;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 md:flex-row md:items-start md:justify-between md:px-10">
        <div className="max-w-sm">
          <BrandLogo className="text-lg" />
          <p className="mt-4 max-w-prose text-sm leading-[1.85] text-muted">
            {data.brand.tagline}
          </p>
          <p className="mt-3 font-mono text-xs text-dim">{data.brand.version}</p>
          <div className="mt-6">
            <Button href="#contact" size="sm">
              شروع پروژه
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          <ul className="flex flex-col gap-3">
            <li className="telemetry text-dim">ناوبری</li>
            {data.nav.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors duration-500 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="#faq"
                className="text-sm text-muted transition-colors duration-500 hover:text-foreground"
              >
                سوالات
              </Link>
            </li>
            <li>
              <Link
                href="#process"
                className="text-sm text-muted transition-colors duration-500 hover:text-foreground"
              >
                فرآیند
              </Link>
            </li>
          </ul>

          <ul className="flex flex-col gap-3">
            <li className="telemetry text-dim">ارتباط</li>
            {data.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="text-sm text-muted transition-colors duration-500 hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center">
        <p className="text-xs text-dim">
          © {year} {data.brand.name}
          {data.brand.suffix} · تمامی حقوق محفوظ است
        </p>
      </div>
    </footer>
  );
}
