"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  // OROLOGIO
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // TOGGLE PIZZA MODE
  const togglePizza = () => {
    document.body.classList.toggle("pizza-mode");
  };

  return (
    <header className="site-header">
      {/* SX */}
      <div className="header-left">
        <a className="header-link underline" href="/">
          PIZZABOYNICO
        </a>
      </div>

      {/* CENTRO */}
      <div className="header-center">
        <span className="header-link header-disabled">SEIZO (COMING SOON)</span>
      </div>

      {/* DX */}
      <div className="header-right">
        <span className="clock">Bergamo&nbsp;&nbsp;{time}</span>

        <button className="pizza-btn" onClick={togglePizza}>
          <img src="/pizza-texture.jpg" alt="pizza texture" />
        </button>
      </div>
    </header>
  );
}