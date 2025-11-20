"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const t =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0") +
        ":" +
        now.getSeconds().toString().padStart(2, "0");
      setTime(t);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-[99999]"
      style={{ mixBlendMode: "difference" }}
    >
      <div className="text-white tracking-wide text-sm">
        PIZZABOYNICO
      </div>

      <div className="flex items-center gap-8 text-white text-sm tracking-wide">
        <span style={{ opacity: 0.3 }}>SEIZO (COMING SOON)</span>
        <span>{time}</span>
      </div>
    </header>
  );
}