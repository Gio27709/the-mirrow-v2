import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { CategoryProvider } from "@/context/CategoryContext";
import { MainLayout } from "@/components/layout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

const DESCRIPTION =
  "Contrata artistas para tu evento y vive experiencias en directo: músicos, DJs, cantantes, artes escénicas y danza. Eventos, entradas y producción con The Mirrow.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "The Mirrow | Artistas y eventos en directo",
  description: DESCRIPTION,
  keywords: [
    "contratar artistas",
    "eventos",
    "entradas",
    "músicos",
    "djs",
    "cantantes",
    "artes escénicas",
    "danza",
    "producción de eventos",
  ],
  authors: [{ name: "The Mirrow" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "The Mirrow",
    title: "The Mirrow | Artistas y eventos en directo",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "The Mirrow | Artistas y eventos en directo",
    description: DESCRIPTION,
  },
};

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "590205845416-efrc9ehv81cakm7bh8atejobn72i30kb.apps.googleusercontent.com";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ThemeProvider>
            <AuthProvider>
              <CategoryProvider>
                <MainLayout>{children}</MainLayout>
              </CategoryProvider>
            </AuthProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
