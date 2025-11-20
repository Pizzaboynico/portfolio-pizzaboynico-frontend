"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <a href="/">PIZZABOYNICO</a>
      </div>

      <div className="header-right">
        <span style={{ opacity: 0.6 }}>SEIZO (COMING SOON)</span>
        <span className="header-clock">{time}</span>
      </div>
    </header>
  );
}