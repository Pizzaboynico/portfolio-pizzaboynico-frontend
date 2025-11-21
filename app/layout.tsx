import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/grid.css";
import "@/styles/header.css";
import "@/styles/modal.css";

import Providers from "./providers";
import Header from "@/components/Header";

// FONT LOCALE — Aeonik Mono
const AeonikMono = localFont({
  src: "/fonts/AeonikMono-Regular.otf",
  variable: "--font-aeonikmono",
  weight: "400",
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
      <body className={`${AeonikMono.variable}`}>
        {/* cursore custom */}
        <div id="cursor-dot" className="cursor-dot"></div>

        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}