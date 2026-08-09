import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/Reveal";

/** Structural HH Goa branding: masthead lockup, kinetic section marker, colophon. */

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8 md:py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src="/logo.jpg"
            alt="Hacker House Goa Logo"
            className="size-9 rounded-full object-cover ring-2 ring-ember/40 shadow-md sm:size-11"
          />
          <div className="leading-none">
            <h1 className="font-display text-2xl italic leading-none text-coffee sm:text-3xl md:text-4xl">
              {t("header.title")} <span className="text-ember">{t("header.year")}</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="rule-blaze h-px w-full opacity-60" />
    </header>
  );
}

export function BrandMarquee() {
  const items = [
    { label: "Hacker House Goa 2026", color: "text-amber" },
    { label: "#FrameInGoa", color: "text-seafoam" },
    { label: "Builder Pass", color: "text-sand" },
  ];
  return (
    <div className="w-full overflow-hidden border-y border-border py-4 bg-background/30 backdrop-blur-sm">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-10 pr-10">
            {[0, 1, 2, 3].map((set) => (
              <div key={set} className="flex items-center gap-10">
                {items.map((item, i) => (
                  <span key={`${set}-${i}`} className="flex items-center gap-10">
                    <span className={`eyebrow ${item.color} font-semibold`}>{item.label}</span>
                    <span className="size-1.5 rounded-full bg-ember" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-border bg-background/40 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-8 sm:py-3.5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Hacker House Goa Logo"
            className="size-7 rounded-full object-cover ring-1 ring-amber/40 sm:size-8"
          />
          <div>
            <p className="font-display text-xl italic leading-none text-coffee sm:text-2xl md:text-3xl">
              {t("footer.title")} <span className="text-amber">{t("footer.year")}</span>
            </p>
            <p className="mt-1 text-phi-xs font-semibold uppercase tracking-[0.14em] text-sand sm:mt-1.5 sm:tracking-[0.22em] sm:text-phi-sm">
              {t("footer.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 sm:gap-6">
          <span className="text-phi-xs font-semibold uppercase tracking-[0.18em] text-seafoam sm:text-phi-sm">
            {t("footer.hashtag")}
          </span>
          <span className="text-phi-xs uppercase tracking-[0.18em] text-taupe sm:text-phi-sm">
            {t("footer.copyright")}
          </span>
        </div>
      </div>
      <div className="rule-blaze h-0.5 w-full" />
    </footer>
  );
}
