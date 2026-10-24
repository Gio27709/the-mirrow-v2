import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novedades | The Mirrow",
  description:
    "Lo último de The Mirrow: próximos eventos, eventos recientes y artistas destacados.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
