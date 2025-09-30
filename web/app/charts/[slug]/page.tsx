
import { repo, listAllMetas } from "../../../lib/content-snapshot";
import ChartView from "../../../components/ChartView";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const metas = await listAllMetas();
  return metas.map(m => ({ slug: m.slug }));
}

export default async function ChartPage({ params }: { params: { slug: string } }) {
  const result = await repo.getChart(params.slug);
  if (!result) return notFound();
  const { meta, data } = result;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase opacity-70">{meta.section}</div>
        <h1 className="text-3xl font-semibold">{meta.title}</h1>
        {meta.subtitle ? <p className="opacity-80 mt-1">{meta.subtitle}</p> : null}
      </div>
      <ChartView meta={meta} data={data} />
      {meta.sources && meta.sources.length > 0 && (
        <div className="text-sm opacity-80">Sources: {meta.sources.join(", ")}</div>
      )}
    </div>
  );
}
