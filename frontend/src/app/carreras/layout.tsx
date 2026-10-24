import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trabaja con nosotros | The Mirrow",
  description:
    "Únete al equipo de The Mirrow: producción de eventos, booking de artistas, marketing y contenido, y técnica de sonido e iluminación.",
};

export default function CarrerasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
