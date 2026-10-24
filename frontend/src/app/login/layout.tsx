import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | The Mirrow",
  description:
    "Accede a tu cuenta de The Mirrow para gestionar tus entradas y solicitudes.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
