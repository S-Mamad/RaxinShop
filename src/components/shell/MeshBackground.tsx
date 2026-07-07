export function MeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -start-1/4 top-0 h-[50vh] w-[50vw] rounded-full bg-[var(--accent-glow)] blur-[140px]" />
      <div className="absolute end-0 top-1/3 h-[40vh] w-[40vw] rounded-full bg-[var(--violet-dim)] blur-[160px]" />
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 0%, black 10%, transparent 70%)",
        }}
      />
    </div>
  );
}
