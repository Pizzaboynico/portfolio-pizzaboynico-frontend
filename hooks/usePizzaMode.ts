"use client";
import { useEffect, useState } from "react";

export function usePizzaMode() {
    const [isPizzaMode, setIsPizzaMode] = useState(false);

    useEffect(() => {
        if (isPizzaMode) {
            document.body.classList.add("pizza-mode");
        } else {
            document.body.classList.remove("pizza-mode");
        }
    }, [isPizzaMode]);

    const togglePizzaMode = () => setIsPizzaMode((prev) => !prev);

    return { isPizzaMode, togglePizzaMode };
}
