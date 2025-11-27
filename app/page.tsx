"use client";

import { client } from "@/lib/sanity.client";
import MasonryGrid from "@/components/MasonryGrid";
import ListView from "@/components/ListView";
import FilterBar from "@/components/FilterBar";
import { useState, useEffect, useMemo } from "react";

const PROJECTS_QUERY = `*[_type == "project"] | order(projectNumber asc) {
  _id,
  title,
  mainImage,
  year,
  projectNumber,
  assetName
}`;

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    client.fetch(PROJECTS_QUERY).then(setProjects).catch(console.error);
  }, []);

  // Extract unique years
  const years = useMemo(() => {
    const allYears = projects.map((p) => p.year).filter(Boolean);
    return Array.from(new Set(allYears)).sort().reverse() as string[];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.assetName &&
          project.assetName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesYear =
        selectedYear === "all" || project.year === selectedYear;

      return matchesSearch && matchesYear;
    });
  }, [projects, searchQuery, selectedYear]);

  return (
    <div className="page-content">
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        viewMode={viewMode}
        setViewMode={setViewMode}
        years={years}
      />

      {viewMode === "grid" ? (
        <MasonryGrid projects={filteredProjects} />
      ) : (
        <ListView projects={filteredProjects} />
      )}
    </div>
  );
}