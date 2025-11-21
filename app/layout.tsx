import type { Metadata } from "next";
import "./globals.css";
import "@/styles/grid.css";
import "@/styles/modal.css";
import "@/styles/header.css";

export const metadata: Metadata = {
  title: "Portfolio – Nicola Cortinovis",
  description: "Portfolio personale di Nicola Cortinovis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="aeonik-mono">
        {/* Cursor */}
        <div className="cursor-dot" />

        {/* HEADER */}
        <header className="site-header">
          {/* SX */}
          <div className="header-left">
            <a href="/" className="header-link underline">PIZZABOYNICO</a>
          </div>

          {/* CENTRO */}
          <div className="header-center">
            <span className="header-disabled">SEIZO (COMING SOON)</span>
          </div>

          {/* DX */}
          <div className="header-right">
            <span className="location">Bergamo</span>
            <span id="clock" className="clock"></span>

            <button id="pizzaToggle" className="pizza-btn">
              <img src="/pizza-texture.jpg" alt="Pizza Mode" />
            </button>
          </div>
        </header>

        {children}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              const dot = document.querySelector('.cursor-dot');
              document.addEventListener('mousemove', (e) => {
                dot.style.top = e.clientY + 'px';
                dot.style.left = e.clientX + 'px';
              });

              function updateClock() {
                const now = new Date();
                const h = String(now.getHours()).padStart(2,'0');
                const m = String(now.getMinutes()).padStart(2,'0');
                const s = String(now.getSeconds()).padStart(2,'0');
                document.getElementById('clock').textContent = h + ":" + m + ":" + s;
              }
              setInterval(updateClock, 1000);
              updateClock();

              const toggle = document.getElementById('pizzaToggle');
              toggle?.addEventListener('click', () => {
                document.body.classList.toggle('pizza-mode');
              });
            `,
          }}
        />
      </body>
    </html>
  );
}