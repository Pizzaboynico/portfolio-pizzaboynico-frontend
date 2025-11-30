"use client";

import { client } from "@/lib/sanity.client";
import MasonryGrid from "@/components/MasonryGrid";
import { useState, useEffect } from "react";

const PROJECTS_QUERY = `*[_type == "project"] {
  _id,
  title,
  slug,
  projectNumber,
  descrizioneBreve,
  mainImage,
  mainVideo
}`;

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    client.fetch(PROJECTS_QUERY).then(setProjects).catch(console.error);
  }, []);

  return (
    <div className="page-content">
      <MasonryGrid projects={projects} />
    </div>
  );
}