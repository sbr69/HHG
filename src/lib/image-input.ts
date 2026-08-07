// Robust client-side image intake: JPG / PNG / WEBP / AVIF / GIF and iPhone
// HEIC / HEIF. Everything resolves to a decoded, ready-to-draw source so the
// canvas can paint it on the very next frame.

export type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
};

const MAX_EDGE = 2200; // plenty for a 1080×1350 pass at 2× export, keeps decode fast

/** Sniff the container so HEIC files with a wrong/empty MIME type are caught. */
async function isHeic(file: File): Promise<boolean> {
  if (/heic|heif/i.test(file.type)) return true;
  if (/\.(heic|heif)$/i.test(file.name)) return true;
  try {
    const head = new Uint8Array(await file.slice(0, 32).arrayBuffer());
    if (String.fromCharCode(...head.subarray(4, 8)) !== "ftyp") return false;
    const brand = String.fromCharCode(...head.subarray(8, 20)).toLowerCase();
    return /(heic|heix|hevc|hevx|heim|heis|hevm|hevs|mif1|msf1)/.test(brand);
  } catch {
    return false;
  }
}

async function decodeBlob(blob: Blob): Promise<DecodedImage> {
  // createImageBitmap is the fastest path and already downsamples for us.
  if (typeof createImageBitmap === "function") {
    try {
      const probe = await createImageBitmap(blob);
      const scale = Math.min(1, MAX_EDGE / Math.max(probe.width, probe.height));
      if (scale === 1) return { source: probe, width: probe.width, height: probe.height };
      const resized = await createImageBitmap(blob, {
        resizeWidth: Math.round(probe.width * scale),
        resizeHeight: Math.round(probe.height * scale),
        resizeQuality: "high",
      });
      probe.close();
      return { source: resized, width: resized.width, height: resized.height };
    } catch {
      /* fall through to <img> */
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("decode-failed"));
      img.src = url;
    });
    await img.decode().catch(() => undefined);
    return { source: img, width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  }
}

/** Convert HEIC/HEIF to JPEG in the browser. Handles multi-image bursts. */
async function heicToJpeg(file: File): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const out = (await heic2any({ blob: file, toType: "image/jpeg", quality: 0.94 })) as
    Blob | Blob[];
  const blob = Array.isArray(out) ? out[0] : out;
  if (!blob) throw new Error("heic-empty");
  return blob;
}

export async function loadImage(file: File): Promise<DecodedImage> {
  const heic = await isHeic(file);

  // Safari decodes HEIC natively — try that first, it is instant.
  if (heic) {
    try {
      return await decodeBlob(file);
    } catch {
      return await decodeBlob(await heicToJpeg(file));
    }
  }

  try {
    return await decodeBlob(file);
  } catch (err) {
    // Some Androids report image/* for HEIC without the ftyp brands we check.
    try {
      return await decodeBlob(await heicToJpeg(file));
    } catch {
      throw err;
    }
  }
}

export function isSupportedImage(file: File) {
  return /^image\//.test(file.type) || /\.(heic|heif|jpe?g|png|webp|avif|gif)$/i.test(file.name);
}
