
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.resolve(ROOT, "../content");
const OUT = path.join(ROOT, "public", "search");
await fs.mkdir(OUT, { recursive: true });

function tokenize(s) {
  return (s.toLowerCase().match(/[a-z0-9\u0400-\u04FF]+/g) ?? []).filter(x => x.length > 1);
}

const chartsDir = path.join(CONTENT, "charts");
const files = (await fs.readdir(chartsDir)).filter(f => f.endsWith(".json"));

const items = [];
for (const f of files) {
  const obj = JSON.parse(await fs.readFile(path.join(chartsDir, f), "utf-8"));
  const m = obj.meta;
  const title = m.title || m.slug;
  const tokens = Array.from(new Set([
    ...tokenize(title),
    ...(m.tags ?? []).flatMap(tokenize),
    ...(m.section ? tokenize(m.section) : [])
  ]));
  items.push({
    id: m.slug,
    slug: m.slug,
    title,
    section: m.section,
    tags: m.tags ?? [],
    kind: m.kind,
    publishedAt: Date.parse(m.publishedAt || "1970-01-01"),
    tokens
  });
}

await fs.writeFile(path.join(OUT, "index.json"), JSON.stringify(items, null, 2), "utf-8");
console.log(`[build-search-index] Wrote ${items.length} docs to /public/search/index.json`);
