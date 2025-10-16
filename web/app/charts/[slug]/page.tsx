import { repo, listAllMetas } from "../../../lib/content-snapshot";
import ChartView from "../../../components/ChartView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateStaticParams() {
  const metas = await listAllMetas();
  return metas.map(m => ({ slug: m.slug }));
}

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const res = await repo.getChart(params.slug);
  if (!res) return {};
  const { meta } = res;
  const og = `/og/${meta.slug}.svg`;
  return {
    title: meta.title,
    description: meta.subtitle ?? `${meta.section} — chart`,
    openGraph: {
      title: meta.title,
      description: meta.subtitle ?? undefined,
      images: [og, "/og/default.svg"],
      type: "article"
    }
  };
}

export default async function ChartPage({ params }: Params) {
  const result = await repo.getChart(params.slug);
  if (!result) return notFound();
  const { meta, data } = result;

  // related by tags: naive overlap, exclude self
  const all = await listAllMetas();
  const tags = new Set(meta.tags ?? []);
  const related = all
    .filter(m => m.slug !== meta.slug)
    .map(m => ({ m, score: (m.tags ?? []).filter(t => tags.has(t)).length }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.m.publishedAt < b.m.publishedAt ? 1 : -1))
    .slice(0, 3)
    .map(x => x.m);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase opacity-70">
          <Link href={`/sections/${meta.section}`}>{meta.section}</Link>
        </div>
        <h1 className="text-3xl font-semibold">{meta.title}</h1>
        {meta.subtitle ? <p className="opacity-80 mt-1">{meta.subtitle}</p> : null}
      </div>
      <ChartView meta={meta} data={data} />
      {meta.sources && meta.sources.length > 0 && (
        <div className="text-sm opacity-80">Sources: {meta.sources.join(", ")}</div>
      )}
      {related.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Related</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {related.map(r => (
              <Link key={r.slug} href={`/charts/${r.slug}`} className="card hover:shadow">
                <div className="text-sm uppercase opacity-70">{r.section}</div>
                <div className="font-medium">{r.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
