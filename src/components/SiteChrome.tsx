import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/Reveal";

/** Structural HH Goa branding: masthead lockup, kinetic section marker, colophon. */

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-5 py-5 sm:px-8 md:py-7">
        <div className="leading-none">
          <h1 className="font-display text-3xl italic leading-none text-coffee sm:text-4xl md:text-5xl">
            {t("header.title")} <span className="text-ember">{t("header.year")}</span>
          </h1>
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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2.5 px-5 py-3 sm:px-8 sm:py-3.5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl italic leading-none text-coffee md:text-3xl">
            {t("footer.title")} <span className="text-amber">{t("footer.year")}</span>
          </p>
          <p className="eyebrow mt-1.5 text-sand">{t("footer.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <span className="eyebrow text-seafoam font-semibold">{t("footer.hashtag")}</span>
          <span className="eyebrow text-taupe">{t("footer.copyright")}</span>
        </div>
      </div>
      <div className="rule-blaze h-0.5 w-full" />
    </footer>
  );
}
