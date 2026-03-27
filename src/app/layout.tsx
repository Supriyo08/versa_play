import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "VersaPlay - Multi-Sport Tournament Platform",
  description:
    "The ultimate platform for multi-sport tournament management, live scoring, and player analytics.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-vp-dark text-vp-text antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
