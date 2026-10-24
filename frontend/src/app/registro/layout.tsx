import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista de espera | The Mirrow",
  description:
    "Únete a la lista de espera de The Mirrow: acceso anticipado a eventos y experiencias exclusivas.",
};

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
