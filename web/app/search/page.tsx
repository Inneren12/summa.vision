"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import { search, type SearchResult } from "../../lib/search-static";

function useQueryParams() {
  const [params, setParams] = useState<URLSearchParams>(
    new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""),
  );
  useEffect(() => {
    const onPop = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return [
    params,
    (next: URLSearchParams) => {
      const url = `${window.location.pathname}?${next.toString()}`;
      window.history.pushState({}, "", url);
      setParams(new URLSearchParams(next));
    },
  ] as const;
}

export default function SearchPage() {
  const [params, setParams] = useQueryParams();
  const [result, setResult] = useState<SearchResult | null>(null);

  const q = params.get("q") ?? "";
  const section = params.get("section") ?? "";
  const tags = (params.get("tags") ?? "").split(",").filter(Boolean);
  const kind = params.get("kind") ?? "";
  const sort = (params.get("sort") as "recent" | "relevance") || "relevance";
  const page = Number(params.get("page") ?? "1");
  const perPage = 20;

  useEffect(() => {
    search({
      q,
      section: section || undefined,
      tags: tags.length ? tags : undefined,
      kind: kind || undefined,
      sort,
      page,
      perPage,
    }).then(setResult);
  }, [q, section, tags.join(","), kind, sort, page]);

  function update(name: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value) next.delete(name);
    else next.set(name, value);
    next.delete("page"); // reset page
    setParams(next);
  }
  function toggleTag(tag: string) {
    const next = new URLSearchParams(params);
    const cur = (next.get("tags") ?? "").split(",").filter(Boolean);
    const has = cur.includes(tag);
    const updated = has ? cur.filter((t) => t !== tag) : [...cur, tag];
    if (updated.length) next.set("tags", updated.join(","));
    else next.delete("tags");
    next.delete("page");
    setParams(next);
  }
  function goto(n: number) {
    const next = new URLSearchParams(params);
    if (n <= 1) next.delete("page");
    else next.set("page", String(n));
    setParams(next);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Search</h1>

      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <input
          className="px-3 py-2 rounded border w-full md:w-2/3"
          placeholder="Search charts…"
          defaultValue={q}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
          }}
        />
        <select
          className="px-3 py-2 rounded border"
          value={sort}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="recent">Most recent</option>
        </select>
        <button
          className="px-3 py-2 rounded border"
          onClick={() => {
            const input = document.querySelector(
              "input[placeholder='Search charts…']",
            ) as HTMLInputElement;
            update("q", input?.value || "");
          }}
        >
          Search
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-4">
          <div className="card">
            <div className="font-semibold mb-2">Section</div>
            <select
              className="w-full px-2 py-2 rounded border"
              value={section}
              onChange={(e) => update("section", e.target.value)}
            >
              <option value="">All</option>
              {Object.entries(result?.facets.section ?? {}).map(([k, c]) => (
                <option key={k} value={k}>
                  {k} ({c})
                </option>
              ))}
            </select>
          </div>
          <div className="card">
            <div className="font-semibold mb-2">Kind</div>
            <select
              className="w-full px-2 py-2 rounded border"
              value={kind}
              onChange={(e) => update("kind", e.target.value)}
            >
              <option value="">All</option>
              {Object.entries(result?.facets.kind ?? {}).map(([k, c]) => (
                <option key={k} value={k}>
                  {k} ({c})
                </option>
              ))}
            </select>
          </div>
          <div className="card">
            <div className="font-semibold mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(result?.facets.tags ?? {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 12)
                .map(([k, c]) => {
                  const active = tags.includes(k);
                  return (
                    <button
                      key={k}
                      onClick={() => toggleTag(k)}
                      className={
                        "text-sm px-2 py-1 rounded border " + (active ? "bg-white/10" : "")
                      }
                      title={`${c} results`}
                    >
                      {k}
                    </button>
                  );
                })}
            </div>
          </div>
        </aside>

        <section className="md:col-span-3 space-y-4">
          {!result ? (
            <div>Loading…</div>
          ) : (
            <>
              <div className="opacity-80 text-sm">{result.total} results</div>
              <div className="grid md:grid-cols-2 gap-4">
                {result.hits.map((m) => (
                  <Link key={m.slug} href={`/charts/${m.slug}`} className="card hover:shadow">
                    <div className="text-sm uppercase opacity-70 mb-1">{m.section}</div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-sm opacity-70 mt-2">
                      {new Date(m.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs opacity-70 mt-2">{m.tags.join(", ")}</div>
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded border"
                  disabled={result.page <= 1}
                  onClick={() => goto(result.page - 1)}
                >
                  Prev
                </button>
                <div className="opacity-80 text-sm">
                  Page {result.page} / {Math.max(1, Math.ceil(result.total / result.perPage))}
                </div>
                <button
                  className="px-3 py-1 rounded border"
                  disabled={result.page * result.perPage >= result.total}
                  onClick={() => goto(result.page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
