import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prensa | The Mirrow",
  description:
    "Sala de prensa de The Mirrow: quiénes somos, datos clave, kit de prensa con logotipos y contacto para medios.",
};

export default function PrensaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
