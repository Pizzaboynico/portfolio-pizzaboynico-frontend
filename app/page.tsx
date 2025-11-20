import { client } from "@/lib/sanity.client";
import MasonryGrid from "@/components/MasonryGrid";

const PROJECTS_QUERY = `*[_type == "project"] | order(projectNumber asc) {
  _id,
  title,
  mainImage,
  year,
  projectNumber
}`;

export default async function HomePage() {
  let projects: any[] = [];

  try {
    projects = await client.fetch(PROJECTS_QUERY);
  } catch (err) {
    console.error("Sanity error:", err);
  }

  return (
    <div className="page-content">
      {/* Griglia portfolio */}
      <MasonryGrid projects={projects} />
    </div>
  );
}