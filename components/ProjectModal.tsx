"use client";

import { X } from "lucide-react";
import SanityImage from "./SanityImage";

interface ProjectModalProps {
  project: any | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // impedisce chiusura clic interno
      >
        {/* Chiudi */}
        <button className="modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        {/* Immagine */}
        <SanityImage
          image={project.mainImage}
          alt={project.title}
          className="modal-img"
        />

        {/* Testi */}
        <h2 className="modal-title">{project.title}</h2>

        {project.year && (
          <p className="modal-year">{project.year}</p>
        )}
      </div>
    </div>
  );
}