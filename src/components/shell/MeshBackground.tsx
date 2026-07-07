export function MeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 5%, transparent 75%)",
        }}
      />
      <div className="absolute start-1/4 top-0 h-[55vh] w-[45vw] -translate-x-1/2 rounded-full bg-[var(--accent-glow)] blur-[120px]" />
      <div className="absolute end-0 top-1/4 h-[35vh] w-[30vw] rounded-full bg-teal-900/20 blur-[100px]" />
    </div>
  );
}
