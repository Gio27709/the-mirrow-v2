import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos y entradas | The Mirrow",
  description:
    "Cartelera de eventos de The Mirrow: conciertos, galas, teatro y producciones en directo. Reserva tu entrada o cotiza tu propio evento.",
};

export default function EventosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
