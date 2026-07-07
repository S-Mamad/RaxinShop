import Link from "next/link";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";

const data = site as SiteConfig;

export function SocialProof() {
  if (!data.clients?.length) return null;

  return (
    <div className="mt-8">
      <p className="telemetry mb-3 text-dim">همکاری با</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {data.clients.map((client, i) => (
          <span key={client.name} className="flex items-center gap-4">
            {client.href ? (
              <Link
                href={client.href}
                className="text-sm text-muted transition-colors hover:text-accent"
                {...(client.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {client.name}
              </Link>
            ) : (
              <span className="text-sm text-muted">{client.name}</span>
            )}
            {i < data.clients!.length - 1 ? (
              <span className="text-dim" aria-hidden>
                ·
              </span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
