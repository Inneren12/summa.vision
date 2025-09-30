
// Optional placeholder: generate a simple SVG OG per chart title without extra deps.
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.resolve(ROOT, "../content");
const OUTDIR = path.join(ROOT, "public", "og");
await fs.mkdir(OUTDIR, { recursive: true });

const chartsDir = path.join(CONTENT, "charts");
const files = (await fs.readdir(chartsDir)).filter(f => f.endsWith(".json"));

function svgFor(title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="60" y="330" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#fff">${title.replace(/&/g,"&amp;")}</text>
  <text x="60" y="560" font-family="Arial, sans-serif" font-size="28" fill="#fff" opacity="0.85">summa.vision</text>
</svg>`;
}

for (const f of files) {
  const obj = JSON.parse(await fs.readFile(path.join(chartsDir, f), "utf-8"));
  const slug = obj.meta.slug;
  const title = obj.meta.title || slug;
  await fs.writeFile(path.join(OUTDIR, `${slug}.svg`), svgFor(title), "utf-8");
}
console.log(`[build-og] Wrote ${files.length} SVGs to /public/og/*.svg`);
