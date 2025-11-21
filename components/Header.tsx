"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [time, setTime] = useState("");
  const [pizza, setPizza] = useState(false);

  // CLOCK LIVE
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // TOGGLE PIZZA MODE
  const togglePizza = () => {
    const body = document.body;
    const newState = !pizza;
    setPizza(newState);

    if (newState) body.classList.add("pizza-mode");
    else body.classList.remove("pizza-mode");
  };

  return (
    <header className="site-header">
      {/* LEFT */}
      <div className="header-left">
        <a href="/" className="header-link underline">
          PIZZABOYNICO
        </a>
      </div>

      {/* CENTER */}
      <div className="header-center">
        <span className="header-link header-disabled">SEIZO (COMING SOON)</span>
      </div>

      {/* RIGHT */}
      <div className="header-right" style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <span className="clock">{time}</span>

        {/* PULSANTE PIZZA */}
        <button className="pizza-btn" onClick={togglePizza}>
          <img src="/pizza-texture.jpg" className="pizza-img" style={{ width: "100%", height: "100%" }} />
        </button>
      </div>
    </header>
  );
}