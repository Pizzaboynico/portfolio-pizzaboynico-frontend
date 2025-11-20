"use client";

import { useState } from "react";
import SanityImage from "./SanityImage";
import ProjectModal from "./ProjectModal";

export default function MasonryGrid({ projects }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selected = selectedIndex !== null ? projects[selectedIndex] : null;

  return (
    <>
      <div className="grid-wrapper">
        {projects.map((project, index) => (
          <div
            key={project._id}
            className="grid-item"
            onClick={() => setSelectedIndex(index)}
          >
            <SanityImage
              image={project.mainImage}
              alt={project.title}
              className="masonry-img cursor-pointer"
            />

            <p className="grid-category">
              {String(index + 1).padStart(2, "0")}
            </p>

            <h3 className="grid-title">{project.title}</h3>

            {project.year && (
              <p className="grid-category">{project.year}</p>
            )}
          </div>
        ))}
      </div>

      <ProjectModal
        project={selected}
        onClose={() => setSelectedIndex(null)}
      />
    </>
  );
}