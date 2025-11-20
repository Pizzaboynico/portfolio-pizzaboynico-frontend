"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,          // smussatura scroll
      wheelMultiplier: 1,  // sensibilità
      infinite: false,     // no loop
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);
}