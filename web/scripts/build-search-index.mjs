
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.resolve(ROOT, "../content");
const OUT = path.join(ROOT, "public", "search");
await fs.mkdir(OUT, { recursive: true });

// --- Phase 2: стоп-слова (EN/RU) и синонимы (индекс-сторона) ---
const STOP_EN = new Set([
  "the","a","an","and","or","but","of","in","on","for","to","with","by","from","as",
  "is","are","was","were","be","been","being","it","its","this","that","these","those",
  "about","into","over","after","before","between","among","during","within","without",
  "up","down","out","very"
]);
const STOP_RU = new Set([
  "и","в","во","не","что","он","на","я","с","со","как","а","то","все","она","так","его","но","да","ты",
  "к","у","же","вы","за","бы","по","ее","мне","было","вот","от","меня","еще","нет","о","из","ему",
  "теперь","когда","даже","ну","ли","если","уже","или","ни","быть","был","него","до","вас","нибудь",
  "опять","уж","вам","ведь","там","потом","чем","без","нельзя","конечно","их","под","тогда","кто","этот"
]);
const STOP = new Set([...STOP_EN, ...STOP_RU]);

function tokenize(s) {
  // простая токенизация + фильтр стоп-слов
  return (s.toLowerCase().match(/[a-z0-9\u0400-\u04FF]+/g) ?? [])
    .filter(x => x.length > 1 && !STOP.has(x));
}

// Синонимы (ключевые единичные токены, без фраз, чтобы не «шуметь»)
// Пример: запрос "petroleum" будет находить документы с "oil" за счёт токенов индекса
const SYNONYMS = {
  oil: ["petroleum","crude"],
  petroleum: ["oil","crude"],
  crude: ["oil","petroleum"],
  ai: ["artificial","intelligence","ml","machine","learning"],
  gdp: ["gross","domestic","product"],
  mcap: ["capitalization"],            // избегаем слишком общих "market","cap"
  ev: ["electric","vehicle","vehicles"]
};

function expandSynonyms(tokens) {
  const out = new Set(tokens);
  for (const t of tokens) {
    const syn = SYNONYMS[t];
    if (syn) for (const s of syn) out.add(s);
  }
  return Array.from(out);
}

const chartsDir = path.join(CONTENT, "charts");
const files = (await fs.readdir(chartsDir)).filter(f => f.endsWith(".json"));

const items = [];
for (const f of files) {
  const obj = JSON.parse(await fs.readFile(path.join(chartsDir, f), "utf-8"));
  const m = obj.meta;
  const title = m.title || m.slug;
const baseTokens = Array.from(new Set([
    ...tokenize(title),
    ...(m.tags ?? []).flatMap(tokenize),
    ...(m.section ? tokenize(m.section) : [])
  ]));
  const tokens = Array.from(new Set(expandSynonyms(baseTokens)));
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
console.log(`[build-search-index] Wrote ${items.length} docs to /public/search/index.json (stop-words + synonyms enabled)`);
