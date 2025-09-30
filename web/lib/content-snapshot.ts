
import { promises as fs } from "node:fs";
import path from "node:path";
import { ChartKind, type ChartMeta, type ChartData } from "@core/models/Chart";

const CONTENT_DIR = path.resolve(process.cwd(), "../content");

type RawMeta = Omit<ChartMeta, "kind"> & { kind: keyof typeof ChartKind };

async function readJSON<T>(p: string): Promise<T> {
  const raw = await fs.readFile(p, "utf-8");
  return JSON.parse(raw) as T;
}

export async function listAllMetas(): Promise<ChartMeta[]> {
  const dir = path.join(CONTENT_DIR, "charts");
  const files = await fs.readdir(dir);
  const metas: ChartMeta[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const obj = await readJSON<{ meta: RawMeta }>(path.join(dir, f));
    metas.push({ ...obj.meta, kind: ChartKind[obj.meta.kind] });
  }
  return metas;
}

async function readAllCharts() {
  const dir = path.join(CONTENT_DIR, "charts");
  const files = await fs.readdir(dir);
  const items: { meta: ChartMeta; data: ChartData }[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const obj = await readJSON<{ meta: RawMeta; data: ChartData }>(path.join(dir, f));
    items.push({ meta: { ...obj.meta, kind: ChartKind[obj.meta.kind] }, data: obj.data });
  }
  return items;
}

export const repo = {
  async getChart(slug: string) {
    const items = await readAllCharts();
    const it = items.find(x => x.meta.slug === slug);
    return it ?? null;
  },
  async listChartsBySection(section: string, limit?: number) {
    const items = await readAllCharts();
    const filtered = items.map(x => x.meta).filter(m => m.section === section);
    filtered.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  },
  async listSections() {
    return await readJSON<{ slug: string; title: string; order: number }[]>(path.join(CONTENT_DIR, "sections.json"));
  }
};
