"use client";

import { useState } from "react";

interface BuyButtonProps {
  product: {
    _id: string;
    title: string;
    price: number;
    mainImage?: any;
    slug?: { current: string };
  };
  textColor: string;
}

export default function BuyButton({ product, textColor }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          title: product.title,
          price: product.price,
          imageUrl: product.mainImage, // Potrebbe dover essere risolta
          slug: product.slug?.current,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned", data);
        alert("Si è verificato un errore, riprova.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="buy-button uppercase"
      style={{
        marginTop: "20px",
        padding: "12px 24px",
        backgroundColor: "transparent",
        color: textColor,
        border: `1px solid ${textColor}`,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        transition: "all 0.3s ease",
        borderRadius: "4px",
        fontSize: "13px",
        display: "inline-block",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = textColor;
        e.currentTarget.style.color = textColor === "#ffffff" ? "#000000" : "#ffffff";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = textColor;
      }}
    >
      {loading ? "Caricamento..." : "Acquista ora"}
    </button>
  );
}
