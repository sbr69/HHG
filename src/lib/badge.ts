// Renders the HH Goa 2026 Builder Pass to a canvas using the illustrated
// HH GOA 2026 beach frame as the card artwork. The uploaded portrait is
// composited into the frame's inner window; the holder's identity is set on a
// dusk scrim across the bottom of that window.
// Old frame configuration (do not delete)
const FRAME_OLD_SRC = "/goa-frame.webp";
const WIN_OLD = { x: 140, y: 236, w: 790, h: 846 };

// New WebP frame configuration (transparent inner window, fast loading)
const FRAME_NEW_SRC = "/goa-frame-new.webp";
const WIN_NEW = { x: 129, y: 184, w: 823, h: 922 };

// Active frame configuration
const FRAME_SRC = FRAME_NEW_SRC;
const WIN = WIN_NEW;

export type BadgeData = {
  name: string;
  stack: string;
  title: string;
  id: string;
  photo: CanvasImageSource | null;
  photoW: number;
  photoH: number;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
};

/** Native size of the frame illustration. */
export const CARD_W = 1086;
export const CARD_H = 1448;

const EMBER = "#FF6B35";
const AMBER = "#F7931E";
const MAGENTA = "#E84393";
const INK = "#0A0A0F";
const PAPER = "#F8F9FA";
const CREAM = "#FDF2E0";

const SERIF = (s: number, italic = false) =>
  `${italic ? "italic " : ""}400 ${s}px 'Instrument Serif'`;
const SANS = (s: number, w = 400) => `${w} ${s}px 'Work Sans'`;
const TECH = (s: number, w = 700) => `${w} ${s}px 'Space Grotesk'`;

let frameImg: HTMLImageElement | null = null;
let framePromise: Promise<HTMLImageElement> | null = null;

export function getFrame(): HTMLImageElement | null {
  if (typeof document !== "undefined") {
    const domImg = document.getElementById("goa-frame-img") as HTMLImageElement | null;
    if (domImg && domImg.complete && domImg.naturalWidth !== 0) {
      return domImg;
    }
  }
  return frameImg;
}

/** Preload the frame artwork once. */
export function loadFrame(): Promise<HTMLImageElement> {
  const domImg = getFrame();
  if (domImg) return Promise.resolve(domImg);

  if (framePromise) return framePromise;
  framePromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      frameImg = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = FRAME_SRC;
    if (img.complete && img.naturalWidth !== 0) {
      frameImg = img;
      resolve(img);
    }
  });
  return framePromise;
}

if (typeof window !== "undefined") {
  void loadFrame();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  max: number,
  start: number,
  font: (s: number) => string,
  min = 20,
) {
  let size = start;
  ctx.font = font(size);
  while (ctx.measureText(text).width > max && size > min) {
    size -= 2;
    ctx.font = font(size);
  }
  return size;
}

function letterSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: "left" | "right" = "left",
) {
  const chars = [...text];
  const total = chars.reduce((sum, c) => sum + ctx.measureText(c).width + spacing, -spacing);
  let cx = align === "right" ? x - total : x;
  const prev = ctx.textAlign;
  ctx.textAlign = "left";
  for (const c of chars) {
    ctx.fillText(c, cx, y);
    cx += ctx.measureText(c).width + spacing;
  }
  ctx.textAlign = prev;
  return total;
}

/** Cover-crop any aspect ratio into the target box, biased toward the top (faces). */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  iw: number,
  ih: number,
  x: number,
  y: number,
  w: number,
  h: number,
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
) {
  const baseScale = Math.max(w / iw, h / ih);
  const scale = baseScale * zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const cx = x + (w - dw) / 2 + offsetX;
  const cy = y + (h - dh) * 0.3 + offsetY;
  ctx.drawImage(img, cx, cy, dw, dh);
}

export function renderBadge(canvas: HTMLCanvasElement, d: BadgeData, scale = 1) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = Math.round(CARD_W * scale);
  canvas.height = Math.round(CARD_H * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, CARD_W, CARD_H);

  /* ---------- background fill ---------- */
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  /* ---------- portrait inside the window ---------- */
  const { x: px, y: py, w: pw, h: ph } = WIN;

  ctx.save();
  roundRect(ctx, px, py, pw, ph, 24);
  ctx.clip();

  if (d.photo) {
    ctx.fillStyle = "#131318";
    ctx.fillRect(px, py, pw, ph);
    drawCover(
      ctx,
      d.photo,
      d.photoW,
      d.photoH,
      px,
      py,
      pw,
      ph,
      d.zoom ?? 1,
      d.offsetX ?? 0,
      d.offsetY ?? 0,
    );
  } else {
    ctx.fillStyle = CREAM;
    ctx.fillRect(px, py, pw, ph);
    ctx.setLineDash([14, 16]);
    ctx.strokeStyle = "rgba(10,10,15,0.28)";
    ctx.lineWidth = 2;
    roundRect(ctx, px + 40, py + 40, pw - 80, ph - 80, 16);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(10,10,15,0.5)";
    ctx.font = SANS(18, 600);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    letterSpaced(ctx, "YOUR PORTRAIT", px + pw / 2 - 92, py + ph / 2 - 40, 5.5);
    ctx.textAlign = "left";
  }

  /* ---------- identity block on a dusk scrim ---------- */
  const blockH = 250;
  const scrim = ctx.createLinearGradient(0, py + ph - blockH, 0, py + ph);
  scrim.addColorStop(0, "rgba(10,10,15,0)");
  scrim.addColorStop(0.45, "rgba(10,10,15,0.62)");
  scrim.addColorStop(1, "rgba(10,10,15,0.94)");
  ctx.fillStyle = scrim;
  ctx.fillRect(px, py + ph - blockH, pw, blockH);

  const ix = px + 46;
  const iw = pw - 92;
  const baseline = py + ph - 62;

  ctx.textBaseline = "alphabetic";

  // Full Name
  const name = (d.name || "Your Name").trim();
  const nameSize = fitText(ctx, name, iw, 86, (s) => SERIF(s, true), 34);
  ctx.fillStyle = PAPER;
  ctx.fillText(name, ix - 2, baseline - 95);

  // Craft (stack) directly below Full Name in green (Space Grotesk tech typography)
  ctx.font = TECH(26, 700);
  ctx.fillStyle = "rgb(34, 197, 94)";
  const stack = (d.stack || "Builder").trim().toUpperCase();
  fitText(ctx, stack, iw - 54, 26, (s) => TECH(s, 700), 16);
  const craftPaddingLeft = ix + 50;
  letterSpaced(ctx, stack, craftPaddingLeft, baseline - 52, 4);

  // hairline + stub row
  ctx.strokeStyle = "rgba(248,249,250,0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ix, baseline - 24);
  ctx.lineTo(ix + iw, baseline - 24);
  ctx.stroke();

  // Left-aligned assigned title with generous left padding offset
  ctx.textAlign = "left";
  ctx.fillStyle = "rgb(255, 200, 89)";
  ctx.font = SERIF(32, true);
  const titlePaddingLeft = ix + 102;
  ctx.fillText(`${d.title}`, titlePaddingLeft, baseline + 14);

  ctx.restore();

  /* ---------- frame artwork overlay ---------- */
  const frame = getFrame() ?? frameImg;
  if (frame) {
    ctx.drawImage(frame, 0, 0, CARD_W, CARD_H);
  }

  void nameSize;
  void INK;
}

export type ExportFormat = "png" | "jpg";

/**
 * Render the pass off-screen at high resolution and hand back a file blob.
 * 2× → 2172 × 2896, which keeps the serif typography crisp on retina and print.
 */
export async function exportBadge(
  d: BadgeData,
  { format = "png", scale = 2 }: { format?: ExportFormat; scale?: number } = {},
): Promise<Blob> {
  const frame = await loadFrame().catch(() => null);
  const canvas = document.createElement("canvas");
  renderBadge(canvas, d, scale);

  // Guarantee frame is drawn on the exported canvas
  const ctx = canvas.getContext("2d");
  if (ctx && frame) {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.drawImage(frame, 0, 0, CARD_W, CARD_H);
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, format === "jpg" ? "image/jpeg" : "image/png", 0.95),
  );
  if (!blob) throw new Error("export-failed");
  return blob;
}
