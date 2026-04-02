"use client";

import { useState, useEffect } from "react";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";

import { useCartStore } from "@/lib/store";

const builder = imageUrlBuilder(client);
function urlFor(src: any) {
  return builder.image(src);
}

interface VinylBuilderProps {
  product: any;
  textColor: string;
  gallery: any[];
}

export default function VinylBuilder({ product, textColor, gallery }: VinylBuilderProps) {
  const { addItem } = useCartStore();
  const [size, setSize] = useState<string>("Standard (12\")");
  
  const [vinylModel, setVinylModel] = useState<string | null>(null);
  const [optionsVinyl, setOptionsVinyl] = useState<any[]>([]);

  // Caricamento dinamico asset per accettare qualsiasi nomenclatura
  useEffect(() => {
    async function loadAssets() {
      try {
        const res = await fetch('/api/assets-list');
        const data = await res.json();
        
        const formatOptions = (files: string[]) => [
          { value: null, label: "Nessun Modello" },
          ...files.map(f => ({ value: f, label: f.replace('.svg', '').replace(/[-_]/g, ' ') }))
        ];

        setOptionsVinyl(formatOptions(data.vinyl || []));
      } catch (err) {
        console.error("Errore caricamento asset builder:", err);
      }
    }
    loadAssets();
  }, []);

  // Imposta il primo modello di default se disponibile
  useEffect(() => {
      if (optionsVinyl.length > 1 && !vinylModel) {
          setVinylModel(optionsVinyl[1].value);
      }
  }, [optionsVinyl, vinylModel]);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      title: `${product.title}`,
      price: product.price,
      imageUrl: urlFor(product.mainImage).width(500).url(),
      size: size,
      customization: {
        vinylModel: vinylModel
      }
    });
  };

  const selectStyle = {
    padding: "8px",
    background: "transparent",
    color: textColor,
    border: `1px solid ${textColor}`,
    borderRadius: "4px",
    width: "100%",
    marginBottom: "15px",
    outline: "none",
    fontSize: "13px"
  };

  return (
    <>
      <style>{`
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .spinning-vinyl {
            animation: spin 4s linear infinite;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            /* Un leggero bordo nero aiuta a dare forma al vinile se l'SVG non ha bordi */
            border: 2px solid #111;
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .spinning-vinyl img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
      `}</style>

      {/* LEFT COLUMN - STICKY CONTROLS */}
      <div className="project-info-col">
        <div className="project-info-sticky">
          <div className="info-meta-group">
            
            <div className="info-row">
              <div className="info-label">Prodotto</div>
              <div className="info-value text-bold uppercase">{product.title}</div>
            </div>

            <div className="info-row">
               <div className="info-label">Prezzo</div>
               <div className="info-value text-bold">€ {product.price.toFixed(2)}</div>
            </div>

            {product.description && (
              <div className="info-row">
                <div className="info-label">Descrizione</div>
                <div className="info-value text-description">{product.description}</div>
              </div>
            )}

            {product.extraInfo && (
              <div className="info-row">
                <div className="info-label">Dettagli</div>
                <div className="info-value text-description">
                   <PortableText value={product.extraInfo} />
                </div>
              </div>
            )}

            {/* BUILDER SECTION */}
            <div style={{ marginTop: '20px', padding: '15px', border: `1px solid ${textColor}40`, borderRadius: '8px' }}>
              <div style={{ marginBottom: "20px", fontSize: "11px", fontWeight: "bold", letterSpacing: "0.05em", textTransform: 'uppercase' }}>
                Selettore Vinile
              </div>
              
              <div className="info-label" style={{marginBottom: "5px"}}>Misura</div>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
                <button 
                  style={{
                    flex: 1, padding: "8px 0", cursor: "default", fontSize: "13px",
                    background: textColor,
                    color: textColor === "#ffffff" ? "#000000" : "#ffffff",
                    border: `1px solid ${textColor}`
                  }}
                >
                  Standard (12")
                </button>
              </div>

              <div className="info-label" style={{marginBottom: "5px"}}>Scegli Modello</div>
              <select style={selectStyle} value={vinylModel || ""} onChange={(e) => setVinylModel(e.target.value || null)}>
                {optionsVinyl.map(opt => <option key={opt.label} value={opt.value || ""} style={{color: 'black'}}>{opt.label}</option>)}
              </select>

              <button
                onClick={handleAddToCart}
                className="buy-button uppercase"
                style={{
                  marginTop: "10px", width: "100%", padding: "12px", background: "transparent", color: textColor,
                  border: `1px solid ${textColor}`, cursor: "pointer", transition: "all 0.3s ease", display: "inline-block"
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = textColor; e.currentTarget.style.color = textColor === "#ffffff" ? "#000000" : "#ffffff"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = textColor; }}
              >
                Aggiungi al Carrello
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - LIVE PREVIEW */}
      <div className="project-gallery-col">

        {/* Builder Viewport */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          
          {vinylModel ? (
            <div className="spinning-vinyl" style={{ width: '80%', maxWidth: '400px' }}>
               <img 
                 src={`/assets/vinyl/${vinylModel}`} 
                 alt="Vinyl Preview" 
               />
            </div>
          ) : (
            <div style={{ opacity: 0.5, border: `1px dashed ${textColor}`, width: '80%', maxWidth: '400px', aspectRatio: '1/1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Seleziona un modello
            </div>
          )}

        </div>

        {/* GALLERIA IMMAGINI AGGIUNTIVE (Sotto il builder) */}
        {gallery && gallery.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            {gallery.map((img: any, i: number) => (
              <div key={i} style={{ marginBottom: "20px" }}>
                <img src={urlFor(img).width(1200).url()} alt={`Gallery ${i}`} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
