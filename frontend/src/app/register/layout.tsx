import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta | The Mirrow",
  description:
    "Crea tu cuenta en The Mirrow para reservar entradas y contratar artistas.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
