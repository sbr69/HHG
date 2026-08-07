import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const defaultResources = {
  en: {
    translation: {
      studio: {
        eyebrow: "Builder credential",
        titlePrefix: "Craft your",
        titleHighlight: "identity.",
        description:
          "One portrait, two fields, and a pass that looks like the sun going down over Anjuna. Rendered live in your browser, ready for the timeline.",
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
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: defaultResources,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
