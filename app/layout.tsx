"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/grid.css";
import "@/styles/modal.css";
import useLenis from "@/lib/lenis";
import { useEffect } from "react";

function Header() {
  return (
    <header
      style={{
        width: "100%",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px",
        letterSpacing: "0.5px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        mixBlendMode: "difference",
        color: "#ffffff",
        pointerEvents: "none"
      }}
    >
      {/* LEFT — PIZZABOYNICO */}
      <div
        style={{
          position: "relative",
          cursor: "pointer",
          fontWeight: 500,
          pointerEvents: "auto"
        }}
      >
        Pizzaboynico
        <span
          style={{
            position: "absolute",
            left: 0,
            bottom: -2,
            width: "100%",
            height: "1px",
            backgroundColor: "currentColor",
            opacity: 0.8,
            transform: "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
          className="header-underline"
        />
      </div>

      {/* CENTER — SEIZO COMING SOON */}
      <div
        style={{
          opacity: 0.4,
          position: "relative",
          pointerEvents: "none",
          mixBlendMode: "difference"
        }}
      >
        Seizo (Coming Soon)
        <span
          style={{
            position: "absolute",
            left: 0,
            bottom: -2,
            width: "100%",
            height: "1px",
            backgroundColor: "currentColor",
            opacity: 0.25,
            transform: "scaleX(0.6)",
            transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>

      {/* RIGHT — CLOCK */}
      <Clock />
    </header>
  );
}

import { useState, useEffect } from "react";

function Clock() {
  const [time, setTime] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);

      // Trigger animation
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        opacity: 0.9,
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
        transform: animate ? "scale(1.12)" : "scale(1)",
        pointerEvents: "auto"
      }}
    >
      {time}
    </div>
  );
}

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

// Animated underline style for header
<style jsx>{`
  header div:hover .header-underline {
    transform: scaleX(1);
  }
`}</style>

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenis();

  useEffect(() => {
    const cursor = document.getElementById("custom-cursor");
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.top = `${e.clientY}px`;
      cursor.style.left = `${e.clientX}px`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          backgroundColor: "#4B61D1",
          color: "#ffffff",
        }}
      >
        <div id="custom-cursor"></div>
        <Header />
        {children}
      </body>
    </html>
  );
}

<style jsx global>{`
  #custom-cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 999999;
    mix-blend-mode: difference;
    transition: transform 0.15s ease-out;
  }

  body {
    cursor: none !important;
  }

  header, header * {
    mix-blend-mode: difference;
    color: #fff;
  }
`}</style>