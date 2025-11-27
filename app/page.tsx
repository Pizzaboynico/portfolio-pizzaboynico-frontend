"use client";

import { client } from "@/lib/sanity.client";
import MasonryGrid from "@/components/MasonryGrid";
import HeroHeader from "@/components/HeroHeader";
import { useState, useEffect } from "react";

const PROJECTS_QUERY = `*[_type == "project"] {
  _id,
  title,
  mainImage
}`;

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    client.fetch(PROJECTS_QUERY).then(setProjects).catch(console.error);
  }, []);

  return (
    <div className="page-content">
      <HeroHeader />
      <MasonryGrid projects={projects} />
    </div>
  );
}