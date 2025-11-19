"use client";

import { useState } from "react";
import SanityImage from "./SanityImage";
import ProjectModal from "./ProjectModal";

interface Project {
  _id: string;
  title: string;
  category?: string;
  mainImage: any;
}

interface MasonryGridProps {
  projects: Project[];
}

export default function MasonryGrid({ projects }: MasonryGridProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selected = selectedIndex !== null ? projects[selectedIndex] : null;

  const goPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : projects.length - 1));
  };

  const goNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < projects.length - 1 ? prev! + 1 : 0));
  };

  return (
    <>
      <div className="grid-wrapper">
        {projects.map((project, index) => (
          <div
            key={project._id}
            className={`grid-item ${hovered && hovered !== project._id ? "faded" : ""}`}
            onMouseEnter={() => setHovered(project._id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setSelectedIndex(index)}
          >
            <SanityImage
              image={project.mainImage}
              alt={project.title}
              className="masonry-img cursor-pointer"
            />

            <h3 className="grid-title">{project.title}</h3>

            {project.category && (
              <p className="grid-category">{project.category}</p>
            )}
          </div>
        ))}
      </div>

      <ProjectModal
        project={selected}
        onClose={() => setSelectedIndex(null)}
        onPrev={goPrev}
        onNext={goNext}
      />
    </>
  );
}