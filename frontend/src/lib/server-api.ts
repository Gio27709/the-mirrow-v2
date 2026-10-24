import { API_URL } from "@/lib/api";

/**
 * GET from the API on the server (metadata, sitemap). Cached for 5 minutes.
 * Returns null on any error so pages still render if the API is down.
 */
export async function serverGet<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Like serverGet, but tells "not found" (404) apart from other failures. */
export async function serverGetStatus<T>(
  endpoint: string,
): Promise<{ data: T | null; notFound: boolean }> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { next: { revalidate: 300 } });
    if (res.status === 404) return { data: null, notFound: true };
    if (!res.ok) return { data: null, notFound: false };
    return { data: (await res.json()) as T, notFound: false };
  } catch {
    return { data: null, notFound: false };
  }
}

export function truncate(text: string | null | undefined, max = 160): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}
