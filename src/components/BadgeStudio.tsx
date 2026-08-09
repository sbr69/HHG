import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download, ImageDown, Loader2, RotateCcw, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { CARD_H, CARD_W, exportBadge, getFrame, loadFrame, renderBadge, type BadgeData } from "@/lib/badge";
import { isSupportedImage, loadImage, type DecodedImage } from "@/lib/image-input";
import { builderId, builderTitle } from "@/lib/titles";
import { Reveal } from "@/components/Reveal";
import { useMotion } from "@/hooks/useMotionPreference";

const CAPTION = (title: string) =>
  `I just claimed my HH Goa 2026 Builder Pass — "${title}". Sun, surf and shipping. 🌅\n\n#FrameInGoa`;

export function BadgeStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoRef = useRef<DecodedImage | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);
  const { animate } = useMotion();

  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [frameReady, setFrameReady] = useState(() => !!getFrame());
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const title = builderTitle(name || "builder", stack || "builder");
  const id = builderId(name);

  // preload frame asset once
  useEffect(() => {
    let active = true;
    loadFrame()
      .then((img) => {
        if (!active) return;
        frameRef.current = img;
        setFrameReady(true);
      })
      .catch((e) => console.error("frame load error:", e));

    if ("fonts" in document) {
      document.fonts.ready
        .then(() => {
          if (active) setFontsReady(true);
        })
        .catch(() => {
          if (active) setFontsReady(true);
        });
    } else {
      setFontsReady(true);
    }

    return () => {
      active = false;
    };
  }, []);

  const getData = useCallback(
    (): BadgeData => ({
      name,
      stack,
      title,
      id,
      photo: photoRef.current?.source ?? null,
      photoW: photoRef.current?.width ?? 0,
      photoH: photoRef.current?.height ?? 0,
    }),
    [name, stack, title, id],
  );

  const redraw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    renderBadge(cv, getData(), 1);
  }, [getData]);

  useEffect(() => {
    redraw();
  }, [redraw, frameReady, fontsReady]);

  const handleFile = async (f?: File) => {
    if (!f) return;
    if (!isSupportedImage(f)) {
      toast.error("Unsupported file format", {
        description: "Please choose a JPEG, PNG, WebP or HEIC image.",
      });
      return;
    }
    setBusy(true);
    try {
      const dec = await loadImage(f);
      photoRef.current = dec;
      setHasPhoto(true);
      redraw();
      toast.success("Photo attached");
    } catch (err) {
      console.error(err);
      toast.error("Could not load photo");
    } finally {
      setBusy(false);
    }
  };

  const save = async (fmt: "png" | "jpg") => {
    setBusy(true);
    try {
      const blob = await exportBadge(getData(), { format: fmt, scale: 2 });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hh-goa-pass-${id.toLowerCase()}.${fmt}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Pass saved as ${fmt.toUpperCase()}`);
    } catch (e) {
      console.error(e);
      toast.error("Export failed");
    } finally {
      setBusy(false);
    }
  };

  const shareToX = async () => {
    setBusy(true);
    const text = CAPTION(title);

    try {
      const blob = await exportBadge(getData(), { format: "png", scale: 2 });
      const fileName = `hh-goa-pass-${id.toLowerCase()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      const nav = navigator as Navigator & {
        canShare?: (d: ShareData) => boolean;
        share?: (d: ShareData) => Promise<void>;
      };

      // Native Mobile Share API (iOS/Android) — auto-attaches image + text directly into Twitter/X app
      if (nav.canShare && nav.share && nav.canShare({ files: [file] })) {
        await nav.share({
          files: [file],
          text,
          title: "Hacker House Goa 2026 Pass",
        });
        toast.success("Shared!");
        return;
      }

      // Desktop Flow: Open popup synchronously
      const popup = window.open("about:blank", "_blank");

      // Copy image to clipboard for easy Ctrl+V paste into tweet composer
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
          toast.success("Pass copied to clipboard!", {
            description: "Press Ctrl+V (Cmd+V) in the tweet window to attach your pass.",
          });
        } catch (clipErr) {
          console.warn("clipboard write error:", clipErr);
        }
      }

      // Trigger download fallback
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      const intent = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
      if (popup) {
        popup.location.href = intent;
      } else {
        window.location.href = intent;
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      console.error("Share error:", e);
      const intent = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
      window.open(intent, "_blank", "noopener,noreferrer");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    photoRef.current = null;
    setHasPhoto(false);
    setName("");
    setStack("");
    toast("Pass cleared");
  };

  const { t } = useTranslation();

  return (
    <section id="studio" className="w-full border-t border-border">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:gap-14 sm:px-8 sm:py-16 md:py-24 lg:grid-cols-2 lg:items-start lg:gap-20">
        {/* ---------------- editorial + controls ---------------- */}
        <div className="order-2 space-y-8 sm:space-y-12 lg:order-1">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,6.5vw,4.5rem)] leading-[0.88] tracking-tight text-coffee drop-shadow-md">
              {t("studio.titlePrefix")} <span className="italic text-ember">{t("studio.titleHighlight")}</span>
            </h2>
          </Reveal>

          <Reveal delay={80} className="space-y-8 sm:space-y-10">
            {/* 01 — upload */}
            <div>
              <StepLabel n="01" label={t("studio.step1")} />
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  void handleFile(e.dataTransfer.files?.[0]);
                }}
                className={`group relative flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-500 sm:h-44 ${
                  dragging
                    ? "scale-[1.01] border-black bg-black/40"
                    : "border-black bg-black/20 hover:border-black hover:bg-black/35"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.heic,.heif"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => void handleFile(e.target.files?.[0])}
                />
                <span className="mb-2.5 grid size-10 place-items-center rounded-full bg-ember/15 transition-transform duration-500 group-hover:scale-110 group-hover:bg-ember/25 sm:mb-4 sm:size-14">
                  <Upload className="size-4.5 text-ember transition-colors group-hover:text-amber sm:size-6" />
                </span>
                <span className="text-phi-md font-semibold text-sand sm:text-phi-lg">
                  {hasPhoto ? t("studio.swapPortrait") : t("studio.dropPortrait")}
                </span>
                <span className="text-phi-sm mt-1.5 font-medium uppercase tracking-wider text-taupe sm:mt-2.5 sm:text-phi-base">{t("studio.supportedFormats")}</span>
              </label>
            </div>

            {/* 02 — details */}
            <div>
              <StepLabel n="02" label={t("studio.step2")} />
              <div className="space-y-5 sm:space-y-7">
                <Field
                  label={t("studio.fullName")}
                  value={name}
                  onChange={setName}
                  placeholder="Ada Lovelace"
                  maxLength={26}
                />
                <Field
                  label={t("studio.craftStack")}
                  value={stack}
                  onChange={setStack}
                  placeholder="AI engineer"
                  maxLength={38}
                />
              </div>

              <div className="mt-6 sm:mt-7">
                <div className="min-w-0">
                  <p className="text-phi-md mb-2 block font-semibold uppercase tracking-[0.2em] text-white sm:text-phi-lg sm:mb-2.5">{t("studio.assignedTitle")}</p>
                  <p className="truncate font-display text-phi-2xl italic leading-tight pb-2.5 border-b-2 border-black sm:text-phi-3xl sm:pb-3" style={{ color: "rgb(255, 200, 89)" }}>{title}</p>
                </div>
              </div>
            </div>

            {/* 03 — issue */}
            <div>
              <StepLabel n="03" label={t("studio.step3")} />
              <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-2.5">
                <button
                  onClick={() => void shareToX()}
                  className="btn-blaze rounded-xl px-3.5 py-3 text-phi-sm font-bold uppercase tracking-[0.14em] sm:px-4 sm:py-3.5 sm:text-phi-base"
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    {t("studio.shareToX")} <ArrowUpRight className="size-4 sm:size-4.5" />
                  </span>
                </button>
                <button
                  onClick={() => void save("png")}
                  className="btn-ghost-seafoam flex items-center justify-center gap-1.5 px-3.5 py-3 text-phi-sm font-bold uppercase tracking-[0.14em] sm:gap-2 sm:px-4 sm:py-3.5 sm:text-phi-base"
                >
                  <Download className="size-4 sm:size-4.5" />
                  PNG
                </button>
                <button
                  onClick={() => void save("jpg")}
                  className="btn-ghost flex items-center justify-center gap-1.5 px-3.5 py-3 text-phi-sm font-bold uppercase tracking-[0.14em] sm:gap-2 sm:px-4 sm:py-3.5 sm:text-phi-base"
                >
                  <ImageDown className="size-4 sm:size-4.5" />
                  JPG
                </button>
                <button
                  onClick={reset}
                  aria-label={t("studio.startOver")}
                  className="btn-ghost-ember grid place-items-center px-3.5 py-3 sm:px-4 sm:py-3.5"
                >
                  <RotateCcw className="size-4 sm:size-4.5" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---------------- pass preview canvas ---------------- */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-12">
          <Reveal delay={160}>
            <div className="mx-auto max-w-85 sm:max-w-md lg:max-w-none">
              <div
                className="group relative transition-transform duration-500"
                onMouseMove={(e) => {
                  if (!animate) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const px = (e.clientX - rect.left) / rect.width - 0.5;
                  const py = (e.clientY - rect.top) / rect.height - 0.5;
                  setTilt({ x: -py * 7, y: px * 7 });
                }}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                style={{
                  transform: animate ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined,
                  transformStyle: "preserve-3d",
                  transition: "transform .5s var(--ease-out-quint)",
                }}
              >
                <div
                  aria-hidden
                  className="rule-blaze absolute -inset-3 rounded-none opacity-30 blur-2xl"
                />
                <div className="relative overflow-hidden rounded-none border border-border shadow-(--shadow-lift)">
                  <canvas
                    ref={canvasRef}
                    width={CARD_W}
                    height={CARD_H}
                    className="w-full rounded-none"
                    style={{ aspectRatio: `${CARD_W}/${CARD_H}` }}
                    aria-label="Your HH Goa 2026 builder pass preview"
                  />
                  <img
                    id="goa-frame-img"
                    src="/goa-frame-new.webp"
                    alt=""
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    onLoad={() => {
                      setFrameReady(true);
                      redraw();
                    }}
                  />
                  {busy && (
                    <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
                      <Loader2 className="size-7 animate-spin text-ember" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StepLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
      <span className="font-display text-phi-2xl italic text-amber font-semibold sm:text-phi-3xl">{n}</span>
      <span className="text-phi-lg font-bold text-seafoam uppercase tracking-[0.18em] sm:text-phi-xl sm:tracking-[0.2em]">{label}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength: number;
}) {
  return (
    <label className="group block">
      <span className="text-phi-md mb-2 block font-semibold uppercase tracking-[0.18em] text-white transition-colors group-hover:text-sand sm:text-phi-lg sm:mb-2.5 sm:tracking-[0.2em]">
        {label}
      </span>
      <input
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field-line font-display text-phi-2xl italic sm:text-phi-3xl"
      />
    </label>
  );
}
