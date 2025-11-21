"use client";

import { useEffect, useState } from "react";
import "@/styles/header.css";

export default function Header() {
  const [time, setTime] = useState("");
  const [pizzaMode, setPizzaMode] = useState(false);

  // 🔵 ORARIO LIVE
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("it-IT"));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 TOGGLE MODALITÀ PIZZA
  const togglePizza = () => {
    setPizzaMode((prev) => {
      const next = !prev;
      document.body.classList.toggle("pizza-mode", next);
      return next;
    });
  };

  return (
    <header className="site-header">
      {/* SX: Nome */}
      <div className="header-left">
        <a href="/" className="header-link underline">Pizzaboynico</a>
      </div>

      {/* CENTER: Seizo */}
      <nav className="header-center">
        <span className="header-link header-disabled">Seizo (coming soon)</span>
      </nav>

      {/* RIGHT: Orario + Bergamo + Pizza Button */}
      <div className="header-right">
        <span className="header-clock">{time}</span>
        <span className="header-location">Bergamo</span>

        <button className="pizza-button" onClick={togglePizza}>
          <img src="/pizza-icon.png" alt="Pizza mode toggle" />
        </button>
      </div>
    </header>
  );
}