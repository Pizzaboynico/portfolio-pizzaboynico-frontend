"use client";

import { motion, AnimatePresence } from "framer-motion";
import SanityImage from "./SanityImage";

interface Project {
  _id: string;
  title: string;
  mainImage: any;
  year?: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onPrev: () => void;  // ✅ AGGIUNTO
  onNext: () => void;  // ✅ AGGIUNTO
}

export default function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext
}: ProjectModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Freccia Prev */}
            <button className="modal-prev" onClick={onPrev}>
              ←
            </button>

            {/* Immagine */}
            <SanityImage
              image={project.mainImage}
              alt={project.title}
              className="modal-img"
            />

            {/* Freccia Next */}
            <button className="modal-next" onClick={onNext}>
              →
            </button>

            {/* Info */}
            <h2 className="modal-title">{project.title}</h2>
            {project.year && <p className="modal-year">{project.year}</p>}

            {/* Close */}
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}