"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="main-header">
      <div className="header-left">
        <Link href="/">PIZZABOYNICO</Link>
      </div>

      <div className="header-center">
        <span className="coming-soon">SEIZO (COMING SOON)</span>
      </div>

      <div className="header-right">
        <span>{time}</span>
      </div>
    </header>
  );
}