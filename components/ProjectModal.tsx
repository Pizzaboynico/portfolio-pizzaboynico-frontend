"use client";

export default function ProjectModal({ project, onClose }: any) {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-inner">
        <img
          src={project.mainImage?.asset?.url}
          alt={project.title}
          className="modal-img"
        />
      </div>
    </div>
  );
}