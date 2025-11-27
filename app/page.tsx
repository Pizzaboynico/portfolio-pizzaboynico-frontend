"use client";

import { client } from "@/lib/sanity.client";
import MasonryGrid from "@/components/MasonryGrid";
import { useState, useEffect } from "react";

const PROJECTS_QUERY = `*[_type == "project"] {
  _id,
  title,
  mainImage
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

      {/* DEBUG DATA DUMP */}
      <div style={{ padding: 20, background: '#000', color: '#0f0', fontSize: 10, overflow: 'auto', maxHeight: 200 }}>
        <pre>{JSON.stringify(projects, null, 2)}</pre>
      </div>

      <MasonryGrid projects={projects} />
    </div>
  );
}