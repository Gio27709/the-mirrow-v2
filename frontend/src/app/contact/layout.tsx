import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | The Mirrow",
  description:
    "Cuéntanos tu proyecto: organización de eventos, cotización de producciones o contratación de artistas. Te respondemos por email o WhatsApp.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
