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

  // 🔥 Keybindings: ESC, freccia SX, freccia DX
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        <img
          src={urlFor(project.mainImage)}
          alt={project.title}
          className="modal-img"
        />

        <div className="modal-caption">
          <h3>{project.title}</h3>
        </div>

        {/* 🔥 Manteniamo solo il bottone close visibile */}
        <button className="modal-close" onClick={onClose}>×</button>

        {/* 🔥 NESSUN BOTTONE PREV/NEXT VISIBILE */}
      </div>
    </div>
  );
}