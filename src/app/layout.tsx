import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  title: "GlockTrack AI",
  description: "Smart Diabetes Management Assistant powered by AI",
  manifest: "/gluco-track/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GlockTrack AI",
  },
  icons: {
    icon: [
      { url: "/gluco-track/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/gluco-track/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/gluco-track/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
