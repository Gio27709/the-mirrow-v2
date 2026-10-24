import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre nosotros | The Mirrow",
  description:
    "The Mirrow es un puente entre el talento y el escenario: representación de artistas, producción de eventos y venta de entradas.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
