import { ArrowUpRight, BookOpen, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BIBLIOGRAPHY,
  BILIBILI_COLLECTIONS,
  BILIBILI_READ_COUNT,
  BILIBILI_VIDEOS,
  CITATION_STYLE_NOTE,
  CONCEPTS,
  CONCEPT_BY_SLUG,
  collectCitations,
} from "../content";
import type { BibliographyEntry, Concept, SourceId } from "../content/types";

const SOURCE_FIELD: Record<SourceId, string> = {
  levine: "bg-cadmium text-ink",
  laitz: "bg-cobalt text-paper",
  sposobin: "bg-acid text-ink",
  soundquest: "bg-ink text-acid",
};

const SOURCE_NOTE: Record<SourceId, string> = {
  levine: "爵士语言",
  laitz: "调性理论",
  sposobin: "功能和声",
  soundquest: "站点扩展",
};

interface LocatorUsage {
  locator: string;
  concepts: Concept[];
}

function usageFor(entry: BibliographyEntry): LocatorUsage[] {
  const map = new Map<string, LocatorUsage>();
  for (const concept of CONCEPTS) {
    for (const { ref } of collectCitations(concept)) {
      if (ref.source !== entry.id) continue;
      const existing = map.get(ref.locator);
      if (existing) {
        if (!existing.concepts.some((item) => item.slug === concept.slug)) {
          existing.concepts.push(concept);
        }
      } else {
        map.set(ref.locator, { locator: ref.locator, concepts: [concept] });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.locator.localeCompare(b.locator));
}

export function References() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 sm:px-8 sm:pt-8 xl:px-12">
      <div className="border-b border-line pb-5">
        <p className="mono-label text-muted">SOURCES / 参考文献</p>
        <h1 className="zh-display mt-2 text-4xl sm:text-5xl">三本书，三条理论线</h1>
        <p className="reading-column mt-3 max-w-[64ch] text-sm leading-relaxed text-muted">
          本知识库不是教材的摘要，而是以三本著作为依据的原创改写。每条正文断言至少对应一处章节级来源；页码因版次与译本而异，因此不写入。
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            to="/books"
            className="mono-label inline-flex items-center gap-1.5 border border-ink/50 px-3 py-2 hover:bg-ink hover:text-paper"
          >
            打开书库 / 章节笔记
            <ArrowUpRight size={12} aria-hidden />
          </Link>
          <a
            href="#video-research"
            className="mono-label inline-flex items-center gap-1.5 border border-ink/30 px-3 py-2 text-muted hover:border-ink hover:text-ink"
          >
            B站调研台账
            <ArrowUpRight size={12} aria-hidden />
          </a>
        </div>
      </div>

      <aside className="mt-5 border border-ink bg-paper-2 p-4">
        <p className="mono-label text-cobalt-ink">CITATION POLICY / 引用体例</p>
        <p className="reading-column mt-2 text-sm leading-relaxed">{CITATION_STYLE_NOTE}</p>
      </aside>

      <div className="mt-6 space-y-5">
        {BIBLIOGRAPHY.map((entry) => {
          const usage = usageFor(entry);
          return (
            <section key={entry.id} id={entry.id} className="scroll-mt-24 border border-line">
              <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className={`flex flex-col justify-between p-5 ${SOURCE_FIELD[entry.id]}`}>
                  <div>
                    <p className="mono-label">SOURCE / {entry.id.toUpperCase()}</p>
                    <p className="display mt-3 text-5xl leading-none">
                      {entry.id === "levine" ? "Jazz" : entry.id === "laitz" ? "CM" : "Harmony"}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed">{SOURCE_NOTE[entry.id]}</p>
                  </div>
                  <p className="mono-label mt-8">{entry.edition}</p>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold leading-snug">{entry.title}</h2>
                      {entry.originalTitle ? (
                        <p className="mt-1 text-sm text-muted">{entry.originalTitle}</p>
                      ) : null}
                      <p className="mt-2 text-sm">{entry.authors}</p>
                    </div>
                    <span className="mono-label border border-ink/20 px-2 py-1 text-muted">
                      {usage.length} LOCATORS USED
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-line pt-3 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="mono-label text-muted">PUBLISHER / YEAR</dt>
                      <dd className="mt-0.5">
                        {entry.publisher}，{entry.year}
                      </dd>
                    </div>
                    <div>
                      <dt className="mono-label text-muted">EDITION</dt>
                      <dd className="mt-0.5">{entry.edition}</dd>
                    </div>
                    <div>
                      <dt className="mono-label text-muted">ISBN</dt>
                      <dd className="mt-0.5">{entry.isbn ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="mono-label text-muted">LANGUAGE</dt>
                      <dd className="mt-0.5">{entry.language}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 border-t border-line pt-3">
                    <p className="mono-label text-muted">ROLE IN THIS LIBRARY</p>
                    <p className="mt-1 text-sm leading-relaxed">{entry.role}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{entry.locatorNote}</p>
                    <p className="mono-label mt-2 text-muted">VERIFIED VIA / {entry.verifiedVia}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-line">
                <div className="flex items-center gap-2 px-5 py-3">
                  <BookOpen size={14} className="text-cobalt-ink" aria-hidden />
                  <p className="mono-label text-muted">LOCATOR MAP / 本库使用的章节定位</p>
                </div>
                <ul className="border-t border-line">
                  {usage.map((item) => (
                    <li
                      key={item.locator}
                      className="grid grid-cols-1 gap-2 border-b border-line px-5 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
                    >
                      <p className="text-xs leading-relaxed sm:text-sm">{item.locator}</p>
                      <div className="flex flex-wrap gap-1.5 sm:justify-end">
                        {item.concepts.map((concept) => (
                          <Link
                            key={concept.slug}
                            to={`/theory/${concept.slug}`}
                            className="mono-label border border-ink/15 px-1.5 py-0.5 text-muted hover:border-cobalt hover:text-cobalt-ink"
                          >
                            {concept.number} {concept.title}
                          </Link>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      <section id="video-research" className="mt-8 scroll-mt-24 border border-line">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
          <div>
            <p className="mono-label text-cobalt-ink">VIDEO RESEARCH / B站课程调研台账</p>
            <h2 className="zh-display mt-2 text-2xl sm:text-3xl">已经读过的视频，不重复搜</h2>
            <p className="reading-column mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">
              这里按合集与板块记录已读取或已编目的课程视频与专栏文章，供 Agent 判断是否需要重复检索。视频与文章只用于发现主题与组织顺序，不作为本库的理论依据；台账不保存字幕、转写或正文，已读条目注明依据（字幕 / 转写 / 关键帧 / 图文）。
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="mono-label text-muted">{BILIBILI_VIDEOS.length} VIDEOS</span>
            <span className="mono-label text-muted">{BILIBILI_VIDEOS.length - BILIBILI_READ_COUNT} CATALOGUED</span>
            <span className="mono-label text-cadmium-ink">{BILIBILI_READ_COUNT} READ</span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BILIBILI_COLLECTIONS.map((collection) => {
              const items = BILIBILI_VIDEOS.filter((video) => video.collection === collection.id);
              const reads = items.filter((video) => video.status === "read").length;
              return (
                <div key={collection.id} className="border border-line p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="mono-label text-ink">{collection.title}</p>
                    <a
                      href={collection.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mono-label inline-flex items-center gap-1 text-cobalt-ink hover:text-ink"
                    >
                      {collection.seasonId ? `SEASON ${collection.seasonId}` : "主页"}
                      <ExternalLink size={11} aria-hidden />
                    </a>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">
                    {collection.section} · {items.length} 条已登记 / {reads} 已读 · UP：{collection.author}
                  </p>
                </div>
              );
            })}
          </div>

          <ul className="mt-4 space-y-3">
            {BILIBILI_VIDEOS.filter((video) => video.status === "read").map((video) => {
              const collection = BILIBILI_COLLECTIONS.find((item) => item.id === video.collection);
              return (
              <li key={video.bvid} className="border border-line p-3 sm:p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mono-label bg-cadmium px-2 py-1 text-ink">{video.episode || "READ"}</span>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 flex-1 text-sm font-medium hover:text-cobalt-ink"
                  >
                    {video.title}
                  </a>
                  <span className="mono-label w-full text-muted sm:w-auto">{video.bvid}</span>
                </div>
                {video.takeaway ? (
                  <p className="reading-column mt-2 text-sm leading-relaxed text-muted">{video.takeaway}</p>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {collection ? (
                    <span className="mono-label border border-ink/30 px-1.5 py-0.5 text-muted">
                      {collection.section} / {collection.id}
                    </span>
                  ) : null}
                  {video.kind === "article" ? (
                    <span className="mono-label bg-cobalt px-1.5 py-0.5 text-paper">专栏 ARTICLE</span>
                  ) : null}
                  {video.via ? (
                    <span className="mono-label border border-ink/15 px-1.5 py-0.5 text-muted">
                      VIA {video.via.toUpperCase()}
                    </span>
                  ) : null}
                  {video.themes.map((theme) => (
                    <span key={theme} className="border border-ink/15 px-1.5 py-0.5 text-[0.68rem] text-muted">
                      {theme}
                    </span>
                  ))}
                  {video.usedIn?.map((slug) => {
                    const concept = CONCEPT_BY_SLUG[slug];
                    return concept ? (
                      <Link
                        key={slug}
                        to={`/theory/${slug}`}
                        className="mono-label border border-cobalt/40 px-1.5 py-0.5 text-cobalt-ink hover:bg-cobalt hover:text-paper"
                      >
                        {concept.number}
                      </Link>
                    ) : null;
                  })}
                </div>
              </li>
              );
            })}
          </ul>

          <details className="mt-4 border-t border-line pt-4">
            <summary className="mono-label cursor-pointer text-muted">
              CATALOGUED / 已编目 {BILIBILI_VIDEOS.length - BILIBILI_READ_COUNT} 条 · 展开查看
            </summary>
            {BILIBILI_COLLECTIONS.map((collection) => {
              const items = BILIBILI_VIDEOS.filter(
                (video) => video.status === "catalogued" && video.collection === collection.id,
              );
              if (items.length === 0) return null;
              return (
                <div key={collection.id} className="mt-4">
                  <p className="mono-label text-muted">
                    {collection.title} · {items.length} 条
                  </p>
                  <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {items.map((video) => (
                      <li key={video.bvid} className="flex items-baseline gap-2 border-b border-line/60 py-1.5 text-xs">
                        <span className="mono-label w-9 shrink-0 text-muted">{video.episode || "—"}</span>
                        <a href={video.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate hover:text-cobalt-ink">
                          {video.title}
                        </a>
                        <span className="mono-label shrink-0 text-muted">{video.bvid}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </details>
        </div>
      </section>

      <div className="mt-8 border-t border-line pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="reading-column text-xs leading-relaxed text-muted">
            外部核对来源：Oxford University Press 官方目录、图书馆书目记录所载中译本与第 3 版目录。书目页仅用于核对版次与章名，不替代原著阅读。钢琴采样：Salamander Grand Piano V3，Alexander Holm，CC BY 3.0；本地文件见 <span className="font-mono">public/audio/salamander/LICENSE.txt</span>。
          </p>
          <a
            href="https://global.oup.com/ushe/product/the-complete-musician-9780190924508"
            target="_blank"
            rel="noreferrer"
            className="mono-label inline-flex items-center gap-1.5 text-cobalt-ink hover:text-ink"
          >
            OUP 书目
            <ExternalLink size={12} aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
