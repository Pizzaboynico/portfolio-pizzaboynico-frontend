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

interface TShirtBuilderProps {
  product: any;
  textColor: string;
}

export default function TShirtBuilder({ product, textColor }: TShirtBuilderProps) {
  const { addItem } = useCartStore();
  const [size, setSize] = useState<string>("L");
  const [viewMode, setViewMode] = useState<"fronte" | "retro">("fronte");
  
  const [logoCuore, setLogoCuore] = useState<string | null>(null);
  const [logoDestro, setLogoDestro] = useState<string | null>(null);
  const [logoRetro, setLogoRetro] = useState<string | null>(null);

  const [optionsCuore, setOptionsCuore] = useState<any[]>([]);
  const [optionsDestro, setOptionsDestro] = useState<any[]>([]);
  const [optionsRetro, setOptionsRetro] = useState<any[]>([]);

  const sizes = ["S", "M", "L", "XL", "XXL"];

  // Caricamento dinamico asset per accettare qualsiasi nomenclatura
  useEffect(() => {
    async function loadAssets() {
      try {
        const res = await fetch('/api/assets-list');
        const data = await res.json();
        
        const formatOptions = (files: string[]) => [
          { value: null, label: "Nessun Logo" },
          ...files.map(f => ({ value: f, label: f.replace('.svg', '').replace('Cuore-', '').replace('destro-', '').replace('Retro-', '') }))
        ];

        setOptionsCuore(formatOptions(data.cuore || []));
        setOptionsDestro(formatOptions(data.destro || []));
        setOptionsRetro(formatOptions(data.retro || []));
      } catch (err) {
        console.error("Errore caricamento asset builder:", err);
      }
    }
    loadAssets();
  }, []);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      title: `${product.title}`,
      price: product.price,
      imageUrl: urlFor(product.mainImage).width(500).url(),
      size: size,
      customization: {
        cuore: logoCuore,
        destro: logoDestro,
        retro: logoRetro
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

  // Funzioni che cambiano lato automaticamente
  const changeCuore = (val: string | null) => { setLogoCuore(val); setViewMode("fronte"); };
  const changeDestro = (val: string | null) => { setLogoDestro(val); setViewMode("fronte"); };
  const changeRetro = (val: string | null) => { setLogoRetro(val); setViewMode("retro"); };

  return (
    <>
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
                Configuratore Custom
              </div>
              
              <div className="info-label" style={{marginBottom: "5px"}}>Scegli Taglia</div>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
                {sizes.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSize(s)}
                    style={{
                      flex: 1, padding: "8px 0", cursor: "pointer", fontSize: "13px",
                      background: size === s ? textColor : "transparent",
                      color: size === s ? (textColor === "#ffffff" ? "#000000" : "#ffffff") : textColor,
                      border: `1px solid ${textColor}`
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="info-label" style={{marginBottom: "5px"}}>Logo Lato Cuore</div>
              <select style={selectStyle} value={logoCuore || ""} onChange={(e) => changeCuore(e.target.value || null)}>
                {optionsCuore.map(opt => <option key={opt.label} value={opt.value || ""} style={{color: 'black'}}>{opt.label}</option>)}
              </select>

              <div className="info-label" style={{marginBottom: "5px"}}>Logo Lato Destro</div>
              <select style={selectStyle} value={logoDestro || ""} onChange={(e) => changeDestro(e.target.value || null)}>
                {optionsDestro.map(opt => <option key={opt.label} value={opt.value || ""} style={{color: 'black'}}>{opt.label}</option>)}
              </select>

              <div className="info-label" style={{marginBottom: "5px"}}>Maxi Stampa Retro</div>
              <select style={selectStyle} value={logoRetro || ""} onChange={(e) => changeRetro(e.target.value || null)}>
                {optionsRetro.map(opt => <option key={opt.label} value={opt.value || ""} style={{color: 'black'}}>{opt.label}</option>)}
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
        {/* Toggle Vista manuale */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => setViewMode('fronte')}
            style={{ 
              padding: "8px 16px", cursor: "pointer", fontSize: "12px", border: `1px solid ${textColor}`,
              background: viewMode === 'fronte' ? textColor : "transparent",
              color: viewMode === 'fronte' ? (textColor === "#ffffff" ? "#000000" : "#ffffff") : textColor 
            }}
          >Vista Fronte</button>
          <button 
            onClick={() => setViewMode('retro')}
            style={{ 
              padding: "8px 16px", cursor: "pointer", fontSize: "12px", border: `1px solid ${textColor}`,
              background: viewMode === 'retro' ? textColor : "transparent",
              color: viewMode === 'retro' ? (textColor === "#ffffff" ? "#000000" : "#ffffff") : textColor 
            }}
          >Vista Retro</button>
        </div>

        {/* Builder Viewport */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          
          <img 
            src={`/assets/base/maglia-${viewMode}.svg`} 
            alt={`Maglia ${viewMode}`} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />

          {/* LAYER FRONTE */}
          {viewMode === "fronte" && (
            <>
              {/* LATO CUORE - Spostato più in EN ALTO e rimpicciolito (Viewer Left) */}
              {logoCuore && (
                <img 
                  src={`/assets/lato-cuore/${logoCuore}`} 
                  alt="Lato Cuore" 
                  style={{ position: 'absolute', width: '12%', left: '22%', top: '18%', zIndex: 10, pointerEvents: 'none' }}
                />
              )}
              {/* LATO DESTRO - Spostato più in ALTO e rimpicciolito (Viewer Right) */}
              {logoDestro && (
                <img 
                  src={`/assets/lato-destro/${logoDestro}`} 
                  alt="Lato Destro" 
                  style={{ position: 'absolute', width: '13%', left: '60%', top: '20%', zIndex: 10, pointerEvents: 'none' }}
                />
              )}
            </>
          )}

          {/* LAYER RETRO */}
          {viewMode === "retro" && (
            <>
               {/* Logo RETRO - Molto più in alto come da feedback */}
               {logoRetro && (
                <img 
                  src={`/assets/retro/${logoRetro}`} 
                  alt="Schiena" 
                  style={{ position: 'absolute', width: '42%', left: '29%', top: '12%', zIndex: 10, pointerEvents: 'none' }}
                />
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}
