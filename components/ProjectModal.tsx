"use client";

import { useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";
import { motion } from "framer-motion";

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
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="modal-inner"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Left: description (editable in Sanity) */}
        <div className="modal-desc">
          {(() => {
            // handle multiple possible fields in Sanity
            const raw = project?.descrizioneBreve || project?.description;
            if (raw) return <div dangerouslySetInnerHTML={{ __html: raw }} />;

            // if _rawDescrizioneBreve is portable text, try a simple join of children text
            const rawPortable = project?._rawDescrizioneBreve;
            if (Array.isArray(rawPortable)) {
              const text = rawPortable
                .map((block: any) => (block.children || []).map((c: any) => c.text).join(''))
                .join('\n');
              return <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>;
            }

            return <p className="text-gray-300">No description provided.</p>;
          })()}
        </div>

        {/* Center: image */}
        <div className="modal-image-wrap">
          {/* Video support: if mainVideo exists, render <video> */}
          {project?.mainVideo ? (
            <video
              className="modal-img"
              controls
              src={urlFor(project.mainVideo)}
            />
          ) : (
            <motion.img
              src={urlFor(project.mainImage)}
              alt={project.title}
              className="modal-img"
              loading="lazy"
              layoutId={`image-${project._id}`}
            />
          )}
        </div>

        {/* Right: label — compact, vertically centered */}
        <div className="modal-label">
          <div>
            {project?.projectNumber ? (
              <div className="text-xs opacity-80">{project.projectNumber}</div>
            ) : null}
            <div className="text-sm tracking-widest uppercase">{project.title}</div>
          </div>
        </div>

        {/* 🔥 Manteniamo solo il bottone close visibile */}
        <button className="modal-close" onClick={onClose}>×</button>

        {/* 🔥 NESSUN BOTTONE PREV/NEXT VISIBILE */}
      </motion.div>
    </motion.div>
  );
}