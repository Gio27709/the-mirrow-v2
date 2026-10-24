import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi cuenta | The Mirrow",
  description:
    "Tu perfil, entradas y preferencias en The Mirrow.",
  robots: { index: false, follow: true },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
