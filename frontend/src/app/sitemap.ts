import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { serverGet } from "@/lib/server-api";

const STATIC_ROUTES = [
  "", "/explore", "/eventos", "/about", "/company", "/contact", "/help",
  "/blog", "/carreras", "/prensa", "/privacidad", "/terminos", "/cookies",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, events, talents] = await Promise.all([
    serverGet<{ slug: string }[]>("/categories"),
    serverGet<{ id: number }[]>("/events/?is_active=true"),
    serverGet<{ id: number }[]>("/talent"),
  ]);
  const url = (path: string) => `${SITE.url}${path}`;
  return [
    ...STATIC_ROUTES.map((p) => ({ url: url(p || "/") })),
    ...(categories ?? []).map((c) => ({ url: url(`/${c.slug}`) })),
    ...(events ?? []).map((e) => ({ url: url(`/eventos/${e.id}`) })),
    ...(talents ?? []).map((t) => ({ url: url(`/profile/${t.id}`) })),
  ];
}
