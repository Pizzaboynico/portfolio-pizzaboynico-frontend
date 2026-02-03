import { client } from "@/lib/sanity.client";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { notFound } from "next/navigation";

const builder = imageUrlBuilder(client);
function urlFor(src: any) {
  return builder.image(src);
}

// Revalidate every 60 seconds (or 0 for on-request)
export const revalidate = 60;

const PROJECT_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    projectNumber,
    description,
    studio,
    client,
    year,
    technologies,
    service,
    extraInfo,
    mainImage,
    mainVideo,
    gallery,
    customLabel
  }
`;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await client.fetch(PROJECT_QUERY, { slug });

  if (!project) {
    notFound();
  }

  const { title, description, service, year, extraInfo, gallery, customLabel } = project;

  return (
    <div className="project-page-container">

      {/* 
        Layout: 
        We use a flex/grid layout. 
        On Desktop: Left col (Sticky), Right col (Scrollable) 
        On Mobile: Stacked
      */}
      <div className="project-layout">

        {/* LEFT COLUMN - STICKY */}
        <div className="project-info-col">
          <div className="project-info-sticky">

            <div className="info-meta-group">
              <div className="info-row">
                <div className="info-label">{customLabel || "Nome Progetto"}</div>
                <div className="info-value text-bold uppercase">{title}</div>
              </div>

              {description && (
                <div className="info-row">
                  <div className="info-label">Descrizione</div>
                  <div className="info-value text-description">{description}</div>
                </div>
              )}

              {service && (
                <div className="info-row">
                  <div className="info-label">Servizio</div>
                  <div className="info-value">{service}</div>
                </div>
              )}

              {year && (
                <div className="info-row">
                  <div className="info-label">Anno</div>
                  <div className="info-value">{year}</div>
                </div>
              )}

              {extraInfo && (
                <div className="info-row">
                  <div className="info-label">Info</div>
                  <div className="info-value text-description">{extraInfo}</div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN - SCROLLABLE GALLERY */}
        <div className="project-gallery-col">
          {/* If there's a gallery, render it. If not, maybe show main image? */}
          {gallery && gallery.length > 0 ? (
            gallery.map((img: any, i: number) => (
              <div key={i} className="gallery-item">
                <img src={urlFor(img).width(1200).url()} alt={`Gallery ${i}`} loading="lazy" />
              </div>
            ))
          ) : (
            /* Fallback if no gallery: show main image/video */
            <div className="gallery-item">
              {project.mainVideo ? (
                <video src={project.mainVideo.asset?.url} controls className="gallery-video" />
              ) : (
                <img src={urlFor(project.mainImage).width(1200).url()} alt={title} />
              )}
            </div>
          )}
        </div>

      </div >

      <style>{
        `
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
