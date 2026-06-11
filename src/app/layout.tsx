import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-provider";

import "./globals.css";
import { BASE_URL, sharedOpenGraph, sharedTwitter } from "./shared-metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Busilogix",
    template: "%s | Busilogix",
  },
  description:
    "Professional invoicing and business management platform for modern teams.",
  icons: {
    icon: "/Busilogix.png",
    apple: "/Busilogix.png",
  },
  openGraph: {
    ...sharedOpenGraph,
    title: "Busilogix",
    description:
      "Professional invoicing and business management platform for modern teams.",
    url: "/",
  },
  twitter: {
    ...sharedTwitter,
    title: "Busilogix",
    description:
      "Professional invoicing and business management platform for modern teams.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
