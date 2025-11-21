"use client";

import { useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";
import ProjectModal from "./ProjectModal";

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
      <div className="grid-wrapper">
        {projects.map((project, i) => (
          <div
            key={project._id}
            className={`grid-item ${
              hoverIndex !== null && hoverIndex !== i ? "faded" : ""
            }`}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => openModal(i)}
          >
            <img
              src={urlFor(project.mainImage)}
              alt={project.title}
              className="masonry-img"
            />

            {/* --- NUOVA RIGA META --- */}
            <div className="grid-meta-row">
              <span className="grid-title">
                {String(i + 1).padStart(2, "0")} {project.title}
              </span>

              {project.year && (
                <span className="grid-year">{project.year}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={closeModal}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}