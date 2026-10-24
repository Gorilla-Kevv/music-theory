import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Search, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BIBLIOGRAPHY_BY_ID,
  BOOK_BY_ID,
  BOOK_STATS,
  CHAPTER_BY_ID,
  CONCEPT_BY_SLUG,
  HARMONY_DIMENSIONS,
  searchSourceNotes,
} from "../content";
import type { HarmonyDimension, SourceId } from "../content/types";
import { useSearch } from "../components/SearchDialog";

const BOOK_TABS: SourceId[] = ["levine", "laitz", "sposobin"];

const BOOK_FIELD: Record<SourceId, string> = {
  levine: "bg-cadmium text-ink",
  laitz: "bg-cobalt text-paper",
  sposobin: "bg-acid text-ink",
  soundquest: "bg-ink text-acid",
};

const BOOK_SHORT: Record<SourceId, string> = {
  levine: "Jazz Theory",
  laitz: "Complete Musician",
  sposobin: "Harmony",
  soundquest: "SoundQuest",
};

export function Books() {
  const [params, setParams] = useSearchParams();
  const { openSearch } = useSearch();
  const book = (params.get("book") as SourceId | null) ?? "levine";
  const dimension = (params.get("dimension") as HarmonyDimension | null) ?? null;
  const [query, setQuery] = useState(params.get("q") ?? "");

  const chapters = useMemo(
    () =>
      searchSourceNotes(query, {
        book,
        ...(dimension ? { dimension } : {}),
        onlyExpanded: false,
      }),
    [book, dimension, query],
  );

  const requestedChapter = params.get("chapter");
  const requested = requestedChapter ? CHAPTER_BY_ID[requestedChapter] : undefined;
  const selected =
    requested && requested.book === book && chapters.some((chapter) => chapter.id === requested.id)
      ? requested
      : chapters.find((chapter) => chapter.expanded) ?? chapters[0];

  const outline = BOOK_BY_ID[book];
  const bibliography = BIBLIOGRAPHY_BY_ID[book];

  const updateParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next, { replace: true });
  };

  const selectBook = (nextBook: SourceId) => {
    updateParams({ book: nextBook, chapter: null });
  };

  const selectDimension = (nextDimension: HarmonyDimension | null) => {
    updateParams({ dimension: nextDimension, chapter: null });
  };

  const selectChapter = (chapterId: string) => {
    updateParams({ chapter: chapterId });
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    updateParams({ q: value || null });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 sm:px-8 sm:pt-8 xl:px-12">
      <div className="border-b border-line pb-5">
        <p className="mono-label text-muted">SOURCE LIBRARY / 书库</p>
        <h1 className="zh-display mt-2 text-4xl sm:text-5xl">三本书的章目与和声笔记</h1>
        <p className="reading-column mt-3 max-w-[68ch] text-sm leading-relaxed text-muted">
          这里不是教材正文的电子复制，而是三本书的完整章目、原创章节笔记与知识库概念映射。每一条笔记都标出和声维度与对应概念，供人和 Agent 共同检索。
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <span className="mono-label text-muted">{BOOK_STATS.chapters} CHAPTERS</span>
          <span className="mono-label text-muted">{BOOK_STATS.notes} SOURCE NOTES</span>
          <span className="mono-label text-muted">3 BOOKS</span>
          <span className="mono-label text-cobalt-ink">NO FULL-TEXT COPY</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {BOOK_TABS.map((bookId) => {
          const meta = BIBLIOGRAPHY_BY_ID[bookId];
          const active = bookId === book;
          return (
            <button
              key={bookId}
              type="button"
              onClick={() => selectBook(bookId)}
              className={`border p-3 text-left transition-colors ${
                active ? `border-ink ${BOOK_FIELD[bookId]}` : "border-line hover:border-ink/50"
              }`}
            >
              <span className="mono-label">{BOOK_SHORT[bookId]}</span>
              <span className="mt-1 block text-sm font-semibold">{meta.title}</span>
              <span className={`mono-label mt-1 block ${active ? "" : "text-muted"}`}>
                {BOOK_STATS.byBook[bookId].chapters} 章 · {BOOK_STATS.byBook[bookId].notes} 笔记
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 border border-ink/40 px-3 py-2 focus-within:border-cobalt">
          <Search size={15} className="shrink-0 text-cobalt-ink" aria-hidden />
          <input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="在章目与章节笔记中检索：转调、模进、色彩…"
            aria-label="书库检索"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
          {query ? (
            <button type="button" onClick={() => updateQuery("")} aria-label="清除书库检索" className="text-muted hover:text-ink">
              <X size={14} />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={openSearch}
          className="mono-label border border-ink/40 px-2.5 py-2 text-muted transition-colors hover:bg-ink hover:text-paper"
        >
          全局检索 ⌘K
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mono-label mr-1 text-muted">HARMONY DIMENSION</span>
        <button
          type="button"
          onClick={() => selectDimension(null)}
          className={`mono-label border px-2.5 py-1.5 ${
            dimension === null ? "border-ink bg-ink text-paper" : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
          }`}
        >
          全部
        </button>
        {HARMONY_DIMENSIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectDimension(item.id)}
            title={item.description}
            className={`mono-label border px-2.5 py-1.5 ${
              dimension === item.id ? "border-ink bg-ink text-paper" : "border-ink/45 text-muted hover:border-ink/70 hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-6">
          <div className="hidden border border-line lg:block">
            <div className="flex items-center justify-between border-b border-line bg-paper-2 px-3 py-2.5">
              <span className="mono-label text-muted">
                {outline.chapters.length.toString().padStart(2, "0")} CHAPTERS
              </span>
              <span className="mono-label text-muted">FILTERED {chapters.length}</span>
            </div>
            <div className="lg:max-h-[calc(100vh-290px)] lg:overflow-y-auto">
              {chapters.length === 0 ? (
                <p className="px-3 py-6 text-sm text-muted">没有匹配章节。</p>
              ) : (
                <ul>
                  {chapters.map((chapter) => {
                    const active = selected?.id === chapter.id;
                    return (
                      <li key={chapter.id} className="border-b border-line last:border-b-0">
                        <button
                          type="button"
                          onClick={() => selectChapter(chapter.id)}
                          className={`flex w-full items-start gap-2 px-3 py-2.5 text-left transition-colors ${
                            active ? "bg-ink text-paper" : "hover:bg-paper-2"
                          }`}
                        >
                          <span className={`mono-label mt-0.5 w-7 shrink-0 ${active ? "text-acid" : "text-muted"}`}>
                            {chapter.number}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-medium leading-snug">
                              {chapter.titleZh ?? chapter.title}
                            </span>
                            <span className={`mono-label mt-0.5 block truncate text-[0.58rem] ${active ? "text-paper/65" : "text-muted"}`}>
                              {chapter.title}
                            </span>
                          </span>
                          {chapter.expanded ? (
                            <span className={`mt-1 h-1.5 w-1.5 shrink-0 ${active ? "bg-acid" : "bg-cobalt"}`} aria-label="已展开笔记" />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="border-t border-line px-3 py-2">
              <span className="mono-label text-muted">蓝点 = 已展开原创笔记</span>
            </div>
          </div>

          <div className="mt-3 lg:hidden">
            <label htmlFor="chapter-select" className="mono-label text-muted">
              JUMP TO CHAPTER
            </label>
            <select
              id="chapter-select"
              value={selected?.id ?? ""}
              onChange={(event) => selectChapter(event.target.value)}
              className="mt-1 w-full border border-ink/40 bg-paper px-2 py-2 text-sm"
            >
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.number} · {chapter.titleZh ?? chapter.title}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <section className="min-w-0 border border-line">
          {selected ? (
            <>
              <div className={`border-b border-line p-4 sm:p-5 ${BOOK_FIELD[book]}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mono-label">{bibliography.title}</span>
                  <span className="mono-label">/ {selected.number}</span>
                  {selected.part ? <span className="mono-label">/ {selected.part}</span> : null}
                </div>
                <h2 className="zh-display mt-3 text-2xl sm:text-3xl">
                  {selected.titleZh ?? selected.title}
                </h2>
                <p className="display mt-1 text-lg">{selected.title}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.dimensions?.map((dim) => {
                    const meta = HARMONY_DIMENSIONS.find((item) => item.id === dim);
                    return (
                      <span key={dim} className="mono-label text-current opacity-75">
                        {meta?.labelEn ?? dim}
                      </span>
                    );
                  })}
                </div>
                {(() => {
                  const book = BOOK_BY_ID[selected.book];
                  if (!book?.sourceBook) return null;
                  const href = selected.sourceFile
                    ? `/books/${selected.sourceFile}`
                    : book.sourceBook.kind === "pdf" && selected.pdfPage
                      ? `/books/${book.sourceBook.file}#page=${selected.pdfPage}`
                      : null;
                  if (!href) return null;
                  const label = selected.sourceFile
                    ? "打开原书本章（内嵌 EPUB）"
                    : `打开原书 PDF 第 ${selected.pdfPage} 页`;
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="mono-label mt-3 inline-flex items-center gap-1.5 border border-current/70 px-2 py-1 text-cobalt-ink hover:bg-cobalt hover:text-paper"
                    >
                      {label} ↗
                    </a>
                  );
                })()}
              </div>

              {selected.expanded ? (
                <div className="p-4 sm:p-5">
                  <p className="mono-label text-cobalt-ink">ORIGINAL READING NOTE / 原创笔记</p>
                  <p className="reading-column mt-2 text-base leading-relaxed">{selected.summary}</p>

                  <div className="mt-5 border-t border-line pt-4">
                    <p className="mono-label text-muted">KEY POINTS / 关键点</p>
                    <ul className="mt-2 space-y-2">
                      {selected.keyPoints?.map((point) => (
                        <li key={point} className="flex gap-2 text-sm leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-cobalt" aria-hidden />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selected.deepSummary ? (
                    <div className="mt-5 border-t border-line pt-4">
                      <p className="mono-label text-cobalt-ink">DEEPEN / 深入归纳</p>
                      <p className="reading-column mt-2 text-sm leading-relaxed">{selected.deepSummary}</p>
                      {selected.analysis?.length ? (
                        <ul className="mt-3 space-y-2">
                          {selected.analysis.map((item) => (
                            <li key={item} className="flex gap-2 text-sm leading-relaxed">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-cobalt" aria-hidden />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}

                  {selected.crossBook?.length ? (
                    <div className="mt-5 border-t border-line pt-4">
                      <p className="mono-label text-muted">CROSS-BOOK / 跨书对应</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selected.crossBook.map((item) => (
                          <span key={item} className="bg-ink/5 px-2 py-1 text-xs text-muted">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selected.visualHint ? (
                    <div className="mt-5 border-t border-line pt-4">
                      <p className="mono-label text-muted">VISUAL / 可视化映射</p>
                      <p className="mt-1 text-sm">{selected.visualHint}</p>
                    </div>
                  ) : null}

                  {selected.confusions?.length ? (
                    <div className="mt-5 border-t border-line pt-4">
                      <p className="mono-label text-muted">COMMON CONFUSIONS / 常见误解</p>
                      <dl className="mt-2 space-y-3">
                        {selected.confusions.map((item) => (
                          <div key={item.question}>
                            <dt className="text-sm font-medium">Q：{item.question}</dt>
                            <dd className="mt-1 text-sm leading-relaxed text-muted">A：{item.answer}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ) : null}

                  <div className="mt-5 border-t border-line pt-4">
                    <p className="mono-label text-muted">MAPPED CONCEPTS / 对应概念</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selected.concepts?.length ? (
                        selected.concepts.map((slug) => {
                          const concept = CONCEPT_BY_SLUG[slug];
                          if (!concept) return null;
                          return (
                            <Link
                              key={slug}
                              to={`/theory/${slug}`}
                              className="border border-ink/40 px-2 py-1 text-xs transition-colors hover:bg-ink hover:text-paper"
                            >
                              {concept.number} {concept.title}
                            </Link>
                          );
                        })
                      ) : (
                        <span className="text-xs text-muted">本章尚未映射到概念。</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-line pt-4">
                    <p className="mono-label text-muted">CITATION / 章节定位</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {bibliography.authors}. <span className="italic">{bibliography.title}</span>.{" "}
                      {bibliography.publisher}, {bibliography.year}. {selected.part ? `${selected.part}, ` : ""}
                      {selected.number} {selected.title}.
                      {selected.pdfPage ? `（内嵌 PDF 第 ${selected.pdfPage} 页）` : ""}
                    </p>
                    <Link
                      to={`/references#${book}`}
                      className="mono-label mt-2 inline-flex items-center gap-1.5 text-cobalt-ink hover:text-ink"
                    >
                      查看书目与版次
                      <ArrowUpRight size={12} aria-hidden />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6">
                  <p className="mono-label text-muted">OUTLINE ONLY / 仅目录</p>
                  <p className="reading-column mt-2 text-sm leading-relaxed text-muted">
                    本章已收入完整章目与章节定位；笔记待逐章深化。你仍可用搜索定位概念、直接打开原书对应章节，或到参考文献页查看书目。
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuery(selected.titleZh ?? selected.title)}
                      className="mono-label border border-ink/40 px-3 py-2 hover:bg-ink hover:text-paper"
                    >
                      检索本章标题
                    </button>
                    <Link
                      to={`/references#${book}`}
                      className="mono-label border border-ink/40 px-3 py-2 transition-colors hover:bg-ink hover:text-paper"
                    >
                      查看书目
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-[260px] items-center justify-center p-6 text-sm text-muted">
              选择左侧章节查看笔记。
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="reading-column text-xs leading-relaxed text-muted">
          书库只包含原创改写、章节级定位与概念映射，不包含教材正文。需要精确原文时请查阅手头版本；若你拥有合法电子版，可在本地阅读器中使用本页的章目定位。
        </p>
        <Link to="/references" className="mono-label inline-flex items-center gap-1 text-cobalt-ink hover:text-ink">
          <BookOpen size={13} aria-hidden />
          参考文献
        </Link>
      </div>
    </div>
  );
}
