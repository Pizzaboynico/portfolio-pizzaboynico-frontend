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
            // stay fixed) — don't call lenis.raf while the class is present and
            // remove any transform it might have applied so elements behave
            // normally. When pizza-mode is removed lenis resumes applying smooth scroll.
            if (document.body.classList.contains("pizza-mode")) {
                // Clear transform on the scrolling element in case Lenis left it set
                try {
                    // lenis normally applies transforms to document.documentElement or body
                    (document.documentElement as HTMLElement).style.transform = "none";
                    const scrollingEl = document.scrollingElement as HTMLElement | null;
                    if (scrollingEl) scrollingEl.style.transform = "none";
                    // Also clear from body to be defensive
                    document.body.style.transform = "none";
                } catch (e) {
                    // noop — defensive
                }
            } else {
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
