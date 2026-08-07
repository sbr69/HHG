import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { GoaBackdrop } from "@/components/GoaBackdrop";
import { BadgeStudio } from "@/components/BadgeStudio";
import { Reveal } from "@/components/Reveal";
import { BrandMarquee, CredentialNotes, SiteFooter, SiteHeader } from "@/components/SiteChrome";

const TITLE = "HH Goa 2026 — Official Builder Pass";
const DESC =
  "Claim your official HH Goa 2026 Builder Pass. Drop a portrait, get a print-grade credential rendered in your browser, and share it to X with #FrameInGoa.";

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
  return (
    <>
      <GoaBackdrop />
      <Toaster position="top-center" theme="dark" />
      <SiteHeader />

      <main className="relative w-full">
        {/* hero */}
        <section className="mx-auto flex w-full max-w-7xl flex-col justify-end px-5 pb-14 pt-20 sm:px-8 md:pb-24 md:pt-32">
          <Reveal>
            <h1 className="font-display text-[clamp(3.5rem,15vw,11rem)] italic leading-[0.84] tracking-tight">
              HH GOA
              <br />
              <span className="text-blaze">2026</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <p className="max-w-lg text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
                The official builder credential for the 2026 gathering on the Konkan coast. Claim
                your identity, carry the sunset, and show up already belonging.
              </p>
              <a
                href="#studio"
                className="group inline-flex shrink-0 items-center gap-4"
                aria-label="Scroll to the builder pass studio"
              >
                <span className="h-px w-12 bg-foreground/30 transition-all duration-500 group-hover:w-24 group-hover:bg-[color:var(--ember)]" />
                <span className="font-display text-2xl italic">Build your pass</span>
              </a>
            </div>
          </Reveal>
        </section>

        <BrandMarquee />
        <BadgeStudio />
        <CredentialNotes />
      </main>

      <SiteFooter />
    </>
  );
}
