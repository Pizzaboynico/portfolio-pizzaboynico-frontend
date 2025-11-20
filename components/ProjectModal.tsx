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

export default function ProjectModal({ project, onClose, onPrev, onNext }: ProjectModalProps) {
  // chiude con ESC
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
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // evita chiusura clic interno
      >
        <img
          src={urlFor(project.mainImage)}
          alt={project.title}
          className="modal-image"
        />

        <div className="modal-caption">
          <h3>{project.title}</h3>
        </div>

        <button className="modal-close" onClick={onClose}>×</button>
        <button className="modal-prev" onClick={onPrev}>←</button>
        <button className="modal-next" onClick={onNext}>→</button>
      </div>
    </div>
  );
}