"use client";

import { useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";
import ProjectModal from "./ProjectModal";
import { motion, AnimatePresence, Variants } from "framer-motion";

const builder = imageUrlBuilder(client);
function urlFor(src: any) {
  return builder.image(src).url();
}

interface Project {
  _id: string;
  title: string;
  year?: string;
  mainImage: any;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
};

export default function MasonryGrid({ projects }: { projects: Project[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedProject =
    selectedIndex !== null ? projects[selectedIndex] : null;

  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const goPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev! > 0 ? prev! - 1 : projects.length - 1
    );
  };

  const goNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev! < projects.length - 1 ? prev! + 1 : 0
    );
  };

  return (
    <>
      <motion.div
        className="grid-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {projects.map((project, i) => (
          <motion.div
            key={project._id}
            variants={itemVariants}
            className={`grid-item ${hoverIndex !== null && hoverIndex !== i ? "faded" : ""
              }`}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => openModal(i)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.img
              src={urlFor(project.mainImage)}
              alt={project.title}
              className="masonry-img"
              layoutId={`image-${project._id}`}
            />

            <div className="grid-meta-row">
              <span className="grid-title">
                {String(i + 1).padStart(2, "0")} {project.title}
              </span>

              {project.year && (
                <span className="grid-year">{project.year}</span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={closeModal}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </>
  );
}