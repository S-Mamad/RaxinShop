"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { usePrefs } from "@/context/PrefsContext";
import { useContextAware } from "@/context/ContextAwareContext";

/**
 * Full-bleed studio atmosphere: fine engineering grid + soft light.
 * No floating glyphs, no heavy vignette that kills the edges.
 */
export function StudioBackdrop() {
  const pathname = usePathname();
  const spotRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { forceReducedMotion } = usePrefs();
  const { heavyEffectsOff } = useContextAware();

  const onStudioRoute =
    !pathname?.startsWith("/hajiasal") && !pathname?.startsWith("/api");
  const quiet =
    !onStudioRoute ||
    reduceMotion === true ||
    forceReducedMotion ||
    heavyEffectsOff;

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot || quiet) return;

    let raf = 0;
    let targetX = 0.62;
    let targetY = 0.28;
    let curX = 0.62;
    let curY = 0.28;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;
      spot.style.setProperty("--sx", `${(curX * 100).toFixed(2)}%`);
      spot.style.setProperty("--sy", `${(curY * 100).toFixed(2)}%`);
      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [quiet]);

  if (!onStudioRoute) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    >
      <div className="absolute inset-0 bg-void" />

      {/* Soft depth lights */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 70% -5%, rgba(143,164,196,0.11), transparent 58%),
            radial-gradient(ellipse 60% 45% at 0% 100%, rgba(143,164,196,0.06), transparent 55%)
          `,
        }}
      />

      {/* Full-bleed dot grid — visible edge to edge */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(176,194,219,0.35) 0.9px, transparent 0.9px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Subtle larger structure grid */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(143,164,196,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(143,164,196,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "112px 112px",
        }}
      />

      {!quiet ? (
        <div
          ref={spotRef}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(520px circle at var(--sx, 62%) var(--sy, 28%), rgba(143,164,196,0.08), transparent 58%)",
          }}
        />
      ) : null}
    </div>
  );
}
