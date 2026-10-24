import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centro de Ayuda | The Mirrow",
  description:
    "Preguntas frecuentes sobre tu cuenta, contratar artistas, eventos y entradas, perfiles de artista, Pro y privacidad en The Mirrow.",
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
