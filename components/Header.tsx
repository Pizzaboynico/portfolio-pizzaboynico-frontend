"use client";

import { useEffect, useState } from "react";
// Importo l'icona X di lucide-react (necessaria per il punto nel mockup)
import { X } from 'lucide-react'; 

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

  // TOGGLE PIZZA MODE (Logica lasciata intatta, ma usiamo un'icona per l'estetica)
  const togglePizza = () => {
    // Assumendo che 'pizza-mode' sia definito nel tuo globals.css
    document.body.classList.toggle("pizza-mode");
  };

  return (
    // 1. HEADER: Fisso, sopra tutto, sfondo trasparente, padding
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent text-white pt-6 pb-2 px-6 md:px-10 font-sans text-sm uppercase">
      
      {/* 2. CONTENITORE: Utilizza FLEX per creare l'allineamento a 3 colonne */}
      <div className="flex justify-between items-center h-8">
        
        {/* COLONNA SINISTRA (SX): Link principale */}
        <div className="flex-1 text-left">
          {/* hide the header brand on small screens because the centered SVG overlay replaces it */}
          <a className="hidden sm:inline-block font-bold hover:underline" href="/">
            Pizzaboynico
          </a>
        </div>

        {/* COLONNA CENTRALE (CENTRO): Testo Centrato (visibile solo su schermi medi e grandi) */}
        <div className="flex-1 text-center hidden sm:block">
          <span className="text-gray-400 text-xs">Seizo Fanzine (Soon)</span>
        </div>

        {/* COLONNA DESTRA (DX): Ora, Posizione, Icona. Usa flex-end per l'allineamento a destra */}
        <div className="flex-1 text-right flex items-center justify-end space-x-4">
          
          {/* Posizione e Ora (Bergamo 17:56:52) */}
          <span className="text-xs sm:text-sm tracking-widest text-gray-200">
            Bergamo&nbsp;&nbsp;{time}
          </span>
          
          {/* ICONA/PUNTO (come nel mockup) */}
          <div className="w-2.5 h-2.5 bg-white rounded-full flex-shrink-0" />


          {/* Pulsante per il toggle Pizza Mode */}
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent border border-white/30 hover:bg-white/10 transition-colors" 
            onClick={togglePizza}
            aria-label="Toggle Pizza Mode"
          >
             {/* Sostituisco l'immagine texture con un'icona a tema (o un'emoji) */}
             <span role="img" aria-label="Pizza" className="text-lg">🍕</span>
          </button>
        </div>
      </div>
    </header>
  );
}