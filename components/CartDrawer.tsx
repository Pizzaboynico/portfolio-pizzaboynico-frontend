"use client";

import { useCartStore } from "@/lib/store";
import { useState } from "react";

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, removeItem, getCartTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  // Non facciamo nulla se è chiuso
  if (!isDrawerOpen) return null;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }), // Inviamo l'intero carrello
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Si è verificato un errore col carrello, riprova.");
      }
    } catch (err) {
      console.error("Errore checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="cart-overlay" 
        onClick={closeDrawer}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9999
        }}
      />
      
      <div 
        className="cart-drawer"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, 
          width: "400px", maxWidth: "90%", backgroundColor: "#fff", 
          zIndex: 10000, boxShadow: "-5px 0 15px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column", color: "#000"
        }}
      >
        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee" }}>
          <h2 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Carrello</h2>
          <button onClick={closeDrawer} style={{ background: "transparent", border: "none", fontSize: "16px", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
          {items.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#666" }}>Il carrello è vuoto.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "15px", borderBottom: "1px solid #f0f0f0", paddingBottom: "15px" }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: "80px", height: "80px", objectFit: "cover", backgroundColor: "#f9f9f9" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "bold", fontSize: "14px", textTransform: "uppercase" }}>{item.title}</div>
                    <div style={{ fontSize: "13px", color: "#666" }}>€ {item.price.toFixed(2)} {item.quantity > 1 ? `(x${item.quantity})` : ""}</div>
                    
                    {/* Riepilogo varianti custom */}
                    {(item.size || item.customization) && (
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "5px", lineHeight: 1.4 }}>
                        {item.size && <div>Size: {item.size}</div>}
                        {item.customization?.cuore && <div>Cuore: {item.customization.cuore}</div>}
                        {item.customization?.destro && <div>Destro: {item.customization.destro}</div>}
                        {item.customization?.retro && <div>Retro: {item.customization.retro}</div>}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    style={{ background: "transparent", border: "none", color: "#999", cursor: "pointer", height: "fit-content" }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "20px", borderTop: "1px solid #eee", backgroundColor: "#f9f9f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontWeight: "bold", textTransform: "uppercase" }}>
            <span>Totale:</span>
            <span>€ {getCartTotal().toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || loading}
            style={{
              width: "100%", padding: "15px", backgroundColor: "#000", color: "#fff",
              border: "none", textTransform: "uppercase", fontSize: "13px", letterSpacing: "1px",
              cursor: items.length === 0 || loading ? "not-allowed" : "pointer",
              opacity: items.length === 0 || loading ? 0.7 : 1
            }}
          >
            {loading ? "Caricamento..." : "Procedi all'Acquisto"}
          </button>
          
          <button 
             onClick={clearCart} 
             disabled={items.length === 0}
             style={{
               width: "100%", border: "none", background: "transparent", color: "#666", 
               fontSize: "11px", marginTop: "10px", cursor: "pointer", textDecoration: "underline"
             }}
          >
            Svuota Carrello
          </button>
        </div>
      </div>
    </>
  );
}
