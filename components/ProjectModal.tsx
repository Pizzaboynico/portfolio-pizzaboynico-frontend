"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import SanityImage from "./SanityImage";

interface ProjectModalProps {
  project: any;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ProjectModal({ project, onClose, onPrev, onNext }: ProjectModalProps) {
  if (!project) return null;

  // KEYBOARD NAVIGATION
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          exit={{
            scale: 0.92,
            opacity: 0,
            y: 10,
            transition: {
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
        >
          <SanityImage
            image={project.mainImage}
            alt={project.title}
            className="modal-img"
            sizes="100vw"
          />

          <h2 className="modal-title">{project.title}</h2>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}