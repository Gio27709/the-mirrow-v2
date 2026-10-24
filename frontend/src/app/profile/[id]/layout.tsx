import type { Metadata } from "next";
import { serverGet, truncate } from "@/lib/server-api";

interface TalentMeta {
  stage_name: string;
  category?: string | null;
  description?: string | null;
  bio?: string | null;
  image_url?: string | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const talent = await serverGet<TalentMeta>(`/talent/profile/${encodeURIComponent(id)}`);
  if (!talent) return { title: "Artista | The Mirrow" };

  const description =
    truncate(talent.description || talent.bio) ??
    `Contrata a ${talent.stage_name} para tu evento con The Mirrow.`;
  return {
    title: `${talent.stage_name} | The Mirrow`,
    description,
    openGraph: {
      title: talent.stage_name,
      description,
      type: "profile",
      images: talent.image_url ? [{ url: talent.image_url }] : undefined,
    },
  };
}

export default function TalentProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
