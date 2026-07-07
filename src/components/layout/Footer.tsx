import Link from "next/link";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";
import { BrandLogo } from "@/components/ui/BrandLogo";

const data = site as SiteConfig;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 md:flex-row md:items-start md:justify-between md:px-10">
        <div className="max-w-sm">
          <BrandLogo className="text-lg" />
          <p className="mt-4 text-sm leading-[1.85] text-muted">
            {data.brand.tagline}
          </p>
          <p className="mt-3 font-mono text-xs text-dim">
            {data.brand.version}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-7 gap-y-3">
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
        </ul>
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
