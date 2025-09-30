
import { repo } from "../../../lib/content-snapshot";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const secs = await repo.listSections();
  return secs.map(s => ({ slug: s.slug }));
}

export default async function SectionPage({ params }: { params: { slug: string } }) {
  const secs = await repo.listSections();
  if (!secs.some(s => s.slug === params.slug)) return notFound();

  const charts = await repo.listChartsBySection(params.slug);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold capitalize">{params.slug}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {charts.map(m => (
          <Link key={m.slug} href={`/charts/${m.slug}`} className="card hover:shadow">
            <div className="font-medium">{m.title}</div>
            <div className="text-sm opacity-70 mt-1">
              {new Date(m.publishedAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
