import { Sparkles, Waves } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useMotion } from "@/hooks/useMotionPreference";

/** Structural HH Goa branding: masthead lockup, kinetic section marker, colophon. */

function MotionToggle() {
  const { animate, systemReduced, setting, setMotionSetting } = useMotion();
  const label = animate ? "Motion on" : "Motion reduced";
  return (
    <button
      type="button"
      onClick={() => setMotionSetting(animate ? "off" : setting === "auto" ? "on" : "auto")}
      aria-pressed={!animate}
      title={
        systemReduced && setting === "auto"
          ? "Following your system's reduced-motion setting"
          : "Toggle ambient animation"
      }
      className="btn-ghost inline-flex items-center gap-2 rounded-full px-3 py-2 text-muted-foreground hover:text-foreground"
    >
      {animate ? <Waves className="size-3.5" /> : <Sparkles className="size-3.5" />}
      <span className="eyebrow">{label}</span>
    </button>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-5 py-5 sm:px-8 md:py-7">
        <div className="leading-none">
          <span className="eyebrow mb-2 block text-[color:var(--violet)]">Goa, India</span>
          <p className="font-display text-3xl italic leading-none sm:text-4xl md:text-5xl">
            HH GOA <span className="text-[color:var(--ember)]">2026</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="eyebrow text-muted-foreground">Builder Registration</p>
            <p className="mt-1 font-display text-xl italic">03 — 07 Feb</p>
          </div>
          <MotionToggle />
        </div>
      </div>
      <div className="rule-blaze h-px w-full opacity-60" />
    </header>
  );
}

export function BrandMarquee() {
  const items = [
    "HH GOA 2026",
    "#FrameInGoa",
    "Builder Pass",
    "Anjuna · Assagao · Vagator",
    "HH GOA 2026",
    "Official Credential",
  ];
  return (
    <div className="w-full overflow-hidden border-y border-border py-4">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-10">
            {items.map((t, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-10">
                <span className="eyebrow text-muted-foreground">{t}</span>
                <span className="size-1 rounded-full bg-[color:var(--ember)]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CredentialNotes() {
  const notes = [
    {
      k: "01",
      t: "Rendered on device",
      d: "Your photo never leaves the browser. No upload, no account, no queue.",
    },
    {
      k: "02",
      t: "1080 × 1350 artwork",
      d: "Print-grade PNG sized for the X timeline, stories and profile grids.",
    },
    {
      k: "03",
      t: "iPhone HEIC ready",
      d: "Drop any crop or format — the pass frames the portrait for you.",
    },
  ];
  return (
    <section className="w-full border-t border-border">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-px px-5 py-14 sm:px-8 md:grid-cols-3 md:py-20">
        {notes.map((n, i) => (
          <Reveal key={n.k} delay={i * 90} className="md:px-8 md:first:pl-0 md:last:pr-0">
            <div className="border-t border-border pt-6 md:border-t-0 md:pt-0">
              <span className="font-display text-2xl italic text-[color:var(--ember)]">{n.k}</span>
              <h3 className="mt-3 font-display text-2xl italic">{n.t}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{n.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-4xl italic leading-none md:text-6xl">
            HH GOA <span className="text-blaze">2026</span>
          </p>
          <p className="eyebrow mt-3 text-muted-foreground">The official builder pass</p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <span className="eyebrow text-muted-foreground">Goa · India</span>
          <span className="eyebrow text-muted-foreground">#FrameInGoa</span>
          <span className="eyebrow">HH-GOA-2026 ©</span>
        </div>
      </div>
      <div className="rule-blaze h-1 w-full" />
    </footer>
  );
}
