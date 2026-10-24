import { useEffect, useMemo, useState } from "react";
import { Headphones, Search, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORIES, CONCEPTS, collectCitations, getCategory } from "../content";
import type { CategoryId, Concept, Level } from "../content/types";
import { searchConcepts } from "../lib/search";
import { CategoryTag, EmptyState, LevelTag } from "../components/ui";
import { CATEGORY_STYLES } from "../components/category";
import { useSearch } from "../components/SearchDialog";

const LEVELS: Level[] = ["基础", "进阶", "高级"];

function ConceptRow({ concept, index }: { concept: Concept; index: number }) {
  const citations = collectCitations(concept).length;
  const style = CATEGORY_STYLES[concept.category];
  return (
    <li className="border-b border-line last:border-b-0">
      <Link
        to={`/theory/${concept.slug}`}
        className="group grid grid-cols-1 gap-3 px-4 py-4 transition-colors hover:bg-paper-2 sm:px-5 md:grid-cols-[64px_minmax(0,1.1fr)_minmax(0,1fr)_auto] md:items-center"
      >
        <div className="flex items-center gap-2 md:block">
          <span className="mono-label text-muted">{concept.number}</span>
          <span className={`ml-2 inline-block h-2 w-2 md:hidden ${style.dot}`} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug group-hover:text-cobalt-ink sm:text-base">
            {concept.title}
          </p>
          <p className="mono-label mt-1 text-[0.6rem] text-muted">{concept.titleEn}</p>
        </div>
        <p className="min-w-0 truncate text-xs leading-relaxed text-muted sm:text-sm">
          {concept.summary}
        </p>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <LevelTag level={concept.level} />
          <span className="mono-label text-muted">{citations} REF</span>
          {concept.examples.length > 0 ? (
            <span className="mono-label inline-flex items-center gap-1 text-cobalt-ink">
              <Headphones size={11} aria-hidden />
              {concept.examples.length}
            </span>
          ) : null}
          <span className="mono-label ml-auto text-muted md:hidden">OPEN →</span>
        </div>
        <span className="sr-only">第 {index + 1} 条，打开 {concept.title}</span>
      </Link>
    </li>
  );
}

export function Library() {
  const [params, setParams] = useSearchParams();
  const { openSearch } = useSearch();
  const initialQuery = params.get("q") ?? "";
  const initialCategory = (params.get("category") as CategoryId | null) ?? "all";
  const initialLevel = (params.get("level") as Level | null) ?? "all";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryId | "all">(initialCategory);
  const [level, setLevel] = useState<Level | "all">(initialLevel);

  useEffect(() => {
    setQuery(params.get("q") ?? "");
    setCategory((params.get("category") as CategoryId | null) ?? "all");
    setLevel((params.get("level") as Level | null) ?? "all");
  }, [params]);

  const updateParams = (next: {
    q?: string;
    category?: CategoryId | "all";
    level?: Level | "all";
  }) => {
    const searchParams = new URLSearchParams(params);
    const nextQuery = next.q ?? query;
    const nextCategory = next.category ?? category;
    const nextLevel = next.level ?? level;
    if (nextQuery.trim()) searchParams.set("q", nextQuery);
    else searchParams.delete("q");
    if (nextCategory !== "all") searchParams.set("category", nextCategory);
    else searchParams.delete("category");
    if (nextLevel !== "all") searchParams.set("level", nextLevel);
    else searchParams.delete("level");
    setParams(searchParams, { replace: true });
  };

  const filtered = useMemo(() => {
    if (query.trim()) {
      return searchConcepts(query, {
        category: category === "all" ? undefined : category,
        level: level === "all" ? undefined : level,
        limit: 40,
      }).map((hit) => hit.concept);
    }
    return CONCEPTS.filter((concept) => {
      if (category !== "all" && concept.category !== category) return false;
      if (level !== "all" && concept.level !== level) return false;
      return true;
    });
  }, [query, category, level]);

  const grouped = query.trim() === "" && category === "all";
  const isFiltered = query.trim() !== "" || category !== "all" || level !== "all";

  const reset = () => {
    setQuery("");
    setCategory("all");
    setLevel("all");
    setParams(new URLSearchParams(), { replace: true });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 sm:px-8 sm:pt-8 xl:px-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="mono-label text-muted">LIBRARY / 知识库</p>
          <h1 className="zh-display mt-2 text-4xl sm:text-5xl">{CONCEPTS.length} 个概念，按需取用</h1>
          <p className="reading-column mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">
            按分类、级别、标签或正文检索。每条概念都带可听谱例、章节级引用与复习卡；列表中的 REF 是本章引用条数。
          </p>
        </div>
        <button
          type="button"
          onClick={openSearch}
          className="mono-label inline-flex items-center gap-2 border border-ink/40 px-3 py-2 text-muted transition-colors hover:bg-ink hover:text-paper"
        >
          <Search size={13} aria-hidden />
          全局检索 ⌘K
        </button>
      </div>

      <div className="sticky top-14 z-20 -mx-4 mt-4 border-b border-line bg-paper px-4 pb-3 pt-3 sm:-mx-8 sm:px-8 lg:top-0 xl:-mx-12 xl:px-12">
        <div className="flex items-center gap-3 border border-ink/25 bg-paper px-3 py-2.5 focus-within:border-cobalt">
          <Search size={16} className="shrink-0 text-cobalt-ink" aria-hidden />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              updateParams({ q: event.target.value });
            }}
            placeholder="在当前知识库中检索：五度圈、ii-V-I、tritone…"
            aria-label="知识库检索"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted sm:text-base"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                updateParams({ q: "" });
              }}
              aria-label="清除检索"
              className="text-muted hover:text-ink"
            >
              <X size={15} />
            </button>
          ) : null}
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-label mr-1 text-muted">CATEGORY</span>
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                updateParams({ category: "all" });
              }}
              className={`mono-label border px-2.5 py-1.5 ${
                category === "all"
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
              }`}
            >
              全部
            </button>
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCategory(item.id);
                  updateParams({ category: item.id });
                }}
                className={`mono-label border px-2.5 py-1.5 ${
                  category === item.id
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
                }`}
              >
                <span className={`mr-1.5 inline-block h-1.5 w-1.5 ${CATEGORY_STYLES[item.id].dot}`} aria-hidden />
                {item.name}
              </button>
            ))}
            {isFiltered ? (
              <button
                type="button"
                onClick={reset}
                className="mono-label ml-auto text-cobalt-ink hover:text-ink"
              >
                重置筛选
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-label mr-1 text-muted">LEVEL</span>
            <button
              type="button"
              onClick={() => {
                setLevel("all");
                updateParams({ level: "all" });
              }}
              className={`mono-label border px-2.5 py-1.5 ${
                level === "all"
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
              }`}
            >
              全部
            </button>
            {LEVELS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setLevel(item);
                  updateParams({ level: item });
                }}
                className={`mono-label border px-2.5 py-1.5 ${
                  level === item
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="mono-label text-muted">
          {filtered.length.toString().padStart(2, "0")} RESULTS
          {query.trim() ? ` / “${query.trim()}”` : ""}
        </p>
        <p className="mono-label hidden text-muted sm:block">SORT / CATALOG ORDER</p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="没有匹配的概念"
            body="试试更短的中文词、英文术语或和弦记号；也可以重置筛选回到完整目录。"
            action={
              <button
                type="button"
                onClick={reset}
                className="mono-label border border-ink px-3 py-2 hover:bg-ink hover:text-paper"
              >
                重置筛选
              </button>
            }
          />
        </div>
      ) : grouped ? (
        <div className="mt-3 space-y-8">
          {CATEGORIES.map((categoryMeta) => {
            const items = filtered.filter((concept) => concept.category === categoryMeta.id);
            if (items.length === 0) return null;
            return (
              <section key={categoryMeta.id}>
                <div className="flex items-end justify-between border-b-2 border-ink pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-3 w-3 ${CATEGORY_STYLES[categoryMeta.id].dot}`} aria-hidden />
                    <h2 className="text-lg font-semibold">{categoryMeta.name}</h2>
                    <CategoryTag category={categoryMeta.id} variant="dot" />
                  </div>
                  <span className="mono-label text-muted">{items.length} ENTRIES</span>
                </div>
                <ul className="border-x border-b border-line">
                  {items.map((concept, index) => (
                    <ConceptRow key={concept.slug} concept={concept} index={index} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <ul className="mt-3 border border-line">
          {filtered.map((concept, index) => (
            <ConceptRow key={concept.slug} concept={concept} index={index} />
          ))}
        </ul>
      )}

      {!grouped && category !== "all" ? (
        <p className="mono-label mt-6 text-muted">
          CATEGORY / {getCategory(category)?.nameEn ?? category}
        </p>
      ) : null}
    </div>
  );
}
