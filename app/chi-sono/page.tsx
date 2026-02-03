import { client } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";
import Image from "next/image";

// Reusing the same layout structure as project page
// Left column: Title + Description
// Right column: Gallery

const BIO_QUERY = `
  *[_type == "bio"][0] {
    title,
    description,
    email,
    gallery
  }
`;

export default async function BioPage() {
    const bio = await client.fetch(BIO_QUERY, {}, { next: { revalidate: 60 } });

    if (!bio) {
        return (
            <div className="project-page-container" style={{ padding: '20vh 20px', textAlign: 'center' }}>
                <h1 className="text-4xl font-bold uppercase">Contenuto non trovato</h1>
                <p className="mt-4">Assicurati di aver creato un documento "Bio" nel CMS.</p>
            </div>
        );
    }

    const { title, description, gallery } = bio;

    return (
        <div className="project-page-container">
            <div className="project-layout">

                {/* LEFT COLUMN - Sticky Info */}
                <div className="project-info-col">
                    <div className="project-info-sticky">
                        <div className="info-meta-group">
                            <div className="info-row">
                                <div className="info-label">Pagina</div>
                                <div className="info-value text-bold uppercase">{title || "Chi Sono"}</div>
                            </div>

                            {description && (
                                <div className="info-row">
                                    <div className="info-label">Bio</div>
                                    <div className="info-value text-description" style={{ whiteSpace: 'pre-wrap' }}>{description}</div>
                                </div>
                            )}

                            {email && (
                                <div className="info-row">
                                    <div className="info-label">Contatti</div>
                                    <div className="info-value">
                                        <a href={`mailto:${email}`} className="underline hover:opacity-70 transition-opacity">
                                            {email}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Gallery */}
                <div className="project-gallery-col">
                    {gallery && gallery.length > 0 ? (
                        <div className="gallery-grid">
                            {gallery.map((image: any, index: number) => (
                                <div key={index} className="gallery-item">
                                    <Image
                                        src={urlFor(image).url()}
                                        alt={`Bio Image ${index + 1}`}
                                        width={1920}
                                        height={1080}
                                        className="gallery-image"
                                        unoptimized
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-gallery">
                            <p className="text-gray-500">Nessuna immagine nella galleria.</p>
                        </div>
                    )}
                </div>

            </div>

            <style>{`
        /* Reusing Project Page Styles */
        .project-page-container {
            width: 100%;
            min-height: 100vh;
            padding-top: 120px; /* Mobile base */
            padding-bottom: 100px;
            padding-left: 10px;
            padding-right: 10px;
            
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
                padding-top: 10vh; /* Consistent with project page */
            }

            .project-layout {
                flex-direction: row;
                align-items: flex-start;
                gap: 0;
            }

            .project-info-col {
                width: 33.333%;
                padding-right: 40px;
                position: relative;
            }

            .project-info-sticky {
                position: sticky;
                top: 15vh; 
            }

            .project-gallery-col {
                width: 66.666%;
            }
        }

        .info-meta-group {
            display: flex;
            flex-direction: column;
            gap: 32px;
        }

        .info-row {
            display: grid;
            grid-template-columns: 100px 1fr;
            gap: 20px;
            font-size: 11px;
            text-transform: uppercase;
            line-height: 1.4;
        }

        .info-label {
            opacity: 0.5;
        }

        .text-bold {
            font-weight: 700;
        }

        .text-description {
            max-width: 600px;
        }

        .gallery-grid {
            display: flex;
            flex-direction: column;
            gap: 20px; /* Reduced gap between images */
        }

        .gallery-item {
            width: 100%;
        }

        .gallery-image {
            width: 100%;
            height: auto;
            display: block;
        }

        @media (max-width: 768px) {
            .info-row {
               grid-template-columns: 80px 1fr;
               gap: 10px;
            }
        }
      `}</style>
        </div>
    );
}
