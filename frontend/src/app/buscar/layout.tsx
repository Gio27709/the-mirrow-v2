import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar | The Mirrow",
  description:
    "Busca artistas, eventos y categorías en The Mirrow.",
  robots: { index: false, follow: true },
};

export default function BuscarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
