import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/sonner";
import { GoaBackdrop } from "@/components/GoaBackdrop";
import { BadgeStudio } from "@/components/BadgeStudio";
import { Reveal } from "@/components/Reveal";
import { BrandMarquee, SiteFooter } from "@/components/SiteChrome";

const TITLE = "Hacker House Goa 2026 — Official Builder Pass";
const DESC =
  "Claim your official Hacker House Goa 2026 Builder Pass. Drop a portrait, get a print-grade credential rendered in your browser, and share it to X with #FrameInGoa.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: "HH Goa 2026",
          startDate: "2026-02-03",
          endDate: "2026-02-07",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: "Goa, India", address: "Goa, India" },
        }),
      },
    ],
  }),
});

function Index() {
  const { t } = useTranslation();

  return (
    <>
      <GoaBackdrop />
      <Toaster position="top-center" theme="dark" />

      <main className="relative w-full">
        {/* Hero title header */}
        <section className="mx-auto flex w-full max-w-7xl flex-col px-4 pt-10 pb-4 sm:px-8 sm:pt-16 md:pt-24">
          <Reveal>
            <h1 className="font-display text-[clamp(2.36rem,10vw,8rem)] italic leading-[0.86] tracking-tight text-coffee drop-shadow-lg">
              {t("hero.titlePrefix")}
              <br />
              <span className="text-ember">{t("hero.titleYear")}</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-5 flex items-center justify-end gap-3 pr-4 sm:mt-8 sm:gap-4 sm:pr-12 md:pr-24">
              <span className="h-px w-8 bg-ember sm:w-12" />
              <span className="font-display text-phi-md sm:text-phi-lg italic text-amber select-none">
                {t("hero.cta")}
              </span>
            </div>
          </Reveal>
        </section>

        <BrandMarquee />
        <BadgeStudio />
      </main>

      <SiteFooter />
    </>
  );
}
