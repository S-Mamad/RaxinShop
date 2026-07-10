"use client";

import { useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";
import site from "@/data/site.json";
import type { ServiceItem, SiteConfig } from "@/types";
import { useCopy } from "@/hooks/useCopy";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { cn } from "@/lib/utils";
import { useSonic } from "@/hooks/useSonic";

const data = site as SiteConfig;

const SNIPPET = `// module seam — raxinshop style
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function loadCatalog(): Promise<ApiResult<Item[]>> {
  const res = await fetch("/api/catalog", { next: { revalidate: 60 } });
  if (!res.ok) return { ok: false, error: "upstream_failed" };
  return { ok: true, data: await res.json() };
}`;

function spanClass(span?: ServiceItem["span"]) {
  if (span === "wide") return "md:col-span-2";
  if (span === "tall") return "md:row-span-2";
  return "";
}

export function BentoSkills() {
  const copy = useCopy();
  const services = data.services;
  const [copied, setCopied] = useState(false);
  const { playClick } = useSonic();

  return (
    <section id="skills" className="border-b border-border py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow={copy.bento.eyebrow}
            title={copy.bento.title}
            description={copy.bento.description}
          />
        </Reveal>

        <div className="grid auto-rows-[minmax(160px,auto)] gap-3 md:grid-cols-3">
          {services.map((service, index) => {
            const isSnippet = service.visual === "snippet";
            return (
              <Reveal key={service.id} delay={index * 0.04}>
                <SpotlightCard
                  className={cn(
                    "h-full rounded-2xl p-5 md:p-6",
                    spanClass(service.span),
                  )}
                >
                  {isSnippet ? (
                    <SnippetBlock
                      title={service.title}
                      description={service.description}
                      copied={copied}
                      onCopy={() => {
                        playClick();
                        void navigator.clipboard.writeText(SNIPPET);
                        setCopied(true);
                        window.setTimeout(() => setCopied(false), 1800);
                      }}
                    />
                  ) : (
                    <div className="flex h-full flex-col">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <ServiceIcon name={service.icon} />
                        {service.proof ? (
                          <span className="label-mono text-accent/80">
                            {service.proof}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="font-display text-lg text-foreground">
                        {service.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                        {service.description}
                      </p>
                      {service.tags?.length ? (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {service.tags.map((tag) => (
                            <span
                              key={tag}
                              dir="ltr"
                              className="border border-border px-2 py-0.5 font-mono text-[10px] text-dim"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SnippetBlock({
  title,
  description,
  copied,
  onCopy,
}: {
  title: string;
  description: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1.5 font-mono text-[10px] text-dim transition-colors hover:border-accent/40 hover:text-accent"
          aria-label="کپی اسنیپت"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" weight="bold" />
          ) : (
            <Copy className="h-3.5 w-3.5" weight="bold" />
          )}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre
        dir="ltr"
        className="mt-auto overflow-x-auto rounded-lg border border-border bg-void/80 p-4 font-mono text-[11px] leading-relaxed text-accent/90"
      >
        <code>{SNIPPET}</code>
      </pre>
    </div>
  );
}
