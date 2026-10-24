import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre la compañía | The Mirrow",
  description:
    "Misión, visión y valores de The Mirrow: organización de eventos, booking de artistas y producción en España.",
};

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
