import { api } from "@/lib/api";

/**
 * Admin uploads.
 *
 * Vercel Functions reject request bodies over 4.5 MB, so anything that can be
 * bigger than that (videos, large photos) is sent straight from the browser to
 * Supabase Storage with a short-lived signed upload URL issued by the backend
 * (`POST /admin/storage/signed-upload`). Small images keep going through the
 * backend endpoints, which optimise them to WebP.
 */

export const MB = 1024 * 1024;

/** Files above this size skip the backend (Vercel limit is 4.5 MB incl. multipart overhead). */
export const SERVER_UPLOAD_LIMIT = 4 * MB;

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"] as const;

export const IMAGE_ACCEPT = IMAGE_TYPES.join(",");
export const VIDEO_ACCEPT = VIDEO_TYPES.join(",");

export const MAX_IMAGE_MB = 5;
export const MAX_VIDEO_MB = 50;

/** Must match UPLOAD_FOLDERS in backend/app/routers/admin.py */
export type ImageFolder = "events" | "talent" | "talent/gallery" | "cms" | "category-banners";
export type VideoFolder = "events/videos" | "talent/videos";

interface SignedUpload {
  signed_url: string;
  token: string;
  path: string;
  public_url: string;
}

interface UrlResponse {
  url: string;
}

/** Returns a Spanish error message, or null when the file is acceptable. */
export function validateFile(file: File, kind: "image" | "video", maxMB: number): string | null {
  const allowed: readonly string[] = kind === "image" ? IMAGE_TYPES : VIDEO_TYPES;
  if (!allowed.includes(file.type)) {
    return kind === "image"
      ? "Formato de imagen no permitido. Usa JPEG, PNG o WebP."
      : "Formato de video no permitido. Usa MP4, WebM, OGG o MOV.";
  }
  if (file.size > maxMB * MB) {
    return `${kind === "image" ? "La imagen" : "El video"} no puede superar los ${maxMB} MB (pesa ${(file.size / MB).toFixed(1)} MB).`;
  }
  return null;
}

/** Uploads a file directly to Supabase Storage and returns its public URL. */
export async function directUpload(
  file: File,
  folder: ImageFolder | VideoFolder,
  token: string | null,
): Promise<string> {
  const signed: SignedUpload = await api.post(
    "/admin/storage/signed-upload",
    { folder, filename: file.name, content_type: file.type, size: file.size },
    token,
  );

  // Same request shape as supabase-js `uploadToSignedUrl` for Blob bodies
  const body = new FormData();
  body.append("cacheControl", "3600");
  body.append("", file);

  let res: Response;
  try {
    res = await fetch(signed.signed_url, {
      method: "PUT",
      headers: { "x-upsert": "false" },
      body,
    });
  } catch {
    throw new Error("No se pudo conectar con el almacenamiento. Revisa tu conexión e inténtalo de nuevo.");
  }

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error("El archivo supera el tamaño máximo permitido por el almacenamiento.");
    }
    const data: { message?: string; error?: string } = await res.json().catch(() => ({}));
    const detail = data.message || data.error;
    throw new Error(`No se pudo subir el archivo${detail ? `: ${detail}` : ` (código ${res.status})`}.`);
  }
  return signed.public_url;
}

/**
 * Uploads an image. Small files go through the backend (`serverEndpoint`,
 * converted to WebP); large ones are uploaded directly to Supabase.
 */
export async function uploadImage(
  file: File,
  opts: { token: string | null; serverEndpoint: string; folder: ImageFolder; maxMB?: number },
): Promise<string> {
  const error = validateFile(file, "image", opts.maxMB ?? MAX_IMAGE_MB);
  if (error) throw new Error(error);

  if (file.size <= SERVER_UPLOAD_LIMIT) {
    const formData = new FormData();
    formData.append("file", file);
    const data: UrlResponse = await api.upload(opts.serverEndpoint, formData, opts.token);
    return data.url;
  }
  return directUpload(file, opts.folder, opts.token);
}

/** Uploads a video directly to Supabase Storage (videos never pass through Vercel). */
export async function uploadVideo(
  file: File,
  opts: { token: string | null; folder: VideoFolder; maxMB?: number },
): Promise<string> {
  const error = validateFile(file, "video", opts.maxMB ?? MAX_VIDEO_MB);
  if (error) throw new Error(error);
  return directUpload(file, opts.folder, opts.token);
}

/** Human readable message for any thrown value. */
export function errorMessage(err: unknown, fallback = "Ocurrió un error. Inténtalo de nuevo"): string {
  return err instanceof Error && err.message ? err.message : fallback;
}
