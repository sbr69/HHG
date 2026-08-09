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
        {/* hero */}
        <section className="mx-auto flex w-full max-w-7xl flex-col justify-end px-5 pb-14 pt-20 sm:px-8 md:pb-24 md:pt-32">
          <Reveal>
            <h1 className="font-display text-[clamp(3.5rem,15vw,11rem)] italic leading-[0.84] tracking-tight text-coffee drop-shadow-lg">
              {t("hero.titlePrefix")}
              <br />
              <span className="text-ember">{t("hero.titleYear")}</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-end">
              <a
                href="#studio"
                className="group inline-flex shrink-0 items-center gap-4"
                aria-label="Scroll to the builder pass studio"
              >
                <span className="h-px w-12 bg-ember transition-all duration-500 group-hover:w-24 group-hover:bg-amber" />
                <span className="font-display text-2xl italic text-amber transition-colors group-hover:text-amber-hover">
                  {t("hero.cta")}
                </span>
              </a>
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
