"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        function raf(time: number) {
            // If pizza-mode is active we want native scrolling (header/logo should
            // stay fixed) — stop Lenis entirely and clear all transforms
            if (document.body.classList.contains("pizza-mode")) {
                // Stop Lenis and clear transforms
                try {
                    lenis.stop();
                    (document.documentElement as HTMLElement).style.transform = "";
                    (document.documentElement as HTMLElement).style.removeProperty('transform');
                    const scrollingEl = document.scrollingElement as HTMLElement | null;
                    if (scrollingEl) {
                        scrollingEl.style.transform = "";
                        scrollingEl.style.removeProperty('transform');
                    }
                    document.body.style.transform = "";
                    document.body.style.removeProperty('transform');
                } catch (e) {
                    // noop — defensive
                }
            } else {
                lenis.start();
                lenis.raf(time);
            }

            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
}
