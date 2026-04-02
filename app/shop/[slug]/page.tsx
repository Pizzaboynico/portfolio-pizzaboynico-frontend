import { client } from "@/lib/sanity.client";
import imageUrlBuilder from "@sanity/image-url";
import { notFound } from "next/navigation";
import BuyButton from "@/components/BuyButton";
import TShirtBuilder from "@/components/TShirtBuilder";
import { PortableText } from "@portabletext/react";

const builder = imageUrlBuilder(client);
function urlFor(src: any) {
  return builder.image(src);
}

// Funzione helper per calcolare il contrasto del testo
function getContrastColor(hexColor: string) {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6 && hex.length !== 3) return '#ffffff';

  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

export const revalidate = 60;

const PRODUCT_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    price,
    description,
    extraInfo,
    isCustomizable,
    mainImage,
    "imagePalette": mainImage.asset->metadata.palette,
    gallery
  }
`;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await client.fetch(PRODUCT_QUERY, { slug });

  if (!product) {
    notFound();
  }

  const { title, description, price, extraInfo, gallery, imagePalette } = product;

  // Estrai il colore dalla palette dell'immagine (vibrant o dominant come fallback)
  const palette = imagePalette?.vibrant || imagePalette?.dominant;
  const bgColor = palette?.background || '#4B61D1';
  
  // Calcola automaticamente il colore di testo (bianco o nero) per garantire alto contrasto
  const textColor = getContrastColor(bgColor);

  return (
    <div className="project-page-container">

      <div className="project-layout">
        {product.isCustomizable ? (
          <TShirtBuilder product={product} textColor={textColor} gallery={gallery || []} />
        ) : (
          <>

        {/* LEFT COLUMN - STICKY */}
        <div className="project-info-col">
          <div className="project-info-sticky">

            <div className="info-meta-group">
              <div className="info-row">
                <div className="info-label">Prodotto</div>
                <div className="info-value text-bold uppercase">{title}</div>
              </div>

              <div className="info-row">
                 <div className="info-label">Prezzo</div>
                 <div className="info-value text-bold">€ {price.toFixed(2)}</div>
              </div>

              {description && (
                <div className="info-row">
                  <div className="info-label">Descrizione</div>
                  <div className="info-value text-description">{description}</div>
                </div>
              )}

              {extraInfo && (
                <div className="info-row">
                  <div className="info-label">Dettagli</div>
                  <div className="info-value text-description">
                     <PortableText value={extraInfo} />
                  </div>
                </div>
              )}
              
              <BuyButton product={{
                  _id: product._id,
                  title: product.title,
                  price: product.price,
                  mainImage: urlFor(product.mainImage).width(800).url(),
                  slug: product.slug
              }} textColor={textColor} />
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN - SCROLLABLE GALLERY */}
        <div className="project-gallery-col">
          {gallery && gallery.length > 0 ? (
            gallery.map((img: any, i: number) => (
              <div key={i} className="gallery-item">
                <img src={urlFor(img).width(1200).url()} alt={`Gallery ${i}`} loading="lazy" />
              </div>
            ))
          ) : (
            <div className="gallery-item">
              <img src={urlFor(product.mainImage).width(1200).url()} alt={title} />
            </div>
          )}
        </div>

          </>
        )}
      </div >

      <style>{
        `
        /* Stili dinamici basati sull'immagine */
        body {
            background-color: ${bgColor} !important;
            color: ${textColor} !important;
            transition: background-color 0.5s ease, color 0.5s ease;
        }
        .site-header, .site-footer, .header-link, .footer-link, .logo-banner, .hero-logo {
            color: ${textColor} !important;
            transition: color 0.5s ease;
        }
        .logo-banner svg, .hero-logo svg {
            color: ${textColor} !important;
        }
        .logo-banner svg path, .hero-logo svg path {
            fill: ${textColor} !important;
            transition: fill 0.5s ease;
        }
        .header-link.underline::after, .footer-link.underline::after {
            background: ${textColor} !important;
        }
        .pizza-btn {
            border-color: ${textColor} !important;
        }

        .project-page-container {
            width: 100%;
            min-height: 100vh;
            padding-top: 120px; /* Base for mobile */
            padding-bottom: 100px;
            padding-left: 10px; /* Matched to header padding */
            padding-right: 10px; /* Matched to header padding */
            
            position: relative;
            z-index: 1;
        }

        .project-layout {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }

        @media (min-width: 1024px) {
            .project-page-container {
                padding-top: 10vh; /* Raised from 30vh */
            }

            .project-layout {
                flex-direction: row;
                gap: 60px;
            }

            .project-info-col {
                width: 40%;
                flex-shrink: 0;
            }

            .project-gallery-col {
                width: 60%;
            }

            .project-info-sticky {
                position: sticky;
                top: 15vh;
            }
        }

        .info-row-main {
            display: grid;
            grid-template-columns: 140px 1fr;
            margin-bottom: 60px;
        }
        
        .info-meta-group {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .info-row {
            display: grid;
            grid-template-columns: 140px 1fr;
            align-items: baseline;
        }

        .info-label {
            font-size: 13px;
            text-transform: capitalize; 
            opacity: 0.8;
            padding-right: 10px;
        }

        .info-value {
            font-size: 13px;
        }

        .text-bold {
            font-weight: bold;
        }

        .uppercase {
            text-transform: uppercase;
        }

        .text-description {
            line-height: 1.4;
            max-width: 50ch;
            white-space: pre-line;
        }

        .gallery-item {
            margin-bottom: 20px;
        }

        .gallery-item img, .gallery-item video {
            width: 100%;
            height: auto;
            display: block;
        }
        `
      }</style>
    </div >
  );
}
