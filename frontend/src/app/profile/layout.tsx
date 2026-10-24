import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil | The Mirrow",
  description:
    "Perfiles de artistas en The Mirrow.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
