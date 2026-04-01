"use client";

import { useState } from "react";

import { useCartStore } from "@/lib/store";

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
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      imageUrl: product.mainImage,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="buy-button uppercase"
      style={{
        marginTop: "20px",
        padding: "12px 24px",
        backgroundColor: "transparent",
        color: textColor,
        border: `1px solid ${textColor}`,
        cursor: "pointer",
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
      Aggiungi al Carrello
    </button>
  );
}
