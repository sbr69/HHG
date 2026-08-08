import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const defaultResources = {
  en: {
    translation: {
      hero: {
        titlePrefix: "HH GOA",
        titleYear: "2026",
        description:
          "The official builder credential for the 2026 gathering on the Konkan coast. Claim your identity, carry the sunset, and show up already belonging.",
        cta: "Build your pass",
      },
      header: {
        title: "HH GOA",
        year: "2026",
      },
      notes: {
        note1Title: "Rendered on device",
        note1Desc: "Your photo never leaves the browser. No upload, no account, no queue.",
        note2Title: "1080 × 1350 artwork",
        note2Desc: "Print-grade PNG sized for the X timeline, stories and profile grids.",
        note3Title: "iPhone HEIC ready",
        note3Desc: "Drop any crop or format — the pass frames the portrait for you.",
      },
      footer: {
        title: "HH GOA",
        year: "2026",
        subtitle: "The official builder pass",
        hashtag: "#FrameInGoa",
        copyright: "HH-GOA-2026 ©",
      },
      system: {
        notFoundTitle: "404",
        notFoundHeading: "Page not found",
        notFoundMessage: "The page you're looking for doesn't exist or has been moved.",
        errorHeading: "This page didn't load",
        errorMessage: "Something went wrong on our end. You can try refreshing or head back home.",
        tryAgain: "Try again",
        goHome: "Go home",
      },
      studio: {
        eyebrow: "Builder credential",
        titlePrefix: "Craft your",
        titleHighlight: "identity.",
        step1: "Upload identity",
        step2: "Personal details",
        step3: "Issue & share",
        swapPortrait: "Swap portrait",
        dropPortrait: "Drop image or click to browse",
        supportedFormats: "JPG · PNG · WEBP · HEIC from iPhone",
        fullName: "Full name",
        craftStack: "Craft / stack",
        assignedTitle: "Assigned title",
        shareToX: "Share to X",
        exportDescription:
          "Exports at 2172 × 2896 — double resolution, crisp type, exact HH Goa colours. On phones the pass is handed straight to X as an attachment; on desktop it is copied to your clipboard and downloaded so you can paste it into the post.",
        livePreview: "Live preview",
        issued: "Issued",
        draft: "Draft",
        holder: "Holder",
        unassigned: "Unassigned",
        startOver: "Start over",
      },
    },
  },
};

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: defaultResources,
    lng: "en",
    fallbackLng: "en",
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
