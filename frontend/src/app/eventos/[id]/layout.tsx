import type { Metadata } from "next";
import { serverGet, truncate } from "@/lib/server-api";

interface EventMeta {
  title: string;
  description?: string | null;
  image_url?: string | null;
  date?: string | null;
  venue_name?: string | null;
  location?: string | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await serverGet<EventMeta>(`/events/${encodeURIComponent(id)}`);
  if (!event) return { title: "Evento | The Mirrow" };

  const where = [event.date, event.venue_name || event.location].filter(Boolean).join(" · ");
  const description =
    truncate(event.description) ?? `${event.title}${where ? ` — ${where}` : ""}. Entradas en The Mirrow.`;
  return {
    title: `${event.title} | The Mirrow`,
    description,
    openGraph: {
      title: event.title,
      description,
      type: "website",
      images: event.image_url ? [{ url: event.image_url }] : undefined,
    },
  };
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return children;
}
