import { client } from "@/lib/sanity.client";
import MasonryGrid from "@/components/MasonryGrid";
import { Project } from "@/types/Project";

const PROJECTS_QUERY = `*[_type == "project"]{
  _id,
  title,
  mainImage
}`;

export default async function HomePage() {
  let projects: Project[] = [];

  try {
    projects = await client.fetch(PROJECTS_QUERY);
  } catch (err) {
    console.error("Sanity error:", err);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-10">
        <h1 className="site-title">NICOLA CORTINOVIS</h1>

        <MasonryGrid projects={projects} />
      </div>
    </main>
  );
}