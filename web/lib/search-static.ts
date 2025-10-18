export interface StaticDoc {
  id: string;
  slug: string;
  title: string;
  section: string;
  tags: string[];
  kind: string;
  publishedAt: number; // unix ms
  tokens: string[];
}

export interface SearchOpts {
  q: string;
  page?: number;
  perPage?: number;
  section?: string;
  tags?: string[];
  kind?: string;
  sort?: "recent" | "relevance";
}

export interface SearchResult {
  hits: StaticDoc[];
  total: number;
  page: number;
  perPage: number;
  facets: {
    section: Record<string, number>;
    tags: Record<string, number>;
    kind: Record<string, number>;
  };
}

let cache: StaticDoc[] | null = null;

// --- Phase 2: стоп-слова и синонимы (запросная сторона) ---
const STOP_EN = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "of",
  "in",
  "on",
  "for",
  "to",
  "with",
  "by",
  "from",
  "as",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "about",
  "into",
  "over",
  "after",
  "before",
  "between",
  "among",
  "during",
  "within",
  "without",
  "up",
  "down",
  "out",
  "very",
]);
const STOP_RU = new Set([
  "и",
  "в",
  "во",
  "не",
  "что",
  "он",
  "на",
  "я",
  "с",
  "со",
  "как",
  "а",
  "то",
  "все",
  "она",
  "так",
  "его",
  "но",
  "да",
  "ты",
  "к",
  "у",
  "же",
  "вы",
  "за",
  "бы",
  "по",
  "ее",
  "мне",
  "было",
  "вот",
  "от",
  "меня",
  "еще",
  "нет",
  "о",
  "из",
  "ему",
  "теперь",
  "когда",
  "даже",
  "ну",
  "ли",
  "если",
  "уже",
  "или",
  "ни",
  "быть",
  "был",
  "него",
  "до",
  "вас",
  "нибудь",
  "опять",
  "уж",
  "вам",
  "ведь",
  "там",
  "потом",
  "чем",
  "без",
  "нельзя",
  "конечно",
  "их",
  "под",
  "тогда",
  "кто",
  "этот",
]);
const STOP = new Set<string>([...STOP_EN, ...STOP_RU]);

function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9\u0400-\u04FF]+/g) ?? []).filter(
    (x) => x.length > 1 && !STOP.has(x),
  );
}

const SYNONYMS: Record<string, string[]> = {
  oil: ["petroleum", "crude"],
  petroleum: ["oil", "crude"],
  crude: ["oil", "petroleum"],
  ai: ["artificial", "intelligence", "ml", "machine", "learning"],
  gdp: ["gross", "domestic", "product"],
  mcap: ["capitalization"],
  ev: ["electric", "vehicle", "vehicles"],
};

function expandQueryTokens(tokens: string[]): string[] {
  const out = new Set(tokens);
  for (const t of tokens) {
    const syn = SYNONYMS[t];
    if (syn) syn.forEach((s) => out.add(s));
  }
  return Array.from(out);
}

export async function loadIndex(): Promise<StaticDoc[]> {
  if (cache) return cache;
  const res = await fetch("/search/index.json", { cache: "force-cache" });
  const data = (await res.json()) as StaticDoc[];
  cache = data;
  return data;
}

export async function search(opts: SearchOpts): Promise<SearchResult> {
  const data = await loadIndex();
  const qTokens = expandQueryTokens(tokenize(opts.q || ""));
  const perPage = opts.perPage ?? 20;
  const page = Math.max(1, opts.page ?? 1);

  // Filters
  const filtered = data.filter((d) => {
    if (opts.section && d.section !== opts.section) return false;
    if (opts.kind && d.kind !== opts.kind) return false;
    if (opts.tags && opts.tags.length > 0 && !opts.tags.every((t) => d.tags.includes(t)))
      return false;
    return true;
  });

  // Scoring
  const scored = filtered
    .map((d) => {
      let score = 0;
      if (qTokens.length === 0) score = 1;
      else {
        for (const t of qTokens) {
          if (d.title.toLowerCase().includes(t)) score += 3;
          if (d.tags.some((x) => x.toLowerCase().includes(t))) score += 2;
          if (d.section.toLowerCase().includes(t)) score += 1;
          if (d.tokens.includes(t)) score += 1;
        }
      }
      return { d, score };
    })
    .filter((x) => x.score > 0 || qTokens.length === 0);

  if ((opts.sort ?? "relevance") === "recent") {
    scored.sort((a, b) => b.d.publishedAt - a.d.publishedAt);
  } else {
    scored.sort((a, b) => b.score - a.score || b.d.publishedAt - a.d.publishedAt);
  }

  const total = scored.length;
  const start = (page - 1) * perPage;
  const hits = scored.slice(start, start + perPage).map((x) => x.d);

  // Facets
  const section: Record<string, number> = {};
  const tags: Record<string, number> = {};
  const kind: Record<string, number> = {};
  for (const x of filtered) {
    section[x.section] = (section[x.section] ?? 0) + 1;
    for (const t of x.tags) tags[t] = (tags[t] ?? 0) + 1;
    kind[x.kind] = (kind[x.kind] ?? 0) + 1;
  }

  return { hits, total, page, perPage, facets: { section, tags, kind } };
}
