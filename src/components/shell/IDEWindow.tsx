"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const files = [
  { id: "page", name: "page.tsx" },
  { id: "layout", name: "layout.tsx" },
  { id: "api", name: "route.ts" },
  { id: "config", name: "site.json" },
];

const codeBlocks: Record<string, ReactNode> = {
  page: (
    <>
      <Line n={1}>
        <Kw>export default function</Kw> <Fn>Home</Fn>() {"{"}
      </Line>
      <Line n={2}>{"  "}<Kw>return</Kw> (</Line>
      <Line n={3}>{"    "}<Tag>&lt;main&gt;</Tag></Line>
      <Line n={4}>{"      "}<Tag>&lt;Hero /&gt;</Tag></Line>
      <Line n={5}>{"      "}<Tag>&lt;Work /&gt;</Tag></Line>
      <Line n={6}>{"    "}<Tag>&lt;/main&gt;</Tag></Line>
      <Line n={7}>{"  "});</Line>
      <Line n={8}>{"}"}</Line>
    </>
  ),
  layout: (
    <>
      <Line n={1}>
        <Kw>export default function</Kw> <Fn>Layout</Fn>({"{ children }"}) {"{"}
      </Line>
      <Line n={2}>{"  "}<Kw>return</Kw> (</Line>
      <Line n={3}>
        {"    "}<Tag>&lt;html</Tag> <Attr>lang</Attr>=<Str>&quot;fa&quot;</Str> <Attr>dir</Attr>=<Str>&quot;rtl&quot;</Str><Tag>&gt;</Tag>
      </Line>
      <Line n={4}>{"      "}{"{children}"}</Line>
      <Line n={5}>{"    "}<Tag>&lt;/html&gt;</Tag></Line>
      <Line n={6}>{"  "});</Line>
      <Line n={7}>{"}"}</Line>
    </>
  ),
  api: (
    <>
      <Line n={1}>
        <Kw>export async function</Kw> <Fn>GET</Fn>() {"{"}
      </Line>
      <Line n={2}>{"  "}<Kw>return</Kw> Response.<Fn>json</Fn>({"{"}</Line>
      <Line n={3}>{"    "}status: <Str>&quot;ok&quot;</Str>,</Line>
      <Line n={4}>{"    "}version: <Str>&quot;2.0.0&quot;</Str>,</Line>
      <Line n={5}>{"  "}{"}"});</Line>
      <Line n={6}>{"}"}</Line>
    </>
  ),
  config: (
    <>
      <Line n={1}>{"{"}</Line>
      <Line n={2}>{"  "}<Str>&quot;brand&quot;</Str>: {"{"}</Line>
      <Line n={3}>{"    "}<Str>&quot;name&quot;</Str>: <Str>&quot;\u0631\u0627\u06a9\u0633\u06cc\u0646&quot;</Str>,</Line>
      <Line n={4}>{"    "}<Str>&quot;slug&quot;</Str>: <Str>&quot;raxinshop&quot;</Str></Line>
      <Line n={5}>{"  "}{"}"}</Line>
      <Line n={6}>{"}"}</Line>
    </>
  ),
};

function Line({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex gap-3 text-left">
      <span className="w-6 shrink-0 select-none text-end text-dim">{n}</span>
      <span className="min-w-0 flex-1 whitespace-pre">{children}</span>
    </div>
  );
}

function Kw({ children }: { children: ReactNode }) {
  return <span className="text-[var(--keyword)]">{children}</span>;
}
function Fn({ children }: { children: ReactNode }) {
  return <span className="text-[var(--func)]">{children}</span>;
}
function Str({ children }: { children: ReactNode }) {
  return <span className="text-[var(--string)]">{children}</span>;
}
function Tag({ children }: { children: ReactNode }) {
  return <span className="text-accent">{children}</span>;
}
function Attr({ children }: { children: ReactNode }) {
  return <span className="text-cyan">{children}</span>;
}

export function IDEWindow() {
  const [active, setActive] = useState("page");
  const activeFile = files.find((f) => f.id === active) ?? files[0];

  return (
    <div
      dir="ltr"
      className="overflow-hidden rounded-2xl border border-border bg-panel text-left shadow-[0_0_80px_-20px_var(--accent-glow),0_40px_100px_-40px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ms-auto font-mono text-[10px] text-dim">
          raxinshop — VS Code
        </span>
      </div>

      <div className="flex overflow-x-auto border-b border-border">
        {files.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActive(f.id)}
            className={cn(
              "shrink-0 border-r border-border px-4 py-2 font-mono text-[11px] transition-colors",
              active === f.id
                ? "bg-elevated text-accent"
                : "text-muted hover:bg-elevated/50 hover:text-foreground",
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[130px_1fr]">
        <div className="hidden border-r border-border bg-surface/80 p-3 md:block">
          <p className="mb-2 font-mono text-[9px] tracking-widest text-dim uppercase">
            Explorer
          </p>
          {files.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={cn(
                "mb-0.5 block w-full truncate rounded px-2 py-1 text-left font-mono text-[11px] transition-colors",
                active === f.id
                  ? "bg-accent-dim text-accent"
                  : "text-muted hover:text-foreground",
              )}
            >
              {f.name}
            </button>
          ))}
        </div>

        <div className="min-w-0">
          <div className="border-b border-border bg-elevated/40 px-4 py-1.5 font-mono text-[10px] text-dim">
            src/app/{activeFile.name}
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-[1.85] sm:text-[12px] md:p-5 md:text-[13px]">
            {codeBlocks[active]}
            <span className="mt-1 inline-block h-[1.1em] w-[7px] animate-blink bg-accent align-middle" />
          </pre>
        </div>
      </div>

      <div className="border-t border-border bg-void/90 px-4 py-2.5 font-mono text-[11px]">
        <span className="text-accent">$</span>{" "}
        <span className="text-muted">npm run build</span>
        <span className="mx-2 text-dim">·</span>
        <span className="text-[var(--string)]">✓ compiled successfully</span>
      </div>
    </div>
  );
}
