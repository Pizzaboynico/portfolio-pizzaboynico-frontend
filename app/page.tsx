import { client } from "../lib/sanity.client";
import SanityImage from "../components/SanityImage";

const PROJECTS_QUERY = `*[_type == "project"]{
  _id,
  title,
  slug,
  mainImage
}`;

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
}

export default async function HomePage() {
  let projects: Project[] = [];

  try {
    projects = await client.fetch(PROJECTS_QUERY);
  } catch (err) {
    console.error("Errore Sanity:", err);
  }

  if (projects.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white p-12">
        <h1 className="text-3xl font-bold">Portfolio di Nicolacortinovis</h1>
        <p className="text-gray-400 mt-4">
          Nessun progetto trovato. Pubblica documenti “project” in Sanity.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-10">NICOLA CORTINOVIS</h1>

      <div className="grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((p, i) => (
          <div key={p._id} className="group cursor-pointer">
            <div className="w-full aspect-[4/5] bg-neutral-900 rounded-md overflow-hidden flex items-center justify-center">
              {p.mainImage ? (
                <SanityImage image={p.mainImage} alt={p.title} sizes="50vw" />
              ) : (
                <span className="text-gray-500">NO IMAGE</span>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-3">{String(i + 1).padStart(3, "0")}</p>
            <h2 className="uppercase font-medium group-hover:underline">
              {p.title}
            </h2>
          </div>
        ))}
      </div>
    </main>
  );
}