"use client";

import { useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";
import ProjectModal from "./ProjectModal";

const builder = imageUrlBuilder(client);
function urlFor(src: any) {
  return builder.image(src).width(800).url();
}

interface Project {
  _id: string;
  title: string;
  mainImage: any;
}

export default function MasonryGrid({ projects }: { projects: Project[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selected = selectedIndex !== null ? projects[selectedIndex] : null;

  const openModal = (index: number) => setSelectedIndex(index);

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
      <div className="masonry-grid">
        {projects.map((project, index) => (
          <div
            key={project._id}
            className="masonry-item"
            onClick={() => openModal(index)}
          >
            <img
              src={urlFor(project.mainImage)}
              alt={project.title}
            />

            <div className="meta">
              <span className="index">{String(index + 1).padStart(2, "0")}</span>
              <span className="title">{project.title}</span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ProjectModal
          project={selected}
          onClose={() => setSelectedIndex(null)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}