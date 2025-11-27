"use client";

import { client } from "@/lib/sanity.client";
import MasonryGrid from "@/components/MasonryGrid";
import { useState, useEffect } from "react";

const PROJECTS_QUERY = `*[_type == "project"] {
  _id,
  title,
  mainImage,
  year,
  projectNumber
}`;

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(PROJECTS_QUERY)
      .then((data) => {
        console.log("Data fetched:", data);
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Sanity error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-content">
      {loading && <div style={{ padding: 20 }}>Loading projects...</div>}
      {error && <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>}
      {!loading && !error && projects.length === 0 && (
        <div style={{ padding: 20 }}>No projects found.</div>
      )}
      <MasonryGrid projects={projects} />
    </div>
  );
}