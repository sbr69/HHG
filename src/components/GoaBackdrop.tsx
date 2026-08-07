/**
 * HH Goa 2026 ambient scene — the Goa sunset beach illustration, fixed behind
 * the page with a dusk scrim + grain so the editorial type stays legible.
 */
export function GoaBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <img
        src="/goa-beach.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-bottom"
      />

      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* dusk scrim keeps the editorial type legible over the scene */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--ink) 72%, transparent) 0%, color-mix(in oklab, var(--ink) 58%, transparent) 45%, color-mix(in oklab, var(--ink) 80%, transparent) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 30%, color-mix(in oklab, var(--ink) 60%, transparent) 100%)",
        }}
      />
    </div>
  );
}
