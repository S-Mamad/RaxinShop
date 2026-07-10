"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const SOURCE = `const studio = {
  name: 'RaxinShop',
  stack: ['Next.js', 'TypeScript'],
  ship: 'production',
}

export default studio`;

function tokenize(line: string) {
  const parts: { text: string; tone?: "kw" | "str" | "dim" }[] = [];
  const re =
    /(const|export|default)|('[^']*')|(\/\/.*$)|(\s+|[{}\[\](),.:]|\w+)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(line))) {
    if (match[1]) parts.push({ text: match[1], tone: "kw" });
    else if (match[2]) parts.push({ text: match[2], tone: "str" });
    else if (match[3]) parts.push({ text: match[3], tone: "dim" });
    else parts.push({ text: match[0] });
  }
  return parts.length ? parts : [{ text: "\u00A0" }];
}

export function HeroCodeStage() {
  const reduceMotion = useReducedMotion();
  const [chars, setChars] = useState(reduceMotion ? SOURCE.length : 0);
  const [done, setDone] = useState(!!reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setChars(SOURCE.length);
      setDone(true);
      return;
    }

    setChars(0);
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setChars(i);
      if (i >= SOURCE.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 18);

    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const lines = useMemo(
    () => SOURCE.slice(0, chars).split("\n"),
    [chars],
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
      className="relative mx-auto w-full max-w-lg md:max-w-none"
    >
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0c10]/90 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.85)] backdrop-blur-sm md:rounded-2xl">
        <div className="flex items-center gap-2 border-b border-white/8 px-3.5 py-2.5 md:px-4">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span
            className="ms-2 font-mono text-[11px] text-dim"
            dir="ltr"
          >
            studio.ts
          </span>
        </div>

        <pre
          dir="ltr"
          className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.85] sm:p-5 sm:text-[13px] sm:leading-[1.9] md:min-h-[220px] md:p-6"
          aria-hidden
        >
          <code className="block min-w-max">
            {lines.map((line, index) => (
              <span key={`line-${index}`} className="block">
                <span className="me-4 inline-block w-4 select-none text-right text-dim/30">
                  {index + 1}
                </span>
                {tokenize(line || " ").map((part, partIndex) => (
                  <span
                    key={`${index}-${partIndex}`}
                    className={
                      part.tone === "kw"
                        ? "text-accent-bright"
                        : part.tone === "str"
                          ? "text-[#c4a574]"
                          : part.tone === "dim"
                            ? "text-dim"
                            : "text-foreground/85"
                    }
                  >
                    {part.text}
                  </span>
                ))}
              </span>
            ))}
            {!reduceMotion && !done ? (
              <span className="ms-0.5 inline-block h-3.5 w-[1.5px] translate-y-[2px] bg-accent/80 animate-pulse" />
            ) : null}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}
