import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverGet } from "@/lib/server-api";

interface CategoryMeta {
  slug: string;
  name: string;
  description?: string | null;
  banner_url?: string | null;
  image_url?: string | null;
}

async function findCategory(slug: string) {
  const categories = await serverGet<CategoryMeta[]>("/categories");
  // null = API unavailable: don't claim the page doesn't exist
  if (!categories) return { category: null, apiDown: true };
  return { category: categories.find((c) => c.slug === slug) ?? null, apiDown: false };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const { category } = await findCategory(slug);
  if (!category) return { title: "The Mirrow" };
  const description =
    category.description || `Artistas de ${category.name} para tu evento en The Mirrow.`;
  const image = category.banner_url || category.image_url;
  return {
    title: `${category.name} | The Mirrow`,
    description,
    openGraph: {
      title: category.name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const { category, apiDown } = await findCategory(slug);
  // Unknown paths (e.g. /no-existe) used to answer 200 with a client-side 404
  if (!category && !apiDown) notFound();
  return children;
}
