import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { CategoryProvider } from "@/context/CategoryContext";
import { MainLayout } from "@/components/layout";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "The Mirrow | Entertainment Platform",
  description:
    "Plataforma de entretenimiento profesional - Teatro, Músicos, DJs, Cantantes y Billar",
  keywords: [
    "entretenimiento",
    "teatro",
    "música",
    "djs",
    "cantantes",
    "billar",
  ],
  authors: [{ name: "The Mirrow Team" }],
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
