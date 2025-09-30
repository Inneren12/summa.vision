
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.resolve(ROOT, "../content");
const PUB = path.join(ROOT, "public");
await fs.mkdir(PUB, { recursive: true });

const base = "https://summa.vision";

const sections = JSON.parse(await fs.readFile(path.join(CONTENT, "sections.json"), "utf-8"));
const chartsDir = path.join(CONTENT, "charts");
const files = (await fs.readdir(chartsDir)).filter(f => f.endsWith(".json"));
const chartSlugs = [];
for (const f of files) {
  const obj = JSON.parse(await fs.readFile(path.join(chartsDir, f), "utf-8"));
  chartSlugs.push(obj.meta.slug);
}

const urls = [
  "/", "/about", "/media-kit",
  ...sections.map(s => `/sections/${s.slug}`),
  ...chartSlugs.map(slug => `/charts/${slug}`)
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${base}${u}</loc></url>`).join("\n")}
</urlset>`;

await fs.writeFile(path.join(PUB, "sitemap.xml"), xml, "utf-8");
console.log(`[build-sitemap] Wrote ${urls.length} URLs to /public/sitemap.xml`);
