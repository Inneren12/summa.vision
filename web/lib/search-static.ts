
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

function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9Ѐ-ӿ]+/g) ?? []).filter(x => x.length > 1);
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
  const qTokens = tokenize(opts.q || "");
  const perPage = opts.perPage ?? 20;
  const page = Math.max(1, opts.page ?? 1);

  // Filters
  let filtered = data.filter(d => {
    if (opts.section && d.section !== opts.section) return false;
    if (opts.kind && d.kind !== opts.kind) return false;
    if (opts.tags && opts.tags.length > 0 && !opts.tags.every(t => d.tags.includes(t))) return false;
    return true;
  });

  // Scoring
  const scored = filtered.map(d => {
    let score = 0;
    if (qTokens.length === 0) score = 1;
    else {
      for (const t of qTokens) {
        if (d.title.toLowerCase().includes(t)) score += 3;
        if (d.tags.some(x => x.toLowerCase().includes(t))) score += 2;
        if (d.section.toLowerCase().includes(t)) score += 1;
        if (d.tokens.includes(t)) score += 1;
      }
    }
    return { d, score };
  }).filter(x => x.score > 0 || qTokens.length === 0);

  if ((opts.sort ?? "relevance") === "recent") {
    scored.sort((a, b) => b.d.publishedAt - a.d.publishedAt);
  } else {
    scored.sort((a, b) => b.score - a.score || b.d.publishedAt - a.d.publishedAt);
  }

  const total = scored.length;
  const start = (page - 1) * perPage;
  const hits = scored.slice(start, start + perPage).map(x => x.d);

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
