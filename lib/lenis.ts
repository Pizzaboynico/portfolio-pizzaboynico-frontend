// lib/lenis.ts
"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.08,
      wheelMultiplier: 0.9,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}