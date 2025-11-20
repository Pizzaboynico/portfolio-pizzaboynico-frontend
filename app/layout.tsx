import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/grid.css";
import "@/styles/modal.css";
import "@/styles/header.css";
import "@/styles/cursor.css";

import Providers from "./providers";
import Header from "@/components/Header";

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
        {/* Cursor DOT */}
        <div id="cursor-dot" className="cursor-dot"></div>

        {/* Script cursor */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const dot = document.getElementById('cursor-dot');
              window.addEventListener('mousemove', (e) => {
                dot.style.top = e.clientY + 'px';
                dot.style.left = e.clientX + 'px';
              });
            `,
          }}
        />

        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}