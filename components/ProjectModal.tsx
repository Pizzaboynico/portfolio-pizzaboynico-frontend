"use client";

import { useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";

const builder = imageUrlBuilder(client);
function urlFor(src: any) {
  return builder.image(src).url();
}

interface ProjectModalProps {
  project: any;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
}: ProjectModalProps) {
  // ESC per chiudere
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-inner"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={urlFor(project.mainImage)}
          alt={project.title}
          className="modal-img"
        />

        <div className="modal-caption">
          <h3>{project.title}</h3>
          {project.year && <p>{project.year}</p>}
        </div>

        {/* CHIUDI */}
        <button className="modal-close" onClick={onClose}>×</button>

        {/* PRECEDENTE */}
        <button className="modal-prev" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
          ←
        </button>

        {/* SUCCESSIVO */}
        <button className="modal-next" onClick={(e) => { e.stopPropagation(); onNext(); }}>
          →
        </button>
      </div>
    </div>
  );
}