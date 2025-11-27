"use client";

import { useCursor } from "@/hooks/useCursor";
import { usePizzaMode } from "@/hooks/usePizzaMode";
import { useClock } from "@/hooks/useClock";
import SmoothScroll from "@/components/SmoothScroll";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    useCursor();
    const { togglePizzaMode } = usePizzaMode();
    const time = useClock();

    return (
        <>
            <SmoothScroll />
            <div className="cursor-dot" />

            <header className="site-header">
                <div className="header-left">
                    <a href="/" className="header-link underline">Pizzaboynico</a>
                </div>

                <div className="header-center">
                    <span className="header-disabled">Seizo (coming soon)</span>
                </div>

                <div className="header-right">
                    <span className="location">Bergamo</span>
                    <span className="clock">{time}</span>

                    <button onClick={togglePizzaMode} className="pizza-btn">
                        <img src="/pizza-texture.jpg" alt="Pizza Mode" />
                    </button>
                </div>
            </header>

            {children}
        </>
    );
}
