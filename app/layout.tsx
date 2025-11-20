import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/grid.css";
import "@/styles/modal.css";

import Header from "@/components/Header";
import Providers from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio – Nicola Cortinovis",
  description: "Portfolio personale di Nicola Cortinovis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          backgroundColor: "#4B61D1",
          color: "#ffffff",
        }}
      >
        <Providers /> {/* Lenis */}
        <Header /> {/* Header sempre visibile */}

        {/* CONTENUTO DEL SITO */}
        {children}

        {/* CURSORE PERSONALIZZATO */}
        <div id="cursor-dot"></div>
      </body>
    </html>
  );
}