"use client";

import { client } from "@/lib/sanity.client";
import MasonryGrid from "@/components/MasonryGrid";
import { useState, useEffect } from "react";

const PRODUCTS_QUERY = `*[_type == "product"] {
  _id,
  title,
  slug,
  price,
  description,
  mainImage
}`;

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    client.fetch(PRODUCTS_QUERY).then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="page-content">
      {products.length > 0 ? (
        <MasonryGrid projects={products} basePath="/shop" />
      ) : (
        <div style={{ textAlign: 'center', paddingTop: '10vh', color: 'rgba(255,255,255,0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Lo shop è attualmente vuoto.
        </div>
      )}
    </div>
  );
}
