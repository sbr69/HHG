import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download, ImageDown, Loader2, RotateCcw, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { CARD_H, CARD_W, exportBadge, loadFrame, renderBadge, type BadgeData } from "@/lib/badge";
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
  const [frameReady, setFrameReady] = useState(false);
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
      const file = new File([blob], `hh-goa-pass-${id.toLowerCase()}.png`, { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (d: ShareData) => boolean;
        share?: (d: ShareData) => Promise<void>;
      };

      if (nav.canShare && nav.share && nav.canShare({ files: [file] })) {
        await nav.share({
          files: [file],
          text,
        });
        toast.success("Shared!");
        return;
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      console.error("native share error:", e);
    } finally {
      setBusy(false);
    }

    // fallback desktop flow: copy pass image to clipboard, open X web composer
    try {
      const blob = await exportBadge(getData(), { format: "png", scale: 2 });
      const file = new File([blob], `hh-goa-pass-${id.toLowerCase()}.png`, { type: "image/png" });
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ [file.type]: file })]);
        toast.success("Pass copied to clipboard!", {
          description: "Paste it directly into your tweet (Ctrl+V / Cmd+V).",
        });
      }
    } catch (e) {
      console.warn("clipboard write error:", e);
    }

    const intent = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
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
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 px-5 py-14 sm:px-8 md:py-24 lg:grid-cols-2 lg:items-start lg:gap-20">
        {/* ---------------- editorial + controls ---------------- */}
        <div className="order-2 space-y-12 lg:order-1">
          <Reveal>
            <span className="eyebrow text-seafoam font-semibold tracking-[0.35em]">
              {t("studio.eyebrow")}
            </span>
            <h2 className="mt-5 font-display text-[clamp(3rem,11vw,6.5rem)] leading-[0.88] tracking-tight text-coffee drop-shadow-md">
              {t("studio.titlePrefix")}
              <br />
              <span className="italic text-ember">{t("studio.titleHighlight")}</span>
            </h2>
          </Reveal>

          <Reveal delay={80} className="space-y-10">
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
                className={`group relative flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed transition-all duration-500 ${
                  dragging
                    ? "scale-[1.01] border-ember bg-ember/15"
                    : "border-border hover:border-ember/60 hover:bg-white/5"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.heic,.heif"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => void handleFile(e.target.files?.[0])}
                />
                <span className="mb-4 grid size-12 place-items-center rounded-full bg-ember/15 transition-transform duration-500 group-hover:scale-110 group-hover:bg-ember/25">
                  <Upload className="size-5 text-ember transition-colors group-hover:text-amber" />
                </span>
                <span className="text-sm font-medium text-sand">
                  {hasPhoto ? t("studio.swapPortrait") : t("studio.dropPortrait")}
                </span>
                <span className="eyebrow mt-2 text-taupe">{t("studio.supportedFormats")}</span>
              </label>
            </div>

            {/* 02 — details */}
            <div>
              <StepLabel n="02" label={t("studio.step2")} />
              <div className="space-y-7">
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
                  placeholder="AI engineer · React · Rust"
                  maxLength={38}
                />
              </div>

              <div className="mt-8 border-t border-border pt-5">
                <div className="min-w-0">
                  <p className="eyebrow text-seafoam">{t("studio.assignedTitle")}</p>
                  <p className="mt-1 truncate font-display text-3xl italic text-ember">{title}</p>
                </div>
              </div>
            </div>

            {/* 03 — issue */}
            <div>
              <StepLabel n="03" label={t("studio.step3")} />
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => void shareToX()}
                  className="btn-blaze flex-1 rounded-xl px-8 py-5 text-xs font-bold uppercase tracking-[0.22em]"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {t("studio.shareToX")} <ArrowUpRight className="size-4" />
                  </span>
                </button>
                <button
                  onClick={() => void save("png")}
                  className="btn-ghost-seafoam flex items-center justify-center gap-2 px-7 py-5 text-xs font-semibold uppercase tracking-[0.22em]"
                >
                  <Download className="size-4" />
                  PNG
                </button>
                <button
                  onClick={() => void save("jpg")}
                  className="btn-ghost flex items-center justify-center gap-2 px-7 py-5 text-xs font-semibold uppercase tracking-[0.22em]"
                >
                  <ImageDown className="size-4" />
                  JPG
                </button>
                <button
                  onClick={reset}
                  aria-label={t("studio.startOver")}
                  className="btn-ghost-ember grid place-items-center px-5 py-5"
                >
                  <RotateCcw className="size-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---------------- pass preview ---------------- */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-32">
          <div
            className="mx-auto w-full max-w-105"
            onPointerMove={(e) => {
              if (!animate) return;
              const r = e.currentTarget.getBoundingClientRect();
              setTilt({
                x: ((e.clientY - r.top) / r.height - 0.5) * -6,
                y: ((e.clientX - r.left) / r.width - 0.5) * 6,
              });
            }}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            style={{ perspective: "1400px" }}
          >
            <div
              className="animate-rise relative"
              style={{
                transform: animate ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined,
                transformStyle: "preserve-3d",
                transition: "transform .5s var(--ease-out-quint)",
              }}
            >
              <div
                aria-hidden
                className="rule-blaze absolute -inset-3 rounded-4xl opacity-30 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card/60 p-3 shadow-(--shadow-lift) backdrop-blur-xl text-card-foreground">
                <div className="mb-3 flex items-center justify-between px-2">
                  <span className="eyebrow text-white/60">{t("studio.livePreview")}</span>
                  <span className="flex items-center gap-2">
                    <span className="size-1.5 animate-pulse rounded-full bg-amber" />
                    <span className="eyebrow text-white/60">
                      {hasPhoto ? t("studio.issued") : t("studio.draft")}
                    </span>
                  </span>
                </div>
                <canvas
                  ref={canvasRef}
                  width={CARD_W}
                  height={CARD_H}
                  className="w-full rounded-4xl"
                  style={{ aspectRatio: `${CARD_W}/${CARD_H}` }}
                  aria-label="Your HH Goa 2026 builder pass preview"
                />
                {/* perforation + stub */}
                <div className="relative mt-3">
                  <span className="absolute -left-6 top-1/2 size-5 -translate-y-1/2 rounded-full bg-background" />
                  <span className="absolute -right-6 top-1/2 size-5 -translate-y-1/2 rounded-full bg-background" />
                  <div className="border-t border-dashed border-border" />
                </div>
                <div className="flex items-end justify-between px-2 pb-1 pt-4">
                  <div>
                    <p className="eyebrow text-white/60">{t("studio.holder")}</p>
                    <p className="font-display text-xl italic">{name || t("studio.unassigned")}</p>
                  </div>
                  <p className="text-xs tracking-[0.2em] text-white/60">{id}</p>
                </div>
                {busy && (
                  <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
                    <Loader2 className="size-7 animate-spin text-ember" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="font-display text-xl italic text-amber font-semibold">{n}</span>
      <span className="eyebrow text-seafoam">{label}</span>
      <span className="h-px flex-1 bg-border" />
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
      <span className="eyebrow mb-2 block text-amber transition-colors group-hover:text-amber-hover">
        {label}
      </span>
      <input
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field-line font-display text-2xl italic"
      />
    </label>
  );
}
