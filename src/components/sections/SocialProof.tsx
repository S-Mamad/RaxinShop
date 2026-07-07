import site from "@/data/site.json";
import type { SiteConfig } from "@/types";

const data = site as SiteConfig;

export function SocialProof() {
  if (!data.clients?.length) return null;

  return (
    <div className="mt-8 border-t border-border pt-6">
      <p className="label-mono mb-4 text-dim">همکاری با</p>
      <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        {data.clients.map((client) => (
          <span key={client.name}>
            {client.href ? (
              <a
                href={client.href}
                className="inline-flex items-center border border-border bg-elevated/50 px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent/30 hover:text-accent"
                {...(client.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {client.name}
              </a>
            ) : (
              <span className="inline-flex items-center border border-border px-3 py-1.5 text-sm text-muted">
                {client.name}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
