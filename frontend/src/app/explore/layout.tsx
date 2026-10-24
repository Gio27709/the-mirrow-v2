import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorar artistas | The Mirrow",
  description:
    "Explora artistas por categoría: músicos, DJs, cantantes, artes escénicas y danza. Encuentra el talento perfecto para tu evento.",
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
