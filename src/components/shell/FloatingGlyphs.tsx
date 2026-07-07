"use client";

const glyphs = [
  "{ }",
  "</>",
  "fn()",
  "0x1",
  "=>",
  "git",
  "npm",
  "tsx",
  "async",
  "[]",
];

export function FloatingGlyphs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {glyphs.map((g, i) => (
        <span
          key={g}
          className="animate-float absolute font-mono text-[11px] text-white/[0.04] select-none"
          style={{
            top: `${8 + (i * 9) % 80}%`,
            left: `${5 + (i * 13) % 90}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${5 + (i % 4)}s`,
          }}
        >
          {g}
        </span>
      ))}
    </div>
  );
}
