"use client";

import { useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";

const builder = imageUrlBuilder(client);
const urlFor = (src: any) => builder.image(src).url();

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
  
  // ESC to close
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

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

        <button className="modal-close" onClick={onClose}>×</button>
        <button className="modal-prev" onClick={onPrev}>←</button>
        <button className="modal-next" onClick={onNext}>→</button>

      </div>
    </div>
  );
}