import Link from "next/link";

import { listAllMetas, repo } from "../lib/content-snapshot";

export default async function HomePage() {
  const metas = await listAllMetas();
  const featured = metas.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)).slice(0, 6);
  const sections = (await repo.listSections()).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-semibold mb-4">Featured Charts</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((m) => (
            <Link key={m.slug} href={`/charts/${m.slug}`} className="card hover:shadow">
              <div className="text-sm opacity-70 uppercase mb-1">{m.section}</div>
              <div className="font-medium">{m.title}</div>
              <div className="text-sm opacity-70 mt-2">
                {new Date(m.publishedAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Sections</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {sections.map((s) => (
            <Link key={s.slug} href={`/sections/${s.slug}`} className="card hover:shadow">
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm opacity-80">/sections/{s.slug}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
