import type { Metadata } from "next";
import "./globals.css";
import "@/styles/grid.css";
import "@/styles/modal.css";
import "@/styles/header.css";
import ClientLayout from "@/components/ClientLayout";

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
      <body className="aeonik-mono">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}